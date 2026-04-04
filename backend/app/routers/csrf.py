"""CSRF token endpoints."""
from fastapi import APIRouter, Response

from app.csrf import generate_csrf_token
from app.config import settings

router = APIRouter(prefix="/api/csrf", tags=["csrf"])


@router.get("/token")
async def get_csrf_token(response: Response):
    """Get a CSRF token for authenticated requests."""
    token = generate_csrf_token()
    
    # Determine cookie domain - use .adajoon.com for both www and non-www
    cookie_domain = ".adajoon.com" if settings.env == "production" else None
    
    # Set in cookie for convenience
    response.set_cookie(
        key="csrf_token",
        value=token,
        httponly=False,  # Frontend needs to read this
        secure=True,
        samesite="lax",
        max_age=3600,
        path="/",
        domain=cookie_domain,
    )
    
    # Also return in body
    return {"csrf_token": token}


@router.post("/logout")
async def logout(response: Response):
    """Logout and clear auth cookies."""
    cookie_domain = ".adajoon.com" if settings.env == "production" else None
    response.delete_cookie("auth_token", path="/", domain=cookie_domain)
    response.delete_cookie("csrf_token", path="/", domain=cookie_domain)
    return {"status": "logged_out"}
