# DESIGNVERSE — UNITY 3D ENGINE INTEGRATION GUIDE

## 1. Overview
The Unity 3D Engine integration in DesignVerse operates as a real 3D interactive graphics subsystem. It deserializes `Room3DScene` (v2.0) JSON and instantiates **real, editable GameObjects** for every architectural component and furniture piece.

## 2. Core C# Unity Architecture
- `DesignVerseSceneManager.cs`: Master scene coordinator.
- `RoomBuilder.cs`: Procedural room shell builder (floor, walls, ceiling, doors, windows).
- `FurnitureManager.cs`: Spawns, tracks, selects, and transforms individual furniture GameObjects.
- `DesignCommandSystem.cs`: Executes AI voice and natural text commands (`MOVE_OBJECT`, `RECOLOR_OBJECT`, `REMOVE_OBJECT`, etc.).
- `UnityBridgeService.cs`: JavaScript / Flutter bridge exposing `SendMessage("UnityBridge", "OnReceiveRoom3DScene", json)`.

## 3. Communication Protocol
```text
FastAPI / Web App / Flutter UI
              │
              ├─ REST / WebSockets / SendMessage
              ▼
    UnityBridgeService
              │
              ▼
  DesignVerseSceneManager
              │
              ▼
Real Editable GameObjects & Physics Colliders
```
