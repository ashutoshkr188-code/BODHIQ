"""
Database engine and session configuration.
Uses SQLite with WAL mode for better concurrent read performance.
"""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.config import get_settings

settings = get_settings()

# For SQLite, we need check_same_thread=False for FastAPI's async context
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False,
    pool_pre_ping=True,
)

# Enable WAL mode and foreign keys for SQLite
if settings.DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.execute("PRAGMA busy_timeout=5000")
        cursor.close()


# TODO: Migrate to AsyncSession and asyncpg for non-blocking I/O
# from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
# async_engine = create_async_engine(...)
# AsyncSessionLocal = async_sessionmaker(...)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


def init_db():
    """Create all tables. Called on app startup."""
    # Import all models so they're registered with Base
    import app.models  # noqa: F401
    Base.metadata.create_all(bind=engine)
