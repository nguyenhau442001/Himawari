// Fast-review (speed quiz) mode: pool building, timer, grading, screen transitions.
const REVIEW_TONE_MARKS = {
  'ā':'a','á':'a','ǎ':'a','à':'a',
  'ē':'e','é':'e','ě':'e','è':'e',
  'ī':'i','í':'i','ǐ':'i','ì':'i',
  'ō':'o','ó':'o','ǒ':'o','ò':'o',
  'ū':'u','ú':'u','ǔ':'u','ù':'u',
  'ǖ':'v','ǘ':'v','ǚ':'v','ǜ':'v','ü':'v',
};

function stripTonePinyin(text) {
  return String(text || '')
    .toLowerCase()
    .split('')
    .map(ch => REVIEW_TONE_MARKS[ch] || ch)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

function pinyinLooseMatch(input, target) {
  return stripTonePinyin(input) === stripTonePinyin(target);
}

const REVIEW_RANGE_LEVELS = ['hsk1', 'hsk2', 'hsk3', 'hsk4', 'hsk5', 'hsk6'];

function updateReviewRangeLabel(sliderValue) {
  const n = Number(sliderValue);
  const levels = REVIEW_RANGE_LEVELS.slice(0, n);
  const totalWords = levels.reduce((sum, lvl) => sum + LEVELS[lvl].total, 0);
  document.getElementById('reviewRangeLabel').textContent =
    n === 1 ? 'HSK1' : `HSK1 – HSK${n}`;
  document.getElementById('reviewRangeCount').textContent = `${totalWords} từ`;
}

function buildReviewPool() {
  const pool = [];
  const canIntroduceNewCards = countNewReviewsToday() < readDailyStudyGoal();
  for (let i = 0; i < reviewWordPool.length; i++) {
    const word = reviewWordPool[i];
    const levelProgress = reviewProgressByLevel[word._level] || {};
    const card = reviewCardsByLevel[word._level] && reviewCardsByLevel[word._level][word.id];
    if (levelProgress[word.id] !== 'known' && (canIntroduceNewCards || !card || card.state !== SRS.State.New)) pool.push(i);
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

async function fetchReviewWords(levels) {
  const results = await Promise.all(levels.map(async level => {
    const url = LEVELS[level].dataUrl;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`fetch failed: ${url} (${response.status})`);
    return response.json();
  }));

  const words = [];
  for (let i = 0; i < results.length; i++) {
    for (const word of results[i]) {
      words.push({ ...word, _level: levels[i] });
    }
  }
  return words;
}

function startReviewRangeLoad() {
  const slider = document.getElementById('reviewRangeSlider');
  const n = Number(slider.value);
  const levels = REVIEW_RANGE_LEVELS.slice(0, n);

  const startBtn = document.getElementById('reviewRangeStart');
  const body = document.getElementById('reviewPickerBody');
  startBtn.disabled = true;
  body.innerHTML = '<div class="loading-text">Đang tải dữ liệu...</div>';

  if (reviewLoadedRangeMax === n && reviewWordPool.length > 0) {
    startBtn.disabled = false;
    renderReviewStart();
    return;
  }

  reviewProgressByLevel = {};
  for (const level of levels) {
    reviewProgressByLevel[level] = readSavedLevelProgress(level);
  }

  let fallbackStarted = false;
  const finishLoad = function (words) {
    startBtn.disabled = false;
    reviewWordPool = words;
    reviewCardsByLevel = {};
    for (const level of levels) {
      const levelWords = words.filter(word => word._level === level);
      const legacy = readSavedLevelProgressLegacy(level);
      reviewCardsByLevel[level] = loadSrsForLevel(level, levelWords, legacy);
      reviewProgressByLevel[level] = progressFromCards(reviewCardsByLevel[level]);
    }
    reviewLoadedRangeMax = n;
    renderReviewStart();
  };
  const failLoad = function (error) {
    startBtn.disabled = false;
    console.error('Fast-review range load failed:', error);
    body.innerHTML = '<div class="error-text">Không thể tải dữ liệu. Vui lòng thử lại.</div>';
  };
  const loadWithoutWorker = function (workerError) {
    if (fallbackStarted) return;
    fallbackStarted = true;
    if (reviewWorker) {
      reviewWorker.terminate();
      reviewWorker = null;
    }
    console.warn('Fast-review worker unavailable; falling back to page fetch.', workerError);
    fetchReviewWords(levels).then(finishLoad).catch(failLoad);
  };

  try {
    if (!reviewWorker) {
      reviewWorker = new Worker('assets/js/fast-review-worker.js?v=20260928');
    }
  } catch (error) {
    loadWithoutWorker(error);
    return;
  }

  reviewWorker.onmessage = function (e) {
    if (!e.data.ok) {
      loadWithoutWorker(e.data.error);
      return;
    }
    finishLoad(e.data.words);
  };
  reviewWorker.onerror = function (e) {
    if (e.preventDefault) e.preventDefault();
    loadWithoutWorker(e.message || e);
  };

  try {
    reviewWorker.postMessage({
      levels,
      dataUrls: levels.map(level => new URL(LEVELS[level].dataUrl, document.baseURI).href),
    });
  } catch (error) {
    loadWithoutWorker(error);
  }
}

function renderReviewStart() {
  closeReviewMistakesModal();
  const body = document.getElementById('reviewPickerBody');
  body.innerHTML = `
    <div id="reviewSession" hidden></div>
    <div id="reviewResult" hidden></div>
    <div id="reviewStart"></div>`;
  const start = document.getElementById('reviewStart');

  const pool = buildReviewPool();
  reviewPool = pool;

  if (pool.length === 0) {
    start.innerHTML = `
      <div class="review-empty">
        <div class="review-empty-icon">🎉</div>
        <div class="review-empty-title">${countNewReviewsToday() >= readDailyStudyGoal() ? 'Bạn đã hoàn thành mục tiêu thẻ mới hôm nay!' : 'Bạn đã thuộc hết từ trong phạm vi này!'}</div>
        <div class="review-empty-msg">${countNewReviewsToday() >= readDailyStudyGoal() ? 'Thẻ mới sẽ mở lại ngày mai. Bạn vẫn có thể ôn thẻ đến hạn trong mục Ôn hôm nay.' : 'Không còn từ nào để ôn nhanh. Hãy học thêm từ mới hoặc chọn phạm vi rộng hơn.'}</div>
      </div>`;
    return;
  }

  start.innerHTML = `
    <div class="review-intro">
      <div class="review-intro-icon">⚡</div>
      <div class="review-intro-title">Ôn nhanh</div>
      <ul class="review-rules">
        <li>Mỗi câu có <strong>20 giây</strong> để trả lời</li>
        <li>Bạn có <strong>3 mạng</strong> — trả lời sai hoặc hết giờ sẽ mất 1 mạng</li>
        <li>Gõ pinyin hoặc chọn đáp án đúng, xen kẽ ngẫu nhiên</li>
        <li><strong>${pool.length}</strong> từ chưa nhớ đang chờ ôn</li>
      </ul>
      <button class="review-start-btn" onclick="startReviewSession()">Bắt đầu</button>
    </div>`;
}

function startReviewSession() {
  reviewIndex = 0;
  reviewLives = 3;
  reviewScore = 0;
  reviewStreak = 0;
  reviewBestStreak = 0;
  reviewMistakes = [];
  document.getElementById('reviewStart').hidden = true;
  document.getElementById('reviewResult').hidden = true;
  document.getElementById('reviewSession').hidden = false;
  renderReviewQuestion();
}

function pickReviewQuestionType() {
  return Math.random() < 0.5 ? 'type' : 'choice';
}

function buildReviewChoices(correctWordIdx) {
  const correctPinyin = stripTonePinyin(reviewWordPool[correctWordIdx].pinyin);
  const others = [];
  for (let i = 0; i < reviewWordPool.length; i++) {
    if (i !== correctWordIdx && stripTonePinyin(reviewWordPool[i].pinyin) !== correctPinyin) others.push(i);
  }
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  const distractors = others.slice(0, 3);
  const choices = [correctWordIdx, ...distractors];
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices;
}

function abandonReviewSession() {
  if (reviewTimer) { clearInterval(reviewTimer); reviewTimer = null; }
  reviewAnswered = true;
  reviewSessionLive = false;
  closeReviewMistakesModal();
}

function renderReviewQuestion() {
  if (reviewAnswered && !reviewSessionLive) return;
  reviewSessionLive = true;
  if (reviewTimer) { clearInterval(reviewTimer); reviewTimer = null; }
  while (reviewIndex < reviewPool.length && countNewReviewsToday() >= readDailyStudyGoal()) {
    const candidate = reviewWordPool[reviewPool[reviewIndex]];
    const candidateCard = candidate && reviewCardsByLevel[candidate._level] && reviewCardsByLevel[candidate._level][candidate.id];
    if (!candidateCard || candidateCard.state !== SRS.State.New) break;
    reviewIndex++;
  }
  if (reviewLives <= 0 || reviewIndex >= reviewPool.length) { endReviewSession(); return; }

  const wordIdx = reviewPool[reviewIndex];
  const word = reviewWordPool[wordIdx];
  const type = pickReviewQuestionType();
  reviewCurrentQuestion = { wordIdx, type };
  reviewAnswered = false;
  reviewTimeLeft = 20;

  const livesHtml = '♥'.repeat(reviewLives) + '♡'.repeat(3 - reviewLives);
  const reviewCoreHanzi = String(word.hanzi || '').replace(/[（\(].*?[）\)]/g, '').trim() || word.hanzi || '';
  const reviewLen = Array.from(reviewCoreHanzi).length;
  const reviewLenClass = reviewLen >= 6 ? ' is-len-6-plus' : reviewLen === 5 ? ' is-len-5' : reviewLen === 4 ? ' is-len-4' : '';
  const reviewHanziMatch = String(word.hanzi || '').trim().match(/^([^（\(]+)[（\(](.+?)[）\)]$/);
  const reviewHanziHtml = reviewHanziMatch
    ? `<span class="hanzi-text">${reviewHanziMatch[1].trim()}</span><span class="hanzi-clarifier">（${reviewHanziMatch[2].trim()}）</span>`
    : (word.hanzi || '');

  const header = `
    <div class="review-header">
      <div class="review-lives" aria-label="${reviewLives} mạng còn lại">${livesHtml}</div>
      <div class="review-progress-text">${reviewIndex + 1} / ${reviewPool.length}</div>
    </div>
    <div class="review-timer-track"><div class="review-timer-fill" id="reviewTimerFill"></div></div>
    <div class="review-question-word">
      <div class="review-hanzi${reviewLenClass}">${reviewHanziHtml}</div>
      <div class="review-meaning">${word.meaning}</div>
    </div>`;

  let bodyHtml;
  if (type === 'type') {
    bodyHtml = `
      <div class="review-answer-area">
        <input type="text" id="reviewTypeInput" class="review-type-input"
          autocomplete="off" autocapitalize="off" spellcheck="false"
          placeholder="Gõ pinyin (không dấu)..."
          onkeydown="if(event.key==='Enter') submitReviewTypeAnswer()">
        <button class="review-submit-btn" onclick="submitReviewTypeAnswer()">Trả lời</button>
      </div>
      <div class="review-feedback" id="reviewFeedback"></div>`;
  } else {
    const choiceIdxs = buildReviewChoices(wordIdx);
    bodyHtml = `
      <div class="review-choices">
        ${choiceIdxs.map(i => `
          <button class="review-choice-btn" data-word-idx="${i}" onclick="submitReviewChoice(${i})">
            ${reviewWordPool[i].pinyin}
          </button>`).join('')}
      </div>
      <div class="review-feedback" id="reviewFeedback"></div>`;
  }

  document.getElementById('reviewSession').innerHTML = header + bodyHtml;

  const input = document.getElementById('reviewTypeInput');
  if (input) input.focus();

  reviewTimer = setInterval(reviewTick, 1000);
  updateReviewTimerBar();
}

function updateReviewTimerBar() {
  const fill = document.getElementById('reviewTimerFill');
  if (!fill) return;
  const pct = Math.max(0, (reviewTimeLeft / 20) * 100);
  fill.style.width = pct + '%';
  fill.classList.toggle('review-timer-low', reviewTimeLeft <= 5);
}

function reviewTick() {
  reviewTimeLeft -= 1;
  updateReviewTimerBar();
  if (reviewTimeLeft <= 0) {
    clearInterval(reviewTimer);
    reviewTimer = null;
    const word = reviewCurrentQuestion && reviewWordPool ? reviewWordPool[reviewCurrentQuestion.wordIdx] : null;
    gradeReviewAnswer(false, {
      userAnswer: 'Hết giờ (chưa kịp trả lời)',
      expected: word ? word.pinyin : '',
      type: reviewCurrentQuestion ? reviewCurrentQuestion.type : 'type',
      isTimeout: true
    });
  }
}

function submitReviewTypeAnswer() {
  if (reviewAnswered) return;
  const input = document.getElementById('reviewTypeInput');
  const word = reviewWordPool[reviewCurrentQuestion.wordIdx];
  const userText = input ? input.value.trim() : '';
  const isCorrect = pinyinLooseMatch(userText, word.pinyin);
  gradeReviewAnswer(isCorrect, {
    userAnswer: userText || '(Để trống)',
    expected: word.pinyin,
    type: 'type'
  });
}

function submitReviewChoice(chosenIdx) {
  if (reviewAnswered) return;
  const isCorrect = chosenIdx === reviewCurrentQuestion.wordIdx;
  const chosenWord = reviewWordPool[chosenIdx];
  const word = reviewWordPool[reviewCurrentQuestion.wordIdx];
  gradeReviewAnswer(isCorrect, {
    userAnswer: chosenWord ? chosenWord.pinyin : '',
    expected: word ? word.pinyin : '',
    type: 'choice'
  });
}

function gradeReviewAnswer(isCorrect, details) {
  if (reviewAnswered) return;
  reviewAnswered = true;
  if (reviewTimer) { clearInterval(reviewTimer); reviewTimer = null; }

  const wordIdx = reviewCurrentQuestion.wordIdx;
  const word = reviewWordPool[wordIdx];
  if (!reviewCardsByLevel[word._level]) reviewCardsByLevel[word._level] = {};
  reviewSrsCard(word._level, word.id, isCorrect ? 'good' : 'again', reviewCardsByLevel[word._level]);
  reviewProgressByLevel[word._level] = progressFromCards(reviewCardsByLevel[word._level]);
  recordDailyStudy(word.id, word._level);

  if (isCorrect) {
    reviewScore += 1;
    reviewStreak += 1;
    if (reviewStreak > reviewBestStreak) reviewBestStreak = reviewStreak;
  } else {
    reviewLives -= 1;
    reviewStreak = 0;

    const userAnswer = details && details.userAnswer ? details.userAnswer : (details && details.isTimeout ? 'Hết giờ (chưa kịp trả lời)' : 'Sai');
    const expected = details && details.expected ? details.expected : word.pinyin;
    const qType = details && details.type ? details.type : (reviewCurrentQuestion ? reviewCurrentQuestion.type : 'choice');

    reviewMistakes.push({
      id: word.id,
      hanzi: word.hanzi,
      pinyin: word.pinyin,
      meaning: word.meaning,
      level: word._level || '',
      example_zh: word.example_zh || '',
      example_py: word.example_py || '',
      example_vi: word.example_vi || '',
      userAnswer,
      expected,
      type: qType
    });
  }

  const feedback = document.getElementById('reviewFeedback');
  if (feedback) {
    feedback.textContent = isCorrect ? 'Chính xác!' : `Sai rồi. Đáp án: ${word.pinyin}`;
    feedback.className = 'review-feedback show ' + (isCorrect ? 'review-feedback--correct' : 'review-feedback--wrong');
  }
  document.querySelectorAll('.review-choice-btn').forEach(btn => {
    btn.disabled = true;
    if (Number(btn.dataset.wordIdx) === wordIdx) btn.classList.add('review-choice-btn--correct');
  });

  setTimeout(() => {
    reviewIndex += 1;
    renderReviewQuestion();
  }, 900);
}

function endReviewSession() {
  if (reviewTimer) { clearInterval(reviewTimer); reviewTimer = null; }
  document.getElementById('reviewSession').hidden = true;
  renderReviewResult();
}

function renderReviewResult() {
  const result = document.getElementById('reviewResult');
  result.hidden = false;
  const total = Math.min(reviewIndex, reviewPool.length);
  const survived = reviewLives > 0;
  const mistakeCount = reviewMistakes.length;

  const mistakesBtnHtml = mistakeCount > 0
    ? `<button type="button" class="review-mistakes-btn" onclick="openReviewMistakesModal()">📋 Xem lại câu sai (${mistakeCount})</button>`
    : `<button type="button" class="review-mistakes-btn review-mistakes-btn--disabled" disabled title="Không có câu sai trong phiên này">📋 Xem lại câu sai (0)</button>`;

  result.innerHTML = `
    <div class="review-result">
      <div class="review-result-icon">${survived ? '🏁' : '💔'}</div>
      <div class="review-result-title">${survived ? 'Hoàn thành!' : 'Hết mạng!'}</div>
      <div class="review-result-stats">
        <div class="review-result-stat">
          <div class="review-result-num">${reviewScore}</div>
          <div class="review-result-lbl">câu đúng</div>
        </div>
        <div class="review-result-stat">
          <div class="review-result-num">${total}</div>
          <div class="review-result-lbl">tổng số câu</div>
        </div>
        <div class="review-result-stat">
          <div class="review-result-num">${reviewBestStreak}</div>
          <div class="review-result-lbl">chuỗi đúng dài nhất</div>
        </div>
      </div>
      <div class="review-result-actions">
        ${mistakesBtnHtml}
        <button type="button" class="review-again-btn" onclick="renderReviewStart()">Chơi lại</button>
        <button type="button" class="review-back-btn" onclick="renderReviewRangePicker()">Chọn lại phạm vi</button>
      </div>
    </div>`;
}

function renderReviewRangePicker() {
  closeReviewMistakesModal();
  document.getElementById('reviewPickerBody').innerHTML = '';
}

function escapeReviewHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeExampleMarkup(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/&lt;u&gt;/g, '<u>')
    .replace(/&lt;\/u&gt;/g, '</u>');
}

function playReviewMistakeAudio(text, button) {
  if (typeof speakText === 'function') {
    speakText(text, button, typeof SPEECH_RATE !== 'undefined' ? SPEECH_RATE : 0.85);
  }
}

function handleReviewMistakesKeydown(event) {
  if (event.key === 'Escape') {
    closeReviewMistakesModal();
  }
}

function closeReviewMistakesModal() {
  if (typeof stopSpeech === 'function') stopSpeech();
  const modal = document.getElementById('reviewMistakesModal');
  if (modal) modal.remove();
  document.removeEventListener('keydown', handleReviewMistakesKeydown);
  document.body.classList.remove('review-modal-open');
}

function practiceReviewMistakes() {
  if (!reviewMistakes || reviewMistakes.length === 0) return;
  const mistakeIds = new Set(reviewMistakes.map(m => m.id));
  const newPool = [];
  for (let i = 0; i < reviewWordPool.length; i++) {
    if (mistakeIds.has(reviewWordPool[i].id)) {
      newPool.push(i);
    }
  }
  for (let i = newPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newPool[i], newPool[j]] = [newPool[j], newPool[i]];
  }

  closeReviewMistakesModal();
  reviewPool = newPool;
  startReviewSession();
}

function openReviewMistakesModal() {
  if (!reviewMistakes || reviewMistakes.length === 0) return;
  closeReviewMistakesModal();

  const modal = document.createElement('div');
  modal.id = 'reviewMistakesModal';
  modal.className = 'review-mistakes-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Danh sách câu làm sai');

  const itemsHtml = reviewMistakes.map((m, idx) => {
    const levelDisplay = m.level ? m.level.toUpperCase() : '';
    const cleanExampleZh = (m.example_zh || '').replace(/<[^>]*>/g, '').trim();

    let exampleHtml = '';
    if (m.example_zh) {
      exampleHtml = `
        <div class="review-mistake-example">
          <div class="review-mistake-example-row">
            <span class="review-mistake-example-zh">${sanitizeExampleMarkup(m.example_zh)}</span>
            <button type="button" class="review-mistake-audio-btn review-mistake-audio-sm"
              data-speak-text="${escapeReviewHtml(cleanExampleZh)}"
              title="Phát âm câu ví dụ" aria-label="Phát âm câu ví dụ">🔊</button>
          </div>
          ${m.example_py ? `<div class="review-mistake-example-py">${sanitizeExampleMarkup(m.example_py)}</div>` : ''}
          ${m.example_vi ? `<div class="review-mistake-example-vi">${sanitizeExampleMarkup(m.example_vi)}</div>` : ''}
        </div>`;
    }

    const typeBadge = m.type === 'type' ? 'Gõ Pinyin' : 'Trắc nghiệm';

    return `
      <article class="review-mistake-card">
        <div class="review-mistake-card-top">
          <div class="review-mistake-head">
            <span class="review-mistake-num">#${idx + 1}</span>
            <span class="review-mistake-hanzi">${escapeReviewHtml(m.hanzi)}</span>
            <button type="button" class="review-mistake-audio-btn"
              data-speak-text="${escapeReviewHtml(m.hanzi)}"
              title="Phát âm ${escapeReviewHtml(m.hanzi)}" aria-label="Phát âm ${escapeReviewHtml(m.hanzi)}">🔊</button>
            <span class="review-mistake-pinyin">${escapeReviewHtml(m.pinyin)}</span>
          </div>
          <div class="review-mistake-badges">
            ${levelDisplay ? `<span class="review-mistake-level">${escapeReviewHtml(levelDisplay)}</span>` : ''}
            <span class="review-mistake-type">${escapeReviewHtml(typeBadge)}</span>
          </div>
        </div>

        <div class="review-mistake-meaning">${escapeReviewHtml(m.meaning)}</div>

        <div class="review-mistake-diff">
          <div class="review-diff-item review-diff-wrong">
            <span class="review-diff-lbl">❌ Bạn đã trả lời:</span>
            <strong class="review-diff-val">${escapeReviewHtml(m.userAnswer)}</strong>
          </div>
          <div class="review-diff-item review-diff-correct">
            <span class="review-diff-lbl">✔️ Đáp án đúng:</span>
            <strong class="review-diff-val">${escapeReviewHtml(m.expected)}</strong>
          </div>
        </div>

        ${exampleHtml}
      </article>`;
  }).join('');

  modal.innerHTML = `
    <div class="review-mistakes-dialog">
      <header class="review-mistakes-header">
        <div class="review-mistakes-header-text">
          <h3 class="review-mistakes-title">📋 Xem lại câu sai (${reviewMistakes.length})</h3>
          <p class="review-mistakes-subtitle">Các từ vựng bạn trả lời chưa đúng trong phiên ôn vừa qua</p>
        </div>
        <button type="button" class="review-mistakes-close" onclick="closeReviewMistakesModal()" aria-label="Đóng">✕</button>
      </header>

      <div class="review-mistakes-body">
        <div class="review-mistakes-list">
          ${itemsHtml}
        </div>
      </div>

      <footer class="review-mistakes-footer">
        <button type="button" class="review-mistakes-retry-btn" onclick="practiceReviewMistakes()">⚡ Luyện lại các câu sai này</button>
        <button type="button" class="review-mistakes-done-btn" onclick="closeReviewMistakesModal()">Đóng</button>
      </footer>
    </div>`;

  modal.addEventListener('click', e => {
    if (e.target === modal) closeReviewMistakesModal();
  });

  modal.querySelectorAll('.review-mistake-audio-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const textToSpeak = btn.getAttribute('data-speak-text');
      if (textToSpeak) {
        playReviewMistakeAudio(textToSpeak, btn);
      }
    });
  });

  document.body.appendChild(modal);
  document.body.classList.add('review-modal-open');
  document.addEventListener('keydown', handleReviewMistakesKeydown);
}
