"""
FastAPI dependency injection functions.
Provides database sessions and authenticated user extraction.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.security import verify_clerk_token, ClerkUser
from app.db.session import SessionLocal
from app.models.user import User

security_scheme = HTTPBearer(auto_error=False)


def get_db():
    """Yield a database session, ensuring cleanup after use."""
    # TODO: Migrate to AsyncSession (async def get_db() -> AsyncGenerator[AsyncSession, None])
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _sync_user_to_db(db: Session, clerk_user: ClerkUser) -> User:
    """
    Ensure the Clerk user exists in our local DB.
    Creates the user if they don't exist, or updates their info if they do.
    """
    user = db.query(User).filter(User.clerk_id == clerk_user.clerk_id).first()

    if not user:
        user = User(
            clerk_id=clerk_user.clerk_id,
            email=clerk_user.email or "",
            first_name=clerk_user.first_name,
            last_name=clerk_user.last_name,
            image_url=clerk_user.image_url,
            role="user",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update fields that may have changed in Clerk
        updated = False
        if clerk_user.email and user.email != clerk_user.email:
            user.email = clerk_user.email
            updated = True
        if clerk_user.first_name and user.first_name != clerk_user.first_name:
            user.first_name = clerk_user.first_name
            updated = True
        if clerk_user.last_name and user.last_name != clerk_user.last_name:
            user.last_name = clerk_user.last_name
            updated = True
        if clerk_user.image_url and user.image_url != clerk_user.image_url:
            user.image_url = clerk_user.image_url
            updated = True
        if updated:
            db.commit()
            db.refresh(user)

    return user


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Extract and verify the Clerk JWT, then sync/return the local DB user.
    Raises 401 if no token or invalid token.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        clerk_user = await verify_clerk_token(credentials.credentials)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

    return _sync_user_to_db(db, clerk_user)


async def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> User | None:
    """
    Like get_current_user but returns None instead of raising 401.
    Used for endpoints that work for both authenticated and anonymous users.
    """
    if not credentials:
        return None

    try:
        clerk_user = await verify_clerk_token(credentials.credentials)
        return _sync_user_to_db(db, clerk_user)
    except ValueError:
        return None


async def get_admin_user(
    user: User = Depends(get_current_user),
) -> User:
    """
    Verify the current user has admin role.
    Raises 403 if not an admin.
    """
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user
