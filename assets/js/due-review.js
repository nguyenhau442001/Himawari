// Cross-level review queue and the daily new-card limit.
function countNewReviewsToday() {
  const today = localDateKey(new Date());
  const reviewed = new Set();
  Object.keys(LEVELS).filter(level => LEVELS[level].available).forEach(level => {
    readSrsReviewLog(level).forEach(entry => {
      if (entry.stateBefore !== SRS.State.New || !entry.timestamp) return;
      const timestamp = new Date(entry.timestamp);
      if (!Number.isFinite(timestamp.getTime()) || localDateKey(timestamp) !== today) return;
      reviewed.add(level + ':' + entry.wordId);
    });
  });
  return reviewed.size;
}

function countDueCardsAcrossLevels(now) {
  const currentTime = (now || new Date()).getTime();
  return Object.keys(LEVELS).filter(level => LEVELS[level].available).reduce((count, level) => {
    const record = readSrsRecord(level);
    if (record) {
      return count + Object.values(record.cards).filter(card => SRS.isDue(card, currentTime)).length;
    }
    return count + Object.values(readSavedLevelProgressLegacy(level)).filter(status => status === 'unknown').length;
  }, 0);
}

async function loadTodayReviewQueue() {
  const now = new Date();
  const levels = Object.keys(LEVELS).filter(level => LEVELS[level].available);
  const datasets = await Promise.all(levels.map(async level => {
    const response = await fetch(LEVELS[level].dataUrl);
    if (!response.ok) throw new Error('Không tải được dữ liệu ' + level);
    return response.json();
  }));
  const queue = [];
  levels.forEach((level, levelIndex) => {
    const words = datasets[levelIndex];
    const cards = loadSrsForLevel(level, words, readSavedLevelProgressLegacy(level));
    words.forEach(word => {
      const card = cards[word.id];
      if (SRS.isDue(card, now)) queue.push({ level, word, card, due: new Date(card.due).getTime() });
    });
  });
  queue.sort((a, b) => a.due - b.due);
  return queue;
}

let todayReviewRevealed = false;
let todayReviewDoneMessage = 'Không còn thẻ đến hạn hôm nay.';

function renderTodayReviewCard() {
  const area = document.getElementById('todayReviewCardArea');
  const progressNode = document.getElementById('todayReviewProgress');
  todayReviewRevealed = false;
  if (todayReviewIndex >= todayReviewQueue.length) {
    progressNode.textContent = 'Đã ôn xong tất cả thẻ trong lượt này.';
    area.innerHTML = '<div class="today-review-empty">🎉 ' + escapeHtml(todayReviewDoneMessage) + '</div>';
    renderLearningDashboard();
    return;
  }
  const item = todayReviewQueue[todayReviewIndex];
  const previews = SRS.preview(item.card, new Date(), srsRetention);
  progressNode.textContent = (todayReviewIndex + 1) + ' / ' + todayReviewQueue.length + ' thẻ';
  area.innerHTML = `
    <article class="today-review-card" onclick="revealTodayReview()" style="cursor:pointer">
      <div class="today-review-level">${LEVELS[item.level].label}</div>
      <div class="hanzi">${escapeHtml(item.word.hanzi)}</div>
      <div class="today-review-answer" id="todayReviewAnswer" hidden>
        <div class="pinyin">${escapeHtml(item.word.pinyin)}</div>
        <div class="meaning show">${escapeHtml(item.word.meaning)}</div>
      </div>
      <div class="rating-area today-review-actions">
        ${revealButtonHtml('revealTodayReview()', 'todayRevealBtn')}
        <div class="rating-row" id="todayRatingRow" hidden>
          ${ratingButtonsHtml('rateTodayReview', '', previews)}
        </div>
      </div>
    </article>`;
}

function revealTodayReview() {
  if (todayReviewRevealed || todayReviewIndex >= todayReviewQueue.length) return;
  todayReviewRevealed = true;
  document.getElementById('todayReviewAnswer').hidden = false;
  const revealBtn = document.getElementById('todayRevealBtn');
  if (revealBtn) revealBtn.hidden = true;
  document.getElementById('todayRatingRow').hidden = false;
}

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function rateTodayReview(rating) {
  const item = todayReviewQueue[todayReviewIndex];
  if (!item || !todayReviewRevealed) return;
  const record = readSrsRecord(item.level);
  const cards = record ? record.cards : {};
  const result = reviewSrsCard(item.level, item.word.id, rating, cards);
  recordDailyStudy(item.word.id, item.level);
  if (rating === 'again') {
    todayReviewQueue.push({ ...item, card: result.card, due: new Date(result.card.due).getTime() });
  }
  todayReviewIndex++;
  renderTodayReviewCard();
}

function openTodayReviews() {
  return openReviewQueue('📅 Ôn hôm nay', loadTodayReviewQueue, 'Không còn thẻ đến hạn hôm nay.');
}

// Shared by "Ôn hôm nay" and the home widgets' quick review; loadQueue resolves to [{ level, word, card, due }].
async function openReviewQueue(title, loadQueue, doneMessage) {
  setActiveStudyWord(null);
  document.getElementById('todayReviewTitle').textContent = title;
  todayReviewDoneMessage = doneMessage;
  const hub = document.getElementById('screenVocabHub');
  const cards = document.getElementById('screenCards');
  const reviewScreen = document.getElementById('screenTodayReviews');
  if (hub) hub.style.display = 'none';
  if (cards) cards.style.display = 'none';
  reviewScreen.style.display = '';
  document.getElementById('primaryTabs').style.display = 'none';
  document.getElementById('pickerControls').style.display = 'none';
  document.getElementById('learningDashboard').style.display = 'none';
  document.getElementById('todayReviewCardArea').innerHTML = '<div class="loading-text">Đang tìm thẻ đến hạn...</div>';
  syncHomeScreen();
  if (typeof SpaRouter !== 'undefined' && !SpaRouter.isNavigatingFromPopstate()) {
    SpaRouter.pushView({ view: 'todayReviews' });
  }
  try {
    todayReviewQueue = await loadQueue();
    todayReviewIndex = 0;
    renderTodayReviewCard();
  } catch (error) {
    console.error('Today review queue failed:', error);
    document.getElementById('todayReviewCardArea').innerHTML = '<div class="error-text">Không thể tải thẻ ôn tập. Vui lòng thử lại.</div>';
  }
}

function closeTodayReviews() {
  document.getElementById('screenTodayReviews').style.display = 'none';
  document.getElementById('screenVocabHub').style.display = '';
  document.getElementById('primaryTabs').style.display = '';
  document.getElementById('pickerControls').style.display = '';
  document.getElementById('learningDashboard').style.display = '';
  renderLearningDashboard();
  syncHomeScreen();
  if (typeof SpaRouter !== 'undefined' && !SpaRouter.isNavigatingFromPopstate()) {
    SpaRouter.pushView({ view: 'vocab' });
  }
}

document.addEventListener('keydown', event => {
  const screen = document.getElementById('screenTodayReviews');
  if (!screen || screen.style.display === 'none' || event.altKey || event.ctrlKey || event.metaKey) return;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement && document.activeElement.tagName)) return;
  if (event.key === ' ') {
    if (document.activeElement && document.activeElement.closest('button, summary, a')) return;
    event.preventDefault();
    revealTodayReview();
    return;
  }
  const rating = RATING_KEYS[event.key];
  if (rating && todayReviewRevealed) { event.preventDefault(); rateTodayReview(rating); }
});
