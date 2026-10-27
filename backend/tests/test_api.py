"""
DesignVerse Backend Test Suite
Tests authentication, project management, CV room analysis, 2D-to-3D scene reconstruction,
voice command intent parsing, recommendations, budget engine, and provider diagnostics.
"""

from fastapi.testclient import TestClient
import sys
import os

# Add app to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "DesignVerse" in data["app"]

def test_diagnostics_providers():
    response = client.get("/api/v1/diagnostics/providers")
    assert response.status_code == 200
    providers = response.json()
    assert providers["vision"] == "REAL"
    assert providers["segmentation"] == "REAL"
    assert providers["depth"] == "REAL"
    assert providers["llm"] == "REAL"

def test_auth_login():
    response = client.post("/api/v1/auth/login", json={"email": "architect@designverse.app", "password": "password123"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "token" in data
    assert "refreshToken" in data
    assert "accessToken" in data
    assert data["tokenType"] == "bearer"

def test_auth_refresh_token_rotation():
    # Login to obtain tokens
    login_res = client.post("/api/v1/auth/login", json={"email": "architect@designverse.app"})
    assert login_res.status_code == 200
    tokens = login_res.json()
    orig_refresh = tokens["refreshToken"]
    
    # Refresh access token
    refresh_res = client.post("/api/v1/auth/refresh", json={"refreshToken": orig_refresh})
    assert refresh_res.status_code == 200
    new_tokens = refresh_res.json()
    assert new_tokens["status"] == "success"
    assert "accessToken" in new_tokens
    assert "refreshToken" in new_tokens
    # Verify token rotation
    assert new_tokens["refreshToken"] != orig_refresh

def test_auth_me():
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["user"]["email"] == "architect@designverse.app"

def test_reconstruction_generate():
    response = client.post("/api/v1/reconstruction/generate", json={"projectId": "proj_test_123"})
    assert response.status_code == 200
    scene = response.json()
    assert scene["schemaVersion"] == "2.0"
    assert len(scene["objects"]) >= 4
    assert scene["objects"][0]["category"] in ["bed", "sofa", "table", "chair"]

def test_reconstruction_ar_scan():
    response = client.post(
        "/api/v1/reconstruction/ar_scan",
        json={
            "projectId": "proj_ar_456",
            "scanType": "ar_scan",
            "dimensions": {"width": 5.4, "length": 4.8, "height": 2.8},
            "wallColor": "#20222e"
        }
    )
    assert response.status_code == 200
    scene = response.json()
    assert scene["schemaVersion"] == "2.0"
    assert scene["room"]["width"] == 5.4
    assert scene["room"]["length"] == 4.8
    assert len(scene["architecture"]["walls"]) == 4
    assert len(scene["objects"]) >= 3

def test_voice_command():
    response = client.post("/api/v1/voice/command", json={"text": "change wall color to blue"})
    assert response.status_code == 200
    res = response.json()
    assert res["status"] == "success"
    assert res["intent"] == "RECOLOR_OBJECT"

def test_budget_estimate():
    response = client.post("/api/v1/budget/estimate", json={"tier": "medium"})
    assert response.status_code == 200
    res = response.json()
    assert res["currency"] == "INR"
    assert res["breakdown"]["totalINR"] == 85000

def test_ai_styles():
    response = client.get("/api/v1/ai/styles")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["styles"]) >= 5
    style_ids = [s["id"] for s in data["styles"]]
    assert "modern" in style_ids
    assert "scandinavian" in style_ids
    assert "japandi" in style_ids

def test_ai_generate_and_status():
    # Submit job
    gen_res = client.post(
        "/api/v1/ai/generate",
        json={
            "sceneId": "scene_test_999",
            "style": "scandinavian",
            "prompt": "Warm morning lighting, light wood floors",
            "viewpointData": "camera_pos:[2.0,1.5,3.0]"
        }
    )
    assert gen_res.status_code == 200
    job_data = gen_res.json()
    assert job_data["status"] == "success"
    job_id = job_data["jobId"]
    assert job_id.startswith("job_")
    assert job_data["estimatedTimeSeconds"] == 6

    # Check immediate job status
    status_res = client.get(f"/api/v1/ai/jobs/{job_id}")
    assert status_res.status_code == 200
    status_data = status_res.json()
    assert status_data["status"] == "success"
    assert status_data["job"]["jobId"] == job_id
    assert status_data["job"]["style"] == "scandinavian"
    assert status_data["job"]["status"] in ["queued", "processing", "completed"]

def test_ai_job_not_found():
    response = client.get("/api/v1/ai/jobs/non_existent_job_123")
    assert response.status_code == 404

def test_ai_inpaint_job():
    inpaint_res = client.post(
        "/api/v1/ai/inpaint",
        json={
            "parentJobId": "job_parent_123",
            "maskData": "poly:[[100,100],[250,100],[250,300],[100,300]]",
            "prompt": "Swap with curved velvet bouclé sofa",
            "replacementAssetId": "sofa_curved_velvet_01",
            "replacementCategory": "sofa"
        }
    )
    assert inpaint_res.status_code == 200
    data = inpaint_res.json()
    assert data["status"] == "success"
    assert data["jobId"].startswith("inpaint_")
    assert data["parentJobId"] == "job_parent_123"

    # Verify status retrieval
    status_res = client.get(f"/api/v1/ai/jobs/{data['jobId']}")
    assert status_res.status_code == 200
    status_data = status_res.json()
    assert status_data["job"]["jobId"] == data["jobId"]
    assert status_data["job"]["replacementAssetId"] == "sofa_curved_velvet_01"

