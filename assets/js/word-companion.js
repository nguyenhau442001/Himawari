// Right sidebar companion: real-world example sentences, antonyms/synonyms, and compound words.

const JLPT_ANTONYMS = {
  '大きい': { word: '小さい', py: 'ちいさい', vi: 'nhỏ' },
  '小さい': { word: '大きい', py: 'おおきい', vi: 'to, lớn' },
  '多い': { word: '少ない', py: 'すくない', vi: 'ít' },
  '少ない': { word: '多い', py: 'おおい', vi: 'nhiều' },
  '高い': { word: '低い', py: 'ひくい', vi: 'thấp' },
  '低い': { word: '高い', py: 'たかい', vi: 'cao' },
  '早い': { word: '遅い', py: 'おそい', vi: 'chậm, muộn' },
  '遅い': { word: '早い', py: 'はやい', vi: 'sớm, nhanh' },
  '新しい': { word: '古い', py: 'ふるい', vi: 'cũ' },
  '古い': { word: '新しい', py: 'あたらしい', vi: 'mới' },
  '良い': { word: '悪い', py: 'わるい', vi: 'xấu' },
  '悪い': { word: '良い', py: 'よい', vi: 'tốt' },
  '暑い': { word: '寒い', py: 'さむい', vi: 'lạnh' },
  '寒い': { word: '暑い', py: 'あつい', vi: 'nóng' },
  '買う': { word: '売る', py: 'うる', vi: 'bán' },
  '売る': { word: '買う', py: 'かう', vi: 'mua' },
  '行く': { word: '来る', py: 'くる', vi: 'đến' },
  '来る': { word: '行く', py: 'いく', vi: 'đi' },
  '開ける': { word: '閉める', py: 'しめる', vi: 'đóng' },
  '閉める': { word: '開ける', py: 'あける', vi: 'mở' },
  '入る': { word: '出る', py: 'でる', vi: 'ra' },
  '出る': { word: '入る', py: 'はいる', vi: 'vào' },
};

const JLPT_SYNONYMS = {
  'きれい': { word: '美しい', py: 'うつくしい', vi: 'đẹp' },
  'うれしい': { word: '楽しい', py: 'たのしい', vi: 'vui vẻ' },
};

function findRelatedWordsInLesson(hanzi) {
  if (!Array.isArray(WORDS) || !hanzi) return [];
  const chars = Array.from(hanzi);
  return WORDS.filter(w => {
    if (w.hanzi === hanzi) return false;
    return chars.some(c => w.hanzi.includes(c));
  }).slice(0, 4);
}

function renderWordCompanion(word) {
  const panel = document.getElementById('wordCompanionPanel');
  if (!panel) return;

  if (!word) {
    panel.innerHTML = '<div class="companion-empty">Chọn một từ để xem câu ví dụ thực tế và từ liên quan.</div>';
    return;
  }

  const hasExample = Boolean(word.example_zh || word.example_py || word.example_vi);
  const antonym = JLPT_ANTONYMS[word.hanzi];
  const synonym = JLPT_SYNONYMS[word.hanzi];
  const relatedWords = findRelatedWordsInLesson(word.hanzi);

  let html = '';

  // 1. Real-world example sentence
  if (hasExample) {
    html += `
      <div class="companion-section companion-example-section">
        <div class="companion-section-header">
          <span class="companion-section-title">Câu ví dụ thực tế</span>
          <button type="button" class="companion-sound-btn" onclick="event.stopPropagation(); speakExample()" title="Nghe câu ví dụ" aria-label="Nghe câu ví dụ">
            <span aria-hidden="true">🔊</span>
          </button>
        </div>
        <div class="companion-example-card">
          <div class="companion-ex-zh">${word.example_zh || ''}</div>
          <div class="companion-ex-py">${word.example_py || ''}</div>
          <div class="companion-ex-vi">${word.example_vi || ''}</div>
        </div>
      </div>
    `;
  }

  // 2. Synonyms & Antonyms
  if (antonym || synonym) {
    html += `<div class="companion-section companion-rel-section"><div class="companion-section-title">Từ đối chiếu</div><div class="companion-chips-row">`;
    if (antonym) {
      html += `
        <div class="companion-chip companion-chip--antonym" title="Từ trái nghĩa: ${antonym.vi}">
          <span class="companion-chip-badge">Trái nghĩa ↔</span>
          <strong class="companion-chip-word">${antonym.word}</strong>
          <span class="companion-chip-py">${antonym.py}</span>
          <span class="companion-chip-vi">${antonym.vi}</span>
        </div>
      `;
    }
    if (synonym) {
      html += `
        <div class="companion-chip companion-chip--synonym" title="Từ đồng nghĩa: ${synonym.vi}">
          <span class="companion-chip-badge">Đồng nghĩa ≈</span>
          <strong class="companion-chip-word">${synonym.word}</strong>
          <span class="companion-chip-py">${synonym.py}</span>
          <span class="companion-chip-vi">${synonym.vi}</span>
        </div>
      `;
    }
    html += `</div></div>`;
  }

  // 3. Collocations / Related words in current lesson
  if (relatedWords.length > 0) {
    html += `
      <div class="companion-section companion-compounds-section">
        <div class="companion-section-title">Từ ghép trong bài (${relatedWords.length})</div>
        <div class="companion-compounds-list">
          ${relatedWords.map(w => {
            const wordIdx = WORDS.indexOf(w);
            return `
              <button type="button" class="companion-compound-pill" onclick="jumpToWordByIndex(${wordIdx})" title="Chuyển đến từ: ${w.meaning}">
                <span class="compound-hanzi">${w.hanzi}</span>
                <span class="compound-py">${w.pinyin || ''}</span>
                <span class="compound-vi">${w.meaning || ''}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  panel.innerHTML = html || '<div class="companion-empty">Đang cập nhật thêm ví dụ và từ liên quan cho từ này.</div>';
}

function jumpToWordByIndex(wordIndex) {
  if (wordIndex < 0 || !Array.isArray(WORDS) || wordIndex >= WORDS.length) return;
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
  }
}

function initWordCompanion() {
  const mount = document.getElementById('workstationRight') || document.getElementById('screenCards');
  if (!mount) return;

  if (document.getElementById('wordCompanionWrap')) return;

  const wrap = document.createElement('div');
  wrap.className = 'word-companion-panel';
  wrap.id = 'wordCompanionWrap';
  const title = document.createElement('div');
  title.className = 'sidebar-panel-title';
  title.textContent = 'Câu ví dụ & Hỗ trợ từ vựng';
  wrap.appendChild(title);

  const body = document.createElement('div');
  body.id = 'wordCompanionPanel';
  body.className = 'word-companion-body';
  wrap.appendChild(body);
  mount.appendChild(wrap);

  onActiveWordChange(renderWordCompanion);
  renderWordCompanion(typeof activeStudyWord !== 'undefined' ? activeStudyWord : null);
}

document.addEventListener('DOMContentLoaded', initWordCompanion);
