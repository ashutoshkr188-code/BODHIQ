from sqlalchemy.orm import Session
from app.models.cms import HeaderContent, PhilosophyContent, HomepageContent, PromoContent


class CMSRepository:
    def get_header(self, db: Session):
        return db.query(HeaderContent).filter(HeaderContent.id == 1).first()

    def update_header(self, db: Session, header: HeaderContent):
        merged = db.merge(header)
        db.commit()
        db.refresh(merged)
        return merged

    def get_philosophy(self, db: Session):
        return db.query(PhilosophyContent).filter(PhilosophyContent.id == 1).first()

    def update_philosophy(self, db: Session, philosophy: PhilosophyContent):
        merged = db.merge(philosophy)
        db.commit()
        db.refresh(merged)
        return merged

    def get_homepage(self, db: Session):
        return db.query(HomepageContent).filter(HomepageContent.id == 1).first()

    def update_homepage(self, db: Session, homepage: HomepageContent):
        merged = db.merge(homepage)
        db.commit()
        db.refresh(merged)
        return merged

    def get_promo(self, db: Session):
        return db.query(PromoContent).filter(PromoContent.id == 1).first()

    def update_promo(self, db: Session, promo: PromoContent):
        merged = db.merge(promo)
        db.commit()
        db.refresh(merged)
        return merged


cms_repo = CMSRepository()
