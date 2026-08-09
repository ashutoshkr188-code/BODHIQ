"""CMS API routes — public GETs, admin PUTs for all CMS content."""

import markdown
import bleach
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_admin_user
from app.models.user import User
from app.schemas.cms import (
    HeaderContentUpdate, HeaderContentResponse,
    HomepageContentUpdate, HomepageContentResponse,
    PhilosophyContentUpdate, PhilosophyContentResponse,
    PromoContentUpdate, PromoContentResponse,
    FeaturedCollectionUpdate, FeaturedCollectionResponse,
    AboutContentUpdate, AboutContentResponse,
    CraftsmanshipContentUpdate, CraftsmanshipContentResponse,
    FAQItemCreate, FAQItemUpdate, FAQItemResponse, FAQBulkUpdate,
    CMSPageContentUpdate, CMSPageContentResponse,
)
from app.services.cms_service import cms_service

router = APIRouter(prefix="/content", tags=["CMS"])

# Allowed HTML tags for sanitized rich text
ALLOWED_TAGS = [
    "p", "br", "strong", "b", "em", "i", "u", "s",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "blockquote", "hr",
    "a",
]
ALLOWED_ATTRS = {"a": ["href", "title", "target"]}


def sanitize_html(raw: str | None) -> str | None:
    """Convert Markdown to HTML then sanitize to prevent XSS."""
    if not raw:
        return raw
    html = markdown.markdown(raw, extensions=["nl2br"])
    clean = bleach.clean(html, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS, strip=True)
    return clean


# ─── Header ───────────────────────────────────────────────────────────────────

@router.get("/header")
def get_header(db: Session = Depends(get_db)):
    """Public: get header/nav content."""
    return cms_service.get_header(db)


@router.put("/header")
def update_header(
    payload: HeaderContentUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Admin: update header/nav content."""
    return cms_service.update_header(db, payload)


# ─── Homepage / Hero ──────────────────────────────────────────────────────────

@router.get("/homepage")
def get_homepage(db: Session = Depends(get_db)):
    """Public: get homepage hero content."""
    return cms_service.get_homepage(db)


@router.put("/homepage")
def update_homepage(
    payload: HomepageContentUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Admin: update homepage hero content."""
    return cms_service.update_homepage(db, payload)


# ─── Philosophy ───────────────────────────────────────────────────────────────

@router.get("/philosophy")
def get_philosophy(db: Session = Depends(get_db)):
    """Public: get philosophy section content."""
    return cms_service.get_philosophy(db)


@router.put("/philosophy")
def update_philosophy(
    payload: PhilosophyContentUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Admin: update philosophy content."""
    return cms_service.update_philosophy(db, payload)


# ─── Promo ────────────────────────────────────────────────────────────────────

@router.get("/promo")
def get_promo(db: Session = Depends(get_db)):
    """Public: get promo banner content."""
    return cms_service.get_promo(db)


@router.put("/promo")
def update_promo(
    payload: PromoContentUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Admin: update promo banner content."""
    return cms_service.update_promo(db, payload)


# ─── Featured Collection ──────────────────────────────────────────────────────

@router.get("/featured-collection")
def get_featured_collection(db: Session = Depends(get_db)):
    """Public: get featured collection section content."""
    return cms_service.get_featured_collection(db)


@router.put("/featured-collection")
def update_featured_collection(
    payload: FeaturedCollectionUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Admin: update featured collection section."""
    return cms_service.update_featured_collection(db, payload)


# ─── About Page ───────────────────────────────────────────────────────────────

@router.get("/about")
def get_about(db: Session = Depends(get_db)):
    """Public: get about page content."""
    return cms_service.get_about(db)


@router.put("/about")
def update_about(
    payload: AboutContentUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Admin: update about page content."""
    return cms_service.update_about(db, payload)


# ─── Craftsmanship Page ───────────────────────────────────────────────────────

@router.get("/craftsmanship")
def get_craftsmanship(db: Session = Depends(get_db)):
    """Public: get craftsmanship page content."""
    return cms_service.get_craftsmanship(db)


@router.put("/craftsmanship")
def update_craftsmanship(
    payload: CraftsmanshipContentUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Admin: update craftsmanship page content."""
    return cms_service.update_craftsmanship(db, payload)


# ─── FAQs ─────────────────────────────────────────────────────────────────────

@router.get("/faqs")
def get_faqs(db: Session = Depends(get_db)):
    """Public: get all enabled FAQs."""
    return cms_service.get_faqs(db)


@router.get("/faqs/all")
def get_all_faqs(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Admin: get all FAQs including disabled."""
    return cms_service.get_all_faqs(db)


@router.post("/faqs")
def create_faq(
    payload: FAQItemCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Admin: create a new FAQ item."""
    return cms_service.create_faq(db, payload)


@router.put("/faqs/bulk")
def bulk_replace_faqs(
    payload: FAQBulkUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Admin: replace entire FAQ list (for reordering/bulk edit)."""
    return cms_service.bulk_replace_faqs(db, payload)


@router.put("/faqs/{faq_id}")
def update_faq(
    faq_id: int,
    payload: FAQItemUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Admin: update a FAQ item."""
    item = cms_service.update_faq(db, faq_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="FAQ item not found")
    return item


@router.delete("/faqs/{faq_id}")
def delete_faq(
    faq_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Admin: delete a FAQ item."""
    item = cms_service.delete_faq(db, faq_id)
    if not item:
        raise HTTPException(status_code=404, detail="FAQ item not found")
    return {"success": True}


# ─── Page Content ─────────────────────────────────────────────────────────────

VALID_PAGE_SLUGS = {
    # Info pages
    "values", "knowledge", "corporate", "media",
    "distributor", "grievance", "download-app",
    # Policy pages
    "shipping-policy", "return-policy", "payment-policy",
    "privacy", "terms", "disclaimer",
    # FAQ page metadata
    "faqs",
    # Collection/craftsmanship
    "collection",
}


@router.get("/page/{slug}")
def get_page(slug: str, db: Session = Depends(get_db)):
    """Public: get page content by slug."""
    if slug not in VALID_PAGE_SLUGS:
        raise HTTPException(status_code=404, detail="Page not found")
    row = cms_service.get_page(db, slug)
    if not row:
        # Return empty structure rather than 404
        return {
            "slug": slug,
            "title": None,
            "content": None,
            "meta_title": None,
            "meta_description": None,
            "section_enabled": True,
        }
    return row


@router.put("/page/{slug}")
def update_page(
    slug: str,
    payload: CMSPageContentUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Admin: update page content by slug."""
    if slug not in VALID_PAGE_SLUGS:
        raise HTTPException(status_code=404, detail="Page not found")
    return cms_service.update_page(db, slug, payload)


@router.get("/pages/all")
def list_all_pages(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Admin: list all page content records."""
    return cms_service.list_pages(db)
