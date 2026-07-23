"""File upload API route."""

import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Request
from typing import List

from app.core.config import get_settings
from app.core.deps import get_admin_user
from app.main import limiter
from app.models.user import User

router = APIRouter(prefix="/upload", tags=["Uploads"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

ALLOWED_MIME_TYPES = {
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "video/mp4", "video/webm", "video/quicktime", "video/x-matroska",
    "application/octet-stream"  # Browser fallback for some video files
}


def _validate_file_magic(content: bytes, ext: str) -> None:
    """Verify file magic bytes against extension (AUD-13)."""
    if len(content) < 12:
        raise HTTPException(status_code=400, detail="Invalid or empty file.")

    if ext in (".jpg", ".jpeg"):
        if not content.startswith(b"\xff\xd8\xff"):
            raise HTTPException(status_code=400, detail="File header does not match JPEG format.")
    elif ext == ".png":
        if not content.startswith(b"\x89PNG\r\n\x1a\n"):
            raise HTTPException(status_code=400, detail="File header does not match PNG format.")
    elif ext == ".gif":
        if not (content.startswith(b"GIF87a") or content.startswith(b"GIF89a")):
            raise HTTPException(status_code=400, detail="File header does not match GIF format.")
    elif ext == ".webp":
        if not (content[:4] == b"RIFF" and content[8:12] == b"WEBP"):
            raise HTTPException(status_code=400, detail="File header does not match WEBP format.")
    elif ext in (".mp4", ".mov"):
        if b"ftyp" not in content[:32] and b"moov" not in content[:32] and not content.startswith(b"\x00\x00\x00"):
            raise HTTPException(status_code=400, detail="File header does not match MP4/MOV video format.")
    elif ext == ".webm":
        if not content.startswith(b"\x1a\x45\xdf\xa3"):
            raise HTTPException(status_code=400, detail="File header does not match WEBM video format.")


@router.post("")
@limiter.limit("10/minute")  # AUD-05
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    admin: User = Depends(get_admin_user),
):
    """Upload an image or video file (admin only). Returns the file URL."""
    settings = get_settings()

    # Validate extension
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type {ext} not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Validate MIME type header if present
    if file.content_type and file.content_type.lower() not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"MIME type '{file.content_type}' not allowed.",
        )

    # Read and validate size & magic bytes
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum 50MB.")

    _validate_file_magic(content, ext)

    # Generate unique filename
    unique_name = f"{uuid.uuid4().hex}{ext}"
    upload_dir = settings.UPLOAD_DIR
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, unique_name)
    with open(file_path, "wb") as f:
        f.write(content)

    return {
        "success": True,
        "url": f"/uploads/{unique_name}",
        "filename": unique_name,
    }


@router.post("/multiple")
@limiter.limit("5/minute")  # AUD-05
async def upload_multiple_files(
    request: Request,
    files: List[UploadFile] = File(...),
    admin: User = Depends(get_admin_user),
):
    """Upload multiple image/video files (admin only). Returns array of file info."""
    settings = get_settings()
    upload_dir = settings.UPLOAD_DIR
    os.makedirs(upload_dir, exist_ok=True)

    results = []
    for file in files:
        ext = os.path.splitext(file.filename or "")[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"File '{file.filename}' has type {ext} which is not allowed.",
            )

        if file.content_type and file.content_type.lower() not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"File '{file.filename}' has disallowed MIME type '{file.content_type}'.",
            )

        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File '{file.filename}' is too large. Maximum 50MB per file.",
            )

        _validate_file_magic(content, ext)

        unique_name = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(upload_dir, unique_name)
        with open(file_path, "wb") as f:
            f.write(content)

        media_type = "video" if ext in VIDEO_EXTENSIONS else "image"
        results.append({
            "url": f"/uploads/{unique_name}",
            "filename": unique_name,
            "type": media_type,
        })

    return {"success": True, "files": results}


@router.get("/all")
def list_uploaded_files(
    admin: User = Depends(get_admin_user),
):
    """List all uploaded files (admin only)."""
    settings = get_settings()
    upload_dir = settings.UPLOAD_DIR
    if not os.path.exists(upload_dir):
        return {"files": []}

    files = []
    for filename in os.listdir(upload_dir):
        ext = os.path.splitext(filename)[1].lower()
        if ext in ALLOWED_EXTENSIONS:
            media_type = "video" if ext in VIDEO_EXTENSIONS else "image"
            filepath = os.path.join(upload_dir, filename)
            try:
                stat = os.stat(filepath)
                created_at = stat.st_mtime
            except Exception:
                created_at = 0

            files.append({
                "url": f"/uploads/{filename}",
                "filename": filename,
                "type": media_type,
                "created_at": created_at,
            })

    # Sort by creation time desc
    files.sort(key=lambda x: x["created_at"], reverse=True)
    return {"files": files}

