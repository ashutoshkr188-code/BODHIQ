"""CMS service — singleton-safe get-or-create pattern for all CMS tables."""

from sqlalchemy.orm import Session
from app.repositories.cms_repo import cms_repo
from app.models.cms import (
    HeaderContent, PhilosophyContent, HomepageContent, PromoContent,
    FeaturedCollectionContent, AboutContent, CraftsmanshipContent,
    FAQItem, CMSPageContent,
)
from app.schemas.cms import (
    HeaderContentUpdate, PhilosophyContentUpdate,
    HomepageContentUpdate, PromoContentUpdate,
    FeaturedCollectionUpdate, AboutContentUpdate,
    CraftsmanshipContentUpdate, FAQItemCreate, FAQItemUpdate,
    FAQBulkUpdate, CMSPageContentUpdate,
)

DEFAULT_CRAFT_STEPS = [
    {"number": "01", "title": "Design", "subtitle": "Where Vision Takes Shape",
     "description": "Every timepiece begins as a thought — a meditation on form, function, and philosophy.",
     "image": None, "enabled": True, "order": 0},
    {"number": "02", "title": "Material", "subtitle": "Chosen With Intention",
     "description": "We source only the finest materials: 316L surgical-grade stainless steel, sapphire crystal glass, and genuine leather.",
     "image": None, "enabled": True, "order": 1},
    {"number": "03", "title": "Assembly", "subtitle": "Precision Beyond Measure",
     "description": "Each component is assembled with tolerances measured in hundredths of a millimeter.",
     "image": None, "enabled": True, "order": 2},
    {"number": "04", "title": "Finishing", "subtitle": "The Final Meditation",
     "description": "The final stage is a ritual of patience. Each surface is polished, inspected, and refined.",
     "image": None, "enabled": True, "order": 3},
]


class CMSService:

    # ── Header ────────────────────────────────────────────────────────────────

    def get_header(self, db: Session):
        header = cms_repo.get_header(db)
        if not header:
            header = HeaderContent(
                id=1,
                logo_text="BODHIQ",
                nav_links=[
                    {"title": "Collection", "href": "/collection"},
                    {"title": "Craftsmanship", "href": "/craftsmanship"},
                    {"title": "About", "href": "/about"},
                ],
                background_media=[
                    {"type": "video", "url": "/videos/clip-1.mp4", "order": 0},
                    {"type": "video", "url": "/videos/clip-2.mp4", "order": 1},
                ],
                mobile_tagline=None,
            )
            cms_repo.update_header(db, header)
        return header

    def update_header(self, db: Session, payload: HeaderContentUpdate):
        header = self.get_header(db)
        if payload.logo_text is not None:
            header.logo_text = payload.logo_text
        if payload.nav_links is not None:
            header.nav_links = [link.model_dump() for link in payload.nav_links]
        if payload.background_media is not None:
            header.background_media = sorted(
                [item.model_dump() for item in payload.background_media],
                key=lambda x: x["order"],
            )
        if payload.mobile_tagline is not None:
            header.mobile_tagline = payload.mobile_tagline or None
        return cms_repo.update_header(db, header)

    # ── Homepage / Hero ───────────────────────────────────────────────────────

    def get_homepage(self, db: Session):
        homepage = cms_repo.get_homepage(db)
        if not homepage:
            homepage = HomepageContent(
                id=1,
                badge_text="Launch Edition — Limited First Drop",
                badge_visible=True,
                hero_title=None,
                hero_subtitle=None,
                hero_description=None,
                hero_cta=None,
                hero_cta_link="/collection",
                section_enabled=True,
                background_media=[
                    {"type": "video", "url": "/videos/clip-1.mp4", "order": 0},
                    {"type": "video", "url": "/videos/clip-2.mp4", "order": 1},
                ],
            )
            cms_repo.update_homepage(db, homepage)
        return homepage

    def update_homepage(self, db: Session, payload: HomepageContentUpdate):
        homepage = self.get_homepage(db)
        # Use explicit None checks so empty string "" is preserved
        if payload.badge_text is not None:
            homepage.badge_text = payload.badge_text or None
        if payload.badge_visible is not None:
            homepage.badge_visible = payload.badge_visible
        if payload.hero_title is not None:
            homepage.hero_title = payload.hero_title or None
        if payload.hero_subtitle is not None:
            homepage.hero_subtitle = payload.hero_subtitle or None
        if payload.hero_description is not None:
            homepage.hero_description = payload.hero_description or None
        if payload.hero_cta is not None:
            homepage.hero_cta = payload.hero_cta or None
        if payload.hero_cta_link is not None:
            homepage.hero_cta_link = payload.hero_cta_link or None
        if payload.section_enabled is not None:
            homepage.section_enabled = payload.section_enabled
        if payload.background_media is not None:
            homepage.background_media = sorted(
                [item.model_dump() for item in payload.background_media],
                key=lambda x: x["order"],
            )
        return cms_repo.update_homepage(db, homepage)

    # ── Philosophy ────────────────────────────────────────────────────────────

    def get_philosophy(self, db: Session):
        philosophy = cms_repo.get_philosophy(db)
        if not philosophy:
            philosophy = PhilosophyContent(
                id=1,
                section_enabled=True,
                eyebrow_label=None,
                title=None,
                description=None,
                description2=None,
                description3=None,
                image_url=None,
                signature_title=None,
                signature_subtitle=None,
            )
            cms_repo.update_philosophy(db, philosophy)
        return philosophy

    def update_philosophy(self, db: Session, payload: PhilosophyContentUpdate):
        philosophy = self.get_philosophy(db)
        if payload.section_enabled is not None:
            philosophy.section_enabled = payload.section_enabled
        if payload.eyebrow_label is not None:
            philosophy.eyebrow_label = payload.eyebrow_label or None
        if payload.title is not None:
            philosophy.title = payload.title or None
        if payload.description is not None:
            philosophy.description = payload.description or None
        if payload.description2 is not None:
            philosophy.description2 = payload.description2 or None
        if payload.description3 is not None:
            philosophy.description3 = payload.description3 or None
        if payload.image_url is not None:
            philosophy.image_url = payload.image_url or None
        if payload.signature_title is not None:
            philosophy.signature_title = payload.signature_title or None
        if payload.signature_subtitle is not None:
            philosophy.signature_subtitle = payload.signature_subtitle or None
        return cms_repo.update_philosophy(db, philosophy)

    # ── Promo ─────────────────────────────────────────────────────────────────

    def get_promo(self, db: Session):
        promo = cms_repo.get_promo(db)
        if not promo:
            promo = PromoContent(
                id=1,
                section_enabled=True,
                eyebrow_label=None,
                title=None,
                description=None,
                bg_type="image",
                bg_url=None,
                button_text=None,
                button_link=None,
            )
            cms_repo.update_promo(db, promo)
        return promo

    def update_promo(self, db: Session, payload: PromoContentUpdate):
        promo = self.get_promo(db)
        if payload.section_enabled is not None:
            promo.section_enabled = payload.section_enabled
        if payload.eyebrow_label is not None:
            promo.eyebrow_label = payload.eyebrow_label or None
        if payload.title is not None:
            promo.title = payload.title or None
        if payload.description is not None:
            promo.description = payload.description or None
        if payload.bg_type is not None:
            promo.bg_type = payload.bg_type or "image"
        if payload.bg_url is not None:
            promo.bg_url = payload.bg_url or None
        if payload.button_text is not None:
            promo.button_text = payload.button_text or None
        if payload.button_link is not None:
            promo.button_link = payload.button_link or None
        return cms_repo.update_promo(db, promo)

    # ── Featured Collection ───────────────────────────────────────────────────

    def get_featured_collection(self, db: Session):
        row = db.query(FeaturedCollectionContent).filter_by(id=1).first()
        if not row:
            row = FeaturedCollectionContent(
                id=1,
                section_enabled=True,
                eyebrow=None,
                title=None,
                description=None,
                cta_text=None,
                cta_link=None,
            )
            db.add(row)
            db.commit()
            db.refresh(row)
        return row

    def update_featured_collection(self, db: Session, payload: FeaturedCollectionUpdate):
        row = self.get_featured_collection(db)
        if payload.section_enabled is not None:
            row.section_enabled = payload.section_enabled
        if payload.eyebrow is not None:
            row.eyebrow = payload.eyebrow or None
        if payload.title is not None:
            row.title = payload.title or None
        if payload.description is not None:
            row.description = payload.description or None
        if payload.cta_text is not None:
            row.cta_text = payload.cta_text or None
        if payload.cta_link is not None:
            row.cta_link = payload.cta_link or None
        db.commit()
        db.refresh(row)
        return row

    # ── About ─────────────────────────────────────────────────────────────────

    def get_about(self, db: Session):
        row = db.query(AboutContent).filter_by(id=1).first()
        if not row:
            row = AboutContent(id=1, section_enabled=True)
            db.add(row)
            db.commit()
            db.refresh(row)
        return row

    def update_about(self, db: Session, payload: AboutContentUpdate):
        row = self.get_about(db)
        update_data = payload.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if isinstance(value, str) and value == "":
                value = None
            setattr(row, field, value)
        db.commit()
        db.refresh(row)
        return row

    # ── Craftsmanship ─────────────────────────────────────────────────────────

    def get_craftsmanship(self, db: Session):
        row = db.query(CraftsmanshipContent).filter_by(id=1).first()
        if not row:
            row = CraftsmanshipContent(
                id=1,
                section_enabled=True,
                steps=DEFAULT_CRAFT_STEPS,
            )
            db.add(row)
            db.commit()
            db.refresh(row)
        return row

    def update_craftsmanship(self, db: Session, payload: CraftsmanshipContentUpdate):
        row = self.get_craftsmanship(db)
        update_data = payload.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field == "steps" and value is not None:
                # Sort steps by order
                serialized = sorted(
                    [s if isinstance(s, dict) else s.model_dump() for s in value],
                    key=lambda x: x.get("order", 0),
                )
                setattr(row, "steps", serialized)
            elif isinstance(value, str) and value == "":
                setattr(row, field, None)
            else:
                setattr(row, field, value)
        db.commit()
        db.refresh(row)
        return row

    # ── FAQs ──────────────────────────────────────────────────────────────────

    def get_faqs(self, db: Session):
        return db.query(FAQItem).filter_by(enabled=True).order_by(FAQItem.order).all()

    def get_all_faqs(self, db: Session):
        return db.query(FAQItem).order_by(FAQItem.order).all()

    def create_faq(self, db: Session, payload: FAQItemCreate):
        item = FAQItem(**payload.model_dump())
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    def update_faq(self, db: Session, faq_id: int, payload: FAQItemUpdate):
        item = db.query(FAQItem).filter_by(id=faq_id).first()
        if not item:
            return None
        update_data = payload.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(item, field, value)
        db.commit()
        db.refresh(item)
        return item

    def delete_faq(self, db: Session, faq_id: int):
        item = db.query(FAQItem).filter_by(id=faq_id).first()
        if item:
            db.delete(item)
            db.commit()
        return item

    def bulk_replace_faqs(self, db: Session, payload: FAQBulkUpdate):
        # Delete all existing, insert new list
        db.query(FAQItem).delete()
        db.commit()
        items = []
        for i, faq_data in enumerate(payload.items):
            item = FAQItem(
                question=faq_data.question,
                answer=faq_data.answer,
                order=faq_data.order if faq_data.order is not None else i,
                enabled=faq_data.enabled,
            )
            db.add(item)
            items.append(item)
        db.commit()
        for item in items:
            db.refresh(item)
        return items

    # ── Page Content ──────────────────────────────────────────────────────────

    def get_page(self, db: Session, slug: str):
        return db.query(CMSPageContent).filter_by(slug=slug).first()

    def get_or_create_page(self, db: Session, slug: str):
        row = self.get_page(db, slug)
        if not row:
            row = CMSPageContent(slug=slug, section_enabled=True)
            db.add(row)
            db.commit()
            db.refresh(row)
        return row

    def update_page(self, db: Session, slug: str, payload: CMSPageContentUpdate):
        row = self.get_or_create_page(db, slug)
        update_data = payload.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if isinstance(value, str) and value == "":
                value = None
            setattr(row, field, value)
        db.commit()
        db.refresh(row)
        return row

    def list_pages(self, db: Session):
        return db.query(CMSPageContent).all()


cms_service = CMSService()
