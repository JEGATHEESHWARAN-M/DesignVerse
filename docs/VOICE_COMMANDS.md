# DESIGNVERSE — AI VOICE & NATURAL TEXT ASSISTANT SPECIFICATION

## 1. Overview
Stage 2 of DesignVerse enables speech-driven and natural text control over the reconstructed 3D room.

## 2. Intent Parsing Pipeline
```text
Voice Input (Microphone) / Text Input
                 ↓
Web Speech API / SpeechToTextProvider
                 ↓
Natural Language Intent Engine
                 ↓
DesignCommand Validation Schema
                 ↓
Unity 3D Engine GameObject Mutations
```

## 3. Supported Command Patterns
- **Color & Material Mutations**:
  - *"Change wall color to ocean blue"*
  - *"Set floor to dark hardwood"*
- **Spatial Positioning**:
  - *"Move bedside table closer to sofa"*
  - *"Shift armchair right by 0.5 meters"*
- **AI Interior Style Application**:
  - *"Make this room Scandinavian"*
  - *"Apply luxury penthouse aesthetic"*
- **Item Insertion & Deletion**:
  - *"Add house plant near window"*
  - *"Remove old coffee table"*
