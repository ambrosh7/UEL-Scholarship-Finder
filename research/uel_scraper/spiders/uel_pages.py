"""Polite Scrapy pass over locked UEL pages. Never logs in."""

from __future__ import annotations

import json
import re
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

import scrapy

ROOT = Path(__file__).resolve().parents[3]
RAW_DIR = ROOT / "data" / "raw"
CHECKED_ON = date.today().isoformat()

COURSE_SEEDS = [
    {
        "url": "https://www.uel.ac.uk/undergraduate/courses/bsc-hons-business-management",
        "id": "bsc-business-management",
        "subjectFamily": "business",
        "level": "undergraduate",
        "basket": "management-ug",
    },
    {
        "url": "https://www.uel.ac.uk/undergraduate/courses/bsc-hons-marketing",
        "id": "bsc-marketing",
        "subjectFamily": "business",
        "level": "undergraduate",
        "basket": "management-ug",
    },
    {
        "url": "https://www.uel.ac.uk/undergraduate/courses/bsc-hons-accounting-finance",
        "id": "bsc-accounting-finance",
        "subjectFamily": "business",
        "level": "undergraduate",
        "basket": "management-ug",
    },
    {
        "url": "https://www.uel.ac.uk/undergraduate/courses/bsc-hons-accounting-business-management",
        "id": "bsc-accounting-business-management",
        "subjectFamily": "business",
        "level": "undergraduate",
        "basket": "management-ug",
        "swapNote": "No full-length International Business UG found; closest published management title.",
    },
    {
        "url": "https://www.uel.ac.uk/undergraduate/courses/bsc-hons-business-economics",
        "id": "bsc-business-economics",
        "subjectFamily": "business",
        "level": "undergraduate",
        "basket": "management-ug",
    },
    {
        "url": "https://www.uel.ac.uk/postgraduate/courses/msc-international-business-management",
        "id": "msc-international-business-management",
        "subjectFamily": "business",
        "level": "postgraduate-taught",
        "basket": "management-pg",
    },
    {
        "url": "https://www.uel.ac.uk/postgraduate/courses/msc-marketing",
        "id": "msc-marketing",
        "subjectFamily": "business",
        "level": "postgraduate-taught",
        "basket": "management-pg",
    },
    {
        "url": "https://www.uel.ac.uk/postgraduate/courses/mba-master-business-administration",
        "id": "mba",
        "subjectFamily": "business",
        "level": "postgraduate-taught",
        "basket": "management-pg",
    },
    {
        "url": "https://www.uel.ac.uk/postgraduate/courses/msc-human-resource-management",
        "id": "msc-human-resource-management",
        "subjectFamily": "business",
        "level": "postgraduate-taught",
        "basket": "management-pg",
    },
    {
        "url": "https://www.uel.ac.uk/undergraduate/courses/bsc-hons-computer-science",
        "id": "bsc-computer-science",
        "subjectFamily": "computing",
        "level": "undergraduate",
        "basket": "also",
    },
    {
        "url": "https://www.uel.ac.uk/postgraduate/courses/msc-computer-science",
        "id": "msc-computer-science",
        "subjectFamily": "computing",
        "level": "postgraduate-taught",
        "basket": "also",
    },
    {
        "url": "https://www.uel.ac.uk/postgraduate/courses/msc-data-science",
        "id": "msc-data-science",
        "subjectFamily": "computing",
        "level": "postgraduate-taught",
        "basket": "also",
    },
    {
        "url": "https://www.uel.ac.uk/undergraduate/courses/beng-hons-civil-engineering",
        "id": "beng-civil-engineering",
        "subjectFamily": "engineering",
        "level": "undergraduate",
        "basket": "also",
    },
    {
        "url": "https://www.uel.ac.uk/undergraduate/courses/beng-hons-mechanical-engineering",
        "id": "beng-mechanical-engineering",
        "subjectFamily": "engineering",
        "level": "undergraduate",
        "basket": "also",
    },
    {
        "url": "https://www.uel.ac.uk/undergraduate/courses/bsc-hons-psychology",
        "id": "bsc-psychology",
        "subjectFamily": "other",
        "level": "undergraduate",
        "basket": "also",
    },
    {
        "url": "https://www.uel.ac.uk/undergraduate/courses/llb-hons-law",
        "id": "llb-law",
        "subjectFamily": "law",
        "level": "undergraduate",
        "basket": "also",
    },
]

SUPPORT_PAGES = [
    {
        "url": "https://www.uel.ac.uk/study/fees-funding/international-fees-funding/international-scholarships",
        "id": "international-scholarships",
        "kind": "scholarship",
    },
    {
        "url": "https://www.uel.ac.uk/international/guidance-your-region/south-asia/india",
        "id": "india-entry",
        "kind": "india-entry",
    },
    {
        "url": "https://www.uel.ac.uk/study/fees-funding/international-fees-funding",
        "id": "international-fees",
        "kind": "fees",
    },
    {
        "url": "https://www.uel.ac.uk/study/fees-funding/paying-your-fees-international-students",
        "id": "international-deposit",
        "kind": "deposit",
    },
    {
        "url": "https://www.uel.ac.uk/study/accommodation/room-types-prices-payment-plans",
        "id": "accommodation",
        "kind": "accommodation",
    },
    {
        "url": "https://www.uel.ac.uk/international/international-admission-deadlines",
        "id": "admission-deadlines",
        "kind": "dates",
    },
    {
        "url": "https://www.uel.ac.uk/robots.txt",
        "id": "robots",
        "kind": "robots",
    },
]


def slug_from_url(url: str) -> str:
    path = urlparse(url).path.rstrip("/").replace("/", "_")
    return path.strip("_") or "index"


def parse_gbp(text: str | None) -> int | None:
    if not text:
        return None
    cleaned = text.replace("\xa0", " ").replace(",", "")
    match = re.search(r"£\s*(\d+)", cleaned)
    if not match:
        return None
    return int(match.group(1))


def campus_from_headings(headings: list[str]) -> tuple[str, list[str]]:
    issues: list[str] = []
    mapped: list[str] = []
    for heading in headings:
        lower = heading.lower()
        if "university square stratford" in lower or re.search(r"\buss\b", lower):
            mapped.append("University Square Stratford")
        elif "docklands" in lower:
            mapped.append("Docklands")
        elif "stratford" in lower:
            mapped.append("Stratford")
    unique = list(dict.fromkeys(mapped))
    if not unique:
        return "unknown", ["Campus heading not found on course page."]
    if len(unique) > 1:
        issues.append(
            "Page lists more than one campus heading: " + "; ".join(unique)
        )
    return unique[0], issues


class UelPagesSpider(scrapy.Spider):
    name = "uel_pages"

    custom_settings = {
        "FEEDS": {
            str(RAW_DIR / "scrapy-extract.json"): {
                "format": "json",
                "encoding": "utf-8",
                "overwrite": True,
                "indent": 2,
            }
        }
    }

    def start_requests(self):
        RAW_DIR.mkdir(parents=True, exist_ok=True)
        (RAW_DIR / "html").mkdir(exist_ok=True)
        for seed in COURSE_SEEDS:
            yield scrapy.Request(
                seed["url"],
                callback=self.parse_course,
                cb_kwargs={"seed": seed},
                dont_filter=True,
            )
        for page in SUPPORT_PAGES:
            yield scrapy.Request(
                page["url"],
                callback=self.parse_support,
                cb_kwargs={"page": page},
                dont_filter=True,
            )

    def parse_course(self, response: scrapy.http.Response, seed: dict):
        self._save_html(response)
        title = response.css("h1::text").get()
        title = title.strip() if title else seed["id"]

        options = []
        for item in response.css("div.course-option-details__list-item"):
            applicant = " ".join(
                item.css(".application-type ::text").getall()
            )
            attendance = " ".join(
                item.css(".attendance-type ::text").getall()
            )
            years = " ".join(
                item.css(".attendance-type-yr ::text").getall()
            )
            fee_text = " ".join(item.css(".fee-type ::text").getall())
            options.append(
                {
                    "applicant": re.sub(r"\s+", " ", applicant).strip(" ,"),
                    "attendance": re.sub(r"\s+", " ", attendance).strip(" ,"),
                    "years": re.sub(r"\s+", " ", years).strip(" ,"),
                    "feeText": re.sub(r"\s+", " ", fee_text).strip(),
                    "feeGbp": parse_gbp(fee_text),
                }
            )

        intl_ft = [
            opt
            for opt in options
            if "international" in opt["applicant"].lower()
            and "full time" in opt["attendance"].lower()
            and "placement" not in opt["feeText"].lower()
            and opt["feeGbp"]
        ]
        fee = intl_ft[0]["feeGbp"] if intl_ft else None
        duration_text = intl_ft[0]["years"] if intl_ft else None

        jsonld = self._jsonld(response)
        start_dates = self._start_dates(jsonld)

        campus_headings = [
            re.sub(r"\s+", " ", h).strip()
            for h in response.css(
                ".campus-and-facilities h3::text, .rich-txt-custom h3::text"
            ).getall()
            if h.strip()
        ]
        campus, campus_issues = campus_from_headings(campus_headings)

        ielts = response.css(
            "h3:contains('English Language') + ul li::text, "
            "h3:contains('English Language') + p::text"
        ).getall()
        accepted = response.css(
            "h3:contains('Accepted Qualifications') + p::text, "
            "h3:contains('Accepted Qualifications') + ul li::text"
        ).getall()

        issues = list(campus_issues)
        if seed.get("swapNote"):
            issues.append(seed["swapNote"])
        if not fee:
            issues.append("Could not parse an international full-time fee.")
        if start_dates and any(d.startswith("2027") for d in start_dates):
            issues.append(
                "JSON-LD start dates are 2027 on a 2026/27 research pass "
                f"(checked {CHECKED_ON}). September 2026 intake has already started."
            )

        yield {
            "kind": "course",
            "id": seed["id"],
            "basket": seed["basket"],
            "level": seed["level"],
            "subjectFamily": seed["subjectFamily"],
            "title": title,
            "url": response.url,
            "checkedOn": CHECKED_ON,
            "collector": "scrapy",
            "feeGbp": fee,
            "durationText": duration_text,
            "startDates": start_dates,
            "campus": campus,
            "campusHeadings": campus_headings,
            "options": options,
            "ielts": [re.sub(r"\s+", " ", t).strip() for t in ielts if t.strip()],
            "acceptedQualifications": [
                re.sub(r"\s+", " ", t).strip() for t in accepted if t.strip()
            ],
            "issues": issues,
            "swapNote": seed.get("swapNote"),
        }

    def parse_support(self, response: scrapy.http.Response, page: dict):
        self._save_html(response)
        text = re.sub(r"\s+", " ", " ".join(response.css("main ::text").getall())).strip()
        if page["kind"] == "robots":
            text = response.text
        yield {
            "kind": page["kind"],
            "id": page["id"],
            "url": response.url,
            "checkedOn": CHECKED_ON,
            "collector": "scrapy",
            "title": (response.css("h1::text").get() or page["id"]).strip(),
            "text": text[:20000],
        }

    def _save_html(self, response: scrapy.http.Response) -> None:
        path = RAW_DIR / "html" / f"{slug_from_url(response.url)}.html"
        path.write_bytes(response.body)

    def _jsonld(self, response: scrapy.http.Response):
        raw = response.css('script[type="application/ld+json"]::text').get()
        if not raw:
            return None
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return None

    def _start_dates(self, jsonld) -> list[str]:
        if not jsonld:
            return []
        graph = jsonld.get("@graph") if isinstance(jsonld, dict) else None
        course = None
        if isinstance(graph, list):
            course = next((n for n in graph if n.get("@type") == "Course"), None)
        if not course:
            return []
        dates: list[str] = []
        for instance in course.get("hasCourseInstance") or []:
            modes = " ".join(instance.get("courseMode") or []).lower()
            if "international" not in modes:
                continue
            if "full time" not in modes and "full-time" not in modes:
                continue
            schedule = instance.get("courseSchedule") or {}
            start = schedule.get("startDate")
            if start:
                dates.append(start[:7])
        return sorted(set(dates))
