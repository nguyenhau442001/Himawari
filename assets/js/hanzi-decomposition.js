// Hanzi Radical & Character Decomposition System (Chiết tự & Bóc tách bộ thủ)
// Integrates character decomposition, stroke-to-component visual highlighting,
// flashcard radical badges, and dedicated study sidebar panel.

let hanziDecompData = null;
let hanziDecompLoadPromise = null;
let activeHighlightTimer = null;

async function ensureHanziDecompLoaded() {
  if (hanziDecompData) return hanziDecompData;
  if (hanziDecompLoadPromise) return hanziDecompLoadPromise;

  hanziDecompLoadPromise = fetch('database/radicals/hanzi_decompositions.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load hanzi_decompositions.json');
      return res.json();
    })
    .then(data => {
      hanziDecompData = data;
      return data;
    })
    .catch(err => {
      console.warn('Could not load hanzi decompositions:', err);
      return {};
    })
    .finally(() => {
      hanziDecompLoadPromise = null;
    });

  return hanziDecompLoadPromise;
}

function getCharacterDecomposition(char) {
  if (!hanziDecompData || !char) return null;
  return hanziDecompData[char] || null;
}

function getWordDecomposition(wordOrHanzi) {
  if (!wordOrHanzi) return [];
  const text = typeof wordOrHanzi === 'object' ? (wordOrHanzi.hanzi || wordOrHanzi.word || '') : String(wordOrHanzi);
  const chars = Array.from(text).filter(ch => /\p{Script=Han}/u.test(ch));
  if (!hanziDecompData) return chars.map(ch => ({ character: ch, components: [] }));
  return chars.map(ch => hanziDecompData[ch] || { character: ch, components: [], is_single_body: true });
}

// Highlight and animate specific stroke indices on the active HanziWriter canvas
function highlightComponentStrokes(strokeIndices) {
  if (!Array.isArray(strokeIndices) || strokeIndices.length === 0) return;
  if (typeof strokeWriters === 'undefined' || typeof activeCharIndex === 'undefined') return;

  const writer = strokeWriters[activeCharIndex];
  if (!writer) return;

  try {
    if (typeof stopSequentialAnimation === 'function') stopSequentialAnimation();
    if (typeof cancelActiveQuiz === 'function') cancelActiveQuiz();
  } catch (e) {}

  clearTimeout(activeHighlightTimer);

  // Animate strokes in this component sequentially
  strokeIndices.forEach((sIdx, order) => {
    activeHighlightTimer = setTimeout(() => {
      try {
        if (typeof writer.animateStroke === 'function') {
          writer.animateStroke(sIdx);
        } else if (typeof writer.highlightStroke === 'function') {
          writer.highlightStroke(sIdx);
        }
      } catch (e) {}
    }, order * 360);
  });
}

// Render the interactive decomposition card inside the "Nét chữ" tab in right sidebar
function renderStrokeDecomposition(char, container) {
  const mount = container || document.getElementById('strokeDecompContainer');
  if (!mount) return;

  if (!char) {
    mount.innerHTML = '';
    return;
  }

  const decomp = getCharacterDecomposition(char);
  if (!decomp) {
    ensureHanziDecompLoaded().then(() => {
      if (typeof currentStrokeChars !== 'undefined' && currentStrokeChars[activeCharIndex] === char) {
        renderStrokeDecomposition(char, mount);
      }
    });
    mount.innerHTML = '<div class="stroke-decomp-loading">Đang tải phân tích bộ thủ…</div>';
    return;
  }

  const struct = decomp.structure || {};
  const comps = decomp.components || [];
  const radical = decomp.radical || {};

  let html = `
    <div class="stroke-decomp-card-box">
      <div class="stroke-decomp-header">
        <div class="stroke-decomp-title-group">
          <span class="stroke-decomp-badge-icon">🧩</span>
          <strong class="stroke-decomp-title">Bóc tách bộ thủ &amp; Cấu tạo chữ</strong>
        </div>
        ${struct.name ? `
          <span class="stroke-decomp-struct-badge" title="${struct.desc || ''}">
            ${struct.idc ? `<span class="stroke-decomp-idc">${struct.idc}</span>` : ''}
            <span>${struct.name}</span>
          </span>
        ` : ''}
      </div>

      <div class="stroke-decomp-formula-banner">
        <span class="stroke-decomp-formula-text">${decomp.formula || char}</span>
      </div>

      <div class="stroke-decomp-components-list">
        ${comps.map((comp, idx) => {
          const hasStrokes = Array.isArray(comp.stroke_indices) && comp.stroke_indices.length > 0;
          const strokeRangeText = hasStrokes
            ? `Nét ${comp.stroke_indices[0] + 1}${comp.stroke_indices.length > 1 ? `–${comp.stroke_indices[comp.stroke_indices.length - 1] + 1}` : ''} (${comp.stroke_count} nét)`
            : (comp.stroke_count ? `${comp.stroke_count} nét` : '');

          return `
            <div class="stroke-decomp-comp-item${comp.is_radical ? ' is-main-radical' : ''}" data-comp-idx="${idx}">
              <div class="stroke-decomp-comp-left">
                <span class="stroke-decomp-comp-char" lang="zh-CN">${comp.char}</span>
                <div class="stroke-decomp-comp-info">
                  <div class="stroke-decomp-comp-name-row">
                    <strong class="stroke-decomp-comp-name">${comp.name || comp.char}</strong>
                    ${comp.pinyin ? `<span class="stroke-decomp-comp-py">${comp.pinyin}</span>` : ''}
                    ${comp.hanviet ? `<span class="stroke-decomp-comp-hv">[${comp.hanviet}]</span>` : ''}
                  </div>
                  ${comp.meaning ? `<div class="stroke-decomp-comp-meaning">${comp.meaning}</div>` : ''}
                </div>
              </div>

              <div class="stroke-decomp-comp-actions">
                ${strokeRangeText ? `<span class="stroke-decomp-stroke-badge">${strokeRangeText}</span>` : ''}
                ${hasStrokes ? `
                  <button type="button" class="stroke-decomp-highlight-btn" onclick="highlightComponentStrokes([${comp.stroke_indices.join(',')}])" title="Làm nổi bật nét của bộ này trên ô viết chữ">
                    ▶ Xem nét
                  </button>
                ` : ''}
                ${comp.kangxi_id ? `
                  <button type="button" class="stroke-decomp-kangxi-link" onclick="openRadicalDetails(${comp.kangxi_id}, '${comp.char}')" title="Mở bộ Khang Hy #${comp.kangxi_id}">
                    Bộ #${comp.kangxi_id}
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${decomp.mnemonic ? `
        <div class="stroke-decomp-mnemonic-box">
          <span class="stroke-decomp-mnemonic-icon">💡</span>
          <div class="stroke-decomp-mnemonic-content">
            <span class="stroke-decomp-mnemonic-label">Mẹo nhớ chiết tự:</span>
            <span class="stroke-decomp-mnemonic-text">${decomp.mnemonic}</span>
          </div>
        </div>
      ` : ''}
    </div>
  `;

  mount.innerHTML = html;
}

// Render radical chips on the flashcard itself
function renderCardRadicals(word) {
  const mount = document.getElementById('cardRadicalsRow');
  if (!mount) return;

  if (!word || !word.hanzi) {
    mount.innerHTML = '';
    mount.style.display = 'none';
    return;
  }

  ensureHanziDecompLoaded().then(() => {
    const chars = Array.from(word.hanzi).filter(ch => /\p{Script=Han}/u.test(ch));
    if (chars.length === 0) {
      mount.innerHTML = '';
      mount.style.display = 'none';
      return;
    }

    const pills = [];
    chars.forEach((ch, charIdx) => {
      const d = getCharacterDecomposition(ch);
      if (!d) return;

      if (d.components && d.components.length > 0) {
        d.components.forEach(c => {
          pills.push({
            charIdx,
            char: ch,
            compChar: c.char,
            name: c.name || c.char,
            meaning: c.meaning || '',
            hanviet: c.hanviet || '',
            kangxi_id: c.kangxi_id || 0,
            strokes: c.stroke_indices || []
          });
        });
      }
    });

    if (pills.length === 0) {
      mount.innerHTML = '';
      mount.style.display = 'none';
      return;
    }

    mount.style.display = 'flex';
    mount.innerHTML = pills.map(p => `
      <button type="button" class="card-radical-pill"
        onclick="event.stopPropagation(); jumpToStudyRadical('${p.char}', ${p.charIdx}, [${p.strokes.join(',')}])"
        title="${p.name}: ${p.meaning || p.hanviet}">
        <span class="card-radical-char" lang="zh-CN">${p.compChar}</span>
        <span class="card-radical-name">${p.name.replace('Bộ ', '')}</span>
      </button>
    `).join('');
  });
}

// Click on flashcard radical pill -> opens study writing drawer & highlights
function jumpToStudyRadical(char, charIdx, strokeIndices) {
  if (typeof toggleStudyWritingPanel === 'function') {
    toggleStudyWritingPanel(true);
  }
  if (typeof setSidebarStudyTab === 'function') {
    setSidebarStudyTab('stroke');
  }
  setTimeout(() => {
    if (typeof selectCharacterAtIndex === 'function' && typeof charIdx === 'number') {
      selectCharacterAtIndex(charIdx, false);
    }
    if (Array.isArray(strokeIndices) && strokeIndices.length > 0) {
      setTimeout(() => highlightComponentStrokes(strokeIndices), 180);
    }
  }, 120);
}

// Find other words in current deck sharing this radical
function findRelatedWordsSharingRadical(radicalChar, currentWordHanzi) {
  if (!Array.isArray(WORDS) || !radicalChar || !hanziDecompData) return [];
  const results = [];
  for (const w of WORDS) {
    if (w.hanzi === currentWordHanzi) continue;
    const chars = Array.from(w.hanzi);
    for (const ch of chars) {
      const d = hanziDecompData[ch];
      if (d && ((d.radical && d.radical.char === radicalChar) || (d.components && d.components.some(c => c.char === radicalChar)))) {
        results.push(w);
        break;
      }
    }
    if (results.length >= 6) break;
  }
  return results;
}

// Render full dedicated "Bộ thủ" (radicals) tab panel in right sidebar
function renderStudyRadicalsPanel(word) {
  const panel = document.getElementById('studyRadicalsPanel');
  if (!panel) return;

  if (!word || !word.hanzi) {
    panel.innerHTML = '<div class="study-radicals-empty">Chọn một từ để xem bóc tách bộ thủ chi tiết.</div>';
    return;
  }

  ensureHanziDecompLoaded().then(() => {
    const decompList = getWordDecomposition(word);
    if (!decompList || decompList.length === 0) {
      panel.innerHTML = '<div class="study-radicals-empty">Chưa có dữ liệu bóc tách bộ thủ cho từ này.</div>';
      return;
    }

    let html = `
      <div class="study-radicals-container">
        <div class="study-radicals-intro">
          <div class="study-radicals-intro-title">
            <span>🧩</span> Bóc tách chiết tự: <strong class="study-radicals-word-hanzi">${word.hanzi}</strong>
            ${word.pinyin ? `<span class="study-radicals-word-py">(${word.pinyin})</span>` : ''}
          </div>
          <p class="study-radicals-intro-desc">Mỗi chữ Hán được cấu tạo từ các bộ thủ mang ý nghĩa hình tượng và gợi nhớ.</p>
        </div>
    `;

    decompList.forEach((d, charIdx) => {
      const struct = d.structure || {};
      const comps = d.components || [];
      const rad = d.radical || {};
      const related = rad.char ? findRelatedWordsSharingRadical(rad.char, word.hanzi) : [];

      html += `
        <div class="study-radical-char-block">
          <div class="study-radical-char-header">
            <div class="study-radical-char-avatar">
              <span class="char-big" lang="zh-CN">${d.character}</span>
              ${d.pinyin ? `<span class="char-py">${d.pinyin}</span>` : ''}
              ${d.hanviet ? `<span class="char-hv">[${d.hanviet}]</span>` : ''}
            </div>
            <div class="study-radical-char-meta">
              <div class="study-radical-struct-title">
                ${struct.name ? `<strong>Kết cấu ${struct.name}</strong>` : 'Độc thể tự'}
              </div>
              <div class="study-radical-formula-text">${d.formula || d.character}</div>
              ${struct.desc ? `<p class="study-radical-struct-desc">${struct.desc}</p>` : ''}
            </div>
          </div>

          <div class="study-radical-comps-title">Các bộ thủ cấu thành (${comps.length}):</div>
          <div class="study-radical-cards-grid">
            ${comps.map(c => `
              <div class="study-radical-card${c.is_radical ? ' is-main' : ''}">
                <div class="study-radical-card-top">
                  <span class="study-radical-card-char" lang="zh-CN">${c.char}</span>
                  <div class="study-radical-card-titles">
                    <strong class="study-radical-card-name">${c.name}</strong>
                    <div class="study-radical-card-sub">
                      ${c.pinyin ? `<span>${c.pinyin}</span>` : ''}
                      ${c.hanviet ? `<span>· ${c.hanviet}</span>` : ''}
                      ${c.stroke_count ? `<span>· ${c.stroke_count} nét</span>` : ''}
                    </div>
                  </div>
                </div>
                ${c.meaning ? `<div class="study-radical-card-meaning">Ý nghĩa: <em>${c.meaning}</em></div>` : ''}
                <div class="study-radical-card-footer">
                  ${c.kangxi_id ? `
                    <button type="button" class="study-radical-btn study-radical-btn--dir" onclick="openRadicalDetails(${c.kangxi_id}, '${c.char}')">
                      📖 Tra bộ #${c.kangxi_id}
                    </button>
                  ` : ''}
                  ${(c.stroke_indices && c.stroke_indices.length > 0) ? `
                    <button type="button" class="study-radical-btn study-radical-btn--write" onclick="jumpToStudyRadical('${d.character}', ${charIdx}, [${c.stroke_indices.join(',')}])">
                      ✍️ Xem nét viết
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>

          ${d.mnemonic ? `
            <div class="study-radical-mnemonic-card">
              <span class="mnemonic-icon">💡</span>
              <div class="mnemonic-body">
                <strong>Mẹo ghi nhớ chữ ${d.character}:</strong>
                <p>${d.mnemonic}</p>
              </div>
            </div>
          ` : ''}

          ${related.length > 0 ? `
            <div class="study-radical-related-section">
              <div class="related-title">Từ khác cùng có bộ <strong>${rad.name || rad.char}</strong> trong bài:</div>
              <div class="related-words-row">
                ${related.map(rw => {
                  const rIdx = WORDS.indexOf(rw);
                  return `
                    <button type="button" class="related-word-pill" onclick="jumpToWordByIndex(${rIdx})" title="${rw.meaning}">
                      <span class="rw-hanzi">${rw.hanzi}</span>
                      <span class="rw-py">${rw.pinyin}</span>
                      <span class="rw-vi">${rw.meaning}</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    });

    html += `
        <div class="study-radicals-footer-cta">
          <button type="button" class="study-radicals-all-btn" onclick="openRadicalDirectory()">
            📚 Mở danh mục 214 Bộ thủ Khang Hy <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    `;

    panel.innerHTML = html;
  });
}

// Open Kangxi radical card / details directly from decomposition
async function openRadicalDetails(kangxiId, radicalChar) {
  if (typeof openCommonRadical === 'function' && radicalChar) {
    await openCommonRadical(radicalChar);
  } else if (typeof openRadicalDirectory === 'function') {
    await openRadicalDirectory();
  }
}

function toggleStudyRadicalsPanel(forceOpen) {
  const isOpen = document.body.classList.contains('study-sidebar-open');
  const isTargetTab = document.body.dataset.sidebarTab === 'radicals';
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : (!isOpen || !isTargetTab);

  if (shouldOpen) {
    document.body.classList.add('study-sidebar-open');
    if (typeof window.setSidebarStudyTab === 'function') {
      window.setSidebarStudyTab('radicals');
    }
  } else {
    document.body.classList.remove('study-sidebar-open');
  }
}

function initStudyRadicalsWrap() {
  const mount = document.getElementById('workstationRight') || document.getElementById('screenCards');
  if (!mount) return;
  if (document.getElementById('studyRadicalsWrap')) return;

  const wrap = document.createElement('div');
  wrap.className = 'study-radicals-panel';
  wrap.id = 'studyRadicalsWrap';
  wrap.innerHTML = `
    <div class="sidebar-panel-header">
      <div class="sidebar-panel-title">Bóc tách bộ thủ &amp; Chiết tự</div>
    </div>
    <div id="studyRadicalsPanel" class="study-radicals-body"></div>
  `;
  mount.appendChild(wrap);

  if (typeof activeStudyWord !== 'undefined' && activeStudyWord) {
    renderStudyRadicalsPanel(activeStudyWord);
  }
}

// Initialize decomposition hooks
function initHanziDecomposition() {
  ensureHanziDecompLoaded();
  initStudyRadicalsWrap();

  // Listen to active word changes
  if (typeof onActiveWordChange === 'function') {
    onActiveWordChange(word => {
      renderCardRadicals(word);
      renderStudyRadicalsPanel(word);
    });
  }
}

document.addEventListener('DOMContentLoaded', initHanziDecomposition);

// Export to window
window.ensureHanziDecompLoaded = ensureHanziDecompLoaded;
window.getCharacterDecomposition = getCharacterDecomposition;
window.getWordDecomposition = getWordDecomposition;
window.highlightComponentStrokes = highlightComponentStrokes;
window.renderStrokeDecomposition = renderStrokeDecomposition;
window.renderCardRadicals = renderCardRadicals;
window.renderStudyRadicalsPanel = renderStudyRadicalsPanel;
window.jumpToStudyRadical = jumpToStudyRadical;
window.openRadicalDetails = openRadicalDetails;
window.toggleStudyRadicalsPanel = toggleStudyRadicalsPanel;
window.initStudyRadicalsWrap = initStudyRadicalsWrap;

