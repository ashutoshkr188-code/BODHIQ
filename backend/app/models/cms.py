"""CMS content models — singleton tables (id=1) and repeatable tables."""

from sqlalchemy import String, Text, Integer, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


# ─── Header / Navigation ──────────────────────────────────────────────────────

class HeaderContent(Base):
    __tablename__ = "cms_header"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    logo_text: Mapped[str] = mapped_column(String(100), default="BODHIQ")
    nav_links: Mapped[list] = mapped_column(JSON, default=list)
    background_media: Mapped[list] = mapped_column(JSON, default=list)
    mobile_tagline: Mapped[str | None] = mapped_column(String(200), nullable=True)


# ─── Homepage Hero ────────────────────────────────────────────────────────────

class HomepageContent(Base):
    __tablename__ = "cms_homepage"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    # Hero
    badge_text: Mapped[str | None] = mapped_column(String(200), nullable=True)
    badge_visible: Mapped[bool] = mapped_column(Boolean, default=True)
    hero_title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    hero_subtitle: Mapped[str | None] = mapped_column(String(300), nullable=True)
    hero_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    hero_cta: Mapped[str | None] = mapped_column(String(100), nullable=True)
    hero_cta_link: Mapped[str | None] = mapped_column(String(300), nullable=True)
    section_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    background_media: Mapped[list] = mapped_column(JSON, default=list)


# ─── Philosophy Section ───────────────────────────────────────────────────────

class PhilosophyContent(Base):
    __tablename__ = "cms_philosophy"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    section_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    eyebrow_label: Mapped[str | None] = mapped_column(String(200), nullable=True)
    title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    description2: Mapped[str | None] = mapped_column(Text, nullable=True)
    description3: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    signature_title: Mapped[str | None] = mapped_column(String(100), nullable=True)
    signature_subtitle: Mapped[str | None] = mapped_column(String(200), nullable=True)


# ─── Promo / Feature Banner ───────────────────────────────────────────────────

class PromoContent(Base):
    __tablename__ = "cms_promo"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    section_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    eyebrow_label: Mapped[str | None] = mapped_column(String(200), nullable=True)
    title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    bg_type: Mapped[str] = mapped_column(String(20), default="image")
    bg_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    button_text: Mapped[str | None] = mapped_column(String(100), nullable=True)
    button_link: Mapped[str | None] = mapped_column(String(300), nullable=True)


# ─── Featured Collection Section ──────────────────────────────────────────────

class FeaturedCollectionContent(Base):
    __tablename__ = "cms_featured_collection"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    section_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    eyebrow: Mapped[str | None] = mapped_column(String(200), nullable=True)
    title: Mapped[str | None] = mapped_column(String(300), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    cta_text: Mapped[str | None] = mapped_column(String(100), nullable=True)
    cta_link: Mapped[str | None] = mapped_column(String(300), nullable=True)


# ─── About Page ───────────────────────────────────────────────────────────────

class AboutContent(Base):
    __tablename__ = "cms_about"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    section_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    # Page header
    page_eyebrow: Mapped[str | None] = mapped_column(String(200), nullable=True)
    page_title: Mapped[str | None] = mapped_column(String(300), nullable=True)
    page_subtitle: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Origin Story
    origin_eyebrow: Mapped[str | None] = mapped_column(String(200), nullable=True)
    origin_title: Mapped[str | None] = mapped_column(String(300), nullable=True)
    origin_body: Mapped[str | None] = mapped_column(Text, nullable=True)
    origin_image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    # Mission
    mission_eyebrow: Mapped[str | None] = mapped_column(String(200), nullable=True)
    mission_title: Mapped[str | None] = mapped_column(String(300), nullable=True)
    mission_body: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Values banner quote
    quote_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    quote_attribution: Mapped[str | None] = mapped_column(String(200), nullable=True)
    # Team section
    team_eyebrow: Mapped[str | None] = mapped_column(String(200), nullable=True)
    team_title: Mapped[str | None] = mapped_column(String(300), nullable=True)
    team_body: Mapped[str | None] = mapped_column(Text, nullable=True)
    team_image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    # CTA strip
    cta_eyebrow: Mapped[str | None] = mapped_column(String(200), nullable=True)
    cta_title: Mapped[str | None] = mapped_column(String(300), nullable=True)
    cta_text: Mapped[str | None] = mapped_column(String(100), nullable=True)
    cta_link: Mapped[str | None] = mapped_column(String(300), nullable=True)
    # SEO
    meta_title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    meta_description: Mapped[str | None] = mapped_column(Text, nullable=True)


# ─── Craftsmanship Page ───────────────────────────────────────────────────────

class CraftsmanshipContent(Base):
    __tablename__ = "cms_craftsmanship"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    section_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    # Page header
    page_eyebrow: Mapped[str | None] = mapped_column(String(200), nullable=True)
    page_title: Mapped[str | None] = mapped_column(String(300), nullable=True)
    page_subtitle: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Intro section
    intro_eyebrow: Mapped[str | None] = mapped_column(String(200), nullable=True)
    intro_title: Mapped[str | None] = mapped_column(String(300), nullable=True)
    intro_body: Mapped[str | None] = mapped_column(Text, nullable=True)
    intro_image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    # Steps (repeatable JSON)
    # [{number, title, subtitle, description, image, enabled, order}]
    steps: Mapped[list] = mapped_column(JSON, default=list)
    # Bottom quote/CTA
    closing_quote: Mapped[str | None] = mapped_column(Text, nullable=True)
    # SEO
    meta_title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    meta_description: Mapped[str | None] = mapped_column(Text, nullable=True)


# ─── FAQ Items ────────────────────────────────────────────────────────────────

class FAQItem(Base):
    """Repeatable FAQ items."""
    __tablename__ = "cms_faq"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    question: Mapped[str] = mapped_column(Text, nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False)
    order: Mapped[int] = mapped_column(Integer, default=0)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)


# ─── CMS Page Content (policy + info pages) ───────────────────────────────────

class CMSPageContent(Base):
    """
    Generic page content for static pages (policy, info).
    slug uniquely identifies the page: 'shipping-policy', 'privacy', 'values', etc.
    """
    __tablename__ = "cms_page_content"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    title: Mapped[str | None] = mapped_column(String(300), nullable=True)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)  # Markdown/plain text
    meta_title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    meta_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    section_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
