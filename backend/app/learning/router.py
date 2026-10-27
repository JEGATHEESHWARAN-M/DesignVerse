"""
DesignVerse Learning Engine — Learning API Router
Mounts at /api/v1/learning
"""
from __future__ import annotations
import uuid
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from .xp_engine import XPEngine
from .feature_unlock import FeatureUnlockManager

router = APIRouter(prefix="/api/v1/learning", tags=["learning"])


# ─── Request/Response Models ────────────────────────────────────────────────

class AwardXPRequest(BaseModel):
    user_id: str
    event_id: Optional[str] = None   # auto-generated if omitted
    source: str                       # e.g. "lesson:l1_what_is_a_room"
    xp: int
    meta: Optional[dict] = None

class PlacementRequest(BaseModel):
    user_id: str
    level: int


# ─── Endpoints ──────────────────────────────────────────────────────────────

@router.get("/status/{user_id}")
def get_learning_status(user_id: str):
    """Current XP, level, progress, and all unlocked features."""
    status = XPEngine.get_status(user_id)
    status["unlocked_features"] = FeatureUnlockManager.get_all_unlocked_features(user_id)
    return status


@router.post("/xp/award")
def award_xp(req: AwardXPRequest):
    """Award XP to a user (idempotent)."""
    if req.xp <= 0 or req.xp > 5000:
        raise HTTPException(status_code=400, detail="XP must be between 1 and 5000")
    event_id = req.event_id or str(uuid.uuid4())
    result = XPEngine.award(req.user_id, event_id, req.source, req.xp, req.meta)
    result["event_id"] = event_id
    result["unlocked_features"] = FeatureUnlockManager.get_all_unlocked_features(req.user_id)
    return result


@router.get("/xp/history/{user_id}")
def get_xp_history(user_id: str):
    """Full append-only XP ledger for a user."""
    return {"user_id": user_id, "history": XPEngine.get_history(user_id)}


@router.get("/features/{user_id}")
def get_features(user_id: str):
    """All unlocked features for a user."""
    return {
        "user_id": user_id,
        "level": FeatureUnlockManager.get_effective_level(user_id),
        "unlocked_features": FeatureUnlockManager.get_all_unlocked_features(user_id),
    }


@router.get("/feature-check/{user_id}/{feature_id}")
def check_feature(user_id: str, feature_id: str):
    """Check if a specific feature is unlocked. Returns unlock path if not."""
    unlocked = FeatureUnlockManager.is_unlocked(user_id, feature_id)
    if unlocked:
        return {"user_id": user_id, "feature_id": feature_id, "unlocked": True}
    reason = FeatureUnlockManager.unlock_reason(user_id, feature_id)
    return {"user_id": user_id, "feature_id": feature_id, "unlocked": False, **reason}


@router.post("/placement")
def set_placement(req: PlacementRequest):
    """Set user's starting level after Placement Check."""
    if req.level < 1 or req.level > 10:
        raise HTTPException(status_code=400, detail="Level must be 1-10")
    FeatureUnlockManager.set_placement_level(req.user_id, req.level)
    status = XPEngine.get_status(req.user_id)
    status["placement_level"] = req.level
    status["unlocked_features"] = FeatureUnlockManager.get_all_unlocked_features(req.user_id)
    return status


@router.get("/levels")
def get_levels():
    """Return all level definitions (content as data)."""
    import json, pathlib
    p = pathlib.Path(__file__).parent.parent.parent.parent / "learning_content" / "levels" / "levels.json"
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/skills")
def get_skills():
    """Return the skills mastery DAG."""
    import json, pathlib
    p = pathlib.Path(__file__).parent.parent.parent.parent / "learning_content" / "skills" / "skills_dag.json"
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/challenges")
def get_challenges():
    """Return all interactive interior design challenges."""
    import json, pathlib
    p = pathlib.Path(__file__).parent.parent.parent.parent / "learning_content" / "challenges" / "challenges.json"
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tutor/advice")
def get_tutor_advice(topic: str = "flow", user_level: int = 1):
    """Scoped AI interior design pedagogical coaching."""
    from .ai_tutor import AITutorService
    return AITutorService.get_tutor_advice(topic, user_level)


# ─── V2 Enhanced Data Contract Endpoints ────────────────────────────────────

@router.get("/lighting-presets")
def get_lighting_presets():
    """Return all server-driven lighting presets (Level 7+)."""
    import json, pathlib
    from app.schemas.contracts import LightingPreset
    p = pathlib.Path(__file__).parent.parent.parent.parent / "learning_content" / "lighting" / "lighting_presets.json"
    try:
        raw = json.loads(p.read_text(encoding="utf-8"))
        return [LightingPreset(**item).model_dump() for item in raw]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load lighting presets: {str(e)}")


@router.get("/materials-catalog")
def get_materials_catalog():
    """Return child-friendly materials with pre-written educational facts."""
    import json, pathlib
    from app.schemas.contracts import Material
    p = pathlib.Path(__file__).parent.parent.parent.parent / "learning_content" / "materials" / "materials_catalog.json"
    try:
        raw = json.loads(p.read_text(encoding="utf-8"))
        return [Material(**item).model_dump() for item in raw]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load materials catalog: {str(e)}")


@router.get("/style-recipes")
def get_style_recipes():
    """Return all 7 predefined room style recipes."""
    import json, pathlib
    from app.schemas.contracts import StyleRecipe
    p = pathlib.Path(__file__).parent.parent.parent.parent / "learning_content" / "styles" / "style_recipes.json"
    try:
        raw = json.loads(p.read_text(encoding="utf-8"))
        return [StyleRecipe(**item).model_dump() for item in raw]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load style recipes: {str(e)}")


@router.get("/badges")
def get_badges():
    """Return the activity & level milestone badges."""
    import json, pathlib
    from app.schemas.contracts import Badge
    p = pathlib.Path(__file__).parent.parent.parent.parent / "learning_content" / "badges" / "badges.json"
    try:
        raw = json.loads(p.read_text(encoding="utf-8"))
        return [Badge(**item).model_dump() for item in raw]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load badges: {str(e)}")


@router.post("/style-recipes/validate")
def validate_style_recipe(recipe: dict):
    """Validate a proposed style recipe against the contract and collision boundaries."""
    from app.schemas.contracts import StyleRecipe
    try:
        validated = StyleRecipe(**recipe)
        return {"valid": True, "recipe": validated.model_dump(), "source": validated.source}
    except Exception as e:
        return {"valid": False, "error": str(e), "fallback_style_id": "style_nature_calm"}


