/**
 * word-illustrations.js
 * Visual Mnemonic, Conceptual Illustration & Part of Speech (POS) Engine for JLPT Flashcards.
 * Supports vector SVGs, curated mnemonic stories, remote URLs, and POS classification.
 */

const POS_TYPES = {
  adj: { code: 'adj', label: 'Tính từ', en: 'Adjective', full: 'Tính từ / Adjective' },
  verb: { code: 'verb', label: 'Động từ', en: 'Verb', full: 'Động từ / Verb' },
  noun: { code: 'noun', label: 'Danh từ', en: 'Noun', full: 'Danh từ / Noun' },
  adv: { code: 'adv', label: 'Phó từ', en: 'Adverb', full: 'Phó từ / Adverb' },
  measure: { code: 'measure', label: 'Lượng từ', en: 'Measure Word', full: 'Lượng từ / Measure Word' },
  pron: { code: 'pron', label: 'Đại từ', en: 'Pronoun', full: 'Đại từ / Pronoun' },
  prep: { code: 'prep', label: 'Giới từ', en: 'Preposition', full: 'Giới từ / Preposition' },
  conj: { code: 'conj', label: 'Liên từ', en: 'Conjunction', full: 'Liên từ / Conjunction' },
  num: { code: 'num', label: 'Số từ', en: 'Numeral', full: 'Số từ / Numeral' },
  particle: { code: 'particle', label: 'Trợ từ', en: 'Particle', full: 'Trợ từ / Particle' },
  interj: { code: 'interj', label: 'Thán từ', en: 'Interjection', full: 'Thán từ / Interjection' },
  phrase: { code: 'phrase', label: 'Cụm từ', en: 'Phrase', full: 'Cụm từ / Phrase' },
  idiom: { code: 'idiom', label: 'Thành ngữ', en: 'Idiom', full: 'Thành ngữ / Idiom' }
};

// Part of Speech lookup dictionary for JLPT
const JLPT_POS_DB = {};

function getWordPartOfSpeech(word) {
  if (!word) return null;
  // 1. Explicit POS field on word object
  if (word.pos) {
    if (typeof word.pos === 'object') return word.pos;
    if (POS_TYPES[word.pos]) return POS_TYPES[word.pos];
    return { code: 'noun', label: word.pos, en: word.pos, full: word.pos };
  }

  const hanzi = (word.hanzi || word.word || '').trim();
  const cleanHanzi = hanzi.replace(/[（\(].*?[）\)]/g, '').trim();

  // 2. Lookup in official JLPT_POS_DB
  const code = (typeof JLPT_POS_DB !== 'undefined' && (JLPT_POS_DB[hanzi] || JLPT_POS_DB[cleanHanzi])) || null;
  if (code && POS_TYPES[code]) {
    return POS_TYPES[code];
  }

  // 3. Intelligent heuristic fallback based on Vietnamese meaning
  const m = (word.meaning || '').toLowerCase().trim();
  if (!m) return POS_TYPES.noun;

  if (/\b(thán từ|ôi|chà|a|ha)\b/.test(m) || m.includes('(thán từ)')) return POS_TYPES.interj;
  if (/^(lượng từ|chiếc|cái|con|quyển|cuốn|bức|tấm|cây|bộ|đôi|ly|tách|bát|lần|chuyến|ngụm)\b/.test(m) || m.includes('lượng từ')) return POS_TYPES.measure;
  if (/^(đại từ|tôi|bạn|anh ấy|cô ấy|chúng tôi|chúng ta|mọi người|ai|gì|đây|đó|kia|mình|bản thân)\b/.test(m) || m.includes('đại từ')) return POS_TYPES.pron;
  if (/^(và|hơn nữa|nhưng|tuy nhiên|hoặc|nếu|bởi vì|cho nên|bất kể|mặc dù|cho dù|chỉ cần|thà rằng|ví như|chẳng hạn)\b/.test(m) || m.includes('liên từ')) return POS_TYPES.conj;
  if (/^(theo|dựa theo|đối với|hướng về|từ|đến|căn cứ vào|bởi|do|nhờ)\b/.test(m) || m.includes('giới từ')) return POS_TYPES.prep;
  if (/^(rất|quá|vô cùng|đều|luôn|thường|thường xuyên|lại|vừa|đang|đã|sẽ|chưa|không|chẳng|thực ra|đột nhiên|tự nhiên|nhất định|hầu như|đặc biệt|ban đầu|vốn dĩ|càng|buộc phải|lập tức|ngay)\b/.test(m) || m.includes('phó từ')) return POS_TYPES.adv;
  if (/^(phù hợp|thích hợp|đẹp|xấu|vui|buồn|tốt|khó|dễ|nhanh|chậm|lớn|to|nhỏ|mới|cũ|rẻ|đắt|an toàn|nguy hiểm|sạch|bẩn|thông minh|ngu ngốc|ấm|lạnh|nóng|ngon|ngọt|cay|đắng|mặn|dài|ngắn|cao|thấp|giàu|nghèo|rộng|hẹp|nổi tiếng|quan trọng|phức tạp|chính xác|nghiêm trọng|rõ ràng|đơn giản|tuyệt vời|nghiêm túc|cẩn thận|tự hào|tự tin|bận rộn|rảnh rỗi|gần|xa|khác biệt|thân thiết|nhiệt tình|kiên nhẫn|gầy|béo|sâu|nông|chắc chắn|vui vẻ|hạnh phúc|cô đơn|yên tĩnh|ồn ào)\b/.test(m) || m.includes('tính từ')) return POS_TYPES.adj;
  if (/^(làm|đi|nói|ăn|uống|xem|mua|bán|học|chạy|bay|đến|rời|giúp|tổ chức|chuẩn bị|phát hiện|tham gia|quyết định|giải quyết|sử dụng|cung cấp|tìm|gặp|nhớ|hiểu|yêu|ghét|thích|lo|nghĩ|biết|mặc|đeo|viết|đọc|nghe|sắp xếp|bố trí|ôm|xin lỗi|đăng ký|tốt nghiệp|biểu thị|thể hiện|biểu diễn|khen ngợi|bảo vệ|đảm bảo|thực hiện|hoàn thành|phát triển|mở rộng|thay đổi|tổng kết|du lịch|trao đổi|kết hôn|kinh doanh|nghiên cứu|chiến đấu|chúc mừng|cảm ơn|kính trọng|mời|chờ|đợi|hy vọng|ước|tin|nghi ngờ|chú ý|quan tâm|giảng|dạy|vẽ|hát|múa|bơi|chơi|sửa|chữa|chọn|chọn lựa)\b/.test(m) || m.includes('động từ')) return POS_TYPES.verb;

  return POS_TYPES.noun;
}

const WORD_ILLUSTRATIONS_DB = {};
const STATIC_ILLUSTRATIONS_INDEX = {};

/**
 * Returns illustration config for a word.
 * Fallback to intelligent POS-themed conceptual vector graphic.
 */
function getWordIllustration(word) {
  if (!word) return null;

  // 1. Direct word.image field (URL, base64 or inline SVG)
  if (word.image) {
    if (typeof word.image === 'string' && word.image.startsWith('<svg')) {
      return { type: 'svg', svg: word.image, caption: word.meaning || '' };
    }
    return { type: 'img', src: word.image, caption: word.meaning || '' };
  }

  const hanzi = (word.hanzi || word.word || '').trim();

  // 2. Pre-generated static AI illustrations from assets/images/illustrations/
  if (typeof STATIC_ILLUSTRATIONS_INDEX !== 'undefined' && STATIC_ILLUSTRATIONS_INDEX[hanzi]) {
    const item = STATIC_ILLUSTRATIONS_INDEX[hanzi];
    return {
      type: item.type || (item.file && item.file.endsWith('.svg') && !item.src ? 'svg' : 'img'),
      src: item.src || `assets/images/illustrations/${item.file}`,
      svg: item.svg,
      caption: item.caption || word.meaning || ''
    };
  }

  // 3. Preset curated illustrations
  if (WORD_ILLUSTRATIONS_DB[hanzi]) {
    return WORD_ILLUSTRATIONS_DB[hanzi];
  }

  // 4. Fallback: Sleek POS-Themed Conceptual Vector Graphic
  return generateAestheticFallback(word);
}

/**
 * Generates an authentic Japanese Sakura watercolor illustration.
 * Replaces 3D cubes/abstract shapes with an elegant cherry blossom branch in soft sumi-e style.
 */
function getJapaneseSakuraIllustrationSvg() {
  return `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cành hoa anh đào Nhật Bản">
    <defs>
      <!-- Soft aura background wash (watercolour diffusion) -->
      <radialGradient id="sakuraAura" cx="48%" cy="46%" r="52%">
        <stop offset="0%" stop-color="#F4A7B9" stop-opacity="0.18" />
        <stop offset="55%" stop-color="#FFCAD4" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#FFCAD4" stop-opacity="0" />
      </radialGradient>
      <!-- Petal watercolor gradient -->
      <linearGradient id="petalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFF0F3" />
        <stop offset="60%" stop-color="#F8BBD0" />
        <stop offset="100%" stop-color="#E87A90" />
      </linearGradient>
      <linearGradient id="petalGrad2" x1="10%" y1="0%" x2="90%" y2="100%">
        <stop offset="0%" stop-color="#FFE4EC" />
        <stop offset="65%" stop-color="#F4A7B9" />
        <stop offset="100%" stop-color="#D96C91" />
      </linearGradient>
      <!-- Pistil center glow -->
      <radialGradient id="sakuraPistil" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFD166" />
        <stop offset="60%" stop-color="#E85D7F" />
        <stop offset="100%" stop-color="#C72E54" />
      </radialGradient>
      <!-- Sumi-e branch texture gradient -->
      <linearGradient id="sumiBranch" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#3A3038" />
        <stop offset="50%" stop-color="#4E404B" />
        <stop offset="100%" stop-color="#322830" />
      </linearGradient>
    </defs>

    <!-- Gentle circular watercolor wash in background -->
    <circle cx="100" cy="100" r="78" fill="url(#sakuraAura)" />
    <circle cx="100" cy="100" r="82" stroke="#F4A7B9" stroke-opacity="0.12" stroke-width="1" stroke-dasharray="2 4" />

    <!-- Sumi-e styled cherry blossom branch -->
    <path d="M 28 162 C 55 152 75 142 98 122 C 118 105 138 92 166 84" stroke="url(#sumiBranch)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 68 147 C 78 138 88 135 94 125" stroke="url(#sumiBranch)" stroke-width="3" stroke-linecap="round" />
    <path d="M 98 122 C 104 108 108 96 112 80" stroke="url(#sumiBranch)" stroke-width="2.6" stroke-linecap="round" />
    <path d="M 132 98 C 144 108 152 114 162 118" stroke="url(#sumiBranch)" stroke-width="2.2" stroke-linecap="round" />
    <path d="M 112 80 C 118 72 122 66 128 60" stroke="url(#sumiBranch)" stroke-width="1.8" stroke-linecap="round" />

    <!-- Flower 1: Main Full Bloom Blossom (centered at branch node x=98, y=118) -->
    <g transform="translate(98, 118)">
      <path d="M 0 0 C -10 -14 -12 -28 -4 -34 C -1 -36 0 -33 1 -33 C 2 -33 3 -36 6 -34 C 14 -28 12 -14 0 0 Z" fill="url(#petalGrad1)" opacity="0.95" />
      <path d="M 0 0 C 8 -12 22 -18 30 -14 C 33 -12 30 -10 31 -9 C 32 -8 35 -9 36 -7 C 36 2 26 12 0 0 Z" fill="url(#petalGrad2)" opacity="0.92" />
      <path d="M 0 0 C 12 4 24 16 22 24 C 21 27 18 25 17 26 C 16 27 17 30 14 31 C 6 32 -2 22 0 0 Z" fill="url(#petalGrad1)" opacity="0.94" />
      <path d="M 0 0 C -4 12 -14 24 -22 22 C -25 21 -23 18 -24 17 C -25 16 -28 17 -29 14 C -30 6 -20 -2 0 0 Z" fill="url(#petalGrad2)" opacity="0.92" />
      <path d="M 0 0 C -12 -4 -24 -16 -22 -24 C -21 -27 -18 -25 -17 -26 C -16 -27 -17 -30 -14 -31 C -6 -32 2 -22 0 0 Z" fill="url(#petalGrad1)" opacity="0.95" />
      <circle cx="0" cy="0" r="5.5" fill="url(#sakuraPistil)" />
      <path d="M 0 0 L -4 -9 M 0 0 L 3 -10 M 0 0 L 8 -5 M 0 0 L 8 4 M 0 0 L 3 9 M 0 0 L -5 8 M 0 0 L -8 2 M 0 0 L -8 -5" stroke="#E85D7F" stroke-width="1.1" stroke-linecap="round" opacity="0.85" />
      <circle cx="-4" cy="-9" r="1.3" fill="#FBD38D" />
      <circle cx="3" cy="-10" r="1.3" fill="#FBD38D" />
      <circle cx="8" cy="-5" r="1.3" fill="#FBD38D" />
      <circle cx="8" cy="4" r="1.3" fill="#FBD38D" />
      <circle cx="3" cy="9" r="1.3" fill="#FBD38D" />
      <circle cx="-5" cy="8" r="1.3" fill="#FBD38D" />
      <circle cx="-8" cy="2" r="1.3" fill="#FBD38D" />
      <circle cx="-8" cy="-5" r="1.3" fill="#FBD38D" />
    </g>

    <!-- Flower 2: Side angled blossom at x=142, y=92 -->
    <g transform="translate(142, 92) rotate(-22)">
      <path d="M 0 0 C -6 -10 -10 -20 -3 -24 C 0 -25 2 -23 3 -24 C 9 -20 8 -10 0 0 Z" fill="url(#petalGrad1)" opacity="0.92" />
      <path d="M 0 0 C 6 -9 17 -12 21 -8 C 22 -5 20 -4 21 -3 C 21 3 14 9 0 0 Z" fill="url(#petalGrad2)" opacity="0.90" />
      <path d="M 0 0 C 8 3 15 11 12 16 C 9 17 8 14 7 15 C 2 17 -2 12 0 0 Z" fill="url(#petalGrad1)" opacity="0.92" />
      <path d="M 0 0 C -5 7 -12 12 -16 8 C -16 4 -14 4 -15 3 C -15 -2 -10 -6 0 0 Z" fill="url(#petalGrad2)" opacity="0.88" />
      <circle cx="0" cy="0" r="4" fill="url(#sakuraPistil)" />
      <path d="M 0 0 L -2 -7 M 0 0 L 3 -7 M 0 0 L 6 -2 M 0 0 L 4 5 M 0 0 L -3 5" stroke="#E85D7F" stroke-width="1" stroke-linecap="round" />
      <circle cx="-2" cy="-7" r="1" fill="#FBD38D" />
      <circle cx="3" cy="-7" r="1" fill="#FBD38D" />
      <circle cx="6" cy="-2" r="1" fill="#FBD38D" />
    </g>

    <!-- Flower 3: Small bud unfurling at upper tip x=128, y=60 -->
    <g transform="translate(128, 60) rotate(35)">
      <path d="M -4 8 C -2 3 0 0 2 8 Z" fill="#6B7C59" opacity="0.75" />
      <path d="M 0 5 C -7 -2 -6 -12 0 -15 C 6 -12 7 -2 0 5 Z" fill="url(#petalGrad2)" opacity="0.92" />
      <path d="M -3 3 C -9 -3 -5 -11 0 -13 C 2 -7 0 0 -3 3 Z" fill="url(#petalGrad1)" opacity="0.88" />
    </g>

    <!-- Flower 4: Small bud at branch fork x=62, y=144 -->
    <g transform="translate(62, 144) rotate(-40)">
      <path d="M -3 6 C -1 2 0 0 2 6 Z" fill="#6B7C59" opacity="0.75" />
      <path d="M 0 4 C -5 -2 -4 -9 0 -11 C 4 -9 5 -2 0 4 Z" fill="url(#petalGrad1)" opacity="0.9" />
    </g>

    <!-- Soft Drifting Petals -->
    <g transform="translate(155, 145) rotate(42)">
      <path d="M 0 0 C -4 -6 -6 -13 -1 -15 C 1 -15 2 -14 3 -14 C 6 -12 6 -6 0 0 Z" fill="url(#petalGrad1)" opacity="0.78" />
    </g>
    <g transform="translate(52, 95) rotate(-28)">
      <path d="M 0 0 C -3 -5 -5 -10 -1 -12 C 0 -12 1 -11 2 -11 C 5 -10 5 -5 0 0 Z" fill="url(#petalGrad2)" opacity="0.65" />
    </g>
    <g transform="translate(115, 168) rotate(18)">
      <path d="M 0 0 C -2 -4 -3 -8 0 -9 C 1 -9 2 -8 3 -8 C 4 -7 3 -3 0 0 Z" fill="url(#petalGrad1)" opacity="0.55" />
    </g>
  </svg>`;
}

function generateAestheticFallback(word) {
  const pos = getWordPartOfSpeech(word) || POS_TYPES.noun;
  const meaning = word ? (word.meaning || '') : '';

  return {
    type: 'svg',
    isFallback: true,
    svg: getJapaneseSakuraIllustrationSvg(),
    caption: meaning || pos.label || 'Hoa anh đào · Minh họa tiếng Nhật'
  };
}

/**
 * Dynamic Contextual Prompt Builder for AI Image Generation (DALL-E 3, Imagen 3, Gemini, Midjourney).
 * Automatically extracts real-world scenarios, human actions, or concrete physical objects
 * based on the word definition, part of speech, and contextual example sentences.
 *
 * @param {Object} word - Word item with hanzi, pinyin, meaning, part_of_speech/pos, and example sentences.
 * @returns {Object} Structured prompt metadata { prompt, style, visualSubject, negativePrompt }
 */
function buildContextualPrompt(word) {
  if (!word) return { prompt: '', style: '', visualSubject: '', negativePrompt: '' };

  const hanzi = (word.hanzi || word.word || '').trim();
  const pinyin = (word.pinyin || '').trim();
  const meaning = (word.meaning || '').trim();
  const pos = (typeof getWordPartOfSpeech === 'function' ? getWordPartOfSpeech(word) : null) || { code: 'noun', label: 'Danh từ', en: 'Noun' };
  const posCode = pos.code || 'noun';

  // Extract clean example context (without HTML tags like <u>...</u>)
  const exZh = (word.example_zh || word.example || '').replace(/<[^>]*>/g, '').trim();
  const exVi = (word.example_vi || '').replace(/<[^>]*>/g, '').trim();

  // Define visual scene anchor based on Part of Speech and concrete semantic role
  let actionScene = '';
  switch (posCode) {
    case 'verb':
      actionScene = `A rich, detailed scene-based real-world human action representing the exact definition of '${meaning}'. Show a stylized, expressive character actively performing the action with authentic body posture and emotion. Include environmental details and props (e.g. stage, room, tools, surfaces, lighting, foreground and background elements) to clearly establish the context of the action. Absolutely NO abstract symbols, geometric badges, or floating icons.`;
      break;
    case 'noun':
      actionScene = `A vivid, scene-based real-world environment or tangible physical object representing '${meaning}'. Place the subject in an authentic, tangible context with surrounding props, realistic surfaces, atmospheric depth, and spatial details rather than an isolated generic icon.`;
      break;
    case 'adj':
      actionScene = `A rich real-world scenario featuring an expressive character vividly embodying the state or emotion of '${meaning}'. Depict expressive facial emotion, dynamic body posture, and immersive atmospheric ambiance (e.g., dramatic lighting, weather, or room setting) making the concept immediately intuitive.`;
      break;
    case 'adv':
      actionScene = `An authentic, scene-based human story grounded directly in the example sentence depicting the situation or moment of '${meaning}' with relatable characters, expressive body posture, and environmental props. Absolutely NO abstract sliders, gauges, meters, emojis, or progress bars.`;
      break;
    case 'conj':
      actionScene = `A relatable real-world human scenario demonstrating the connecting context of '${meaning}' grounded in the example sentence, with expressive characters and environment props. Absolutely NO abstract bridge icons, arrows, or flowcharts.`;
      break;
    case 'measure':
      actionScene = `A modular grouping of everyday tangible items demonstrating the counting unit concept of '${meaning}', stacked or arranged neatly in an authentic real-world scene.`;
      break;
    default:
      actionScene = `An intuitive, scene-based real-world scenario illustrating the communicative concept of '${meaning}' with characters, props, and environment.`;
  }

  // Include contextual scenario clue if example sentence is available
  let contextClue = '';
  if (exVi) {
    contextClue = ` Contextual real-world reference: '${exVi}'.`;
  } else if (exZh) {
    contextClue = ` Context reference: '${exZh}'.`;
  }

  // Strict visual style guidelines
  const visualStyle = 'Clean, friendly 2D flat cartoon or minimalist vector illustration with expressive contours, rich narrative depth, and full-bleed composition filling the container space. Dark-mode friendly color palette with deep slate navy background (#0f172a, #1e293b), muted blues, warm golden/amber glows (#f59e0b, #fbbf24), and energetic modern accents (#38bdf8, #10b981, #ec4899, #fb923c).';

  // Strict negative constraints
  const negativeConstraints = 'STRICT NEGATIVE CONSTRAINTS: Absolutely NO abstract symbols, NO logos, NO minimalist icons, NO geometric badges, NO sliders, NO progress bars, NO gauges, NO meter dials, NO floating emojis. Absolutely NO text, NO letters, NO words, NO subtitles, NO typography, NO Chinese characters, NO Hanzi, NO English words, NO pinyin, NO brand logos, NO Gemini logos, NO watermarks, NO 3D photorealistic rendering.';

  const fullPrompt = `${visualStyle} Subject: ${actionScene}${contextClue} Designed for language flashcard memory anchoring. ${negativeConstraints}`;

  return {
    prompt: fullPrompt,
    style: visualStyle,
    visualSubject: actionScene,
    contextClue: contextClue,
    negativePrompt: negativeConstraints
  };
}

// ==========================================================================
// Synapse Instant-Load Acceleration Engine: Multi-Tier SVG Cache & Preloader
// ==========================================================================
const SynapseSvgCache = (typeof window !== 'undefined' && window.SynapseSvgCache) ? window.SynapseSvgCache : new Map();
const SynapseInflightFetches = (typeof window !== 'undefined' && window.SynapseInflightFetches) ? window.SynapseInflightFetches : new Map();
const SYNAPSE_ILLU_CACHE_NAME = 'synapse-illustrations-v1';

/**
 * Normalizes input to an illustration src string.
 */
function extractIllustrationSrc(illuOrSrcOrWord) {
  if (!illuOrSrcOrWord) return '';
  if (typeof illuOrSrcOrWord === 'string') return illuOrSrcOrWord;
  if (illuOrSrcOrWord.src) return illuOrSrcOrWord.src;
  if (illuOrSrcOrWord.hanzi || illuOrSrcOrWord.word) {
    const illu = getWordIllustration(illuOrSrcOrWord);
    return (illu && illu.src) ? illu.src : '';
  }
  return '';
}

/**
 * Preload an individual illustration into browser RAM and persistent CacheStorage.
 * Returns a Promise that resolves with the raw SVG string if available.
 * @param {string|Object} illuOrSrc - Source path, illustration object, or word item.
 * @param {string} priority - 'high' | 'auto' | 'low'
 */
function preloadIllustration(illuOrSrc, priority = 'auto') {
  const src = extractIllustrationSrc(illuOrSrc);
  if (!src) return Promise.resolve(null);

  // 1. Tier 1: Instant RAM Cache (<0.05ms)
  if (SynapseSvgCache.has(src)) {
    return Promise.resolve(SynapseSvgCache.get(src));
  }

  // 2. Inflight deduplication to avoid redundant network requests
  if (SynapseInflightFetches.has(src)) {
    return SynapseInflightFetches.get(src);
  }

  const p = (async () => {
    try {
      // 3. Tier 2: Persistent CacheStorage check
      if (typeof window !== 'undefined' && 'caches' in window) {
        try {
          const illuCache = await caches.open(SYNAPSE_ILLU_CACHE_NAME);
          const cachedRes = await illuCache.match(src);
          if (cachedRes) {
            const cachedText = await cachedRes.text();
            if (cachedText && cachedText.includes('<svg')) {
              SynapseSvgCache.set(src, cachedText);
              return cachedText;
            }
          }
        } catch (_) {}
      }

      // 4. Tier 3: Fetch directly over network
      const isSvg = src.endsWith('.svg') || src.includes('.svg');
      const fetchOpts = { cache: 'force-cache' };
      if (priority === 'high' && 'priority' in Request.prototype) {
        fetchOpts.priority = 'high';
      }

      if (isSvg) {
        const res = await fetch(src, fetchOpts);
        if (res.ok) {
          const text = await res.text();
          if (text && text.includes('<svg')) {
            SynapseSvgCache.set(src, text);

            // Persist into CacheStorage in background
            if (typeof window !== 'undefined' && 'caches' in window) {
              caches.open(SYNAPSE_ILLU_CACHE_NAME).then(c => {
                c.put(src, new Response(text, {
                  headers: { 'Content-Type': 'image/svg+xml' }
                })).catch(() => {});
              }).catch(() => {});
            }
            return text;
          }
        }
      } else {
        // Non-SVG: Warm up browser image decoder
        const img = new Image();
        img.src = src;
      }
      return null;
    } catch (e) {
      return null;
    } finally {
      SynapseInflightFetches.delete(src);
    }
  })();

  SynapseInflightFetches.set(src, p);
  return p;
}

/**
 * Preload illustration for a single word with optional priority.
 */
function preloadSingleWordIllustration(word, priority = 'auto') {
  if (!word) return Promise.resolve(null);
  const illu = getWordIllustration(word);
  if (illu && illu.src) {
    return preloadIllustration(illu.src, priority);
  }
  return Promise.resolve(null);
}

/**
 * Batch preload illustrations for an array of words.
 */
function preloadWordsIllustrations(words, maxCount = 50) {
  if (!Array.isArray(words) || words.length === 0) return;
  const count = Math.min(words.length, maxCount);
  for (let i = 0; i < count; i++) {
    const w = words[i];
    if (w) preloadSingleWordIllustration(w, i < 5 ? 'high' : 'auto');
  }
}

/**
 * Predictive Sliding-Window Preloader for study mode:
 * Preloads the next 15 cards ahead and the previous 5 cards in background.
 */
function preloadNearbyIllustrations(wordList, activeFilteredOrder, currentIdx, lookahead = 15) {
  if (!Array.isArray(wordList) || !Array.isArray(activeFilteredOrder) || activeFilteredOrder.length === 0) return;
  const len = activeFilteredOrder.length;

  // Next cards: Top 5 with high priority, rest with auto priority
  for (let offset = 1; offset <= lookahead; offset++) {
    const nextIdx = (currentIdx + offset) % len;
    const w = wordList[activeFilteredOrder[nextIdx]];
    if (w) {
      preloadSingleWordIllustration(w, offset <= 5 ? 'high' : 'auto');
    }
  }

  // Previous 5 cards with high priority
  for (let offset = 1; offset <= 5; offset++) {
    const prevIdx = (currentIdx - offset + len) % len;
    const w = wordList[activeFilteredOrder[prevIdx]];
    if (w) {
      preloadSingleWordIllustration(w, 'high');
    }
  }
}

let activeDeckPreloadTimer = null;

/**
 * Progressive Deck Acceleration Engine:
 * 1. Immediate VIP Wave: Starting card + next 12 cards + previous 4 cards (High Priority).
 * 2. Sliding Horizon Wave: Next 25 cards (Auto Priority).
 * 3. Deck-Wide Stream: Concurrent non-blocking micro-batches via requestIdleCallback/setTimeout
 *    progressively caching 100% of the active level's illustrations into RAM.
 */
function preloadDeckIllustrations(wordList, startIdx = 0, filteredOrder = null) {
  if (!Array.isArray(wordList) || wordList.length === 0) return;
  if (activeDeckPreloadTimer) {
    clearTimeout(activeDeckPreloadTimer);
    activeDeckPreloadTimer = null;
  }

  const order = Array.isArray(filteredOrder) && filteredOrder.length > 0
    ? filteredOrder
    : Array.from({ length: wordList.length }, (_, i) => i);
  const len = order.length;
  const safeStart = ((startIdx % len) + len) % len;

  // 1. VIP Wave (Highest priority)
  const currentWord = wordList[order[safeStart]];
  if (currentWord) preloadSingleWordIllustration(currentWord, 'high');

  for (let offset = 1; offset <= 12; offset++) {
    const idx = (safeStart + offset) % len;
    const w = wordList[order[idx]];
    if (w) preloadSingleWordIllustration(w, 'high');
  }

  for (let offset = 1; offset <= 4; offset++) {
    const idx = (safeStart - offset + len) % len;
    const w = wordList[order[idx]];
    if (w) preloadSingleWordIllustration(w, 'high');
  }

  // 2. Horizon Wave (Next 25 cards)
  for (let offset = 13; offset <= 35; offset++) {
    const idx = (safeStart + offset) % len;
    const w = wordList[order[idx]];
    if (w) preloadSingleWordIllustration(w, 'auto');
  }

  // 3. Progressive Background Deck Stream (all remaining cards)
  const pendingIndices = [];
  for (let i = 0; i < len; i++) {
    const circularOffset = (safeStart + i) % len;
    if (circularOffset > 35 && circularOffset < (len - 4)) {
      pendingIndices.push(order[circularOffset]);
    }
  }

  const BATCH_SIZE = 6;
  function processQueue() {
    if (pendingIndices.length === 0) return;
    const chunk = pendingIndices.splice(0, BATCH_SIZE);
    chunk.forEach(wIdx => {
      const w = wordList[wIdx];
      if (w) preloadSingleWordIllustration(w, 'auto');
    });

    if (pendingIndices.length > 0) {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(processQueue, { timeout: 1500 });
      } else {
        activeDeckPreloadTimer = setTimeout(processQueue, 35);
      }
    }
  }

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(processQueue, { timeout: 1200 });
  } else {
    activeDeckPreloadTimer = setTimeout(processQueue, 50);
  }
}

// Global exposure
if (typeof window !== 'undefined') {
  window.POS_TYPES = POS_TYPES;
  window.JLPT_POS_DB = JLPT_POS_DB;
  window.getWordPartOfSpeech = getWordPartOfSpeech;
  window.WORD_ILLUSTRATIONS_DB = WORD_ILLUSTRATIONS_DB;
  window.STATIC_ILLUSTRATIONS_INDEX = STATIC_ILLUSTRATIONS_INDEX;
  window.getWordIllustration = getWordIllustration;
  window.buildContextualPrompt = buildContextualPrompt;
  window.SynapseSvgCache = SynapseSvgCache;
  window.preloadIllustration = preloadIllustration;
  window.preloadSingleWordIllustration = preloadSingleWordIllustration;
  window.preloadWordsIllustrations = preloadWordsIllustrations;
  window.preloadNearbyIllustrations = preloadNearbyIllustrations;
  window.preloadDeckIllustrations = preloadDeckIllustrations;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    POS_TYPES,
    JLPT_POS_DB,
    getWordPartOfSpeech,
    WORD_ILLUSTRATIONS_DB,
    STATIC_ILLUSTRATIONS_INDEX,
    getWordIllustration,
    buildContextualPrompt,
    generateAestheticFallback,
    SynapseSvgCache,
    preloadIllustration,
    preloadSingleWordIllustration,
    preloadWordsIllustrations,
    preloadNearbyIllustrations,
    preloadDeckIllustrations
  };
}
