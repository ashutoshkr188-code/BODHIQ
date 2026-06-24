"""Site settings Pydantic schemas."""

from pydantic import BaseModel


class SiteSettingsResponse(BaseModel):
    logo_text: str | None = None
    nav_links: list | None = None
    contact_email: str | None = None
    footer_text: str | None = None
    seo_title: str | None = None
    seo_description: str | None = None
    seo_keywords: list | None = None

    model_config = {"from_attributes": True}


class SiteSettingsUpdate(BaseModel):
    logo_text: str | None = None
    nav_links: list | None = None
    contact_email: str | None = None
    footer_text: str | None = None
    seo_title: str | None = None
    seo_description: str | None = None
    seo_keywords: list | None = None


class HeroSectionResponse(BaseModel):
    title: str | None = None
    tagline: str | None = None
    background_type: str | None = None
    background_image_url: str | None = None
    background_video_url: str | None = None
    cta_text: str | None = None
    cta_link: str | None = None

    model_config = {"from_attributes": True}


class HeroSectionUpdate(BaseModel):
    title: str | None = None
    tagline: str | None = None
    background_type: str | None = None
    background_image_url: str | None = None
    background_video_url: str | None = None
    cta_text: str | None = None
    cta_link: str | None = None


class HomePageResponse(BaseModel):
    hero: dict | None = None
    philosophy: dict | None = None

    model_config = {"from_attributes": True}


class FooterResponse(BaseModel):
    newsletter_text: str | None = None
    newsletter_placeholder: str | None = None
    newsletter_button_text: str | None = None
    company_links: list | None = None
    quick_links: list | None = None
    contact_email_primary: str | None = None
    contact_email_secondary: str | None = None
    social_links: list | None = None
    copyright_text: str | None = None
    bottom_tagline: str | None = None

    model_config = {"from_attributes": True}
