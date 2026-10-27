"""
DesignVerse Kids — Friendly AI Teacher & Guide
Educational mentor for young designers.
Teaches step-by-step spatial concepts, colors, proportions, and safety in child-friendly language.
"""
from typing import Dict, Any

CHILD_SYSTEM_PROMPT = """You are Sparky, the friendly DesignVerse AI Teacher and Room Buddy!
Your mission is to guide young children (ages 6-14) in learning interior design.
- Always be encouraging, warm, playful, and supportive!
- Never use complicated adult architecture jargon.
  * Instead of "spatial optimization", say "making walking space".
  * Instead of "2D-to-3D scene reconstruction", say "turning our flat map into a 3D room!".
  * Instead of "materials & textures", say "what things are made from, like soft fabric or warm wood!".
- Celebrate every small win with high-fives and cheerful emojis!
- If a child makes a placement mistake (like blocking a door), say:
  "Almost! Look at the door—can our room buddy open it, or is the chair in the way? Let's give it a little nudge!"
"""

CHILD_PEDAGOGY_TIPS = {
    "floor": "The floor is right under our feet! We can make it soft carpet, shiny tiles, or cozy wood! 🪵",
    "door": "Doors let us walk in and out! Always make sure nothing is parked right in front of them so they can open wide! 🚪",
    "window": "Windows bring warm sunshine and fresh breeze into the room! Placing your study desk near a window makes reading so bright! ☀️",
    "chair": "Chairs are for relaxing or studying! Placing chairs near a table makes a great spot for drawing and dining! 🪑",
    "color": "Colors give rooms personality! Warm colors like sunny yellow feel cheerful, while ocean blues feel calm and peaceful! 🎨",
    "flow": "Make sure you leave enough open space to walk and run without bumping your toes into tables! 🚶✨",
    "lighting": "Lamps give rooms a cozy glow for bedtime stories, and ceiling lights help us see everything clearly! 💡",
    "materials": "Wooden tables feel strong and natural, while soft cloth sofas are the coziest for snuggling! 🛋️"
}

class AITutorService:
    @staticmethod
    def get_tutor_advice(topic: str, user_level: int = 1) -> Dict[str, Any]:
        """Provides child-friendly pedagogical advice and cheer."""
        clean_topic = topic.lower().strip()
        matched_tip = None
        for key, hint in CHILD_PEDAGOGY_TIPS.items():
            if key in clean_topic:
                matched_tip = hint
                break

        if not matched_tip:
            matched_tip = (
                f"You're doing fantastic at Level {user_level}! 🌟 "
                "Every great room begins with finding a good spot for your favorite piece of furniture. Try placing it next to a wall!"
            )

        return {
            "status": "success",
            "teacher": "Sparky the AI Room Buddy 🤖✨",
            "topic": topic,
            "user_level": user_level,
            "advice": matched_tip,
            "cheer": "Keep exploring, Young Designer! ⭐"
        }
