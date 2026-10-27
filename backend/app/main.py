"""
DesignVerse — FastAPI Main Application Entrypoint
Integrates CORS middleware, API v1 routes, diagnostics, and health checks.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_v1_router
from app.learning.router import router as learning_router

app = FastAPI(
    title="DesignVerse — AI-Powered Interior Design Platform API",
    description="Backend services for 2D Floor Plan to Structured 3D Scene Reconstruction, Unity 3D Engine Bridge, Voice Commands & Furniture Recommendations.",
    version="2.0.0"
)

# CORS Configuration for Flutter Web and Unity WebGL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router)
app.include_router(learning_router)

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "app": "DesignVerse — AI-Powered Interior Design Platform",
        "tagline": "Imagine. Design. Transform.",
        "version": "2.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
