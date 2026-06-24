from sqlalchemy import String, Text, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base

class HeaderContent(Base):
    __tablename__ = "cms_header"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    logo_text: Mapped[str] = mapped_column(String(100), default="BODHIQ")
    nav_links: Mapped[list] = mapped_column(JSON, default=list)
    background_media: Mapped[list] = mapped_column(JSON, default=list)
    # Stores: [{"type": "image"|"video", "url": "/uploads/xyz.mp4", "order": 0}, ...]

class PhilosophyContent(Base):
    __tablename__ = "cms_philosophy"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    title: Mapped[str] = mapped_column(String(200), default="The Philosophy")
    description: Mapped[str] = mapped_column(Text, default="Default Philosophy Description")
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

class HomepageContent(Base):
    __tablename__ = "cms_homepage"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    hero_title: Mapped[str] = mapped_column(String(200), default="BODHIQ")
    hero_subtitle: Mapped[str] = mapped_column(String(300), default="Luxury Timepieces")
    hero_description: Mapped[str] = mapped_column(Text, default="A minimalist luxury timepiece where ancient craft meets modern precision.\nHand-finished dial. Kintsugi-inspired detailing. Made for those who find beauty in the imperfect.")
    hero_cta: Mapped[str] = mapped_column(String(100), default="Discover")
    background_media: Mapped[list] = mapped_column(JSON, default=list)


class PromoContent(Base):
    __tablename__ = "cms_promo"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    title: Mapped[str] = mapped_column(String(200), default="The Art of Kintsugi")
    description: Mapped[str] = mapped_column(Text, default="Every line tells a story. Inspired by the Japanese art of repairing broken pottery with gold, our timepieces celebrate transformation.")
    bg_type: Mapped[str] = mapped_column(String(20), default="image")  # "image" or "video"
    bg_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    button_text: Mapped[str] = mapped_column(String(100), default="Explore Craftsmanship")
    button_link: Mapped[str] = mapped_column(String(100), default="/collection")

