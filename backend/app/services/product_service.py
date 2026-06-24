import math
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.product_repo import product_repo
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, ProductListItem
from app.utils.slugify import slugify

class ProductService:
    def list_products(self, db: Session, page: int, per_page: int, category: str | None):
        category_id = None
        if category:
            cat = product_repo.get_category_by_slug(db, category)
            if cat:
                category_id = cat.id

        total, products = product_repo.get_paginated(db, page, per_page, category_id)

        return {
            "items": [
                {
                    **ProductListItem.model_validate(p).model_dump(),
                }
                for p in products
            ],
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": math.ceil(total / per_page) if total > 0 else 0,
        }

    def get_featured(self, db: Session):
        products = product_repo.get_featured(db)
        return [ProductListItem.model_validate(p) for p in products]

    def _to_response(self, product: Product) -> ProductResponse:
        """Convert a database product to a ProductResponse, mapping the category title safely."""
        product_dict = {c.name: getattr(product, c.name) for c in product.__table__.columns}
        product_dict["category"] = product.category.title if product.category else None
        return ProductResponse.model_validate(product_dict)

    def get_product(self, db: Session, slug: str):
        product = product_repo.get_by_slug(db, slug)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return self._to_response(product)

    def create_product(self, db: Session, payload: ProductCreate):
        slug = payload.slug or slugify(payload.name)

        existing = product_repo.get_existing_slug(db, slug)
        if existing:
            slug = f"{slug}-{existing.id[:8]}"

        cat = product_repo.get_category_by_id(db, payload.category_id)
        if not cat:
            raise HTTPException(status_code=400, detail="Category not found")

        product = Product(
            name=payload.name,
            slug=slug,
            description=payload.description,
            price=payload.price,
            original_price=payload.original_price,
            stock=payload.stock,
            in_stock=payload.in_stock,
            allow_notify=payload.allow_notify,
            main_image_url=payload.main_image_url,
            images=payload.images,
            product_video_url=payload.product_video_url,
            category_id=payload.category_id,
            case_size=payload.case_size,
            dial_color=payload.dial_color,
            strap_material=payload.strap_material,
            case_material=payload.case_material,
            movement=payload.movement,
            water_resistance=payload.water_resistance,
            glass_type=payload.glass_type,
            seo_meta_title=payload.seo_meta_title,
            seo_meta_description=payload.seo_meta_description,
            seo_keywords=payload.seo_keywords,
        )
        
        product = product_repo.create(db, product)
        return self._to_response(product)

    def update_product(self, db: Session, product_id: str, payload: ProductUpdate):
        product = product_repo.get_by_id(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        update_data = payload.model_dump(exclude_unset=True)

        # Do not automatically update slug when name changes to preserve SEO

        for field, value in update_data.items():
            setattr(product, field, value)

        product = product_repo.update(db, product)
        return self._to_response(product)

    def delete_product(self, db: Session, product_id: str):
        product = product_repo.get_by_id(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        product_repo.delete(db, product)

product_service = ProductService()
