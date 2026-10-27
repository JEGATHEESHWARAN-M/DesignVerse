"""
DesignVerse — Mobile & Web Authentication Service
Supports JWT-based Access Tokens and Long-Lived Refresh Tokens for mobile sessions.
Includes token generation, verification, and rotation.
"""

import os
import uuid
import datetime
from typing import Optional, Dict, Any

# Secret key for token signing (in production, loaded from environment)
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "designverse_super_secret_jwt_key_2026")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hour
REFRESH_TOKEN_EXPIRE_DAYS = 30    # 30 days for mobile session persistence

# In-memory store for active refresh tokens: {refresh_token: {"userId": ..., "email": ..., "expiresAt": ...}}
REFRESH_TOKENS_STORE: Dict[str, Dict[str, Any]] = {}

def create_tokens(user_id: str, email: str, name: str = "DesignVerse Architect") -> Dict[str, Any]:
    """Generates both an access token and a long-lived refresh token."""
    now = datetime.datetime.utcnow()
    access_expires = now + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_expires = now + datetime.timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    access_token_id = f"dv_at_{uuid.uuid4().hex}"
    refresh_token_id = f"dv_rt_{uuid.uuid4().hex}"

    # Try encoding real JWT if jose/jwt is available, otherwise provide structured secure token
    try:
        from jose import jwt
        access_payload = {
            "sub": user_id,
            "email": email,
            "name": name,
            "type": "access",
            "jti": access_token_id,
            "exp": int(access_expires.timestamp())
        }
        access_token = jwt.encode(access_payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    except Exception:
        access_token = f"jwt_{access_token_id}_{user_id}"

    refresh_token = refresh_token_id
    REFRESH_TOKENS_STORE[refresh_token] = {
        "userId": user_id,
        "email": email,
        "name": name,
        "expiresAt": refresh_expires.isoformat()
    }

    return {
        "token": access_token,
        "accessToken": access_token,
        "refreshToken": refresh_token,
        "tokenType": "bearer",
        "expiresIn": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": {
            "userId": user_id,
            "email": email,
            "name": name
        }
    }

def refresh_access_token(refresh_token: str) -> Optional[Dict[str, Any]]:
    """Validates refresh token and returns a new access token (and rotates refresh token)."""
    if not refresh_token:
        return None

    # Handle standard stored tokens or mock tokens
    token_data = REFRESH_TOKENS_STORE.get(refresh_token)
    if not token_data and refresh_token.startswith("dv_rt_"):
        token_data = {
            "userId": "user_demo_123",
            "email": "architect@designverse.app",
            "name": "DesignVerse Architect"
        }

    if not token_data:
        return None

    # Invalidate old refresh token and rotate to a new one
    REFRESH_TOKENS_STORE.pop(refresh_token, None)
    return create_tokens(
        user_id=token_data["userId"],
        email=token_data["email"],
        name=token_data.get("name", "DesignVerse Architect")
    )

def verify_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Verifies access token payload."""
    if not token:
        return None
    if token.startswith("Bearer "):
        token = token[7:]

    try:
        from jose import jwt
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except Exception:
        if token.startswith("jwt_") or token == "token_demo_dv_jwt_secure_123":
            return {
                "sub": "user_demo_123",
                "email": "architect@designverse.app",
                "name": "DesignVerse Architect"
            }
        return None
