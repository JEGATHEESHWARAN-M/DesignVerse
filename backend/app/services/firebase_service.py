"""
DesignVerse — Firebase Integration Service
Provides Firebase Authentication verification and Firestore cloud sync.
Falls back safely to local mock / client-side storage when credentials are not yet supplied.
"""
import os
import json
from typing import Optional, Dict, Any

class FirebaseService:
    _initialized = False
    _db = None
    _auth = None

    @classmethod
    def initialize(cls):
        """Initializes Firebase Admin SDK if service account key or ADC is available."""
        if cls._initialized:
            return True

        cred_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT_KEY") or os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
        if cred_path and os.path.exists(cred_path):
            try:
                import firebase_admin
                from firebase_admin import credentials, firestore, auth
                
                if not firebase_admin._apps:
                    cred = credentials.Certificate(cred_path)
                    firebase_admin.initialize_app(cred)
                cls._db = firestore.client()
                cls._auth = auth
                cls._initialized = True
                return True
            except Exception as e:
                print(f"[FirebaseService] Warning: Failed to initialize Firebase Admin SDK: {e}")
                return False
        return False

    @classmethod
    def verify_id_token(cls, token: str) -> Optional[Dict[str, Any]]:
        """Verifies a Google / Firebase JWT ID token."""
        if not cls.initialize():
            # Graceful simulation when running in offline/local mode
            if token.startswith("test_token_"):
                return {
                    "uid": "user_" + token.replace("test_token_", ""),
                    "email": "user@example.com",
                    "name": "DesignVerse User",
                    "provider": "google.com"
                }
            return None

        try:
            from firebase_admin import auth
            decoded_token = auth.verify_id_token(token)
            return decoded_token
        except Exception as e:
            print(f"[FirebaseService] Token verification error: {e}")
            return None

    @classmethod
    def save_project(cls, user_id: str, project_id: str, project_data: Dict[str, Any]) -> bool:
        """Saves or updates a user's 3D design project in Firestore."""
        if not cls.initialize():
            return False

        try:
            doc_ref = cls._db.collection("users").document(user_id).collection("projects").document(project_id)
            doc_ref.set(project_data, merge=True)
            return True
        except Exception as e:
            print(f"[FirebaseService] Error saving project to Firestore: {e}")
            return False

    @classmethod
    def get_user_projects(cls, user_id: str) -> list:
        """Retrieves all saved projects for a user from Firestore."""
        if not cls.initialize():
            return []

        try:
            docs = cls._db.collection("users").document(user_id).collection("projects").stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"[FirebaseService] Error retrieving projects from Firestore: {e}")
            return []
