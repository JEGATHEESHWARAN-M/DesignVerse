"""
DesignVerse — AI Generative Rendering Service (v2.0)
Conditioned on 3D Scene Viewport (ControlNet / img2img spatial prior).
Asynchronous Job Queue with status progression, named states, and photorealistic generation.
"""

import uuid
import datetime
import asyncio
from typing import Dict, Any, Optional, List

# In-memory async job registry: {job_id: {status, progress, message, resultUrl, ...}}
JOBS_DB: Dict[str, Dict[str, Any]] = {}

CURATED_STYLES = [
    {
        "id": "modern",
        "name": "Modern Minimalist",
        "description": "Clean lines, neutral palette, recessed warm LED lighting, and matte surfaces.",
        "palette": ["#1A1A1A", "#E5E5E5", "#D4AF37", "#4F46E5"],
        "promptModifier": "architectural digest, high-end modern interior, clean lines, recessed lighting, 8k resolution, photorealistic octane render",
        "previewUrl": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
    },
    {
        "id": "scandinavian",
        "name": "Nordic Warmth",
        "description": "Light oak wood, cozy boucle textiles, abundant natural daylight, and soft foliage.",
        "palette": ["#F5F5F0", "#C8B29B", "#4A5568", "#22C55E"],
        "promptModifier": "scandinavian interior design, blonde oak wood, hygge, soft natural morning sunlight, cozy linen, indoor plants, photorealistic",
        "previewUrl": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
    },
    {
        "id": "luxury",
        "name": "Contemporary Luxury",
        "description": "Deep velvet upholstery, brushed brass fixtures, marble accents, and dramatic shadows.",
        "palette": ["#111827", "#B45309", "#E5E7EB", "#4338CA"],
        "promptModifier": "luxury penthouse interior, rich velvet, brushed gold brass details, calacatta marble, cinematic atmospheric lighting, architectural magazine",
        "previewUrl": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
    },
    {
        "id": "japandi",
        "name": "Japandi Zen",
        "description": "Organic minimalism, wabi-sabi textures, paper lanterns, and balanced tranquility.",
        "palette": ["#EAE4D8", "#786858", "#332F2A", "#65725A"],
        "promptModifier": "japandi style, wabi-sabi simplicity, shoji paper screens, dark walnut accents, peaceful zen interior, soft diffused daylight",
        "previewUrl": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
    },
    {
        "id": "industrial",
        "name": "Urban Loft",
        "description": "Exposed brick, matte black iron beams, distressed leather, and concrete floors.",
        "palette": ["#292524", "#78350F", "#71717A", "#B91C1C"],
        "promptModifier": "industrial soho loft, exposed brick wall, polished concrete floor, black steel frame, aged cognac leather sofa, moody studio lighting",
        "previewUrl": "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80",
    },
]

class GenerationJobService:
    @classmethod
    def list_styles(cls) -> List[Dict[str, Any]]:
        return CURATED_STYLES

    @classmethod
    def create_job(
        cls,
        scene_id: str,
        style: str,
        viewpoint_data: Optional[str] = None,
        prompt: Optional[str] = None,
        reference_image: Optional[str] = None,
    ) -> Dict[str, Any]:
        job_id = f"job_{uuid.uuid4().hex[:12]}"
        now = datetime.datetime.utcnow().isoformat()

        # Find style config
        style_match = next((s for s in CURATED_STYLES if s["id"] == style), CURATED_STYLES[0])

        job = {
            "jobId": job_id,
            "sceneId": scene_id,
            "style": style,
            "styleName": style_match["name"],
            "prompt": prompt or f"A gorgeous {style_match['name']} interior room layout",
            "status": "queued",
            "progress": 0.05,
            "statusMessage": "Conditioning 3D scene geometry & perspective grid...",
            "resultUrl": None,
            "createdAt": now,
            "updatedAt": now,
        }

        JOBS_DB[job_id] = job

        # Trigger background processing task safely
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(cls._simulate_diffusion_pipeline(job_id, style_match))
        except RuntimeError:
            # When invoked in synchronous worker thread without running loop
            import threading
            def run_in_new_loop():
                new_loop = asyncio.new_event_loop()
                asyncio.set_event_loop(new_loop)
                new_loop.run_until_complete(cls._simulate_diffusion_pipeline(job_id, style_match))
                new_loop.close()
            t = threading.Thread(target=run_in_new_loop, daemon=True)
            t.start()

        return {
            "jobId": job_id,
            "status": "queued",
            "estimatedTimeSeconds": 6,
            "statusMessage": job["statusMessage"],
        }

    @classmethod
    def get_job_status(cls, job_id: str) -> Optional[Dict[str, Any]]:
        return JOBS_DB.get(job_id)

    @classmethod
    async def _simulate_diffusion_pipeline(cls, job_id: str, style_config: Dict[str, Any]):
        """
        Simulates the multi-stage img2img / ControlNet diffusion generation:
        1. 3D Viewport depth & normal conditioning
        2. Style transfer & prompt embeddings
        3. Latent diffusion denoise pass
        4. High-resolution upscale
        """
        job = JOBS_DB.get(job_id)
        if not job:
            return

        try:
            # Stage 1: Spatial Conditioning
            await asyncio.sleep(1.2)
            job["status"] = "processing"
            job["progress"] = 0.30
            job["statusMessage"] = "Extracting camera perspective & depth normals from 3D scene..."
            job["updatedAt"] = datetime.datetime.utcnow().isoformat()

            # Stage 2: Latent Diffusion Denoising
            await asyncio.sleep(1.5)
            job["progress"] = 0.65
            job["statusMessage"] = f"Generating {style_config['name']} materials, fabrics & lighting..."
            job["updatedAt"] = datetime.datetime.utcnow().isoformat()

            # Stage 3: Upscaling & Final Polish
            await asyncio.sleep(1.5)
            job["progress"] = 0.90
            job["statusMessage"] = "Upscaling 4K photorealistic details & denoise pass..."
            job["updatedAt"] = datetime.datetime.utcnow().isoformat()

            # Stage 4: Completed
            await asyncio.sleep(1.0)
            job["status"] = "completed"
            job["progress"] = 1.00
            job["statusMessage"] = "Photorealistic render complete!"
            job["resultUrl"] = style_config["previewUrl"]
            job["completedAt"] = datetime.datetime.utcnow().isoformat()
            job["updatedAt"] = job["completedAt"]

        except Exception as e:
            job["status"] = "failed"
            job["statusMessage"] = f"Generation failed: {str(e)}"
            job["updatedAt"] = datetime.datetime.utcnow().isoformat()

    @classmethod
    def create_inpaint_job(
        cls,
        parent_job_id: str,
        mask_data: str,
        prompt: Optional[str] = None,
        replacement_asset_id: Optional[str] = None,
        replacement_category: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Phase 4: Creates localized inpainting / furniture swap job on top of an existing render.
        """
        job_id = f"inpaint_{uuid.uuid4().hex[:12]}"
        now = datetime.datetime.utcnow().isoformat()

        parent_job = JOBS_DB.get(parent_job_id)
        style_name = parent_job.get("styleName", "Custom Style") if parent_job else "Custom Style"

        swap_desc = f"swap with {replacement_category or 'furniture item'}" if replacement_asset_id else "refine masked patch"
        actual_prompt = prompt or f"Inpaint masked region: {swap_desc} in {style_name} harmonized lighting"

        job = {
            "jobId": job_id,
            "parentJobId": parent_job_id,
            "sceneId": parent_job.get("sceneId", "default_scene") if parent_job else "default_scene",
            "style": parent_job.get("style", "modern") if parent_job else "modern",
            "styleName": style_name,
            "prompt": actual_prompt,
            "status": "queued",
            "progress": 0.10,
            "statusMessage": "Extracting mask contours & local depth gradients...",
            "resultUrl": None,
            "replacementAssetId": replacement_asset_id,
            "createdAt": now,
            "updatedAt": now,
        }

        JOBS_DB[job_id] = job

        # Trigger background inpainting simulation
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(cls._simulate_inpaint_pipeline(job_id, parent_job))
        except RuntimeError:
            import threading
            def run_in_new_loop():
                new_loop = asyncio.new_event_loop()
                asyncio.set_event_loop(new_loop)
                new_loop.run_until_complete(cls._simulate_inpaint_pipeline(job_id, parent_job))
                new_loop.close()
            t = threading.Thread(target=run_in_new_loop, daemon=True)
            t.start()

        return {
            "jobId": job_id,
            "parentJobId": parent_job_id,
            "status": "queued",
            "estimatedTimeSeconds": 4,
            "statusMessage": job["statusMessage"],
        }

    @classmethod
    async def _simulate_inpaint_pipeline(cls, job_id: str, parent_job: Optional[Dict[str, Any]]):
        """Simulates localized inpaint diffusion and lighting harmonization."""
        job = JOBS_DB.get(job_id)
        if not job:
            return

        try:
            # Stage 1: Mask feathering & edge preservation
            await asyncio.sleep(1.0)
            job["status"] = "processing"
            job["progress"] = 0.40
            job["statusMessage"] = "Inpainting masked patch with ControlNet inpaint prior..."
            job["updatedAt"] = datetime.datetime.utcnow().isoformat()

            # Stage 2: Furniture insertion & shadow reconstruction
            await asyncio.sleep(1.2)
            job["progress"] = 0.75
            job["statusMessage"] = "Harmonizing ambient bounce lighting, contact shadows & materials..."
            job["updatedAt"] = datetime.datetime.utcnow().isoformat()

            # Stage 3: Completed
            await asyncio.sleep(0.8)
            job["status"] = "completed"
            job["progress"] = 1.00
            job["statusMessage"] = "Region regeneration and object swap complete!"
            # High-res swapped result image
            job["resultUrl"] = (
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
                if job.get("replacementAssetId")
                else "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
            )
            job["completedAt"] = datetime.datetime.utcnow().isoformat()
            job["updatedAt"] = job["completedAt"]

        except Exception as e:
            job["status"] = "failed"
            job["statusMessage"] = f"Inpaint failed: {str(e)}"
            job["updatedAt"] = datetime.datetime.utcnow().isoformat()

