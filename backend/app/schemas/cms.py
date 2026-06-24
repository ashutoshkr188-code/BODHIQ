from pydantic import BaseModel
from typing import List, Literal, Optional


class NavLinkSchema(BaseModel):
    title: str
    href: str


class BackgroundMediaItem(BaseModel):
    type: Literal["image", "video"]
    url: str
    order: int


class HeaderContentUpdate(BaseModel):
    logo_text: Optional[str] = ""
    nav_links: List[NavLinkSchema]
    background_media: Optional[List[BackgroundMediaItem]] = None


class HeaderContentResponse(BaseModel):
    logo_text: str
    nav_links: List[NavLinkSchema]
    background_media: List[BackgroundMediaItem]


class PhilosophyContentUpdate(BaseModel):
    title: Optional[str] = ""
    description: Optional[str] = ""
    image_url: Optional[str] = None


class PhilosophyContentResponse(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None


class HomepageContentUpdate(BaseModel):
    hero_title: Optional[str] = ""
    hero_subtitle: Optional[str] = ""
    hero_description: Optional[str] = ""
    hero_cta: Optional[str] = ""
    background_media: Optional[List[BackgroundMediaItem]] = None


class HomepageContentResponse(BaseModel):
    hero_title: str
    hero_subtitle: str
    hero_description: str
    hero_cta: str
    background_media: List[BackgroundMediaItem]


class PromoContentUpdate(BaseModel):
    title: Optional[str] = ""
    description: Optional[str] = ""
    bg_type: Optional[str] = "image"
    bg_url: Optional[str] = None
    button_text: Optional[str] = ""
    button_link: Optional[str] = ""


class PromoContentResponse(BaseModel):
    title: Optional[str] = ""
    description: Optional[str] = ""
    bg_type: Optional[str] = "image"
    bg_url: Optional[str] = None
    button_text: Optional[str] = ""
    button_link: Optional[str] = ""

