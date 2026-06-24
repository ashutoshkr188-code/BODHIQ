from sqlalchemy.orm import Session, joinedload
from app.models.product import Product
from app.models.category import Category

class ProductRepository:
    def get_by_slug(self, db: Session, slug: str):
        return db.query(Product).options(joinedload(Product.category)).filter(Product.slug == slug).first()

    def get_by_id(self, db: Session, product_id: str):
        return db.query(Product).options(joinedload(Product.category)).filter(Product.id == product_id).first()

    def get_existing_slug(self, db: Session, slug: str):
        return db.query(Product).filter(Product.slug == slug).first()

    def get_category_by_id(self, db: Session, category_id: str):
        return db.query(Category).filter(Category.id == category_id).first()

    def get_category_by_slug(self, db: Session, slug: str):
        return db.query(Category).filter(Category.slug == slug).first()

    def get_featured(self, db: Session, limit: int = 4):
        return db.query(Product).options(joinedload(Product.category)).order_by(Product.created_at.desc()).limit(limit).all()

    def get_paginated(self, db: Session, page: int, per_page: int, category_id: str | None = None):
        query = db.query(Product).options(joinedload(Product.category))
        if category_id:
            query = query.filter(Product.category_id == category_id)
        
        total = query.count()
        products = (
            query.order_by(Product.created_at.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
            .all()
        )
        return total, products

    def create(self, db: Session, product: Product):
        db.add(product)
        db.commit()
        db.refresh(product)
        return product

    def update(self, db: Session, product: Product):
        db.commit()
        db.refresh(product)
        return product

    def delete(self, db: Session, product: Product):
        db.delete(product)
        db.commit()

product_repo = ProductRepository()
