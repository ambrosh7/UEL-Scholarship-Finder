# UEL Fit & Scholarship Finder

A phone-first tool that matches an Indian student to a UEL course, shows an honest scholarship range and first-year cost, and captures a lead. Academic year **2026/27**.

This repo is at **Phase 6**: live prototype plus the written pack (Tasks 1, 3, 4, 6) in [`docs/written-pack.md`](docs/written-pack.md). Same `match()` throughout. Default happy path is **Student A’s result shape**. Task 1 is a draft from the locked fact sheet for Ambrosh to rewrite. Phase 7 is the live URL, Task 2 workbook, and AI-tools note.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on a phone, or use a ~390px viewport on desktop.

UTM example (captured on first landing, kept until lead submit):

[http://localhost:3000/?utm_source=instagram&utm_medium=reel&utm_campaign=reel-april&utm_content=creator-priya](http://localhost:3000/?utm_source=instagram&utm_medium=reel&utm_campaign=reel-april&utm_content=creator-priya)

After the gate, a parent can open `/p/[id]` with no extra questions.

## Checks

```bash
npm test
npm run typecheck
npm run validate
npm run lint
```

`npm test` covers the Phase 2 engine, the Phase 3 question freeze, Phase 4 locked copy, the Phase 5 prototype slice, and the Phase 6 pack (it holds 1, 3, 4 and 6, and Task 6 matches live `match()`).

Question spec: [`docs/questions.md`](docs/questions.md).

`npm run validate` checks `data/catalogue/*.json` and `sources.csv` against the domain types. `PLACEHOLDER` is allowed. Invented numbers are not.

Visa, IHS and London living are sourced from GOV.UK (checked 2026-10-30). Flights stay **PLACEHOLDER**. See `data/catalogue/task2-sources.xlsx`.

To re-run the polite UEL scrape (obeys robots.txt, never logs in):

```bash
cd research
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/scrapy crawl uel_pages
.venv/bin/python build_catalogue.py
```

## Layout

```
src/app/           landing, /find, /results, /thanks, /p/[id], lead API
src/domain/        match engine, scholarship, cost, copy, honesty, priority, frozen questions
docs/questions.md  Task 3 spec — exact on-screen wording
docs/written-pack.md  Phase 6 submission draft (Tasks 1, 3, 4, 6)
src/components/    phone shell, wizard, results, parent view
data/catalogue/    courses, scholarships, costs, sources
data/raw/          scraper output (Phase 1)
data/copy/         locked Task 4 pages (`results-a.md`, `results-b.md`, `whatsapp-b.md`)
data/leads/        local prototype leads (gitignored JSON)
```
