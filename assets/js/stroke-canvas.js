// Right sidebar: Multi-character Hanzi Writer stroke-order canvas with side-by-side grids,
// directional stroke arrows & numbers overlay, step-by-step stroke breakdown, and sequential quiz mode.
let currentStrokeWord = null;
let currentStrokeChars = [];
let strokeWriters = [];
let strokeCharDataMap = {};
const globalCharDataCache = {};
let lastRenderedTheme = document.documentElement.dataset.theme || '';
let activeCharIndex = 0;
let activeHighlightStrokeIdx = null;
let isAnimatingSequential = false;
let animationStepTimer = null;
let showStrokeGuides = localStorage.getItem('hsk_show_stroke_guides') !== 'false';

function extractHanziCharacters(text) {
  if (!text || typeof text !== 'string') return [];
  const chars = Array.from(text).filter(ch => /\p{Script=Han}/u.test(ch));
  if (chars.length > 0) return chars;
  return Array.from(text).filter(ch => ch.trim().length > 0 && !/[\s\p{P}]/u.test(ch));
}

function getStrokeColors() {
  const isDark = document.documentElement.dataset.theme === 'dark' ||
    (!document.documentElement.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  return {
    isDark,
    strokeColor: isDark ? '#f3f4f6' : '#27272a',
    radicalColor: isDark ? '#fb923c' : '#ea580c',
    outlineColor: isDark ? '#343746' : '#e4e4e7',
    completedStroke: isDark ? '#94a3b8' : '#71717a',
    activeStroke: isDark ? '#fb923c' : '#ea580c',
    arrowColor: isDark ? '#38bdf8' : '#0284c7',
    activeArrowColor: isDark ? '#fde047' : '#d97706',
  };
}

function getGridBoxSize(totalChars) {
  const container = document.getElementById('strokeGridsContainer');
  const panel = document.getElementById('strokeCanvasWrap');
  const rawWidth = (container && container.clientWidth > 120)
    ? container.clientWidth
    : ((panel && panel.clientWidth > 140) ? panel.clientWidth - 28 : 340);

  if (totalChars <= 1) {
    return Math.min(188, Math.max(136, Math.floor(rawWidth * 0.62)));
  }
  if (totalChars === 2) {
    return Math.min(162, Math.max(112, Math.floor((rawWidth - 16) / 2)));
  }
  if (totalChars === 3) {
    return Math.min(108, Math.max(82, Math.floor((rawWidth - 20) / 3)));
  }
  return Math.min(148, Math.max(100, Math.floor((rawWidth - 16) / 2)));
}

// Classify basic Chinese stroke type from its 1024-space median points
function classifyStrokeType(median) {
  if (!Array.isArray(median) || median.length < 2) {
    return { symbol: '一', name: 'Nét cơ bản' };
  }
  // Convert to screen-like coords (x right, y down)
  const pts = median.map(([x, y]) => [x, 900 - y]);
  let totalLen = 0;
  const segs = [];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0];
    const dy = pts[i][1] - pts[i - 1][1];
    const len = Math.hypot(dx, dy);
    if (len > 2) {
      segs.push({ dx, dy, len, angle: Math.atan2(dy, dx) * 180 / Math.PI });
      totalLen += len;
    }
  }
  if (segs.length === 0) return { symbol: '丶', name: 'Chấm' };

  const start = pts[0];
  const end = pts[pts.length - 1];
  const overallDx = end[0] - start[0];
  const overallDy = end[1] - start[1];
  const directDist = Math.hypot(overallDx, overallDy);
  const overallAngle = Math.atan2(overallDy, overallDx) * 180 / Math.PI;

  // Detect sharp turn / compound stroke (Zhe / Gou)
  let maxTurn = 0;
  let firstMajorAngle = segs[0].angle;
  let accum = 0;
  for (let i = 0; i < segs.length; i++) {
    accum += segs[i].len;
    if (accum >= totalLen * 0.25) {
      firstMajorAngle = Math.atan2(
        pts[Math.min(pts.length - 1, i + 1)][1] - start[1],
        pts[Math.min(pts.length - 1, i + 1)][0] - start[0]
      ) * 180 / Math.PI;
      break;
    }
  }
  const lastMajorAngle = Math.atan2(
    end[1] - pts[Math.max(0, pts.length - 2)][1],
    end[0] - pts[Math.max(0, pts.length - 2)][0]
  ) * 180 / Math.PI;

  let diffAngle = Math.abs(lastMajorAngle - firstMajorAngle);
  if (diffAngle > 180) diffAngle = 360 - diffAngle;
  maxTurn = diffAngle;

  const isBent = (totalLen > directDist * 1.24 && totalLen > 180) || (maxTurn >= 52 && totalLen > 170);
  if (isBent) {
    if (firstMajorAngle >= -28 && firstMajorAngle <= 32) {
      return { symbol: '𠃍', name: 'Ngang gập' };
    }
    if (firstMajorAngle >= 60 && firstMajorAngle <= 115) {
      if (lastMajorAngle < -30 || (overallDx < -20 && lastMajorAngle > 120)) {
        return { symbol: '亅', name: 'Sổ móc' };
      }
      return { symbol: '∟', name: 'Sổ gập' };
    }
    if (firstMajorAngle > 115) {
      return { symbol: 'ㄑ', name: 'Phiệt gập' };
    }
    return { symbol: '𠃍', name: 'Nét gập' };
  }

  // Short diagonal stroke -> Dian (Chấm)
  if (totalLen < 210 && overallAngle > 12 && overallAngle < 88) {
    return { symbol: '丶', name: 'Chấm' };
  }
  // Horizontal (Heng)
  if (overallAngle >= -22 && overallAngle <= 22) {
    return { symbol: '一', name: 'Ngang' };
  }
  // Vertical (Shu)
  if (overallAngle >= 78 && overallAngle <= 98) {
    return { symbol: '丨', name: 'Sổ' };
  }
  // Rising up-right (Ti)
  if (overallAngle < -22 && overallAngle >= -78 && overallDx > 0) {
    return { symbol: '㇀', name: 'Hất' };
  }
  // Down-left (Pie)
  if (overallAngle > 98 || overallAngle < -135) {
    return { symbol: '丿', name: 'Phiệt' };
  }
  // Down-right (Na or Dian)
  if (overallAngle > 22 && overallAngle < 78) {
    return totalLen < 230
      ? { symbol: '丶', name: 'Chấm' }
      : { symbol: '㇏', name: 'Mác' };
  }
  return { symbol: '一', name: 'Nét vẽ' };
}

// Compute trimmed polyline and arrowhead polygon in target SVG pixel space
function computeMedianArrowGeometry(median, boxSize, padding, options = {}) {
  if (!Array.isArray(median) || median.length < 2) return null;
  const scale = (boxSize - 2 * padding) / 1024;
  const pts = median.map(([mx, my]) => [
    padding + mx * scale,
    padding + (900 - my) * scale
  ]);

  // Compute cumulative lengths
  const cumLen = [0];
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    cumLen.push(cumLen[i - 1] + d);
  }
  const totalLen = cumLen[cumLen.length - 1];
  if (totalLen < 3) return null;

  const isMini = Boolean(options.isMini);
  const startTrim = isMini
    ? Math.min(totalLen * 0.15, 4)
    : Math.min(totalLen * 0.22, 11);
  const endTrim = isMini
    ? Math.min(totalLen * 0.12, 3.5)
    : Math.min(totalLen * 0.14, 6);

  function pointAtLength(targetL) {
    const clamped = Math.max(0, Math.min(totalLen, targetL));
    for (let i = 1; i < pts.length; i++) {
      if (cumLen[i] >= clamped) {
        const segLen = cumLen[i] - cumLen[i - 1];
        const t = segLen > 0.001 ? (clamped - cumLen[i - 1]) / segLen : 0;
        return [
          pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t,
          pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t
        ];
      }
    }
    return pts[pts.length - 1];
  }

  // Initial tangent direction at stroke start (for smart badge placement)
  const startLookahead = pointAtLength(Math.min(totalLen * 0.35, 16));
  let startUx = startLookahead[0] - pts[0][0];
  let startUy = startLookahead[1] - pts[0][1];
  const startNorm = Math.hypot(startUx, startUy) || 1;
  startUx /= startNorm;
  startUy /= startNorm;

  const dStart = startTrim;
  const dTip = Math.max(dStart + 2, totalLen - endTrim);
  const arrowLen = isMini
    ? Math.min(6.5, Math.max(4.2, totalLen * 0.34))
    : Math.min(9.5, Math.max(6.2, totalLen * 0.3));
  const arrowHalfWidth = arrowLen * 0.56;

  const tipPt = pointAtLength(dTip);
  const lookbackDist = Math.max(arrowLen * 1.15, isMini ? 5 : 9);
  const prevPt = pointAtLength(Math.max(0, dTip - lookbackDist));

  let ux = tipPt[0] - prevPt[0];
  let uy = tipPt[1] - prevPt[1];
  const uNorm = Math.hypot(ux, uy) || 1;
  ux /= uNorm;
  uy /= uNorm;

  const dLineEnd = Math.max(dStart + 1, dTip - arrowLen * 0.72);

  // Sample points between dStart and dLineEnd
  const linePts = [pointAtLength(dStart)];
  for (let i = 1; i < pts.length - 1; i++) {
    if (cumLen[i] > dStart && cumLen[i] < dLineEnd) {
      linePts.push(pts[i]);
    }
  }
  linePts.push(pointAtLength(dLineEnd));

  const baseX = tipPt[0] - ux * arrowLen;
  const baseY = tipPt[1] - uy * arrowLen;
  const leftX = baseX - uy * arrowHalfWidth;
  const leftY = baseY + ux * arrowHalfWidth;
  const rightX = baseX + uy * arrowHalfWidth;
  const rightY = baseY - ux * arrowHalfWidth;

  const polylineStr = linePts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const arrowPolyStr = `${tipPt[0].toFixed(1)},${tipPt[1].toFixed(1)} ${leftX.toFixed(1)},${leftY.toFixed(1)} ${rightX.toFixed(1)},${rightY.toFixed(1)}`;

  return {
    startPt: pts[0],
    lineStartPt: linePts[0],
    tipPt,
    polylineStr,
    arrowPolyStr,
    startUx,
    startUy,
    ux,
    uy,
    totalLen
  };
}

// Render stroke order numbers and directional arrows overlay on a character grid
function renderCharGuideOverlay(charIdx, highlightStrokeIdx = null) {
  const target = document.getElementById(`strokeCanvasTarget_${charIdx}`);
  if (!target) return;

  const existing = target.querySelector('.stroke-guide-overlay');
  if (existing) existing.remove();

  const charData = strokeCharDataMap[charIdx];
  if (!charData || !Array.isArray(charData.medians) || charData.medians.length === 0) return;

  if (!showStrokeGuides && highlightStrokeIdx === null) return;

  const totalChars = currentStrokeChars.length;
  const boxSize = parseInt(target.parentElement?.parentElement?.style.getPropertyValue('--grid-box-size') || '0', 10) || getGridBoxSize(totalChars);
  const padding = Math.max(8, Math.round(boxSize * 0.07));
  const isCompactGrid = boxSize < 120;
  const badgeRadius = isCompactGrid ? 6.8 : 8.2;
  const fontSize = isCompactGrid ? 8.5 : 10;

  const placedBadges = [];
  let arrowsHtml = '';
  let badgesHtml = '';

  charData.medians.forEach((median, sIdx) => {
    const geom = computeMedianArrowGeometry(median, boxSize, padding, { isMini: false });
    if (!geom) return;

    const isHighlighted = highlightStrokeIdx === sIdx;
    const isDimmed = highlightStrokeIdx !== null && highlightStrokeIdx !== sIdx;
    const stateClass = isHighlighted ? 'is-highlighted' : (isDimmed ? 'is-dimmed' : '');

    // Directional path + arrowhead
    arrowsHtml += `
      <g class="stroke-guide-arrow-group ${stateClass}" data-stroke-index="${sIdx}">
        <polyline class="stroke-guide-line-halo" points="${geom.polylineStr}" />
        <polyline class="stroke-guide-line" points="${geom.polylineStr}" />
        <polygon class="stroke-guide-arrowhead" points="${geom.arrowPolyStr}" />
      </g>
    `;

    // Position badge near start point along its initial stroke direction to avoid corner collisions
    let bx = geom.startPt[0] + geom.startUx * 2.5;
    let by = geom.startPt[1] + geom.startUy * 2.5;
    const minSep = badgeRadius * 2.15;
    for (let attempt = 0; attempt < 4; attempt++) {
      const collision = placedBadges.find(p => Math.hypot(bx - p.x, by - p.y) < minSep);
      if (!collision) break;
      bx += geom.startUx * (badgeRadius * 1.85);
      by += geom.startUy * (badgeRadius * 1.85);
    }
    bx = Math.max(badgeRadius + 2, Math.min(boxSize - badgeRadius - 2, bx));
    by = Math.max(badgeRadius + 2, Math.min(boxSize - badgeRadius - 2, by));
    placedBadges.push({ x: bx, y: by });

    badgesHtml += `
      <g class="stroke-guide-badge-group ${stateClass}" data-stroke-index="${sIdx}">
        <circle class="stroke-guide-badge-circle" cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="${badgeRadius}" />
        <text class="stroke-guide-badge-text" x="${bx.toFixed(1)}" y="${by.toFixed(1)}" font-size="${fontSize}">${sIdx + 1}</text>
      </g>
    `;
  });

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'stroke-guide-overlay');
  svg.setAttribute('viewBox', `0 0 ${boxSize} ${boxSize}`);
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = `${arrowsHtml}${badgesHtml}`;
  target.appendChild(svg);
}

// Render step-by-step stroke breakdown strip for the active character
function renderStrokeOrderSteps(charIndex = activeCharIndex, highlightStrokeIdx = activeHighlightStrokeIdx) {
  const wrap = document.getElementById('strokeOrderStepsWrap');
  if (!wrap) return;

  if (!currentStrokeChars || currentStrokeChars.length === 0) {
    wrap.hidden = true;
    wrap.innerHTML = '';
    return;
  }

  const safeCharIdx = Math.max(0, Math.min(currentStrokeChars.length - 1, charIndex));
  const ch = currentStrokeChars[safeCharIdx];
  const charData = strokeCharDataMap[safeCharIdx];

  if (!charData || !Array.isArray(charData.strokes) || charData.strokes.length === 0) {
    wrap.hidden = false;
    wrap.innerHTML = `
      <div class="stroke-steps-header">
        <div class="stroke-steps-title-group">
          <span class="stroke-steps-title">Thứ tự từng nét vẽ</span>
        </div>
      </div>
      <div class="stroke-steps-loading">Đang tải thứ tự nét chữ "${ch}"…</div>
    `;
    return;
  }

  const totalStrokes = charData.strokes.length;
  const miniSize = 64;
  const miniPad = 5;
  const miniScale = (miniSize - 2 * miniPad) / 1024;
  const transformAttr = `translate(${miniPad.toFixed(2)}, ${(miniPad + 900 * miniScale).toFixed(2)}) scale(${miniScale.toFixed(5)}, ${(-miniScale).toFixed(5)})`;

  // Character switcher tabs if multi-char word
  let charTabsHtml = '';
  if (currentStrokeChars.length > 1) {
    charTabsHtml = `
      <div class="stroke-steps-char-tabs" role="tablist" aria-label="Chọn chữ Hán xem chi tiết nét">
        ${currentStrokeChars.map((c, idx) => {
          const cData = strokeCharDataMap[idx];
          const count = cData && Array.isArray(cData.strokes) ? `${cData.strokes.length} nét` : '';
          return `
            <button type="button" class="stroke-steps-char-tab${idx === safeCharIdx ? ' active' : ''}" data-step-char-idx="${idx}">
              <span class="step-tab-num">${idx + 1}.</span>
              <span class="step-tab-hanzi">${c}</span>
              ${count ? `<span class="step-tab-count">${count}</span>` : ''}
            </button>
          `;
        }).join('')}
      </div>
    `;
  } else {
    charTabsHtml = `<span class="stroke-steps-count-pill">${totalStrokes} nét</span>`;
  }

  const stepsCardsHtml = charData.strokes.map((strokePath, sIdx) => {
    const median = charData.medians ? charData.medians[sIdx] : null;
    const strokeInfo = classifyStrokeType(median);
    const arrowGeom = computeMedianArrowGeometry(median, miniSize, miniPad, { isMini: true });
    const isActiveStep = highlightStrokeIdx === sIdx;

    // Ghost outline of all strokes
    const bgPaths = charData.strokes.map(p => `<path class="mini-stroke-ghost" d="${p}" />`).join('');
    // Completed strokes before sIdx
    const donePaths = charData.strokes.slice(0, sIdx).map(p => `<path class="mini-stroke-done" d="${p}" />`).join('');
    // Current stroke sIdx
    const currPath = `<path class="mini-stroke-current" d="${strokePath}" />`;

    const arrowSvg = arrowGeom ? `
      <circle class="mini-stroke-start-dot" cx="${arrowGeom.startPt[0].toFixed(1)}" cy="${arrowGeom.startPt[1].toFixed(1)}" r="2.2" />
      <polyline class="mini-stroke-arrow-line" points="${arrowGeom.polylineStr}" />
      <polygon class="mini-stroke-arrow-head" points="${arrowGeom.arrowPolyStr}" />
    ` : '';

    return `
      <button type="button" class="stroke-step-card${isActiveStep ? ' is-active' : ''}" data-char-idx="${safeCharIdx}" data-stroke-idx="${sIdx}" title="Nét ${sIdx + 1}: ${strokeInfo.name} (${strokeInfo.symbol}) — Bấm để xem trên ô lớn">
        <div class="stroke-step-card-head">
          <span class="stroke-step-num">${sIdx + 1}</span>
          <span class="stroke-step-type">${strokeInfo.symbol} ${strokeInfo.name}</span>
        </div>
        <div class="stroke-step-mini-grid">
          <svg viewBox="0 0 ${miniSize} ${miniSize}" aria-hidden="true">
            <g transform="${transformAttr}">
              ${bgPaths}
              ${donePaths}
              ${currPath}
            </g>
            ${arrowSvg}
          </svg>
        </div>
      </button>
    `;
  }).join('');

  wrap.hidden = false;
  wrap.innerHTML = `
    <div class="stroke-steps-header">
      <div class="stroke-steps-title-group">
        <span class="stroke-steps-title">Thứ tự nét &amp; Hướng kéo bút</span>
        <span class="stroke-steps-subtitle">Chạm từng bước để soi nét &amp; mũi tên</span>
      </div>
      ${charTabsHtml}
    </div>
    <div class="stroke-steps-grid" id="strokeStepsGrid">
      ${stepsCardsHtml}
    </div>
  `;

  // Bind character switcher tabs inside steps header
  wrap.querySelectorAll('[data-step-char-idx]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-step-char-idx'), 10);
      if (!Number.isNaN(idx)) {
        setActiveCharacterFocus(idx, null);
      }
    });
  });

  // Bind step card click to highlight that exact stroke + arrow on the main grid
  wrap.querySelectorAll('.stroke-step-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const cIdx = parseInt(card.getAttribute('data-char-idx'), 10);
      const sIdx = parseInt(card.getAttribute('data-stroke-idx'), 10);
      if (!Number.isNaN(cIdx) && !Number.isNaN(sIdx)) {
        const nextStroke = (activeCharIndex === cIdx && activeHighlightStrokeIdx === sIdx) ? null : sIdx;
        setActiveCharacterFocus(cIdx, nextStroke);
      }
    });
  });
}

function setActiveCharacterFocus(charIdx, highlightStrokeIdx = null) {
  activeCharIndex = charIdx;
  activeHighlightStrokeIdx = highlightStrokeIdx;

  currentStrokeChars.forEach((c, idx) => {
    const wrap = document.getElementById(`strokeGridWrapper_${idx}`);
    if (wrap) wrap.classList.toggle('is-active', idx === charIdx);
    renderCharGuideOverlay(idx, idx === charIdx ? highlightStrokeIdx : null);
  });

  renderInstructionText(charIdx);
  renderStrokeOrderSteps(charIdx, highlightStrokeIdx);

  if (highlightStrokeIdx !== null) {
    const charData = strokeCharDataMap[charIdx];
    const ch = currentStrokeChars[charIdx];
    const median = charData?.medians?.[highlightStrokeIdx];
    const strokeInfo = classifyStrokeType(median);
    const statusWrap = document.getElementById('strokeQuizStatusWrap');
    if (statusWrap) {
      statusWrap.hidden = false;
      statusWrap.innerHTML = `
        <div class="stroke-status-live">
          🧭 Chữ <strong>"${ch}"</strong> · <strong>Nét ${highlightStrokeIdx + 1}/${charData?.strokes?.length || '?'}</strong>: ${strokeInfo.symbol} ${strokeInfo.name} (theo hướng mũi tên)
        </div>
      `;
    }
  }
}

function destroyStrokeCanvasWriters() {
  if (animationStepTimer) {
    clearTimeout(animationStepTimer);
    animationStepTimer = null;
  }
  strokeWriters.forEach(writer => {
    if (writer) {
      try {
        if (typeof writer.cancelQuiz === 'function') writer.cancelQuiz();
      } catch (e) {}
    }
  });
  strokeWriters = [];
  strokeCharDataMap = {};
  activeHighlightStrokeIdx = null;
  isAnimatingSequential = false;

  const container = document.getElementById('strokeGridsContainer');
  if (container) container.innerHTML = '';

  const stepsWrap = document.getElementById('strokeOrderStepsWrap');
  if (stepsWrap) {
    stepsWrap.hidden = true;
    stepsWrap.innerHTML = '';
  }

  const statusWrap = document.getElementById('strokeQuizStatusWrap');
  if (statusWrap) {
    statusWrap.hidden = true;
    statusWrap.innerHTML = '';
  }

  const animateBtn = document.getElementById('strokeAnimateBtn');
  const quizBtn = document.getElementById('strokeQuizBtn');
  if (animateBtn) animateBtn.classList.remove('active');
  if (quizBtn) quizBtn.classList.remove('active');
}

function renderInstructionText(highlightIndex = null) {
  const box = document.getElementById('strokeInstructionBox');
  if (!box) return;

  const total = currentStrokeChars.length;
  if (total === 0) {
    box.hidden = true;
    return;
  }
  box.hidden = false;

  const activeIdx = highlightIndex !== null ? highlightIndex : activeCharIndex;

  if (total <= 1) {
    const cData = strokeCharDataMap[0];
    const strokeCountText = cData && Array.isArray(cData.strokes) ? `${cData.strokes.length} nét vẽ` : 'Thứ tự chuẩn';
    box.innerHTML = `
      <div class="stroke-order-seq">
        <span class="stroke-seq-chip is-current">${currentStrokeChars[0]} · ${strokeCountText}</span>
      </div>
      <span class="stroke-tip-badge">💡 Chạm ô chữ để luyện viết</span>
    `;
    return;
  }

  const seqHtml = currentStrokeChars.map((ch, idx) => {
    const checkEl = document.getElementById(`strokeGridCheck_${idx}`);
    const isCompleted = checkEl && !checkEl.hidden;
    const isCurrent = activeIdx === idx;
    let cls = 'stroke-seq-chip';
    if (isCompleted) cls += ' is-done';
    if (isCurrent) cls += ' is-current';
    return `<button type="button" class="${cls}" data-seq-char-idx="${idx}" title="Chọn chữ ${ch}">${isCompleted ? '✓ ' : `${idx + 1}. `}${ch}</button>`;
  }).join('<span class="stroke-seq-arrow">→</span>');

  box.innerHTML = `
    <div class="stroke-order-seq">${seqHtml}</div>
    <span class="stroke-tip-badge" title="Bấm trực tiếp vào ô chữ để luyện viết">💡 Chạm ô chữ để viết</span>
  `;

  box.querySelectorAll('[data-seq-char-idx]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-seq-char-idx'), 10);
      if (!Number.isNaN(idx)) {
        setActiveCharacterFocus(idx, null);
      }
    });
  });
}

function renderStrokeGrids(autoAnimate = true) {
  const container = document.getElementById('strokeGridsContainer');
  const fallback = document.getElementById('strokeCanvasFallback');
  if (!container || !fallback) return;

  destroyStrokeCanvasWriters();
  fallback.hidden = true;

  const totalChars = currentStrokeChars.length;
  if (totalChars === 0) {
    fallback.hidden = false;
    fallback.textContent = 'Từ này không có chữ Hán để luyện viết.';
    renderInstructionText();
    syncStrokeCanvasControls();
    return;
  }

  if (typeof HanziWriter === 'undefined') {
    fallback.hidden = false;
    fallback.textContent = 'Đang tải thư viện viết chữ...';
    let retries = 0;
    const checkHW = setInterval(() => {
      retries++;
      if (typeof HanziWriter !== 'undefined') {
        clearInterval(checkHW);
        renderStrokeGrids(autoAnimate);
      } else if (retries >= 30) {
        clearInterval(checkHW);
        fallback.textContent = 'Không thể tải thư viện viết chữ (HanziWriter). Vui lòng kiểm tra kết nối mạng.';
      }
    }, 100);
    renderInstructionText();
    syncStrokeCanvasControls();
    return;
  }

  const boxSize = getGridBoxSize(totalChars);
  container.className = `stroke-grids-container chars-${Math.min(totalChars, 4)}`;
  container.style.setProperty('--grid-box-size', `${boxSize}px`);

  currentStrokeChars.forEach((ch, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'stroke-grid-wrapper' + (idx === 0 ? ' is-active' : '');
    wrapper.id = `strokeGridWrapper_${idx}`;
    wrapper.innerHTML = `
      <div class="stroke-canvas-grid" id="strokeCanvasTarget_${idx}" data-char-index="${idx}" title="Bấm vào ô để tự luyện viết chữ '${ch}'"></div>
      <div class="stroke-grid-footer">
        <span class="stroke-grid-num">${idx + 1}.</span>
        <span class="stroke-grid-char">${ch}</span>
        <span class="stroke-grid-stroke-count" id="strokeGridCount_${idx}"></span>
        <span class="stroke-grid-check" id="strokeGridCheck_${idx}" hidden>✓</span>
      </div>
    `;
    container.appendChild(wrapper);

    const target = wrapper.querySelector('.stroke-canvas-grid');
    target.addEventListener('click', (e) => {
      e.stopPropagation();
      startQuizOnChar(idx, true);
    });
  });

  const colors = getStrokeColors();
  lastRenderedTheme = document.documentElement.dataset.theme || (colors.isDark ? 'dark' : 'light');
  const padding = Math.max(8, Math.round(boxSize * 0.07));

  currentStrokeChars.forEach((ch, idx) => {
    try {
      const handleCharDataLoaded = (charData) => {
        if (!charData) return;
        globalCharDataCache[ch] = charData;
        strokeCharDataMap[idx] = charData;
        const countEl = document.getElementById(`strokeGridCount_${idx}`);
        if (countEl && Array.isArray(charData.strokes)) {
          countEl.textContent = `(${charData.strokes.length} nét)`;
        }
        renderCharGuideOverlay(idx, idx === activeCharIndex ? activeHighlightStrokeIdx : null);
        renderInstructionText(activeCharIndex);
        if (idx === activeCharIndex) {
          renderStrokeOrderSteps(activeCharIndex, activeHighlightStrokeIdx);
        }
      };

      if (globalCharDataCache[ch]) {
        handleCharDataLoaded(globalCharDataCache[ch]);
      }

      const writer = HanziWriter.create(`strokeCanvasTarget_${idx}`, ch, {
        width: boxSize,
        height: boxSize,
        padding,
        showOutline: true,
        strokeColor: colors.strokeColor,
        radicalColor: colors.radicalColor,
        outlineColor: colors.outlineColor,
        showHintAfterMisses: 2,
        highlightOnComplete: true,
        onLoadCharDataSuccess: handleCharDataLoaded,
        onLoadCharDataError: function() {
          const wrap = document.getElementById(`strokeGridWrapper_${idx}`);
          if (wrap) {
            wrap.classList.add('has-error');
            const target = wrap.querySelector('.stroke-canvas-grid');
            if (target && !target.querySelector('svg')) {
              target.innerHTML = `<span style="font-size:${Math.round(boxSize * 0.45)}px; font-weight:700; color:var(--text-primary);">${ch}</span>`;
            }
          }
        }
      });
      strokeWriters[idx] = writer;
    } catch (err) {
      console.warn('HanziWriter init error for character', ch, err);
    }
  });

  renderInstructionText();
  renderStrokeOrderSteps(0, null);
  syncStrokeCanvasControls();

  if (autoAnimate) {
    animateStrokeCanvas();
  }
}

function startQuizOnChar(charIndex, isManual = false) {
  if (!currentStrokeChars || charIndex < 0 || charIndex >= currentStrokeChars.length) return;
  const writer = strokeWriters[charIndex];
  if (!writer) return;

  if (animationStepTimer) {
    clearTimeout(animationStepTimer);
    animationStepTimer = null;
  }

  strokeWriters.forEach((w, idx) => {
    if (idx !== charIndex && w && typeof w.cancelQuiz === 'function') {
      try { w.cancelQuiz(); } catch (e) {}
    }
  });
  isAnimatingSequential = false;
  activeCharIndex = charIndex;
  activeHighlightStrokeIdx = 0;

  currentStrokeChars.forEach((ch, idx) => {
    const wrap = document.getElementById(`strokeGridWrapper_${idx}`);
    const target = document.getElementById(`strokeCanvasTarget_${idx}`);
    if (wrap) wrap.classList.toggle('is-active', idx === charIndex);
    if (target) target.classList.toggle('is-quiz-mode', idx === charIndex);
    renderCharGuideOverlay(idx, idx === charIndex ? 0 : null);
  });

  const quizBtn = document.getElementById('strokeQuizBtn');
  const animateBtn = document.getElementById('strokeAnimateBtn');
  if (quizBtn) quizBtn.classList.add('active');
  if (animateBtn) animateBtn.classList.remove('active');

  const currentChar = currentStrokeChars[charIndex];
  const total = currentStrokeChars.length;

  renderInstructionText(charIndex);
  renderStrokeOrderSteps(charIndex, 0);

  const statusWrap = document.getElementById('strokeQuizStatusWrap');
  if (statusWrap) {
    statusWrap.hidden = false;
    statusWrap.innerHTML = `
      <div class="stroke-status-live">
        ✍️ Hãy kéo <strong>Nét 1</strong> của chữ <strong>"${currentChar}"</strong> (${charIndex + 1}/${total}) theo hướng mũi tên!
      </div>
    `;
  }

  writer.quiz({
    onMistake: (strokeData) => {
      const nextStrokeIdx = strokeData ? strokeData.strokeNum : activeHighlightStrokeIdx;
      activeHighlightStrokeIdx = nextStrokeIdx;
      renderCharGuideOverlay(charIndex, nextStrokeIdx);
      renderStrokeOrderSteps(charIndex, nextStrokeIdx);

      const statusEl = document.querySelector('.stroke-status-live');
      if (statusEl) {
        statusEl.innerHTML = `<span style="color:var(--danger-text)">Nét ${(nextStrokeIdx ?? 0) + 1} chữ "${currentChar}" chưa chuẩn. Hãy kéo theo mũi tên hướng dẫn!</span>`;
      }
    },
    onCorrectStroke: (strokeData) => {
      const nextStrokeIdx = strokeData.strokeNum + 1;
      const totalStrokes = strokeCharDataMap[charIndex]?.strokes?.length || 0;
      activeHighlightStrokeIdx = nextStrokeIdx < totalStrokes ? nextStrokeIdx : null;
      renderCharGuideOverlay(charIndex, activeHighlightStrokeIdx);
      renderStrokeOrderSteps(charIndex, activeHighlightStrokeIdx);

      const statusEl = document.querySelector('.stroke-status-live');
      if (statusEl) {
        statusEl.innerHTML = `<span style="color:var(--success-text)">✓ Đúng nét ${strokeData.strokeNum + 1}/${totalStrokes} chữ "${currentChar}"! ${activeHighlightStrokeIdx !== null ? `Tiếp tục nét ${activeHighlightStrokeIdx + 1}…` : ''}</span>`;
      }
    },
    onComplete: (summary) => {
      const mistakes = summary ? (summary.totalMistakes || 0) : 0;
      const mistakesText = mistakes === 0 ? 'hoàn hảo' : `${mistakes} lỗi sai`;
      activeHighlightStrokeIdx = null;
      renderCharGuideOverlay(charIndex, null);
      renderStrokeOrderSteps(charIndex, null);

      const checkEl = document.getElementById(`strokeGridCheck_${charIndex}`);
      if (checkEl) checkEl.hidden = false;
      const wrap = document.getElementById(`strokeGridWrapper_${charIndex}`);
      if (wrap) wrap.classList.add('is-completed');
      const target = document.getElementById(`strokeCanvasTarget_${charIndex}`);
      if (target) target.classList.remove('is-quiz-mode');

      renderInstructionText(charIndex);

      if (charIndex < total - 1) {
        const nextChar = currentStrokeChars[charIndex + 1];
        if (statusWrap) {
          statusWrap.innerHTML = `
            <div class="stroke-status-next">
              🎉 Xong chữ <strong>"${currentChar}"</strong> (${mistakesText})! Đang chuyển sang chữ <strong>"${nextChar}"</strong> (${charIndex + 2}/${total})…
            </div>
          `;
        }
        setTimeout(() => {
          startQuizOnChar(charIndex + 1, false);
        }, 600);
      } else {
        if (quizBtn) quizBtn.classList.remove('active');
        if (statusWrap) {
          const wordText = currentStrokeWord?.hanzi || currentStrokeChars.join('');
          statusWrap.innerHTML = `
            <div class="stroke-status-success">
              <div class="stroke-status-success-title">
                🎉 Xuất sắc! Bạn đã viết xong từ <strong>"${wordText}"</strong> (${total} chữ Hán)!
              </div>
              <button type="button" class="stroke-restart-btn" id="strokeRestartQuizBtn">
                ↺ Luyện viết lại từ đầu
              </button>
            </div>
          `;
          const restartBtn = document.getElementById('strokeRestartQuizBtn');
          if (restartBtn) {
            restartBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              currentStrokeChars.forEach((ch, idx) => {
                const c = document.getElementById(`strokeGridCheck_${idx}`);
                if (c) c.hidden = true;
                const w = document.getElementById(`strokeGridWrapper_${idx}`);
                if (w) w.classList.remove('is-completed');
              });
              startQuizOnChar(0, true);
            });
          }
        }
      }
    }
  });
}

function animateStrokeCanvas() {
  if (!strokeWriters || strokeWriters.length === 0) return;

  if (animationStepTimer) {
    clearTimeout(animationStepTimer);
    animationStepTimer = null;
  }

  strokeWriters.forEach((w, idx) => {
    if (w && typeof w.cancelQuiz === 'function') {
      try { w.cancelQuiz(); } catch (e) {}
    }
    const target = document.getElementById(`strokeCanvasTarget_${idx}`);
    if (target) target.classList.remove('is-quiz-mode');
  });

  isAnimatingSequential = true;
  activeHighlightStrokeIdx = null;
  const animateBtn = document.getElementById('strokeAnimateBtn');
  const quizBtn = document.getElementById('strokeQuizBtn');
  if (animateBtn) animateBtn.classList.add('active');
  if (quizBtn) quizBtn.classList.remove('active');

  const statusWrap = document.getElementById('strokeQuizStatusWrap');
  if (statusWrap) {
    statusWrap.hidden = false;
    statusWrap.innerHTML = `
      <div class="stroke-status-live">
        ▶ Đang diễn họa thứ tự nét chữ…
      </div>
    `;
  }

  function playChar(idx) {
    if (!isAnimatingSequential) return;
    if (idx >= strokeWriters.length) {
      isAnimatingSequential = false;
      activeHighlightStrokeIdx = null;
      if (animateBtn) animateBtn.classList.remove('active');
      currentStrokeChars.forEach((_, i) => renderCharGuideOverlay(i, null));
      renderStrokeOrderSteps(activeCharIndex, null);
      if (statusWrap) {
        statusWrap.innerHTML = `
          <div class="stroke-status-live">
            ✨ Diễn họa hoàn tất · Chạm ô chữ hoặc từng bước bên dưới để xem hướng nét
          </div>
        `;
      }
      renderInstructionText(activeCharIndex);
      return;
    }

    activeCharIndex = idx;
    const writer = strokeWriters[idx];
    const ch = currentStrokeChars[idx];
    currentStrokeChars.forEach((c, i) => {
      const wrap = document.getElementById(`strokeGridWrapper_${i}`);
      if (wrap) wrap.classList.toggle('is-active', i === idx);
      renderCharGuideOverlay(i, null);
    });

    renderInstructionText(idx);
    renderStrokeOrderSteps(idx, null);

    if (statusWrap) {
      statusWrap.innerHTML = `
        <div class="stroke-status-live">
          ▶ Đang diễn họa nét chữ <strong>"${ch}"</strong> (${idx + 1}/${strokeWriters.length})…
        </div>
      `;
    }

    if (writer && typeof writer.animateCharacter === 'function') {
      writer.animateCharacter({
        onComplete: () => {
          if (isAnimatingSequential) {
            animationStepTimer = setTimeout(() => playChar(idx + 1), 220);
          }
        }
      });
    } else {
      playChar(idx + 1);
    }
  }

  playChar(0);
}

function toggleStrokeGuides() {
  showStrokeGuides = !showStrokeGuides;
  try {
    localStorage.setItem('hsk_show_stroke_guides', showStrokeGuides ? 'true' : 'false');
  } catch (e) {}

  const guideBtn = document.getElementById('strokeGuideToggleBtn');
  if (guideBtn) {
    guideBtn.classList.toggle('active', showStrokeGuides);
    guideBtn.setAttribute('aria-pressed', showStrokeGuides ? 'true' : 'false');
  }

  currentStrokeChars.forEach((_, idx) => {
    renderCharGuideOverlay(idx, idx === activeCharIndex ? activeHighlightStrokeIdx : null);
  });
}

function loadStrokeCanvasWord(word) {
  if (!document.getElementById('strokeCanvasWrap')) {
    initStrokeCanvas();
  }
  if (!word && typeof activeStudyWord !== 'undefined' && activeStudyWord) {
    word = activeStudyWord;
  }
  currentStrokeWord = word;
  const badge = document.getElementById('strokeCharBadge');
  const mobileBadge = document.getElementById('strokeMobileCharBadge');
  const fallback = document.getElementById('strokeCanvasFallback');

  if (!word || !word.hanzi) {
    destroyStrokeCanvasWriters();
    currentStrokeChars = [];
    activeCharIndex = 0;
    if (fallback) {
      fallback.hidden = false;
      fallback.textContent = 'Chọn một từ để xem thứ tự nét & luyện viết.';
    }
    if (badge) badge.textContent = '';
    if (mobileBadge) mobileBadge.textContent = '';
    renderInstructionText();
    syncStrokeCanvasControls();
    return;
  }

  currentStrokeChars = extractHanziCharacters(word.hanzi);
  activeCharIndex = 0;
  activeHighlightStrokeIdx = null;

  const total = currentStrokeChars.length;
  const badgeText = total > 1 ? `${word.hanzi} · ${total} chữ Hán` : word.hanzi;
  if (badge) badge.textContent = badgeText;
  if (mobileBadge) mobileBadge.textContent = badgeText;

  renderStrokeGrids(true);
}

function syncStrokeCanvasControls() {
  const hasWriters = strokeWriters.length > 0;
  ['strokeAnimateBtn', 'strokeQuizBtn', 'strokeGuideToggleBtn'].forEach(id => {
    const button = document.getElementById(id);
    if (button) button.disabled = !hasWriters;
  });
}

function initStrokeCanvas() {
  const mount = document.getElementById('workstationRight') || document.getElementById('screenCards');
  if (!mount) return;

  if (document.getElementById('strokeCanvasWrap')) return;

  const wrap = document.createElement('div');
  wrap.className = 'stroke-canvas-panel';
  wrap.id = 'strokeCanvasWrap';

  const title = document.createElement('div');
  title.className = 'sidebar-panel-header';
  title.innerHTML = `
    <div class="sidebar-panel-title">Thứ tự nét &amp; Luyện viết</div>
    <span class="stroke-char-badge" id="strokeCharBadge"></span>
  `;
  wrap.appendChild(title);

  const body = document.createElement('div');
  body.className = 'stroke-canvas-body';
  body.innerHTML = `
    <div class="stroke-grids-container" id="strokeGridsContainer"></div>
    <div class="stroke-canvas-fallback" id="strokeCanvasFallback" hidden></div>
    <div class="stroke-canvas-controls">
      <button type="button" class="stroke-ctrl-btn" id="strokeAnimateBtn" title="Diễn họa thứ tự nét vẽ">▶ Xem nét</button>
      <button type="button" class="stroke-ctrl-btn" id="strokeQuizBtn" title="Tự vẽ nét chữ theo thứ tự">✍️ Luyện viết</button>
      <button type="button" class="stroke-ctrl-btn stroke-ctrl-btn--guide${showStrokeGuides ? ' active' : ''}" id="strokeGuideToggleBtn" aria-pressed="${showStrokeGuides ? 'true' : 'false'}" title="Bật/tắt hiển thị số thứ tự nét và mũi tên chỉ hướng trên ô chữ">🧭 Số &amp; Mũi tên</button>
    </div>
    <div class="stroke-instruction-box" id="strokeInstructionBox" hidden></div>
    <div class="stroke-quiz-status-wrap" id="strokeQuizStatusWrap" hidden></div>
    <div class="stroke-order-steps-wrap" id="strokeOrderStepsWrap" hidden></div>
  `;
  wrap.appendChild(body);
  mount.appendChild(wrap);

  wrap.querySelector('#strokeAnimateBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    animateStrokeCanvas();
  });

  wrap.querySelector('#strokeQuizBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    startQuizOnChar(0, true);
  });

  wrap.querySelector('#strokeGuideToggleBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleStrokeGuides();
  });

  try {
    const themeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.dataset.theme || '';
          if (newTheme !== lastRenderedTheme && currentStrokeChars.length > 0) {
            renderStrokeGrids(false);
          }
          break;
        }
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (e) {}

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (currentStrokeChars.length > 0) {
        const newSize = getGridBoxSize(currentStrokeChars.length);
        const container = document.getElementById('strokeGridsContainer');
        const oldSize = container ? parseInt(container.style.getPropertyValue('--grid-box-size') || '0', 10) : 0;
        if (Math.abs(newSize - oldSize) > 4) {
          renderStrokeGrids(false);
        }
      }
    }, 150);
  });

  onActiveWordChange(loadStrokeCanvasWord);
  loadStrokeCanvasWord(typeof activeStudyWord !== 'undefined' ? activeStudyWord : null);
}

function renderActiveStrokeChar(autoAnimate = true) {
  if (!document.getElementById('strokeCanvasWrap')) {
    initStrokeCanvas();
  }
  const word = (typeof activeStudyWord !== 'undefined' && activeStudyWord) ? activeStudyWord : null;
  if (
    word &&
    currentStrokeWord &&
    currentStrokeWord.hanzi === word.hanzi &&
    strokeWriters.length === currentStrokeChars.length &&
    strokeWriters.length > 0
  ) {
    const newSize = getGridBoxSize(currentStrokeChars.length);
    const container = document.getElementById('strokeGridsContainer');
    const oldSize = container ? parseInt(container.style.getPropertyValue('--grid-box-size') || '0', 10) : 0;
    if (Math.abs(newSize - oldSize) > 4) {
      renderStrokeGrids(autoAnimate);
    } else if (autoAnimate && !isAnimatingSequential) {
      animateStrokeCanvas();
    }
    return;
  }
  loadStrokeCanvasWord(word);
}

window.renderActiveStrokeChar = renderActiveStrokeChar;
window.loadStrokeCanvasWord = loadStrokeCanvasWord;
window.selectStrokeChar = function(idx) { startQuizOnChar(idx, true); };
window.animateStrokeCanvas = animateStrokeCanvas;
window.quizStrokeCanvas = function() { startQuizOnChar(0, true); };
window.initStrokeCanvas = initStrokeCanvas;

document.addEventListener('DOMContentLoaded', initStrokeCanvas);
