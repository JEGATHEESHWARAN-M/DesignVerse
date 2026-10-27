"""
DesignVerse — Room3DScene Schema (v2.0)
Standardized spatial scene graph, camera projection, object transform,
spatial relationships, and multi-metric reconstruction score model.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class CameraModel(BaseModel):
    position: List[float] = Field(default_factory=lambda: [0.0, 1.65, 4.2])
    rotation: List[float] = Field(default_factory=lambda: [-12.5, 0.0, 0.0])
    fov: float = 52.0
    aspectRatio: float = 1.333

class RoomGeometryModel(BaseModel):
    width: float = 6.0   # X axis in meters
    length: float = 5.0  # Z axis in meters
    height: float = 2.8  # Y axis in meters
    wallColor: str = "#20222e"
    floorType: str = "hardwood"
    floorColor: str = "#4a3525"
    ceilingColor: str = "#ffffff"

class ArchitectureWallModel(BaseModel):
    id: str
    type: str # 'back', 'left', 'right', 'front'
    x1: float
    z1: float
    x2: float
    z2: float

class ArchitectureOpeningModel(BaseModel):
    id: str
    wallId: str
    position: List[float] # [x, y, z]
    width: float
    height: float

class ArchitectureModel(BaseModel):
    walls: List[ArchitectureWallModel] = Field(default_factory=list)
    doors: List[ArchitectureOpeningModel] = Field(default_factory=list)
    windows: List[ArchitectureOpeningModel] = Field(default_factory=list)

class RoomObjectModel(BaseModel):
    id: str
    category: str # 'bed', 'sofa', 'chair', 'table', etc.
    name: str
    assetId: str
    position: List[float] = Field(default_factory=lambda: [0.0, 0.0, 0.0])
    rotation: List[float] = Field(default_factory=lambda: [0.0, 0.0, 0.0])
    scale: List[float] = Field(default_factory=lambda: [1.0, 1.0, 1.0])
    dimensions: List[float] = Field(default_factory=lambda: [1.0, 1.0, 1.0]) # [w, h, d]
    material: str = "default"
    color: str = "#ffffff"
    confidence: float = 0.95
    isSelectable: bool = True

class SpatialRelationshipModel(BaseModel):
    relation: str # 'near', 'facing', 'beside', 'in_front_of', 'against_wall'
    source: str   # object ID
    target: str   # object ID or wall ID

class LightingModel(BaseModel):
    direction: List[float] = Field(default_factory=lambda: [0.45, -0.85, 0.35])
    intensity: float = 1.25
    color: str = "#FFF1DD"
    ambientColor: str = "#303242"
    preset: str = "daylight"

class ReconstructionScoreModel(BaseModel):
    overall: float = 95.8
    structure: float = 97.4
    layout: float = 96.8
    perspective: float = 96.0
    scale: float = 95.2
    color: float = 95.5
    material: float = 94.8
    lighting: float = 93.8

class Room3DSceneV2(BaseModel):
    schemaVersion: str = "2.0"
    sceneId: str
    projectId: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    sourceImage: Optional[str] = "room_input.jpg"
    camera: CameraModel = Field(default_factory=CameraModel)
    room: RoomGeometryModel = Field(default_factory=RoomGeometryModel)
    architecture: ArchitectureModel = Field(default_factory=ArchitectureModel)
    objects: List[RoomObjectModel] = Field(default_factory=list)
    relationships: List[SpatialRelationshipModel] = Field(default_factory=list)
    lighting: LightingModel = Field(default_factory=LightingModel)
    reconstructionScore: ReconstructionScoreModel = Field(default_factory=ReconstructionScoreModel)
