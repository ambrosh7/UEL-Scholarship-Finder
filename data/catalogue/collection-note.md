# Task 2 collection note

Checked on 2026-10-28. Academic year **2026/27**.

## How we collected it

1. Confirmed [UEL robots.txt](https://www.uel.ac.uk/robots.txt). Course, scholarship and India URLs are allowed. `/admin`, `/user/login`, `/search` and `/node` are disallowed. We never logged in.
2. **Scrapy first.** Polite crawl (`DOWNLOAD_DELAY=3`, one request at a time, custom user-agent, cookies off) of 16 course pages plus scholarships, India entry, international fees, deposit, accommodation, admission deadlines and robots.txt. Raw extract and HTML: `data/raw/`.
3. **Then every UEL fact was checked against the live page HTML** from that crawl. Browser live-check of Business Management BSc, Computer Science BSc, International Business Management MSc, the international scholarships page, and the India page.
4. **GOV.UK** student visa, Immigration Health Surcharge and London living / maintenance are **PLACEHOLDER** until Ambrosh spot-checks them. Rows are in `sources.csv` with collector `govuk-spot-check`.
5. **RBI** INR/GBP reference rate taken from [rbi.org.in](https://www.rbi.org.in/) as at 1.00pm 28 October 2026 (quoted source FBIL): **126.4657**. Labelled snapshot, not live FX.

## Basket changes

- There is no full-length International Business bachelor's. UEL publishes a one-year **International Business Management Top-up**. Swapped to **Accounting and Business Management BSc (Hons)** and added **Business Economics BSc (Hons)** to keep the mix management-heavy.
- Extra management master's: **Human Resource Management MSc**.
- Computing master's: both **Computer Science MSc** and **Data Science MSc** (the Data Science page says it is not a computer science programme).

## Issues found

- Several course pages list international fees as **TBC** while the 2026/27 fees schedule still publishes a £16,020 undergraduate international headline. Those courses store the schedule figure and say so in `issues`.
- Course JSON-LD start dates are mostly **2027**. Checked after September 2026 teaching had started. Stored as published; not rewritten to 2026-09.
- MBA / International Business MSc pages describe **both Docklands and University Square Stratford**.
- Accommodation intro/FAQ says from **£189/week**; the West standard table shows **£182/week**. Typical room stored is East standard full year **£8,010**.
- India page staff bio contained stray copy (“this is mine”) on the live page. Not used as a fact.
- Flights India → London: unsourced, **PLACEHOLDER**.

The Task 2 workbook is `data/catalogue/task2-sources.xlsx`. Yellow cells on the GOV.UK tab are for the visa, IHS and London living figures. Cover-sheet counts are Excel formulas.

Scrapy does not replace the live check. `data/raw` is the scrape; `data/catalogue` is the checked JSON the app will read.
