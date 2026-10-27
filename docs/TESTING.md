# DESIGNVERSE — AUTOMATED TESTING SPECIFICATION & QA PROTOCOL

## 1. Test Architecture
DesignVerse employs automated tests across every tier:
1. **Automated Web & App Suite (`test/runTests.js`)**: Validates DOM elements, `Room3DSceneSchema` (v1.0 & v2.0), voice intent parsing, Android manifest permissions, and output package sizes.
2. **ML Pipeline Testing (`ml/scripts/`)**: Validates dataset splits, bounding box annotations, YOLO detection checkpoints, and depth estimation outputs.
3. **Unity 3D Validation (`SceneValidator.cs`)**: Verifies room object counts, collision clearance, material assignment, and JSON deserialization integrity.

## 2. Executing Sample Tests
```powershell
node test/runTests.js
```
Target result: `32/32 PASSED (0 FAILED)`.
