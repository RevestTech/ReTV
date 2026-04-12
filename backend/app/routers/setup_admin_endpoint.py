"""
Temporary one-time admin setup endpoint.
DELETE THIS FILE after running the setup once!
"""
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db

router = APIRouter(prefix="/api/setup", tags=["setup"])
logger = logging.getLogger(__name__)

# Secret token to prevent unauthorized access (change this!)
SETUP_SECRET = "adajoon-admin-setup-2026-khash"


@router.post("/admin")
async def setup_admin(
    secret: str,
    db: AsyncSession = Depends(get_db)
):
    """
    One-time setup endpoint to run admin migration and configure admin user.
    
    Usage: POST /api/setup/admin with body: {"secret": "adajoon-admin-setup-2026-khash"}
    
    DELETE THIS ROUTER after running once!
    """
    if secret != SETUP_SECRET:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid setup secret"
        )
    
    try:
        logger.info("Running admin setup migration...")
        
        # Add columns if they don't exist
        await db.execute(text("""
            ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ DEFAULT NULL
        """))
        await db.execute(text("""
            ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE NOT NULL
        """))
        await db.execute(text("""
            ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user' NOT NULL
        """))
        
        # Create indexes
        await db.execute(text("""
            CREATE INDEX IF NOT EXISTS ix_users_is_admin ON users (is_admin)
        """))
        await db.execute(text("""
            CREATE INDEX IF NOT EXISTS ix_users_role ON users (role)
        """))
        
        # Make khash@khash.com an admin
        result = await db.execute(text("""
            UPDATE users 
            SET is_admin = TRUE, role = 'admin' 
            WHERE email = 'khash@khash.com'
            RETURNING email, is_admin, role, created_at
        """))
        
        await db.commit()
        
        updated_user = result.fetchone()
        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User khash@khash.com not found. Please log in at least once first."
            )
        
        logger.info(f"Admin user configured: {updated_user[0]}")
        
        return {
            "success": True,
            "message": "Admin setup completed successfully!",
            "admin_user": {
                "email": updated_user[0],
                "is_admin": updated_user[1],
                "role": updated_user[2],
                "created_at": updated_user[3].isoformat() if updated_user[3] else None
            },
            "warning": "DELETE /backend/app/routers/setup_admin_endpoint.py after running this once!"
        }
        
    except Exception as e:
        logger.error(f"Admin setup failed: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Setup failed: {str(e)}"
        )
