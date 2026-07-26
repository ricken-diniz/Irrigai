from functools import lru_cache
from typing import List
from uuid import UUID
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWTError, PyJWKClient
from src.core.config import settings
import h3

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

def get_h3_token(lat: float, lon: float, scale: int = 4) -> str:
    """
    Converts a cordinate into h3 cell.
    H3 is a discrete global grid system for indexing geographies into a hexagonal grid.
    See more in: https://h3geo.org/
    """
    return h3.latlng_to_cell(lat, lon, scale)

def get_nearest_marked_cell(marked_cells: List[str], current_cell) -> str:
    """
    Returns the nearest cell from a list of marked_cells given a current_cell. 
    """
    distances = {
        cell: h3.grid_distance(current_cell, cell) 
        for cell in marked_cells
    }
    return min(distances, key=distances.get)