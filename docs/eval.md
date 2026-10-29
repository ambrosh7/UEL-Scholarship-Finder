# Eval: UEL Fit & Scholarship Finder

How we know a phase — and the submission — actually passed. Tied to [`implementation-plan.md`](./implementation-plan.md). Case-level expect/must-not lives in [`edge-case.md`](./edge-case.md). Do not duplicate those tables here; score them.

This is not RAG eval and not an LLM-as-judge of fees. The product is a rules engine over a dated catalogue. If a number is wrong, the catalogue or `match()` is wrong.

---

## 1. What “good” means

The brief’s “what we are looking for,” turned into eval dimensions. Score these at Phase 7. Fail any **hard fail** and do not submit.

| ID | Brief bar | How we measure | Hard fail if |
| --- | --- | --- | --- |
| **D1 One tool** | Six tasks fit together | Same `match()` for prototype, Task 4 copy, Task 6 | Document and live link disagree on course, eligibility, or fee |
| **D2 People** | Understand student and parents; writing that makes them want it | Task 1 pages + results voice (A football/loan, B cost/family) | Task 1 is a user journey. Results are a generic brochure |
| **D3 Decision** | Who decides, what would make them act | Q17/Q18 in product: show father if `appears_to_meet`; apply if scholarship makes year one possible | Phone on screen one. No parent artefact. Fake placement % to “make them act” |
| **D4 Research** | Accurate, sourced, dated, including what is wrong | Spreadsheet: URL + date on every fact; `issues` column used | Any fee/scholarship/visa with no URL or date. Invented placeholder replacement |
| **D5 Phone from a reel** | Works on a phone after a video tap | Phase 5/7 phone pass, UTM, six questions | Desktop-only. Pinch-zoom. Localhost link |
| **D6 Honesty** | Scholarship and costs honest | Honesty corpus + cost stack | Place, personal £ award, visa, job, placement rate, “limited seats” |
| **D7 Placeholders** | Missing → labelled gap, not a guess | `PLACEHOLDER` still visible in UI and sheet | Silent omission of visa/IHS/flights so the total looks smaller |

---

## 2. How we eval (four kinds)

| Kind | What | Pass | Who |
| --- | --- | --- | --- |
| **E-auto** | `npm test` on `match`, `cost`, `scholarship`, `honesty`, `priority` | All required cases green | Build |
| **E-sheet** | Task 2 workbook vs live pages | Every row cited; ≥15 courses; collection note | Build + Ambrosh (GOV.UK rows) |
| **E-copy** | Word count, slots, honesty on `results-a/b`, `whatsapp-b`, on-screen strings | Limits + no forbidden phrases + personal not generic | Build, Ambrosh tone pass |
| **E-phone** | Real phone, portrait, ~390px, 4G-ish | Checklists below | Build, Ambrosh if he has the device |

Do not use an LLM to “score” whether a fee is correct. Open the source URL.

---

## 3. Scoring

Use this on each eval item:

| Score | Meaning |
| --- | --- |
| **Pass** | Matches expect in `edge-case.md` |
| **Fail** | Wrong or missing; fix before the next phase |
| **Hard fail** | Dishonest, unsourced, or breaks a locked rule. Stop. Do not patch with copy |

Required fixtures and Task 6 are **must-pass**. Nice-to-have phone polish (keyboard covering CTA) is fail, not hard fail, unless it blocks submit.

---

## 4. Gold profiles

These are the eval inputs. Store them as fixtures in code (`src/domain/fixtures/`). Expected codes come from [`edge-case.md`](./edge-case.md).

| Eval ID | Edge ID | Input (short) | Must return |
| --- | --- | --- | --- |
| **G-A** | EC-FIX-01 | Hyderabad, Class 12 done, CBSE 82%, computing, football, loan, work in UK | Computing UG; `appears_to_meet` if 82% ≥ sourced threshold; scholarship **range**; football slot; loan framing |
| **G-B** | EC-FIX-02 | Kochi, still Class 12, ~75% expected, business, food, family decides, cost worry | Business UG; `too_early` + provisional; cost-first; parent WhatsApp slots |
| **G-MUM** | EC-FIX-03 | Engineering done, business master’s, funding unsure, self-if-parents-pay, cricket/football | Management **PG**, one-year if sourced; not remapped to UG; cost stack |
| **G-T6-1** | EC-T6-01 | Class 12 + master’s | `wrong_level`; no MSc match |
| **G-T6-2** | EC-T6-02 | Marks under India threshold | Course still shown; `below_requirement` |
| **G-T6-3** | EC-T6-03 | B.Com + computing master’s | `subject_gap` |
| **G-T6-4** | EC-T6-04 | Parent view / WhatsApp of a completed child | Same facts; no second questionnaire |

Threshold for G-A is not hardcoded at 60% in the eval. It is **whatever Phase 1 stored** for that course’s India entry. If research later says 65%, the test follows the catalogue.

---

## 5. Honesty eval corpus

`honesty.ts` (or a grep in CI) must **fail** if any student-facing string matches these. Include teaser, results, thanks, parent view, WhatsApp.

| Pattern (intent) | Example of a fail |
| --- | --- |
| Guaranteed place | “You’re in.” “You have a place at UEL.” |
| Personal scholarship amount | “You will get £2,000.” “Your scholarship is £5,000.” |
| Visa outcome | “You will get a visa.” |
| Job / salary / PR / placement % | “You will get a UK job.” “92% employed.” |
| Urgency scam | “Limited seats.” “Only 3 left.” Countdown |
| Home-only award on an international page | “50% postgraduate scholarship” (Home scheme) |

Allowed (must still appear near the money):

- “You **appear to meet** the **published** requirements.”
- “International scholarships are typically **£500–£5,000**, decided by UEL, confirmed in an offer letter.”
- “Estimates for **2026/27**. Source dated …”
- `PLACEHOLDER — confirm on GOV.UK / UEL`

**Eval:** run corpus on committed copy + rendered HTML of G-A, G-B, G-T6-1…4. Any hit = hard fail (D6).

---

## 6. Phase gates

A phase is not done because the code exists. It is done when its eval passes.

### Phase 0 — Foundation

| Check | Kind | Pass |
| --- | --- | --- |
| App boots | E-phone or local | `npm run dev` shows a phone-width shell |
| Types | E-auto | Catalogue shells typecheck |
| Honesty constants exist | E-auto | Corpus file present (can be empty of UI copy) |

### Phase 1 — Research (D4, D7)

| Check | Kind | Pass | Hard fail |
| --- | --- | --- | --- |
| ≥15 courses, management-heavy, 2026/27 | E-sheet | Count + mix | — |
| Each course: fee, campus, dates, India entry, extras | E-sheet | Fields filled or PLACEHOLDER | Empty fee with no placeholder |
| URL + date on every fact | E-sheet | No blank source | Fact without URL/date |
| Scholarship as range, exclusions listed | E-sheet | £500–£5,000, first year | Single “average award” as policy |
| Full cost stack listed | E-sheet | Tuition, living, visa, IHS, deposit, room, flights | Line omitted to look cheaper |
| GOV.UK rows | E-sheet | Ambrosh value + URL + date, or PLACEHOLDER | Guessed UKVI number |
| RBI INR | E-sheet | Rate, URL, date | Live-scraped rate with no date |
| Collection note | E-sheet | Scrapy → live UEL check → GOV.UK spot-check → RBI | “We used AI” with no method |
| `issues` used when true | E-sheet | Out of date / contradicts / not-for-India recorded | Known clash hidden |
| Live check ≠ raw | E-sheet | Spot three course URLs vs JSON | JSON matches scraper, not the page |

**Sample audit (do three by hand):** Computer Science UG, Business Management UG, International Business MSc (or the real titles). Tick fee, campus, start date against the open page.

### Phase 2 — Domain engine (D1, D6)

`npm test` must include:

| Test | Gold / edge | Pass |
| --- | --- | --- |
| G-A | EC-FIX-01 | See §4 |
| G-B | EC-FIX-02 | See §4 |
| G-MUM | EC-FIX-03 | PG management, no UG remap |
| G-T6-1 | EC-T6-01 | `wrong_level` |
| G-T6-2 | EC-T6-02 | `below_requirement` + course |
| G-T6-3 | EC-T6-03 | `subject_gap` |
| Exact threshold | EC-ELIG-01 | `appears_to_meet` |
| Bad marks | EC-ELIG-05 | reject / `unknown` |
| Scholarship range | EC-COST-01 | No personal £ |
| Home 50% PG | EC-COST-09 | Not applied |
| Placeholders in cost | EC-COST-03, 07 | No fake grand total |
| Honesty | EC-COPY-01, EC-Q-01 | Corpus fail on forbidden strings |
| Priority hidden | EC-ADV-01 | Rank exists; not in student copy |

No UI yet. If tests are skipped “until we have pages,” Phase 2 has not passed.

### Phase 3 — Question spec (D3, D5)

| Check | Kind | Pass | Hard fail |
| --- | --- | --- | --- |
| Every question: wording, format, options, who sees it, why | E-copy | Full spec file | — |
| Prototype six are a **subset** | E-copy | Exact overlap with spec | UI invents a seventh wording |
| Landing: scholarship hook, no urgency | E-copy | EC-Q-01 | Limited seats |
| Gate after teaser | E-copy | EC-Q-02 | Phone on screen one |
| Options include funding unknown + self-if-parents-pay | E-copy | Locked Task 1 | Forced loan vs family |
| Interests: football, cricket, food, other | E-copy | Slots exist | — |
| Attribution described as UTM not a quiz | E-copy | Task 3 asks answered | — |

**Ambrosh:** read once for “sounds like an application / scam.” That review is part of the gate.

### Phase 4 — Results copy (D2, D6)

| Check | Kind | Pass | Hard fail |
| --- | --- | --- | --- |
| G-A page < 300 words | E-copy | Count | — |
| G-B page < 300 words | E-copy | Count | — |
| WhatsApp B < 120 words | E-copy | Count | — |
| Headline, course, eligibility, scholarship, cost, life, next step | E-copy | All present | — |
| Life uses **their** slots | E-copy | A = football; B = food | Generic campus paragraph |
| Honesty next to scholarship | E-copy | EC-COPY-02 | Footer only |
| Corpus clean | E-auto | §5 | Any forbidden promise |
| Regenerated `match()` agrees with locked md | E-auto | Same course + eligibility + fee | Two truths |
| Why-it-works notes | E-copy | Under each piece | Notes that describe the page instead of the person |

### Phase 5 — Prototype (D5, D1)

Phone, not a desktop screenshot. Tick [`edge-case.md` Phase 5 checklist](./edge-case.md#phase-5--7-phone-checklist).

| Check | Pass | Hard fail |
| --- | --- | --- |
| Reel-shaped entry → six questions → teaser → gate → result → thanks | Completes in a few minutes | Cannot finish on a phone |
| G-A answers → G-A shape | Course family + eligibility + football | Wrong student page |
| G-MUM | Still PG; no silent UG | Remap |
| G-T6-1, 2, 3 | Codes as §4; no crash | Fake pass / empty screen |
| G-T6-4 | Parent link, no extra form | Parent must sit the quiz |
| UTM survives | EC-LEAD-05 | Attribution dropped |
| No pinch-zoom; one column; CTA tappable | EC-UX-01 | Desktop-only |
| Honesty in view-source | §5 | Limited seats or a promise |
| Runtime does not call UEL.ac.uk | Local JSON | Live scrape |

Out of scope (do **not** fail the prototype for these): all 15 courses in the UI, real WhatsApp API, adviser dashboard, live FX, LLM copy, placement stats.

### Phase 6 — Written pack (D1, D2, D3)

| Check | Pass | Hard fail |
| --- | --- | --- |
| One document: tasks 1, 3, 4, 6 | All four present | Task 1 missing or still a fact sheet only |
| Task 1 is people, not users | Hopes, fears, UEL vs India, trust, apply | “Then the user clicks…” |
| Task 6: each of four people, what they see, **whether that is right** | Matches live `match()` / prototype | A new design that the tool does not do |
| No contradiction with the link | Spot-check G-A and G-T6-1 | Doc says `wrong_level`, app remaps |

### Phase 7 — Ship (all dimensions)

| Deliverable | Eval |
| --- | --- |
| Document 1+3+4+6 | Phase 6 pass |
| Spreadsheet + collection note | Phase 1 pass |
| Live phone URL | Phase 5 checklist on **production** URL |
| AI-tools note | Names tools and **what** they were used for (Scrapy, coding, drafts). Honest. |

Smoke on the live URL: G-A happy path + one of G-T6-1/2/3 + UTM. Then score §1 D1–D7.

---

## 7. Cross-task consistency eval (D1)

The brief marks six separate exercises as a fail. Run this after Phase 5.

| Question | Pass if |
| --- | --- |
| Does Task 4 copy come from the same `match()` as the prototype? | Same course id, eligibility code, tuition, scholarship range |
| Does Task 6 describe that prototype, not a wish? | G-T6 behaviour is what the phone shows |
| Does Task 3 wording = on-screen wording? | No improvised React strings |
| Does Task 2 catalogue = numbers on the results page? | Fee and year 2026/27 match the sheet |
| Is the Mumbai boy in Task 1 but **not** substituted for A/B? | EC-PROC-01 |

Any “no” = D1 fail. Fix engine or copy; do not keep both.

---

## 8. Phone script (E-phone)

Use this script for Phase 5 and again on the live link.

1. Open the URL on a phone. Note load. Pinch: text should already be readable.
2. Landing: scholarship visible? Urgency copy? (**Hard fail** if limited seats.)
3. Paste or use `?utm_source=instagram&utm_campaign=eval`.
4. Play **G-A**. Screenshot results. Check football, range not a personal £, honesty by the money, word-count feel (not a wall).
5. New session. Play **G-T6-1**. Confirm it does not look like a successful MSc match.
6. Play **G-T6-2**. Course still there; not a fake pass.
7. Open parent link from a completed G-B (or A). No questionnaire. Cost first.
8. Refresh mid-questions once. Answers still there.
9. Submit lead. Confirm UTM on the stored lead if you can see it; otherwise at least the thanks screen.

Record: Pass / Fail / Hard fail per step. One hard fail blocks Phase 7.

---

## 9. Who signs what

| Gate | Build | Ambrosh |
| --- | --- | --- |
| Phase 0–2 | Runs tests, fills catalogue | GOV.UK three lines (or agrees PLACEHOLDER) |
| Phase 3 | Drafts spec | Tone: scam / application-form smell |
| Phase 4 | Drafts A/B/WhatsApp | Voice: would A or B’s family believe it? |
| Phase 5–7 | Phone + deploy | Optional second phone; **Task 1 pages**; final send |
| D2, D3 | — | Task 1 is his eval of the people. The tool eval is whether it respects that story |

---

## 10. Final scorecard (print at submit)

Date: ________  URL: ________

| Dimension | Pass? | Evidence (test / screenshot / sheet tab) |
| --- | --- | --- |
| D1 One tool | | |
| D2 People | | |
| D3 Decision | | |
| D4 Research | | |
| D5 Phone from a reel | | |
| D6 Honesty | | |
| D7 Placeholders | | |

Gold profiles: G-A ___ G-B ___ G-MUM ___ G-T6-1 ___ G-T6-2 ___ G-T6-3 ___ G-T6-4 ___

Honesty corpus: ___  Live phone smoke: ___  Four submission items: ___

**Submit only if every D is Pass and no hard fail is open.**

---

## 11. What this eval is not

- Not an LLM quality score for “how nice the copy feels” as a substitute for word limits and honesty.
- Not a retrieval/RAG benchmark. We do not eval chunk hit-rate. We eval sourced JSON and `match()`.
- Not a replacement for [`edge-case.md`](./edge-case.md). If a new live-site surprise appears, add an **EC-** ID there, then a row here if it is required to pass a phase.
