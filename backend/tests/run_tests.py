"""
DesignVerse Backend Direct Unit Test Runner (No external test runner required)
Executes unit tests against FastAPI app endpoints and schema models.
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from app.main import app
from app.schemas.room_schema import Room3DSceneV2, RoomObjectModel
from app.services.provider_adapters import ProviderRegistry

class TestBackendAPI(unittest.TestCase):
    def test_schema_instantiation(self):
        scene = Room3DSceneV2(
            sceneId="scene_test_1",
            projectId="proj_test_1",
            objects=[
                RoomObjectModel(id="bed_01", category="bed", name="Bed", assetId="bed_01")
            ]
        )
        self.assertEqual(scene.schemaVersion, "2.0")
        self.assertEqual(len(scene.objects), 1)
        self.assertEqual(scene.objects[0].category, "bed")

    def test_provider_diagnostics(self):
        health = ProviderRegistry.check_health()
        self.assertEqual(health["vision"], "REAL")
        self.assertEqual(health["segmentation"], "REAL")
        self.assertEqual(health["depth"], "REAL")
        self.assertEqual(health["llm"], "REAL")

    def test_firebase_service_verification(self):
        from app.services.firebase_service import FirebaseService
        # Test simulated Google ID token resolution
        info = FirebaseService.verify_id_token("test_token_google_user_99")
        self.assertIsNotNone(info)
        self.assertEqual(info["uid"], "user_google_user_99")
        self.assertEqual(info["provider"], "google.com")

if __name__ == "__main__":
    unittest.main()
