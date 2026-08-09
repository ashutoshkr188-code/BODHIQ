"""
Safe SQLite column migration helper.
SQLite does not support ALTER TABLE DROP COLUMN before 3.35.0, and
create_all() won't add columns to *existing* tables.
This module uses PRAGMA table_info to detect and add missing columns.
"""

import logging
from sqlalchemy import text, inspect
from app.db.session import engine

logger = logging.getLogger(__name__)


def add_column_if_missing(table: str, column: str, col_type: str, default: str | None = None):
    """Add a column to a table if it doesn't exist."""
    with engine.connect() as conn:
        result = conn.execute(text(f"PRAGMA table_info({table})"))
        existing_columns = {row[1] for row in result.fetchall()}
        if column not in existing_columns:
            default_clause = f" DEFAULT {default}" if default is not None else ""
            sql = f"ALTER TABLE {table} ADD COLUMN {column} {col_type}{default_clause}"
            conn.execute(text(sql))
            conn.commit()
            logger.info(f"Migration: added column {table}.{column}")


def run_cms_migrations():
    """
    Safe, additive migration for all CMS tables.
    Only adds new columns; never drops or modifies existing data.
    """
    try:
        insp = inspect(engine)
        existing_tables = set(insp.get_table_names())

        # cms_homepage — new columns
        if "cms_homepage" in existing_tables:
            add_column_if_missing("cms_homepage", "badge_text", "VARCHAR(200)")
            add_column_if_missing("cms_homepage", "badge_visible", "BOOLEAN", "1")
            add_column_if_missing("cms_homepage", "hero_cta_link", "VARCHAR(300)")
            add_column_if_missing("cms_homepage", "section_enabled", "BOOLEAN", "1")

        # cms_philosophy — new columns
        if "cms_philosophy" in existing_tables:
            add_column_if_missing("cms_philosophy", "section_enabled", "BOOLEAN", "1")
            add_column_if_missing("cms_philosophy", "eyebrow_label", "VARCHAR(200)")
            add_column_if_missing("cms_philosophy", "description2", "TEXT")
            add_column_if_missing("cms_philosophy", "description3", "TEXT")
            add_column_if_missing("cms_philosophy", "signature_title", "VARCHAR(100)")
            add_column_if_missing("cms_philosophy", "signature_subtitle", "VARCHAR(200)")

        # cms_promo — new columns
        if "cms_promo" in existing_tables:
            add_column_if_missing("cms_promo", "section_enabled", "BOOLEAN", "1")
            add_column_if_missing("cms_promo", "eyebrow_label", "VARCHAR(200)")

        # cms_header — new columns
        if "cms_header" in existing_tables:
            add_column_if_missing("cms_header", "mobile_tagline", "VARCHAR(200)")

        # footer_settings — new columns
        if "footer_settings" in existing_tables:
            add_column_if_missing("footer_settings", "newsletter_eyebrow", "VARCHAR(200)")
            add_column_if_missing("footer_settings", "newsletter_title", "VARCHAR(200)")
            add_column_if_missing("footer_settings", "company_section_label", "VARCHAR(100)")
            add_column_if_missing("footer_settings", "quick_links_section_label", "VARCHAR(100)")
            add_column_if_missing("footer_settings", "contact_section_label", "VARCHAR(100)")
            add_column_if_missing("footer_settings", "help_text", "VARCHAR(500)")
            add_column_if_missing("footer_settings", "gifting_text", "VARCHAR(500)")

        logger.info("CMS migrations completed successfully.")

    except Exception as e:
        logger.error(f"CMS migration failed: {e}")
        # Don't crash the app — tables will be recreated fresh if they don't exist
