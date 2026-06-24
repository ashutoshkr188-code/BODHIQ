from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.category_repo import category_repo
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.utils.slugify import slugify

class CategoryService:
    def _format_category_with_products(self, cat, products):
        return {
            "id": cat.id,
            "_id": cat.id,
            "title": cat.title,
            "slug": cat.slug,
            "description": cat.description,
            "featureTitle": cat.feature_title,
            "reverse": cat.reverse,
            "featureImage": cat.feature_image_url,
            "featureVideo": cat.feature_video_url,
            "products": [
                {
                    "id": p.id,
                    "_id": p.id,
                    "name": p.name,
                    "slug": p.slug,
                    "price": float(p.price),
                    "originalPrice": float(p.original_price) if p.original_price else None,
                    "inStock": p.in_stock,
                    "allowNotify": p.allow_notify,
                    "mainImage": p.main_image_url,
                }
                for p in products
            ],
        }

    def list_categories(self, db: Session):
        categories_with_products = category_repo.get_all_with_top_products(db, limit=3)
        result = []
        for cat, products in categories_with_products:
            result.append(self._format_category_with_products(cat, products))
        return result

    def get_category(self, db: Session, slug: str):
        cat = category_repo.get_by_slug(db, slug)
        if not cat:
            raise HTTPException(status_code=404, detail="Category not found")
        products = category_repo.get_products_for_category(db, cat.id)
        return self._format_category_with_products(cat, products)

    def create_category(self, db: Session, payload: CategoryCreate):
        slug = payload.slug or slugify(payload.title)
        existing = category_repo.get_by_slug(db, slug)
        if existing:
            raise HTTPException(status_code=400, detail="Category with this slug already exists")

        category = Category(
            title=payload.title,
            slug=slug,
            description=payload.description,
            feature_title=payload.feature_title,
            reverse=payload.reverse,
            order=payload.order,
            feature_image_url=payload.feature_image_url,
            feature_video_url=payload.feature_video_url,
            seo_meta_title=payload.seo_meta_title,
            seo_meta_description=payload.seo_meta_description,
            seo_keywords=payload.seo_keywords,
        )
        category = category_repo.create(db, category)
        return CategoryResponse.model_validate(category)

    def update_category(self, db: Session, category_id: str, payload: CategoryUpdate):
        category = category_repo.get_by_id(db, category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        update_data = payload.model_dump(exclude_unset=True)
        if "title" in update_data:
            update_data["slug"] = slugify(update_data["title"])

        for field, value in update_data.items():
            setattr(category, field, value)

        category = category_repo.update(db, category)
        return CategoryResponse.model_validate(category)

    def delete_category(self, db: Session, category_id: str):
        category = category_repo.get_by_id(db, category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        product_count = category_repo.get_product_count(db, category_id)
        if product_count > 0:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot delete category with {product_count} products. Remove products first.",
            )

        category_repo.delete(db, category)

category_service = CategoryService()
