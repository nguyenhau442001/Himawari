#!/usr/bin/env python3
"""
Test Suite for Synapse Nihongo Master Architecture.
Verifies compliance with the 7 architectural pillars:
1. SemVer Version Alignment
2. JLPT N5-N1 Database Integrity & Data Schema
3. Active Recall 2-State UX (Strict front-state concealment)
4. Ergonomic Keyboard Shortcuts & Gestures
5. FSRS v5 Spaced Repetition Engine (desiredRetention=0.9)
6. Ecosystem Tools Availability
7. Performance & Offline PWA Assets
"""

import json
import os
import re
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class TestMasterArchitecture(unittest.TestCase):
    
    # ----------------------------------------------------
    # Pillar 1 & 7: SemVer & Engineering Standards
    # ----------------------------------------------------
    def test_semver_sync_across_files(self):
        version_file = os.path.join(ROOT_DIR, 'VERSION')
        self.assertTrue(os.path.isfile(version_file), "VERSION file must exist")
        with open(version_file, 'r', encoding='utf-8') as f:
            version = f.read().strip()
        self.assertTrue(re.match(r'^\d+\.\d+\.\d+$', version), f"VERSION '{version}' must follow SemVer X.Y.Z")

        pkg_file = os.path.join(ROOT_DIR, 'package.json')
        with open(pkg_file, 'r', encoding='utf-8') as f:
            pkg = json.load(f)
        self.assertEqual(pkg.get('version'), version, "package.json version must match VERSION")

        sw_file = os.path.join(ROOT_DIR, 'sw.js')
        with open(sw_file, 'r', encoding='utf-8') as f:
            sw_content = f.read()
        self.assertIn(f"ASSET_VERSION = 'v{version}'", sw_content, "sw.js ASSET_VERSION must match VERSION")

    # ----------------------------------------------------
    # Pillar 2 & 3: Database Integrity & Schema
    # ----------------------------------------------------
    def test_jlpt_databases_exist_and_conform(self):
        jlpt_dir = os.path.join(ROOT_DIR, 'database', 'jlpt')
        self.assertTrue(os.path.isdir(jlpt_dir), "database/jlpt directory must exist")

        levels = ['n1', 'n2', 'n3', 'n4', 'n5']
        for lvl in levels:
            file_path = os.path.join(jlpt_dir, f"{lvl}.json")
            self.assertTrue(os.path.isfile(file_path), f"database/jlpt/{lvl}.json must exist")
            
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            self.assertIsInstance(data, list, f"{lvl}.json must contain an array")
            self.assertGreater(len(data), 50, f"{lvl}.json must contain words")

            # Check sample items for standard/alias schema properties
            for item in data[:20]:
                self.assertTrue('id' in item, f"Word must have id in {lvl}.json")
                has_target = ('kanji' in item) or ('hanzi' in item)
                self.assertTrue(has_target, f"Word must have kanji or hanzi in {lvl}.json: {item}")
                has_reading = ('furigana' in item) or ('pinyin' in item)
                self.assertTrue(has_reading, f"Word must have furigana or pinyin in {lvl}.json: {item}")
                has_meaning = ('meaning_vi' in item) or ('meaning' in item)
                self.assertTrue(has_meaning, f"Word must have meaning in {lvl}.json: {item}")

    # ----------------------------------------------------
    # Pillar 4: Active Recall 2-State Flashcard UX
    # ----------------------------------------------------
    def test_active_recall_strict_front_hiding(self):
        css_file = os.path.join(ROOT_DIR, 'assets', 'css', 'flashcard.css')
        with open(css_file, 'r', encoding='utf-8') as f:
            css = f.read()

        # The front state must strictly hide meaning, pinyin/furigana, visual illustration, etc.
        pattern = r'\.card:not\(\.is-flipped\)\s+([^{]+)\{'
        matches = re.findall(pattern, css)
        all_hidden_selectors = " ".join(matches)
        
        required_hidden_elements = [
            'card-visual-col',
            'meaning',
            'pinyin-row',
            'meta-badges-row',
            'example-box',
        ]
        for elem in required_hidden_elements:
            self.assertIn(elem, all_hidden_selectors, f"Front state must hide .{elem}")

    # ----------------------------------------------------
    # Pillar 4: Ergonomic Shortcuts
    # ----------------------------------------------------
    def test_keyboard_shortcuts_defined(self):
        progress_js = os.path.join(ROOT_DIR, 'assets', 'js', 'progress.js')
        with open(progress_js, 'r', encoding='utf-8') as f:
            js = f.read()

        # Check key handlers
        self.assertIn("event.key === ' '", js, "Space must trigger flip")
        self.assertIn("event.key === 'ArrowDown'", js, "ArrowDown must trigger flip")
        self.assertIn("event.key === 'Enter'", js, "Enter must trigger flip")
        self.assertIn("event.key === 'w' || event.key === 'W'", js, "W must trigger writing panel")
        self.assertIn("event.key === 'p' || event.key === 'P'", js, "P must toggle furigana/pinyin")
        self.assertIn("event.key === 'h' || event.key === 'H'", js, "H must toggle Han-Viet")
        self.assertIn("event.key === 'a' || event.key === 'A'", js, "A must speak audio")

        flashcard_js = os.path.join(ROOT_DIR, 'assets', 'js', 'flashcard.js')
        with open(flashcard_js, 'r', encoding='utf-8') as f:
            fc_js = f.read()
        self.assertIn("'1': 'again'", fc_js, "Key 1 must rate again")
        self.assertIn("'2': 'good'", fc_js, "Key 2 must rate good")
        self.assertIn("'ArrowLeft': 'again'", fc_js, "ArrowLeft must rate again")
        self.assertIn("'ArrowRight': 'good'", fc_js, "ArrowRight must rate good")

    # ----------------------------------------------------
    # Pillar 5: FSRS v5 Spaced Repetition Engine
    # ----------------------------------------------------
    def test_fsrs_engine_configuration(self):
        srs_js = os.path.join(ROOT_DIR, 'assets', 'js', 'srs.js')
        with open(srs_js, 'r', encoding='utf-8') as f:
            srs = f.read()

        self.assertIn("DEFAULT_RETENTION = 0.9", srs, "FSRS default retention must be 0.9")
        self.assertIn("request_retention", srs, "FSRS scheduler must pass request_retention")

    # ----------------------------------------------------
    # Pillar 6: Ecosystem Tools Modules Exist
    # ----------------------------------------------------
    def test_ecosystem_tool_modules(self):
        tools = [
            'assets/js/stroke-canvas.js',        # Kanji Writing Studio
            'assets/js/radicals.js',             # Kanji & Radicals Explorer
            'assets/js/sentence-game.js',        # Sentence Rearrangement Game
            'assets/js/grammar-breakdown.js',    # Dokkai & Bunpou breakdown
            'assets/js/speechService.js',        # Audio Engine
        ]
        for tool in tools:
            path = os.path.join(ROOT_DIR, tool)
            self.assertTrue(os.path.isfile(path), f"Ecosystem tool module {tool} must exist")

if __name__ == '__main__':
    unittest.main()
