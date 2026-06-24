"""Repository for SiteSettings and FooterSettings singletons."""

from sqlalchemy.orm import Session

from app.models.settings import SiteSettings, FooterSettings
from app.schemas.settings import SiteSettingsUpdate, FooterSettingsUpdate


class SettingsRepository:
    # ── Site Settings ─────────────────────────────────────────────────────────

    def get_settings(self, db: Session) -> SiteSettings:
        row = db.query(SiteSettings).filter(SiteSettings.id == 1).first()
        if not row:
            row = SiteSettings(
                id=1,
                logo_text="BODHIQ",
                contact_email="hello@bodhiq.in",
                seo_title="BODHIQ — Luxury Timepieces. Imperfect. Almost.",
                seo_description="Handcrafted luxury watches inspired by Wabi-Sabi and Kintsugi.",
                seo_keywords=["BODHIQ", "luxury watch", "handcrafted", "Wabi-Sabi"],
            )
            db.add(row)
            db.commit()
            db.refresh(row)
        return row

    def update_settings(self, db: Session, payload: SiteSettingsUpdate) -> SiteSettings:
        row = self.get_settings(db)
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(row, field, value)
        db.commit()
        db.refresh(row)
        return row

    # ── Footer Settings ───────────────────────────────────────────────────────

    def get_footer(self, db: Session) -> FooterSettings:
        row = db.query(FooterSettings).filter(FooterSettings.id == 1).first()
        if not row:
            row = FooterSettings(
                id=1,
                newsletter_text="Stay in the loop. New drops, philosophy, and stories.",
                newsletter_placeholder="Your email address",
                newsletter_button_text="Subscribe",
                company_links=[
                    {"label": "About", "href": "/about"},
                    {"label": "Craftsmanship", "href": "/craftsmanship"},
                    {"label": "Philosophy", "href": "/values"},
                    {"label": "Media", "href": "/media"},
                ],
                quick_links=[
                    {"label": "Track Order", "href": "/track-order"},
                    {"label": "Returns", "href": "/return-policy"},
                    {"label": "Shipping", "href": "/shipping-policy"},
                    {"label": "FAQs", "href": "/faqs"},
                ],
                contact_email_primary="hello@bodhiq.in",
                contact_email_secondary="support@bodhiq.in",
                social_links=[
                    {"platform": "Instagram", "href": "https://instagram.com/bodhiq.in", "icon": "instagram"},
                ],
                copyright_text="© 2026 BODHIQ. All rights reserved.",
                bottom_tagline="Imperfect. Almost.",
            )
            db.add(row)
            db.commit()
            db.refresh(row)
        return row

    def update_footer(self, db: Session, payload: FooterSettingsUpdate) -> FooterSettings:
        row = self.get_footer(db)
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(row, field, value)
        db.commit()
        db.refresh(row)
        return row


settings_repo = SettingsRepository()
