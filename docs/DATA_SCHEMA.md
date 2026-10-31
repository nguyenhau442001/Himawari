# Synapse Nihongo (JLPT N5–N1 & Kanji Workstation) - Data Schema

This document formalizes the data models, vocabulary structures, and kanji schemas for Synapse Nihongo.

## 1. Japanese Vocabulary Item Schema (`JapaneseVocabularyItem`)

Every vocabulary item across JLPT N5 through N1 adheres to the following specification:

```typescript
interface JapaneseVocabularyItem {
  id: string | number;           // Unique identifier (e.g., "n5_001" or numeric id)
  kanji: string;                 // Japanese Kanji or Kana headword (e.g., "先生", "食べる", "机")
  furigana: string;              // Hiragana/Katakana phonetic reading (e.g., "せんせい", "たべる", "つくえ")
  romaji?: string;               // Romanized reading (e.g., "sensei")
  hanviet: string;               // Sino-Vietnamese reading (Âm Hán - Việt, e.g., "TIÊN SINH")
  onyomi?: string[];             // On readings (e.g., ["セン"])
  kunyomi?: string[];            // Kun readings (e.g., ["さき", "う.まれる"])
  meaning_vi: string;            // Primary Vietnamese meaning
  pos: {                         // Part of speech classification
    code: "noun" | "verb1" | "verb2" | "verb3" | "adj_i" | "adj_na" | "adv" | "particle" | "phrase";
    label: string;               // Short Vietnamese label (e.g., "Danh từ", "Động từ nhóm 1")
    en?: string;                 // English label
    full?: string;               // Full descriptive label
  } | string;
  level: "N5" | "N4" | "N3" | "N2" | "N1";
  pitch_accent?: string;         // Pitch accent pattern (e.g., "0" - Heiban, "1" - Atamadaka, "2" - Nakadaka, "3" - Odaka)
  example_ja: string;            // Example sentence in Japanese
  example_py?: string;           // Example reading in Hiragana/Kana
  example_vi: string;            // Example translation in Vietnamese
  radicals?: {                   // Structural Kanji decomposition into radicals
    char: string;
    radical: string;
    radical_meaning_vi: string;
    strokes: number;
  }[];
  related_words?: string[];      // Compound words (Jukugo, e.g., ["生徒", "先月", "誕生"])
  audio_url?: string;            // Prebuilt native speaker pronunciation URL
  illustration_key?: string;     // Key to contextual SVG vector illustration
}
```

## 2. Backward Compatibility & Field Aliases

For seamless interoperability with existing database tables:
- `hanzi` is treated as an alias for `kanji`.
- `pinyin` is treated as an alias for `furigana`.
- `meaning` is treated as an alias for `meaning_vi`.
- `example_zh` is treated as an alias for `example_ja`.

## 3. Database Organization

Static vocabulary databases are organized by JLPT level in `database/vocabs/`:
- `jlpt_n5.json`: JLPT N5 Beginner vocabulary (~662 words).
- `jlpt_n4.json`: JLPT N4 Elementary vocabulary (~632 words).
- `jlpt_n3.json`: JLPT N3 Intermediate vocabulary (~688 words).
- `jlpt_n2.json`: JLPT N2 Upper-Intermediate vocabulary (~1,831 words).
- `jlpt_n1.json`: JLPT N1 Advanced vocabulary (~3,463 words).
- `sentence_bank.json`: Interactive sentence construction and grammar exercises.
- `guess_word_bank.json`: Vocabulary recall mini-game dataset.
