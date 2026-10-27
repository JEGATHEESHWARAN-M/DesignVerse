"""
DesignVerse Learning Engine — Feature Unlock Manager
Single source of truth for feature gating. Server-side only.
"""
from __future__ import annotations
import json
from pathlib import Path
from typing import Optional
from .xp_engine import XPEngine, LEVELS

_LEVELS_PATH = Path(__file__).parent.parent.parent.parent / "learning_content" / "levels" / "levels.json"

def _build_unlock_map() -> dict[int, list[str]]:
    """level_id -> list of feature_ids unlocked at that level."""
    try:
        with open(_LEVELS_PATH, encoding="utf-8") as f:
            levels = json.load(f)
        return {l["level_id"]: l.get("unlocks", []) for l in levels}
    except Exception:
        return {}

_UNLOCK_MAP = _build_unlock_map()

# Users with no learning profile get this effective level (grandfathering — D-006)
_GRANDFATHERED_LEVEL = 10

# Per-user override: user_id -> effective_level (set after Placement Check)
_user_overrides: dict[str, int] = {}


class FeatureUnlockManager:
    """
    Server-enforced feature gating.
    UI reflects these decisions but is NEVER the only guard.
    """

    @staticmethod
    def get_effective_level(user_id: str) -> int:
        """
        Returns the effective level for a user.
        Grandfathered users (no placement check done) get level 10.
        """
        if user_id in _user_overrides:
            return _user_overrides[user_id]
        # Check if user has started learning journey
        history = XPEngine.get_history(user_id)
        if not history:
            # No XP events = grandfathered, all unlocked
            return _GRANDFATHERED_LEVEL
        return XPEngine.compute_level(XPEngine.get_total_xp(user_id))

    @staticmethod
    def set_placement_level(user_id: str, level: int) -> None:
        """Called after placement check to start the learning journey."""
        _user_overrides[user_id] = level

    @staticmethod
    def get_all_unlocked_features(user_id: str) -> list[str]:
        eff_level = FeatureUnlockManager.get_effective_level(user_id)
        features: set[str] = set()
        for lvl_id, feature_list in _UNLOCK_MAP.items():
            if lvl_id <= eff_level:
                if "ALL" in feature_list:
                    # Level 10 unlocks everything
                    all_features: set[str] = set()
                    for fl in _UNLOCK_MAP.values():
                        all_features.update(fl)
                    return sorted(all_features - {"ALL"})
                features.update(feature_list)
        return sorted(features)

    @staticmethod
    def is_unlocked(user_id: str, feature_id: str) -> bool:
        eff_level = FeatureUnlockManager.get_effective_level(user_id)
        # Level 10 = ALL unlocked
        if eff_level >= 10:
            return True
        for lvl_id, feature_list in _UNLOCK_MAP.items():
            if lvl_id <= eff_level and feature_id in feature_list:
                return True
        return False

    @staticmethod
    def unlock_reason(user_id: str, feature_id: str) -> Optional[dict]:
        """
        If feature is locked, returns how to unlock it.
        Returns None if already unlocked.
        """
        if FeatureUnlockManager.is_unlocked(user_id, feature_id):
            return None
        # Find the level that grants this feature
        for lvl_id, feature_list in _UNLOCK_MAP.items():
            if feature_id in feature_list:
                lvl_data = next((l for l in LEVELS if l["level_id"] == lvl_id), {})
                current_xp = XPEngine.get_total_xp(user_id)
                needed = lvl_data.get("xp_required", 0)
                return {
                    "feature_id": feature_id,
                    "required_level": lvl_id,
                    "required_level_name": lvl_data.get("title", f"Level {lvl_id}"),
                    "required_xp": needed,
                    "current_xp": current_xp,
                    "xp_gap": max(0, needed - current_xp),
                    "unlock_message": f"Reach {lvl_data.get('title', f'Level {lvl_id}')} to unlock this feature!",
                    "friendly_tip": "Complete lessons and challenges to earn XP.",
                }
        return {"feature_id": feature_id, "unlock_message": "This feature requires further progression."}
