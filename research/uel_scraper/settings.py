BOT_NAME = "uel_fit_research"

SPIDER_MODULES = ["uel_scraper.spiders"]
NEWSPIDER_MODULE = "uel_scraper.spiders"

# Polite, anonymous, no login. Obey robots.txt. A few pages at a time.
ROBOTSTXT_OBEY = True
CONCURRENT_REQUESTS = 1
CONCURRENT_REQUESTS_PER_DOMAIN = 1
DOWNLOAD_DELAY = 3
RANDOMIZE_DOWNLOAD_DELAY = False
COOKIES_ENABLED = False
RETRY_TIMES = 1

USER_AGENT = (
    "UELFitResearchBot/0.1 (+https://www.uel.ac.uk/robots.txt; "
    "academic mock research; polite; no login)"
)

DEFAULT_REQUEST_HEADERS = {
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "en-GB,en;q=0.9",
}

LOG_LEVEL = "INFO"
TELNETCONSOLE_ENABLED = False
FEED_EXPORT_ENCODING = "utf-8"
