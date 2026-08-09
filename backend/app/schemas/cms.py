from pydantic import BaseModel
from typing import List, Literal, Optional


# ─── Shared ───────────────────────────────────────────────────────────────────

class BackgroundMediaItem(BaseModel):
    type: Literal["image", "video"]
    url: str
    order: int


class NavLinkSchema(BaseModel):
    title: str
    href: str
    dropdown: Optional[List["NavLinkSchema"]] = None

NavLinkSchema.model_rebuild()


# ─── Header ───────────────────────────────────────────────────────────────────

class HeaderContentUpdate(BaseModel):
    logo_text: Optional[str] = None
    nav_links: Optional[List[NavLinkSchema]] = None
    background_media: Optional[List[BackgroundMediaItem]] = None
    mobile_tagline: Optional[str] = None


class HeaderContentResponse(BaseModel):
    logo_text: str
    nav_links: List[dict]
    background_media: List[dict]
    mobile_tagline: Optional[str] = None


# ─── Homepage / Hero ──────────────────────────────────────────────────────────

class HomepageContentUpdate(BaseModel):
    badge_text: Optional[str] = None
    badge_visible: Optional[bool] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_description: Optional[str] = None
    hero_cta: Optional[str] = None
    hero_cta_link: Optional[str] = None
    section_enabled: Optional[bool] = None
    background_media: Optional[List[BackgroundMediaItem]] = None


class HomepageContentResponse(BaseModel):
    badge_text: Optional[str] = None
    badge_visible: bool
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_description: Optional[str] = None
    hero_cta: Optional[str] = None
    hero_cta_link: Optional[str] = None
    section_enabled: bool
    background_media: List[dict]


# ─── Philosophy ───────────────────────────────────────────────────────────────

class PhilosophyContentUpdate(BaseModel):
    section_enabled: Optional[bool] = None
    eyebrow_label: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    description2: Optional[str] = None
    description3: Optional[str] = None
    image_url: Optional[str] = None
    signature_title: Optional[str] = None
    signature_subtitle: Optional[str] = None


class PhilosophyContentResponse(BaseModel):
    section_enabled: bool
    eyebrow_label: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    description2: Optional[str] = None
    description3: Optional[str] = None
    image_url: Optional[str] = None
    signature_title: Optional[str] = None
    signature_subtitle: Optional[str] = None


# ─── Promo ────────────────────────────────────────────────────────────────────

class PromoContentUpdate(BaseModel):
    section_enabled: Optional[bool] = None
    eyebrow_label: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    bg_type: Optional[str] = None
    bg_url: Optional[str] = None
    button_text: Optional[str] = None
    button_link: Optional[str] = None


class PromoContentResponse(BaseModel):
    section_enabled: bool
    eyebrow_label: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    bg_type: str
    bg_url: Optional[str] = None
    button_text: Optional[str] = None
    button_link: Optional[str] = None


# ─── Featured Collection ──────────────────────────────────────────────────────

class FeaturedCollectionUpdate(BaseModel):
    section_enabled: Optional[bool] = None
    eyebrow: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None


class FeaturedCollectionResponse(BaseModel):
    section_enabled: bool
    eyebrow: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None


# ─── About Page ───────────────────────────────────────────────────────────────

class AboutContentUpdate(BaseModel):
    section_enabled: Optional[bool] = None
    page_eyebrow: Optional[str] = None
    page_title: Optional[str] = None
    page_subtitle: Optional[str] = None
    origin_eyebrow: Optional[str] = None
    origin_title: Optional[str] = None
    origin_body: Optional[str] = None
    origin_image: Optional[str] = None
    mission_eyebrow: Optional[str] = None
    mission_title: Optional[str] = None
    mission_body: Optional[str] = None
    quote_text: Optional[str] = None
    quote_attribution: Optional[str] = None
    team_eyebrow: Optional[str] = None
    team_title: Optional[str] = None
    team_body: Optional[str] = None
    team_image: Optional[str] = None
    cta_eyebrow: Optional[str] = None
    cta_title: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None


class AboutContentResponse(AboutContentUpdate):
    section_enabled: bool = True


# ─── Craftsmanship Page ───────────────────────────────────────────────────────

class CraftStep(BaseModel):
    number: Optional[str] = None
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    enabled: bool = True
    order: int = 0


class CraftsmanshipContentUpdate(BaseModel):
    section_enabled: Optional[bool] = None
    page_eyebrow: Optional[str] = None
    page_title: Optional[str] = None
    page_subtitle: Optional[str] = None
    intro_eyebrow: Optional[str] = None
    intro_title: Optional[str] = None
    intro_body: Optional[str] = None
    intro_image: Optional[str] = None
    steps: Optional[List[CraftStep]] = None
    closing_quote: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None


class CraftsmanshipContentResponse(BaseModel):
    section_enabled: bool
    page_eyebrow: Optional[str] = None
    page_title: Optional[str] = None
    page_subtitle: Optional[str] = None
    intro_eyebrow: Optional[str] = None
    intro_title: Optional[str] = None
    intro_body: Optional[str] = None
    intro_image: Optional[str] = None
    steps: List[dict]
    closing_quote: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None


# ─── FAQs ─────────────────────────────────────────────────────────────────────

class FAQItemCreate(BaseModel):
    question: str
    answer: str
    order: int = 0
    enabled: bool = True


class FAQItemUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    order: Optional[int] = None
    enabled: Optional[bool] = None


class FAQItemResponse(BaseModel):
    id: int
    question: str
    answer: str
    order: int
    enabled: bool

    class Config:
        from_attributes = True


class FAQBulkUpdate(BaseModel):
    """Replace the entire FAQ list at once (for reordering)."""
    items: List[FAQItemCreate]


# ─── CMS Page Content ─────────────────────────────────────────────────────────

class CMSPageContentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    section_enabled: Optional[bool] = None


class CMSPageContentResponse(BaseModel):
    slug: str
    title: Optional[str] = None
    content: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    section_enabled: bool

    class Config:
        from_attributes = True
