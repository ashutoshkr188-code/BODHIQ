"""Slug generation utility."""

import re
import unicodedata


def slugify(text: str) -> str:
    """
    Convert a text string to a URL-safe slug.

    Examples:
        slugify("BODHIQ Shunya I") → "bodhiq-shunya-i"
        slugify("Hello World!") → "hello-world"
    """
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", "-", text)
    text = text.strip("-")
    return text
