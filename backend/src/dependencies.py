from functools import lru_cache
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWTError, PyJWKClient
from src.core.config import settings

security = HTTPBearer()

@lru_cache
def get_jwks_client() -> PyJWKClient:
    return PyJWKClient(f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json")

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    try:
        jwks_client = get_jwks_client()
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256", "HS256"],
            options={
                "verify_aud": False,
                "verify_iss": False
                },
        )

        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid Token!")

        return user_id

    except PyJWTError as e:
        print(f"JWT Validation Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials or invalid token.",
        )