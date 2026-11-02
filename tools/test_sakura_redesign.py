#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/test_sakura_redesign.py
Automated test suite verifying the UI Redesign:
Japanese Minimalism + Sakura Atmosphere, Header Redesign,
Japanese Sakura Illustration, and Falling Sakura Canvas.
"""

import re
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
INDEX_HTML = REPO_ROOT / "index.html"
BASE_CSS = REPO_ROOT / "assets" / "css" / "base.css"
WORKSTATION_CSS = REPO_ROOT / "assets" / "css" / "workstation.css"
WORD_ILLU_JS = REPO_ROOT / "assets" / "js" / "word-illustrations.js"
SAKURA_CANVAS_JS = REPO_ROOT / "assets" / "js" / "sakura-canvas.js"
SW_JS = REPO_ROOT / "sw.js"


class TestSakuraRedesign(unittest.TestCase):
    def setUp(self):
        self.index_html = INDEX_HTML.read_text(encoding="utf-8")
        self.base_css = BASE_CSS.read_text(encoding="utf-8")
        self.workstation_css = WORKSTATION_CSS.read_text(encoding="utf-8")
        self.word_illu_js = WORD_ILLU_JS.read_text(encoding="utf-8")
        self.sakura_canvas_js = SAKURA_CANVAS_JS.read_text(encoding="utf-8")
        self.sw_js = SW_JS.read_text(encoding="utf-8")

    def test_header_branding_removed(self):
        """Header must not contain the multiline '汉字闪卡' branding block."""
        self.assertNotIn("汉字闪卡", self.index_html, "Unwanted '汉字闪卡' branding found in index.html")
        self.assertNotIn("Hànzì Shǎnkǎ", self.index_html, "Unwanted 'Hànzì Shǎnkǎ' subtitle found in index.html")

    def test_header_structure_and_action_buttons(self):
        """Study topbar must contain back button, view tabs, progress, and clean action buttons."""
        self.assertIn('id="studyLevelBadge"', self.index_html)
        self.assertIn('id="flashcardTab"', self.index_html)
        self.assertIn('id="overviewTab"', self.index_html)
        self.assertIn('id="studyTopbarProgress"', self.index_html)
        self.assertIn('id="studyWritingToggleBtn"', self.index_html)
        self.assertIn('id="studyHistoryBtn"', self.index_html)
        self.assertIn('id="studySettingsBtn"', self.index_html)
        self.assertIn('study-theme-toggle-btn', self.index_html)

    def test_sakura_canvas_presence_and_sw_caching(self):
        """Sakura falling animation canvas must be defined in index.html and cached in sw.js."""
        self.assertIn('id="sakuraCanvas"', self.index_html)
        self.assertIn('sakura-canvas.js', self.index_html)
        self.assertIn('./assets/js/sakura-canvas.js', self.sw_js)

    def test_sakura_canvas_accessibility_and_performance(self):
        """Sakura canvas script must handle visibilitychange and prefers-reduced-motion."""
        self.assertIn("prefers-reduced-motion", self.sakura_canvas_js)
        self.assertIn("visibilitychange", self.sakura_canvas_js)
        self.assertIn("requestAnimationFrame", self.sakura_canvas_js)
        self.assertIn("cancelAnimationFrame", self.sakura_canvas_js)

    def test_sakura_illustration_fallback_replaces_cube(self):
        """Fallback illustration must be a Japanese Sakura branch, not a 3D isometric cube."""
        self.assertNotIn("cubeTopGrad", self.word_illu_js, "3D Cube gradient found in word-illustrations.js")
        self.assertNotIn("Isometric 3D Crystal Cube", self.word_illu_js, "3D Crystal cube found in word-illustrations.js")
        self.assertIn("getJapaneseSakuraIllustrationSvg", self.word_illu_js)
        self.assertIn("sakuraAura", self.word_illu_js)
        self.assertIn("sumiBranch", self.word_illu_js)

    def test_dark_palette_tokens_japanese_minimalism(self):
        """Dark theme tokens must reflect deep charcoal/dark plum background with sakura accents."""
        self.assertIn("--bg: #12111A;", self.base_css)
        self.assertIn("--card-bg: #1A1824;", self.base_css)
        self.assertIn("--accent: #F4A7B9;", self.base_css)
        self.assertIn("--accent-deep: #D96C91;", self.base_css)
        self.assertIn("--text-primary: #F8F5F4;", self.base_css)


if __name__ == "__main__":
    unittest.main()
