# 🔓 DesignVerse Kids — Centralized Feature Unlock Manager

## 1. Single Source of Truth
The `FeatureUnlockManager` determines which tools, editors, and options are active. Feature gating is never just client CSS hiding. It controls both UI visibility and backend action execution.

```python
class FeatureUnlockManager:
    @staticmethod
    def is_unlocked(user_id: str, feature_id: str) -> bool:
        eff_level = FeatureUnlockManager.get_effective_level(user_id)
        if eff_level >= 10:
            return True
        unlocked_set = _get_unlocked_for_level(eff_level)
        return feature_id in unlocked_set
```

## 2. Feature Unlock Schedule
- **Level 1:** `room_exploration`, `object_selection`, `simple_camera_movement`
- **Level 2:** `select_furniture`, `move_furniture`, `add_simple_furniture`
- **Level 3:** `wall_colors`, `floor_colors`, `furniture_colors`
- **Level 4:** `move_objects`, `resize_objects`, `basic_positioning`
- **Level 5:** `rotate`, `resize`, `grid`, `snap`, `collision_warnings`
- **Level 6:** `full_room_builder`, `room_type_selection`, `decorations`
- **Level 7:** `materials_selector`, `lighting_modes`, `style_presets`
- **Level 8:** `2d_floor_plan_creator`, `wall_drawing`, `furniture_stamps`
- **Level 9:** `2d_to_3d_converter`, `ai_scene_understanding`, `3d_walkthrough_mode`
- **Level 10:** `ALL_DESIGN_TOOLS`, `master_graduation_badge`
