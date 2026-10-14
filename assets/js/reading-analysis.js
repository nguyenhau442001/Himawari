/**
 * HSK 4 Reading & Analysis Module (Đọc hiểu & Phân tích ngữ pháp HSK 4)
 * Based on official Hanban/CTI standard mock test materials.
 * Redesigned: Monochromatic palette, unified navigation, Zen Mode, clean typography hierarchy.
 */

let readingAnalysisData = null;
let readingAnalysisDataPromise = null;
let readingCategory = 'all'; // 'all' | 'sentence_building' | 'sentence_logic' | 'cloze' | 'paragraph'
let readingTestFilter = 'all'; // 'all' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
let readingFilteredList = [];
let readingCurrentIndex = 0;
let readingSelectedTokenIndex = null;
let readingActiveMode = 'breakdown'; // 'breakdown' | 'practice'

// Display Preferences
let readingPrefs = {
  pinyin: true,
  hanviet: false, // Default off in top ruby to prevent character clutter; presented in inline vocab strip
  meaning: true,
  highlight: true,
  speechSpeed: 1.0,
  dictationMode: false,
  zenMode: false,
  grammarExpanded: false
};

// Practice State for Current Entry
let practiceBuilderSlots = [];
let practiceBuilderBank = [];
let practiceSolved = false;
let practiceSelectedOption = null;
let practiceFeedback = null;

// Initialize Preferences from localStorage
try {
  const saved = localStorage.getItem('hsk4_reading_prefs');
  if (saved) {
    readingPrefs = Object.assign(readingPrefs, JSON.parse(saved));
  }
} catch (e) {}

function saveReadingPrefs() {
  try {
    localStorage.setItem('hsk4_reading_prefs', JSON.stringify(readingPrefs));
  } catch (e) {}
}

function toggleReadingGrammarExpand() {
  readingPrefs.grammarExpanded = !readingPrefs.grammarExpanded;
  saveReadingPrefs();
  const drawer = document.getElementById('readingGrammarDrawer');
  const body = document.getElementById('readingGrammarBody');
  const hint = document.getElementById('grammarToggleHint');
  const chevron = document.getElementById('grammarToggleChevron');
  if (drawer && body) {
    drawer.classList.toggle('is-expanded', readingPrefs.grammarExpanded);
    body.style.display = readingPrefs.grammarExpanded ? '' : 'none';
    if (hint) hint.textContent = readingPrefs.grammarExpanded ? 'Thu gọn' : 'Xem chi tiết (G)';
    if (chevron) chevron.textContent = readingPrefs.grammarExpanded ? '▲' : '▼';
  } else {
    renderReadingAnalysisScreen();
  }
}

/**
 * Load Reading Analysis dataset
 */
async function ensureReadingAnalysisLoaded() {
  if (readingAnalysisData && readingAnalysisData.length) return readingAnalysisData;
  if (readingAnalysisDataPromise) return readingAnalysisDataPromise;

  readingAnalysisDataPromise = fetch('database/reading/hsk4_reading_analysis.json')
    .then(r => {
      if (!r.ok) throw new Error('Không thể tải cơ sở dữ liệu Đọc hiểu HSK 4.');
      return r.json();
    })
    .then(data => {
      readingAnalysisData = data;
      return data;
    })
    .catch(err => {
      console.error(err);
      readingAnalysisData = [];
      return [];
    });

  return readingAnalysisDataPromise;
}

/**
 * Filter pool according to selected category and test
 */
function updateReadingFilteredList() {
  if (!readingAnalysisData || !readingAnalysisData.length) {
    readingFilteredList = [];
    return;
  }
  readingFilteredList = readingAnalysisData.filter(item => {
    const matchCat = (readingCategory === 'all' || item.category === readingCategory);
    const matchTest = (readingTestFilter === 'all' || item.test_id === readingTestFilter);
    return matchCat && matchTest;
  });
  if (readingCurrentIndex >= readingFilteredList.length) {
    readingCurrentIndex = 0;
  }
}

function getFilteredCatCount(cat) {
  if (!readingAnalysisData) return 0;
  return readingAnalysisData.filter(d => {
    const matchTest = (readingTestFilter === 'all' || d.test_id === readingTestFilter);
    const matchCat = (cat === 'all' || d.category === cat);
    return matchTest && matchCat;
  }).length;
}

/**
 * Main entry point when user navigates to Reading Tab
 */
async function startReadingAnalysis() {
  const container = document.getElementById('screenReadingAnalysis');
  if (!container) return;

  container.style.display = '';
  document.body.classList.add('reading-view-active');
  document.body.classList.toggle('reading-zen-active', Boolean(readingPrefs.zenMode));
  await ensureReadingAnalysisLoaded();
  updateReadingFilteredList();

  const urlParams = new URLSearchParams(window.location.search);
  const qParam = urlParams.get('q');
  if (qParam) {
    const qIdx = parseInt(qParam, 10) - 1;
    if (!isNaN(qIdx) && qIdx >= 0 && qIdx < readingFilteredList.length) {
      readingCurrentIndex = qIdx;
    }
  }

  renderReadingAnalysisScreen();
}

/**
 * Change Category Filter
 */
function setReadingCategory(cat) {
  readingCategory = cat;
  updateReadingFilteredList();
  readingCurrentIndex = 0;
  resetPracticeState();
  renderReadingAnalysisScreen();
}

/**
 * Change Mock Test Filter ('all' | 1 | 2 | ... | 10)
 */
function setReadingTestFilter(testId) {
  readingTestFilter = testId;
  updateReadingFilteredList();
  readingCurrentIndex = 0;
  resetPracticeState();
  renderReadingAnalysisScreen();
}

/**
 * Switch Active Sub-mode: 'breakdown' | 'practice'
 */
function setReadingActiveMode(mode) {
  readingActiveMode = mode;
  renderReadingAnalysisScreen();
}

/**
 * Jump to next / prev question
 */
function nextReadingQuestion() {
  if (readingCurrentIndex < readingFilteredList.length - 1) {
    readingCurrentIndex++;
    readingSelectedTokenIndex = null;
    resetPracticeState();
    renderReadingAnalysisScreen();
    syncRouterReadingQ();
  }
}

function prevReadingQuestion() {
  if (readingCurrentIndex > 0) {
    readingCurrentIndex--;
    readingSelectedTokenIndex = null;
    resetPracticeState();
    renderReadingAnalysisScreen();
    syncRouterReadingQ();
  }
}

function jumpToReadingIndex(idx) {
  idx = parseInt(idx, 10);
  if (!isNaN(idx) && idx >= 0 && idx < readingFilteredList.length) {
    readingCurrentIndex = idx;
    readingSelectedTokenIndex = null;
    resetPracticeState();
    renderReadingAnalysisScreen();
    syncRouterReadingQ();
  }
}

function syncRouterReadingQ() {
  if (typeof SpaRouter !== 'undefined' && typeof SpaRouter.replaceView === 'function') {
    SpaRouter.replaceView({ view: 'tab', tab: 'reading', q: readingCurrentIndex + 1 });
  }
}

function resetPracticeState() {
  practiceSolved = false;
  practiceSelectedOption = null;
  practiceFeedback = null;
  const entry = readingFilteredList[readingCurrentIndex];
  if (!entry) return;

  if (entry.practice) {
    if (entry.practice.scrambled_chunks) {
      practiceBuilderBank = entry.practice.scrambled_chunks.slice();
      practiceBuilderSlots = [];
    } else if (entry.practice.scrambled_items) {
      practiceBuilderBank = entry.practice.scrambled_items.slice();
      practiceBuilderSlots = [];
    }
  }
}

/**
 * Toggle Display Elements
 */
function toggleReadingPinyin() {
  readingPrefs.pinyin = !readingPrefs.pinyin;
  saveReadingPrefs();
  renderReadingAnalysisScreen();
}

function toggleReadingHanViet() {
  readingPrefs.hanviet = !readingPrefs.hanviet;
  saveReadingPrefs();
  renderReadingAnalysisScreen();
}

function toggleReadingMeaning() {
  readingPrefs.meaning = !readingPrefs.meaning;
  saveReadingPrefs();
  renderReadingAnalysisScreen();
}

function toggleReadingHighlight() {
  readingPrefs.highlight = !readingPrefs.highlight;
  saveReadingPrefs();
  renderReadingAnalysisScreen();
}

function toggleReadingDictation() {
  readingPrefs.dictationMode = !readingPrefs.dictationMode;
  saveReadingPrefs();
  renderReadingAnalysisScreen();
}

function toggleReadingSpeed() {
  readingPrefs.speechSpeed = readingPrefs.speechSpeed === 1.0 ? 0.75 : 1.0;
  saveReadingPrefs();
  const speedBtn = document.getElementById('readingSpeedBtn');
  if (speedBtn) speedBtn.textContent = `${readingPrefs.speechSpeed}x`;
}

function toggleZenMode() {
  readingPrefs.zenMode = !readingPrefs.zenMode;
  saveReadingPrefs();
  document.body.classList.toggle('reading-zen-active', Boolean(readingPrefs.zenMode));
  renderReadingAnalysisScreen();
}

/**
 * Audio TTS Playback
 */
function playReadingSentenceAudio(entry) {
  if (!entry || !entry.zh) return;
  const btn = document.getElementById('readingPlayAudioBtn');
  if (typeof speakText === 'function') {
    speakText(entry.zh, btn, readingPrefs.speechSpeed);
  }
}

/**
 * Render the whole Reading & Analysis UI
 */
function renderReadingAnalysisScreen() {
  const container = document.getElementById('screenReadingAnalysis');
  if (!container) return;

  if (!readingFilteredList.length) {
    container.innerHTML = `
      <div class="reading-analysis-container">
        <div class="reading-empty-state">
          <p>Không có câu hỏi nào phù hợp với bộ lọc hiện tại.</p>
          <button type="button" class="reading-reset-filter-btn" onclick="setReadingTestFilter('all'); setReadingCategory('all');">
            Đặt lại bộ lọc
          </button>
        </div>
      </div>
    `;
    return;
  }

  const currentEntry = readingFilteredList[readingCurrentIndex];

  // Initialize practice items if not already done
  if (practiceBuilderBank.length === 0 && practiceBuilderSlots.length === 0) {
    resetPracticeState();
  }

  // Initialize selected word for sidebar if not already set
  if (readingSelectedTokenIndex === null || !currentEntry.tokens || !currentEntry.tokens[readingSelectedTokenIndex]) {
    readingSelectedTokenIndex = getInitialSelectedTokenIndex(currentEntry);
  }

  container.innerHTML = `
    <div class="reading-analysis-container ${readingPrefs.zenMode ? 'zen-mode-active' : ''}">
      <!-- ZEN TOP BAR (Only in Zen Mode) -->
      ${readingPrefs.zenMode ? `
        <div class="reading-zen-bar">
          <button type="button" class="zen-exit-btn" onclick="toggleZenMode()" title="Thoát chế độ tập trung (Z hoặc Esc)">
            <span aria-hidden="true">✕</span> Thoát Zen
          </button>
          <div class="zen-center-info">
            <span class="zen-counter-badge">Câu ${readingCurrentIndex + 1} / ${readingFilteredList.length}</span>
            <span class="zen-category-tag">${getCategoryLabel(currentEntry.category)}</span>
          </div>
          <div class="zen-actions">
            <button type="button" class="zen-btn-action" onclick="playReadingSentenceAudio(readingFilteredList[readingCurrentIndex])" title="Nghe phát âm (Space)">
              🔊 Nghe
            </button>
            <button type="button" class="zen-btn-action ${readingPrefs.pinyin ? 'active' : ''}" onclick="toggleReadingPinyin()" title="Bật/Tắt Pinyin (P)">
              Py
            </button>
            <button type="button" class="zen-btn-action ${readingPrefs.meaning ? 'active' : ''}" onclick="toggleReadingMeaning()" title="Bật/Tắt Dịch nghĩa (V)">
              Dịch
            </button>
            <button type="button" class="zen-btn-action ${readingPrefs.grammarExpanded ? 'active' : ''}" onclick="toggleReadingGrammarExpand()" title="Bật/Tắt Ngữ pháp (G)">
              ⚡ Ngữ pháp
            </button>
          </div>
        </div>
      ` : `
        <!-- UNIFIED COMPACT HEADER STRIP (Replaces multi-tier navigation) -->
        <header class="reading-unified-nav" role="toolbar" aria-label="Thanh điều hướng đọc hiểu">
          <div class="reading-nav-left">
            <button type="button" class="reading-back-btn" onclick="setPrimaryTab('vocab')" title="Quay lại danh sách từ vựng">
              <span aria-hidden="true">←</span>
              <span>Trang chủ</span>
            </button>

            <div class="reading-brand-badge">
              <span class="reading-brand-icon">📖</span>
              <span class="reading-brand-title">Đọc hiểu HSK 4</span>
              <span class="reading-brand-tag">Hanban</span>
            </div>

            <div class="reading-filter-controls">
              <div class="reading-select-pill" title="Lọc theo Đề thi">
                <span class="reading-pill-label">Đề:</span>
                <select class="reading-pill-select" id="readingTestSelect" onchange="setReadingTestFilter(this.value === 'all' ? 'all' : parseInt(this.value, 10))">
                  <option value="all" ${readingTestFilter === 'all' ? 'selected' : ''}>Tất cả đề (10 đề)</option>
                  ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(t => {
                    const count = readingAnalysisData.filter(d => d.test_id === t).length;
                    if (!count) return '';
                    return `<option value="${t}" ${readingTestFilter === t ? 'selected' : ''}>Đề ${t} (${count})</option>`;
                  }).join('')}
                </select>
              </div>

              <div class="reading-select-pill" title="Lọc theo Dạng bài">
                <span class="reading-pill-label">Dạng:</span>
                <select class="reading-pill-select" id="readingCategorySelect" onchange="setReadingCategory(this.value)">
                  <option value="all" ${readingCategory === 'all' ? 'selected' : ''}>Tất cả (${getFilteredCatCount('all')})</option>
                  <option value="sentence_building" ${readingCategory === 'sentence_building' ? 'selected' : ''}>🧩 Xếp câu (${getFilteredCatCount('sentence_building')})</option>
                  <option value="sentence_logic" ${readingCategory === 'sentence_logic' ? 'selected' : ''}>🔀 Logic A-B-C (${getFilteredCatCount('sentence_logic')})</option>
                  <option value="cloze" ${readingCategory === 'cloze' ? 'selected' : ''}>📝 Điền từ (${getFilteredCatCount('cloze')})</option>
                  <option value="paragraph" ${readingCategory === 'paragraph' ? 'selected' : ''}>📑 Đoạn văn (${getFilteredCatCount('paragraph')})</option>
                </select>
              </div>
            </div>
          </div>

          <div class="reading-nav-right">
            <!-- Mode Segmented Control -->
            <div class="reading-segmented-control" role="tablist" aria-label="Chế độ">
              <button type="button" class="reading-segment-btn ${readingActiveMode === 'breakdown' ? 'active' : ''}" onclick="setReadingActiveMode('breakdown')" role="tab" aria-selected="${readingActiveMode === 'breakdown'}">
                Phân tích
              </button>
              <button type="button" class="reading-segment-btn ${readingActiveMode === 'practice' ? 'active' : ''}" onclick="setReadingActiveMode('practice')" role="tab" aria-selected="${readingActiveMode === 'practice'}">
                Thực chiến
              </button>
            </div>

            <!-- Quick Display Toggles (Floating High-Contrast Pills) -->
            <div class="reading-quick-toggles" role="group" aria-label="Tùy chọn hiển thị">
              <button type="button" class="reading-toggle-pill ${readingPrefs.pinyin ? 'active' : ''}" onclick="toggleReadingPinyin()" title="Bật/Tắt Pinyin (P)">
                <span class="toggle-dot" aria-hidden="true"></span>
                <span>Py</span>
              </button>
              <button type="button" class="reading-toggle-pill ${readingPrefs.hanviet ? 'active' : ''}" onclick="toggleReadingHanViet()" title="Bật/Tắt Hán - Việt trên câu (H)">
                <span class="toggle-dot" aria-hidden="true"></span>
                <span>HV</span>
              </button>
              <button type="button" class="reading-toggle-pill ${readingPrefs.meaning ? 'active' : ''}" onclick="toggleReadingMeaning()" title="Bật/Tắt Dịch nghĩa (V)">
                <span class="toggle-dot" aria-hidden="true"></span>
                <span>Dịch</span>
              </button>
              <button type="button" class="reading-toggle-pill ${readingPrefs.highlight ? 'active' : ''}" onclick="toggleReadingHighlight()" title="Bật/Tắt Điểm bẫy ngữ pháp">
                <span class="toggle-dot" aria-hidden="true"></span>
                <span>Bẫy thi</span>
              </button>
            </div>

            <!-- Zen Mode Toggle -->
            <button type="button" class="reading-zen-pill ${readingPrefs.zenMode ? 'active' : ''}" onclick="toggleZenMode()" title="Chế độ tập trung Zen Mode (Z)">
              <span aria-hidden="true">🧘</span>
              <span class="zen-text">Zen</span>
            </button>
          </div>
        </header>
      `}

      <!-- TWO-COLUMN WORKSPACE GRID (Left 65%, Right 35%) -->
      <div class="reading-workspace-grid">
        <!-- LEFT COLUMN: Main Sentence & Navigation (65%) -->
        <main class="reading-col-main" aria-label="Khu vực bài đọc chính">
          <section class="reading-passage-card" aria-label="Nội dung bài đọc">
            <div class="reading-card-meta-row">
              <div class="reading-meta-left">
                <span class="reading-source-text">${currentEntry.source || 'HSK 4 Chuẩn'}</span>
                ${currentEntry.exam_part ? `<span class="reading-exam-tag">${currentEntry.exam_part}</span>` : ''}
              </div>

              <div class="reading-audio-controls">
                <button type="button" class="reading-btn-speaker" id="readingPlayAudioBtn" onclick="playReadingSentenceAudio(readingFilteredList[readingCurrentIndex])" title="Nghe phát âm câu (Space)">
                  🔊 Nghe
                </button>
                <button type="button" class="reading-btn-speed" id="readingSpeedBtn" onclick="toggleReadingSpeed()" title="Đổi tốc độ đọc">
                  ${readingPrefs.speechSpeed}x
                </button>
                <button type="button" class="reading-btn-dictation ${readingPrefs.dictationMode ? 'active' : ''}" onclick="toggleReadingDictation()" title="Luyện chép chính tả">
                  ✍️ Chép chính tả
                </button>
              </div>
            </div>

            <!-- MAIN CHINESE SENTENCE -->
            <div class="reading-zh-hero">
              ${readingPrefs.dictationMode ? `
                <div class="reading-dictation-prompt">
                  🎧 Chế độ chép chính tả đang bật. Hãy bấm nút <strong>Nghe</strong> và gõ lại câu vào ô bên dưới!
                </div>
              ` : `
                <div class="reading-zh-flow" id="readingZhLine">
                  ${renderCleanTokensHtml(currentEntry)}
                </div>
              `}
            </div>

            <!-- DICTATION INPUT BOX -->
            ${readingPrefs.dictationMode ? renderDictationBoxHtml(currentEntry) : ''}

            <!-- SENTENCE TRANSLATIONS (Clear typography hierarchy) -->
            ${!readingPrefs.dictationMode ? renderSentenceTranslationsHtml(currentEntry) : ''}

            <!-- PRACTICE PANELS (When in practice mode) -->
            ${readingActiveMode === 'practice' ? renderPracticePanelsHtml(currentEntry) : ''}
          </section>

          <!-- BOTTOM NAVIGATION FOOTER (At bottom of Left Column) -->
          <footer class="reading-navigation-footer">
            <button type="button" class="reading-nav-btn prev-btn" onclick="prevReadingQuestion()" ${readingCurrentIndex === 0 ? 'disabled' : ''} title="Câu trước (← hoặc K)">
              ← Câu trước
            </button>

            <div class="reading-footer-middle">
              <select class="reading-jump-select" aria-label="Chọn nhanh câu hỏi" onchange="jumpToReadingIndex(this.value)">
                ${readingFilteredList.map((item, idx) => `
                  <option value="${idx}" ${idx === readingCurrentIndex ? 'selected' : ''}>
                    ${idx + 1}/${readingFilteredList.length} · [${getCategoryLabel(item.category)}] ${item.title || item.zh.substring(0, 18) + '...'}
                  </option>
                `).join('')}
              </select>
            </div>

            <button type="button" class="reading-nav-btn next-btn" onclick="nextReadingQuestion()" ${readingCurrentIndex === readingFilteredList.length - 1 ? 'disabled' : ''} title="Câu sau (→ hoặc J)">
              Câu tiếp theo →
            </button>
          </footer>
        </main>

        <!-- RIGHT COLUMN: Sidebar Study Materials (35%) -->
        <aside class="reading-col-sidebar" aria-label="Tài liệu bổ trợ">
          <!-- 1. VOCABULARY WORD TAGS LIST / GRID (At top of sidebar) -->
          <div class="sidebar-study-card sidebar-vocab-card">
            <div class="sidebar-card-header">
              <div class="sidebar-header-left">
                <span class="sidebar-header-icon">📚</span>
                <span class="sidebar-header-title">Từ vựng trong câu</span>
              </div>
              <span class="sidebar-hint-tag">Bấm để xem chi tiết</span>
            </div>
            ${renderSidebarVocabGridHtml(currentEntry)}
          </div>

          <!-- 2. DEDICATED DETAIL PANEL FOR SELECTED WORD -->
          <div class="sidebar-study-card sidebar-word-detail-card" id="readingWordDetailPanel">
            ${renderSidebarWordDetailHtml(currentEntry)}
          </div>

          <!-- 3. HIGHLIGHTED GRAMMAR ANALYSIS & EXAM TRAPS BOX -->
          <div class="sidebar-study-card sidebar-grammar-card">
            ${renderSidebarGrammarHtml(currentEntry)}
          </div>
        </aside>
      </div>
    </div>
  `;
}

function getCategoryLabel(cat) {
  switch (cat) {
    case 'sentence_building': return 'Xếp câu';
    case 'sentence_logic': return 'Logic A-B-C';
    case 'cloze': return 'Điền từ';
    case 'paragraph': return 'Đoạn văn';
    default: return 'Đọc hiểu';
  }
}

/**
 * Determine default selected token for sidebar detail
 */
function getInitialSelectedTokenIndex(entry) {
  if (!entry || !entry.tokens || !entry.tokens.length) return null;
  // 1. Look for first grammar token that isn't punctuation
  const grammarIdx = entry.tokens.findIndex(t => {
    const text = (t.text || '').trim();
    return t.type === 'grammar' && !/^[，。？！、；：“”‘’（）《》…—]+$/.test(text);
  });
  if (grammarIdx !== -1) return grammarIdx;

  // 2. Look for first core token
  const coreIdx = entry.tokens.findIndex(t => {
    const text = (t.text || '').trim();
    return t.type === 'core' && !/^[，。？！、；：“”‘’（）《》…—]+$/.test(text);
  });
  if (coreIdx !== -1) return coreIdx;

  // 3. Fallback to first word token
  const firstWordIdx = entry.tokens.findIndex(t => {
    const text = (t.text || '').trim();
    return !/^[，。？！、；：“”‘’（）《》…—]+$/.test(text);
  });
  return firstWordIdx !== -1 ? firstWordIdx : 0;
}

/**
 * Select a word token to inspect in the dedicated sidebar panel
 */
function selectReadingWord(tokenIdx, shouldSpeak = false) {
  tokenIdx = parseInt(tokenIdx, 10);
  const entry = readingFilteredList[readingCurrentIndex];
  if (!entry || !entry.tokens || isNaN(tokenIdx) || !entry.tokens[tokenIdx]) return;

  readingSelectedTokenIndex = tokenIdx;
  const tok = entry.tokens[tokenIdx];

  // Update active state in Chinese hero line
  document.querySelectorAll('.reading-token-word').forEach((el) => {
    const idx = parseInt(el.getAttribute('data-token-idx'), 10);
    el.classList.toggle('active-inspect', idx === tokenIdx);
  });

  // Update active state in sidebar vocabulary pill list
  document.querySelectorAll('.sidebar-vocab-pill').forEach((el) => {
    const idx = parseInt(el.getAttribute('data-token-idx'), 10);
    el.classList.toggle('active-selected-tag', idx === tokenIdx);
  });

  // Re-render the dedicated detail panel
  const detailPanel = document.getElementById('readingWordDetailPanel');
  if (detailPanel) {
    detailPanel.innerHTML = renderSidebarWordDetailHtml(entry);
  }

  // Audio speech feedback if requested
  if (shouldSpeak && tok && tok.text) {
    speakToken(tok.text);
  }
}

/**
 * Render Tokens naturally without noisy box borders or orange background clutter
 */
function renderCleanTokensHtml(entry) {
  if (!entry || !entry.tokens) return `<span class="reading-zh-text">${entry.zh || ''}</span>`;

  return entry.tokens.map((tok, i) => {
    let highlightClass = '';
    if (readingPrefs.highlight) {
      if (tok.type === 'grammar') highlightClass = 'token-hl-grammar';
      else if (tok.type === 'core') highlightClass = 'token-hl-core';
      else if (tok.type === 'advanced') highlightClass = 'token-hl-advanced';
    }

    const isPunct = /^[，。？！、；：“”‘’（）《》…—]+$/.test(tok.text.trim());

    if (isPunct) {
      return `<span class="reading-token-punct">${tok.text}</span>`;
    }

    const isSelected = (i === readingSelectedTokenIndex);

    return `
      <span class="reading-token-word ${highlightClass} ${isSelected ? 'active-inspect' : ''}" data-token-idx="${i}" onclick="selectReadingWord(${i}, true)" title="${tok.meaning ? `${tok.text} [${tok.hanviet || ''}]: ${tok.meaning}` : 'Bấm để tra từ này'}">
        ${readingPrefs.pinyin ? `<span class="token-py">${tok.pinyin || ''}</span>` : ''}
        <span class="token-zh">${tok.text}</span>
        ${readingPrefs.hanviet ? `<span class="token-hv">${tok.hanviet || ''}</span>` : ''}
      </span>
    `;
  }).join('');
}

/**
 * Render clean sentence translations (Vietnamese & Pinyin) with clear typography
 */
function renderSentenceTranslationsHtml(entry) {
  const viMeaning = entry.meaning || entry.vietnamese || '';
  if (!viMeaning && !entry.pinyin) return '';

  return `
    <div class="reading-sentence-translations">
      ${readingPrefs.meaning && viMeaning ? `
        <div class="reading-translation-meaning">
          ${viMeaning}
        </div>
      ` : ''}
      ${!readingPrefs.pinyin && entry.pinyin ? `
        <div class="reading-translation-pinyin">
          ${entry.pinyin}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Render Sidebar Vocabulary List / Grid (Neat tags, top of sidebar)
 */
function renderSidebarVocabGridHtml(entry) {
  if (!entry || !entry.tokens || !entry.tokens.length) {
    return `<div class="sidebar-empty-state">Không có từ vựng bổ trợ cho câu này.</div>`;
  }

  const validTokens = entry.tokens
    .map((tok, idx) => ({ tok, idx }))
    .filter(({ tok }) => {
      const text = (tok.text || '').trim();
      return text && !/^[，。？！、；：“”‘’（）《》…—]+$/.test(text);
    });

  if (!validTokens.length) {
    return `<div class="sidebar-empty-state">Không có từ vựng.</div>`;
  }

  return `
    <div class="sidebar-vocab-grid">
      ${validTokens.map(({ tok, idx }) => {
        const isSelected = (idx === readingSelectedTokenIndex);
        let badgeType = '';
        if (tok.type === 'grammar') badgeType = 'pill-grammar';
        else if (tok.type === 'core') badgeType = 'pill-core';
        else if (tok.type === 'advanced') badgeType = 'pill-adv';

        let shortMeaning = tok.meaning || '';
        if (!shortMeaning && tok.role) {
          const m = tok.role.match(/\(([^)]+)\)/);
          shortMeaning = m ? m[1] : tok.role;
        }

        return `
          <button type="button" 
            class="sidebar-vocab-pill ${badgeType} ${isSelected ? 'active-selected-tag' : ''}" 
            data-token-idx="${idx}"
            onclick="selectReadingWord(${idx}, true)"
            title="${tok.text} ${tok.hanviet ? `[${tok.hanviet}]` : ''}: ${shortMeaning || tok.role || ''}">
            <div class="pill-top-row">
              <span class="pill-zh">${tok.text}</span>
              ${tok.pinyin ? `<span class="pill-py">${tok.pinyin}</span>` : ''}
            </div>
            <div class="pill-bottom-row">
              ${tok.hanviet ? `<span class="pill-hv">[${tok.hanviet}]</span>` : ''}
              ${shortMeaning ? `<span class="pill-mean">${shortMeaning}</span>` : ''}
            </div>
          </button>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * Render Dedicated Detail Panel for Selected Word (Middle of sidebar)
 */
function renderSidebarWordDetailHtml(entry) {
  if (!entry || !entry.tokens || readingSelectedTokenIndex === null || !entry.tokens[readingSelectedTokenIndex]) {
    return `
      <div class="sw-placeholder">
        <span class="sw-placeholder-icon">👆</span>
        <div class="sw-placeholder-text">Bấm vào bất kỳ từ nào ở danh sách phía trên hoặc trên câu chính để xem phân tích chi tiết.</div>
      </div>
    `;
  }

  const tok = entry.tokens[readingSelectedTokenIndex];
  const gp = entry.grammar_point || {};

  // Compute label & badge
  let badgeLabel = 'Từ vựng';
  let badgeClass = 'sw-badge-normal';
  if (tok.type === 'grammar') {
    badgeLabel = '⚡ Điểm ngữ pháp bẫy';
    badgeClass = 'sw-badge-grammar';
  } else if (tok.type === 'core') {
    badgeLabel = 'Từ cốt lõi HSK 4';
    badgeClass = 'sw-badge-core';
  } else if (tok.type === 'advanced') {
    badgeLabel = 'Từ vựng mở rộng';
    badgeClass = 'sw-badge-adv';
  }

  // Meaning resolution
  let meaning = tok.meaning || '';
  let roleDesc = tok.role || '';
  if (!meaning && roleDesc) {
    const m = roleDesc.match(/\(([^)]+)\)/);
    if (m) meaning = m[1];
    else meaning = roleDesc;
  }

  // Check if grammar point specifically mentions this word
  let specificGrammarNote = '';
  if (gp.trap_note && (gp.trap_note.includes(tok.text) || gp.name?.includes(tok.text))) {
    specificGrammarNote = gp.trap_note;
  } else if (tok.type === 'grammar' && gp.trap_note) {
    specificGrammarNote = gp.trap_note;
  }

  // Check matching breakdown row
  let breakdownMatch = null;
  if (entry.breakdown && Array.isArray(entry.breakdown)) {
    breakdownMatch = entry.breakdown.find(b => b.text && b.text.includes(tok.text));
  }

  return `
    <div class="sw-detail-inner">
      <div class="sw-header-bar">
        <div class="sw-header-title-box">
          <span class="sw-header-icon">🔍</span>
          <span class="sw-header-label">Từ vựng trọng điểm</span>
        </div>
        <span class="sw-badge ${badgeClass}">${badgeLabel}</span>
      </div>

      <div class="sw-main-hero">
        <div class="sw-hero-left">
          <div class="sw-zh-row">
            <span class="sw-zh">${tok.text}</span>
            <button type="button" class="sw-audio-btn" onclick="speakToken('${tok.text}')" title="Phát âm từ này (Audio)">
              🔊
            </button>
            <div class="sw-phonetics">
              ${tok.pinyin ? `<span class="sw-py">${tok.pinyin}</span>` : ''}
              ${tok.hanviet ? `<span class="sw-hv">[${tok.hanviet}]</span>` : ''}
            </div>
          </div>
        </div>
      </div>

      <!-- Meaning Block -->
      <div class="sw-meaning-block">
        <span class="sw-meaning-label">Nghĩa tiếng Việt:</span>
        <span class="sw-meaning-text">${meaning || 'Chưa có chú giải nghĩa tiếng Việt'}</span>
      </div>

      <!-- Grammar & Syntax Notes -->
      ${(roleDesc || specificGrammarNote) ? `
        <div class="sw-grammar-notes-block">
          ${roleDesc ? `<div class="sw-role-line"><span class="sw-role-tag">Cú pháp:</span> ${roleDesc}</div>` : ''}
          ${specificGrammarNote ? `<div class="sw-trap-tip"><span class="sw-tip-tag">⚠️ Lưu ý thi:</span> ${specificGrammarNote}</div>` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Render Highlighted Grammar Analysis & Exam Traps Box (Bottom of sidebar)
 */
function renderSidebarGrammarHtml(entry) {
  const gp = entry.grammar_point || {};
  if (!gp.name && !gp.pattern && !gp.trap_note && !gp.explanation) {
    return `
      <div class="sidebar-empty-grammar">
        Không có lưu ý bẫy ngữ pháp đặc biệt cho câu này.
      </div>
    `;
  }

  return `
    <div class="sidebar-grammar-inner">
      <div class="sidebar-card-header grammar-highlight-header">
        <div class="sidebar-header-left">
          <span class="grammar-lightning-icon">⚡</span>
          <span class="sidebar-header-title">Phân tích ngữ pháp & Mẹo bẫy thi</span>
        </div>
        ${gp.level ? `<span class="sidebar-grammar-level">${gp.level}</span>` : ''}
      </div>

      ${gp.name ? `
        <div class="sidebar-grammar-name">
          <span class="sgn-label">Trọng điểm:</span>
          <span class="sgn-title">${gp.name}</span>
        </div>
      ` : ''}

      ${gp.pattern ? `
        <div class="sidebar-grammar-pattern">
          <span class="sgp-label">Cấu trúc:</span>
          <code class="sgp-code">${gp.pattern}</code>
        </div>
      ` : ''}

      ${gp.trap_note ? `
        <div class="sidebar-grammar-trap">
          <div class="sgt-header">
            <span class="sgt-icon">⚠️</span>
            <span class="sgt-title">Mẹo phòng bẫy đề thi:</span>
          </div>
          <div class="sgt-content">${gp.trap_note}</div>
        </div>
      ` : ''}

      ${gp.explanation ? `
        <div class="sidebar-grammar-exp">
          <div class="sge-title">💡 Giải thích ứng dụng:</div>
          <div class="sge-content">${gp.explanation}</div>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Render Dictation Input Box
 */
function renderDictationBoxHtml(entry) {
  return `
    <div class="reading-dictation-box">
      <div class="dictation-input-row">
        <input type="text" id="dictationInput" class="dictation-input" placeholder="Gõ chữ Hán hoặc Pinyin nghe được..." autocomplete="off">
        <button type="button" class="dictation-check-btn" onclick="checkDictationAnswer()">Kiểm tra</button>
      </div>
      <div class="dictation-feedback" id="dictationFeedback"></div>
    </div>
  `;
}

/**
 * Legacy inspectToken alias to selectReadingWord
 */
function inspectToken(tokenIdx) {
  selectReadingWord(tokenIdx, true);
}

function speakToken(word) {
  if (typeof speakText === 'function') {
    speakText(word, null, 0.85);
  }
}

function closeInspector() {
  const inspector = document.getElementById('readingTokenInspector');
  if (inspector) inspector.style.display = 'none';
  document.querySelectorAll('.reading-token-word').forEach(el => el.classList.remove('active-inspect'));
}

/**
 * Render Grammar & Component Breakdown Panels as a Collapsible Focused Drawer
 */
function renderBreakdownPanelsHtml(entry) {
  const gp = entry.grammar_point || {};
  const breakdown = entry.breakdown || [];
  const isExpanded = Boolean(readingPrefs.grammarExpanded);

  return `
    <div class="reading-grammar-drawer ${isExpanded ? 'is-expanded' : ''}" id="readingGrammarDrawer">
      <button type="button" class="reading-grammar-toggle-bar" onclick="toggleReadingGrammarExpand()" aria-expanded="${isExpanded}">
        <div class="grammar-toggle-left">
          <span class="grammar-toggle-icon">⚡</span>
          <span class="grammar-toggle-title">Phân tích ngữ pháp & Mẹo bẫy thi</span>
          ${gp.name ? `<span class="grammar-toggle-badge">${gp.name}</span>` : ''}
        </div>
        <div class="grammar-toggle-right">
          <span class="grammar-toggle-hint" id="grammarToggleHint">${isExpanded ? 'Thu gọn' : 'Xem chi tiết (G)'}</span>
          <span class="grammar-toggle-chevron" id="grammarToggleChevron">${isExpanded ? '▲' : '▼'}</span>
        </div>
      </button>

      <div class="reading-grammar-body" id="readingGrammarBody" style="${isExpanded ? '' : 'display: none;'}">
        <!-- GRAMMAR TRAP & PATTERN CARD (Clean monochromatic with accent border) -->
        <div class="grammar-trap-card">
          <div class="grammar-trap-header">
            <div class="grammar-trap-title">
              <span>⚡ ${gp.name || 'Phân tích ngữ pháp trọng tâm'}</span>
            </div>
            <span class="reading-exam-tag">${gp.level || 'HSK 4 Trọng điểm'}</span>
          </div>

          ${gp.pattern ? `<div class="grammar-trap-pattern"><strong>Cấu trúc:</strong> <code>${gp.pattern}</code></div>` : ''}

          ${gp.trap_note ? `
            <div class="grammar-trap-note">
              <strong>⚠️ Mẹo phòng bẫy thi HSK 4:</strong> ${gp.trap_note}
            </div>
          ` : ''}

          ${gp.explanation ? `
            <div class="grammar-explanation-text">
              <strong>💡 Phân tích chi tiết:</strong> ${gp.explanation}
            </div>
          ` : ''}
        </div>

        <!-- SVO / COMPONENT BREAKDOWN TABLE (Clean, monochromatic) -->
        ${breakdown.length > 0 ? `
          <div class="sentence-breakdown-card">
            <div class="breakdown-card-title">
              <span>🔬 Phân tách thành phần cấu trúc câu (Word Order Breakdown)</span>
            </div>
            <div class="breakdown-table-wrapper">
              <table class="breakdown-table">
                <thead>
                  <tr>
                    <th style="width: 140px;">Thành phần ngữ pháp</th>
                    <th style="width: 180px;">Từ ngữ trong câu</th>
                    <th>Chức năng & Ý nghĩa ngữ pháp</th>
                  </tr>
                </thead>
                <tbody>
                  ${breakdown.map(b => `
                    <tr>
                      <td><span class="breakdown-role-badge">${b.role}</span></td>
                      <td><span class="breakdown-text">${b.text}</span></td>
                      <td><span class="breakdown-desc">${b.desc || ''}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderPracticeFeedbackHtml() {
  if (!practiceFeedback) return '<div id="practiceResultFeedback"></div>';
  return `
    <div id="practiceResultFeedback">
      <div class="practice-result-banner ${practiceFeedback.type}">
        ${practiceFeedback.html}
      </div>
    </div>
  `;
}

/**
 * Render Practice Interactive Modes
 */
function renderPracticePanelsHtml(entry) {
  const p = entry.practice || {};

  // Self-heal practice state if empty or mismatched
  if (p.type === 'sentence_building') {
    if ((practiceBuilderBank.length === 0 && practiceBuilderSlots.length === 0 && p.scrambled_chunks) ||
        practiceBuilderBank.some(x => typeof x !== 'string') ||
        practiceBuilderSlots.some(x => typeof x !== 'string')) {
      resetPracticeState();
    }
  } else if (p.type === 'sentence_logic') {
    if ((practiceBuilderBank.length === 0 && practiceBuilderSlots.length === 0 && p.scrambled_items) ||
        practiceBuilderBank.some(x => !x || typeof x !== 'object') ||
        practiceBuilderSlots.some(x => !x || typeof x !== 'object')) {
      resetPracticeState();
    }
  }

  // Case 1: Sentence Building (Xếp câu)
  if (p.type === 'sentence_building') {
    return `
      <div class="reading-practice-card">
        <div class="practice-header">
          <div class="practice-title">🧩 Dạng 1: Sắp xếp các khối từ thành câu hoàn chỉnh</div>
          <div class="practice-hint-text">Bấm chọn khối từ để xếp theo thứ tự ngữ pháp đúng</div>
        </div>

        <!-- Target Slots -->
        <div class="practice-slots-area ${practiceSolved ? 'is-correct' : ''}" id="practiceSlotsArea">
          ${practiceBuilderSlots.length === 0 ? `
            <span class="practice-empty-placeholder">Bấm chọn các khối từ bên dưới theo trật tự câu đúng...</span>
          ` : practiceBuilderSlots.map((chunk, i) => `
            <button type="button" class="builder-tile slot-tile" onclick="removeFromSlots(${i})">
              ${chunk}
            </button>
          `).join('')}
        </div>

        <!-- Available Bank -->
        <div class="practice-bank-area" id="practiceBankArea">
          ${practiceBuilderBank.map((chunk, i) => `
            <button type="button" class="builder-tile" onclick="moveToSlots(${i})">
              ${chunk}
            </button>
          `).join('')}
        </div>

        <!-- Practice Actions -->
        <div class="practice-actions-bar">
          <div class="practice-btn-group">
            <button type="button" class="practice-action-btn practice-btn-secondary" onclick="resetPracticeState(); renderReadingAnalysisScreen();">
              ↺ Làm lại
            </button>
            <button type="button" class="practice-action-btn practice-btn-secondary" onclick="hintPracticeBuilder()">
              💡 Gợi ý
            </button>
          </div>

          <button type="button" class="practice-action-btn practice-btn-primary" onclick="checkPracticeBuilder()">
            Kiểm tra đáp án
          </button>
        </div>

        ${renderPracticeFeedbackHtml()}
      </div>
    `;
  }

  // Case 2: Cloze Test (Điền khuyết)
  if (p.type === 'cloze') {
    return `
      <div class="reading-practice-card">
        <div class="practice-header">
          <div class="practice-title">📝 Dạng 2: Bài tập Điền khuyết (Cloze Test) theo ngữ cảnh</div>
          <div class="practice-hint-text">Chọn từ thích hợp nhất để điền vào chỗ trống</div>
        </div>

        <div class="cloze-blank-text">
          ${(p.blank_sentence || '').replace('（ ____ ）', `<span class="cloze-blank-spot">${practiceSelectedOption || '？'}</span>`)}
        </div>

        <div class="cloze-options-grid">
          ${(p.options || []).map(opt => {
            let optClass = '';
            if (practiceSelectedOption) {
              if (opt.word === p.target_word) optClass = 'selected-correct';
              else if (opt.word === practiceSelectedOption) optClass = 'selected-wrong';
            }
            return `
              <button type="button" class="cloze-option-btn ${optClass}" onclick="selectClozeOption('${opt.word}')" ${practiceSelectedOption ? 'disabled' : ''}>
                <div>
                  <div class="cloze-opt-zh">${opt.word}</div>
                  <div class="cloze-opt-sub">${opt.pinyin} · [${opt.hanviet}]</div>
                </div>
                <div class="cloze-opt-sub">${opt.meaning}</div>
              </button>
            `;
          }).join('')}
        </div>

        ${p.clue ? `
          <div class="cloze-clue-hint">
            💡 <strong>Gợi ý ngữ cảnh:</strong> ${p.clue}
          </div>
        ` : ''}

        ${renderPracticeFeedbackHtml()}
      </div>
    `;
  }

  // Case 3: Sentence Logic (Sắp xếp A-B-C)
  if (p.type === 'sentence_logic') {
    return `
      <div class="reading-practice-card">
        <div class="practice-header">
          <div class="practice-title">🔀 Dạng 3: Sắp xếp thứ tự logic đoạn văn (A - B - C)</div>
          <div class="practice-hint-text">Chọn thứ tự các câu để tạo thành đoạn văn logic</div>
        </div>

        <!-- Target Slots -->
        <div class="practice-slots-area ${practiceSolved ? 'is-correct' : ''}" id="practiceSlotsArea">
          ${practiceBuilderSlots.length === 0 ? `
            <span class="practice-empty-placeholder">Bấm chọn các vế câu A, B, C theo thứ tự đúng...</span>
          ` : practiceBuilderSlots.map((item, i) => `
            <button type="button" class="builder-tile slot-tile logic-tile" onclick="removeFromSlots(${i})">
              <strong>${item.key}.</strong> ${item.text}
            </button>
          `).join('')}
        </div>

        <!-- Available Bank -->
        <div class="practice-bank-area logic-bank-area" id="practiceBankArea">
          ${practiceBuilderBank.map((item, i) => `
            <button type="button" class="builder-tile logic-tile" onclick="moveToSlots(${i})">
              <strong>${item.key}.</strong> ${item.text}
            </button>
          `).join('')}
        </div>

        <!-- Practice Actions -->
        <div class="practice-actions-bar">
          <div class="practice-btn-group">
            <button type="button" class="practice-action-btn practice-btn-secondary" onclick="resetPracticeState(); renderReadingAnalysisScreen();">
              ↺ Làm lại
            </button>
          </div>

          <button type="button" class="practice-action-btn practice-btn-primary" onclick="checkPracticeLogicOrder()">
            Kiểm tra thứ tự
          </button>
        </div>

        ${renderPracticeFeedbackHtml()}
      </div>
    `;
  }

  return `
    <div class="reading-practice-card">
      <div class="practice-title">📖 Đoạn văn chuyên sâu</div>
      <p style="color:var(--text-secondary); line-height:1.6; margin-top:10px;">
        Đoạn văn này được thiết kế để luyện đọc hiểu toàn diện và phân tích ngữ pháp sống. 
        Hãy chuyển sang tab <strong>"Phân tích"</strong> để xem phân rã thành phần và bẫy đề thi.
      </p>
    </div>
  `;
}

/**
 * Builder Interactions
 */
function moveToSlots(bankIndex) {
  if (bankIndex >= 0 && bankIndex < practiceBuilderBank.length) {
    const item = practiceBuilderBank.splice(bankIndex, 1)[0];
    practiceBuilderSlots.push(item);
    practiceFeedback = null;
    renderReadingAnalysisScreen();
  }
}

function removeFromSlots(slotIndex) {
  if (slotIndex >= 0 && slotIndex < practiceBuilderSlots.length) {
    const item = practiceBuilderSlots.splice(slotIndex, 1)[0];
    practiceBuilderBank.push(item);
    practiceFeedback = null;
    renderReadingAnalysisScreen();
  }
}

function hintPracticeBuilder() {
  const entry = readingFilteredList[readingCurrentIndex];
  if (!entry || !entry.practice || !entry.practice.target_chunks) return;

  const target = entry.practice.target_chunks;
  const nextTargetWord = target[practiceBuilderSlots.length];
  if (!nextTargetWord) return;

  const foundIdx = practiceBuilderBank.findIndex(c => c === nextTargetWord);
  if (foundIdx !== -1) {
    moveToSlots(foundIdx);
  }
}

function checkPracticeBuilder() {
  const entry = readingFilteredList[readingCurrentIndex];
  if (!entry || !entry.practice || !entry.practice.target_chunks) return;

  const userSentence = practiceBuilderSlots.join('');
  const targetSentence = entry.practice.target_chunks.join('');

  if (userSentence === targetSentence) {
    practiceSolved = true;
    practiceFeedback = {
      type: 'success',
      html: `<span>🎉 <strong>Chính xác xuất sắc!</strong> Trật tự câu hoàn toàn chuẩn ngữ pháp tiếng Trung.</span>`
    };
    playReadingSentenceAudio(entry);
    renderReadingAnalysisScreen();
  } else {
    practiceSolved = false;
    practiceFeedback = {
      type: 'error',
      html: `<span>❌ <strong>Chưa đúng thứ tự:</strong> Hãy chú ý vị trí của từ chỉ thời gian, trạng ngữ, hoặc cấu trúc ngữ pháp (把/被).</span>`
    };
    renderReadingAnalysisScreen();
    const slotsArea = document.getElementById('practiceSlotsArea');
    if (slotsArea) {
      slotsArea.classList.add('is-wrong');
      setTimeout(() => slotsArea.classList.remove('is-wrong'), 400);
    }
  }
}

function checkPracticeLogicOrder() {
  const entry = readingFilteredList[readingCurrentIndex];
  if (!entry || !entry.practice || !entry.practice.correct_order) return;

  const userOrder = practiceBuilderSlots.map(item => item.key).join('');
  const targetOrder = entry.practice.correct_order;

  if (userOrder === targetOrder) {
    practiceSolved = true;
    practiceFeedback = {
      type: 'success',
      html: `
        <div>
          <div>🎉 <strong>Chính xác! Thứ tự chuẩn: ${targetOrder}</strong></div>
          <div style="font-size:0.86rem; margin-top:4px;">${entry.practice.explanation || ''}</div>
        </div>
      `
    };
    playReadingSentenceAudio(entry);
    renderReadingAnalysisScreen();
  } else {
    practiceSolved = false;
    practiceFeedback = {
      type: 'error',
      html: `<span>❌ Thứ tự hiện tại chưa đúng logic phát triển của đoạn văn. Hãy kiểm tra các liên từ nối!</span>`
    };
    renderReadingAnalysisScreen();
    const slotsArea = document.getElementById('practiceSlotsArea');
    if (slotsArea) {
      slotsArea.classList.add('is-wrong');
      setTimeout(() => slotsArea.classList.remove('is-wrong'), 400);
    }
  }
}

function selectClozeOption(word) {
  const entry = readingFilteredList[readingCurrentIndex];
  if (!entry || !entry.practice) return;

  practiceSelectedOption = word;
  const isCorrect = word === entry.practice.target_word;
  const p = entry.practice;

  if (isCorrect) {
    practiceSolved = true;
    practiceFeedback = {
      type: 'success',
      html: `
        <div>
          <div>🎉 <strong>Chính xác!</strong> Từ cần điền là <strong>${word}</strong>.</div>
          <div style="font-size:0.85rem; margin-top:4px;">${entry.grammar_point ? entry.grammar_point.trap_note : ''}</div>
        </div>
      `
    };
    playReadingSentenceAudio(entry);
  } else {
    practiceSolved = false;
    practiceFeedback = {
      type: 'error',
      html: `
        <div>
          <div>❌ Chưa chính xác. Đáp án đúng là <strong>${p.target_word}</strong>.</div>
          <div style="font-size:0.85rem; margin-top:4px;">${entry.grammar_point ? entry.grammar_point.trap_note : ''}</div>
        </div>
      `
    };
  }
  renderReadingAnalysisScreen();
}

/**
 * Dictation Check
 */
function checkDictationAnswer() {
  const entry = readingFilteredList[readingCurrentIndex];
  const input = document.getElementById('dictationInput');
  const feedback = document.getElementById('dictationFeedback');
  if (!entry || !input || !feedback) return;

  const val = input.value.trim().replace(/[，。？！\s]/g, '');
  const targetZh = entry.zh.replace(/[，。？！\s]/g, '');

  if (val === targetZh) {
    feedback.className = 'dictation-feedback success';
    feedback.innerHTML = `🎉 <strong>Tuyệt vời!</strong> Bạn đã chép chính xác 100%: <em>${entry.zh}</em>`;
  } else {
    feedback.className = 'dictation-feedback error';
    feedback.innerHTML = `
      <div>Đáp án câu gốc: <strong style="color:var(--accent); font-size:1.05rem;">${entry.zh}</strong></div>
      <div style="font-size:0.84rem; color:var(--text-secondary); margin-top:2px;">(Pinyin: ${entry.pinyin})</div>
    `;
  }
}

// Attach keyboard navigation listeners
if (!window._readingKeyHandlerAttached) {
  window._readingKeyHandlerAttached = true;
  window.addEventListener('keydown', (e) => {
    const screen = document.getElementById('screenReadingAnalysis');
    if (!screen || screen.style.display === 'none') return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

    if (e.key === 'ArrowRight' || e.key === 'j' || e.key === 'J') {
      e.preventDefault();
      nextReadingQuestion();
    } else if (e.key === 'ArrowLeft' || e.key === 'k' || e.key === 'K') {
      e.preventDefault();
      prevReadingQuestion();
    } else if (e.key === 'z' || e.key === 'Z') {
      e.preventDefault();
      toggleZenMode();
    } else if (e.key === 'g' || e.key === 'G') {
      e.preventDefault();
      toggleReadingGrammarExpand();
    } else if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      toggleReadingPinyin();
    } else if (e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      toggleReadingHanViet();
    } else if (e.key === 'v' || e.key === 'V') {
      e.preventDefault();
      toggleReadingMeaning();
    } else if (e.key === ' ' && !readingPrefs.dictationMode) {
      e.preventDefault();
      const current = readingFilteredList && readingFilteredList[readingCurrentIndex];
      if (current) playReadingSentenceAudio(current);
    } else if (e.key === 'Escape' && readingPrefs.zenMode) {
      e.preventDefault();
      toggleZenMode();
    }
  });
}

// Global Exports
window.startReadingAnalysis = startReadingAnalysis;
window.setReadingCategory = setReadingCategory;
window.setReadingTestFilter = setReadingTestFilter;
window.setReadingActiveMode = setReadingActiveMode;
window.nextReadingQuestion = nextReadingQuestion;
window.prevReadingQuestion = prevReadingQuestion;
window.jumpToReadingIndex = jumpToReadingIndex;
window.toggleReadingPinyin = toggleReadingPinyin;
window.toggleReadingHanViet = toggleReadingHanViet;
window.toggleReadingMeaning = toggleReadingMeaning;
window.toggleReadingHighlight = toggleReadingHighlight;
window.toggleReadingGrammarExpand = toggleReadingGrammarExpand;
window.toggleReadingDictation = toggleReadingDictation;
window.toggleReadingSpeed = toggleReadingSpeed;
window.toggleZenMode = toggleZenMode;
window.playReadingSentenceAudio = playReadingSentenceAudio;
window.selectReadingWord = selectReadingWord;
window.inspectToken = inspectToken;
window.closeInspector = closeInspector;
window.speakToken = speakToken;
window.moveToSlots = moveToSlots;
window.removeFromSlots = removeFromSlots;
window.hintPracticeBuilder = hintPracticeBuilder;
window.checkPracticeBuilder = checkPracticeBuilder;
window.checkPracticeLogicOrder = checkPracticeLogicOrder;
window.selectClozeOption = selectClozeOption;
window.checkDictationAnswer = checkDictationAnswer;
window.resetPracticeState = resetPracticeState;
