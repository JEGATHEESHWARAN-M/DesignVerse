"""
DesignVerse — Data Contracts & Server-Side Validators (v2 Spec)
Strict Pydantic models for Lighting, Materials, Style Recipes, Challenges,
FloorPlan Pipeline Jobs, and Badges.
"""
from typing import List, Dict, Optional, Literal, Any, Tuple
from pydantic import BaseModel, Field, field_validator
import re

# ── 1. Lighting Preset Contract ──
class LightingPreset(BaseModel):
    id: str = Field(..., pattern=r"^[a-z0-9_]+$")
    label: str = Field(..., min_length=2, max_length=60)
    light_color: str = Field(..., pattern=r"^#(?:[0-9a-fA-F]{3}){1,2}$")
    intensity: float = Field(..., ge=0.0, le=5.0)
    angle: List[float] = Field(..., min_length=3, max_length=3)
    ambient_ratio: float = Field(..., ge=0.0, le=1.0)
    shadow_softness: float = Field(..., ge=0.0, le=1.0)
    fallback_overlay: str
    min_level: int = Field(default=7, ge=1, le=10)

# ── 2. Material Contract ──
class Material(BaseModel):
    id: str = Field(..., pattern=r"^mat_[a-z0-9_]+$")
    label: str = Field(..., min_length=2, max_length=60)
    surface_types: List[Literal["wall", "floor", "furniture"]] = Field(..., min_length=1)
    pbr_ref: str = Field(..., pattern=r"^pbr_[a-z0-9_]+$")
    fact_text: str = Field(..., min_length=10, max_length=240)
    min_level: int = Field(default=1, ge=1, le=10)

# ── 3. Style Recipe Contract ──
class FurnitureNudge(BaseModel):
    item_id: str
    delta_x: float = Field(..., ge=-2.0, le=2.0)
    delta_z: float = Field(..., ge=-2.0, le=2.0)
    rotation_degrees: Optional[float] = 0.0

class StyleRecipe(BaseModel):
    id: str = Field(..., pattern=r"^style_[a-z0-9_]+$")
    label: str = Field(..., min_length=2, max_length=60)
    wall_color: str = Field(..., pattern=r"^#(?:[0-9a-fA-F]{3}){1,2}$")
    floor_material_id: str
    furniture_color_map: Dict[str, str]
    lighting_preset_id: str
    furniture_nudges: List[FurnitureNudge] = []
    source: Literal["builtin", "ai_validated"] = "builtin"
    min_level: int = Field(default=7, ge=1, le=10)

    @field_validator("furniture_color_map")
    def validate_colors(cls, v):
        for k, col in v.items():
            if not re.match(r"^#(?:[0-9a-fA-F]{3}){1,2}$", col):
                raise ValueError(f"Invalid hex color '{col}' for item '{k}'")
        return v

# ── 4. Challenge Contract ──
class Challenge(BaseModel):
    id: str = Field(..., pattern=r"^chal_[a-z0-9_]+$")
    title: str = Field(..., min_length=3, max_length=100)
    prompt: str = Field(..., min_length=10, max_length=300)
    validation_rule: str
    level_requirement: int = Field(..., ge=1, le=10)
    hints: List[str] = []
    retry_allowed: bool = True

# ── 5. FloorPlan Pipeline Job Contract ──
class FloorPlanElement(BaseModel):
    element_type: Literal["wall", "door", "window", "furniture"]
    id: str
    coordinates: List[float]
    metadata: Dict[str, Any] = {}

class FloorPlanJob(BaseModel):
    id: str = Field(..., pattern=r"^[a-zA-Z0-9_\-]+$")
    status: Literal["queued", "analyzing", "generating", "validating", "ready", "needs_correction", "failed"]
    detected_elements: List[FloorPlanElement] = []
    provider_state: Literal["REAL", "MOCK", "FALLBACK", "UNAVAILABLE"]
    error_message: Optional[str] = None
    validation_issues: List[str] = []

# ── 6. Badge Contract ──
class Badge(BaseModel):
    id: str = Field(..., pattern=r"^badge_[a-z0-9_]+$")
    label: str = Field(..., min_length=3, max_length=60)
    icon: str
    condition: str
    first_level: int = Field(..., ge=1, le=10)
