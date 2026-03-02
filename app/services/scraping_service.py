import logging
import requests
from bs4 import BeautifulSoup
from typing import Optional

logger = logging.getLogger(__name__)

MIN_CONTENT_LENGTH = 200


def scrape_website(url: str) -> str:
    """Extract clean text from a URL. Primary: trafilatura. Fallback: BeautifulSoup."""
    content = _try_trafilatura(url)
    if content and len(content) >= MIN_CONTENT_LENGTH:
        logger.info(f"Trafilatura extracted {len(content)} chars from {url}")
        return content

    content = _try_beautifulsoup(url)
    if content and len(content) >= MIN_CONTENT_LENGTH:
        logger.info(f"BeautifulSoup extracted {len(content)} chars from {url}")
        return content

    raise ValueError(
        f"Could not extract meaningful content from {url}. "
        f"Minimum {MIN_CONTENT_LENGTH} characters required."
    )


def _try_trafilatura(url: str) -> Optional[str]:
    try:
        import trafilatura
        downloaded = trafilatura.fetch_url(url)
        if downloaded:
            text = trafilatura.extract(
                downloaded,
                include_comments=False,
                include_tables=True,
                no_fallback=False,
            )
            return text
    except ImportError:
        logger.warning("trafilatura not installed, using BeautifulSoup fallback")
    except Exception as e:
        logger.warning(f"Trafilatura failed for {url}: {e}")
    return None


def _try_beautifulsoup(url: str) -> Optional[str]:
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        response = requests.get(url, timeout=15, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, "html.parser")

        # Remove non-content elements
        for tag in soup(["script", "style", "nav", "footer", "header", "aside", "form"]):
            tag.decompose()

        text = soup.get_text(separator=" ", strip=True)
        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        text = " ".join(line for line in lines if line)
        return text

    except Exception as e:
        logger.warning(f"BeautifulSoup failed for {url}: {e}")
    return None
