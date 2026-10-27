# 🎙️ DesignVerse Kids — Voice Learning & Speech Interaction

## 1. Unified Speech Intent Architecture
Voice commands and text assistant queries share the same natural language understanding pipeline through `VoiceCommandEngine`:
- *"What is a chair?"* ➡️ Educational explanation of sitting & relaxing.
- *"Make the wall blue"* ➡️ Color mutation applied in live 3D space.
- *"Add a table"* ➡️ Places a dining/work table in the scene.
- *"Move chair near table"* ➡️ Relative spatial positioning.
- *"Why is this wrong?"* ➡️ Spatial feedback ("The chair is too close to the door").
- *"Give me a hint"* ➡️ Progressive 3-tier hint from `HintManager`.

## 2. Voice Synthesizer & Speech Recognition
- **Speech Recognition:** Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`) on supported browsers and Android WebViews.
- **Speech Synthesis:** `speechSynthesis.speak(SpeechSynthesisUtterance)` speaks Sparky's cheerful feedback aloud with child-friendly pitch (1.2) and pacing (0.95).
- **Privacy:** Transient audio processing only; no audio is recorded or stored on external servers.
