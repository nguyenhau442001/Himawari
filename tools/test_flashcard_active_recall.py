#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/test_flashcard_active_recall.py
Unit tests verifying the centered symmetrical flashcard redesign & active recall:
1. Centered Symmetrical Hero: .word-hero-container, .hanzi-stage, study-nav-controls, rating-area.
2. Active Recall: Front displays only Kanji, hides reading row, meaning, badges, examples, and accordions until flipped.
3. Interaction Design & Ergonomics: Direct keyboard shortcut badges [1 / ←] & [2 / →] on rating buttons, enhanced hover states.
4. Clean-up & Accordions: Expandable accordion component for Kanji Decomposition / Radicals (collapsed by default).
5. Mobile Gestures: Horizontal swipe hysteresis, flick velocity commit, non-passive touchmove, interactive selectors.
"""

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FLASHCARD_JS = ROOT / "assets" / "js" / "flashcard.js"
CARD_INTERACTIONS_JS = ROOT / "assets" / "js" / "card-interactions.js"
FLASHCARD_CSS = ROOT / "assets" / "css" / "flashcard.css"
WORKSTATION_CSS = ROOT / "assets" / "css" / "workstation.css"
DECOMP_JS = ROOT / "assets" / "js" / "hanzi-decomposition.js"
PROGRESS_JS = ROOT / "assets" / "js" / "progress.js"


class TestFlashcardActiveRecall(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fc_js = FLASHCARD_JS.read_text(encoding="utf-8")
        cls.interactions_js = CARD_INTERACTIONS_JS.read_text(encoding="utf-8")
        cls.fc_css = FLASHCARD_CSS.read_text(encoding="utf-8")
        cls.ws_css = WORKSTATION_CSS.read_text(encoding="utf-8")
        cls.decomp_js = DECOMP_JS.read_text(encoding="utf-8")
        cls.prog_js = PROGRESS_JS.read_text(encoding="utf-8")

    def test_active_recall_front_hides_spoilers(self):
        """Front of card (.card:not(.is-flipped)) must hide reading row, meaning, example, and accordions."""
        self.assertIn(".card:not(.is-flipped) .pinyin-row", self.fc_css)
        self.assertIn(".card:not(.is-flipped) .meaning", self.fc_css)
        self.assertIn(".card:not(.is-flipped) .example-box", self.fc_css)
        self.assertIn(".card:not(.is-flipped) .card-expandable-group", self.fc_css)
        self.assertIn(".card:not(.is-flipped) .card-accordion", self.fc_css)

    def test_centered_hero_container_present(self):
        """Flashcard template and CSS must use centered word-hero-container layout."""
        self.assertIn('class="word-hero-container"', self.fc_js)
        self.assertIn('.word-hero-container', self.fc_css)
        self.assertIn('.word-hero-container', self.ws_css)
        self.assertNotIn('split-layout', self.fc_js)

    def test_hanzi_stage_interactive_present(self):
        """Hanzi stage must exist as focal point with writing trigger."""
        self.assertIn('id="hanziStage"', self.fc_js)
        self.assertIn('.hanzi-stage', self.fc_css)
        self.assertIn('.hanzi-stage', self.ws_css)

    def test_accordions_present_in_template(self):
        """Flashcard template must contain decomposition accordion with stopPropagation summary."""
        self.assertIn('id="cardDecompAccordion"', self.fc_js)
        self.assertIn('id="cardDecompositionWrap"', self.fc_js)
        self.assertIn('<summary class="card-accordion-summary" onclick="event.stopPropagation()">', self.fc_js)

    def test_accordions_controlled_in_js(self):
        """JS rendering must control decomposition accordion and reset state on card advance."""
        self.assertIn("cardDecompAccordion", self.decomp_js)
        self.assertIn("decompAcc.open = false", self.fc_js)
        self.assertIn("decompAcc.open = false", self.interactions_js)

    def test_rating_buttons_show_keyboard_shortcuts(self):
        """Rating buttons must render explicit keyboard shortcut badges [1 / ←] and [2 / →]."""
        self.assertIn("rating-kbd-badge", self.fc_js)
        self.assertIn("<kbd>${button.key}</kbd>", self.fc_js)
        self.assertIn("<kbd>${shortcutArrow}</kbd>", self.fc_js)
        self.assertIn(".rating-kbd-badge", self.fc_css)

    def test_rating_buttons_high_contrast_hover(self):
        """Rating buttons must define high-contrast hover styling in CSS."""
        self.assertIn(".rating-btn--again:hover", self.fc_css)
        self.assertIn(".rating-btn--good:hover", self.fc_css)
        self.assertIn("box-shadow: 0 4px 14px", self.fc_css)

    def test_keyboard_events_support_enter_and_down_to_flip(self):
        """Keyboard handler in progress.js must support Space, Enter, ArrowDown to flip when unrevealed."""
        self.assertIn("event.key === ' ' || (!revealed && (event.key === 'Enter' || event.key === 'ArrowDown'))", self.prog_js)

    def test_interactive_selector_covers_all_nested_controls(self):
        """Interactive selector must include accordions, summary, chevron, audio, and chips."""
        required_selectors = [
            "summary",
            "details",
            ".card-accordion",
            ".card-accordion-summary",
            ".card-accordion-body",
            ".accordion-chevron",
            ".sound-btn",
            ".speech-btn",
            ".example-sound-btn",
            ".radical-chip",
            ".card-radical-pill",
            ".hanzi-stage",
            "#hanziStage",
            ".card-flip-prompt",
            "#cardFlipPrompt",
        ]
        for sel in required_selectors:
            self.assertIn(sel, self.interactions_js, f"Missing {sel} in FLASHCARD_INTERACTIVE_SELECTOR")

    def test_touch_events_use_non_passive_touchmove(self):
        """touchmove listener must be non-passive to allow e.preventDefault() during horizontal swipe."""
        self.assertIn("card.addEventListener('touchmove', onTouchMove, { passive: false })", self.interactions_js)
        self.assertIn("card.addEventListener('touchstart', onTouchStart, { passive: true })", self.interactions_js)

    def test_horizontal_swipe_hysteresis_locking(self):
        """Card interactions must lock direction cleanly with a hysteresis ratio to prevent vertical scroll conflict."""
        self.assertIn("DRAG_LOCK_THRESHOLD", self.interactions_js)
        self.assertIn("locked = 'h'", self.interactions_js)
        self.assertIn("locked = 'v'", self.interactions_js)
        self.assertTrue(
            "if (e.cancelable) e.preventDefault()" in self.interactions_js
            or "e.cancelable && e.preventDefault()" in self.interactions_js
        )

    def test_flick_velocity_commit_support(self):
        """Swiping must support both distance commit and natural flick velocity."""
        self.assertIn("velocity", self.interactions_js)
        self.assertIn("isFlick", self.interactions_js)
        self.assertIn("isDistance", self.interactions_js)

    def test_study_nav_controls_centered_symmetrical(self):
        """Tactile navigation controls must be defined and symmetrically centered."""
        self.assertIn('class="study-nav-controls"', self.fc_js)
        self.assertIn('.study-nav-controls', self.fc_css)
        self.assertIn('id="prevCardBtn"', self.fc_js)
        self.assertIn('id="nextCardBtn"', self.fc_js)
        self.assertIn('id="studyNavPosition"', self.fc_js)

    def test_reduced_motion_respected(self):
        """Reduced motion must be respected in CSS and JS."""
        self.assertIn("prefers-reduced-motion", self.fc_css)
        self.assertIn("prefers-reduced-motion", self.interactions_js)


if __name__ == "__main__":
    unittest.main()
