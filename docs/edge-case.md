# Edge cases and corner scenarios

Catalogue of corners the Finder must handle. Tied to [`implementation-plan.md`](./implementation-plan.md), [`architecture.md`](./architecture.md), and the locked decisions in [`problemStatement.md`](./problemStatement.md).

Use this file as:

- Phase 2 unit tests (`match()`, `cost()`, `scholarship()`, `honesty()`)
- Phase 5 phone checks
- Phase 6 Task 6 writing (the four brief cases are **EC-T6-01** to **EC-T6-04**)
- Phase 7 smoke on the live link

Every case has a **must not**. That column is the lie the brief would mark us down for.

Happy paths (Student A, Student B, Mumbai graduate) are included because they are fixtures, not because they are exotic.

---

## How to read a case

| Column | Meaning |
| --- | --- |
| **ID** | Stable. Do not renumber; add at the end of a section. |
| **Given** | Who they are / what they did / what the data looks like. |
| **Expect** | What `match()` and the UI must show. |
| **Must not** | The misleading shortcut. |
| **Phase** | Where it is proven. |
| **Right?** | For Task 6 only: whether that behaviour is the correct product call. |

Eligibility codes, from architecture §6.4: `appears_to_meet` · `below_requirement` · `wrong_level` · `subject_gap` · `too_early` · `unknown`.

---

## 1. Task 6 — the four the brief names

These four must appear in the written judgement. Implement them in `match.ts` first, then write what the person would see.

### EC-T6-01 — Class 12 student who chooses a master’s

| | |
| --- | --- |
| **Given** | Still in Class 12 (or just finished school with no bachelor’s). Picks master’s. Any subject. |
| **Expect** | `wrong_level`. Explain that a master’s needs a bachelor’s. Offer to *show* bachelor’s options in the same subject. Do not change their answer behind their back. Next step: adviser, or “see bachelor’s courses.” |
| **Must not** | Silent remap to a bachelor’s and a results page that reads as if they chose it. Must not match an MSc. |
| **Phase** | 2 test, 5 phone, 6 write-up. |
| **Right?** | **Yes.** Silent remapping would mislead. |

### EC-T6-02 — Marks below the published entry requirement

| | |
| --- | --- |
| **Given** | Qualification matches the level (e.g. Class 12 → bachelor’s, or bachelor’s → master’s). Percentage is under the India threshold for the matched course (e.g. CBSE 55% vs 60%). |
| **Expect** | Still show a course. `below_requirement`. State the published threshold and their marks. Next step: adviser / retake / foundation **only if sourced**. Scholarship still described as a *possibility if they later receive an offer*, not as a prize for low marks. |
| **Must not** | Fake `appears_to_meet`. Dead-end with no course. “You missed the scholarship.” Inflating marks. |
| **Phase** | 2, 5, 6. |
| **Right?** | **Yes.** Honesty plus a path beats a fake pass or a brick wall. |

### EC-T6-03 — B.Com graduate who wants a master’s in computing

| | |
| --- | --- |
| **Given** | Bachelor’s in commerce / B.Com (or equivalent business degree). Chooses master’s + computing. No computing modules on record (we did not ask, or they said none). |
| **Expect** | `subject_gap`. Do not say they meet computing entry. If — and only if — UEL publishes a conversion, pre-masters, or a computing master’s that accepts a business degree, show that with sources. Otherwise: adviser conversation, not a pretend match. |
| **Must not** | Match MSc Computer Science as `appears_to_meet`. Invent a conversion course. Ignore subject fit. |
| **Phase** | 2, 5, 6. |
| **Right?** | **Yes.** “Would I get in?” includes subject fit. |

### EC-T6-04 — Parent who opens a link their child sent

| | |
| --- | --- |
| **Given** | Parent opens `/p/[id]` or `?view=parent` (or the WhatsApp text). They did not sit the questionnaire. |
| **Expect** | Same facts: course, eligibility in plain language, scholarship **range**, year-one cost stack, campus, support. Calmer layout. More cost and safety. Less “your weekends playing football” unless the child chose to include it. No extra form. Same caveats. |
| **Must not** | Make the parent re-answer questions. Promise a place, amount, visa, or job. Hide the honesty line. Show a different fee from the child’s page. |
| **Phase** | 5 parent view, 4 WhatsApp for B, 6 write-up. |
| **Right?** | **Yes.** The parent is deciding with money and safety, not browsing courses. |

---

## 2. Required fixtures (not Task 6, still must not break)

### EC-FIX-01 — Student A (Hyderabad)

| | |
| --- | --- |
| **Given** | Finished Class 12, CBSE 82%, computing, football, loan arranged, wants to work in the UK. |
| **Expect** | Computing UG. `appears_to_meet` if 82% ≥ the published India threshold for that course. Scholarship **range**. Football in the life copy. Loan framing (year-one as a number he can take to a lender). Honesty: work in the UK is a hope, not an outcome. |
| **Must not** | Promise a UK job, visa, or PR. Pick a scholarship amount from 82%. Business course. |
| **Phase** | 2, 4 results-a, 5 happy path. |

### EC-FIX-02 — Student B (Kochi)

| | |
| --- | --- |
| **Given** | 17, still in Class 12, CBSE, expecting ~75%, business, food and cooking, whole family decides, worried about cost. |
| **Expect** | Business UG. `too_early` plus a provisional reading against the published threshold. Cost-first tone. Parent WhatsApp under 120 words. Food in the life copy. |
| **Must not** | Treat 75% as final results. Talk only to the child. Promise the family a figure they will “get.” Skip the honesty line because they are anxious. |
| **Phase** | 2, 4 results-b + whatsapp-b, 5 if B is the shipped page. |

### EC-FIX-03 — Mumbai graduate (Task 1 persona)

| | |
| --- | --- |
| **Given** | Engineering bachelor’s done, above average. Wants business / management **master’s**. Funding `unsure`. Decider `self-if-parents-pay`. Football/cricket. Instagram reel. |
| **Expect** | One-year management PG (not a bachelor’s). Cost stack a father can see. Scholarship as the hook. Life copy can use football/cricket. CTA that supports “show your father” once `appears_to_meet`. |
| **Must not** | Silent remap to UG engineering. Invent how they will pay. “Limited seats.” Placement rates. A rejection-shaped page he would never put on the dining table *when he does meet requirements*. |
| **Phase** | 2, 5 (must not crash). Not a Task 4 page. |

---

## 3. Eligibility and matching

### EC-ELIG-01 — Marks exactly on the threshold

**Given:** Percentage equals `indiaEntry.minPercent` (e.g. 60% vs 60%).  
**Expect:** `appears_to_meet` (published requirement is met, not beaten).  
**Must not:** `below_requirement` because they did not score “above.”  
**Phase:** 2.

### EC-ELIG-02 — Marks 0.1 below the threshold

**Given:** 59.9% vs 60%, or 59% if we only store whole percents.  
**Expect:** `below_requirement`. Show both numbers.  
**Must not:** Round them up to a pass.  
**Phase:** 2.

### EC-ELIG-03 — Expected marks vs achieved marks

**Given:** Still in Class 12, types an *expected* 75%.  
**Expect:** `too_early` + provisional sentence: if they achieve around 75%, they would be below / around / above the published guide.  
**Must not:** Same copy as Student A (who has finished). “You have a place pending results.”  
**Phase:** 2, 4 (B), 5.

### EC-ELIG-04 — Graduate who picks a bachelor’s

**Given:** Already holds a bachelor’s. Chooses undergraduate.  
**Expect:** Match UG if they insist; state that they already hold a degree and a master’s may fit better. Do not auto-switch.  
**Must not:** Force a master’s. Hide that they chose bachelor’s.  
**Phase:** 2, 5.

### EC-ELIG-05 — Empty or nonsense marks

**Given:** Blank, 0, 101, “eighty two”, negative.  
**Expect:** Block continue, or `unknown` with “we need a percentage 1–100.”  
**Must not:** Crash. Treat blank as 0 and `below_requirement`.  
**Phase:** 2, 5.

### EC-ELIG-06 — Board that is not CBSE

**Given:** Kerala state (UEL often cites 65%), ISC, “other state board” (sometimes 70%), diploma 55%.  
**Expect:** Use the **India page** rule for that board if sourced. If the course page is stricter, use the stricter and record both in `issues`.  
**Must not:** Apply 60% CBSE to everyone. Ignore a sourced Kerala 65%.  
**Phase:** 1 data, 2.

### EC-ELIG-07 — Course page vs India page disagree

**Given:** India page says 60% overall; the course page asks for 70% in a subject or a portfolio.  
**Expect:** Show the stricter / extra condition. Note the contradiction in `issues` and on the Task 2 sheet.  
**Must not:** Pick the looser number because it converts better.  
**Phase:** 1, 2.

### EC-ELIG-08 — Extra condition we did not ask (Maths, portfolio)

**Given:** Computing/engineering course needs Year 12 Maths; the prototype did not ask Maths.  
**Expect:** Eligibility is provisional. Line: “this course also asks for X — an adviser will check.”  
**Must not:** `appears_to_meet` with no caveat. Invent that they have Maths.  
**Phase:** 2, 3 (whether the full spec asks it), 5.

### EC-ELIG-09 — No course in that subject family

**Given:** Student picks “other” / law / health and the prototype catalogue only has computing + business.  
**Expect:** Nearest sourced family, **explicitly** “we matched you to the nearest subject we have sourced,” or `unknown` + adviser.  
**Must not:** Random computing result with no note. Empty results.  
**Phase:** 2, 5.

### EC-ELIG-10 — MBA vs taught MSc

**Given:** Management master’s; MBA fee is different (often higher).  
**Expect:** Pick using subject + level rules, not “MBA sounds prestigious.” Show that course’s real fee.  
**Must not:** Show MSc fee on an MBA title or the reverse.  
**Phase:** 1, 2.

### EC-ELIG-11 — Scholarship-excluded course

**Given:** Matched course is foundation / pre-masters / franchised / otherwise excluded.  
**Expect:** Say the international scholarship does **not** apply to this course. Still show tuition honestly.  
**Must not:** Leave the £500–£5,000 range on an excluded course.  
**Phase:** 1, 2.

### EC-ELIG-12 — Two eligible courses, must pick one

**Given:** Several business UG courses all fit.  
**Expect:** One primary course. Optional “also look at” only if it does not dilute the page.  
**Must not:** A catalogue list. The Finder is not a search.  
**Phase:** 2, 4, 5.

### EC-ELIG-13 — Missing India entry on a course record

**Given:** Course scraped but `indiaEntry` is placeholder.  
**Expect:** `unknown`. Placeholder copy. Still show sourced fee if present.  
**Must not:** Fall back to a generic UK tariff. Guess 60%.  
**Phase:** 1, 2.

---

## 4. Scholarship and first-year cost

### EC-COST-01 — Showing a single scholarship figure as theirs

**Given:** Any eligible student.  
**Expect:** Range £500–£5,000, first year, UEL decides, appears in an offer letter. Optional worked example **labelled as example**.  
**Must not:** “You will get £2,000.” Tying amount to marks.  
**Phase:** 2, 4, 5, honesty tests.

### EC-COST-02 — Subtracting the max scholarship from tuition as “your cost”

**Given:** Cost stack.  
**Expect:** Tuition full; scholarship as range or labelled illustration. Mother must not see an artificially low total.  
**Must not:** `tuition − £5,000` presented as what they pay.  
**Phase:** 2, 4, 5.

### EC-COST-03 — GOV.UK lines still PLACEHOLDER

**Given:** Visa / IHS / living not yet spot-checked.  
**Expect:** Visible `PLACEHOLDER — confirm on GOV.UK`. Stack still lists the line.  
**Must not:** Omit the line so the total looks smaller. Invent a typical figure.  
**Phase:** 1, 2, 5. Until Ambrosh confirms.

### EC-COST-04 — Flights and deposits unsourced

**Given:** No dated UEL deposit or fare.  
**Expect:** Placeholder or a **labelled** estimate with source.  
**Must not:** Silent “£400 flights.”  
**Phase:** 1, 2.

### EC-COST-05 — INR snapshot vs live rate

**Given:** RBI reference stored with URL and date. Student opens the tool a week later.  
**Expect:** Same stored snapshot, labelled with date.  
**Must not:** Live FX at request time. INR without a date.  
**Phase:** 2, 5.

### EC-COST-06 — INR without GBP

**Given:** Family thinks in rupees.  
**Expect:** GBP first (source of truth), INR beside it.  
**Must not:** INR only.  
**Phase:** 4, 5.

### EC-COST-07 — Totalling placeholders

**Given:** Some lines are numbers, some are PLACEHOLDER.  
**Expect:** Do not emit a fake grand total that skips placeholders. Show “total of sourced lines” vs “plus items still to confirm,” or no single total.  
**Must not:** A confident “Year one: £28,000” with flights missing.  
**Phase:** 2, 4, 5.

### EC-COST-08 — Early-payment 5% discount

**Given:** UEL also publishes an early-payment discount.  
**Expect:** Only if sourced; labelled as conditional (“if you pay in full by…”). Not added into the default stack as already saved.  
**Must not:** Bake 5% into “your fee.”  
**Phase:** 1, 2.

### EC-COST-09 — Home-student postgraduate scholarship

**Given:** UEL 50% PG scholarship is for **Home** fee status.  
**Expect:** Do not offer it to this Indian international student.  
**Must not:** “50% off” on an international results page.  
**Phase:** 1, 2, honesty.

### EC-COST-10 — Academic year mix-up

**Given:** Page still shows 2025/26 fees.  
**Expect:** Prefer 2026/27. If only older fees exist, store them with `issues: out of date` and label the year on screen.  
**Must not:** Unlabelled old fees as current.  
**Phase:** 1, 2.

---

## 5. Questions, wizard, and drop-off

### EC-Q-01 — “Limited seats” / countdown / urgency

**Given:** Any screen, especially landing.  
**Expect:** None of it.  
**Must not:** “Only 3 seats.” “Offer expires at midnight.” Mumbai student **closes here** (locked Q16).  
**Phase:** 3 spec, 5 UI, honesty corpus.

### EC-Q-02 — Phone number on screen one

**Given:** Student just tapped a reel.  
**Expect:** Landing is headline + start. Gate is after teaser.  
**Must not:** Lead form first.  
**Phase:** 3, 5.

### EC-Q-03 — Conditional question shown to the wrong person

**Given:** Class 12 student sees “what was your bachelor’s class?” or a graduate sees CBSE board only.  
**Expect:** Master’s-only and Class 12-only questions hidden from everyone else.  
**Must not:** Dead-end because a hidden field is required.  
**Phase:** 3, 5.

### EC-Q-04 — Back button / refresh

**Given:** Phone refresh on question 4, or back from teaser.  
**Expect:** `sessionStorage` restores answers. Back does not wipe.  
**Must not:** Restart from landing with a blank profile.  
**Phase:** 5.

### EC-Q-05 — Skip / empty required question

**Given:** Continue with no selection.  
**Expect:** Stay; ask them to choose.  
**Must not:** `match()` on empty subject → random course.  
**Phase:** 5.

### EC-Q-06 — “I don’t know” funding

**Given:** Task 1 default: they do not know how they would pay.  
**Expect:** Valid option. Results still show the stack. Tone: this is the number to discuss, not a loan product.  
**Must not:** Force loan vs family. Hide cost until they pick a payment method.  
**Phase:** 2, 3, 5.

### EC-Q-07 — Who decides: self-if-parents-pay

**Given:** He decides, parents must agree to pay.  
**Expect:** Distinct from “the family decides” (Student B). CTA: show / forward to father once eligibility looks good.  
**Must not:** Same copy as Kochi family-decides.  
**Phase:** 3, 4, 5.

### EC-Q-08 — Interest = other

**Given:** Not football, cricket, or food.  
**Expect:** Neutral London-life fragment. No invented hobby.  
**Must not:** “Your weekends at the football” for someone who picked other.  
**Phase:** 2 copy slots, 5.

### EC-Q-09 — Mid-flow close after a scary fee

**Given:** Teaser or a question leaks a huge number with no scholarship in sight.  
**Expect:** Scholarship visible *before* a raw fee dump. Teaser may say a scholarship **may** apply; full stack sits behind the gate.  
**Must not:** Tuition-only teaser that makes the mother say no before the range exists.  
**Phase:** 3, 5.

### EC-Q-10 — Looks like an application form

**Given:** Too many fields, passport, 10th marks, upload.  
**Expect:** Prototype stays at six questions. Full spec stays short.  
**Must not:** UCAS replica. Brief is a Finder, not apply.  
**Phase:** 3, 5.

---

## 6. Gate, lead, consent, attribution

### EC-LEAD-01 — Submit without consent

**Given:** Name + phone, WhatsApp or UEL-share unchecked.  
**Expect:** Cannot share with UEL without that consent. WhatsApp follow-up only if that box is on.  
**Must not:** Treat silence as yes.  
**Phase:** 5.

### EC-LEAD-02 — Invalid phone

**Given:** 123, missing +91, 9 digits, landline.  
**Expect:** Validate Indian mobile (E.164, default +91).  
**Must not:** Store garbage and “we will WhatsApp.”  
**Phase:** 5.

### EC-LEAD-03 — Teaser then abandon gate

**Given:** Sees course name, closes before name/phone.  
**Expect:** No lead, or anonymous incomplete (not called). Session may keep answers if they return.  
**Must not:** Create a callable lead from a first name guessed from the device.  
**Phase:** 5.

### EC-LEAD-04 — UTM missing (typed the URL)

**Given:** No `utm_source`.  
**Expect:** Lead still works. Attribution empty. Do not quiz “which reel?” unless we must.  
**Must not:** Block results until they name an influencer.  
**Phase:** 5.

### EC-LEAD-05 — UTM lost between landing and submit

**Given:** Landed with Instagram UTM, six questions later submits.  
**Expect:** Same UTM on the lead.  
**Must not:** Drop campaign at the gate.  
**Phase:** 5, 7 smoke.

### EC-LEAD-06 — Results URL shared before gate

**Given:** Someone guesses `/results`.  
**Expect:** No full result without a lead / session.  
**Must not:** Ungated full cost + copy (defeats the honest trade).  
**Phase:** 5.

### EC-LEAD-07 — Duplicate submit

**Given:** Double-tap Show my result.  
**Expect:** One lead, or idempotent. Same `leadId`.  
**Must not:** Two adviser rows, two WhatsApps.  
**Phase:** 5.

---

## 7. Results copy, honesty, and personalisation

### EC-COPY-01 — Four forbidden promises

**Given:** Any generated string (results, WhatsApp, thanks, parent view, teaser).  
**Expect:** Honesty pass fails the build / strips it.  
**Must not:** Place, specific £ award, visa outcome, job / salary / placement % / PR.  
**Phase:** 2, 4, 5, 6.

### EC-COPY-02 — Honesty line buried

**Given:** Long results page.  
**Expect:** Honesty sits next to the scholarship number.  
**Must not:** Footer-only disclaimer.  
**Phase:** 4, 5.

### EC-COPY-03 — Life copy uses the wrong slot

**Given:** Student A (football, Hyderabad, loan) vs B (food, Kochi, family, cost).  
**Expect:** A does not get cooking copy; B does not get “your loan is arranged” unless they said so.  
**Must not:** One generic London paragraph.  
**Phase:** 4, 5.

### EC-COPY-04 — Word limits

**Given:** Task 4 pages and WhatsApp.  
**Expect:** Each results page **< 300 words**. WhatsApp B **< 120 words**.  
**Must not:** A beautiful essay that misses the brief.  
**Phase:** 4.

### EC-COPY-05 — Engine and locked copy disagree

**Given:** `match()` regenerated after a fee change.  
**Expect:** Update copy or engine; one truth.  
**Must not:** Document says £16,020, live tool says £15,900.  
**Phase:** 4 lock, 6, 7.

### EC-COPY-06 — Placement rates the family wants

**Given:** Task 1 father would apply if placements “looked attractive.”  
**Expect:** Named in Task 1 as a *want*. Product shows no invented rate. Career hope in life copy only as hope.  
**Must not:** “92% employed.”  
**Phase:** 2 honesty, 4, 6 Task 1 vs 4 tension.

### EC-COPY-07 — “You appear to meet” vs “you’re in”

**Given:** `appears_to_meet`.  
**Expect:** Published requirements; admissions decide. This is the page he **will** show his father (locked Q17).  
**Must not:** “Congratulations, you have a place.”  
**Phase:** 2, 4, 5.

---

## 8. Parent, WhatsApp, and family money

### EC-PAR-01 — WhatsApp that promises what UEL decides

**Given:** Student B forward text.  
**Expect:** Course, eligibility signal, range, year-one picture, next step, caveats. Under 120 words.  
**Must not:** “They will give him £3,000 and a visa.”  
**Phase:** 4, 6.

### EC-PAR-02 — Mother sees fees too high

**Given:** Full stack, no scholarship context.  
**Expect:** Range visible; placeholders not hidden.  
**Must not:** Optimistic total that blows up later on the dining table.  
**Phase:** 4, 5.

### EC-PAR-03 — Parent view for a `below_requirement` child

**Given:** EC-T6-02 + parent link.  
**Expect:** Same below-threshold honesty. Path (adviser), not shame, not a fake pass for the family.  
**Must not:** Softer lie for the parent.  
**Phase:** 5, 6.

### EC-PAR-04 — Child chose football; parent opens the link

**Given:** EC-T6-04 + Student A-like interests.  
**Expect:** Parent view may mention it lightly or omit weekend colour. Cost still first.  
**Must not:** “Your weekends playing football” written as if the parent plays.  
**Phase:** 5.

---

## 9. Adviser priority (not shown to the student)

### EC-ADV-01 — High intent

**Given:** `appears_to_meet`, start within ~6 months, loan or family-decider, consent on.  
**Expect:** Priority 1. Reasons stored.  
**Must not:** Surface “you are a hot lead” on the student page.  
**Phase:** 2 `priority.ts`.

### EC-ADV-02 — Wrong level bounce

**Given:** EC-T6-01, no consent.  
**Expect:** Low priority.  
**Must not:** Call list from incomplete / no consent.  
**Phase:** 2.

### EC-ADV-03 — Close but below, still in Class 12

**Given:** Expected 58% vs 60%, time to sit exams.  
**Expect:** Medium: time to improve or talk foundation **if sourced**.  
**Must not:** Same rank as a far-below graduate with no path.  
**Phase:** 2.

---

## 10. Research, scraper, and catalogue

### EC-DATA-01 — Scraper copies an old fee

**Given:** `data/raw` ≠ live page.  
**Expect:** Live-page check wins. Raw kept for audit. `issues` if they differed.  
**Must not:** Engine reads raw.  
**Phase:** 1.

### EC-DATA-02 — Basket title does not exist

**Given:** UEL has no “BA International Business” under that name.  
**Expect:** Nearest published management title. Keep ≥15.  
**Must not:** Invent a course.  
**Phase:** 1.

### EC-DATA-03 — robots.txt / login wall

**Given:** Disallowed path or login.  
**Expect:** Stop. Collect that page by hand or skip.  
**Must not:** Ignore robots. Log in.  
**Phase:** 1.

### EC-DATA-04 — Fact with no URL or date

**Given:** A fee in JSON, empty `sourceUrl` / `checkedOn`.  
**Expect:** Schema reject, or `PLACEHOLDER`.  
**Must not:** Ship to `match()`.  
**Phase:** 0 types, 1.

### EC-DATA-05 — Fewer than 15 courses after drops

**Given:** Messy pages dropped.  
**Expect:** Pull replacements in the same family until ≥15.  
**Must not:** Submit 11 courses.  
**Phase:** 1 exit gate.

### EC-DATA-06 — Not applicable to students from India

**Given:** Requirement is A-level / IELTS-only / Home fee.  
**Expect:** `issues: not-for-india`. Do not use as the India rule.  
**Must not:** “A-level BBB” as the Indian student’s bar with no India mapping.  
**Phase:** 1, 2, Task 2 sheet.

### EC-DATA-07 — GOV.UK check lags the engine

**Given:** Phase 2 starts before Ambrosh pastes visa / IHS / living.  
**Expect:** Placeholders. Tests accept PLACEHOLDER.  
**Must not:** Block all matching. Guess UKVI numbers.  
**Phase:** 1.3, 2.

---

## 11. Phone, performance, and ship

### EC-UX-01 — Desktop-only layout

**Given:** Mid-range Android, portrait, ~390px.  
**Expect:** One column, pinned CTA, no pinch-zoom to read.  
**Must not:** Phase 5 signed off on a laptop screenshot only.  
**Phase:** 5, 7.

### EC-UX-02 — Slow 4G first paint

**Given:** Reel tap.  
**Expect:** Landing usable quickly; catalogue is local JSON.  
**Must not:** Wait on UEL.ac.uk at runtime.  
**Phase:** 5, 7.

### EC-UX-03 — Live URL 404 / desktop redirect

**Given:** Phase 7 deploy.  
**Expect:** Phone opens the Finder. Happy path + one Task 6 path. UTM sticks.  
**Must not:** Submit a localhost link.  
**Phase:** 7.

### EC-UX-04 — Keyboard covering the primary button

**Given:** Phone field on the gate (name / phone).  
**Expect:** Can still submit (scroll, `scrollIntoView`, or input not covering CTA).  
**Must not:** Stuck behind the keyboard.  
**Phase:** 5.

### EC-UX-05 — `sessionStorage` cleared

**Given:** Safari ITP / user clears site data mid-flow.  
**Expect:** Soft recover: back to landing or “start again,” not a white error.  
**Must not:** Uncaught exception.  
**Phase:** 5.

---

## 12. Implementation-process corners

### EC-PROC-01 — Task 4 people swapped for Mumbai

**Given:** Temptation to write results for the Task 1 boy.  
**Expect:** Task 4 remains Hyderabad A and Kochi B.  
**Must not:** Submit Mumbai as Student A.  
**Phase:** 4, 6.

### EC-PROC-02 — Prototype six questions not in the full spec

**Given:** UI wording improvised in React.  
**Expect:** Every on-screen string exists in `docs/questions.md`.  
**Must not:** Two wordings for the same question.  
**Phase:** 3, 5.

### EC-PROC-03 — RAG / live LLM at runtime

**Given:** Suggestion to “just retrieve UEL pages.”  
**Expect:** No. Catalogue + `match()`. See project decision: no RAG.  
**Must not:** Generated fees or visa advice.  
**Phase:** all.

### EC-PROC-04 — Short-path skip of honesty or GOV.UK

**Given:** Time pressure (implementation-plan short path).  
**Expect:** Honesty tests and GOV.UK check still happen. Placeholders allowed; invented numbers not.  
**Must not:** Skip `honesty.ts` to ship.  
**Phase:** 7.

---

## Phase 2 test matrix (minimum)

Run these before any UI:

| ID | Profile / input | Expected code |
| --- | --- | --- |
| EC-FIX-01 | Student A | `appears_to_meet` (if 82% ≥ sourced threshold) |
| EC-FIX-02 | Student B | `too_early` + provisional |
| EC-FIX-03 | Mumbai graduate → business master’s | management PG, not UG remap |
| EC-T6-01 | Class 12 + master’s | `wrong_level` |
| EC-T6-02 | Marks below | `below_requirement`, course still shown |
| EC-T6-03 | B.Com → computing MSc | `subject_gap` |
| EC-ELIG-01 | Marks == threshold | `appears_to_meet` |
| EC-ELIG-05 | Marks 101 / blank | reject or `unknown` |
| EC-COST-01 | Eligible course | range, not a personal £ |
| EC-COST-09 | Home PG 50% | not shown |
| EC-COPY-01 | Forbidden phrases | honesty fail |
| EC-Q-01 | “limited seats” | honesty fail |
| EC-DATA-07 | Missing living cost | PLACEHOLDER, not a guess |

---

## Phase 5 / 7 phone checklist

On a real phone, not only a screenshot:

- [ ] EC-FIX-01 happy path → thanks  
- [ ] EC-FIX-03 graduate master’s → not remapped  
- [ ] EC-T6-01, 02, 03 do not crash or lie  
- [ ] EC-T6-04 parent link  
- [ ] EC-Q-01 no urgency copy  
- [ ] EC-Q-02 no phone on screen one  
- [ ] EC-Q-04 refresh keeps answers  
- [ ] EC-LEAD-05 UTM survives  
- [ ] EC-COPY-01 view-source clean  
- [ ] EC-UX-01 no pinch-zoom  

---

## Adding a case

If a live UEL page or a prototype build surprises you, append a new ID in the right section. Do not reuse IDs. Put a one-line `issues` note on the Task 2 sheet when the surprise is a sourced contradiction.
