#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Build script to fetch JLPT N5, N4, N2, N1 datasets, translate definitions to Vietnamese,
calculate Sino-Vietnamese (Hán Việt), and save them into database/vocabs/jlpt_nX.json
"""
import os
import re
import json
import time
import urllib.request
import urllib.parse

OUTPUT_DIR = "database/vocabs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load Sino-Vietnamese dictionary from assets/js/hanviet-dict.js
with open("assets/js/hanviet-dict.js", "r", encoding="utf-8") as f:
    dict_content = f.read()

m_comp = re.search(r'const HANVIET_COMPOUNDS\s*=\s*(\{.*?\});', dict_content)
m_chars = re.search(r'const HANVIET_CHARS\s*=\s*(\{.*?\});', dict_content)
comp_dict = json.loads(m_comp.group(1)) if m_comp else {}
chars_dict = json.loads(m_chars.group(1)) if m_chars else {}

def get_hanviet(word):
    if not word:
        return ""
    if word in comp_dict:
        return comp_dict[word].upper()
    parts = []
    has_kanji = False
    for c in word:
        if c in chars_dict:
            parts.append(chars_dict[c])
            has_kanji = True
        elif '\u4e00' <= c <= '\u9fff':
            parts.append(c)
            has_kanji = True
        else:
            parts.append(c)
    return ' '.join(parts).upper().strip() if has_kanji else ''

def detect_pos(word, meaning):
    m = meaning.lower()
    w = word
    if m.startswith('to ') or m.startswith('làm ') or w.endswith('する'):
        return { "code": "verb", "label": "Động từ", "en": "Verb", "full": "Động từ" }
    if w.endswith('い') or w.endswith('な') or '(adj' in m or 'tính từ' in m:
        return { "code": "adj", "label": "Tính từ", "en": "Adjective", "full": "Tính từ" }
    if bool(re.search(r'^[\u30A0-\u30FF\s・]+$', w)):
        return { "code": "noun", "label": "Katakana", "en": "Loanword", "full": "Từ ngoại lai" }
    if 'phó từ' in m or 'adverb' in m:
        return { "code": "adv", "label": "Phó từ", "en": "Adverb", "full": "Phó từ" }
    return { "code": "noun", "label": "Danh từ", "en": "Noun", "full": "Danh từ" }

def translate_batch(texts, batch_size=35):
    results = []
    cache_file = "tools/.translation_cache.json"
    cache = {}
    if os.path.exists(cache_file):
        try:
            with open(cache_file, "r", encoding="utf-8") as f:
                cache = json.load(f)
        except Exception:
            cache = {}

    to_fetch_indices = []
    for i, t in enumerate(texts):
        cleaned_t = t.strip()
        if cleaned_t in cache:
            results.append(cache[cleaned_t])
        else:
            results.append(None)
            to_fetch_indices.append(i)

    if not to_fetch_indices:
        return results

    print(f"  Translating {len(to_fetch_indices)} uncached meanings (cached: {len(texts) - len(to_fetch_indices)})...")

    for i in range(0, len(to_fetch_indices), batch_size):
        chunk_indices = to_fetch_indices[i:i+batch_size]
        chunk_texts = [texts[idx].strip() for idx in chunk_indices]
        joined = '\n'.join(chunk_texts)
        url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=' + urllib.parse.quote(joined)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        
        success = False
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                trans_text = ''.join(c[0] for c in data[0] if c[0])
                sub_res = [s.strip() for s in trans_text.split('\n')]
                if len(sub_res) == len(chunk_texts):
                    for idx, val, orig_t in zip(chunk_indices, sub_res, chunk_texts):
                        results[idx] = val
                        cache[orig_t] = val
                    success = True
        except Exception as e:
            pass

        if not success:
            for idx, orig_t in zip(chunk_indices, chunk_texts):
                url_single = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=' + urllib.parse.quote(orig_t)
                try:
                    with urllib.request.urlopen(urllib.request.Request(url_single, headers={'User-Agent': 'Mozilla/5.0'}), timeout=5) as r:
                        d = json.loads(r.read().decode('utf-8'))
                        v = ''.join(c[0] for c in d[0] if c[0]).strip()
                        results[idx] = v
                        cache[orig_t] = v
                except Exception:
                    results[idx] = orig_t
                    cache[orig_t] = orig_t

        time.sleep(0.05)

    # Save cache
    with open(cache_file, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False)

    return results

def process_level(lvl_code, target_filename):
    print(f"\nProcessing JLPT {lvl_code.upper()}...")
    url = f"https://raw.githubusercontent.com/wkei/jlpt-vocab-api/main/data-source/db/{lvl_code}.json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        raw_data = json.loads(resp.read().decode('utf-8'))

    print(f"  Fetched {len(raw_data)} words from API.")
    raw_meanings = [x.get('meaning', '') for x in raw_data]
    vi_meanings = translate_batch(raw_meanings)

    formatted_items = []
    for i, (item, vi_m) in enumerate(zip(raw_data, vi_meanings)):
        word = item.get('word', '').strip()
        reading = item.get('furigana', '').strip() or word
        hv = get_hanviet(word)
        pos = detect_pos(word, vi_m)
        formatted_items.append({
            "id": i + 1,
            "hanzi": word,
            "pinyin": reading,
            "hanviet": hv,
            "meaning": vi_m or item.get('meaning', ''),
            "example_zh": "",
            "example_py": "",
            "example_vi": "",
            "pos": pos
        })

    outpath = os.path.join(OUTPUT_DIR, target_filename)
    with open(outpath, "w", encoding="utf-8") as f:
        json.dump(formatted_items, f, ensure_ascii=False, indent=2)
    print(f"  ✓ Saved {len(formatted_items)} words to {outpath}")
    return formatted_items

def main():
    # Process N5, N4, N2, N1
    process_level("n5", "jlpt_n5.json")
    process_level("n4", "jlpt_n4.json")
    process_level("n2", "jlpt_n2.json")
    process_level("n1", "jlpt_n1.json")

    # For N3: copy n3_all.json as jlpt_n3.json for consistent naming
    n3_source = os.path.join(OUTPUT_DIR, "n3_all.json")
    if os.path.exists(n3_source):
        with open(n3_source, "r", encoding="utf-8") as f:
            n3_data = json.load(f)
        n3_out = os.path.join(OUTPUT_DIR, "jlpt_n3.json")
        with open(n3_out, "w", encoding="utf-8") as f:
            json.dump(n3_data, f, ensure_ascii=False, indent=2)
        print(f"\n✓ JLPT N3 copied: {len(n3_data)} words to {n3_out}")

    print("\nAll JLPT levels (N5, N4, N3, N2, N1) built successfully!")

if __name__ == "__main__":
    main()
