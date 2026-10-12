#!/usr/bin/env python3
"""
tools/batch_generate_all.py
Master Scene-Based Vector Illustration Pipeline & Organization Engine.

Folder Structure:
images/
├── HSK_2.0/
│   ├── level1/ .. level6/
├── HSK_3.0/
│   ├── level1/ .. level9/
├── generated_manifest.json
└── README.md

Features:
  - Commit & push after every 10 newly generated SVG illustrations (or at end of each level).
  - Illustrations are strictly scene-based, depicting real-world human action & scenario
    grounded directly in the vocabulary's example sentence.
  - No abstract symbols, no minimalist icons, zero text/characters, dark-mode friendly full-bleed containers.
  - Multi-model fallback cascade.
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
VOCAB_DIR = REPO_ROOT / "database" / "vocabs"
HSK3_DIR = VOCAB_DIR / "hsk3_0"
FLAT_OUTPUT_DIR = REPO_ROOT / "assets" / "images" / "illustrations"
IMAGES_DIR = REPO_ROOT / "images"
WORD_ILLUSTRATIONS_JS = REPO_ROOT / "assets" / "js" / "word-illustrations.js"
WORKTREE_DIR = REPO_ROOT

def get_api_keys(cli_arg=""):
    keys = []
    if cli_arg:
        for k in cli_arg.split(","):
            k = k.strip()
            if k and k not in keys:
                keys.append(k)
    if os.environ.get("GOOGLE_AI_KEY"):
        for k in os.environ.get("GOOGLE_AI_KEY").split(","):
            k = k.strip()
            if k and k not in keys:
                keys.append(k)
    key_file = REPO_ROOT / ".api_key"
    if key_file.exists():
        for line in key_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and line not in keys:
                keys.append(line)
    return keys

MODELS_TO_TRY = [
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.6-flash",
    "gemini-3-flash-preview",
    "gemini-2.5-flash",
]

# Track exhausted (key_index, model) pairs dynamically for this session
EXHAUSTED_KEY_MODELS = set()

def guess_pos(meaning):
    m = (meaning or "").lower()
    if re.search(r'^(đẹp|tốt|xấu|to|nhỏ|lớn|cao|thấp|nhanh|chậm|dài|ngắn|nóng|lạnh|mới|cũ|đắt|rẻ|khó|dễ|buồn|vui|sạch|bẩn|ngon|ngọt|đắng|cay|mặn|chua|mệt|đói|no|bận|rảnh|đúng|sai|tiện|phức tạp|đơn giản|quan trọng|an toàn|nguy hiểm|nghiêm túc|cẩn thận|nhiệt tình|tự tin|hạnh phúc|khỏe|yếu|trắng|đen|đỏ|vàng|xanh)\b', m) or 'tính từ' in m:
        return 'adj'
    if re.search(r'^(làm|đi|nói|ăn|uống|xem|mua|bán|học|chạy|bay|đến|rời|giúp|tổ chức|chuẩn bị|phát hiện|tham gia|quyết định|giải quyết|sử dụng|cung cấp|tìm|gặp|nhớ|hiểu|yêu|ghét|thích|lo|nghĩ|biết|mặc|đeo|viết|đọc|nghe|sắp xếp|bố trí|ôm|xin lỗi|đăng ký|tốt nghiệp|biểu thị|thể hiện|biểu diễn|khen ngợi|bảo vệ|đảm bảo|thực hiện|hoàn thành|phát triển|mở rộng|thay đổi|tổng kết|du lịch|trao đổi|kết hôn|kinh doanh|nghiên cứu|chiến đấu|chúc mừng|cảm ơn|kính trọng|mời|chờ|đợi|hy vọng|ước|tin|nghi ngờ|chú ý|quan tâm|giảng|dạy|vẽ|hát|múa|bơi|chơi|sửa|chữa|chọn|chọn lựa)\b', m) or 'động từ' in m:
        return 'verb'
    return 'noun'

def load_level_data(file_path):
    if not file_path.exists():
        return []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except Exception as e:
        print(f"[!] Error loading {file_path}: {e}", flush=True)
        return []

def ensure_directory_structure():
    FLAT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for i in range(1, 7):
        (IMAGES_DIR / "HSK_2.0" / f"level{i}").mkdir(parents=True, exist_ok=True)
    for i in range(1, 10):
        (IMAGES_DIR / "HSK_3.0" / f"level{i}").mkdir(parents=True, exist_ok=True)

    if WORKTREE_DIR.exists():
        wt_flat = WORKTREE_DIR / "assets" / "images" / "illustrations"
        wt_flat.mkdir(parents=True, exist_ok=True)
        wt_images = WORKTREE_DIR / "images"
        for i in range(1, 7):
            (wt_images / "HSK_2.0" / f"level{i}").mkdir(parents=True, exist_ok=True)
        for i in range(1, 10):
            (wt_images / "HSK_3.0" / f"level{i}").mkdir(parents=True, exist_ok=True)

def build_manifest_and_organize():
    """
    Scans all vocabulary files and existing SVG files.
    Copies SVGs into images/HSK_2.0/levelX and images/HSK_3.0/levelY.
    Generates images/generated_manifest.json and images/README.md.
    Updates assets/js/word-illustrations.js.
    """
    ensure_directory_structure()
    print("[*] Building illustration organization and manifest under images/...", flush=True)

    hsk2_curriculum = [(f"level{i}", VOCAB_DIR / f"hsk{i}_vocabularies.json") for i in range(1, 7)]
    hsk3_curriculum = [(f"level{i}", HSK3_DIR / f"level{i}_vocabularies.json") for i in range(1, 10)]

    existing_flat_svgs = {p.stem: p for p in FLAT_OUTPUT_DIR.glob("*.svg") if p.is_file() and p.stat().st_size > 150}

    # Also check existing images SVGs
    for p in IMAGES_DIR.glob("**/*.svg"):
        if p.is_file() and p.stat().st_size > 150:
            if p.stem not in existing_flat_svgs:
                flat_dest = FLAT_OUTPUT_DIR / p.name
                if not flat_dest.exists() or flat_dest.stat().st_size != p.stat().st_size:
                    shutil.copy2(p, flat_dest)
                existing_flat_svgs[p.stem] = flat_dest

    manifest_entries = {}
    stats_hsk2 = {}
    stats_hsk3 = {}

    # 1. Map HSK 2.0 (level1..level6)
    for lvl_code, path in hsk2_curriculum:
        words = load_level_data(path)
        dest_dir = IMAGES_DIR / "HSK_2.0" / lvl_code
        dest_dir.mkdir(parents=True, exist_ok=True)
        count = 0
        for w in words:
            hz = w.get("hanzi", "").strip()
            if not hz:
                continue
            if hz in existing_flat_svgs:
                src_file = existing_flat_svgs[hz]
                target_file = dest_dir / f"{hz}.svg"
                if not target_file.exists() or target_file.stat().st_size != src_file.stat().st_size:
                    shutil.copy2(src_file, target_file)
                count += 1

                rel_src = f"images/HSK_2.0/{lvl_code}/{hz}.svg"
                if hz not in manifest_entries:
                    manifest_entries[hz] = {
                        "hanzi": hz,
                        "pinyin": w.get("pinyin", ""),
                        "meaning": w.get("meaning", ""),
                        "example_zh": w.get("example_zh") or w.get("example", ""),
                        "example_vi": w.get("example_vi", ""),
                        "levels_hsk2": [lvl_code],
                        "levels_hsk3": [],
                        "file": f"{hz}.svg",
                        "src": rel_src,
                        "alt_srcs": []
                    }
                else:
                    if lvl_code not in manifest_entries[hz]["levels_hsk2"]:
                        manifest_entries[hz]["levels_hsk2"].append(lvl_code)
                    if rel_src not in manifest_entries[hz]["alt_srcs"] and rel_src != manifest_entries[hz]["src"]:
                        manifest_entries[hz]["alt_srcs"].append(rel_src)

        pct = (count / len(words) * 100) if words else 0.0
        stats_hsk2[lvl_code] = {"total": len(words), "with_svg": count, "pct": f"{pct:.1f}%"}

    # 2. Map HSK 3.0 (level1..level9)
    for lvl_code, path in hsk3_curriculum:
        words = load_level_data(path)
        dest_dir = IMAGES_DIR / "HSK_3.0" / lvl_code
        dest_dir.mkdir(parents=True, exist_ok=True)
        count = 0
        for w in words:
            hz = w.get("hanzi", "").strip()
            if not hz:
                continue
            if hz in existing_flat_svgs:
                src_file = existing_flat_svgs[hz]
                target_file = dest_dir / f"{hz}.svg"
                if not target_file.exists() or target_file.stat().st_size != src_file.stat().st_size:
                    shutil.copy2(src_file, target_file)
                count += 1

                rel_src = f"images/HSK_3.0/{lvl_code}/{hz}.svg"
                if hz not in manifest_entries:
                    manifest_entries[hz] = {
                        "hanzi": hz,
                        "pinyin": w.get("pinyin", ""),
                        "meaning": w.get("meaning", ""),
                        "example_zh": w.get("example_zh") or w.get("example", ""),
                        "example_vi": w.get("example_vi", ""),
                        "levels_hsk2": [],
                        "levels_hsk3": [lvl_code],
                        "file": f"{hz}.svg",
                        "src": rel_src,
                        "alt_srcs": []
                    }
                else:
                    if lvl_code not in manifest_entries[hz]["levels_hsk3"]:
                        manifest_entries[hz]["levels_hsk3"].append(lvl_code)
                    if rel_src not in manifest_entries[hz]["alt_srcs"] and rel_src != manifest_entries[hz]["src"]:
                        manifest_entries[hz]["alt_srcs"].append(rel_src)

        pct = (count / len(words) * 100) if words else 0.0
        stats_hsk3[lvl_code] = {"total": len(words), "with_svg": count, "pct": f"{pct:.1f}%"}

    # Output generated_manifest.json
    manifest_data = {
        "generated_at": datetime.now().isoformat(),
        "total_unique_words_with_illustrations": len(manifest_entries),
        "total_flat_svg_files": len(existing_flat_svgs),
        "statistics": {
            "hsk_2_0": stats_hsk2,
            "hsk_3_0": stats_hsk3
        },
        "manifest": manifest_entries
    }

    manifest_json_str = json.dumps(manifest_data, ensure_ascii=False, indent=2)
    (IMAGES_DIR / "generated_manifest.json").write_text(manifest_json_str, encoding="utf-8")
    (REPO_ROOT / "generated_manifest.json").write_text(manifest_json_str, encoding="utf-8")

    # Output README.md
    readme_md = generate_readme_markdown(stats_hsk2, stats_hsk3, len(manifest_entries))
    (IMAGES_DIR / "README.md").write_text(readme_md, encoding="utf-8")
    (REPO_ROOT / "README_ILLUSTRATIONS.md").write_text(readme_md, encoding="utf-8")

    # Update assets/js/word-illustrations.js
    update_word_illustrations_js(manifest_entries)

    print(f"[*] Manifest and images/ organization built successfully. Total indexed: {len(manifest_entries)} words.", flush=True)
    return manifest_data

def generate_readme_markdown(stats_hsk2, stats_hsk3, total_unique):
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def make_progress_bar(pct_str):
        pct = float(pct_str.replace('%', ''))
        blocks = int(pct / 10)
        return '█' * blocks + '░' * (10 - blocks)

    hsk2_rows = []
    total_hsk2_words = sum(v["total"] for v in stats_hsk2.values())
    total_hsk2_svg = sum(v["with_svg"] for v in stats_hsk2.values())
    hsk2_pct = (total_hsk2_svg / total_hsk2_words * 100) if total_hsk2_words else 0.0

    for i in range(1, 7):
        lvl = f"level{i}"
        info = stats_hsk2.get(lvl, {"total": 0, "with_svg": 0, "pct": "0.0%"})
        status = "✅ Hoàn thành" if info["pct"] == "100.0%" else ("⏳ Đang tạo" if info["with_svg"] > 0 else "⚪ Chưa tạo")
        bar = make_progress_bar(info["pct"])
        hsk2_rows.append(f"| **HSK 2.0 Level {i}** | `{info['with_svg']}/{info['total']}` | **{info['pct']}** | `{bar}` | {status} |")

    hsk3_rows = []
    total_hsk3_words = sum(v["total"] for v in stats_hsk3.values())
    total_hsk3_svg = sum(v["with_svg"] for v in stats_hsk3.values())
    hsk3_pct = (total_hsk3_svg / total_hsk3_words * 100) if total_hsk3_words else 0.0

    for i in range(1, 10):
        lvl = f"level{i}"
        info = stats_hsk3.get(lvl, {"total": 0, "with_svg": 0, "pct": "0.0%"})
        status = "✅ Hoàn thành" if info["pct"] == "100.0%" else ("⏳ Đang tạo" if info["with_svg"] > 0 else "⚪ Chưa tạo")
        bar = make_progress_bar(info["pct"])
        hsk3_rows.append(f"| **HSK 3.0 Level {i}** | `{info['with_svg']}/{info['total']}` | **{info['pct']}** | `{bar}` | {status} |")

    return f"""# 🎨 Kho Lưu Trữ Hình Minh Họa Ngữ Cảnh HSK (Scene-Based Vector Illustrations)

*Báo cáo cập nhật tự động lúc: `{now_str}`*

Kho hình ảnh vector minh họa trực quan (Scene-Based Visual Mnemonics) cho toàn bộ từ vựng tiếng Trung thuộc hai hệ thống giáo trình **HSK 2.0 (Level 1 - 6)** và **HSK 3.0 (Level 1 - 9)**.

---

## 🌟 Tiêu chuẩn thiết kế minh họa (Art Direction Standards)
1. **Scene-Based & Action-Oriented (Gợi cảnh & Hành động thực tế)**:
   - Toàn bộ hình vẽ được mô phỏng trực tiếp từ **câu ví dụ ngữ cảnh** của từ vựng đó.
   - Nhân vật thực hiện hành động cụ thể, có đạo cụ (props), bối cảnh không gian thực tế (phòng học, văn phòng, đường phố, sân bay, bệnh viện, nhà hàng,...).
   - **Tuyệt đối KHÔNG vẽ biểu tượng trừu tượng (abstract symbols), icon tối giản, logo hay khối hình học đơn điệu**.
2. **Thân thiện với chế độ tối (Dark-Mode Friendly)**:
   - Khung hình full-bleed container `240x240` nền tối sang trọng (`#1e293b` / `#0f172a`), đổ bóng mềm, viền bo tròn mềm mại (`rx="24"`).
   - Màu sắc sinh động, ấm áp, độ tương phản cao với chữ Hán và Pinyin.
3. **Tuyệt đối không nhúng chữ (Zero Text / Zero Hanzi)**:
   - Minh họa đóng vai trò **kích thích trí nhớ hình ảnh thuần túy**, không chứa chữ Hán, Pinyin hay ký tự chữ viết để người học tự tư duy ghi nhớ từ vựng.

---

## 📁 Cấu trúc thư mục (Folder Hierarchy)

```
images/
├── HSK_2.0/
│   ├── level1/          # 150/150 từ (100.0%) - ✅ Hoàn thành
│   ├── level2/          # 150/150 từ (100.0%) - ✅ Hoàn thành
│   ├── level3/          # Từ vựng HSK 2.0 Level 3
│   ├── level4/          # 600/600 từ (100.0%) - ✅ Hoàn thành
│   ├── level5/          # Từ vựng HSK 2.0 Level 5
│   └── level6/          # Từ vựng HSK 2.0 Level 6
├── HSK_3.0/
│   ├── level1/          # HSK 3.0 Level 1
│   ├── level2/          # HSK 3.0 Level 2
│   ├── level3/          # HSK 3.0 Level 3
│   ├── level4/          # HSK 3.0 Level 4
│   ├── level5/          # HSK 3.0 Level 5
│   ├── level6/          # HSK 3.0 Level 6
│   ├── level7/          # HSK 3.0 Level 7
│   ├── level8/          # HSK 3.0 Level 8
│   └── level9/          # HSK 3.0 Level 9
├── generated_manifest.json    # Manifest tra cứu toàn diện JSON
└── README.md                  # Bản thống kê chi tiết này
```

---

## 📊 Bảng thống kê tiến độ HSK 2.0 (Tổng từ vựng: {total_hsk2_words})

| Cấp độ | Đã có hình / Tổng từ | Tỷ lệ | Tiến độ trực quan | Trạng thái |
| :--- | :---: | :---: | :--- | :--- |
{chr(10).join(hsk2_rows)}
| **TỔNG CỘNG HSK 2.0** | **`{total_hsk2_svg}/{total_hsk2_words}`** | **`{hsk2_pct:.1f}%`** | `{make_progress_bar(f'{hsk2_pct:.1f}%')}` | {'✅ Đầy đủ' if hsk2_pct == 100 else '⏳ Đang hoàn thiện'} |

---

## 📊 Bảng thống kê tiến độ HSK 3.0 (Tổng từ vựng: {total_hsk3_words})

| Cấp độ | Đã có hình / Tổng từ | Tỷ lệ | Tiến độ trực quan | Trạng thái |
| :--- | :---: | :---: | :--- | :--- |
{chr(10).join(hsk3_rows)}
| **TỔNG CỘNG HSK 3.0** | **`{total_hsk3_svg}/{total_hsk3_words}`** | **`{hsk3_pct:.1f}%`** | `{make_progress_bar(f'{hsk3_pct:.1f}%')}` | ⏳ Đang hoàn thiện |

---

## 💡 Tổng kết tài nguyên hiện tại
- **Tổng số từ vựng duy nhất đã có minh họa vector**: **`{total_unique}`** từ.
- **Manifest tích hợp ứng dụng**: File [`assets/js/word-illustrations.js`](file:///assets/js/word-illustrations.js) và [`images/generated_manifest.json`](file:///images/generated_manifest.json) tự động đồng bộ đường dẫn để flashcard tải trực tiếp hình ảnh theo cấp độ tương ứng.
"""

def update_word_illustrations_js(manifest_entries):
    if not WORD_ILLUSTRATIONS_JS.exists() or not manifest_entries:
        return

    content = WORD_ILLUSTRATIONS_JS.read_text(encoding="utf-8")
    js_index = {}
    for hz, item in manifest_entries.items():
        js_index[hz] = {
            "file": item["file"],
            "src": item["src"],
            "caption": item["meaning"]
        }

    new_block = f"const STATIC_ILLUSTRATIONS_INDEX = {json.dumps(js_index, ensure_ascii=False, indent=2)};"

    match = re.search(r"const STATIC_ILLUSTRATIONS_INDEX = (\{[\s\S]*?\});", content)
    if match:
        content = content[:match.start()] + new_block + content[match.end():]
    else:
        target = "function getWordIllustration"
        if target in content:
            content = content.replace(target, new_block + "\n\n" + target, 1)

    WORD_ILLUSTRATIONS_JS.write_text(content, encoding="utf-8")

    if WORKTREE_DIR.exists():
        try:
            wt_js = WORKTREE_DIR / "assets" / "js" / "word-illustrations.js"
            wt_js.write_text(content, encoding="utf-8")
        except Exception:
            pass

def call_gemini_svg_api(word_info, api_keys, max_retries=4):
    if isinstance(api_keys, str):
        api_keys = [api_keys] if api_keys else []
    if not api_keys:
        return None
    hanzi = word_info.get("hanzi", "").strip()
    meaning = word_info.get("meaning", "").strip()
    pos = word_info.get("pos") or guess_pos(meaning)
    pinyin = word_info.get("pinyin", "").strip()

    ex_vi = (word_info.get("example_vi") or "").replace("<u>", "").replace("</u>", "").strip()
    ex_zh = (word_info.get("example_zh") or word_info.get("example") or "").replace("<u>", "").replace("</u>", "").strip()

    example_grounding = ""
    if ex_zh or ex_vi:
        example_grounding = f"""
EXACT SCENARIO TO ILLUSTRATE (CRUCIAL):
The scene MUST be grounded directly in this example sentence:
- Chinese sentence: "{ex_zh}"
- Vietnamese meaning: "{ex_vi}"
Create a clear, relatable real-world human situation depicting the story or action described in this sentence.
Show the subject/characters actively in this specific setting with context props and environment matching this scenario.
"""

    prompt = f"""You are an elite 2D vector illustrator and art director creating scene-based illustrations for an HSK language learning app.
Target Vocabulary: {hanzi} ({pinyin}) - Meaning: '{meaning}' - Part of Speech: {pos}.
{example_grounding}
CRITICAL ART DIRECTION & COMPOSITION RULES:
1. SCENE & SUBJECT:
   - Depict a RICH, CONCRETE, REAL-WORLD SCENARIO illustrating the target word and its example sentence.
   - Include stylized, expressive characters actively performing the action or experiencing the situation.
   - Include rich environmental details and props (e.g. room interior, workplace desk, tools, nature, urban street, stage lighting, window, etc.) establishing clear real-world context.
   - ABSOLUTELY NO abstract symbols, NO geometric badges, NO minimalist icons, NO generic emojis.
2. STYLE:
   - Clean, friendly 2D flat cartoon / minimalist vector art with expressive contours and rich narrative depth.
3. CANVAS & CONTAINER:
   - Valid SVG with viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg".
   - Full-bleed container: <rect width="240" height="240" rx="24" fill="#1e293b"/> (or gradient from #0f172a to #1e293b).
   - Fill the canvas harmoniously with the main subject and context surroundings.
4. COLOR PALETTE:
   - Dark-mode harmonious: Deep slate navy background (#0f172a, #1e293b), muted blues, warm golden/amber glows (#f59e0b, #fbbf24), and energetic modern accents (#38bdf8, #10b981, #ec4899, #fb923c).
5. STRICT NEGATIVE CONSTRAINTS:
   - ABSOLUTELY NO text, NO letters, NO words, NO subtitles, NO Chinese characters (NO {hanzi}), NO English words, NO pinyin.
   - ABSOLUTELY NO Gemini logo, NO brand logos, NO watermarks.
6. Return ONLY the raw <svg>...</svg> code, without markdown backticks, without any commentary."""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.35}
    }

    for attempt in range(max_retries):
        available_pairs = []
        for model in MODELS_TO_TRY:
            for k_idx, key in enumerate(api_keys):
                if (k_idx, model) not in EXHAUSTED_KEY_MODELS:
                    available_pairs.append((k_idx, key, model))

        if not available_pairs:
            print("        [CRITICAL] All configured API keys and models have exhausted their quota! Pausing.", flush=True)
            return None

        for k_idx, key, model in available_pairs:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
            try:
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"}
                )
                with urllib.request.urlopen(req, timeout=45) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and "text" in parts[0]:
                            text = parts[0]["text"]
                            m = re.search(r"<svg[\s\S]*?<\/svg>", text, re.IGNORECASE)
                            if m:
                                svg_str = m.group(0).strip()
                                if len(svg_str) > 150:
                                    return svg_str
                                else:
                                    print(f"        [!] {model}: SVG too short ({len(svg_str)} bytes)", flush=True)
                            else:
                                print(f"        [!] {model}: No <svg> tag in output ({text[:60]}...)", flush=True)
                        else:
                            print(f"        [!] {model}: Empty parts in content", flush=True)
                    else:
                        print(f"        [!] {model}: No candidates in response", flush=True)
            except urllib.error.HTTPError as he:
                err_body = he.read().decode("utf-8", errors="ignore")
                try:
                    err_json = json.loads(err_body)
                    msg = err_json.get("error", {}).get("message", err_body[:100])
                except Exception:
                    msg = err_body[:100]

                # Check if quota exceeded (daily limit) -> Blacklist permanently for this session & immediately switch
                if he.code == 429 and ("quota" in msg.lower() or "limit" in msg.lower() or "resource_exhausted" in err_body.lower()):
                    EXHAUSTED_KEY_MODELS.add((k_idx, model))
                    print(f"        [>>> SWITCH MODEL] Quota exceeded for Key #{k_idx+1} on {model}. Blacklisted for this run. Immediately switching...", flush=True)
                    continue
                elif he.code == 503:
                    print(f"        [!] Key #{k_idx+1} {model} HTTP 503 (temporary high demand on Google servers). Waiting 10s...", flush=True)
                    time.sleep(10)
                    continue
                elif he.code in (404, 400):
                    EXHAUSTED_KEY_MODELS.add((k_idx, model))
                    print(f"        [>>> SWITCH MODEL] {model} unavailable (HTTP {he.code}). Removed from rotation.", flush=True)
                    continue
                else:
                    print(f"        [!] Key #{k_idx+1} {model} HTTP {he.code}: {msg.strip()}", flush=True)
                    continue
            except Exception as e:
                print(f"        [!] Key #{k_idx+1} {model} Error: {e}", flush=True)
                continue

        if attempt < max_retries - 1:
            wait_sec = 15 * (attempt + 1)
            print(f"        [!] All active pairs busy/throttling. Waiting {wait_sec}s before retry {attempt+2}/{max_retries}...", flush=True)
            time.sleep(wait_sec)

    return None

def git_commit_and_push(batch_count, level_label):
    try:
        print(f"\n[>>> GIT] Committing and pushing batch of {batch_count} newly generated SVGs for {level_label}...", flush=True)
        subprocess.run(["git", "add", "images", "assets/images/illustrations", "generated_manifest.json", "README_ILLUSTRATIONS.md", "assets/js/word-illustrations.js"], cwd=REPO_ROOT, check=True)
        commit_msg = f"feat(illustrations): batch generate scene-based SVGs ({level_label}: +{batch_count} words)"
        res = subprocess.run(["git", "commit", "-m", commit_msg], cwd=REPO_ROOT, capture_output=True, text=True)
        print(f"[>>> GIT] {res.stdout.strip()}", flush=True)
        push_res = subprocess.run(["git", "push", "origin", "main"], cwd=REPO_ROOT, capture_output=True, text=True)
        print(f"[>>> GIT] Push result: {push_res.stdout.strip() or 'OK'}", flush=True)
    except Exception as e:
        print(f"[!] Warning git commit/push encountered error: {e}", flush=True)

def main():
    parser = argparse.ArgumentParser(description="Master batch generator & organizer for all HSK 2.0 & HSK 3.0 levels")
    parser.add_argument("--api-key", default="", help="Google AI Studio API Key (comma-separated or set in .api_key)")
    parser.add_argument("--delay", type=float, default=4.0, help="Delay between API calls in seconds (default: 4.0s)")
    parser.add_argument("--batch-size", type=int, default=10, help="Commit and push every N generated items (default: 10)")
    parser.add_argument("--only-organize", action="store_true", help="Only reorganize existing SVGs, build manifest & README without generating new SVGs")
    parser.add_argument("--target-level", default="all", help="Target specific level (e.g., 'level3', 'level5', 'level6', 'all')")
    args = parser.parse_args()

    api_keys = get_api_keys(args.api_key.strip())
    if not api_keys and not args.only_organize:
        print("[!] No Google AI API key found! Please set GOOGLE_AI_KEY or add to .api_key", flush=True)
        return

    print(f"[*] Loaded {len(api_keys)} API key(s) for generation rotation.", flush=True)

    # Step 1: Organization under images/
    manifest_data = build_manifest_and_organize()

    if args.only_organize:
        print("[*] Reorganization completed successfully (--only-organize). Exiting.", flush=True)
        return

    # Step 2: Curriculum roadmap
    curriculum = [
        # Phase 1: Complete HSK 2.0 Level 3 (around 126 remaining)
        ("HSK 2.0 Level 3", "level3", "HSK_2.0", VOCAB_DIR / "hsk3_vocabularies.json"),
        # Phase 2: Complete HSK 2.0 Level 5 (406 remaining)
        ("HSK 2.0 Level 5", "level5", "HSK_2.0", VOCAB_DIR / "hsk5_vocabularies.json"),
        # Phase 3: Complete HSK 2.0 Level 6 (2072 remaining)
        ("HSK 2.0 Level 6", "level6", "HSK_2.0", VOCAB_DIR / "hsk6_vocabularies.json"),
        # Phase 4: HSK 3.0 Levels 1..9
        ("HSK 3.0 Level 1", "level1", "HSK_3.0", HSK3_DIR / "level1_vocabularies.json"),
        ("HSK 3.0 Level 2", "level2", "HSK_3.0", HSK3_DIR / "level2_vocabularies.json"),
        ("HSK 3.0 Level 3", "level3", "HSK_3.0", HSK3_DIR / "level3_vocabularies.json"),
        ("HSK 3.0 Level 4", "level4", "HSK_3.0", HSK3_DIR / "level4_vocabularies.json"),
        ("HSK 3.0 Level 5", "level5", "HSK_3.0", HSK3_DIR / "level5_vocabularies.json"),
        ("HSK 3.0 Level 6", "level6", "HSK_3.0", HSK3_DIR / "level6_vocabularies.json"),
        ("HSK 3.0 Level 7", "level7", "HSK_3.0", HSK3_DIR / "level7_vocabularies.json"),
        ("HSK 3.0 Level 8", "level8", "HSK_3.0", HSK3_DIR / "level8_vocabularies.json"),
        ("HSK 3.0 Level 9", "level9", "HSK_3.0", HSK3_DIR / "level9_vocabularies.json"),
    ]

    if args.target_level != "all":
        curriculum = [c for c in curriculum if c[1] == args.target_level or c[0].lower() == args.target_level.lower()]

    total_generated_session = 0
    batch_new_count = 0

    print("\n==================================================================", flush=True)
    print("  HSK Flashcards: Master Scene-Based Illustration Pipeline", flush=True)
    print(f"  Target: images/HSK_2.0/level1..6 -> images/HSK_3.0/level1..9", flush=True)
    print(f"  Batch commit threshold: Every {args.batch_size} newly generated SVGs", flush=True)
    print("==================================================================\n", flush=True)

    for level_label, lvl_code, schema_type, file_path in curriculum:
        words = load_level_data(file_path)
        if not words:
            continue

        print(f"\n[*] Starting {level_label} ({len(words)} words) from {file_path.name}...", flush=True)
        level_new = 0
        level_skipped = 0

        for idx, item in enumerate(words, 1):
            hanzi = item.get("hanzi", "").strip()
            if not hanzi:
                continue

            meaning = item.get("meaning", "").strip()
            pinyin = item.get("pinyin", "").strip()
            pos = item.get("pos") or guess_pos(meaning)
            item["pos"] = pos

            out_filename = f"{hanzi}.svg"
            flat_path = FLAT_OUTPUT_DIR / out_filename
            images_dest = IMAGES_DIR / schema_type / lvl_code / out_filename

            # Check if SVG already exists in images or flat dir
            if (images_dest.exists() and images_dest.stat().st_size > 150) or (flat_path.exists() and flat_path.stat().st_size > 150):
                level_skipped += 1
                if not images_dest.exists() and flat_path.exists():
                    shutil.copy2(flat_path, images_dest)
                if idx % 50 == 0:
                    print(f"    [{idx}/{len(words)}] Progress: {level_skipped} existing skipped, {level_new} newly generated.", flush=True)
                continue

            print(f"    [{idx}/{len(words)}] Generating '{hanzi}' ({pinyin} - {meaning})...", flush=True)
            svg_code = call_gemini_svg_api(item, api_keys)
            if svg_code:
                # 1. Write flat SVG
                flat_path.write_text(svg_code, encoding="utf-8")

                # 2. Write images/ SVG
                images_dest.write_text(svg_code, encoding="utf-8")

                # 3. Mirror to worktree if exists
                if WORKTREE_DIR.exists():
                    try:
                        (WORKTREE_DIR / "assets" / "images" / "illustrations" / out_filename).write_text(svg_code, encoding="utf-8")
                        (WORKTREE_DIR / "images" / schema_type / lvl_code / out_filename).write_text(svg_code, encoding="utf-8")
                    except Exception:
                        pass

                level_new += 1
                batch_new_count += 1
                total_generated_session += 1
                print(f"        ✓ Saved scene SVG ({len(svg_code)} B) [Total this session: {total_generated_session}]", flush=True)
            else:
                print(f"        ✗ Failed to generate '{hanzi}'", flush=True)

            # Periodically rebuild manifest and commit every batch_size (default: 10)
            if batch_new_count >= args.batch_size:
                build_manifest_and_organize()
                git_commit_and_push(batch_new_count, level_label)
                batch_new_count = 0

            time.sleep(args.delay)

        # End of level
        if batch_new_count > 0:
            build_manifest_and_organize()
            git_commit_and_push(batch_new_count, level_label)
            batch_new_count = 0
        else:
            build_manifest_and_organize()

        print(f"[*] Completed {level_label}: {level_new} newly generated, {level_skipped} skipped.", flush=True)

    print("\n==================================================================", flush=True)
    print(f"[*] ALL LEVELS COMPLETED! Total newly generated: {total_generated_session}", flush=True)
    print("==================================================================", flush=True)

if __name__ == "__main__":
    main()
