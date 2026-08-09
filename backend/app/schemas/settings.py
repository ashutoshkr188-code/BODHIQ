"""Pydantic schemas for SiteSettings and FooterSettings with camelCase API aliases."""

from pydantic import BaseModel, ConfigDict


def to_camel(string: str) -> str:
    components = string.split("_")
    return components[0] + "".join(x.title() for x in components[1:])


# ── Site Settings ──────────────────────────────────────────────────────────────

class SiteSettingsResponse(BaseModel):
    logo_text: str | None = None
    contact_email: str | None = None
    seo_title: str | None = None
    seo_description: str | None = None
    seo_keywords: list | None = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class SiteSettingsUpdate(BaseModel):
    logo_text: str | None = None
    contact_email: str | None = None
    seo_title: str | None = None
    seo_description: str | None = None
    seo_keywords: list | None = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


# ── Footer Settings ────────────────────────────────────────────────────────────

class FooterSettingsResponse(BaseModel):
    newsletter_eyebrow: str | None = None
    newsletter_title: str | None = None
    newsletter_text: str | None = None
    newsletter_placeholder: str | None = None
    newsletter_button_text: str | None = None
    company_section_label: str | None = None
    quick_links_section_label: str | None = None
    contact_section_label: str | None = None
    company_links: list | None = None
    quick_links: list | None = None
    contact_email_primary: str | None = None
    contact_email_secondary: str | None = None
    help_text: str | None = None
    gifting_text: str | None = None
    social_links: list | None = None
    copyright_text: str | None = None
    bottom_tagline: str | None = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class FooterSettingsUpdate(BaseModel):
    newsletter_eyebrow: str | None = None
    newsletter_title: str | None = None
    newsletter_text: str | None = None
    newsletter_placeholder: str | None = None
    newsletter_button_text: str | None = None
    company_section_label: str | None = None
    quick_links_section_label: str | None = None
    contact_section_label: str | None = None
    company_links: list | None = None
    quick_links: list | None = None
    contact_email_primary: str | None = None
    contact_email_secondary: str | None = None
    help_text: str | None = None
    gifting_text: str | None = None
    social_links: list | None = None
    copyright_text: str | None = None
    bottom_tagline: str | None = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )
