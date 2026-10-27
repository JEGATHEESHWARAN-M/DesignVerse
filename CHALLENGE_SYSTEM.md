# 🎯 DesignVerse Kids — Challenge Engine & Spatial Validation

## 1. Challenge Architecture
Challenges are defined with concrete spatial criteria rather than simple client-side booleans.

```json
{
  "challenge_id": "ch_door_clearance",
  "title": "🚶 Clear Path Detective",
  "min_level": 5,
  "xp_reward": 60,
  "badge_reward": "📐",
  "criteria": {
    "door_clearance_min_meters": 0.9,
    "walkable_path_to_bed": true
  }
}
```

## 2. Real Physical Scene Validation
In Unity and Three.js, `ChallengeValidator` calculates Euclidean distances between actual GameObjects:
- **Door Clearance:** Computes `Vector3.Distance(door.position, furniture.position) >= 0.9m`.
- **Chair Near Table:** Computes `Vector3.Distance(table.position, chair.position) <= 1.2m`.
- **Room Boundary:** Verifies that furniture center is within `roomBounds`.

## 3. Feedback Logic
- **If blocked:** *"Oops! The chair is only 0.4m from the door, blocking the swing! Give it a little nudge away!"*
- **If passed:** *"🎉 Excellent! The door opens completely with wide walking space!"*
