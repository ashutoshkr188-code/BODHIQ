"""File upload API route."""

import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import List

from app.core.config import get_settings
from app.core.deps import get_admin_user
from app.models.user import User

router = APIRouter(prefix="/upload", tags=["Uploads"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB


@router.post("")
async def upload_file(
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

    # Read and validate size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum 50MB.")

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
async def upload_multiple_files(
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

        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File '{file.filename}' is too large. Maximum 50MB per file.",
            )

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

