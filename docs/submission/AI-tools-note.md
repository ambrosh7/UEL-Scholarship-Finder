# AI tools used

**UEL Fit & Scholarship Finder**  
Ambrosh Vaz · 30 October 2026

A short note of which AI tools were used, and on what. Human product decisions stayed with me: academic year 2026/27; never promise a place, a personal scholarship amount, a visa or a job; no fake urgency; missing facts stay PLACEHOLDER; Task 4 people stay Student A (Hyderabad) and Student B (Kochi).

## Cursor (AI coding assistant)

Used to build and iterate the working prototype and the written pack from the locked brief:

- Next.js / TypeScript phone flow (landing, six questions, teaser, name-and-phone gate, results, thanks, parent view)
- Domain engine: course match, eligibility, scholarship range, first-year cost stack, honesty checks, adviser priority
- Tests against Student A, Student B, and the Task 6 cases
- On-screen wording kept in lockstep with this document
- GitHub push and Vercel-ready project layout

I directed the product (what the tool may and may not say, which questions are in the prototype, what “right” means for Task 6). The assistant wrote and edited the code and drafted copy from those rules.

## Scrapy (open-source scraper)

Used for Task 2 collection, as the brief suggested ([Scrapy on GitHub](https://github.com/scrapy/scrapy)).

- Polite crawl of UEL course, scholarship, India-entry, fees, deposit and accommodation pages
- Obeyed robots.txt; never logged in; one request at a time with a delay
- Raw HTML and extract stored in the repo

A scraper copies old and wrong information as happily as correct information. Every UEL fact used in the tool was then checked against the live page. GOV.UK visa (£558), IHS (£776/year student) and London living (£13,761 visa financial requirement) were taken from the live GOV.UK pages on 30 October 2026, not guessed. Flights India → London stay PLACEHOLDER. The RBI rupee snapshot is a labelled, dated reference rate, not live FX.

## Google Stitch

Used only as a visual reference for phone layout (spacing, type, screen structure). Student-facing sentences, fees, scholarship range and honesty lines were not taken from Stitch. Stitch mockups invented numbers and marketing copy; those were discarded.

## What AI did not do

- It did not invent GOV.UK visa, IHS or living-cost figures. Those came from the live GOV.UK pages. Flights stay PLACEHOLDER.
- It did not scrape behind a login or ignore robots.txt.
- It did not promise a place, a personal award, a visa or a job in student-facing copy.
- I am submitting this as my work: the brief, the product calls, and the judgement of whether each Task 6 path is right.
