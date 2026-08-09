"""
Import all models so they register with Base.metadata.
This ensures create_all() picks up every table.
"""

from app.models.user import User  # noqa: F401
from app.models.category import Category  # noqa: F401
from app.models.product import Product  # noqa: F401
from app.models.order import Order, OrderItem  # noqa: F401
from app.models.address import Address  # noqa: F401
from app.models.notify import BackInStockRequest  # noqa: F401
from app.models.cms import (  # noqa: F401
    HeaderContent,
    PhilosophyContent,
    HomepageContent,
    PromoContent,
    FeaturedCollectionContent,
    AboutContent,
    CraftsmanshipContent,
    FAQItem,
    CMSPageContent,
)
from app.models.settings import SiteSettings, FooterSettings  # noqa: F401
