# DESIGNVERSE — ML MODEL TRAINING & INFERENCE GUIDE

## 1. Environment & Requirements
- Python 3.10+ / 3.11+ / 3.13
- PyTorch with CUDA support (or CPU fallback)
- Ultralytics YOLO / SAM 2

## 2. Command Line Execution

### Step 1: Prepare Dataset
```powershell
py ml/scripts/prepare_dataset.py --dir ml/datasets/designverse_room_objects
```

### Step 2: Train Object Detector & Segmentor
```powershell
py ml/scripts/train_detector.py --config ml/configs/dataset_config.yaml --epochs 20
```

### Step 3: Run Object & Depth Inference
```powershell
py ml/scripts/run_inference.py --image path/to/room_photo.jpg
```

## 3. Performance Metrics
- **mAP@50**: Target \(\ge 0.90\)
- **Precision**: Target \(\ge 0.92\)
- **Recall**: Target \(\ge 0.90\)
- Checkpoints are saved under `ml/checkpoints/designverse_yolo_v1.pt`.
