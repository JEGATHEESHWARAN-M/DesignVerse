# 📖 DesignVerse Kids — Lesson System

## 1. Data-Driven Lesson Model
All lessons in DesignVerse Kids are defined as data structures in `learning_content/levels/levels.json`. Lessons are never hardcoded static text.

```json
{
  "lesson_id": "l1_what_is_a_room",
  "title": "What is a Room?",
  "type": "interactive",
  "xp_reward": 30,
  "content": {
    "steps": [
      { "type": "speech", "body": "A room has walls, a floor under your feet, and a ceiling above you! 🏠" },
      { "type": "action", "action": "find_floor", "prompt": "Can you tap on the floor?", "success_message": "Awesome! You found the floor! ⭐" },
      { "type": "action", "action": "find_door", "prompt": "Where is the door to go outside?", "success_message": "Super! You found the door! 🚪" }
    ]
  }
}
```

## 2. Lesson Execution Flow
1. **Introduction:** Sparky introduces the concept with friendly speech and emojis.
2. **Demonstration:** Camera glides to show the room element in 3D.
3. **Child Interaction:** The child taps, moves, or recolors the target object.
4. **Validation:** `LessonInteractionManager` verifies the tap or placement.
5. **Reward & Encouragement:** Sparky cheers the child with synthesized chimes and +XP.
