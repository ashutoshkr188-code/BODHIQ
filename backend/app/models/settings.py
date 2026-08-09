"""SiteSettings and FooterSettings models — singleton tables (id=1)."""

from sqlalchemy import String, Text, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class SiteSettings(Base):
    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    logo_text: Mapped[str] = mapped_column(String(100), default="BODHIQ")
    contact_email: Mapped[str] = mapped_column(String(255), default="hello@bodhiq.in")
    seo_title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    seo_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    seo_keywords: Mapped[list | None] = mapped_column(JSON, nullable=True)


class FooterSettings(Base):
    __tablename__ = "footer_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    # Newsletter section
    newsletter_eyebrow: Mapped[str | None] = mapped_column(String(200), nullable=True)
    newsletter_title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    newsletter_text: Mapped[str | None] = mapped_column(String(300), nullable=True)
    newsletter_placeholder: Mapped[str | None] = mapped_column(String(100), nullable=True)
    newsletter_button_text: Mapped[str | None] = mapped_column(String(50), nullable=True)
    # Link section labels
    company_section_label: Mapped[str | None] = mapped_column(String(100), nullable=True)
    quick_links_section_label: Mapped[str | None] = mapped_column(String(100), nullable=True)
    contact_section_label: Mapped[str | None] = mapped_column(String(100), nullable=True)
    # Links
    company_links: Mapped[list | None] = mapped_column(JSON, nullable=True)
    quick_links: Mapped[list | None] = mapped_column(JSON, nullable=True)
    # Contact
    contact_email_primary: Mapped[str | None] = mapped_column(String(255), nullable=True)
    contact_email_secondary: Mapped[str | None] = mapped_column(String(255), nullable=True)
    help_text: Mapped[str | None] = mapped_column(String(500), nullable=True)
    gifting_text: Mapped[str | None] = mapped_column(String(500), nullable=True)
    social_links: Mapped[list | None] = mapped_column(JSON, nullable=True)
    # Bottom bar
    copyright_text: Mapped[str | None] = mapped_column(String(200), nullable=True)
    bottom_tagline: Mapped[str | None] = mapped_column(String(200), nullable=True)
