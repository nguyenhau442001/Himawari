// Flashcard markup, filtering, statistics, and rendering.
function buildCardArea() {
  document.getElementById('cardArea').innerHTML = `
    <div class="card" id="card">
      <div class="card-header-bar card-interactive" id="cardHeaderBar" onclick="event.stopPropagation()">
        <span class="card-position-badge" id="cardPositionBadge">0 / 0</span>
        <div class="card-toolbar" id="cardToolbar">
          <button type="button" class="card-tool-btn" id="shuffleBtn" onclick="shuffleDeck()" aria-label="Xáo trộn bộ từ" title="Xáo trộn bộ từ">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.8-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.4c1.3 0 2.5.6 3.3 1.7l6.1 8.6c.8 1.1 2 1.7 3.3 1.7H22"/><path d="m18 14 4 4-4 4"/></svg>
          </button>
          <button type="button" class="card-tool-btn" id="pinyinToggle" onclick="togglePinyin()" aria-label="Ẩn hoặc hiện pinyin" title="Ẩn hoặc hiện pinyin">
            <span id="pinyinToggleIcon" class="tool-icon-svg" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
          </button>
          <button type="button" class="card-tool-btn" id="hanvietToggle" onclick="toggleHanViet()" aria-label="Bật hoặc tắt âm Hán - Việt (H)" title="Bật hoặc tắt âm Hán - Việt (H)">
            <span id="hanvietToggleIcon" class="tool-hanviet-text" aria-hidden="true">漢</span>
          </button>
          <button type="button" class="card-tool-btn" id="cardWritingBtn" onclick="toggleStudyWritingPanel()" aria-label="Luyện viết chữ Hán (W)" title="Luyện viết chữ Hán (W)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
          </button>
          <button type="button" class="card-tool-btn" id="weakWordToggleBtn" onclick="toggleWeakWord(activeStudyWord && activeStudyWord.hanzi, currentLevel)" aria-label="Đánh dấu từ khó" title="Đánh dấu từ khó">
            <span id="weakWordToggleIcon" class="tool-icon-svg" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </span>
          </button>
          <button type="button" class="card-tool-btn" id="transferToggle" onclick="toggleTransferPanel()" aria-label="Sao lưu tiến trình" title="Sao lưu tiến trình" aria-controls="transferPanel" aria-expanded="false">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </button>
        </div>
      </div>
      <div class="swipe-badge swipe-badge--known" id="swipeBadgeKnown">✓ Đã nhớ</div>
      <div class="swipe-badge swipe-badge--unknown" id="swipeBadgeUnknown">✗ Chưa nhớ</div>
      <div id="cardContent" class="card-content">
        <div class="word-main-block split-layout" id="wordMainBlock">
          <!-- Cột trái: Hình ảnh minh họa / Neo thị giác (Visual Mnemonic) -->
          <div class="card-visual-col" id="cardVisualCol">
            <div class="card-illustration-frame" id="cardIllustrationFrame" title="Minh họa gợi hình">
              <img class="card-illustration-img" id="cardIllustrationImg" alt="Minh họa gợi hình" hidden>
              <div class="card-illustration-svg" id="cardIllustrationSvg"></div>
            </div>
          </div>

          <!-- Cột phải: Chữ Hán, Pinyin, Từ loại & Nghĩa -->
          <div class="card-content-col" id="cardContentCol">
            <div class="hanzi card-interactive" id="hanzi" onclick="event.stopPropagation(); toggleStudyWritingPanel(true)" title="Nhấn để luyện viết và xem thứ tự nét (W)"></div>
            <div class="pinyin-row" id="pinyinRow">
              <div class="pinyin" id="pinyin"></div>
              <span class="hanviet-badge" id="hanvietBadge" title="Âm Hán - Việt"></span>
              <span class="pos-badge" id="posBadge" title="Từ loại"></span>
              <button class="sound-btn speech-btn" id="soundBtn" type="button"
                onclick="event.stopPropagation(); speakWord()"
                aria-label="Nghe phát âm" aria-live="polite" title="Nghe phát âm (A)">
                <svg class="sound-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              </button>
            </div>
            <div class="card-radicals-row card-interactive" id="cardRadicalsRow" onclick="event.stopPropagation()"></div>
            <div class="meaning" id="meaning"></div>
          </div>
        </div>
        <div class="example-box" id="exampleBox">
          <div class="ex-header-row">
            <span class="ex-label">Ví dụ</span>
            <div class="example-audio-controls card-interactive">
              <button class="example-sound-btn speech-btn" id="exampleSoundBtn" type="button"
                onclick="event.stopPropagation(); speakExample()"
                aria-label="Nghe câu ví dụ" aria-live="polite" title="Nghe câu ví dụ">
                <svg class="sound-btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              </button>
              <details class="example-speed-picker" id="exampleSpeedPicker"
                onclick="event.stopPropagation()">
                <summary aria-label="Tốc độ đọc câu ví dụ: ${formatExampleSpeechSpeed(exampleSpeechSpeed)}">
                  <span class="example-speed-label">Tốc độ</span>
                  <span class="example-current-speed" id="exampleCurrentSpeed">${formatExampleSpeechSpeed(exampleSpeechSpeed)}</span>
                </summary>
                <div class="example-speed-options" role="group" aria-label="Chọn tốc độ đọc câu ví dụ">
                  ${EXAMPLE_SPEECH_SPEEDS.map(speed => `
                    <button class="example-speed-option${speed === exampleSpeechSpeed ? ' selected' : ''}"
                      type="button" data-speed="${speed}"
                      aria-pressed="${speed === exampleSpeechSpeed}"
                      onclick="event.preventDefault(); setExampleSpeechSpeed(this.dataset.speed)">
                      ${formatExampleSpeechSpeed(speed)}
                    </button>
                  `).join('')}
                </div>
              </details>
            </div>
          </div>
          <div class="ex-line ex-zh" id="exZh"></div>
          <div class="ex-line ex-py" id="exPy"></div>
          <div class="ex-line ex-vi" id="exVi"></div>
        </div>
        <div class="hint" id="hint">Nhấn vào thẻ hoặc phím Space để lật thẻ</div>
        <div class="card-empty-state card-interactive" id="cardEmptyState" hidden></div>
      </div>
    </div>

    <div class="nav-row" id="studyNavRow">
      <button type="button" class="nav-btn nav-btn--prev" onclick="prevCard()" title="Từ trước (←)">← Trước</button>
      <span class="card-counter" id="cardCounter">0 / 0</span>
      <button type="button" class="nav-btn nav-btn--next" onclick="nextCard()" title="Từ tiếp theo (→)">Tiếp →</button>
    </div>

    <div class="rating-area">
      ${revealButtonHtml('flip()', 'revealBtn')}
      <div class="rating-row" id="ratingRow" hidden>
        ${ratingButtonsHtml('rateCurrentCard', 'preview-')}
      </div>
    </div>

    <div class="action-row secondary-actions">
      <button class="show-unknown-btn" id="unknownWordsToggle" onclick="toggleUnknownWords()"
        aria-controls="unknownWordsList" aria-expanded="false">
        Hiển thị từ chưa nhớ
      </button>
      <button class="reset-progress-btn" type="button" onclick="resetProgress()">↻ Học lại từ đầu</button>
    </div>
    <div id="dailyNewLimitMessage" class="daily-new-limit-message" role="status"></div>
    <div class="unknown-words-list" id="unknownWordsList"></div>
  `;
  const pinyinBtn = document.getElementById('pinyinToggle');
  const pinyinIcon = document.getElementById('pinyinToggleIcon');
  if (pinyinIcon) {
    pinyinIcon.innerHTML = showPinyin
      ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`
      : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;
    pinyinBtn.title = showPinyin ? 'Ẩn pinyin' : 'Hiện pinyin';
    pinyinBtn.setAttribute('aria-label', showPinyin ? 'Ẩn pinyin' : 'Hiện pinyin');
  }
  if (pinyinBtn) pinyinBtn.classList.toggle('on', !showPinyin);
  const hanvietBtn = document.getElementById('hanvietToggle');
  if (hanvietBtn) {
    hanvietBtn.classList.toggle('on', !showHanViet);
    hanvietBtn.title = showHanViet ? 'Ẩn âm Hán - Việt (H)' : 'Hiện âm Hán - Việt (H)';
    hanvietBtn.setAttribute('aria-label', showHanViet ? 'Ẩn âm Hán - Việt (H)' : 'Hiện âm Hán - Việt (H)');
  }
  const topbarHanvietBtn = document.getElementById('studyHanvietToggleBtn');
  if (topbarHanvietBtn) {
    topbarHanvietBtn.classList.toggle('active', showHanViet);
  }
  if (typeof updateWeakWordToggleButton === 'function') updateWeakWordToggleButton();
  updateProgress();
  updateCardPosition();
  initSwipe();
}

function toggleHanViet() {
  showHanViet = !showHanViet;
  try { localStorage.setItem('hsk_show_hanviet', String(showHanViet)); } catch (e) {}
  document.body.classList.toggle('hide-hanviet', !showHanViet);
  document.documentElement.classList.toggle('hide-hanviet', !showHanViet);
  const badge = document.getElementById('hanvietBadge');
  if (badge) {
    badge.style.display = showHanViet && badge.textContent ? 'inline-flex' : 'none';
  }
  const btn = document.getElementById('hanvietToggle');
  if (btn) {
    btn.classList.toggle('on', !showHanViet);
    btn.title = showHanViet ? 'Ẩn âm Hán - Việt (H)' : 'Hiện âm Hán - Việt (H)';
    btn.setAttribute('aria-label', showHanViet ? 'Ẩn âm Hán - Việt (H)' : 'Hiện âm Hán - Việt (H)');
  }
  const topbarBtn = document.getElementById('studyHanvietToggleBtn');
  if (topbarBtn) {
    topbarBtn.classList.toggle('active', showHanViet);
  }
  document.querySelectorAll('.hanviet-badge, .study-word-hanviet, .active-hv, .vocabulary-hanviet').forEach(el => {
    el.style.display = showHanViet ? '' : 'none';
  });
}
window.toggleHanViet = toggleHanViet;

function renderFilters() {
  const row = document.getElementById('filterRow');
  if (!row) return;
  row.innerHTML = '';
  const known = Object.values(progress).filter(value => value === 'known').length;
  const unknown = Object.values(progress).filter(value => value === 'unknown').length;
  const counts = {
    all: WORDS.length,
    unknown,
    known,
    unseen: Math.max(0, WORDS.length - known - unknown),
  };
  const filters = [
    { key: 'all', label: 'Tất cả', count: counts.all },
    { key: 'unknown', label: 'Chưa nhớ', count: counts.unknown, modifier: 'unknown' },
    { key: 'known', label: 'Đã nhớ', count: counts.known, modifier: 'known' },
    { key: 'unseen', label: 'Chưa học', count: counts.unseen, modifier: 'unseen' },
  ];
  filters.forEach(f => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'filter-btn' + (f.modifier ? ' filter-btn--' + f.modifier : '') + (currentFilter === f.key ? ' active' : '');
    b.innerHTML = `<span class="filter-label">${f.label}</span> <span class="filter-count">(${f.count})</span>`;
    b.onclick = () => setFilter(f.key);
    row.appendChild(b);
  });
}
function setFilter(key) {
  currentFilter = key;
  if (key === 'all') filteredOrder = order.slice();
  else if (key === 'unseen') filteredOrder = order.filter(i => !progress[WORDS[i].id]);
  else filteredOrder = order.filter(i => progress[WORDS[i].id] === key);
  idx = 0;
  renderFilters();
  renderStudyWordList();
  render('fade');
}
function updateStats() {
  let known = 0, unknown = 0;
  Object.values(progress).forEach(v => { if (v === 'known') known++; else if (v === 'unknown') unknown++; });
  const sTotal = document.getElementById('s-total');
  if (sTotal) sTotal.textContent = WORDS.length;
  const sKnown = document.getElementById('s-known');
  if (sKnown) sKnown.textContent = known;
  const sUnknown = document.getElementById('s-unknown');
  if (sUnknown) sUnknown.textContent = unknown;
  const sUnseen = document.getElementById('s-unseen');
  if (sUnseen) sUnseen.textContent = Math.max(0, WORDS.length - known - unknown);
  renderFilters();
  updateProgress();
}
const RATING_BUTTONS = [
  { rating: 'again', emoji: '❌', label: 'Chưa nhớ', key: '1', interval: 'Hôm nay' },
  { rating: 'good', emoji: '✅', label: 'Đã nhớ', key: '2', interval: 'Ôn ngắt quãng' },
];
const RATING_KEYS = {
  '1': 'again',
  '2': 'good',
  'ArrowLeft': 'again',
  'ArrowRight': 'good',
};

// Shared by the level deck and "Ôn hôm nay": label with icon, no cluttered subtext.
function ratingButtonsHtml(handlerName, previewIdPrefix, previews) {
  return RATING_BUTTONS.map(button => {
    const preview = previews ? previews[button.rating] : null;
    const intervalText = preview ? formatSrsInterval(preview, button.interval) : button.interval;
    const shortcutArrow = button.rating === 'again' ? '←' : '→';
    const iconSvg = button.rating === 'again'
      ? `<svg class="rating-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
      : `<svg class="rating-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    const titleText = `Đánh giá: ${button.label}${intervalText ? ` (${intervalText})` : ''} • Phím [${button.key}] hoặc [${shortcutArrow}]`;
    return `
    <button type="button" class="rating-btn rating-btn--${button.rating}"
      onclick="${handlerName}('${button.rating}')" aria-keyshortcuts="${button.key}"
      title="${titleText}">
      <span class="rating-icon-wrap" aria-hidden="true">${iconSvg}</span>
      <span class="rating-label">${button.label}</span>
    </button>`;
  }).join('');
}
function revealButtonHtml(onclick, id) {
  return `<button type="button" class="reveal-btn" id="${id}" onclick="${onclick}" aria-keyshortcuts="Space" title="Lật thẻ (Phím Space)">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
      <span>Lật thẻ</span><kbd class="key-badge" aria-hidden="true">Space</kbd>
    </button>`;
}
function formatSrsInterval(preview, fallback) {
  if (preview && preview.intervalText) return preview.intervalText;
  if (!preview) return fallback || '';
  if (preview.rating === 'again') return 'Hôm nay';
  const ms = preview.intervalMs;
  if (!Number.isFinite(ms)) return fallback || '';
  const days = Math.round(ms / 86400000);
  if (days <= 0) return 'Hôm nay';
  if (days === 1) return '1 ngày';
  return days + ' ngày';
}
function updateSrsPreviews(word) {
  const card = word && srsCards[word.id];
  const previews = card ? SRS.preview(card, new Date(), srsRetention) : {};
  RATING_BUTTONS.forEach(({ rating, interval, label, key }) => {
    const node = document.getElementById('preview-' + rating);
    if (node) node.textContent = formatSrsInterval(previews[rating], interval);
    const btn = document.querySelector(`.rating-btn--${rating}`);
    if (btn) {
      const nextInterval = formatSrsInterval(previews[rating], interval);
      const arrow = rating === 'again' ? '←' : '→';
      btn.title = `Đánh giá: ${label}${nextInterval ? ` (${nextInterval})` : ''} • Phím [${key}] hoặc [${arrow}]`;
    }
  });
}
function ratingsVisible() {
  const ratingRow = document.getElementById('ratingRow');
  return Boolean(ratingRow && !ratingRow.hidden);
}
function isCardRevealed() {
  const meaning = document.getElementById('meaning');
  return Boolean(meaning && meaning.classList.contains('show'));
}
// Rating buttons appear only once the answer is visible; before that, one "Lật thẻ" button.
function syncRevealControls() {
  const revealBtn = document.getElementById('revealBtn');
  const ratingRow = document.getElementById('ratingRow');
  if (!revealBtn || !ratingRow) return;
  const hasCard = filteredOrder.length > 0;
  const revealed = hasCard && isCardRevealed();
  revealBtn.hidden = !hasCard || revealed;
  ratingRow.hidden = !revealed;
}
function computeDeckProgress() {
  if (!Array.isArray(WORDS) || WORDS.length === 0) {
    return { learned: 0, total: 0, pct: 0, known: 0, unknown: 0, unseen: 0 };
  }
  let known = 0, unknown = 0;
  WORDS.forEach(w => {
    const st = progress[w.id];
    if (st === 'known') known++;
    else if (st === 'unknown') unknown++;
  });
  const learned = known + unknown;
  const total = WORDS.length;
  const unseen = Math.max(0, total - learned);
  const pct = total === 0 ? 0 : Math.round((learned / total) * 100);
  return { learned, total, pct, known, unknown, unseen };
}

function updateProgress(current, total) {
  const deck = computeDeckProgress();
  const el = document.getElementById('progress');
  if (el) el.textContent = deck.total === 0 ? '0 / 0' : `${deck.learned} / ${deck.total}`;
  const bar = document.getElementById('progressBar');
  if (bar) bar.style.width = deck.pct + '%';
  const pctEl = document.getElementById('progressPct');
  if (pctEl) {
    if (deck.pct === 100 && deck.total > 0) {
      pctEl.textContent = '🏆 100%';
      pctEl.classList.add('is-completed');
      pctEl.title = 'Chúc mừng bạn đã hoàn thành 100% từ vựng! Nhấn để xem hiệu ứng thành tựu 🎉';
      pctEl.style.cursor = 'pointer';
      pctEl.onclick = e => {
        e.stopPropagation();
        if (typeof showCelebration === 'function') {
          showCelebration(deck.known === deck.total ? 'mastered' : 'learned', true);
        }
      };
    } else {
      pctEl.textContent = deck.pct + '%';
      pctEl.classList.remove('is-completed');
      pctEl.title = '';
      pctEl.style.cursor = '';
      pctEl.onclick = null;
    }
  }
  const topbar = document.getElementById('studyTopbarProgress');
  if (topbar) {
    topbar.title = `Tiến độ học: ${deck.learned}/${deck.total} (${deck.pct}%) • Đã nhớ: ${deck.known}, Chưa nhớ: ${deck.unknown}`;
  }
}

function updateCardPosition() {
  const badge = document.getElementById('cardPositionBadge');
  const counter = document.getElementById('cardCounter');
  if (!filteredOrder || filteredOrder.length === 0) {
    const deck = computeDeckProgress();
    const txt = (currentFilter === 'unseen' && deck.unseen === 0 && deck.total > 0) ? 'Hoàn thành' : '0 / 0';
    if (badge) {
      badge.textContent = txt;
      if (txt === 'Hoàn thành') badge.title = 'Đã học qua 100% từ vựng mới của cấp độ này';
    }
    if (counter) counter.textContent = txt;
    return;
  }
  const current = (idx % filteredOrder.length) + 1;
  const total = filteredOrder.length;
  const posText = `${current} / ${total}`;
  if (badge) {
    badge.textContent = posText;
    const filterLabel = currentFilter === 'all' ? 'Tất cả'
      : currentFilter === 'known' ? 'Đã nhớ'
      : currentFilter === 'unknown' ? 'Chưa nhớ'
      : currentFilter === 'unseen' ? 'Chưa học' : currentFilter;
    badge.title = `Thẻ ${current} / ${total} (${filterLabel})`;
  }
  if (counter) {
    counter.textContent = posText;
  }
}

function renderHanziWithClarifier(el, text) {
  if (!el) return;
  const raw = String(text || '').trim();
  const match = raw.match(/^([^（\(]+)[（\(](.+?)[）\)]$/);
  if (match) {
    el.textContent = '';
    const mainSpan = document.createElement('span');
    mainSpan.className = 'hanzi-text';
    mainSpan.textContent = match[1].trim();
    const clarifierSpan = document.createElement('span');
    clarifierSpan.className = 'hanzi-clarifier';
    clarifierSpan.textContent = `（${match[2].trim()}）`;
    el.appendChild(mainSpan);
    el.appendChild(clarifierSpan);
  } else {
    el.textContent = raw;
  }
}

function applyHanziLengthFit(el, text) {
  if (!el) return;
  const core = String(text || '').replace(/[（\(].*?[）\)]/g, '').trim() || text || '';
  const chars = Array.from(core);
  const len = chars.length;
  el.dataset.length = String(len);
  el.classList.remove('is-len-1', 'is-len-2', 'is-len-3', 'is-len-4', 'is-len-5', 'is-len-6-plus', 'is-len-long');
  if (len >= 6) {
    el.classList.add('is-len-6-plus', 'is-len-long');
  } else if (len === 5) {
    el.classList.add('is-len-5', 'is-len-long');
  } else if (len === 4) {
    el.classList.add('is-len-4');
  } else if (len === 3) {
    el.classList.add('is-len-3');
  } else if (len === 2) {
    el.classList.add('is-len-2');
  } else {
    el.classList.add('is-len-1');
  }
  fitHanziToContainer(el);

  if (typeof ResizeObserver !== 'undefined' && !window.__hanziResizeObserver) {
    const parent = el.parentElement;
    if (parent) {
      window.__hanziResizeObserver = new ResizeObserver(() => {
        const currentHanzi = document.getElementById('hanzi');
        if (currentHanzi && currentHanzi.textContent) {
          fitHanziToContainer(currentHanzi);
        }
      });
      window.__hanziResizeObserver.observe(parent);
    }
  }
}

function fitHanziToContainer(el) {
  if (!el) return;
  el.style.fontSize = '';
  requestAnimationFrame(() => {
    if (!el || !el.parentElement) return;
    const parent = el.parentElement;
    const availableWidth = parent.clientWidth - 16;
    if (availableWidth <= 50) return;
    if (el.scrollWidth > availableWidth) {
      const computed = window.getComputedStyle(el);
      const currentSize = parseFloat(computed.fontSize);
      if (currentSize > 16) {
        const ratio = availableWidth / el.scrollWidth;
        const newSize = Math.max(16, Math.floor(currentSize * ratio * 0.98));
        el.style.fontSize = `${newSize}px`;
      }
    }
  });
}

window.addEventListener('resize', () => {
  const h = document.getElementById('hanzi');
  if (h && h.textContent) fitHanziToContainer(h);
});

function toggleStudySidebar(forceOpen) {
  const isOpen = document.body.classList.contains('study-sidebar-open');
  const isTargetTab = document.body.dataset.sidebarTab === 'words';
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : (!isOpen || !isTargetTab);

  if (shouldOpen) {
    document.body.classList.add('study-sidebar-open');
    if (typeof window.setSidebarStudyTab === 'function') {
      window.setSidebarStudyTab('words');
    }
    if (typeof renderStudyWordList === 'function') {
      renderStudyWordList();
    }
    if (typeof SpaRouter !== 'undefined' && !SpaRouter.isNavigatingFromPopstate()) {
      SpaRouter.pushView({ view: 'cards', level: currentLevel, drawerOpen: true });
    }
  } else {
    document.body.classList.remove('study-sidebar-open');
  }
  updateStudyDrawerButtons();
}

function toggleStudyWritingPanel(forceOpen) {
  const isOpen = document.body.classList.contains('study-sidebar-open');
  const isTargetTab = document.body.dataset.sidebarTab === 'stroke';
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : (!isOpen || !isTargetTab);

  if (shouldOpen) {
    document.body.classList.add('study-sidebar-open');
    if (typeof window.setSidebarStudyTab === 'function') {
      window.setSidebarStudyTab('stroke');
    }
    if (typeof renderActiveStrokeChar === 'function') {
      setTimeout(() => renderActiveStrokeChar(true), 50);
    } else if (typeof loadStrokeCanvasWord === 'function' && typeof activeStudyWord !== 'undefined') {
      setTimeout(() => loadStrokeCanvasWord(activeStudyWord), 50);
    }
    if (typeof SpaRouter !== 'undefined' && !SpaRouter.isNavigatingFromPopstate()) {
      SpaRouter.pushView({ view: 'cards', level: currentLevel, drawerOpen: true });
    }
  } else {
    document.body.classList.remove('study-sidebar-open');
  }
  updateStudyDrawerButtons();
}

function closeAllStudyDrawers() {
  if (typeof toggleTransferPanel === 'function') toggleTransferPanel(false);
  if (typeof toggleRadicalTransferPanel === 'function') toggleRadicalTransferPanel(false);
  const wasOpen = document.body.classList.contains('study-sidebar-open');
  document.body.classList.remove('study-sidebar-open');
  updateStudyDrawerButtons();
  if (wasOpen && typeof SpaRouter !== 'undefined' && !SpaRouter.isNavigatingFromPopstate()) {
    if (window.history.state && window.history.state.drawerOpen) {
      window.history.back();
    }
  }
}

function updateStudyDrawerButtons() {
  const isPanelOpen = document.body.classList.contains('study-sidebar-open');
  const activeTab = document.body.dataset.sidebarTab || 'stroke';

  const sidebarBtn = document.getElementById('studySidebarToggleBtn');
  if (sidebarBtn) sidebarBtn.classList.toggle('active', isPanelOpen && activeTab === 'words');
  const writingBtn = document.getElementById('studyWritingToggleBtn');
  if (writingBtn) writingBtn.classList.toggle('active', isPanelOpen && activeTab === 'stroke');
  const cardWritingBtn = document.getElementById('cardWritingBtn');
  if (cardWritingBtn) cardWritingBtn.classList.toggle('active', isPanelOpen && activeTab === 'stroke');

  const currentHanzi = document.getElementById('hanzi');
  if (currentHanzi && currentHanzi.textContent) {
    fitHanziToContainer(currentHanzi);
  }
}

function ensureStudyWordList() {
  if (!document.body.classList.contains('is-desktop-dock') && !document.body.classList.contains('flashcard-study-mode')) return null;
  let panel = document.getElementById('studyWordListPanel');
  if (panel) return panel;
  const isStudy = document.body.classList.contains('flashcard-study-mode');
  const mount = isStudy
    ? (document.getElementById('workstationRight') || document.getElementById('workstationLeft'))
    : document.getElementById('workstationLeft');
  if (!mount) return null;
  panel = document.createElement('section');
  panel.id = 'studyWordListPanel';
  panel.className = 'study-word-list-panel';
  panel.setAttribute('aria-label', 'Danh sách từ trong bài học hiện tại');
  panel.innerHTML = `
    <div class="study-word-list-heading">
      <div class="study-word-list-header-row">
        <strong id="studyWordListTitle">Danh sách từ</strong>
        <span id="studyWordListCount" class="study-word-count-badge"></span>
        <button type="button" class="study-drawer-close-btn" onclick="closeAllStudyDrawers()" aria-label="Đóng danh sách">✕</button>
      </div>
      <div id="studyWordListActiveWord" class="study-word-active-banner"></div>
      <label class="study-word-list-search">
        <span class="sr-only">Tìm trong bài học</span>
        <input type="search" id="studyWordListSearch" placeholder="Tìm kiếm từ trong bài..." autocomplete="off">
      </label>
    </div>
    <div class="study-word-list-items" id="studyWordListItems" role="listbox" aria-label="Chọn từ trong bài học"></div>`;
  mount.appendChild(panel);
  const searchEl = panel.querySelector('#studyWordListSearch');
  if (searchEl) {
    searchEl.addEventListener('input', renderStudyWordList);
    searchEl.addEventListener('search', renderStudyWordList);
  }
  return panel;
}

function renderStudyWordList() {
  const panel = ensureStudyWordList();
  if (!panel) return;
  const items = panel.querySelector('#studyWordListItems');
  const searchInput = panel.querySelector('#studyWordListSearch');
  const query = searchInput ? searchInput.value.trim() : '';
  const currentIndex = filteredOrder.length ? filteredOrder[idx % filteredOrder.length] : -1;
  const activeWord = currentIndex >= 0 ? WORDS[currentIndex] : null;

  const countBadge = panel.querySelector('#studyWordListCount');
  if (countBadge) {
    const levelLabel = currentLevel && LEVELS[currentLevel] ? LEVELS[currentLevel].label : '';
    countBadge.textContent = WORDS.length ? `${levelLabel} · ${WORDS.length} từ` : '';
  }

  const activeBanner = panel.querySelector('#studyWordListActiveWord');
  if (activeBanner) {
    if (activeWord) {
      const status = progress[activeWord.id];
      const statusText = status === 'known' ? 'Đã nhớ' : status === 'unknown' ? 'Chưa nhớ' : 'Chưa học';
      const statusClass = status === 'known' ? 'badge-known' : status === 'unknown' ? 'badge-unknown' : 'badge-unseen';
      activeBanner.innerHTML = `
        <div class="active-word-info">
          <span class="active-kicker">Từ số ${currentIndex + 1}:</span>
          <strong class="active-hanzi">${activeWord.hanzi}</strong>
          <span class="active-py">${activeWord.pinyin || ''}</span>
          ${activeWord.hanviet ? `<span class="active-hv">［${activeWord.hanviet}］</span>` : ''}
        </div>
        <span class="active-status ${statusClass}">${statusText}</span>
      `;
    } else {
      activeBanner.innerHTML = '<span class="active-kicker">Chọn một từ để học</span>';
    }
  }

  const filteredWords = WORDS.map((word, wordIndex) => ({ word, wordIndex }))
    .filter(({ word }) => !query || (typeof wordMatchesQuery === 'function' ? wordMatchesQuery(word, query) : `${word.hanzi} ${word.pinyin} ${word.hanviet || ''} ${word.meaning}`.toLowerCase().includes(query.toLowerCase())));

  if (filteredWords.length === 0) {
    items.innerHTML = '<div class="study-word-list-empty" style="padding: 1.5rem; text-align: center; color: var(--text-muted, #888); font-size: 0.9rem;">Không tìm thấy từ nào phù hợp.</div>';
    return;
  }

  items.innerHTML = filteredWords.map(({ word, wordIndex }) => {
    const isCurrent = wordIndex === currentIndex;
    const status = progress[word.id];
    const statusIcon = status === 'known' ? '✓' : status === 'unknown' ? '✗' : '·';
    const statusClass = status === 'known' ? 'status-known' : status === 'unknown' ? 'status-unknown' : 'status-unseen';
    return `
      <button type="button" class="study-word-list-item${isCurrent ? ' active' : ''}"
        role="option" aria-selected="${isCurrent}" data-word-index="${wordIndex}"
        title="${word.hanzi} ${word.pinyin || ''}${word.hanviet ? ' ［' + word.hanviet + '］' : ''} - ${word.meaning || ''}">
        <span class="study-word-status ${statusClass}" aria-hidden="true">${statusIcon}</span>
        <span class="study-word-list-content">
          <span class="study-word-list-main">
            <span class="study-word-list-hanzi">${word.hanzi}</span>
            <span class="word-py">${word.pinyin || ''}</span>
            ${word.hanviet ? `<span class="study-word-hanviet">［${word.hanviet}］</span>` : ''}
          </span>
          <small class="word-vi">${word.meaning || ''}</small>
        </span>
        <span class="study-word-list-number">#${wordIndex + 1}</span>
      </button>
    `;
  }).join('');

  items.querySelectorAll('[data-word-index]').forEach(button => {
    const wordIndex = Number(button.dataset.wordIndex);
    const targetWord = WORDS[wordIndex];
    if (targetWord && typeof preloadSingleWordIllustration === 'function') {
      button.addEventListener('pointerenter', () => preloadSingleWordIllustration(targetWord, 'high'), { passive: true });
      button.addEventListener('touchstart', () => preloadSingleWordIllustration(targetWord, 'high'), { passive: true });
    }
    button.addEventListener('click', () => {
      let filteredIndex = filteredOrder.indexOf(wordIndex);
      if (filteredIndex < 0) {
        currentFilter = 'all';
        filteredOrder = order.slice();
        renderFilters();
        filteredIndex = filteredOrder.indexOf(wordIndex);
      }
      if (filteredIndex >= 0) {
        idx = filteredIndex;
        render('fade');
        if (window.innerWidth < 768) {
          closeAllStudyDrawers();
        }
      }
    });
  });

  if (currentIndex >= 0) {
    const activeButton = items.querySelector('.active');
    if (activeButton && !query) activeButton.scrollIntoView({ block: 'nearest' });
  }
}
function render(animate) {
  stopSpeech();
  if (transitionTimer) { clearTimeout(transitionTimer); transitionTimer = null; }
  // Hide ratings right away so a double press cannot rate the next card during the exit animation.
  const ratingRow = document.getElementById('ratingRow');
  if (ratingRow) ratingRow.hidden = true;

  // Zero-Latency Anticipatory Preload:
  // Before running the 150ms transition, fetch the incoming target card & immediate neighbors with TOP priority!
  if (Array.isArray(WORDS) && Array.isArray(filteredOrder) && filteredOrder.length > 0) {
    const targetWIdx = filteredOrder[idx % filteredOrder.length];
    const targetWord = WORDS[targetWIdx];
    if (targetWord && typeof preloadSingleWordIllustration === 'function') {
      preloadSingleWordIllustration(targetWord, 'high');
    }
    const nextWIdx = filteredOrder[(idx + 1) % filteredOrder.length];
    if (WORDS[nextWIdx] && typeof preloadSingleWordIllustration === 'function') {
      preloadSingleWordIllustration(WORDS[nextWIdx], 'high');
    }
  }

  const content = document.getElementById('cardContent');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function renderEmptyCardState(container) {
    if (!container) return;
    const deck = typeof computeDeckProgress === 'function' ? computeDeckProgress() : { learned: 0, total: WORDS.length, known: 0, unknown: 0, unseen: 0 };
    const levelLabel = (LEVELS[currentLevel] && LEVELS[currentLevel].label) || 'cấp độ này';

    if (currentFilter === 'unseen' || (deck.unseen === 0 && deck.total > 0 && currentFilter !== 'unknown' && currentFilter !== 'known')) {
      if (typeof launchConfettiFireworks === 'function') launchConfettiFireworks();
      if (typeof playCelebrationChime === 'function') playCelebrationChime();
      container.innerHTML = `
        <div class="achievement-hero-card">
          <div class="achievement-hero-trophy-wrap">
            <span class="achievement-hero-trophy">🏆</span>
            <span class="achievement-hero-sparkle-1">✨</span>
            <span class="achievement-hero-sparkle-2">⭐</span>
          </div>
          <div class="achievement-hero-badge">ĐÃ HOÀN THÀNH 100% TỪ VỰNG</div>
          <h2 class="achievement-hero-title">Bạn đã học hết từ vựng ${levelLabel}!</h2>
          <p class="achievement-hero-desc">
            Toàn bộ <strong>${deck.total}</strong> từ vựng đã được bạn học qua ít nhất một lần. Thành tựu thật tuyệt vời!
          </p>
          <div class="achievement-hero-stats">
            <div class="hero-stat-card">
              <span class="hero-stat-num">${deck.total}</span>
              <span class="hero-stat-label">Tổng số từ</span>
            </div>
            <div class="hero-stat-card hero-stat-card--known">
              <span class="hero-stat-num">${deck.known}</span>
              <span class="hero-stat-label">Đã nhớ tốt</span>
            </div>
            <div class="hero-stat-card hero-stat-card--unknown">
              <span class="hero-stat-num">${deck.unknown}</span>
              <span class="hero-stat-label">Cần củng cố</span>
            </div>
          </div>
          <div class="achievement-hero-actions">
            ${deck.unknown > 0 ? `
            <button type="button" class="empty-btn empty-btn--primary" onclick="setFilter('unknown')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              Ôn tập ngay ${deck.unknown} từ chưa nhớ
            </button>` : ''}
            <button type="button" class="empty-btn empty-btn--secondary" onclick="setFilter('all'); if (typeof shuffleDeck==='function') shuffleDeck();">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.8-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/></svg>
              Xáo trộn & ôn tất cả từ
            </button>
          </div>
        </div>`;
      return;
    }

    if (currentFilter === 'unknown') {
      if (deck.known === deck.total && deck.total > 0) {
        if (typeof launchConfettiFireworks === 'function') launchConfettiFireworks();
        if (typeof playCelebrationChime === 'function') playCelebrationChime();
        container.innerHTML = `
          <div class="achievement-hero-card">
            <div class="achievement-hero-trophy-wrap">
              <span class="achievement-hero-trophy">👑</span>
              <span class="achievement-hero-sparkle-1">✨</span>
            </div>
            <div class="achievement-hero-badge achievement-hero-badge--gold">ĐẠI THÀNH TỰU · MASTERED</div>
            <h2 class="achievement-hero-title">Tuyệt Đỉnh Tinh Thông ${levelLabel}!</h2>
            <p class="achievement-hero-desc">
              Bạn đã nhớ hoàn toàn <strong>${deck.total} / ${deck.total}</strong> từ vựng. Không còn bất kỳ từ nào chưa nhớ!
            </p>
            <div class="achievement-hero-actions">
              <button type="button" class="empty-btn empty-btn--primary" onclick="setFilter('all'); if (typeof shuffleDeck==='function') shuffleDeck();">
                Ôn tập củng cố tất cả từ
              </button>
            </div>
          </div>`;
        return;
      }

      container.innerHTML = `
        <div class="achievement-hero-card">
          <div class="achievement-hero-trophy-wrap">
            <span class="achievement-hero-trophy">🎯</span>
          </div>
          <div class="achievement-hero-badge">ĐÃ HOÀN THÀNH ÔN TẬP</div>
          <h2 class="achievement-hero-title">Không còn từ tồn đọng!</h2>
          <p class="achievement-hero-desc">
            Tuyệt vời, bạn đã nhớ hết các từ cần củng cố trong danh sách ôn tập hiện tại.
          </p>
          <div class="achievement-hero-actions">
            ${deck.unseen > 0 ? `
            <button type="button" class="empty-btn empty-btn--primary" onclick="setFilter('unseen')">
              👉 Học tiếp ${deck.unseen} từ mới
            </button>` : ''}
            <button type="button" class="empty-btn empty-btn--secondary" onclick="setFilter('all')">
              Xem tất cả từ
            </button>
          </div>
        </div>`;
      return;
    }

    if (currentFilter === 'known') {
      container.innerHTML = `
        <div class="generic-empty-card">
          <div class="generic-empty-icon">📖</div>
          <h3 class="generic-empty-title">Chưa có từ nào đã nhớ</h3>
          <p class="generic-empty-desc">Hãy bắt đầu ôn luyện các từ vựng để đánh dấu những từ bạn đã nhớ tốt.</p>
          <button type="button" class="empty-btn empty-btn--primary" onclick="setFilter('all')">
            Bắt đầu học ngay
          </button>
        </div>`;
      return;
    }

    container.innerHTML = `
      <div class="generic-empty-card">
        <div class="generic-empty-icon">📭</div>
        <h3 class="generic-empty-title">Không có từ trong bộ lọc này</h3>
        <p class="generic-empty-desc">Chưa có thẻ từ vựng nào thỏa mãn điều kiện lọc đã chọn.</p>
        <button type="button" class="empty-btn empty-btn--secondary" onclick="setFilter('all')">
          Quay về tất cả từ
        </button>
      </div>`;
  }

  function applyContent() {
    if (content) content.className = 'card-content';
    const card = document.getElementById('card');
    if (card) card.classList.remove('is-flipped');
    const wordMainBlock = document.getElementById('wordMainBlock');
    const cardEmptyState = document.getElementById('cardEmptyState');
    const exBox = document.getElementById('exampleBox');
    if (exBox) exBox.classList.remove('show');
    const soundBtn = document.getElementById('soundBtn');
    if (soundBtn) soundBtn.classList.remove('show');
    const initImgEl = document.getElementById('cardIllustrationImg');
    if (initImgEl) { initImgEl.hidden = true; initImgEl.style.display = 'none'; initImgEl.removeAttribute('src'); }
    const hint = document.getElementById('hint');
    if (filteredOrder.length === 0) {
      if (wordMainBlock) wordMainBlock.style.display = 'none';
      if (exBox) { exBox.classList.remove('show'); exBox.style.display = 'none'; }
      if (hint) hint.style.display = 'none';
      const emptyHanzi = document.getElementById('hanzi');
      if (emptyHanzi) {
        emptyHanzi.textContent = '';
        emptyHanzi.style.fontSize = '';
        emptyHanzi.removeAttribute('data-length');
        emptyHanzi.className = 'hanzi';
      }
      document.getElementById('pinyin').textContent = '';
      const emptyHv = document.getElementById('hanvietBadge');
      if (emptyHv) { emptyHv.textContent = ''; emptyHv.style.display = 'none'; }
      const emptyPos = document.getElementById('posBadge');
      if (emptyPos) { emptyPos.textContent = ''; emptyPos.hidden = true; emptyPos.style.display = 'none'; }
      const meaningEl = document.getElementById('meaning');
      if (meaningEl) { meaningEl.textContent = ''; meaningEl.classList.remove('show'); }
      const emptyRads = document.getElementById('cardRadicalsRow');
      if (emptyRads) { emptyRads.innerHTML = ''; emptyRads.style.display = 'none'; }
      const emptySvg = document.getElementById('cardIllustrationSvg');
      const emptyImg = document.getElementById('cardIllustrationImg');
      if (emptySvg) emptySvg.innerHTML = '';
      if (emptyImg) { emptyImg.src = ''; emptyImg.hidden = true; }
      if (cardEmptyState) {
        cardEmptyState.hidden = false;
        cardEmptyState.style.display = 'block';
        renderEmptyCardState(cardEmptyState);
      }
      if (content) content.classList.add('is-empty');
      updateProgress();
      updateCardPosition();
      updateStats();
      setActiveStudyWord(null);
      renderStudyWordList();
      syncRevealControls();
      if (typeof syncSpeechButtons === 'function') syncSpeechButtons();
      return;
    }
    if (wordMainBlock) wordMainBlock.style.display = '';
    if (cardEmptyState) {
      cardEmptyState.hidden = true;
      cardEmptyState.style.display = 'none';
    }
    if (hint) hint.style.display = '';
    if (content) content.classList.remove('is-empty');
    const wIdx = filteredOrder[idx % filteredOrder.length];
    const w = WORDS[wIdx];
    if (!w) return; // deck was swapped out (level change) while this render was pending
    setActiveStudyWord(w);
    if (typeof renderCardRadicals === 'function') renderCardRadicals(w);
    renderStudyWordList();
    const hanziEl = document.getElementById('hanzi');
    if (hanziEl) {
      renderHanziWithClarifier(hanziEl, w.hanzi);
      applyHanziLengthFit(hanziEl, w.hanzi);
    }
    document.getElementById('pinyin').textContent = showPinyin ? w.pinyin : '';
    const hvBadge = document.getElementById('hanvietBadge');
    if (hvBadge) {
      let hv = (typeof getWordHanViet === 'function' ? getWordHanViet(w) : '') || w.hanviet;
      if (hv) {
        hv = hv.replace(/[（\(].*?[）\)]/g, '').replace(/\s+/g, ' ').trim();
      }
      if (hv) {
        hvBadge.textContent = `［${hv}］`;
        hvBadge.hidden = false;
        hvBadge.style.display = showHanViet ? 'inline-flex' : 'none';
      } else {
        hvBadge.textContent = '';
        hvBadge.hidden = true;
        hvBadge.style.display = 'none';
      }
    }

    // Cập nhật Part of Speech (Từ loại)
    const pos = (typeof getWordPartOfSpeech === 'function') ? getWordPartOfSpeech(w) : null;
    const posBadge = document.getElementById('posBadge');
    if (posBadge) {
      if (pos && pos.label) {
        posBadge.textContent = pos.label;
        posBadge.className = `pos-badge pos-badge--${pos.code || 'noun'}`;
        posBadge.title = `Từ loại: ${pos.full || pos.label}`;
        posBadge.hidden = false;
        posBadge.style.display = 'inline-flex';
      } else {
        posBadge.textContent = '';
        posBadge.hidden = true;
        posBadge.style.display = 'none';
      }
    }

    const m = document.getElementById('meaning');
    m.textContent = w.meaning;
    m.classList.remove('show');
    const hasExample = Boolean(w.example_zh || w.example_py || w.example_vi);
    const exampleBox = document.getElementById('exampleBox');
    if (exampleBox) exampleBox.hidden = !hasExample;
    document.getElementById('exZh').innerHTML = w.example_zh;
    document.getElementById('exPy').innerHTML = w.example_py;
    document.getElementById('exVi').innerHTML = w.example_vi;

    // Cập nhật hình ảnh minh họa trực quan (Visual Mnemonic Anchor)
    const visualCol = document.getElementById('cardVisualCol');
    const imgEl = document.getElementById('cardIllustrationImg');
    const svgEl = document.getElementById('cardIllustrationSvg');
    const frameEl = document.getElementById('cardIllustrationFrame');

    if (imgEl && svgEl && typeof getWordIllustration === 'function') {
      const illu = getWordIllustration(w);
      if (illu) {
        if (visualCol) visualCol.style.display = '';
        if (frameEl) frameEl.title = 'Minh họa gợi hình';

        if (illu.type === 'svg' && illu.svg) {
          svgEl.innerHTML = illu.svg;
          svgEl.hidden = false;
          imgEl.hidden = true;
          imgEl.removeAttribute('src');
          if (frameEl) frameEl.classList.remove('is-loading');
        } else if (illu.src) {
          const cachedSvg = (typeof SynapseSvgCache !== 'undefined') ? SynapseSvgCache.get(illu.src) : null;
          if (cachedSvg) {
            // INSTANT RENDER (0ms latency from RAM cache)
            svgEl.innerHTML = cachedSvg;
            svgEl.hidden = false;
            imgEl.hidden = true;
            imgEl.removeAttribute('src');
            if (frameEl) frameEl.classList.remove('is-loading');
          } else {
            // Cache miss: show smooth shimmer without layout shift
            const curWord = w;
            if (frameEl) frameEl.classList.add('is-loading');

            if (typeof preloadIllustration === 'function') {
              preloadIllustration(illu.src, 'high').then(svgText => {
                if (typeof activeStudyWord !== 'undefined' && activeStudyWord === curWord) {
                  if (svgText) {
                    svgEl.innerHTML = svgText;
                    svgEl.hidden = false;
                    imgEl.hidden = true;
                    imgEl.removeAttribute('src');
                  } else {
                    imgEl.src = illu.src;
                    imgEl.alt = 'Minh họa gợi hình';
                    imgEl.hidden = false;
                    svgEl.hidden = true;
                    svgEl.innerHTML = '';
                  }
                  if (frameEl) frameEl.classList.remove('is-loading');
                }
              });
            } else {
              imgEl.src = illu.src;
              imgEl.alt = 'Minh họa gợi hình';
              imgEl.hidden = false;
              svgEl.hidden = true;
              svgEl.innerHTML = '';
            }
          }
        }
      } else {
        if (visualCol) visualCol.style.display = 'none';
        if (svgEl) { svgEl.hidden = true; svgEl.innerHTML = ''; }
        if (imgEl) { imgEl.hidden = true; imgEl.removeAttribute('src'); }
      }
    } else if (visualCol) {
      visualCol.style.display = 'none';
    }

    // Predictive sliding-window preloader: prefetch next 15 cards and previous 5 cards in background
    if (typeof preloadNearbyIllustrations === 'function' && Array.isArray(WORDS) && Array.isArray(filteredOrder) && filteredOrder.length > 0) {
      preloadNearbyIllustrations(WORDS, filteredOrder, idx % filteredOrder.length, 15);
    }

    document.getElementById('hint').textContent = hasExample
      ? 'Nhấn vào thẻ để xem nghĩa và ví dụ'
      : 'Nhấn vào thẻ để xem nghĩa';
    updateProgress();
    updateCardPosition();
    updateStats();
    syncRevealControls();
    if (typeof syncSpeechButtons === 'function') syncSpeechButtons();
    if (animate && content && !prefersReduced) {
      if (animate === 'next') content.classList.add('enter-right');
      else if (animate === 'prev') content.classList.add('enter-left');
      else content.classList.add('enter-fade');
    }
  }

  if (!animate || !content || prefersReduced) {
    applyContent();
    return;
  }

  content.className = 'card-content';
  if (animate === 'next') content.classList.add('exit-left');
  else if (animate === 'prev') content.classList.add('exit-right');
  else content.classList.add('exit-fade');

  transitionTimer = setTimeout(() => {
    transitionTimer = null;
    applyContent();
  }, 150);
}
