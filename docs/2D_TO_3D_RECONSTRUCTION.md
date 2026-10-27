# DESIGNVERSE — 2D TO 3D RECONSTRUCTION ENGINE ARCHITECTURE

## 1. Overview
The DesignVerse 2D-to-3D Reconstruction System processes 2D floor plans or single room photographs into a structured spatial 3D scene graph (`Room3DScene` v2.0).

## 2. Pipeline Execution Order
```text
2D Input Photograph / Floor Plan
               ↓
Computer Vision Scene Analysis (CV / YOLO / SAM 2)
               ↓
Wall Boundary & Geometry Estimation
               ↓
Object Detection & Monocular Depth Mapping
               ↓
3D Asset Resolver (3D Asset Retrieval & Procedural Prim)
               ↓
Room3DScene JSON Schema (v2.0)
               ↓
Unity 3D Engine (Instantiates Real Editable GameObjects)
               ↓
Multi-Metric Difference Scorecard Verification (≥90% Gate)
```

## 3. Room3DScene Schema (v2.0) Specification
```json
{
  "schemaVersion": "2.0",
  "sceneId": "scene_8f3a12",
  "projectId": "proj_living_01",
  "camera": {
    "position": [0.0, 1.65, 4.2],
    "rotation": [-12.5, 0.0, 0.0],
    "fov": 52
  },
  "room": {
    "width": 6.0,
    "length": 5.0,
    "height": 2.8,
    "wallColor": "#20222e",
    "floorType": "hardwood"
  },
  "objects": [
    {
      "id": "sofa_001",
      "category": "sofa",
      "name": "Modern Minimalist Sofa",
      "assetId": "sofa_modern_01",
      "position": [1.5, 0.0, 0.5],
      "dimensions": [2.2, 0.85, 0.9],
      "color": "#3a4b6e"
    }
  ],
  "reconstructionScore": {
    "overall": 95.8,
    "structure": 97.4,
    "layout": 96.8,
    "perspective": 96.0,
    "scale": 95.2,
    "color": 95.5,
    "material": 94.8
  }
}
```
