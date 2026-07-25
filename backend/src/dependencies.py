from functools import lru_cache
from uuid import UUID
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWTError, PyJWKClient
from src.core.config import settings
import s2sphere

security = HTTPBearer()

@lru_cache
def get_jwks_client() -> PyJWKClient:
    return PyJWKClient(f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json")

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UUID:
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

def get_s2_token(lat: float, lon: float, scale: int = 7) -> str:
    """
    Converts a coordinate into a Google S2 token at the specified level.
    Level 7 generates an area of ​​~5,300 km² (average radius of ~36 km).
    """
    cordinate = s2sphere.LatLng.from_degrees(lat, lon)
    leaf_cell = s2sphere.CellId.from_lat_lng(cordinate)
    target_cell = leaf_cell.parent(scale)
    return target_cell.to_token()