// Shared application configuration and in-memory state for JLPT (N5, N4, N3, N2, N1).
const LEVELS = {
  jlpt_n5: {
    label: 'JLPT N5',
    band: 'Sơ cấp 1',
    dataUrl: 'database/vocabs/jlpt_n5.json',
    available: true,
    total: 662,
    version: '2.0',
  },
  jlpt_n4: {
    label: 'JLPT N4',
    band: 'Sơ cấp 2',
    dataUrl: 'database/vocabs/jlpt_n4.json',
    available: true,
    total: 632,
    version: '2.0',
  },
  jlpt_n3: {
    label: 'JLPT N3',
    band: 'Trung cấp',
    dataUrl: 'database/vocabs/jlpt_n3.json',
    available: true,
    total: 688,
    version: '2.0',
  },
  jlpt_n2: {
    label: 'JLPT N2',
    band: 'Trung cao cấp',
    dataUrl: 'database/vocabs/jlpt_n2.json',
    available: true,
    total: 1831,
    version: '2.0',
  },
  jlpt_n1: {
    label: 'JLPT N1',
    band: 'Cao cấp',
    dataUrl: 'database/vocabs/jlpt_n1.json',
    available: true,
    total: 3463,
    version: '2.0',
  },
  n3_all: {
    label: 'N3 Tổng hợp',
    dataUrl: 'database/vocabs/n3_all.json',
    available: true,
    total: 688,
    version: '2.0',
  },
  n3_verbs: {
    label: 'Động từ N3',
    dataUrl: 'database/vocabs/n3_verbs.json',
    available: true,
    total: 169,
    version: '2.0',
  },
  n3_nouns: {
    label: 'Danh từ N3',
    dataUrl: 'database/vocabs/n3_nouns.json',
    available: true,
    total: 82,
    version: '2.0',
  },
  n3_adjectives: {
    label: 'Tính từ N3',
    dataUrl: 'database/vocabs/n3_adjectives.json',
    available: true,
    total: 42,
    version: '2.0',
  },
  n3_adverbs: {
    label: 'Phó từ & Liên từ',
    dataUrl: 'database/vocabs/n3_adverbs.json',
    available: true,
    total: 122,
    version: '2.0',
  },
  n3_katakana: {
    label: 'Katakana N3',
    dataUrl: 'database/vocabs/n3_katakana.json',
    available: true,
    total: 79,
    version: '2.0',
  },
  n3_kanji_minna: {
    label: 'Hán tự Minna',
    dataUrl: 'database/vocabs/n3_kanji_minna.json',
    available: true,
    total: 225,
    version: '2.0',
  },
  n3_kanji_all: {
    label: 'Kanji & Từ ghép',
    dataUrl: 'database/vocabs/n3_kanji_all.json',
    available: true,
    total: 924,
    version: '2.0',
  },
};

// Mapping of legacy level keys to modern canonical JLPT keys
const CANONICAL_LEVEL_MAP = {
  hsk1: 'jlpt_n5',
  hsk2: 'jlpt_n4',
  hsk3: 'jlpt_n3',
  hsk4: 'jlpt_n2',
  hsk5: 'jlpt_n1',
  hsk6: 'n3_all',
};

function canonicalizeLevel(level) {
  if (!level) return level;
  return CANONICAL_LEVEL_MAP[level] || level;
}
if (typeof window !== 'undefined') {
  window.CANONICAL_LEVEL_MAP = CANONICAL_LEVEL_MAP;
  window.canonicalizeLevel = canonicalizeLevel;
  window.LEVELS = LEVELS;
}

// Aliases for backwards compatibility (defined as non-enumerable so Object.keys(LEVELS) stays clean)
['hsk1', 'hsk2', 'hsk3', 'hsk4', 'hsk5', 'hsk6'].forEach(alias => {
  const targetKey = CANONICAL_LEVEL_MAP[alias];
  Object.defineProperty(LEVELS, alias, {
    get() { return LEVELS[targetKey]; },
    enumerable: false,
    configurable: true,
  });
});

// JLPT N3 Grammar & Specialized decks (accessible via the switch tab)
const LEVELS_HSK30 = {
  n3_all: { label: 'N3 Tổng hợp', band: 'Từ vựng N3', dataUrl: 'database/vocabs/n3_all.json', available: true, total: 688, version: '3.0' },
  n3_verbs: { label: 'Động từ N3', band: 'Mimi kara', dataUrl: 'database/vocabs/n3_verbs.json', available: true, total: 169, version: '3.0' },
  n3_nouns: { label: 'Danh từ N3', band: 'Mimi kara', dataUrl: 'database/vocabs/n3_nouns.json', available: true, total: 82, version: '3.0' },
  n3_adjectives: { label: 'Tính từ N3', band: 'Mimi kara', dataUrl: 'database/vocabs/n3_adjectives.json', available: true, total: 42, version: '3.0' },
  n3_adverbs: { label: 'Phó từ & Liên từ', band: 'Mimi kara', dataUrl: 'database/vocabs/n3_adverbs.json', available: true, total: 122, version: '3.0' },
  n3_katakana: { label: 'Katakana N3', band: 'Ngoại lai', dataUrl: 'database/vocabs/n3_katakana.json', available: true, total: 79, version: '3.0' },
  n3_kanji_minna: { label: 'Hán tự Minna', band: 'Minna Chukyu', dataUrl: 'database/vocabs/n3_kanji_minna.json', available: true, total: 225, version: '3.0' },
  n3_kanji_all: { label: 'Kanji & Từ ghép', band: 'Kanji N3', dataUrl: 'database/vocabs/n3_kanji_all.json', available: true, total: 924, version: '3.0' },
  n3_grammar_skz: { label: 'NP Shinkanzen', band: 'Ngữ pháp', dataUrl: 'database/vocabs/n3_grammar_skz.json', available: true, total: 106, version: '3.0' },
  n3_grammar_mimi: { label: 'NP 耳から覚える', band: 'Ngữ pháp', dataUrl: 'database/vocabs/n3_grammar_mimi.json', available: true, total: 139, version: '3.0' },
  n3_grammar_minna: { label: 'NP Minna Trung cấp', band: 'Ngữ pháp', dataUrl: 'database/vocabs/n3_grammar_minna.json', available: true, total: 211, version: '3.0' },
  n3_reading_listening: { label: 'Đọc & Nghe hiểu', band: 'Kỹ năng', dataUrl: 'database/vocabs/n3_reading_listening.json', available: true, total: 264, version: '3.0' },
  n3_exam_practice: { label: 'Luyện đề Mondai', band: 'Luyện thi', dataUrl: 'database/vocabs/n3_exam_practice.json', available: true, total: 172, version: '3.0' },
};
Object.assign(LEVELS, LEVELS_HSK30);

// Topic decks: same word schema as LEVELS, browsed from the "Chủ đề" tab.
const TOPICS = {
  topic_nouns: { label: 'Danh từ N3', icon: '📖', dataUrl: 'database/vocabs/n3_nouns.json', available: true, total: 82, isTopic: true },
  topic_verbs: { label: 'Động từ N3', icon: '🏃', dataUrl: 'database/vocabs/n3_verbs.json', available: true, total: 169, isTopic: true },
  topic_adjs: { label: 'Tính từ N3', icon: '✨', dataUrl: 'database/vocabs/n3_adjectives.json', available: true, total: 42, isTopic: true },
  topic_katakana: { label: 'Katakana N3', icon: '🔤', dataUrl: 'database/vocabs/n3_katakana.json', available: true, total: 79, isTopic: true },
};
Object.assign(LEVELS, TOPICS);

function hskLevelKeys() {
  return ['jlpt_n5', 'jlpt_n4', 'jlpt_n3', 'jlpt_n2', 'jlpt_n1'];
}

function hsk30LevelKeys() {
  return [
    'n3_all', 'n3_verbs', 'n3_nouns', 'n3_adjectives', 'n3_adverbs', 'n3_katakana', 'n3_kanji_minna', 'n3_kanji_all',
    'n3_grammar_skz', 'n3_grammar_mimi', 'n3_grammar_minna', 'n3_reading_listening', 'n3_exam_practice'
  ];
}
const SPEECH_RATE = 0.85;
const EXAMPLE_SPEECH_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const DEFAULT_EXAMPLE_SPEECH_SPEED = 1;

let currentLevel = null;
let WORDS = [];
let order = [];
let filteredOrder = [];
let idx = 0;
let progress = {};
let srsCards = {};
let reviewLog = [];
let srsRetention = 0.9;
let showPinyin = true;
let showHanViet = (function() {
  try {
    const saved = localStorage.getItem('hsk_show_hanviet');
    return saved !== null ? saved === 'true' : true;
  } catch (e) {
    return true;
  }
})();
let currentFilter = 'all';
let transitionTimer = null;
let celebrationShown = false;
let cachedVoices = [];
let speechRequestId = 0;
let activeSpeechButton = null;
let activeSpeechAudio = null;
let prebuiltAudioManifest = null;
let exampleSpeechSpeed = DEFAULT_EXAMPLE_SPEECH_SPEED;
let currentView = 'cards';
let overviewQuery = '';
let overviewStatus = 'all';
let reviewPool = [];
let reviewIndex = 0;
let reviewLives = 3;
let reviewScore = 0;
let reviewStreak = 0;
let reviewBestStreak = 0;
let reviewMistakes = [];
let reviewTimer = null;
let reviewTimeLeft = 20;
let reviewCurrentQuestion = null;
let reviewAnswered = false;
let reviewSessionLive = false;
let reviewWordPool = [];
let reviewProgressByLevel = {};
let reviewCardsByLevel = {};
let todayReviewQueue = [];
let todayReviewIndex = 0;
let reviewLoadedRangeMax = 0;
let reviewWorker = null;

function formatExampleSpeechSpeed(speed) {
  const numericSpeed = Number(speed);
  return `${Number.isInteger(numericSpeed) ? numericSpeed.toFixed(1) : numericSpeed} x`;
}

function setExampleSpeechSpeed(value) {
  const nextSpeed = Number(value);
  if (!EXAMPLE_SPEECH_SPEEDS.includes(nextSpeed)) return;

  exampleSpeechSpeed = nextSpeed;
  stopSpeech();

  const currentSpeed = document.getElementById('exampleCurrentSpeed');
  if (currentSpeed) currentSpeed.textContent = formatExampleSpeechSpeed(nextSpeed);
  const speedSummary = document.querySelector('#exampleSpeedPicker summary');
  if (speedSummary) {
    speedSummary.setAttribute('aria-label', `Tốc độ đọc câu ví dụ: ${formatExampleSpeechSpeed(nextSpeed)}`);
  }
  document.querySelectorAll('.example-speed-option').forEach(option => {
    const isSelected = Number(option.dataset.speed) === nextSpeed;
    option.classList.toggle('selected', isSelected);
    option.setAttribute('aria-pressed', String(isSelected));
  });

  const speedPicker = document.getElementById('exampleSpeedPicker');
  if (speedPicker) speedPicker.open = false;
}

function pickJapaneseVoice() {
  if (typeof getJapaneseVoice === 'function') return getJapaneseVoice();
  if (typeof SpeechService !== 'undefined' && typeof SpeechService.getJapaneseVoice === 'function') {
    return SpeechService.getJapaneseVoice();
  }
  if (!('speechSynthesis' in window)) return null;
  if (!cachedVoices.length) cachedVoices = speechSynthesis.getVoices();
  return cachedVoices.find(v => v.lang === 'ja-JP' || v.lang === 'ja_JP')
    || cachedVoices.find(v => v.lang && v.lang.toLowerCase().startsWith('ja'))
    || null;
}

function pickChineseVoice() {
  return pickJapaneseVoice();
}
if ('speechSynthesis' in window) {
  cachedVoices = speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => { cachedVoices = speechSynthesis.getVoices(); };
}

let speechWarmed = false;
function warmUpSpeech() {
  if (speechWarmed || !('speechSynthesis' in window)) return;
  speechWarmed = true;
  try {
    const warmUp = new SpeechSynthesisUtterance('');
    warmUp.volume = 0;
    speechSynthesis.speak(warmUp);
  } catch (e) {}
}
document.addEventListener('touchstart', warmUpSpeech, { once: true, passive: true });
document.addEventListener('click', warmUpSpeech, { once: true });

function storageKey(suffix) {
  return 'hsk_' + currentLevel + '_' + suffix + '_v2';
}

let activeStudyWord = null;
const activeWordListeners = [];

function onActiveWordChange(fn) {
  activeWordListeners.push(fn);
}

function setActiveStudyWord(word) {
  activeStudyWord = word;
  document.body.classList.toggle('has-active-study-word', Boolean(word && word.hanzi));
  activeWordListeners.forEach(fn => {
    try { fn(word); } catch (e) { /* one listener's failure must not block others */ }
  });
}

// Universal vocabulary search normalization and matching helper.
// Supports:
// - Hanzi (exact & partial)
// - Pinyin with tones (hēibǎn), without tones (heiban), with tone numbers (hei1ban3, hei1 ban3)
// - Pinyin with or without spaces between syllables (heiban <-> hei ban)
// - Pinyin with ü, v, or u (lǜ, lv, lu; nǚ, nv, nu)
// - Sino-Vietnamese / Hán Việt with or without accents (Hắc Bản, hac ban)
// - Vietnamese meaning with or without accents & đ -> d (bảng đen, bang den)
function normalizeSearchText(str) {
  if (!str) return '';
  return String(str)
    .replace(/[đĐ]/g, 'd')
    .replace(/[ǖǘǚǜü]/g, 'v')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function wordMatchesQuery(word, query) {
  if (!query) return true;
  if (!word) return false;
  const rawQ = query.trim().toLowerCase();
  if (!rawQ) return true;

  // 1. Hanzi match (exact or substring)
  if (word.hanzi && word.hanzi.includes(rawQ)) return true;

  // 2. Exact match in raw string (meaning, pinyin, hanviet)
  const rawTarget = `${word.hanzi || ''} ${word.pinyin || ''} ${word.hanviet || ''} ${word.meaning || ''}`.toLowerCase();
  if (rawTarget.includes(rawQ)) return true;

  const normQ = normalizeSearchText(rawQ);
  if (!normQ) return false;

  // 3. Normalized target strings (support both v and u for ü)
  const normPinyinV = normalizeSearchText(word.pinyin);
  const normPinyinU = normalizeSearchText(String(word.pinyin || '').replace(/[ǖǘǚǜü]/g, 'u'));
  const normHanviet = normalizeSearchText(word.hanviet);
  const normMeaning = normalizeSearchText(word.meaning);

  const normTarget = `${word.hanzi || ''} ${normPinyinV} ${normPinyinU} ${normHanviet} ${normMeaning}`;
  if (normTarget.includes(normQ)) return true;

  // 4. Spaceless match (e.g. user typed "hei ban" matching "heiban", or "heiban" matching "hei ban")
  const spacelessQ = normQ.replace(/[\s\-_'".]+/g, '');
  const spacelessPinyinV = normPinyinV.replace(/[\s\-_'".]+/g, '');
  const spacelessPinyinU = normPinyinU.replace(/[\s\-_'".]+/g, '');
  const spacelessHanviet = normHanviet.replace(/[\s\-_'".]+/g, '');
  const spacelessMeaning = normMeaning.replace(/[\s\-_'".]+/g, '');

  if (spacelessQ && (
    spacelessPinyinV.includes(spacelessQ) ||
    spacelessPinyinU.includes(spacelessQ) ||
    spacelessHanviet.includes(spacelessQ) ||
    spacelessMeaning.includes(spacelessQ)
  )) {
    return true;
  }

  // 5. Tone numbers in query (e.g. "hei1ban3" -> "heiban")
  const strippedDigitsQ = spacelessQ.replace(/[0-5]/g, '');
  if (strippedDigitsQ && (
    spacelessPinyinV.includes(strippedDigitsQ) ||
    spacelessPinyinU.includes(strippedDigitsQ)
  )) {
    return true;
  }

  // 6. Multi-token match: all tokens in query must match
  const tokens = normQ.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    const allMatch = tokens.every(tok => {
      const cleanTok = tok.replace(/[0-5]/g, '');
      return normTarget.includes(tok) ||
             (cleanTok && (spacelessPinyinV.includes(cleanTok) || spacelessPinyinU.includes(cleanTok)));
    });
    if (allMatch) return true;
  }

  return false;
}

