#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Build script to parse N3 HTML sheets and generate database/vocabs/*.json
"""
import os
import re
import json
from bs4 import BeautifulSoup

N3_DIR = "N3 "
OUTPUT_DIR = "database/vocabs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def clean_txt(t):
    if not t:
        return ""
    return re.sub(r'\s+', ' ', t).strip()

def has_kanji(text):
    return bool(re.search(r'[\u4e00-\u9faf]', text))

def is_kana_only(text):
    if not text:
        return False
    return bool(re.fullmatch(r'[\u3040-\u309F\u30A0-\u30FF\s・/～〜\.\-]+', text))

# Known dictionary for N3 vocabulary fallback meanings
FALLBACK_MEANINGS = {
    "読書": "đọc sách",
    "演奏": "biểu diễn",
    "芸術": "nghệ thuật",
    "検査": "kiểm tra, khám bệnh",
    "血液": "máu, huyết dịch",
    "治療": "trị liệu, chữa bệnh",
    "症状": "triệu chứng",
    "予防": "dự phòng, phòng ngừa",
    "栄養": "dinh dưỡng",
    "手術": "phẫu thuật",
    "死亡": "tử vong, qua đời",
    "命": "sinh mạng, tính mạng",
    "一生": "cả đời, một đời",
    "誤解": "hiểu lầm, ngộ nhận",
    "後悔": "hối hận",
    "訳": "lý do, ý nghĩa",
    "態度": "thái độ",
    "癖": "tật xấu, thói quen",
    "礼儀": "lễ nghi, phép lịch sự",
    "文句": "phàn nàn, câu từ",
    "表情": "biểu cảm, diện mạo",
    "表面": "bề mặt",
    "禁煙": "cấm hút thuốc",
    "禁止": "cấm đoán",
    "完成": "hoàn thành",
    "課題": "chủ đề, nhiệm vụ, thách thức",
    "例外": "ngoại lệ",
    "基本": "cơ bản, nền tảng",
    "記録": "kỷ lục, ghi chép",
    "限度": "hạn độ, giới hạn",
    "限界": "ranh giới, cực hạn",
    "検討": "xem xét, cân nhắc",
    "選択": "lựa chọn",
    "考慮": "suy xét, tính đến",
    "状況": "tình hình, hoàn cảnh",
    "現実": "hiện thực, thực tế",
    "困難": "khó khăn, gian nan",
    "補足": "bổ sung, thêm vào",
    "協力": "hợp tác, chung sức",
    "信用": "lòng tin, tín nhiệm",
    "信頼": "tin cậy, tin tưởng",
    "期待": "kỳ vọng, mong đợi",
    "感情": "cảm xúc, tình cảm",
    "感想": "cảm tưởng, cảm nghĩ",
    "感覚": "cảm giác, trực giác",
    "記憶": "ký ức, trí nhớ",
    "意識": "ý thức, nhận thức",
    "判断": "phán đoán, đánh giá",
    "主張": "chủ trương, quan điểm",
    "計画": "kế hoạch",
    "目的": "mục đích",
    "理由": "lý do, nguyên nhân",
    "原因": "nguyên nhân",
    "結果": "kết quả",
    "影響": "ảnh hưởng, tác động",
    "効果": "hiệu quả, tác dụng",
    "印象": "ấn tượng",
    "節約": "tiết kiệm",
    "寄付": "quyên góp, ủng hộ",
    "担当": "phụ trách, đảm nhiệm",
    "交代": "luân phiên, thay ca",
    "交渉": "đàm phán, thương lượng",
    "契約": "hợp đồng, giao kèo",
    "責任": "trách nhiệm",
    "書類": "giấy tờ, tài liệu",
    "予定": "dự định, lịch trình",
    "変化": "thay đổi, biến đổi",
    "発達": "phát triển",
    "普及": "phổ cập, lan rộng",
    "改善": "cải thiện",
    "進歩": "tiến bộ",
    "改正": "sửa đổi, cải chính",
    "発見": "phát hiện, tìm ra",
    "発明": "phát minh",
    "観察": "quan sát",
    "調査": "khảo sát, điều tra",
    "集中": "tập trung",
    "継続": "tiếp tục, duy trì",
    "制限": "hạn chế, giới hạn",
    "満足": "hài lòng, thỏa mãn",
    "不満": "bất mãn, không hài lòng",
    "不安": "lo lắng, bất an",
    "恐怖": "sợ hãi, khiếp sợ",
    "興奮": "hưng phấn, phấn khích",
    "感謝": "cảm ơn, biết ơn",
    "歓迎": "hoan nghênh, chào đón",
    "招待": "mời, chiêu đãi",
    "応援": "cổ vũ, ủng hộ",
    "変える": "thay đổi, làm biến đổi",
    "助ける": "cứu giúp, giúp đỡ",
    "いじめる": "bắt nạt",
    "だます": "lừa gạt, đánh lừa",
    "刺す": "cắm, chích, đâm",
    "隠す": "che giấu, bao bọc",
    "埋める": "chôn, lấp đầy, điền vào",
    "囲む": "bao quanh, vây quanh",
    "詰まる": "bị tắc, nghẹt, chật ních",
    "詰める": "nhét vào, đóng gói",
    "開く": "mở ra, nở (hoa)",
    "閉じる": "đóng lại, khép lại",
    "飛ぶ": "bay",
    "飛ばす": "phóng đi, làm bay",
    "揺れる": "rung lắc, dao động",
    "揺らす": "làm rung lắc, đung đưa",
    "流れる": "chảy, trôi",
    "流す": "làm chảy, xả (nước)",
    "濡れる": "bị ướt",
    "濡らす": "làm ướt",
    "乾く": "khô ráo",
    "乾かす": "làm khô, sấy khô",
    "冷える": "lạnh đi, nguội đi",
    "冷やす": "làm lạnh, ướp lạnh",
    "冷める": "nguội đi (thức ăn, cảm xúc)",
    "冷ます": "làm nguội",
    "燃える": "bốc cháy, cháy",
    "燃やす": "đốt cháy",
    "沸く": "sôi (nước)",
    "沸かす": "đun sôi",
    "鳴る": "kêu, reo (chuông)",
    "鳴らす": "bấm còi, làm rung chuông",
    "役立つ・役に立つ": "có ích, hữu ích",
    "役立てる・役に立てる": "vận dụng, đưa vào có ích",
    "蒸す": "hấp",
    "クラスメート": "bạn cùng lớp (classmate)",
    "グループ": "nhóm (group)",
    "チーム": "đội, nhóm (team)",
    "プロフェッショナル": "chuyên nghiệp (professional)",
    "アマチュア": "nghiệp dư (amateur)",
    "トレーニング": "tập luyện, rèn luyện (training)",
    "マッサージ": "xoa bóp, mát-xa (massage)",
    "アドバイス": "lời khuyên (advice)",
    "トップ": "vị trí đầu, đỉnh cao (top)",
    "アイデア・アイディア": "ý tưởng (idea)",
    "スピード": "tốc độ (speed)",
    "ラッシュ": "giờ cao điểm (rush hour)",
    "バイク": "xe máy (motorbike)",
    "ヘルメット": "mũ bảo hiểm (helmet)",
    "コンタクトレンズ": "kính áp tròng (contact lens)",
    "ガラス": "kính, thủy tinh (glass)",
    "プラスチック": "đồ nhựa (plastic)",
    "ベランダ": "ban công (veranda)",
    "ペット": "thú cưng (pet)",
    "ベンチ": "ghế dài công viên (bench)",
    "デザイン": "thiết kế (design)",
    "バーゲンセール": "đợt bán giảm giá (bargain sale)",
    "パート": "làm việc bán thời gian (part-time)",
    "コンビニ": "cửa hàng tiện lợi (convenience store)",
    "レジ": "quầy thu ngân (cash register)",
    "レシート": "hóa đơn thanh toán (receipt)",
    "インスタント": "ăn liền, ngay tức thì (instant)",
    "ファストフード": "thức ăn nhanh (fast food)",
    "バイキング": "ăn buffet, tiệc tự chọn (viking/buffet)",
    "インターネット": "mạng internet",
    "プリント": "bản in, tài liệu in (print)",
    "テキスト": "giáo trình, văn bản (text)",
    "テーマ": "chủ đề (theme)",
    "アルバム": "album ảnh",
    "イラスト": "hình minh họa (illustration)",
    "ポスター": "áp phích (poster)",
    "カレンダー": "lịch (calendar)",
    "ダイヤ": "kim cương / lịch tàu chạy (diamond/diagram)",
    "パスポート": "hộ chiếu (passport)",
    "ビザ": "thị thực (visa)",
    "非常に": "cực kỳ, rất",
    "大変な": "vất vả, khó khăn, kinh khủng"
}

def clean_word(w):
    return w.replace('が・を', '').replace('が', '').replace('を', '').replace('に・を', '').replace('に', '').strip()

# 1. Parse Danh từ (Nouns)
def parse_nouns():
    items = []
    filepath = os.path.join(N3_DIR, "Danh từ.html")
    if not os.path.exists(filepath):
        return items
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    for r in soup.find_all('tr'):
        tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
        if len(tds) >= 4:
            non_empty = [t for t in tds if t]
            if not non_empty or non_empty[0] in ['A', 'B', 'C', 'D']:
                continue
            orig_id = tds[0] if len(tds) > 0 else ''
            word = tds[1] if len(tds) > 1 else ''
            reading = tds[3] if len(tds) > 3 else ''
            hanviet = tds[4] if len(tds) > 4 else ''
            meaning = tds[5] if len(tds) > 5 else ''
            example = tds[6] if len(tds) > 6 else ''
            if not word and reading:
                word = reading
            if not word or word == 'Kanji':
                continue
            
            clean_w = clean_word(word)
            if not meaning:
                meaning = FALLBACK_MEANINGS.get(clean_w, '')
            if not meaning and hanviet:
                meaning = hanviet.capitalize()
                
            items.append({
                "id": len(items) + 1,
                "orig_id": orig_id,
                "hanzi": word,
                "pinyin": reading or word,
                "hanviet": hanviet,
                "meaning": meaning,
                "example_zh": example,
                "example_py": "",
                "example_vi": "",
                "pos": { "code": "noun", "label": "Danh từ", "en": "Noun", "full": "Danh từ N3" }
            })
    return items

# 2. Parse Động từ (Verbs)
def parse_verbs():
    items = []
    filepath = os.path.join(N3_DIR, "Động từ 2.html")
    if not os.path.exists(filepath):
        return items
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    for r in soup.find_all('tr'):
        tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
        non_empty = [t for t in tds if t]
        if not non_empty or non_empty[0] in ['A', 'B', 'C', 'D']:
            continue
        orig_id = tds[0] if len(tds) > 0 else ''
        word = tds[1] if len(tds) > 1 else ''
        reading = tds[3] if len(tds) > 3 else ''
        col4 = tds[4] if len(tds) > 4 else ''
        col5 = tds[5] if len(tds) > 5 else ''
        example = ' '.join([tds[i] for i in range(6, len(tds)) if tds[i]])
        
        if not word or word in ['Kanji', 'A']:
            continue
            
        hanviet = ''
        meaning = ''
        if col4 == col4.upper() and any(c in 'AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXY' for c in col4) and not any(k in col4 for k in ['色', '味', '・', '…']):
            hanviet = col4
            meaning = col5
        else:
            meaning = col4
            hanviet = ''
            
        clean_w = clean_word(word)
        if not meaning:
            meaning = FALLBACK_MEANINGS.get(clean_w, '')
        if not meaning and hanviet:
            meaning = hanviet.capitalize()
            
        items.append({
            "id": len(items) + 1,
            "orig_id": orig_id,
            "hanzi": word,
            "pinyin": reading or clean_w,
            "hanviet": hanviet,
            "meaning": meaning,
            "example_zh": example,
            "example_py": "",
            "example_vi": "",
            "pos": { "code": "verb", "label": "Động từ", "en": "Verb", "full": "Động từ N3" }
        })
    return items

# 3. Parse Tính từ (Adjectives)
def parse_adjectives():
    items = []
    filepath = os.path.join(N3_DIR, "Tính từ .html")
    if not os.path.exists(filepath):
        return items
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    for r in soup.find_all('tr'):
        tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
        non_empty = [t for t in tds if t]
        if not non_empty or non_empty[0] in ['A', 'B', 'C', 'D']:
            continue
        orig_id = ''
        idx = 0
        if non_empty[0].isdigit():
            orig_id = non_empty[0]
            idx = 1
        if idx >= len(non_empty):
            continue
        word = non_empty[idx]
        idx += 1
        
        reading = ''
        hanviet = ''
        meaning = ''
        example = ''
        
        for rest in non_empty[idx:]:
            if rest == rest.upper() and any(c in 'AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXY' for c in rest) and len(rest) < 20 and not any(x in rest for x in ['色', '味', '・', '…']):
                hanviet = rest
            elif is_kana_only(rest) and not reading:
                reading = rest
            elif any(c in rest for c in ['・', '…', '。', '、']) or len(rest) > 20:
                example = (example + ' ' + rest).strip()
            else:
                if not meaning:
                    meaning = rest
                else:
                    example = (example + ' ' + rest).strip()
                    
        clean_w = clean_word(word)
        if not meaning:
            meaning = FALLBACK_MEANINGS.get(clean_w, '')
        if not meaning and hanviet:
            meaning = hanviet.capitalize()
            
        items.append({
            "id": len(items) + 1,
            "orig_id": orig_id,
            "hanzi": word,
            "pinyin": reading or clean_w,
            "hanviet": hanviet,
            "meaning": meaning,
            "example_zh": example,
            "example_py": "",
            "example_vi": "",
            "pos": { "code": "adj", "label": "Tính từ", "en": "Adjective", "full": "Tính từ N3" }
        })
    return items

# 4. Parse Phó từ & Liên từ (Adverbs & Conjunctions)
def parse_adverbs():
    items = []
    filepath = os.path.join(N3_DIR, "Phó từ.html")
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        for r in soup.find_all('tr'):
            tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
            non_empty = [t for t in tds if t]
            if not non_empty or non_empty[0] in ['A', 'B', 'C', 'D']:
                continue
            orig_id = ''
            idx = 0
            if non_empty[0].isdigit():
                orig_id = non_empty[0]
                idx = 1
            if idx >= len(non_empty):
                continue
            word = non_empty[idx]
            idx += 1
            
            reading = ''
            m = re.match(r'^([^\(（]+)[\(（]([^\)）]+)[\)）]$', word)
            if m:
                word = m.group(1).strip()
                reading = m.group(2).strip()
                
            hanviet = ''
            meaning = ''
            example = ''
            
            for rest in non_empty[idx:]:
                if re.match(r'^[A-ZÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ\s]+(\([^\)]+\))?$', rest) and len(rest) < 40 and not any(k in rest for k in ['。', '・', '…']):
                    if '(' in rest:
                        hv_part = rest.split('(')[0].strip()
                        m_part = rest.split('(')[1].rstrip(')').strip()
                        hanviet = hv_part
                        if not meaning:
                            meaning = m_part
                    else:
                        hanviet = rest
                elif is_kana_only(rest) and not reading:
                    reading = rest
                elif any(k in rest for k in ['。', '…', '「', '」']) or len(rest) > 25:
                    example = (example + ' ' + rest).strip()
                else:
                    if not meaning:
                        meaning = rest
                    else:
                        example = (example + ' ' + rest).strip()
                        
            clean_w = clean_word(word)
            if not meaning:
                meaning = FALLBACK_MEANINGS.get(clean_w, '')
            if not meaning and hanviet:
                meaning = hanviet.capitalize()
                
            items.append({
                "id": len(items) + 1,
                "orig_id": orig_id,
                "hanzi": word,
                "pinyin": reading or clean_w,
                "hanviet": hanviet,
                "meaning": meaning,
                "example_zh": example,
                "example_py": "",
                "example_vi": "",
                "pos": { "code": "adv", "label": "Phó từ", "en": "Adverb", "full": "Phó từ N3" }
            })
            
    # Also parse Liên từ (Conjunctions)
    conj_path = os.path.join(N3_DIR, "Liên từ.html")
    if os.path.exists(conj_path):
        current_cat = "Liên từ"
        with open(conj_path, 'r', encoding='utf-8', errors='ignore') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        for r in soup.find_all('tr'):
            tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
            non_empty = [t for t in tds if t]
            if not non_empty or non_empty[0] in ['A', 'B']:
                continue
            if len(non_empty) == 1 and any(cat in non_empty[0] for cat in ['Trái ngược', 'Nguyên nhân', 'Bổ sung', 'Lấy ví dụ', 'Đổi chủ đề', 'Ý kiến']):
                current_cat = non_empty[0]
                continue
            word = non_empty[0]
            desc = non_empty[1] if len(non_empty) > 1 else current_cat
            items.append({
                "id": len(items) + 1,
                "orig_id": "",
                "hanzi": word,
                "pinyin": word,
                "hanviet": "",
                "meaning": f"[{current_cat}] {desc}",
                "example_zh": "",
                "example_py": "",
                "example_vi": "",
                "pos": { "code": "conj", "label": "Liên từ", "en": "Conjunction", "full": "Liên từ N3" }
            })
    return items

# 5. Parse Katakana
def parse_katakana():
    items = []
    filepath = os.path.join(N3_DIR, "かたかな.html")
    if not os.path.exists(filepath):
        return items
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    for r in soup.find_all('tr'):
        tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
        non_empty = [t for t in tds if t]
        if not non_empty or non_empty[0] in ['A', 'B', 'C', 'D']:
            continue
        orig_id = ''
        idx = 0
        if non_empty[0].isdigit():
            orig_id = non_empty[0]
            idx = 1
        if idx >= len(non_empty):
            continue
        word = non_empty[idx]
        idx += 1
        
        meaning = ''
        example = ''
        for rest in non_empty[idx:]:
            if any(k in rest for k in ['～', '＝', '…', '。']):
                example = (example + ' ' + rest).strip()
            elif not meaning:
                meaning = rest
            else:
                example = (example + ' ' + rest).strip()
                
        if not meaning:
            meaning = FALLBACK_MEANINGS.get(word, '')
            
        items.append({
            "id": len(items) + 1,
            "orig_id": orig_id,
            "hanzi": word,
            "pinyin": word,
            "hanviet": "",
            "meaning": meaning or word,
            "example_zh": example,
            "example_py": "",
            "example_vi": "",
            "pos": { "code": "noun", "label": "Katakana", "en": "Loanword", "full": "Từ vựng Katakana" }
        })
    return items

# 6. Parse Kanji Minna
def parse_kanji_minna():
    items = []
    filepath = os.path.join(N3_DIR, "Kanji Minna.html")
    if not os.path.exists(filepath):
        return items
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    for r in soup.find_all('tr'):
        tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
        non_empty = [t for t in tds if t]
        if not non_empty or non_empty[0] in ['A', 'B', 'C', 'Kanji']:
            continue
        # Expected: [id, kanji, reading, hanviet, viet]
        if len(non_empty) >= 4 and non_empty[0].isdigit():
            orig_id = non_empty[0]
            word = non_empty[1]
            reading = non_empty[2]
            hanviet = non_empty[3]
            meaning = non_empty[4] if len(non_empty) > 4 else hanviet.capitalize()
            items.append({
                "id": len(items) + 1,
                "orig_id": orig_id,
                "hanzi": word,
                "pinyin": reading,
                "hanviet": hanviet,
                "meaning": meaning,
                "example_zh": "",
                "example_py": "",
                "example_vi": "",
                "pos": { "code": "noun", "label": "Kanji", "en": "Kanji", "full": "Hán tự Minna N3" }
            })
    return items

# 7. Parse Kanji tổng hợp (漢字.html)
def parse_kanji_all():
    items = []
    filepath = os.path.join(N3_DIR, "漢字.html")
    if not os.path.exists(filepath):
        return items
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    for r in soup.find_all('tr'):
        tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
        non_empty = [t for t in tds if t]
        if not non_empty or non_empty[0] in ['A', 'B', 'C']:
            continue
        orig_id = ''
        idx = 0
        if non_empty[0].isdigit():
            orig_id = non_empty[0]
            idx = 1
        if idx >= len(non_empty):
            continue
        word = non_empty[idx]
        idx += 1
        
        reading = ''
        hanviet = ''
        meaning = ''
        examples = []
        for rest in non_empty[idx:]:
            if rest == rest.upper() and any(c in 'AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXY' for c in rest) and len(rest) < 25:
                hanviet = rest
            elif is_kana_only(rest) and not reading:
                reading = rest
            elif re.search(r'[a-zA-Zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]', rest) and not meaning:
                meaning = rest
            else:
                examples.append(rest)
                
        if not meaning:
            meaning = FALLBACK_MEANINGS.get(word, '')
        if not meaning and hanviet:
            meaning = hanviet.capitalize()
        if not meaning and examples:
            meaning = " / ".join(examples)
            examples = []
            
        items.append({
            "id": len(items) + 1,
            "orig_id": orig_id,
            "hanzi": word,
            "pinyin": reading or word,
            "hanviet": hanviet,
            "meaning": meaning or word,
            "example_zh": " · ".join(examples),
            "example_py": "",
            "example_vi": "",
            "pos": { "code": "noun", "label": "Kanji", "en": "Kanji", "full": "Kanji & Từ ghép N3" }
        })
    return items

# 8. Parse Ngữ pháp Shin Kanzen (新完全.html)
def parse_grammar_skz():
    items = []
    filepath = os.path.join(N3_DIR, "新完全.html")
    if not os.path.exists(filepath):
        return items
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    current_group = "Thời gian"
    for r in soup.find_all('tr'):
        tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
        non_empty = [t for t in tds if t]
        if not non_empty or non_empty[0] in ['A', 'B', 'C', 'D']:
            continue
        if len(non_empty) == 1 and any(k in non_empty[0] for k in ['１）', '２）', '３）', '４）', '５）', '６）', '７）', '８）', '９）']):
            current_group = non_empty[0]
            continue
        # Extract pattern, meaning, example
        orig_id = ''
        idx = 0
        if non_empty[0].isdigit():
            orig_id = non_empty[0]
            idx = 1
        if idx >= len(non_empty):
            continue
        pattern = non_empty[idx]
        idx += 1
        meaning = non_empty[idx] if idx < len(non_empty) else ''
        idx += 1
        example = ' '.join(non_empty[idx:]) if idx < len(non_empty) else ''
        
        items.append({
            "id": len(items) + 1,
            "orig_id": orig_id,
            "hanzi": pattern,
            "pinyin": f"[{current_group}] Ngữ pháp N3",
            "hanviet": "",
            "meaning": meaning or f"Ngữ pháp {pattern}",
            "example_zh": example,
            "example_py": "",
            "example_vi": "",
            "pos": { "code": "particle", "label": "Ngữ pháp", "en": "Grammar", "full": "Shinkanzen Master N3" }
        })
    return items

# 9. Parse Ngữ pháp Mimi kara Oboeru (NP 耳から覚える.html)
def parse_grammar_mimi():
    items = []
    filepath = os.path.join(N3_DIR, "NP 耳から覚える.html")
    if not os.path.exists(filepath):
        return items
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    for r in soup.find_all('tr'):
        tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
        non_empty = [t for t in tds if t]
        if not non_empty or non_empty[0] in ['A', 'B', 'C', 'D']:
            continue
        orig_id = ''
        idx = 0
        if non_empty[0].isdigit():
            orig_id = non_empty[0]
            idx = 1
        if idx >= len(non_empty):
            continue
        pattern = non_empty[idx]
        idx += 1
        meaning = non_empty[idx] if idx < len(non_empty) else ''
        idx += 1
        example = ' '.join(non_empty[idx:]) if idx < len(non_empty) else ''
        
        items.append({
            "id": len(items) + 1,
            "orig_id": orig_id,
            "hanzi": pattern,
            "pinyin": "Ngữ pháp Mimi kara N3",
            "hanviet": "",
            "meaning": meaning or f"Ngữ pháp {pattern}",
            "example_zh": example,
            "example_py": "",
            "example_vi": "",
            "pos": { "code": "particle", "label": "Ngữ pháp", "en": "Grammar", "full": "Mimi kara Oboeru N3" }
        })
    return items

# 10. Parse Ngữ pháp Minna (NGỮ PHÁP.html & NP Minna .html)
def parse_grammar_minna():
    items = []
    for fname in ["NGỮ PHÁP.html", "NP Minna .html"]:
        filepath = os.path.join(N3_DIR, fname)
        if not os.path.exists(filepath):
            continue
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        current_lesson = "Bài 7"
        for r in soup.find_all('tr'):
            tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
            non_empty = [t for t in tds if t]
            if not non_empty or non_empty[0] in ['A', 'B', 'C', 'D', 'NGỮ PHÁP']:
                continue
            if any('BÀI' in non_empty[i].upper() for i in range(len(non_empty))):
                current_lesson = non_empty[0]
                continue
            orig_id = ''
            idx = 0
            if non_empty[0].isdigit():
                orig_id = non_empty[0]
                idx = 1
            if idx >= len(non_empty):
                continue
            pattern = non_empty[idx]
            idx += 1
            meaning = non_empty[idx] if idx < len(non_empty) else ''
            idx += 1
            example = ' '.join(non_empty[idx:]) if idx < len(non_empty) else ''
            
            items.append({
                "id": len(items) + 1,
                "orig_id": orig_id,
                "hanzi": pattern,
                "pinyin": f"[{current_lesson}] Minna Trung cấp",
                "hanviet": "",
                "meaning": meaning or f"Ngữ pháp {pattern}",
                "example_zh": example,
                "example_py": "",
                "example_vi": "",
                "pos": { "code": "particle", "label": "Ngữ pháp", "en": "Grammar", "full": "Minna no Nihongo N3" }
            })
    return items

# 11. Parse Choukai & Đọc hiểu (潮解.html, 話す聞く.html, 読解.html, Minna mondai nghe.html)
def parse_reading_listening():
    items = []
    # 潮解
    filepath = os.path.join(N3_DIR, "潮解.html")
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        for r in soup.find_all('tr'):
            tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
            non_empty = [t for t in tds if t]
            if not non_empty or non_empty[0] in ['A', 'B', 'C', 'D', '問題４']:
                continue
            topic = non_empty[0]
            phrase = non_empty[1] if len(non_empty) > 1 else topic
            ex = ' '.join(non_empty[2:]) if len(non_empty) > 2 else ''
            items.append({
                "id": len(items) + 1,
                "orig_id": "",
                "hanzi": phrase,
                "pinyin": "[Choukai] Nghe hiểu & Hội thoại",
                "hanviet": "",
                "meaning": topic,
                "example_zh": ex,
                "example_py": "",
                "example_vi": "",
                "pos": { "code": "phrase", "label": "Giao tiếp", "en": "Phrase", "full": "Hội thoại & Nghe hiểu" }
            })
            
    # 話す聞く
    filepath = os.path.join(N3_DIR, "話す聞く.html")
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        for r in soup.find_all('tr'):
            tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
            non_empty = [t for t in tds if t]
            if not non_empty or non_empty[0] in ['A', 'B', 'C', 'D']:
                continue
            word = non_empty[0]
            note = ' '.join(non_empty[1:]) if len(non_empty) > 1 else ''
            items.append({
                "id": len(items) + 1,
                "orig_id": "",
                "hanzi": word,
                "pinyin": "Hội thoại nghe nói",
                "hanviet": "",
                "meaning": note or "Mẫu câu giao tiếp",
                "example_zh": "",
                "example_py": "",
                "example_vi": "",
                "pos": { "code": "phrase", "label": "Giao tiếp", "en": "Phrase", "full": "Hội thoại nghe nói" }
            })
            
    # 読解
    filepath = os.path.join(N3_DIR, "読解.html")
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        for r in soup.find_all('tr'):
            tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
            non_empty = [t for t in tds if t]
            if not non_empty or non_empty[0] in ['A', 'B', 'C', 'D']:
                continue
            q = non_empty[0]
            ans = ' '.join(non_empty[1:]) if len(non_empty) > 1 else ''
            items.append({
                "id": len(items) + 1,
                "orig_id": "",
                "hanzi": q,
                "pinyin": "[Đọc hiểu Dokkai]",
                "hanviet": "",
                "meaning": ans or "Kỹ năng đọc hiểu N3",
                "example_zh": "",
                "example_py": "",
                "example_vi": "",
                "pos": { "code": "phrase", "label": "Đọc hiểu", "en": "Reading", "full": "Đọc hiểu N3" }
            })
    return items

# 12. Parse Exam Practice (GOI.html, Mondai 1-5.html, Mondai NP.html, Trang tính21.html)
def parse_exam_practice():
    items = []
    # GOI.html
    filepath = os.path.join(N3_DIR, "GOI.html")
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        for r in soup.find_all('tr'):
            tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
            non_empty = [t for t in tds if t]
            if not non_empty or non_empty[0] in ['A', 'B', 'C', 'D'] or '－' in non_empty[0]:
                continue
            question = non_empty[0]
            choices = non_empty[1] if len(non_empty) > 1 else ''
            items.append({
                "id": len(items) + 1,
                "orig_id": "",
                "hanzi": question,
                "pinyin": "Luyện đề Từ vựng (GOI)",
                "hanviet": "",
                "meaning": choices,
                "example_zh": "",
                "example_py": "",
                "example_vi": "",
                "pos": { "code": "phrase", "label": "Đề thi", "en": "Exam", "full": "Luyện đề JLPT N3" }
            })
            
    # Mondai 1-5.html
    filepath = os.path.join(N3_DIR, "Mondai 1-5.html")
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        for r in soup.find_all('tr'):
            tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
            non_empty = [t for t in tds if t]
            if not non_empty or non_empty[0] in ['A', 'B', 'C', 'D'] or '/' in non_empty[0]:
                continue
            w = non_empty[0]
            reading = non_empty[1] if len(non_empty) > 1 else w
            ex = ' '.join(non_empty[2:]) if len(non_empty) > 2 else ''
            items.append({
                "id": len(items) + 1,
                "orig_id": "",
                "hanzi": w,
                "pinyin": reading,
                "hanviet": "",
                "meaning": FALLBACK_MEANINGS.get(w, reading),
                "example_zh": ex,
                "example_py": "",
                "example_vi": "",
                "pos": { "code": "noun", "label": "Mondai", "en": "Exam", "full": "Đề thi Mondai 1-5" }
            })
            
    # Trang tính21 (Sentences)
    filepath = os.path.join(N3_DIR, "Trang tính21.html")
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        for r in soup.find_all('tr'):
            tds = [clean_txt(td.get_text(separator=' ', strip=True)) for td in r.find_all('td')]
            non_empty = [t for t in tds if t]
            if not non_empty or non_empty[0] in ['A', 'B', 'C', 'D']:
                continue
            s = non_empty[0]
            items.append({
                "id": len(items) + 1,
                "orig_id": "",
                "hanzi": s,
                "pinyin": "Câu mẫu thực hành N3",
                "hanviet": "",
                "meaning": "Luyện đọc & hiểu câu dài",
                "example_zh": s,
                "example_py": "",
                "example_vi": "",
                "pos": { "code": "phrase", "label": "Câu mẫu", "en": "Sentence", "full": "Câu mẫu thực hành N3" }
            })
    return items

def main():
    print("Parsing N3 data...")
    nouns = parse_nouns()
    verbs = parse_verbs()
    adjectives = parse_adjectives()
    adverbs = parse_adverbs()
    katakana = parse_katakana()
    kanji_minna = parse_kanji_minna()
    kanji_all = parse_kanji_all()
    grammar_skz = parse_grammar_skz()
    grammar_mimi = parse_grammar_mimi()
    grammar_minna = parse_grammar_minna()
    reading_listening = parse_reading_listening()
    exam_practice = parse_exam_practice()
    
    # Combined N3 Core Vocabulary:
    # Verbs + Nouns + Adjectives + Adverbs + Katakana + Kanji Minna
    combined_vocab = []
    seen_words = set()
    for item in (verbs + nouns + adjectives + adverbs + katakana + kanji_minna):
        key = item['hanzi']
        if key not in seen_words:
            seen_words.add(key)
            new_item = dict(item)
            new_item['id'] = len(combined_vocab) + 1
            combined_vocab.append(new_item)
            
    datasets = {
        "n3_all.json": combined_vocab,
        "n3_verbs.json": verbs,
        "n3_nouns.json": nouns,
        "n3_adjectives.json": adjectives,
        "n3_adverbs.json": adverbs,
        "n3_katakana.json": katakana,
        "n3_kanji_minna.json": kanji_minna,
        "n3_kanji_all.json": kanji_all,
        "n3_grammar_skz.json": grammar_skz,
        "n3_grammar_mimi.json": grammar_mimi,
        "n3_grammar_minna.json": grammar_minna,
        "n3_reading_listening.json": reading_listening,
        "n3_exam_practice.json": exam_practice
    }
    
    print("\nWriting JSON datasets:")
    for fname, data in datasets.items():
        outpath = os.path.join(OUTPUT_DIR, fname)
        with open(outpath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"  {fname:25}: {len(data):4} entries -> {outpath}")
        
    print("\nDone! Database built successfully.")

if __name__ == "__main__":
    main()
