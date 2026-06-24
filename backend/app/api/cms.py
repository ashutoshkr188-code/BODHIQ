from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_admin_user
from app.models.user import User
from app.services.cms_service import cms_service
from app.schemas.cms import (
    HeaderContentUpdate, HeaderContentResponse,
    PhilosophyContentUpdate, PhilosophyContentResponse,
    HomepageContentUpdate, HomepageContentResponse,
    PromoContentUpdate, PromoContentResponse
)

router = APIRouter(prefix="/content", tags=["CMS Content"])

@router.get("/header", response_model=HeaderContentResponse)
def get_header(db: Session = Depends(get_db)):
    return cms_service.get_header(db)

@router.put("/header", response_model=HeaderContentResponse)
def update_header(
    payload: HeaderContentUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    return cms_service.update_header(db, payload)

@router.get("/philosophy", response_model=PhilosophyContentResponse)
def get_philosophy(db: Session = Depends(get_db)):
    return cms_service.get_philosophy(db)

@router.put("/philosophy", response_model=PhilosophyContentResponse)
def update_philosophy(
    payload: PhilosophyContentUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    return cms_service.update_philosophy(db, payload)

@router.get("/homepage", response_model=HomepageContentResponse)
def get_homepage(db: Session = Depends(get_db)):
    return cms_service.get_homepage(db)

@router.put("/homepage", response_model=HomepageContentResponse)
def update_homepage(
    payload: HomepageContentUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    return cms_service.update_homepage(db, payload)

@router.get("/promo", response_model=PromoContentResponse)
def get_promo(db: Session = Depends(get_db)):
    return cms_service.get_promo(db)

@router.put("/promo", response_model=PromoContentResponse)
def update_promo(
    payload: PromoContentUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    print("--- UPDATE PROMO API CALLED ---")
    print("Payload:", payload.model_dump())
    # Diagnostic helper: write payload to a file
    try:
        with open("last_promo_payload.txt", "w", encoding="utf-8") as f:
            import json
            json.dump(payload.model_dump(), f, indent=2)
    except Exception as e:
        print("Failed to write diagnostic file:", e)
    return cms_service.update_promo(db, payload)
