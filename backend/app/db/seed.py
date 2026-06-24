"""
Database seeder — populates initial data for BODHIQ.
Creates sample categories, products, site settings, hero, and footer.
"""

from app.db.session import SessionLocal
from app.models.category import Category
from app.models.product import Product
from app.models.cms import HeaderContent, PhilosophyContent, HomepageContent, PromoContent


from app.core.logger import get_logger

logger = get_logger(__name__)

def seed_if_empty():
    """Only seed if there are no categories yet."""
    db = SessionLocal()
    try:
        if db.query(Category).count() > 0:
            return

        logger.info("Seeding database with initial data...")

        # --- Categories ---
        watches = Category(
            title="Watches",
            slug="watches",
            description="Luxury handcrafted timepieces that blend ancient wisdom with modern engineering.",
            feature_title="The Shunya Collection",
            order=1,
        )
        accessories = Category(
            title="Accessories",
            slug="accessories",
            description="Complement your timepiece with our curated selection of luxury accessories.",
            feature_title="Curated Essentials",
            order=2,
        )
        limited = Category(
            title="Limited Edition",
            slug="limited-edition",
            description="Exclusive, numbered pieces crafted for the discerning collector.",
            feature_title="Rare & Numbered",
            order=3,
        )
        db.add_all([watches, accessories, limited])
        db.flush()

        # --- Products ---
        shunya_1 = Product(
            name="BODHIQ Shunya I",
            slug="bodhiq-shunya-i",
            description="The Shunya I embodies the beauty of zero — the void from which all creation emerges. Its dial tells a story in two halves: ancient spiral motifs representing eternal cycles, meeting the clean simplicity of silence, traced by the imperfect gold line of Kintsugi.",
            price=14999,
            original_price=19999,
            stock=50,
            in_stock=True,
            allow_notify=True,
            main_image_url="/watches/shunya-1/hero.jpg",
            images=["/watches/shunya-1/hero.jpg"],
            category_id=watches.id,
            case_size="40mm",
            dial_color="Black & Gold",
            strap_material="Genuine Leather",
            case_material="316L Stainless Steel",
            movement="Japanese Miyota Quartz",
            water_resistance="3 ATM",
            glass_type="Hardened Mineral Crystal",
        )
        shunya_2 = Product(
            name="BODHIQ Shunya II",
            slug="bodhiq-shunya-ii",
            description="The evolution of the Shunya philosophy. A bolder expression of imperfection, with a midnight blue dial and rose gold accents.",
            price=17999,
            original_price=22999,
            stock=30,
            in_stock=True,
            allow_notify=True,
            main_image_url="/watches/shunya-1/hero.jpg",
            images=["/watches/shunya-1/hero.jpg"],
            category_id=watches.id,
            case_size="42mm",
            dial_color="Midnight Blue",
            strap_material="Italian Leather",
            case_material="316L Stainless Steel",
            movement="Japanese Miyota Quartz",
            water_resistance="5 ATM",
            glass_type="Sapphire Crystal",
        )
        kintsugi = Product(
            name="BODHIQ Kintsugi",
            slug="bodhiq-kintsugi",
            description="Inspired by the Japanese art of golden repair. Every crack tells a story of resilience and beauty.",
            price=24999,
            stock=15,
            in_stock=True,
            allow_notify=True,
            main_image_url="/watches/shunya-1/hero.jpg",
            images=["/watches/shunya-1/hero.jpg"],
            category_id=limited.id,
            case_size="38mm",
            dial_color="Ivory & Gold",
            strap_material="Handstitched Leather",
            case_material="Titanium",
            movement="Swiss Ronda Quartz",
            water_resistance="5 ATM",
            glass_type="Sapphire Crystal",
        )
        coming_soon = Product(
            name="BODHIQ Zen",
            slug="bodhiq-zen",
            description="Coming soon. The ultimate expression of minimalism.",
            price=29999,
            stock=0,
            in_stock=False,
            allow_notify=True,
            main_image_url="/watches/shunya-1/hero.jpg",
            category_id=watches.id,
        )
        db.add_all([shunya_1, shunya_2, kintsugi, coming_soon])

        # --- CMS Content ---
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
        db.add(header)

        philosophy = PhilosophyContent(
            id=1,
            title="The Philosophy",
            description="In a world obsessed with perfection, BODHIQ celebrates the beauty of the almost. Inspired by Wabi-Sabi and Kintsugi, our timepieces honor the cracks, the asymmetries, the human touch.",
            image_url="/watches/shunya-1/hero.jpg",
        )
        db.add(philosophy)

        home = HomepageContent(
            id=1,
            hero_title="BODHIQ SHUNYA I",
            hero_subtitle="Imperfect. Almost.",
            hero_description="A minimalist luxury timepiece where ancient craft meets modern precision.\nHand-finished dial. Kintsugi-inspired detailing. Made for those who find beauty in the imperfect.",
            hero_cta="Discover the Watch",
            background_media=[
                {"type": "video", "url": "/videos/clip-1.mp4", "order": 0},
                {"type": "video", "url": "/videos/clip-2.mp4", "order": 1},
            ]
        )
        db.add(home)

        promo = PromoContent(
            id=1,
            title="The Art of Kintsugi",
            description="Every line tells a story. Inspired by the Japanese art of repairing broken pottery with gold, our timepieces celebrate transformation.",
            bg_type="image",
            bg_url="/watches/shunya-1/hero.jpg",
            button_text="Explore Craftsmanship",
            button_link="/collection",
        )
        db.add(promo)

        # --- Site Settings & Footer Settings ---
        from app.models.settings import SiteSettings, FooterSettings
        settings_row = SiteSettings(
            id=1,
            logo_text="BODHIQ",
            contact_email="hello@bodhiq.in",
            seo_title="BODHIQ — Luxury Timepieces. Imperfect. Almost.",
            seo_description="Handcrafted luxury watches inspired by Wabi-Sabi and Kintsugi.",
            seo_keywords=["BODHIQ", "luxury watch", "handcrafted", "Wabi-Sabi"],
        )
        db.add(settings_row)

        footer_row = FooterSettings(
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
        db.add(footer_row)

        db.commit()
        logger.info("Database seeded successfully!")

    except Exception as e:
        db.rollback()
        logger.error(f"Seed error: {e}", exc_info=True)
    finally:
        db.close()
