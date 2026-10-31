#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/generate_vocab_examples.py
Batch AI Example Sentence Generator for JLPT Vocabulary using Gemini API.
Generates level-appropriate, high-quality Japanese example sentences with:
- example_zh: Japanese sentence with the target word enclosed in <u>...</u>
- example_py: Hiragana/furigana transcription with target word reading enclosed in <u>...</u>
- example_vi: Natural Vietnamese translation with target word meaning enclosed in <u>...</u>
"""

import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
JLPT_DIR = REPO_ROOT / "database" / "jlpt"
VOCAB_DIR = REPO_ROOT / "database" / "vocabs"
CACHE_DIR = REPO_ROOT / "tools"

MODELS_TO_TRY = [
    "gemini-2.5-flash",
    "gemini-1.5-flash",
    "gemini-2.0-flash",
]

LEVEL_DESCRIPTIONS = {
    "n5": "JLPT N5 (Sơ cấp 1: câu rất ngắn gọn, cấu trúc ngữ pháp cơ bản sơ cấp như です/ます, trợ từ は, を, に, で, へ, từ vựng đời sống thân thuộc).",
    "n4": "JLPT N4 (Sơ cấp 2: câu ngắn gọn, cấu trúc thể te, thể quá khứ, ý định, điều kiện と, たら, ても, ngữ cảnh giao tiếp hàng ngày).",
    "n3": "JLPT N3 (Trung cấp: câu tự nhiên, cấu trúc ngữ pháp N3 chuẩn mực, liên từ, câu phức vừa phải trong công việc và sinh hoạt).",
    "n2": "JLPT N2 (Trung cao cấp: câu văn phong phú, ngữ pháp N2, diễn đạt sắc thái tinh tế trong đời sống xã hội và công sở).",
    "n1": "JLPT N1 (Cao cấp: câu văn chuẩn mực, ngữ pháp và thành ngữ N1, nghị luận, báo chí, chuyên môn).",
}


def load_api_key(cli_key=None):
    if cli_key and cli_key.strip():
        return cli_key.strip()
    env_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if env_key:
        return env_key
    key_file = REPO_ROOT / ".api_key"
    if key_file.exists():
        key = key_file.read_text(encoding="utf-8").strip()
        if key:
            return key
    return None


def call_gemini_api(prompt, api_key, max_retries=3):
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 8192,
            "response_mime_type": "application/json"
        }
    }
    data_bytes = json.dumps(payload).encode("utf-8")

    for attempt in range(max_retries):
        for model in MODELS_TO_TRY:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            req = urllib.request.Request(
                url,
                data=data_bytes,
                headers={"Content-Type": "application/json"}
            )
            try:
                with urllib.request.urlopen(req, timeout=30) as resp:
                    resp_json = json.loads(resp.read().decode("utf-8"))
                    text = resp_json["candidates"][0]["content"]["parts"][0]["text"]
                    return json.loads(text)
            except urllib.error.HTTPError as e:
                if e.code == 429:
                    wait_sec = 4 * (attempt + 1)
                    time.sleep(wait_sec)
                    continue
                elif e.code == 404:
                    continue
                else:
                    time.sleep(1)
            except Exception:
                time.sleep(1)
    return None


def ensure_underline_tags(item, target_word, reading, meaning):
    """Ensure the target word/reading/meaning has <u>...</u> tags."""
    zh = item.get("example_zh", "").strip()
    py = item.get("example_py", "").strip()
    vi = item.get("example_vi", "").strip()

    if target_word and "<u>" not in zh and target_word in zh:
        zh = zh.replace(target_word, f"<u>{target_word}</u>", 1)

    if reading and "<u>" not in py and reading in py:
        py = py.replace(reading, f"<u>{reading}</u>", 1)

    return zh, py, vi


def build_prompt(items_batch, level_code):
    lvl_desc = LEVEL_DESCRIPTIONS.get(level_code, f"JLPT {level_code.upper()}")
    formatted_words = []
    for item in items_batch:
        formatted_words.append({
            "id": item.get("id"),
            "hanzi": item.get("hanzi", ""),
            "pinyin": item.get("pinyin", ""),
            "meaning": item.get("meaning", "")
        })

    prompt = f"""Bạn là chuyên gia biên soạn giáo trình tiếng Nhật JLPT giàu kinh nghiệm sư phạm.
Nhiệm vụ: Tạo câu ví dụ minh họa kèm phiên âm đọc và bản dịch tiếng Việt cho các từ vựng sau.

Trình độ yêu cầu: {lvl_desc}

Quy chuẩn nghiêm ngặt cho mỗi mục:
1. 'example_zh': Câu tiếng Nhật hoàn chỉnh, tự nhiên, ngắn gọn và phù hợp trình độ. Bắt buộc bọc chính xác từ vựng mục tiêu trong thẻ <u>...</u> (ví dụ: 私は<u>毎朝</u>牛乳を飲みます。).
2. 'example_py': Toàn bộ câu viết bằng Hiragana (giữ lại Katakana nếu là từ mượn gốc ngoại lai), bọc cách đọc của từ vựng mục tiêu trong thẻ <u>...</u> (ví dụ: わたしは<u>まいあさ</u>ぎゅうにゅうをのみます。).
3. 'example_vi': Bản dịch tiếng Việt tự nhiên, chuẩn xác theo ngữ cảnh câu, bọc phần nghĩa tương ứng của từ vựng mục tiêu trong thẻ <u>...</u> (ví dụ: Tôi uống sữa vào <u>mỗi buổi sáng</u>.).

Trả về kết quả dưới định dạng JSON array với các object chứa đúng các trường: id, example_zh, example_py, example_vi.

Danh sách từ:
{json.dumps(formatted_words, ensure_ascii=False, indent=2)}"""
    return prompt


def enrich_level(level_code, api_key, batch_size=20, limit=None, force=False, delay=1.0):
    lvl_code = level_code.lower()
    jlpt_file = JLPT_DIR / f"{lvl_code}.json"
    vocab_file = VOCAB_DIR / f"jlpt_{lvl_code}.json"
    cache_file = CACHE_DIR / f".examples_cache_{lvl_code}.json"

    if not jlpt_file.exists():
        print(f"[!] Error: File {jlpt_file} not found.")
        return

    with open(jlpt_file, "r", encoding="utf-8") as f:
        words = json.load(f)

    # Load cache
    cache = {}
    if cache_file.exists():
        try:
            with open(cache_file, "r", encoding="utf-8") as f:
                cache = json.load(f)
        except Exception:
            cache = {}

    to_process = []
    for w in words:
        wid = str(w.get("id"))
        has_ex = bool(w.get("example_zh") and w.get("example_vi"))
        if force or not has_ex:
            if not force and wid in cache:
                cached = cache[wid]
                w["example_zh"] = cached.get("example_zh", w.get("example_zh", ""))
                w["example_py"] = cached.get("example_py", w.get("example_py", ""))
                w["example_vi"] = cached.get("example_vi", w.get("example_vi", ""))
            else:
                to_process.append(w)

    total_needed = len(to_process)
    if limit and limit > 0:
        to_process = to_process[:limit]

    print(f"\n--- Enriching JLPT {lvl_code.upper()} ---")
    print(f"Total words in deck: {len(words)}")
    print(f"Already cached / with examples: {len(words) - total_needed}")
    print(f"Words to generate now: {len(to_process)}")

    if not to_process:
        print(f"✓ All words in JLPT {lvl_code.upper()} already have examples.")
        # Save updated files anyway to ensure sync
        save_updated(jlpt_file, vocab_file, words, lvl_code)
        return

    # Process in batches
    num_batches = (len(to_process) + batch_size - 1) // batch_size
    generated_count = 0

    for b_idx in range(num_batches):
        batch = to_process[b_idx * batch_size : (b_idx + 1) * batch_size]
        print(f"\n[Batch {b_idx + 1}/{num_batches}] Generating examples for {len(batch)} words (IDs: {batch[0].get('id')}..{batch[-1].get('id')})...")

        prompt = build_prompt(batch, lvl_code)
        results = call_gemini_api(prompt, api_key)

        if not results or not isinstance(results, list):
            print(f"[!] Warning: Batch {b_idx + 1} failed or returned invalid format. Retrying individually...")
            results = []
            for item in batch:
                single_prompt = build_prompt([item], lvl_code)
                single_res = call_gemini_api(single_prompt, api_key)
                if single_res and isinstance(single_res, list) and len(single_res) > 0:
                    results.append(single_res[0])
                time.sleep(0.5)

        res_by_id = {str(r.get("id")): r for r in results if isinstance(r, dict)}

        for item in batch:
            wid = str(item.get("id"))
            if wid in res_by_id:
                res = res_by_id[wid]
                zh, py, vi = ensure_underline_tags(
                    res,
                    item.get("hanzi", ""),
                    item.get("pinyin", ""),
                    item.get("meaning", "")
                )
                item["example_zh"] = zh
                item["example_py"] = py
                item["example_vi"] = vi
                cache[wid] = {
                    "example_zh": zh,
                    "example_py": py,
                    "example_vi": vi
                }
                generated_count += 1
            else:
                print(f"    [!] Missing output for word {wid} ({item.get('hanzi')})")

        # Save cache and files after each batch
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, indent=2)

        save_updated(jlpt_file, vocab_file, words, lvl_code)
        print(f"  ✓ Saved batch {b_idx + 1}/{num_batches}. Total generated so far: {generated_count}/{len(to_process)}")

        if delay > 0 and b_idx < num_batches - 1:
            time.sleep(delay)

    print(f"\n🎉 Successfully enriched JLPT {lvl_code.upper()}! ({generated_count} examples updated)")


def save_updated(jlpt_file, vocab_file, words, lvl_code):
    with open(jlpt_file, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)
    with open(vocab_file, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)
    if lvl_code == "n3":
        n3_all_file = VOCAB_DIR / "n3_all.json"
        if n3_all_file.exists():
            with open(n3_all_file, "w", encoding="utf-8") as f:
                json.dump(words, f, ensure_ascii=False, indent=2)


def main():
    parser = argparse.ArgumentParser(description="Generate example sentences for JLPT vocabulary.")
    parser.add_argument("--level", type=str, default="n5", help="JLPT level: n5, n4, n3, n2, n1, or all (default: n5)")
    parser.add_argument("--api-key", type=str, default=None, help="Gemini API Key (default: read from .api_key or GEMINI_API_KEY)")
    parser.add_argument("--batch-size", type=int, default=20, help="Number of words per batch (default: 20)")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of words to generate")
    parser.add_argument("--force", action="store_true", help="Force overwrite existing examples")
    parser.add_argument("--delay", type=float, default=1.0, help="Delay between batches in seconds (default: 1.0)")

    args = parser.parse_args()

    api_key = load_api_key(args.api_key)
    if not api_key:
        print("[!] Error: No API key found. Provide --api-key, set GEMINI_API_KEY, or create .api_key.", file=sys.stderr)
        sys.exit(1)

    levels = ["n5", "n4", "n3", "n2", "n1"] if args.level.lower() == "all" else [args.level.lower()]
    for lvl in levels:
        enrich_level(
            lvl,
            api_key,
            batch_size=args.batch_size,
            limit=args.limit,
            force=args.force,
            delay=args.delay
        )


if __name__ == "__main__":
    main()
