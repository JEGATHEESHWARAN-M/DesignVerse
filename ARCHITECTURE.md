# DESIGNVERSE — SYSTEM ARCHITECTURE SPECIFICATION

## Primary Principle
```text
2D FLOOR PLAN / ROOM IMAGE
             ↓
       AI UNDERSTANDING
             ↓
       OBJECT DETECTION & SEGMENTATION
             ↓
       MONOCULAR DEPTH & GEOMETRY
             ↓
       ROOM3DSCENE JSON (v2.0)
             ↓
       3D ASSET RETRIEVAL
             ↓
       PROCEDURAL ROOM CONSTRUCTION
             ↓
       UNITY 3D ENGINE
             ↓
       REAL INTERACTIVE GAMEOBJECTS
             ↓
       EDITABLE 3D ROOM
             ↓
       AI VOICE / TEXT DESIGN CONTROL
             ↓
       EXPORT / PLAY STORE DISTRIBUTION
```

## Modular Layers
1. **Frontend**: Interactive WebGL / Capacitor 8 Android Shell (`com.designverse.app`).
2. **Backend**: FastAPI (`backend/app/`) with REST APIs for Auth, Reconstruction, AI Voice, Recommendations, Budgeting, and Unity Bridge.
3. **Machine Learning Pipeline**: YOLO Object Detection & SAM 2 Semantic Segmentation (`ml/`).
4. **Unity 3D Engine**: C# GameObject Manager and Real 3D Renderer (`unity/DesignVerse/Assets/Scripts/`).
