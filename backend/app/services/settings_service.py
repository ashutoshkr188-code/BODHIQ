"""Service layer for SiteSettings and FooterSettings."""

from sqlalchemy.orm import Session

from app.repositories.settings_repo import settings_repo
from app.schemas.settings import (
    SiteSettingsResponse, SiteSettingsUpdate,
    FooterSettingsResponse, FooterSettingsUpdate,
)


class SettingsService:
    def get_settings(self, db: Session) -> SiteSettingsResponse:
        row = settings_repo.get_settings(db)
        return SiteSettingsResponse.model_validate(row)

    def update_settings(self, db: Session, payload: SiteSettingsUpdate) -> SiteSettingsResponse:
        row = settings_repo.update_settings(db, payload)
        return SiteSettingsResponse.model_validate(row)

    def get_footer(self, db: Session) -> FooterSettingsResponse:
        row = settings_repo.get_footer(db)
        return FooterSettingsResponse.model_validate(row)

    def update_footer(self, db: Session, payload: FooterSettingsUpdate) -> FooterSettingsResponse:
        row = settings_repo.update_footer(db, payload)
        return FooterSettingsResponse.model_validate(row)


settings_service = SettingsService()
