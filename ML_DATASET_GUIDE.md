# DESIGNVERSE — ML DATASET ARCHITECTURE & ANNOTATION GUIDE

## 1. Overview
The DesignVerse ML Dataset framework provides standard formatting for 2D floor plan symbol detection, monocular room photograph object detection, SAM 2 semantic segmentation masks, and 3D spatial bounding annotations.

## 2. Taxonomy & Object Classes (27 Classes)
```yaml
0: bed            1: sofa           2: chair          3: table          4: dining_table
5: coffee_table   6: desk           7: wardrobe       8: cabinet        9: tv
10: tv_unit       11: lamp          12: plant         13: carpet        14: door
15: window        16: curtain       17: bathtub       18: toilet        19: sink
20: refrigerator  21: stove         22: kitchen_counter 23: bookshelf    24: nightstand
25: dresser       26: mirror
```

## 3. Directory Layout
```text
ml/datasets/designverse_room_objects/
├── images/
│   ├── train/
│   ├── val/
│   └── test/
└── labels/
    ├── train/
    ├── val/
    └── test/
```

## 4. Annotation Formats
- **YOLO Bounding Box Format**: `<class_id> <x_center> <y_center> <width> <height>` (normalized 0.0 – 1.0)
- **Segmentation Polygon Format**: `<class_id> <x1> <y1> <x2> <y2> ... <xn> <yn>`
- **3D Ground Truth JSON Format**: Contains target class, relative 3D position `[X, Y, Z]`, orientation `[rx, ry, rz]`, and physical dimensions `[width, height, depth]`.
