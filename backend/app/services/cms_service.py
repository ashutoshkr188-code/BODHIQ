from sqlalchemy.orm import Session
from app.repositories.cms_repo import cms_repo
from app.models.cms import HeaderContent, PhilosophyContent, HomepageContent, PromoContent
from app.schemas.cms import HeaderContentUpdate, PhilosophyContentUpdate, HomepageContentUpdate, PromoContentUpdate

class CMSService:
    def get_header(self, db: Session):
        header = cms_repo.get_header(db)
        if not header:
            header = HeaderContent(
                id=1,
                logo_text="BODHIQ",
                nav_links=[
                    {"title": "The Collection", "href": "/collection"},
                    {"title": "Philosophy", "href": "/philosophy"},
                ],
                background_media=[
                    {"type": "video", "url": "/videos/clip-1.mp4", "order": 0},
                    {"type": "video", "url": "/videos/clip-2.mp4", "order": 1},
                ]
            )
            cms_repo.update_header(db, header)
        else:
            # Self-healing migration: if background_media is empty, populate it with default videos so they show up in the CMS dashboard.
            if not header.background_media or len(header.background_media) == 0:
                header.background_media = [
                    {"type": "video", "url": "/videos/clip-1.mp4", "order": 0},
                    {"type": "video", "url": "/videos/clip-2.mp4", "order": 1},
                ]
                cms_repo.update_header(db, header)
        return header

    def update_header(self, db: Session, payload: HeaderContentUpdate):
        header = self.get_header(db)
        header.logo_text = payload.logo_text or ""
        header.nav_links = [link.model_dump() for link in payload.nav_links]
        if payload.background_media is not None:
            sorted_media = sorted(
                [item.model_dump() for item in payload.background_media],
                key=lambda x: x["order"],
            )
            header.background_media = sorted_media
        return cms_repo.update_header(db, header)

    def get_philosophy(self, db: Session):
        philosophy = cms_repo.get_philosophy(db)
        if not philosophy:
            philosophy = PhilosophyContent(id=1)
            cms_repo.update_philosophy(db, philosophy)
        return philosophy

    def update_philosophy(self, db: Session, payload: PhilosophyContentUpdate):
        philosophy = self.get_philosophy(db)
        philosophy.title = payload.title or ""
        philosophy.description = payload.description or ""
        philosophy.image_url = payload.image_url if payload.image_url else None
        return cms_repo.update_philosophy(db, philosophy)

    def get_homepage(self, db: Session):
        homepage = cms_repo.get_homepage(db)
        if not homepage:
            homepage = HomepageContent(
                id=1,
                background_media=[
                    {"type": "video", "url": "/videos/clip-1.mp4", "order": 0},
                    {"type": "video", "url": "/videos/clip-2.mp4", "order": 1},
                ]
            )
            cms_repo.update_homepage(db, homepage)
        else:
            # Self-healing migration: if background_media is empty, populate it with default videos
            if not homepage.background_media or len(homepage.background_media) == 0:
                homepage.background_media = [
                    {"type": "video", "url": "/videos/clip-1.mp4", "order": 0},
                    {"type": "video", "url": "/videos/clip-2.mp4", "order": 1},
                ]
                cms_repo.update_homepage(db, homepage)
        return homepage

    def update_homepage(self, db: Session, payload: HomepageContentUpdate):
        homepage = self.get_homepage(db)
        homepage.hero_title = payload.hero_title or ""
        homepage.hero_subtitle = payload.hero_subtitle or ""
        homepage.hero_description = payload.hero_description or ""
        homepage.hero_cta = payload.hero_cta or ""
        if payload.background_media is not None:
            sorted_media = sorted(
                [item.model_dump() for item in payload.background_media],
                key=lambda x: x["order"],
            )
            homepage.background_media = sorted_media
        return cms_repo.update_homepage(db, homepage)

    def get_promo(self, db: Session):
        promo = cms_repo.get_promo(db)
        if not promo:
            promo = PromoContent(id=1)
            cms_repo.update_promo(db, promo)
        return promo

    def update_promo(self, db: Session, payload: PromoContentUpdate):
        promo = self.get_promo(db)
        promo.title = payload.title or ""
        promo.description = payload.description or ""
        promo.bg_type = payload.bg_type or "image"
        promo.bg_url = payload.bg_url if payload.bg_url else None
        promo.button_text = payload.button_text or ""
        promo.button_link = payload.button_link or ""
        return cms_repo.update_promo(db, promo)

cms_service = CMSService()
