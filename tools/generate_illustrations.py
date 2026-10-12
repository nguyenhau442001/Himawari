#!/usr/bin/env python3
"""
tools/generate_illustrations.py
Batch AI Illustration Generator for HSK Vocabulary using Google AI Studio.
Generates theme-appropriate, text-free visual mnemonics and saves them directly into assets/images/illustrations/.
"""

import argparse
import base64
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
VOCAB_DIR = REPO_ROOT / "database" / "vocabs"
OUTPUT_DIR = REPO_ROOT / "assets" / "images" / "illustrations"
WORD_ILLUSTRATIONS_JS = REPO_ROOT / "assets" / "js" / "word-illustrations.js"

# Optional worktree directory to keep in sync
WORKTREE_DIR = REPO_ROOT

POS_NAMES = {
    'noun': 'noun / physical object or conceptual entity',
    'verb': 'verb / dynamic action, movement or execution',
    'adj': 'adjective / qualitative attribute, emotional or sensory state',
    'adv': 'adverb / degree, manner, or frequency meter',
    'measure': 'measure word / modular counting unit',
    'pron': 'pronoun / connection or reference',
    'prep': 'preposition / spatial or directional relation',
    'conj': 'conjunction / bridge connecting elements'
}

def load_vocabulary():
    """Loads all HSK vocabularies indexed by hanzi."""
    words_by_hanzi = {}
    if not VOCAB_DIR.exists():
        return words_by_hanzi

    for f in sorted(VOCAB_DIR.glob("hsk*_vocabularies.json")):
        try:
            with open(f, "r", encoding="utf-8") as fp:
                data = json.load(fp)
                if isinstance(data, list):
                    for item in data:
                        h = item.get("hanzi", "").strip()
                        if h and h not in words_by_hanzi:
                            words_by_hanzi[h] = item
        except Exception as e:
            print(f"[!] Warning reading {f.name}: {e}", flush=True)

    return words_by_hanzi

def guess_pos(meaning):
    """Heuristic POS classifier matching word-illustrations.js rules."""
    m = (meaning or "").lower()
    if re.search(r'^(đẹp|tốt|xấu|to|nhỏ|lớn|cao|thấp|nhanh|chậm|dài|ngắn|nóng|lạnh|mới|cũ|đắt|rẻ|khó|dễ|buồn|vui|sạch|bẩn|ngon|ngọt|đắng|cay|mặn|chua|mệt|đói|no|bận|rảnh|đúng|sai|tiện|phức tạp|đơn giản|quan trọng|an toàn|nguy hiểm|nghiêm túc|cẩn thận|nhiệt tình|tự tin|hạnh phúc|khỏe|yếu|trắng|đen|đỏ|vàng|xanh)\b', m) or 'tính từ' in m:
        return 'adj'
    if re.search(r'^(làm|đi|nói|ăn|uống|xem|mua|bán|học|chạy|bay|đến|rời|giúp|tổ chức|chuẩn bị|phát hiện|tham gia|quyết định|giải quyết|sử dụng|cung cấp|tìm|gặp|nhớ|hiểu|yêu|ghét|thích|lo|nghĩ|biết|mặc|đeo|viết|đọc|nghe|sắp xếp|bố trí|ôm|xin lỗi|đăng ký|tốt nghiệp|biểu thị|thể hiện|biểu diễn|khen ngợi|bảo vệ|đảm bảo|thực hiện|hoàn thành|phát triển|mở rộng|thay đổi|tổng kết|du lịch|trao đổi|kết hôn|kinh doanh|nghiên cứu|chiến đấu|chúc mừng|cảm ơn|kính trọng|mời|chờ|đợi|hy vọng|ước|tin|nghi ngờ|chú ý|quan tâm|giảng|dạy|vẽ|hát|múa|bơi|chơi|sửa|chữa|chọn|chọn lựa)\b', m) or 'động từ' in m:
        return 'verb'
    return 'noun'

MODELS_TO_TRY = [
    "gemini-3-flash-preview",
    "gemini-flash-lite-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-2.5-flash"
]

def call_gemini_svg_api(word_info, api_key, max_retries=3):
    """Calls Gemini API with model fallback to generate clean inline SVG vector."""
    hanzi = word_info.get("hanzi", "")
    meaning = word_info.get("meaning", "")
    pos = word_info.get("pos", "noun")
    pinyin = word_info.get("pinyin", "")

    ex_vi = word_info.get("example_vi", "").replace("<u>", "").replace("</u>", "").strip()
    ex_zh = word_info.get("example_zh", "").replace("<u>", "").replace("</u>", "").strip()
    context_note = ""
    if ex_vi:
        context_note = f"\nContextual Example: '{ex_vi}'"
    elif ex_zh:
        context_note = f"\nContextual Example: '{ex_zh}'"

    if pos == "verb":
        action_guidance = (
            f"Depict a RICH, DETAILED SCENE-BASED REAL-WORLD HUMAN ACTION representing the exact action of '{meaning}'. "
            "Show a stylized, expressive character actively performing the action with authentic body language and posture. "
            "Crucially, include ENVIRONMENT DETAILS and PROPS (e.g., room setting, stage, desk, tools, background lighting, foreground elements) "
            "that immediately establish the real-world context of this action. DO NOT draw abstract symbols, geometric badges, or floating icons."
        )
    elif pos == "noun":
        action_guidance = (
            f"Depict a VIVID, SCENE-BASED REAL-WORLD ENVIRONMENT or PHYSICAL OBJECT representing '{meaning}'. "
            "Place the subject in an authentic, tangible context with surrounding props, realistic surfaces, atmospheric depth, and spatial details. "
            "DO NOT draw generic isolated icons, abstract shapes, or simplistic geometric glyphs."
        )
    elif pos == "adj":
        action_guidance = (
            f"Depict a RICH REAL-WORLD SCENARIO with an EXPRESSIVE CHARACTER vividly embodying the state or emotion of '{meaning}'. "
            "Show dynamic facial expression, communicative body posture, and immersive atmospheric environment (e.g. dramatic lighting, weather, or room ambiance) "
            "that makes the feeling immediately intuitive. DO NOT draw abstract shapes or emojis."
        )
    else:
        action_guidance = (
            f"Depict an engaging, scene-based real-world scenario illustrating the communicative context of '{meaning}'. "
            "Include relatable characters, props, and environment."
        )

    prompt = (
        "You are an expert 2D vector illustrator and art director creating scene-based, action-packed illustrations for an HSK language learning app.\n"
        f"Target Vocabulary: {hanzi} ({pinyin}) - Meaning: '{meaning}' - Part of Speech: {pos}.{context_note}\n\n"
        "CRITICAL ART DIRECTION RULES:\n"
        f"1. SCENE & SUBJECT: {action_guidance}\n"
        "2. STYLE: Clean, friendly 2D flat cartoon or minimalist vector art with expressive contours and rich narrative depth.\n"
        "3. COMPOSITION & CANVAS:\n"
        "   - Valid SVG with viewBox=\"0 0 240 240\" xmlns=\"http://www.w3.org/2000/svg\".\n"
        "   - Full-bleed container: <rect width=\"240\" height=\"240\" rx=\"24\" fill=\"#1e293b\"/> (or gradient from #0f172a to #1e293b).\n"
        "   - The illustration must fill the canvas space, featuring the main subject prominently with context props.\n"
        "4. COLOR PALETTE:\n"
        "   - Dark-mode harmonious: Deep slate navy (#0f172a, #1e293b) background, muted blues, warm golden/amber glows (#f59e0b, #fbbf24), and energetic modern accents (#38bdf8, #10b981, #ec4899, #fb923c).\n"
        "5. STRICT NEGATIVE CONSTRAINTS:\n"
        f"   - ABSOLUTELY NO abstract symbols, logos, minimalist icons, or generic badges.\n"
        "   - ABSOLUTELY NO floating hearts (❤️), glowing heart icons, or romantic tropes UNLESS the word is explicitly about romantic love (e.g. 爱, 恋爱, 结婚, 谈恋爱) or literal anatomy (心脏). For gratitude (感谢, 谢谢), helping, politeness, kindness, teamwork, or friendship, DO NOT draw hearts! Depict genuine respectful social interactions (e.g. slight bow, handshake, warm smile, polite hand gesture) instead of romantic tropes.\n"
        "   - For free-of-charge / zero-cost concepts (e.g. 免费, 免税, 赠送, 义诊), DO NOT draw generic wrapped birthday gift boxes or souvenir shops! A wrapped gift box conveys 'gift/present' (礼物), NOT 'free of charge'. Instead, depict authentic real-world transactions where fee/payment is waived (e.g. an event entrance/registration counter where attendees are welcomed with a 0-cost admission pass, staff warmly waving off payment with a friendly gesture, or an open gate with crossed-out coin/fee indicator).\n"
        f"   - ABSOLUTELY NO text, NO letters, NO words, NO subtitles, NO Chinese characters (NO {hanzi}), NO English words, NO pinyin.\n"
        "   - ABSOLUTELY NO Gemini logo, NO brand logos, NO watermarks.\n"
        "6. Return ONLY the raw <svg>...</svg> code, without markdown backticks, without any explanation."
    )
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.4}
    }

    for attempt in range(max_retries):
        for model in MODELS_TO_TRY:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            try:
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"}
                )
                with urllib.request.urlopen(req, timeout=35) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and "text" in parts[0]:
                            text = parts[0]["text"]
                            m = re.search(r"<svg[\s\S]*?<\/svg>", text, re.IGNORECASE)
                            if m:
                                svg_str = m.group(0).strip()
                                if len(svg_str) > 60:
                                    return svg_str
            except urllib.error.HTTPError as he:
                if he.code == 429:
                    # Try next model in list
                    continue
                elif he.code in (404, 503):
                    # Model unavailable, try next model
                    continue
                else:
                    err_text = he.read().decode("utf-8", errors="ignore")
                    print(f"    [!] {model} HTTP {he.code}: {err_text[:120]}", flush=True)
            except Exception as e:
                # Timeout or connection error, try next model
                continue
        # If all models hit limit/error in this attempt, wait and retry
        if attempt < max_retries - 1:
            wait_sec = 15 * (attempt + 1)
            print(f"    [!] All models busy/exhausted. Waiting {wait_sec}s before retry {attempt+2}/{max_retries}...", flush=True)
            time.sleep(wait_sec)

    return None

def update_illustrations_manifest(records):
    """Updates STATIC_ILLUSTRATIONS_INDEX in word-illustrations.js."""
    if not WORD_ILLUSTRATIONS_JS.exists():
        return

    content = WORD_ILLUSTRATIONS_JS.read_text(encoding="utf-8")

    match = re.search(r"const STATIC_ILLUSTRATIONS_INDEX = (\{[\s\S]*?\});", content)
    if match:
        try:
            existing = json.loads(match.group(1))
        except Exception:
            existing = {}
        existing.update(records)
        new_block = f"const STATIC_ILLUSTRATIONS_INDEX = {json.dumps(existing, ensure_ascii=False, indent=2)};"
        content = content[:match.start()] + new_block + content[match.end():]
    else:
        new_block = f"\n// Pre-generated static illustration assets stored in assets/images/illustrations/\nconst STATIC_ILLUSTRATIONS_INDEX = {json.dumps(records, ensure_ascii=False, indent=2)};\n\n"
        target = "function getWordIllustration"
        if target in content:
            content = content.replace(target, new_block + target, 1)

    WORD_ILLUSTRATIONS_JS.write_text(content, encoding="utf-8")

    # Sync to worktree if available
    if WORKTREE_DIR.exists():
        try:
            dest = WORKTREE_DIR / "assets" / "js" / "word-illustrations.js"
            dest.write_text(content, encoding="utf-8")
        except Exception:
            pass

def main():
    parser = argparse.ArgumentParser(description="Generate thematic visual mnemonic illustrations using Google AI Studio")
    parser.add_argument("--api-key", default=os.environ.get("GOOGLE_AI_KEY"), help="Google AI Studio API Key (or env GOOGLE_AI_KEY)")
    parser.add_argument("--words", help="Specific Hanzi words (comma or space separated), e.g. '总结,合适,困难'")
    parser.add_argument("--hsk", type=int, choices=[1, 2, 3, 4, 5, 6], help="Target HSK level (1-6)")
    parser.add_argument("--limit", type=int, default=None, help="Max words to generate (default: all words in target)")
    parser.add_argument("--delay", type=float, default=3.5, help="Delay in seconds between requests (default: 3.5s to respect 15 RPM limit)")
    parser.add_argument("--overwrite", action="store_true", help="Overwrite existing illustration files")

    args = parser.parse_args()

    api_key = (args.api_key or "").strip()
    if not api_key:
        print("[!] Error: Google AI Studio API Key is required.", flush=True)
        sys.exit(1)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    if WORKTREE_DIR.exists():
        (WORKTREE_DIR / "assets" / "images" / "illustrations").mkdir(parents=True, exist_ok=True)

    all_vocab = load_vocabulary()

    targets = []
    if args.words:
        input_words = [w.strip() for w in re.split(r"[,;\s]+", args.words) if w.strip()]
        for w in input_words:
            if w in all_vocab:
                item = dict(all_vocab[w])
                targets.append(item)
            else:
                targets.append({"hanzi": w, "meaning": w, "pinyin": ""})
    elif args.hsk:
        hsk_file = VOCAB_DIR / f"hsk{args.hsk}_vocabularies.json"
        if hsk_file.exists():
            with open(hsk_file, "r", encoding="utf-8") as fp:
                data = json.load(fp)
                if args.limit:
                    targets = data[:args.limit]
                else:
                    targets = data
    else:
        print("[!] Please specify --words or --hsk", flush=True)
        sys.exit(1)

    total = len(targets)
    print(f"[*] Starting batch generation for {total} word(s) [Delay: {args.delay}s]...", flush=True)

    success_count = 0
    skip_count = 0
    fail_count = 0
    pending_records = {}

    for idx, item in enumerate(targets, 1):
        hanzi = item.get("hanzi", "").strip()
        meaning = item.get("meaning", "").strip()
        pinyin = item.get("pinyin", "").strip()
        pos = item.get("pos") or guess_pos(meaning)
        item["pos"] = pos

        out_filename = f"{hanzi}.svg"
        out_path = OUTPUT_DIR / out_filename

        pct = (idx / total) * 100

        # Check if already exists
        if out_path.exists() and out_path.stat().st_size > 60 and not args.overwrite:
            skip_count += 1
            pending_records[hanzi] = {
                "file": out_filename,
                "src": f"assets/images/illustrations/{out_filename}",
                "caption": meaning
            }
            if idx % 20 == 0:
                print(f"[{idx}/{total}] ({pct:.1f}%) Progress check: {skip_count} skipped (already exist), {success_count} newly generated.", flush=True)
            continue

        print(f"[{idx}/{total}] ({pct:.1f}%) Generating '{hanzi}' ({pinyin} - {meaning})...", flush=True)

        svg_code = call_gemini_svg_api(item, api_key)
        if svg_code:
            out_path.write_text(svg_code, encoding="utf-8")
            if WORKTREE_DIR.exists():
                try:
                    wt_path = WORKTREE_DIR / "assets" / "images" / "illustrations" / out_filename
                    wt_path.write_text(svg_code, encoding="utf-8")
                except Exception:
                    pass

            pending_records[hanzi] = {
                "file": out_filename,
                "src": f"assets/images/illustrations/{out_filename}",
                "caption": meaning
            }
            success_count += 1
            print(f"    ✓ Saved SVG ({len(svg_code)} B)", flush=True)
        else:
            fail_count += 1
            print(f"    ✗ Failed to generate SVG for '{hanzi}'", flush=True)

        # Incrementally update manifest every 5 words
        if len(pending_records) >= 5 or idx == total:
            update_illustrations_manifest(pending_records)
            pending_records.clear()

        # Respect API rate limits
        if idx < total:
            time.sleep(args.delay)

    # Final manifest flush
    if pending_records:
        update_illustrations_manifest(pending_records)

    print(f"\n[*] BATCH COMPLETED: {total} total, {success_count} generated, {skip_count} skipped, {fail_count} failed.", flush=True)

if __name__ == "__main__":
    main()
