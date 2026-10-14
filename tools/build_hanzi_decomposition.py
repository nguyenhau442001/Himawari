#!/usr/bin/env python3
"""Build Hanzi radical and character decomposition database for all HSK words.

Sources:
1. Makemeahanzi character dictionary & stroke-component match trees
2. Kangxi 214 radicals database (database/radicals/kangxi_214_radicals)
3. Basic 50 radicals database (database/radicals/basic_50_radicals)
4. Sino-Vietnamese dictionary (assets/js/hanviet-dict.js)
5. HSK 1-6 and HSK 3.0 vocabulary definitions (database/vocabs)
"""

import glob
import json
import os
from pathlib import Path
import re
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
RADICALS_DIR = ROOT / 'database/radicals'
KANGXI_DIR = RADICALS_DIR / 'kangxi_214_radicals'
VOCAB_DIR = ROOT / 'database/vocabs'
OUTPUT_FILE = RADICALS_DIR / 'hanzi_decompositions.json'
CACHE_DICT = ROOT / '.cache/makemeahanzi_dictionary.txt'

BINARY_IDC = set('⿰⿱⿴⿵⿶⿷⿸⿹⿺⿻')
TERNARY_IDC = set('⿲⿳')

STRUCTURE_NAMES = {
    '⿰': {'name': 'Trái - Phải', 'type': 'Tả hữu', 'desc': 'Hai phần song song xếp ngang từ trái sang phải'},
    '⿱': {'name': 'Trên - Dưới', 'type': 'Thượng hạ', 'desc': 'Hai phần xếp chồng từ trên xuống dưới'},
    '⿲': {'name': 'Trái - Giữa - Phải', 'type': 'Tả trung hữu', 'desc': 'Ba phần song song từ trái sang phải'},
    '⿳': {'name': 'Trên - Giữa - Dưới', 'type': 'Thượng trung hạ', 'desc': 'Ba tầng xếp chồng từ trên xuống dưới'},
    '⿴': {'name': 'Bao quanh toàn bộ', 'type': 'Toàn bao vi', 'desc': 'Khung ngoài khép kín bao quanh phần bên trong'},
    '⿵': {'name': 'Bao quanh từ trên xuống', 'type': 'Thượng bao hạ', 'desc': 'Bao quanh đỉnh và hai bên, hở đáy'},
    '⿶': {'name': 'Bao quanh từ dưới lên', 'type': 'Hạ bao thượng', 'desc': 'Bao quanh đáy và hai bên, hở đỉnh'},
    '⿷': {'name': 'Bao quanh từ bên trái', 'type': 'Tả bao hữu', 'desc': 'Bao quanh bên trái, trên và dưới, hở phải'},
    '⿸': {'name': 'Bao quanh góc trên trái', 'type': 'Tả thượng bao', 'desc': 'Khung góc trên trái ôm lấy góc dưới phải'},
    '⿹': {'name': 'Bao quanh góc trên phải', 'type': 'Hữu thượng bao', 'desc': 'Khung góc trên phải ôm lấy góc dưới trái'},
    '⿺': {'name': 'Bao quanh góc dưới trái', 'type': 'Tả hạ bao', 'desc': 'Khung góc dưới trái nâng đỡ phần bên trong'},
    '⿻': {'name': 'Đan xen lồng nhau', 'type': 'Khảm hiệp', 'desc': 'Các nét đan cài vào nhau thành một khối'},
}

RADICAL_ALIASES = {
    '⺼': '肉', '⺗': '心', '⺳': '网', '⺌': '小', '西': '襾', '覀': '襾',
    '户': '戶', '川': '巛', '母': '毋', '虎': '虍', '⺀': '冫', '氺': '水',
    '⺊': '卜', '㔾': '卩', '肀': '聿', '乚': '乙', '乛': '乙', '巳': '己',
    '丷': '八', '刁': '刀', '兀': '儿', '旡': '无', '民': '氏', '⺅': '人',
    '⺡': '水', '⺘': '手', '⺨': '犬', '⺾': '艸', '艹': '艸', '⻓': '長',
    '⻔': '門', '⻉': '貝', '⻋': '車', '⻢': '馬', '⻦': '鳥', '⻥': '魚',
    '饣': '食', '纟': '糸', '讠': '言', '钅': '金', '礻': '示', '衤': '衣'
}

COMMON_COMPONENT_NAMES = {
    '不': {'name': 'Bất', 'meaning': 'không, chẳng', 'hanviet': 'Bất', 'pinyin': 'bù'},
    '乞': {'name': 'Khất', 'meaning': 'xin, cầu xin', 'hanviet': 'Khất', 'pinyin': 'qǐ'},
    '反': {'name': 'Phản', 'meaning': 'ngược lại, quay lại', 'hanviet': 'Phản', 'pinyin': 'fǎn'},
    '兑': {'name': 'Đoái', 'meaning': 'vui vẻ, quẻ Đoái', 'hanviet': 'Đoái', 'pinyin': 'duì'},
    '射': {'name': 'Xạ', 'meaning': 'bắn tên, phóng ra', 'hanviet': 'Xạ', 'pinyin': 'shè'},
    '故': {'name': 'Cố', 'meaning': 'cũ, duyên cớ', 'hanviet': 'Cố', 'pinyin': 'gù'},
    '尔': {'name': 'Nhĩ', 'meaning': 'ngươi, bạn, ấy', 'hanviet': 'Nhĩ', 'pinyin': 'ěr'},
    '古': {'name': 'Cổ', 'meaning': 'cổ xưa, thời xưa', 'hanviet': 'Cổ', 'pinyin': 'gǔ'},
    '相': {'name': 'Tương/Tướng', 'meaning': 'cùng nhau, xem xét', 'hanviet': 'Tương', 'pinyin': 'xiāng'},
    '巴': {'name': 'Ba', 'meaning': 'mong mỏi, bám vào', 'hanviet': 'Ba', 'pinyin': 'bā'},
    '丁': {'name': 'Đinh', 'meaning': 'đinh, tráng đinh', 'hanviet': 'Đinh', 'pinyin': 'dīng'},
    '可': {'name': 'Khả', 'meaning': 'có thể, khen ngợi', 'hanviet': 'Khả', 'pinyin': 'kě'},
    '也': {'name': 'Dã', 'meaning': 'cũng, vậy', 'hanviet': 'Dã', 'pinyin': 'yě'},
    '包': {'name': 'Bao', 'meaning': 'gói, bao bọc', 'hanviet': 'Bao', 'pinyin': 'bāo'},
    '分': {'name': 'Phân', 'meaning': 'chia ra, phân chia', 'hanviet': 'Phân', 'pinyin': 'fēn'},
    '交': {'name': 'Giao', 'meaning': 'giao tiếp, cắt nhau', 'hanviet': 'Giao', 'pinyin': 'jiāo'},
    '正': {'name': 'Chính', 'meaning': 'ngay thẳng, chính trực', 'hanviet': 'Chính', 'pinyin': 'zhèng'},
    '平': {'name': 'Bình', 'meaning': 'bằng phẳng, yên ổn', 'hanviet': 'Bình', 'pinyin': 'píng'},
    '央': {'name': 'Ương', 'meaning': 'ở giữa, trung ương', 'hanviet': 'Ương', 'pinyin': 'yāng'},
    '及': {'name': 'Cập', 'meaning': 'kịp, đến, và', 'hanviet': 'Cập', 'pinyin': 'jí'},
    '成': {'name': 'Thành', 'meaning': 'hoàn thành, trở thành', 'hanviet': 'Thành', 'pinyin': 'chéng'},
    '元': {'name': 'Nguyên', 'meaning': 'đầu tiên, nguồn gốc', 'hanviet': 'Nguyên', 'pinyin': 'yuán'},
    '井': {'name': 'Tỉnh', 'meaning': 'giếng nước, ngăn nắp', 'hanviet': 'Tỉnh', 'pinyin': 'jǐng'},
    '寸': {'name': 'Bộ Thốn', 'meaning': 'tấc, gang tay, mực thước', 'hanviet': 'Thốn', 'pinyin': 'cùn'},
    '身': {'name': 'Bộ Thân', 'meaning': 'thân mình, cơ thể', 'hanviet': 'Thân', 'pinyin': 'shēn'},
    '舌': {'name': 'Bộ Thiệt', 'meaning': 'cái lưỡi', 'hanviet': 'Thiệt', 'pinyin': 'shé'},
    '斤': {'name': 'Bộ Cân', 'meaning': 'cái búa rìu; cân (đo lường)', 'hanviet': 'Cân', 'pinyin': 'jīn'},
    '豕': {'name': 'Bộ Thỉ', 'meaning': 'con lợn, con heo', 'hanviet': 'Thỉ', 'pinyin': 'shǐ'},
    '宀': {'name': 'Bộ Miên', 'meaning': 'mái nhà', 'hanviet': 'Miên', 'pinyin': 'mián'},
    '辶': {'name': 'Bộ Sước (Xước)', 'meaning': 'đi lại, chuyển động, con đường', 'hanviet': 'Sước', 'pinyin': 'chuò'},
    '亻': {'name': 'Bộ Nhân đứng', 'meaning': 'con người', 'hanviet': 'Nhân', 'pinyin': 'rén'},
    '氵': {'name': 'Bộ Ba chấm thủy', 'meaning': 'nước, dòng chảy, chất lỏng', 'hanviet': 'Thủy', 'pinyin': 'shuǐ'},
    '扌': {'name': 'Bộ Tay gảy (Đề thủ)', 'meaning': 'bàn tay, động tác tay', 'hanviet': 'Thủ', 'pinyin': 'shǒu'},
    '忄': {'name': 'Bộ Tâm đứng', 'meaning': 'trái tim, tình cảm, suy nghĩ', 'hanviet': 'Tâm', 'pinyin': 'xīn'},
    '讠': {'name': 'Bộ Ngôn', 'meaning': 'lời nói, ngôn ngữ', 'hanviet': 'Ngôn', 'pinyin': 'yán'},
    '饣': {'name': 'Bộ Thực', 'meaning': 'thức ăn, ẩm thực', 'hanviet': 'Thực', 'pinyin': 'shí'},
    '纟': {'name': 'Bộ Tơ (Mịch)', 'meaning': 'sợi tơ, sợi dây', 'hanviet': 'Mịch', 'pinyin': 'mì'},
    '钅': {'name': 'Bộ Kim', 'meaning': 'kim loại, vàng', 'hanviet': 'Kim', 'pinyin': 'jīn'},
    '阝': {'name': 'Bộ Phụ / Ấp', 'meaning': 'gò đất (trái) / vùng đất, ấp (phải)', 'hanviet': 'Phụ/Ấp', 'pinyin': 'fù'},
    '犭': {'name': 'Bộ Khuyển (chó)', 'meaning': 'loài thú bốn chân', 'hanviet': 'Khuyển', 'pinyin': 'quǎn'},
    '艹': {'name': 'Bộ Thảo', 'meaning': 'cỏ cây, hoa lá, thực vật', 'hanviet': 'Thảo', 'pinyin': 'cǎo'},
    '⺍': {'name': 'Bộ Quang (ba chấm đầu)', 'meaning': 'tia sáng, phần chóp trên', 'hanviet': 'Quang', 'pinyin': 'guāng'},
    '冖': {'name': 'Bộ Mịch', 'meaning': 'khăn phủ, trùm lên', 'hanviet': 'Mịch', 'pinyin': 'mì'},
}

CURATED_MNEMONICS = {
    '还': 'Dù không muốn (不) vẫn phải cất bước (辶) để trả lại hoặc hoàn lại.',
    '看': 'Đưa bàn tay (手) lên che mắt (目) để phóng tầm mắt nhìn ra xa.',
    '明': 'Ánh sáng của mặt trời (日) cùng mặt trăng (月) hợp lại tạo nên sự sáng rõ, minh bạch.',
    '休': 'Con người (亻) tựa lưng vào thân cây (木) để nghỉ ngơi (hưu).',
    '男': 'Người dùng sức lực (力) cày cấy trên đồng ruộng (田) chính là đàn ông.',
    '好': 'Người phụ nữ (女) sinh được con cái (子) là niềm hạnh phúc, điều tốt đẹp.',
    '信': 'Lời nói (言) của con người (亻) cần phải giữ uy tín, đáng tin cậy.',
    '家': 'Dưới mái nhà (宀) có nuôi đàn lợn (豕) tạo thành gia đình, mái ấm ấm no.',
    '想': 'Mắt nhìn cây để xem xét (相), khắc sâu trong lòng (心) sinh ra suy nghĩ, tưởng nhớ.',
    '谢': 'Lời nói (讠) cảm tạ xuất phát từ một người (身) biết giữ đúng mực thước (寸).',
    '听': 'Lời nói từ miệng (口) lọt vào tai nghe (斤) để lắng nghe và thấu hiểu.',
    '吃': 'Dùng miệng (口) để ăn uống và cầu xin (乞) miếng ăn.',
    '学': 'Dưới mái nhà (冖) có các tia sáng (⺍) soi rọi cho trẻ nhỏ (子) học tập.',
    '字': 'Đứa trẻ (子) ở dưới mái nhà (宀) được dạy dỗ từng con chữ.',
    '话': 'Lời nói (讠) được uốn nắn và phát ra từ đầu lưỡi (舌).',
    '问': 'Đứng ở ngoài cửa (门) dùng miệng (口) cất tiếng hỏi thăm.',
    '国': 'Bao bọc xung quanh (囗) một mảnh ngọc quý (玉) tượng trưng cho quốc gia bờ cõi.',
    '安': 'Dưới mái nhà (宀) có người phụ nữ (女) thì gia đạo êm ấm, bình an.',
    '早': 'Mặt trời (日) mọc nhô lên khỏi vạch đất mười phương (十) báo hiệu buổi sớm.',
    '旦': 'Mặt trời (日) vừa nhô lên khỏi đường chân trời (一) là buổi sớm mai.',
    '森': 'Ba cây (木) đứng cạnh nhau sum suê tạo thành rừng rậm.',
    '林': 'Hai cây (木) đứng cạnh nhau tạo thành rừng cây.',
    '众': 'Ba người (人) cùng đứng chung tạo nên đám đông quần chúng.',
    '从': 'Một người (人) đi theo sau một người (人) là đi theo, tòng phục.',
}

def parse_ids(s):
    if not s or s == '？':
        return None
    pos = 0
    def parse_node():
        nonlocal pos
        if pos >= len(s):
            return None
        ch = s[pos]
        pos += 1
        if ch in BINARY_IDC:
            left = parse_node()
            right = parse_node()
            children = [c for c in [left, right] if c is not None]
            return {'idc': ch, 'children': children}
        elif ch in TERNARY_IDC:
            c1 = parse_node()
            c2 = parse_node()
            c3 = parse_node()
            children = [c for c in [c1, c2, c3] if c is not None]
            return {'idc': ch, 'children': children}
        else:
            return {'char': ch}
    return parse_node()

def get_leaf_by_path(tree, path):
    curr = tree
    for step in path:
        if curr and 'children' in curr and step < len(curr['children']):
            curr = curr['children'][step]
        else:
            return None
    return curr

def load_kangxi_radicals():
    kangxi = {}
    # 1. Load variants first so canonical radicals override them
    for path in sorted(glob.glob(str(KANGXI_DIR / '*.json'))):
        with open(path, 'r', encoding='utf-8') as f:
            for item in json.load(f):
                for v in item.get('variants', []):
                    kangxi[v] = item
    # 2. Canonical radicals take top priority
    for path in sorted(glob.glob(str(KANGXI_DIR / '*.json'))):
        with open(path, 'r', encoding='utf-8') as f:
            for item in json.load(f):
                kangxi[item['radical']] = item
    # 3. Aliases
    for k, v in RADICAL_ALIASES.items():
        if v in kangxi and k not in kangxi:
            kangxi[k] = kangxi[v]
    return kangxi

def load_hanviet():
    dict_file = ROOT / 'assets/js/hanviet-dict.js'
    if not dict_file.exists():
        return {}
    with open(dict_file, 'r', encoding='utf-8') as f:
        content = f.read()
    m = re.search(r'const HANVIET_CHARS\s*=\s*(\{.*?\});', content, re.DOTALL)
    if m:
        try:
            return json.loads(m.group(1))
        except Exception:
            pass
    return {}

def load_vocab_meanings():
    meanings = {}
    pinyins = {}
    files = list(VOCAB_DIR.glob('*.json')) + list((VOCAB_DIR / 'hsk3_0').glob('*.json'))
    for f in files:
        if f.is_file():
            try:
                with open(f, 'r', encoding='utf-8') as fp:
                    data = json.load(fp)
                    if isinstance(data, list):
                        for item in data:
                            hz = item.get('hanzi', '')
                            if len(hz) == 1:
                                if hz not in meanings and item.get('meaning'):
                                    meanings[hz] = item['meaning']
                                if hz not in pinyins and item.get('pinyin'):
                                    pinyins[hz] = item['pinyin']
            except Exception:
                pass
    return meanings, pinyins

def get_all_hsk_characters():
    unique_chars = set()
    files = list(VOCAB_DIR.glob('*.json')) + list((VOCAB_DIR / 'hsk3_0').glob('*.json'))
    for f in files:
        if f.is_file():
            try:
                with open(f, 'r', encoding='utf-8') as fp:
                    data = json.load(fp)
                    if isinstance(data, list):
                        for item in data:
                            hz = item.get('hanzi', '')
                            for c in hz:
                                if '\u4e00' <= c <= '\u9fff':
                                    unique_chars.add(c)
            except Exception:
                pass
    return unique_chars

def get_makemeahanzi_entries():
    CACHE_DICT.parent.mkdir(parents=True, exist_ok=True)
    if not CACHE_DICT.exists():
        print('Downloading makemeahanzi dictionary.txt...')
        url = 'https://raw.githubusercontent.com/skishore/makemeahanzi/master/dictionary.txt'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=60) as resp:
            content = resp.read()
            with open(CACHE_DICT, 'wb') as f:
                f.write(content)
        print('Downloaded dictionary.txt successfully.')
    else:
        print('Using cached dictionary.txt')

    entries = {}
    with open(CACHE_DICT, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    e = json.loads(line)
                    ch = e.get('character')
                    if ch:
                        entries[ch] = e
                except Exception:
                    pass
    return entries

def build_decomposition_database():
    print('Starting character decomposition build...')
    kangxi = load_kangxi_radicals()
    hanviet = load_hanviet()
    vocab_meanings, vocab_pinyins = load_vocab_meanings()
    hsk_chars = get_all_hsk_characters()
    print(f'Total target HSK characters: {len(hsk_chars)}')

    raw_dict = get_makemeahanzi_entries()
    print(f'Total makemeahanzi entries loaded: {len(raw_dict)}')

    database = {}

    for ch in sorted(hsk_chars):
        entry = raw_dict.get(ch)
        if not entry:
            continue

        decomp_str = entry.get('decomposition', '')
        radical_char = entry.get('radical', '')
        matches = entry.get('matches', [])
        pinyin_list = entry.get('pinyin', [])
        char_pinyin = pinyin_list[0] if pinyin_list else vocab_pinyins.get(ch, '')
        char_hv = hanviet.get(ch, '')
        char_meaning = vocab_meanings.get(ch, '')

        # Resolve primary radical info
        rad_info = None
        target_rad = radical_char
        if target_rad in RADICAL_ALIASES:
            target_rad = RADICAL_ALIASES[target_rad]
        kangxi_rad = kangxi.get(radical_char) or kangxi.get(target_rad)

        if kangxi_rad:
            rad_info = {
                'char': radical_char,
                'canonical': kangxi_rad.get('radical', radical_char),
                'kangxi_id': kangxi_rad.get('id', 0),
                'name': kangxi_rad.get('name', f'Bộ {radical_char}'),
                'meaning': kangxi_rad.get('meaning', ''),
                'pinyin': kangxi_rad.get('pinyin', ''),
                'hanviet': hanviet.get(radical_char, hanviet.get(kangxi_rad.get('radical', ''), '')),
                'stroke_count': kangxi_rad.get('stroke_count', 0)
            }
        elif radical_char:
            rad_info = {
                'char': radical_char,
                'canonical': radical_char,
                'kangxi_id': 0,
                'name': f'Bộ {hanviet.get(radical_char, radical_char)}',
                'meaning': vocab_meanings.get(radical_char, ''),
                'pinyin': vocab_pinyins.get(radical_char, ''),
                'hanviet': hanviet.get(radical_char, ''),
                'stroke_count': 0
            }

        # Parse structure
        tree = parse_ids(decomp_str)
        is_single_body = tree is None or 'idc' not in tree
        structure_idc = tree['idc'] if (tree and 'idc' in tree) else ''
        struct_meta = STRUCTURE_NAMES.get(structure_idc, {
            'name': 'Độc thể tự (Chữ đơn nguyên khối)' if is_single_body else 'Hợp thể tự',
            'type': 'Độc thể' if is_single_body else 'Hợp thể',
            'desc': 'Chữ hình thành từ một khối nét hoàn chỉnh độc lập' if is_single_body else 'Chữ cấu tạo từ nhiều bộ phận ghép lại'
        })

        # Match strokes to leaf nodes
        leaf_stroke_map = {}
        if tree and matches:
            for s_idx, m in enumerate(matches):
                if m is not None:
                    leaf = get_leaf_by_path(tree, m)
                    if leaf and 'char' in leaf:
                        c = leaf['char']
                        leaf_id = id(leaf)
                        if leaf_id not in leaf_stroke_map:
                            leaf_stroke_map[leaf_id] = {'char': c, 'strokes': []}
                        leaf_stroke_map[leaf_id]['strokes'].append(s_idx)

        # Collect components
        components = []
        if is_single_body:
            components.append({
                'char': ch,
                'name': rad_info['name'] if rad_info else f'Chữ {char_hv or ch}',
                'meaning': rad_info['meaning'] if rad_info else char_meaning,
                'pinyin': char_pinyin,
                'hanviet': char_hv,
                'stroke_count': len(matches),
                'stroke_indices': list(range(len(matches))),
                'is_radical': bool(kangxi_rad),
                'kangxi_id': kangxi_rad.get('id', 0) if kangxi_rad else 0
            })
        else:
            def extract_leaves(node):
                if not node:
                    return []
                if 'char' in node:
                    return [node]
                res = []
                for child in node.get('children', []):
                    res.extend(extract_leaves(child))
                return res

            leaves = extract_leaves(tree)
            for leaf in leaves:
                comp_char = leaf.get('char', '')
                if not comp_char or comp_char in '？':
                    continue
                strokes = leaf_stroke_map.get(id(leaf), {}).get('strokes', [])
                
                k_info = kangxi.get(comp_char) or kangxi.get(RADICAL_ALIASES.get(comp_char, ''))
                override = COMMON_COMPONENT_NAMES.get(comp_char, {})

                comp_name = ''
                comp_meaning = ''
                comp_py = override.get('pinyin') or vocab_pinyins.get(comp_char, '')
                comp_hv = override.get('hanviet') or hanviet.get(comp_char, '')

                if k_info:
                    comp_name = k_info.get('name', f'Bộ {comp_hv or comp_char}')
                    comp_meaning = k_info.get('meaning', '')
                    if not comp_py:
                        comp_py = k_info.get('pinyin', '')
                    if not comp_hv:
                        comp_hv = hanviet.get(k_info.get('radical', ''), '')
                elif override:
                    comp_name = override.get('name', f'Bộ {comp_hv or comp_char}')
                    comp_meaning = override.get('meaning', '')
                else:
                    comp_name = f'Bộ {comp_hv}' if comp_hv else comp_char
                    comp_meaning = vocab_meanings.get(comp_char, '')

                components.append({
                    'char': comp_char,
                    'name': comp_name,
                    'meaning': comp_meaning,
                    'pinyin': comp_py,
                    'hanviet': comp_hv,
                    'stroke_count': len(strokes),
                    'stroke_indices': sorted(strokes),
                    'is_radical': bool(k_info),
                    'kangxi_id': k_info.get('id', 0) if k_info else 0
                })

        # Generate equation / formula
        if is_single_body:
            formula = f'{ch} là Độc thể tự (Chữ đơn nguyên bản)'
        else:
            comp_strs = [f'{c["char"]} ({c["name"].replace("Bộ ", "")})' for c in components]
            formula = f'{ch} = {" + ".join(comp_strs)}'

        # Mnemonic hint
        mnemonic = CURATED_MNEMONICS.get(ch, '')
        if not mnemonic:
            etym = entry.get('etymology')
            hint_en = etym.get('hint', '') if isinstance(etym, dict) else ''
            if is_single_body and rad_info:
                mnemonic = f'Chữ đơn độc lập, thuộc {rad_info["name"]} mang nghĩa "{rad_info["meaning"]}".'
            elif components:
                c_names = [f'{c["char"]} ({c["name"]})' for c in components if c.get('name')]
                mnemonic = f'Chữ ghép từ {" và ".join(c_names)}.'

        database[ch] = {
            'character': ch,
            'pinyin': char_pinyin,
            'hanviet': char_hv,
            'meaning': char_meaning,
            'is_single_body': is_single_body,
            'structure': {
                'idc': structure_idc,
                'name': struct_meta['name'],
                'type': struct_meta['type'],
                'desc': struct_meta['desc']
            },
            'radical': rad_info,
            'components': components,
            'formula': formula,
            'mnemonic': mnemonic
        }

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(database, f, ensure_ascii=False, indent=2)

    print(f'Successfully built decomposition database with {len(database)} characters!')
    print(f'Output saved to: {OUTPUT_FILE}')
    print(f'File size: {os.path.getsize(OUTPUT_FILE) / 1024:.1f} KB')

if __name__ == '__main__':
    build_decomposition_database()
