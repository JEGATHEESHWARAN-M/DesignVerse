"""
DesignVerse Learning Engine — Unit Tests
Tests XP engine, feature unlock manager, and level progression calculations.
"""
import unittest
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from app.learning.xp_engine import XPEngine, LEVELS
from app.learning.feature_unlock import FeatureUnlockManager

class TestLearningEngine(unittest.TestCase):

    def setUp(self):
        # Unique test user IDs
        self.user_new = "test_user_new"
        self.user_learner = "test_user_learner"

    def test_xp_award_and_idempotency(self):
        # Award XP (less than Level 2 threshold of 100 XP)
        res1 = XPEngine.award(self.user_learner, "evt_001", "lesson:l1", 60)
        self.assertEqual(res1["total_xp"], 60)
        self.assertEqual(res1["level"], 1)

        # Idempotent award with same event_id
        res2 = XPEngine.award(self.user_learner, "evt_001", "lesson:l1", 60)
        self.assertEqual(res2["total_xp"], 60)

        # New event moves XP past 100 XP threshold for Level 2
        res3 = XPEngine.award(self.user_learner, "evt_002", "lesson:l2", 60)
        self.assertEqual(res3["total_xp"], 120)
        # 120 XP should reach level 2 (100 XP threshold)
        self.assertEqual(res3["level"], 2)

    def test_grandfathering_rule(self):
        # A user with no XP events or history is grandfathered to level 10 (all tools unlocked)
        eff_lvl = FeatureUnlockManager.get_effective_level(self.user_new)
        self.assertEqual(eff_lvl, 10)
        self.assertTrue(FeatureUnlockManager.is_unlocked(self.user_new, "ALL_DESIGN_TOOLS"))

    def test_feature_unlock_gating(self):
        u_gated = "test_user_gated"
        # Start learning at level 1 with a starter event (50 XP < 100 XP)
        XPEngine.award(u_gated, "init_01", "starter", 50)
        eff_lvl = FeatureUnlockManager.get_effective_level(u_gated)
        self.assertEqual(eff_lvl, 1)

        # Basic level 1 features are unlocked
        self.assertTrue(FeatureUnlockManager.is_unlocked(u_gated, "room_exploration"))
        self.assertTrue(FeatureUnlockManager.is_unlocked(u_gated, "object_selection"))

        # Advanced Level 7+ and Level 9+ features are locked
        self.assertFalse(FeatureUnlockManager.is_unlocked(u_gated, "materials_selector"))
        self.assertFalse(FeatureUnlockManager.is_unlocked(u_gated, "2d_to_3d_converter"))

        # Check unlock reason provided
        reason = FeatureUnlockManager.unlock_reason(u_gated, "materials_selector")
        self.assertIsNotNone(reason)
        self.assertEqual(reason["required_level"], 7)
        self.assertIn("unlock_message", reason)

    def test_ai_tutor_advice(self):
        from app.learning.ai_tutor import AITutorService
        res = AITutorService.get_tutor_advice("flow", 2)
        self.assertEqual(res["status"], "success")
        self.assertIn("walk", res["advice"].lower())

if __name__ == "__main__":
    unittest.main()
