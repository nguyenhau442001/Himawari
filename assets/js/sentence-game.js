// Sentence-ordering game: drag/tap words from database/vocabs/sentence_bank.json into the right order.
// Features HSK level filter, cumulative/exact scope, focus mode, smart distractors, and pinyin toggle.

let sentenceBankData = null;
let sentenceGameLevel = 'hsk1';
let sentenceGameScope = 'cumulative';
let sentenceGameFocusMode = false;
let sentenceGameShowPinyin = true;
let sentenceGameFilteredPool = [];
let sentenceGameOrder = [];
let sentenceGameIdx = 0;
let sentenceGameSlots = [];
let sentenceGameBankTokens = [];
let sentenceGameSolved = false;
let sentenceGameCurrentEntry = null;

async function ensureSentenceBankLoaded() {
  if (sentenceBankData && sentenceBankData.length) return sentenceBankData;
  const res = await fetch('database/vocabs/sentence_bank.json');
  if (!res.ok) throw new Error('Không tải được cơ sở dữ liệu câu hỏi.');
  sentenceBankData = await res.json();
  return sentenceBankData;
}

function shuffleSentenceGameArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getSentenceGameFilteredPool() {
  if (!sentenceBankData || !sentenceBankData.length) return [];
  if (sentenceGameLevel === 'all') return sentenceBankData;

  const targetLevelNum = parseInt(sentenceGameLevel.replace('hsk', ''), 10) || 1;
  if (sentenceGameScope === 'exact') {
    const exact = sentenceBankData.filter(item => item.level === sentenceGameLevel);
    return exact.length ? exact : sentenceBankData;
  }

  // Cumulative: HSK 1 up to targetLevelNum
  const cumulative = sentenceBankData.filter(item => item.level.startsWith('hsk') && (item.level_num || 1) <= targetLevelNum);
  return cumulative.length ? cumulative : sentenceBankData;
}

function setSentenceGameLevel(level) {
  sentenceGameLevel = level;
  try { localStorage.setItem('hsk_sentence_lvl', level); } catch (e) {}

  document.querySelectorAll('.sentence-lvl-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.level === level);
  });

  sentenceGameFilteredPool = getSentenceGameFilteredPool();
  updateSentenceGamePoolBadge();
  sentenceGameOrder = shuffleSentenceGameArray(Array.from({ length: sentenceGameFilteredPool.length }, (_, i) => i));
  sentenceGameIdx = 0;
  loadNextSentenceGameRound();
}

function setSentenceGameScope(scope) {
  sentenceGameScope = scope;
  try { localStorage.setItem('hsk_sentence_scope', scope); } catch (e) {}

  sentenceGameFilteredPool = getSentenceGameFilteredPool();
  updateSentenceGamePoolBadge();
  sentenceGameOrder = shuffleSentenceGameArray(Array.from({ length: sentenceGameFilteredPool.length }, (_, i) => i));
  sentenceGameIdx = 0;
  loadNextSentenceGameRound();
}

function updateSentenceGamePoolBadge() {
  const badge = document.getElementById('sentencePoolBadge');
  if (badge) {
    badge.textContent = `${sentenceGameFilteredPool.length} câu khả dụng`;
  }
}

function toggleSentenceGamePinyin() {
  sentenceGameShowPinyin = !sentenceGameShowPinyin;
  try { localStorage.setItem('hsk_sentence_pinyin', String(sentenceGameShowPinyin)); } catch (e) {}
  syncSentenceGamePinyinUI();
  renderSentenceGameBoard();
}

function syncSentenceGamePinyinUI() {
  const icon = document.getElementById('sentenceGamePinyinIcon');
  const label = document.getElementById('sentenceGamePinyinLabel');
  const btn = document.getElementById('sentenceGamePinyinBtn');
  if (icon) icon.textContent = sentenceGameShowPinyin ? '👁' : '🙈';
  if (label) label.textContent = sentenceGameShowPinyin ? 'Pinyin: Bật' : 'Pinyin: Tắt';
  if (btn) btn.classList.toggle('active', sentenceGameShowPinyin);
}

function toggleSentenceGameFocus(force) {
  if (typeof force === 'boolean') {
    sentenceGameFocusMode = force;
  } else {
    sentenceGameFocusMode = !sentenceGameFocusMode;
  }
  document.body.classList.toggle('sentence-game-focus', sentenceGameFocusMode);
  const btn = document.getElementById('sentenceGameFocusBtn');
  if (btn) {
    btn.classList.toggle('active', sentenceGameFocusMode);
    btn.innerHTML = sentenceGameFocusMode
      ? '<span>⛶</span> <span>Thoát tập trung</span>'
      : '<span>🎯</span> <span>Tập trung</span>';
  }
  try { localStorage.setItem('hsk_sentence_focus', String(sentenceGameFocusMode)); } catch (e) {}
}

async function startSentenceGame() {
  const bankEl = document.getElementById('sentenceGameBank');
  if (bankEl) bankEl.innerHTML = '<div class="loading-text">Đang tải ngân hàng câu hỏi...</div>';

  try {
    const savedLevel = localStorage.getItem('hsk_sentence_lvl');
    if (savedLevel) sentenceGameLevel = savedLevel;
    const savedScope = localStorage.getItem('hsk_sentence_scope');
    if (savedScope) sentenceGameScope = savedScope;
    const savedPinyin = localStorage.getItem('hsk_sentence_pinyin');
    if (savedPinyin !== null) sentenceGameShowPinyin = savedPinyin !== 'false';
    const savedFocus = localStorage.getItem('hsk_sentence_focus');
    if (savedFocus !== null) sentenceGameFocusMode = savedFocus === 'true';
    else sentenceGameFocusMode = true; // default focus mode on for immersive learning
  } catch (e) {}

  document.querySelectorAll('.sentence-lvl-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.level === sentenceGameLevel);
  });
  const scopeSelect = document.getElementById('sentenceGameScopeSelect');
  if (scopeSelect) scopeSelect.value = sentenceGameScope;

  syncSentenceGamePinyinUI();
  toggleSentenceGameFocus(sentenceGameFocusMode);

  try {
    await ensureSentenceBankLoaded();
  } catch (err) {
    if (bankEl) bankEl.innerHTML = '<div class="empty-text">Không tải được dữ liệu. Vui lòng thử lại.</div>';
    return;
  }

  sentenceGameFilteredPool = getSentenceGameFilteredPool();
  updateSentenceGamePoolBadge();
  sentenceGameOrder = shuffleSentenceGameArray(Array.from({ length: sentenceGameFilteredPool.length }, (_, i) => i));
  sentenceGameIdx = 0;
  loadNextSentenceGameRound();
}

function loadNextSentenceGameRound() {
  if (!sentenceGameFilteredPool.length) {
    document.getElementById('sentenceGameMeaning').textContent = 'Chưa có câu hỏi trong phân loại này.';
    document.getElementById('sentenceGameSlots').innerHTML = '';
    document.getElementById('sentenceGameBank').innerHTML = '';
    return;
  }

  if (sentenceGameIdx >= sentenceGameOrder.length) {
    sentenceGameOrder = shuffleSentenceGameArray(sentenceGameOrder);
    sentenceGameIdx = 0;
  }

  const poolIdx = sentenceGameOrder[sentenceGameIdx];
  const entry = sentenceGameFilteredPool[poolIdx] || sentenceGameFilteredPool[0];
  sentenceGameCurrentEntry = entry;
  sentenceGameIdx++;
  sentenceGameSolved = false;
  sentenceGameSlots = [];

  // Build target tokens and distractor tokens
  const targetTokens = (entry.zh_tokens || []).map((tok, i) => ({
    id: 'tgt_' + i,
    tok,
    py: (entry.pinyin_tokens && entry.pinyin_tokens[i]) || '',
    isDistractor: false,
  }));

  const distractorTokens = (entry.distractors || []).map((tok, i) => ({
    id: 'dst_' + i,
    tok,
    py: (entry.distractor_pinyins && entry.distractor_pinyins[i]) || '',
    isDistractor: true,
  }));

  sentenceGameBankTokens = shuffleSentenceGameArray([...targetTokens, ...distractorTokens]);

  // Update card UI
  document.getElementById('sentenceGameMeaning').textContent = entry.meaning || '';
  const levelTag = document.getElementById('sentenceLevelTag');
  if (levelTag) {
    levelTag.textContent = entry.level_num ? `HSK ${entry.level_num}` : (entry.level || 'HSK').toUpperCase();
  }
  const grammarTag = document.getElementById('sentenceGrammarTag');
  if (grammarTag) {
    grammarTag.textContent = entry.grammar_point || 'Cấu trúc ngữ pháp';
  }
  const distractorTag = document.getElementById('sentenceDistractorTag');
  if (distractorTag) {
    distractorTag.hidden = !(entry.distractors && entry.distractors.length > 0);
  }

  const counter = document.getElementById('sentenceGameCounter');
  if (counter) {
    counter.textContent = `Câu ${sentenceGameIdx} / ${sentenceGameFilteredPool.length}`;
  }

  // Clear feedback & solution
  const feedbackEl = document.getElementById('sentenceGameFeedback');
  if (feedbackEl) {
    feedbackEl.textContent = '';
    feedbackEl.className = 'sentence-game-feedback';
  }
  const solutionBox = document.getElementById('sentenceSolutionBox');
  if (solutionBox) solutionBox.hidden = true;

  const checkBtn = document.getElementById('sentenceGameCheckBtn');
  if (checkBtn) checkBtn.hidden = false;
  const nextBtn = document.getElementById('sentenceGameNextBtn');
  if (nextBtn) nextBtn.hidden = true;
  const speakBtn = document.getElementById('sentenceGameSpeakBtn');
  if (speakBtn) speakBtn.hidden = true;

  renderSentenceGameBoard();
}

function renderSentenceGameBoard() {
  const entry = sentenceGameCurrentEntry;
  if (!entry) return;
  const slotsEl = document.getElementById('sentenceGameSlots');
  const bankEl = document.getElementById('sentenceGameBank');
  if (!slotsEl || !bankEl) return;

  const targetCount = (entry.zh_tokens || []).length;

  // Update reset button state
  const resetBtn = document.getElementById('sentenceGameResetBtn');
  if (resetBtn) {
    const hasPlaced = sentenceGameSlots.length > 0;
    resetBtn.disabled = !hasPlaced;
    resetBtn.classList.toggle('has-items', hasPlaced);
  }

  // Render slots (exactly targetCount slots)
  slotsEl.innerHTML = Array.from({ length: targetCount }, (_, slotIdx) => {
    const filledToken = sentenceGameSlots[slotIdx];
    if (!filledToken) {
      return `
        <div class="sentence-slot empty"
          ondragover="handleSlotDragOver(event)"
          ondragleave="handleSlotDragLeave(event)"
          ondrop="handleSlotDrop(event, ${slotIdx})">
          <span class="slot-idx-num">${slotIdx + 1}</span>
        </div>`;
    }
    const rubyPy = sentenceGameShowPinyin && filledToken.py ? `<span class="chip-ruby-py">${escapeHtml(filledToken.py)}</span>` : '';
    const distractorClass = filledToken.hasDistractorMark ? ' has-distractor' : '';
    return `
      <button class="sentence-slot filled${distractorClass}" type="button"
        draggable="true"
        ondragstart="handleSlotDragStart(event, ${slotIdx})"
        ondragend="handleDragEnd(event)"
        ondragover="handleSlotDragOver(event)"
        ondragleave="handleSlotDragLeave(event)"
        ondrop="handleSlotDrop(event, ${slotIdx})"
        onclick="removeSentenceGameSlot(${slotIdx})"
        title="Nhấn để gỡ từ này">
        ${rubyPy}
        <span class="chip-hanzi">${escapeHtml(filledToken.tok)}</span>
      </button>`;
  }).join('');

  // Render word bank (available tokens + ghost placeholders for used ones)
  const usedIds = new Set(sentenceGameSlots.map(s => s.id));
  bankEl.innerHTML = sentenceGameBankTokens
    .map(item => {
      const isUsed = usedIds.has(item.id);
      const rubyPy = sentenceGameShowPinyin && item.py ? `<span class="chip-ruby-py">${escapeHtml(item.py)}</span>` : '';
      if (isUsed) {
        return `
          <div class="sentence-chip is-used" aria-hidden="true" title="Từ này đã được xếp vào câu">
            ${rubyPy}
            <span class="chip-hanzi">${escapeHtml(item.tok)}</span>
          </div>`;
      }
      return `
        <button class="sentence-chip" type="button"
          draggable="true"
          ondragstart="handleTokenDragStart(event, '${item.id}')"
          ondragend="handleDragEnd(event)"
          onclick="pickSentenceGameToken('${item.id}')"
          title="Nhấn hoặc kéo vào ô ghép câu">
          ${rubyPy}
          <span class="chip-hanzi">${escapeHtml(item.tok)}</span>
        </button>`;
    }).join('');
}

function pickSentenceGameToken(tokenId) {
  if (sentenceGameSolved) return;
  const entry = sentenceGameCurrentEntry;
  if (!entry) return;
  if (sentenceGameSlots.length >= (entry.zh_tokens || []).length) return;

  const token = sentenceGameBankTokens.find(t => t.id === tokenId);
  if (!token) return;

  sentenceGameSlots.push({ ...token });
  renderSentenceGameBoard();
}

function removeSentenceGameSlot(slotIdx) {
  if (sentenceGameSolved) return;
  if (slotIdx >= sentenceGameSlots.length) return;
  sentenceGameSlots.splice(slotIdx, 1);
  renderSentenceGameBoard();
}

function resetSentenceGameSlots() {
  if (sentenceGameSolved) return;
  sentenceGameSlots = [];
  renderSentenceGameBoard();
}

// Drag & drop handlers
function handleTokenDragStart(event, tokenId) {
  event.target.classList.add('dragging');
  event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'bank', id: tokenId }));
  event.dataTransfer.effectAllowed = 'move';
}

function handleSlotDragStart(event, slotIdx) {
  event.target.classList.add('dragging');
  event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'slot', slotIdx }));
  event.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(event) {
  event.target.classList.remove('dragging');
}

function handleSlotDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  const slot = event.currentTarget;
  if (slot && !slot.classList.contains('dragover')) slot.classList.add('dragover');
}

function handleSlotDragLeave(event) {
  const slot = event.currentTarget;
  if (slot) slot.classList.remove('dragover');
}

function handleSlotDrop(event, targetSlotIdx) {
  event.preventDefault();
  if (sentenceGameSolved) return;
  let data;
  try {
    data = JSON.parse(event.dataTransfer.getData('text/plain'));
  } catch (e) {
    return;
  }
  if (!data) return;

  if (data.type === 'bank') {
    const token = sentenceGameBankTokens.find(t => t.id === data.id);
    if (!token) return;
    const targetCount = (sentenceGameCurrentEntry.zh_tokens || []).length;
    if (targetSlotIdx >= sentenceGameSlots.length) {
      if (sentenceGameSlots.length < targetCount) sentenceGameSlots.push({ ...token });
    } else {
      sentenceGameSlots[targetSlotIdx] = { ...token };
    }
  } else if (data.type === 'slot') {
    const fromIdx = data.slotIdx;
    if (fromIdx !== undefined && fromIdx < sentenceGameSlots.length && targetSlotIdx < sentenceGameSlots.length) {
      const temp = sentenceGameSlots[fromIdx];
      sentenceGameSlots[fromIdx] = sentenceGameSlots[targetSlotIdx];
      sentenceGameSlots[targetSlotIdx] = temp;
    }
  }
  renderSentenceGameBoard();
}

function checkSentenceGameAnswer() {
  const entry = sentenceGameCurrentEntry;
  if (!entry) return;
  const feedbackEl = document.getElementById('sentenceGameFeedback');
  const targetCount = (entry.zh_tokens || []).length;

  if (sentenceGameSlots.length < targetCount) {
    feedbackEl.textContent = `⚠️ Hãy xếp đủ ${targetCount} từ vào các ô trước khi kiểm tra.`;
    feedbackEl.className = 'sentence-game-feedback warning';
    return;
  }

  // 1. Check for distractor tokens
  const distractorSlot = sentenceGameSlots.find(s => s.isDistractor);
  if (distractorSlot) {
    distractorSlot.hasDistractorMark = true;
    renderSentenceGameBoard();
    shakeSentenceGameSlots();
    feedbackEl.textContent = `✗ Chưa đúng! Bạn đã chọn từ bẫy ("${distractorSlot.tok}"). Từ này không phù hợp với cấu trúc ngữ pháp của câu.`;
    feedbackEl.className = 'sentence-game-feedback incorrect';
    return;
  }

  // 2. Check full sentence sequence
  const playerText = sentenceGameSlots.map(s => s.tok).join('');
  const targetText = entry.zh_tokens.join('');

  if (playerText === targetText) {
    sentenceGameSolved = true;
    feedbackEl.textContent = '🎉 Chính xác! Bạn đã sắp xếp câu hoàn toàn đúng.';
    feedbackEl.className = 'sentence-game-feedback correct';

    const solutionBox = document.getElementById('sentenceSolutionBox');
    if (solutionBox) {
      solutionBox.hidden = false;
      document.getElementById('sentenceSolutionZh').textContent = entry.sentence_zh || targetText;
      document.getElementById('sentenceSolutionPy').textContent = entry.sentence_py || (entry.pinyin_tokens || []).join(' ');
      document.getElementById('sentenceSolutionGrammar').textContent = '💡 ' + (entry.grammar_point || 'Cấu trúc ngữ pháp chuẩn');
    }

    document.getElementById('sentenceGameCheckBtn').hidden = true;
    document.getElementById('sentenceGameNextBtn').hidden = false;
    const speakBtn = document.getElementById('sentenceGameSpeakBtn');
    if (speakBtn) speakBtn.hidden = false;

    speakCurrentSentence();
  } else {
    shakeSentenceGameSlots();
    feedbackEl.textContent = '✗ Trật tự các từ chưa chính xác, hãy thử hoán đổi lại vị trí nhé!';
    feedbackEl.className = 'sentence-game-feedback incorrect';
  }
}

function shakeSentenceGameSlots() {
  const slotsEl = document.getElementById('sentenceGameSlots');
  if (!slotsEl) return;
  slotsEl.classList.remove('shake');
  void slotsEl.offsetWidth; // trigger reflow
  slotsEl.classList.add('shake');
  setTimeout(() => slotsEl.classList.remove('shake'), 450);
}

function revealSentenceHint() {
  const entry = sentenceGameCurrentEntry;
  if (!entry || sentenceGameSolved) return;
  const feedbackEl = document.getElementById('sentenceGameFeedback');
  const firstTok = entry.zh_tokens && entry.zh_tokens[0] ? entry.zh_tokens[0] : '';
  const grammar = entry.grammar_point || '';
  feedbackEl.textContent = `💡 Gợi ý: Câu bắt đầu bằng từ “${firstTok}”. Cấu trúc: ${grammar}`;
  feedbackEl.className = 'sentence-game-feedback warning';
}

function speakCurrentSentence() {
  const entry = sentenceGameCurrentEntry;
  if (!entry || !entry.sentence_zh) return;
  const speakBtn = document.getElementById('sentenceGameSpeakBtn');
  if (typeof speakText === 'function') {
    speakText(entry.sentence_zh, speakBtn, SPEECH_RATE || 0.85);
  }
}

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}
