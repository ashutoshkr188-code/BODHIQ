from sqlalchemy.orm import Session
from app.models.category import Category
from sqlalchemy import func
from app.models.product import Product
from sqlalchemy.orm import aliased

class CategoryRepository:
    def get_all(self, db: Session):
        return db.query(Category).order_by(Category.order.asc()).all()

    def get_by_slug(self, db: Session, slug: str):
        return db.query(Category).filter(Category.slug == slug).first()

    def get_by_id(self, db: Session, category_id: str):
        return db.query(Category).filter(Category.id == category_id).first()

    def get_products_for_category(self, db: Session, category_id: str, limit: int | None = None):
        query = (
            db.query(Product)
            .filter(Product.category_id == category_id)
            .order_by(Product.created_at.desc())
        )
        if limit:
            query = query.limit(limit)
        return query.all()

    def get_all_with_top_products(self, db: Session, limit: int = 3):
        categories = self.get_all(db)
        if not categories:
            return []

        # Window function to get top N products per category
        subq = (
            db.query(
                Product,
                func.row_number()
                .over(
                    partition_by=Product.category_id,
                    order_by=Product.created_at.desc(),
                )
                .label("row_num"),
            ).subquery()
        )

        aliased_product = aliased(Product, subq)
        top_products = db.query(aliased_product).filter(subq.c.row_num <= limit).all()

        products_by_cat = {}
        for p in top_products:
            products_by_cat.setdefault(p.category_id, []).append(p)

        return [(cat, products_by_cat.get(cat.id, [])) for cat in categories]

    def get_product_count(self, db: Session, category_id: str):
        return db.query(Product).filter(Product.category_id == category_id).count()

    def create(self, db: Session, category: Category):
        db.add(category)
        db.commit()
        db.refresh(category)
        return category

    def update(self, db: Session, category: Category):
        db.commit()
        db.refresh(category)
        return category

    def delete(self, db: Session, category: Category):
        db.delete(category)
        db.commit()

category_repo = CategoryRepository()
