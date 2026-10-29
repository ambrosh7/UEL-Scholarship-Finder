# Questions: UEL Fit & Scholarship Finder

Task 3 spec. Frozen **word for word** before any wizard screen is built. Phase 5 may only put on screen strings that appear in this file (or in [`src/domain/questions.ts`](../src/domain/questions.ts), which must stay in lockstep).

A stranger should be able to build the phone wizard from this document alone. Why each question exists points at the Phase 2 engine: `match()`, `copy.ts`, `cost.ts`, `scholarship.ts`, `priority.ts`, `Lead`.

Academic year **2026/27**. No limited seats, countdowns, or fake urgency. Not an application form.

**Ambrosh — tone pass (Phase 3 gate).** Read once. If a line sounds like a UCAS form or a “limited seats” reel, rewrite it here before Phase 5.

---

## How to read this file

Every question has:

| Field | Meaning |
| --- | --- |
| **On screen** | Exact wording the student reads |
| **Format** | choose one / choose several / dropdown / typed / checkbox |
| **Options** | Every answer, word for word |
| **Who** | everyone / a named subset. Anyone else never sees it |
| **Maps to** | `StudentProfile` / `Lead` field |
| **Changes** | What it does in `match()`, copy, cost, or the lead |
| **Prototype** | Yes = one of the six Task 5 questions |

Screens use a phone shell: one column, large targets, **Back** in the header, a thin progress bar on question screens only, primary button pinned at the bottom. State in `sessionStorage`. Attribution is stored on first landing, not asked.

Do not add passport numbers, 10th marks, IELTS scores, uploads, or “which reel did you watch?”

---

## Screen map

Full product, architecture §13. One primary question per question screen. Secondary fields are allowed on the same screen when they are the same decision (marks + board; who decides + how you’d pay).

| # | Screen | What is on it | Primary button | Prototype |
| --- | --- | --- | --- | --- |
| 0 | Landing | Scholarship headline, subline, honesty half-line | Start | Yes |
| 1 | Level | Q1 bachelor’s / master’s | Continue | Yes (1 of 6) |
| 2 | Stage | Q2 Class 12 / finished / graduate | Continue | Yes (2 of 6) |
| 3 | Subject | Q3 subject family | Continue | Yes (3 of 6) |
| 4 | Marks | Q4 percentage + Q4b board **or** Q4c degree | Continue | Yes (4 of 6) |
| 5 | Life | Q5 life outside your studies. Full product also Q5b city, Q5c career | Continue | Yes (5 of 6); Q5b/Q5c off |
| 6 | Money and family | Q6 who decides + Q6b how you’d pay | View my result | Yes (6 of 6) |
| — | (full only) | Q7 start date | Continue | No |
| — | (full only) | Q8 Maths, computing/engineering UG only | Continue | No |
| 7 | Teaser | Course name + scholarship *may* apply. Not the cost stack | View the full result | Yes |
| 8 | Gate | Name, Indian phone, two consents | View my result | Yes |
| 9 | Results | From `match()`. Not a question | Share with your parents / Speak with an adviser | Yes |
| 10 | Thanks | What we will do / will not promise | Done | Yes |

Parent view `/p/[id]` is not in this flow. No extra questions.

---

## Prototype six

Task 5 uses **exactly** these six, in this order. They are a subset of the full spec — same wording, not a parallel quiz. Options the prototype hides are marked **Full product only**.

| # | ID | On-screen wording |
| --- | --- | --- |
| 1 | `q-level` | Which qualification are you considering? |
| 2 | `q-stage` | What is your current stage of study? |
| 3 | `q-subject` | Which subject are you considering? |
| 4 | `q-marks` + `q-board` or `q-degree` | Percentage (wording follows stage) and board / degree |
| 5 | `q-interest` | What do you enjoy outside your studies? |
| 6 | `q-decide` + `q-funding` | Who will decide whether you apply? / How would the first year be funded? |

Screen 6 heading (not a seventh question): **Decision and funding**

If Phase 5 needs a string that is not in this file, stop and add it here first.

---

## Screen 0 — Landing

**Who:** everyone, including a parent who typed the URL.

| Element | Exact words |
| --- | --- |
| Headline | See what a UEL scholarship could mean for your first year in London. |
| Subline | A short set of questions on your phone. This is not an application. This is not an offer. |
| Honesty | UEL decides any place and any scholarship. |
| Button | Start |

**Never on this screen:** limited seats, only *n* left, apply in the next *n* hours, a countdown, a phone field, a name field.

**On load:** read `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` (influencer) from the URL. Store them for the lead. Default channel is an Instagram reel. Do not ask which video they watched.

**Why:** the scholarship is why they tapped the reel. If this looks like a scam, the Mumbai student closes it (locked Q16).

---

## Questions, in order

### Q1 — Level

| | |
| --- | --- |
| **ID** | `q-level` |
| **Prototype** | Yes — 1 of 6 |
| **Screen** | 1 |
| **Who** | everyone |
| **On screen** | Which qualification are you considering? |
| **Format** | choose one |
| **Button** | Continue |

**Options**

| On screen | Value |
| --- | --- |
| Bachelor’s degree | `undergraduate` |
| Master’s degree | `postgraduate-taught` |

**Maps to:** `StudentProfile.level`

**Why / what it changes.** Filters the course pool (`match.ts`). Bachelor’s → undergraduate fees and Class 12 India rules. Master’s → postgraduate-taught, usually one year, bachelor India rules. Does **not** silently fix a Class 12 student who picks a master’s — that is `wrong_level` at results (Task 6). Do not hide master’s from Class 12; do not add a helper that tells them to pick bachelor’s.

**Continue:** blocked until one option is selected.

---

### Q2 — Stage

| | |
| --- | --- |
| **ID** | `q-stage` |
| **Prototype** | Yes — 2 of 6 |
| **Screen** | 2 |
| **Who** | everyone |
| **On screen** | What is your current stage of study? |
| **Format** | choose one |
| **Button** | Continue |

**Options**

| On screen | Value |
| --- | --- |
| Currently in Class 12 | `class-12-current` |
| Completed Class 12 | `school-finished` |
| Graduate | `graduate` |

**Maps to:** `StudentProfile.educationStage`

**Why / what it changes.** With Q1, this is the `wrong_level` test: master’s + not `graduate` → no MSc, no silent remap to a bachelor’s. Currently in Class 12 + bachelor’s → `too_early` and a provisional reading of expected marks (Student B). Completed Class 12 → achieved marks (Student A). Graduate + bachelor’s → still match UG, with a note that a master’s may fit better; do not auto-switch.

Also chooses Q4’s wording and whether Q4b (board) or Q4c (degree) is shown.

---

### Q3 — Subject

| | |
| --- | --- |
| **ID** | `q-subject` |
| **Prototype** | Yes — 3 of 6 |
| **Screen** | 3 |
| **Who** | everyone |
| **On screen** | Which subject are you considering? |
| **Format** | choose one |
| **Button** | Continue |

**Options**

| On screen | Value | Prototype |
| --- | --- | --- |
| Business / Management | `business` | Yes |
| Computer Science | `computing` | Yes |
| Engineering | `engineering` | Full product only |
| Law | `law` | Full product only |
| Psychology | `other` | Full product only |
| A different subject | `other` | Yes |

Business / Management is listed first. This is a first-class path (the Mumbai graduate), not buried under computing.

**Maps to:** `StudentProfile.subjectInterest`

**Why / what it changes.** Picks the course family. Canonical matches today: Business Management BSc; International Business Management MSc (one year, not the MBA by default); Computer Science BSc / MSc. `A different subject` uses the nearest sourced family, with an explicit “we matched you to the nearest subject we have sourced” reason — never a silent computing result. B.Com + computing master’s still reaches Computer Science MSc as `subject_gap`, not `appears_to_meet`.

---

### Q4 — Marks

| | |
| --- | --- |
| **ID** | `q-marks` |
| **Prototype** | Yes — 4 of 6 (same screen as Q4b or Q4c) |
| **Screen** | 4 |
| **Who** | everyone (wording depends on Q2) |
| **Format** | typed number, 1 to 100, one decimal allowed |
| **Placeholder** | 82 |
| **Helper** | Enter the overall percentage as shown on your marksheet. |
| **Button** | Continue |

**On screen (exactly one of these, from Q2)**

| Q2 answer | On screen |
| --- | --- |
| Currently in Class 12 | What percentage do you expect in Class 12? |
| Completed Class 12 | What overall percentage did you achieve in Class 12? |
| Graduate | What overall percentage did you achieve in your bachelor’s degree? |

**Maps to:** `StudentProfile.marksPercent`

**Why / what it changes.** Compared to the sourced India threshold on the matched course (`publishedMinPercent` in `match.ts` — CBSE group uses the stored figure, often 60% UG / 50% PG; Kerala Year 12 is 65% if they pick that board). Exact threshold → `appears_to_meet`. Below → `below_requirement`, course still shown, scholarship **not** used as consolation. Expected marks (still in Class 12) never become `appears_to_meet`; they become `too_early` plus “if you achieve around X%, you would be below / around / above the published guide.” Blank, 0, 101, or junk → stay on this screen, or `unknown` if it somehow reaches `match()`. Do not round 59.9% up to a pass.

**Continue:** blocked unless the number is from 1 to 100.

---

### Q4b — Board

| | |
| --- | --- |
| **ID** | `q-board` |
| **Prototype** | Yes — on screen 4 when Q2 is Currently in Class 12 or Completed Class 12 |
| **Who** | Class 12 current and finished school only. Graduates never see this. |
| **On screen** | Which examination board? |
| **Format** | dropdown (choose one) |

**Options**

| On screen | Value written to `boardOrDegree` |
| --- | --- |
| CBSE | `CBSE` |
| ISC / CISCE | `ISC` |
| Kerala State Board | `Kerala state board` |
| Another State Board | `state board` |
| A different board | `other board` |

**Why / what it changes.** India-page bands already stored on UG courses: CBSE/ISC group at the course `minPercent` (60% in the 2026/27 catalogue); Kerala Year 12 65%; other boards 70%. Do not apply 60% CBSE to everyone.

---

### Q4c — Bachelor’s subject

| | |
| --- | --- |
| **ID** | `q-degree` |
| **Prototype** | Yes — on screen 4 when Q2 is Graduate |
| **Who** | graduates only. Class 12 never sees this. |
| **On screen** | What was the subject of your bachelor’s degree? |
| **Format** | dropdown (choose one) |

**Options**

| On screen | Value written to `boardOrDegree` |
| --- | --- |
| Engineering (B.E. / B.Tech) | `B.E.` |
| Commerce (B.Com) | `B.Com` |
| Computing and IT | `Computer Science` |
| Another bachelor’s subject | `bachelor` |

**Why / what it changes.** Subject fit for master’s. Commerce + computing master’s → `subject_gap` (Task 6). Engineering + business master’s is allowed: International Business Management MSc is published as not needing a business background. We do **not** ask for a UK 2:1 / 2:2 label. India entry is a percentage (Q4). Asking degree class would make this feel like an application form, and we have no sourced mapping from Indian class to UEL’s 2:2 line beyond the percentage already on the India page.

---

### Q5 — Life outside your studies

| | |
| --- | --- |
| **ID** | `q-interest` |
| **Prototype** | Yes — 5 of 6 |
| **Screen** | 5 |
| **Who** | everyone |
| **On screen** | What do you enjoy outside your studies? |
| **Format** | choose one |
| **Button** | Continue |

**Options**

| On screen | Value |
| --- | --- |
| Football | `football` |
| Cricket | `cricket` |
| Food and cooking | `food` |
| A different interest | `other` |

**Maps to:** `StudentProfile.interests` (array of one in the prototype)

**Why / what it changes.** Centre of the results page (`copy.ts` life slots). Football → Docklands / Olympic Park weekends (Student A). Food and cooking → East London shops and markets (Student B). Cricket → parks, not a named club we did not source. A different interest → a neutral London fragment; **must not** invent a hobby or write “your weekends at the football.” This is how the tool feels written for them, which is how the Mumbai student decides to trust it.

**Full product only:** allow a second pick from the same list (max two) so someone can say football and cricket. Same option wording. Prototype stays choose one.

---

### Q5b — City (full product only)

| | |
| --- | --- |
| **ID** | `q-city` |
| **Prototype** | No. Skip in Task 5. If skipped, do not invent a city in copy. |
| **Screen** | 5, under Q5 |
| **Who** | everyone, optional |
| **On screen** | Where in India are you based? |
| **Format** | choose one; if “A different city”, a short typed city |

**Options**

| On screen | Value |
| --- | --- |
| Mumbai | `Mumbai` |
| Hyderabad | `Hyderabad` |
| Kochi | `Kochi` |
| A different city | typed string |
| Prefer not to say | omit `city` |

**Maps to:** `StudentProfile.city`

**Why / what it changes.** Copy only (“From Hyderabad, …”). Never eligibility, never cost. Prototype six do not include this; fixtures for Task 4 still use Hyderabad / Kochi because those pages are written for named people.

---

### Q5c — Career hope (full product only)

| | |
| --- | --- |
| **ID** | `q-career` |
| **Prototype** | No. Skip in Task 5. If skipped, do not write a UK-job hope as if they said it. |
| **Screen** | 5 |
| **Who** | everyone, optional |
| **On screen** | What do you hope this degree leads to? |
| **Format** | choose one |

**Options**

| On screen | Value |
| --- | --- |
| I hope to work in the UK after graduation | `work-in-uk` |
| I hope to return to India | `return-home` |
| Travel | `travel` |
| Work–life balance | `balance` |
| Not sure yet | `undecided` |

**Maps to:** `StudentProfile.careerHope`

**Why / what it changes.** Copy only, always as a hope. `work-in-uk` adds: some graduates look; that is not guaranteed; this tool cannot promise a job, a visa, or the right to stay. Never a placement rate. The family will look for placements (Task 1); we still do not invent one.

---

### Q6 — Who decides

| | |
| --- | --- |
| **ID** | `q-decide` |
| **Prototype** | Yes — 6 of 6, same screen as Q6b |
| **Screen** | 6 |
| **Screen heading** | Decision and funding |
| **Who** | everyone |
| **On screen** | Who will decide whether you apply? |
| **Format** | choose one |

**Options**

| On screen | Value |
| --- | --- |
| I will decide | `self` |
| My family will decide | `family` |
| I will decide, if my parents agree to fund it | `self-if-parents-pay` |

**Maps to:** `StudentProfile.decisionMaker`

**Why / what it changes.** Parents are part of the product, not a PDF export.

- `family` → cost-first results tone, parent WhatsApp (Student B, Kochi).
- `self-if-parents-pay` → year-one picture for the father; results CTA “Share with your father” when `appears_to_meet` (Mumbai / Task 1). Distinct from “the family decides.”
- `self` → student-led next step (Student A with a loan still uses Q6b).

Raises adviser priority when family or self-if-parents-pay (intent is real). Never show that rank on the student page.

---

### Q6b — How you’d pay

| | |
| --- | --- |
| **ID** | `q-funding` |
| **Prototype** | Yes — 6 of 6, same screen as Q6 |
| **Who** | everyone |
| **On screen** | How would the first year be funded? |
| **Helper** | If cost is a concern at home, we still show the full picture — including PLACEHOLDER lines — not a reduced figure that later falls apart. |
| **Format** | choose one |
| **Button** | View my result |

**Options**

| On screen | Value |
| --- | --- |
| Education loan | `loan` |
| Family funding | `family` |
| Not yet decided | `unsure` |

**Maps to:** `StudentProfile.funding`

**Why / what it changes.** Copy and adviser priority, not the fee itself. The cost stack is always the same sourced lines (tuition, scholarship **range**, living, visa, IHS, deposit, room, flights, dated RBI INR). `loan` → year one as a number for a lender (Student A). `unsure` is the Task 1 default — valid, not a missing answer; tone is “this is the number to discuss,” not a loan product. Do not force loan vs family. Do not hide cost until they pick a method. `loan` or family-as-decider raises call priority.

**Continue:** both Q6 and Q6b required.

---

### Q7 — Start date (full product only)

| | |
| --- | --- |
| **ID** | `q-start` |
| **Prototype** | No |
| **Who** | everyone, in the full product after screen 6 |
| **On screen** | When would you prefer to start? |
| **Format** | choose one |
| **Button** | Continue |

**Options**

| On screen | Value |
| --- | --- |
| January 2027 | `2027-01` |
| September 2027 | `2027-09` |
| Not sure yet | omit `startPreference` |

**Maps to:** `StudentProfile.startPreference`

**Why / what it changes.** Course scoring if a start date matches; adviser priority if a listed start is within about six months. Prototype skips this. `rankLead` still sees dates on the matched course.

Do not offer “September 2026” as a choice after that teaching start has passed. Do not invent intakes.

---

### Q8 — Maths (full product only)

| | |
| --- | --- |
| **ID** | `q-maths` |
| **Prototype** | No. Task 5 does not ask. `match()` already adds: this course also asks for X — an adviser will check. |
| **Who** | **Only** if Q1 is bachelor’s **and** Q3 is Computing or Engineering. Everyone else never sees it. |
| **On screen** | Did you study Mathematics in Class 12? Some of these courses require it. |
| **Format** | choose one |
| **Button** | Continue |

**Options**

| On screen | Value |
| --- | --- |
| Yes, 50% or above | `maths-met` |
| Yes, below 50% | `maths-below` |
| No, or not sure | `maths-unknown` |

**Why / what it changes.** Civil and Mechanical Engineering store a sourced Year 12 Maths 50% subject condition. Computer Science UG notes Maths if the course requires it. Prototype does not collect this, so eligibility stays provisional with an adviser-check line — never `appears_to_meet` with no caveat, and never invent that they have Maths. Full product can tighten the caveat. This is **not** stored as a place.

---

## Screen 7 — Teaser

Not a question. Shown after Q6 (prototype) or after the last full-product question.

Run `match()` on the answers so far. Show **only**:

| Element | Exact words (fill `{course}`) |
| --- | --- |
| Heading | Your course match is ready. |
| Course line | `{course title}` — or, if `wrong_level`: A master’s needs a bachelor’s. We have not matched you to a master’s course. |
| Scholarship line | An international scholarship of £500–£5,000 may apply. UEL decides the amount, in an offer letter. |
| Honesty | This is not an offer. |
| Button | View the full result |

**Do not show:** the full cost stack, living / visa / IHS, life-in-London copy, parent WhatsApp, name, phone.

**Why the gate sits after this.** A phone number on screen one loses the student who just watched a 30-second reel. They have already answered. They can see a result exists. The trade is honest: details for the full picture. A tuition-only teaser without the scholarship range would make the mother say no too early.

---

## Screen 8 — Gate (name and phone)

**Who:** everyone who wants the full result. After the teaser, never on screen one.

| Element | Exact words |
| --- | --- |
| Heading | Your result is ready. |
| Subline | Enter your name and an Indian mobile number to see the full year-one picture. |
| Name label | Full name |
| Name format | typed |
| Phone label | Indian mobile number |
| Phone format | typed, default country code **+91**, store as E.164 |
| Phone placeholder | 98765 43210 |
| Consent 1 | Contact me on WhatsApp about this result. |
| Consent 2 | UEL can use my details to continue the conversation. |
| Button | View my result |

Consents are **checkboxes, unchecked by default**. Silence is not yes. Submit needs a name and a valid Indian mobile (10 digits after +91). WhatsApp follow-up only if consent 1 is on. Share with UEL only if consent 2 is on. Either consent may be off; then the lead still unlocks results, but `rankLead` without WhatsApp consent is priority 3 (not callable).

**Maps to:** `Lead.name`, `Lead.phone`, `Lead.consentWhatsapp`, `Lead.consentShareWithUel`, plus `profile`, `match`, stored UTM, `priority` (adviser only).

**Why here, not first.** Capture value before capture contact. Trust is “it used my answers,” not a cold form after a reel.

---

## Screen 9 — Results (not a question)

Render `MatchResult` from the same `match()` as Task 4 and Task 6. Order on screen:

1. Headline (from copy)
2. Course + eligibility
3. Scholarship **range** and first-year cost stack (GBP, dated INR, PLACEHOLDER lines visible)
4. Life in London from Q5 (and Q5b/Q5c if asked)
5. Next step
6. Honesty line **next to the scholarship**, not only in a footer

Keep the student-facing page under 300 words when the Task 4 fixtures are locked (Phase 4).

**Buttons** (exact words)

| Button | When |
| --- | --- |
| Share with your parents | always; especially if `family` or `self-if-parents-pay` |
| Speak with an adviser | always |
| Share with your father | extra, if `self-if-parents-pay` **and** `appears_to_meet` |

Parent WhatsApp copy is generated (`parentWhatsApp` in `copy.ts`), under 120 words, using “they” not “your weekends.”

---

## Screen 10 — Thanks

| Element | Exact words |
| --- | --- |
| Heading | What happens next |
| We will | We will WhatsApp you if you asked us to. An adviser may call if you look likely to apply, or if you need to apply soon. |
| We will not | We will not promise a place, a scholarship amount, a visa, or a job. |
| UEL | Nothing has been sent to UEL unless you said they can use your details. |
| Button | Done |

---

## How the student should feel, and how order builds that

They arrived from an Instagram reel, knowing little about UEL. By results they should feel: this used what I told you; year one might be possible because of a scholarship **range**, not a trick; I could show this at home; nobody hurried me with fake seats.

| Stage | What they should feel | Why this order |
| --- | --- | --- |
| Landing | Cost might not be impossible | Scholarship hook, no scam theatre |
| Q1–Q2 | This is about my actual situation | Level and stage before we sell a course. Honesty for Class 12 + master’s is already determined, even if they only see it later |
| Q3 | There is a course that could be mine | Subject, not a 200-row catalogue |
| Q4 | They are taking my marks seriously | Confidence (`appears_to_meet`) or an honest below / too early — not a dead end |
| Q5 | This might be written for me | Football / food / cricket is the want; they stay |
| Q6 | My family is in this, and cost will be shown straight | Decide + pay, including “not yet decided” |
| Teaser | There *is* a result, and a scholarship may apply | Reason to trade a number |
| Gate | A fair swap, not a trap | After value, not before |
| Results | I can picture a year in London, and my father can see a number | Life from Q5, cost from research, honesty beside the money |

Student A should feel loan-ready and able to see himself playing football in East London — without a UK job promise. Student B’s family should feel they have something to discuss, not a promised place or amount. The Mumbai graduate should feel he can put a one-year business master’s on the dining table if he appears to meet requirements.

---

## How parents get involved

1. **During questions.** Q6 names three decision patterns, including **I will decide, if my parents agree to fund it** (Task 1). Q6b allows **Not yet decided**. Student B: family decides, family would pay, cost is the worry → cost-first copy. Do not use the same copy for Kochi family-decides and Mumbai self-if-parents-pay.
2. **On results.** Button **Share with your parents**. WhatsApp under 120 words: course, eligibility in plain language, scholarship range, year-one picture, next step, caveats. No “your weekends playing football” written as if the parent plays.
3. **Parent link.** `/p/[id]` (or `?view=parent`). Same facts, calmer layout, more cost, campus, support; less weekend colour unless we include a light mention they chose. **No second questionnaire.**
4. **Share with your father** when he appears to meet and he goes only if they pay (locked Q17). Father says apply if a scholarship makes year one feel possible (locked Q18). We still do not invent placement rates.

---

## Where the tool could mislead, and the honesty pass

Every student-facing string (landing, questions, teaser, results, WhatsApp, thanks, parent view) must pass `honesty.ts`. Forbidden: a place, a personal £ award, a visa outcome, a job / salary / PR / placement %, limited seats, the Home 50% postgraduate scholarship.

| Risk | What we do |
| --- | --- |
| Class 12 picks a master’s | `wrong_level`. Offer to *show* bachelor’s options. Never silent remap |
| Expected 75% treated as a result | `too_early` + provisional sentence. Not Student A’s copy |
| Marks below the published guide | Course still shown, `below_requirement`. Scholarship is not a consolation prize |
| B.Com → computing master’s | `subject_gap`. Data Science MSc (any subject) may be mentioned as a *different* sourced course, not a pretend CS match |
| Teaser looks like an offer | “May apply.” “UEL decides.” “This is not an offer.” |
| Max scholarship subtracted as “your fee” | Range shown; tuition stays the full sourced fee |
| PLACEHOLDER visa / IHS / living / flights omitted | Lines stay visible. No fake grand total |
| Maths assumed | Prototype does not ask; adviser will check. Never invent a pass |
| “92% employed” because the father wants placements | Named as a family want in Task 1. Not in the product |
| Phone on screen one | Gate is after teaser |
| Urgency / limited seats | Not on any screen. Mumbai student would close |

---

## What the adviser and UEL get, and who is called first

**Stored on the lead (never shown as “you are a hot lead”):**

- Name, phone, both consents
- Full `StudentProfile` (the answers above)
- `MatchResult` (course, eligibility, reasons, scholarship range, year-one stack, copy)
- Attribution (UTM, landing path, referrer)
- `priority` 1 / 2 / 3 and `priorityReasons` from `rankLead()`

**UEL** (only if consent 2): the same facts, so they can continue a conversation. They decide the place and the scholarship. Mock handoff is an exportable lead, not a live UEL API.

**Call first (priority 1)** when they appear to meet, a start is soon, and there is real intent (loan, family decides, or self-if-parents-pay) **and** WhatsApp consent.

**Medium (priority 2):** still in Class 12 and close to the guide; family planning before results.

**Later / not callable (priority 3):** no WhatsApp consent; `wrong_level`; far below as a graduate with no honest path.

Prototype stores the lead in memory or a JSON file. No adviser dashboard in Task 5.

---

## Attribution (UTM, not a quiz)

Every reel description and influencer bio uses a link like:

```
https://<finder-host>/?utm_source=instagram&utm_medium=reel&utm_campaign=reel-april&utm_content=creator-priya
```

| Param | Meaning |
| --- | --- |
| `utm_source` | Channel. Primary: `instagram` |
| `utm_medium` | `reel` / `youtube` / `parent-session` |
| `utm_campaign` | Which creative or month |
| `utm_content` | Influencer or video id |

The landing page writes these into the session **on first load**. They must still be on the lead after six questions and the gate (EC-LEAD-05). If someone types the URL with no UTM, the Finder still works; attribution is empty. **Do not** ask “which influencer did you watch?” unless we have no other choice.

**Why it is worth knowing.** Which creative produces students who finish and take a call; which creators bring browsers only; which campaigns UEL should keep paying. Direct Finder applicants are students UEL does not pay a ~£2,000 agent commission for. Attribution is how this tool proves that.

---

## Gold answers (so Task 4, 5, and 6 stay one tool)

Use these exact options. `match()` on the mapped profile is already tested in Phase 2.

### Student A — Hyderabad (Task 4 / prototype happy path)

| Q | Answer |
| --- | --- |
| Q1 | Bachelor’s degree |
| Q2 | Completed Class 12 |
| Q3 | Computer Science |
| Q4 | 82 |
| Q4b | CBSE |
| Q5 | Football |
| Q6 | I will decide |
| Q6b | Education loan |

Expect: Computer Science BSc, `appears_to_meet` if 82% ≥ the sourced India threshold, scholarship range, football + loan copy. Full product may add Hyderabad and “I hope to work in the UK after graduation.” Prototype must not invent those if Q5b/Q5c were skipped.

### Student B — Kochi (Task 4)

| Q | Answer |
| --- | --- |
| Q1 | Bachelor’s degree |
| Q2 | Currently in Class 12 |
| Q3 | Business / Management |
| Q4 | 75 |
| Q4b | CBSE |
| Q5 | Food and cooking |
| Q6 | My family will decide |
| Q6b | Family funding |

Expect: Business Management BSc, `too_early` + provisional reading, cost-first, food, parent WhatsApp.

### Mumbai graduate (Task 1 path — not a Task 4 page)

| Q | Answer |
| --- | --- |
| Q1 | Master’s degree |
| Q2 | Graduate |
| Q3 | Business / Management |
| Q4 | 72 |
| Q4c | Engineering (B.E. / B.Tech) |
| Q5 | Football (full product: Football and Cricket) |
| Q6 | I will decide, if my parents agree to fund it |
| Q6b | Not yet decided |

Expect: one-year International Business Management MSc, not remapped to UG engineering, cost stack a father can see.

### Task 6

| Person | Answers that matter | Expect |
| --- | --- | --- |
| Class 12 + master’s | Q1 master’s, Q2 still in Class 12 | `wrong_level`, no MSc |
| Marks below | Q4 under the sourced threshold, stage matches the level | Course shown, `below_requirement` |
| B.Com → computing master’s | Q1 master’s, Q2 graduate, Q3 computing, Q4c Commerce | `subject_gap` |
| Parent | Opens `/p/[id]` from a completed child | Same facts, no quiz |

---

## Validation and state (for whoever builds the screens)

- One question (or the paired fields on 4 and 6) per screen. Back never wipes.
- `sessionStorage` holds answers + UTM so a phone refresh on Q4 does not restart from landing.
- Empty required control: stay, do not call `match()` on a blank subject.
- Marks outside 1–100: stay. Do not treat blank as 0.
- Phone: Indian mobile, default +91. Do not store 123 or a landline and promise WhatsApp.
- Double-tap on **View my result**: one lead.
- Guessing `/results` without a lead/session: no full cost + copy.
- All copy in this file must pass `honesty.ts` (see `src/domain/questions.test.ts`).

---

## Phase 5 must not

- Invent a seventh question wording.
- Put the phone on screen one.
- Use “limited seats,” a countdown, or “apply in the next 2 hours.”
- Ask which reel they watched.
- Force loan vs family with no “not yet decided.”
- Drop `self-if-parents-pay`.
- Remap Class 12 + master’s to a bachelor’s in the UI copy.
- Show adviser priority to the student.
