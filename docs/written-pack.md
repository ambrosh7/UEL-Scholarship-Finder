# UEL Fit & Scholarship Finder

Tasks 1, 3, 4 and 6 as one document. Academic year **2026/27**.

This is one product, not four essays. The same `match()` engine writes Task 4, drives the live prototype (Task 5), and is what Task 6 describes. Task 2 lives in the sourced catalogue and spreadsheet. The prototype is the phone flow at `/`.

**Voice pass.** Task 1 is drafted from the locked fact sheet for Ambrosh to rewrite as people. Tasks 3 and 4 use frozen on-screen wording; he checks tone and voice. Task 6 is what the live tool actually shows, not a new design.

**Prototype vs these pages.** The live Finder asks six questions. It does not ask city or career hope, so it does not print Hyderabad, Kochi, or a UK-job line unless those answers exist. Task 4 below is still written for the named people in the brief (Student A, Hyderabad; Student B, Kochi), including those facts. Course, eligibility, scholarship range and the year-one stack are the same either way.

Nothing here promises a place, a personal scholarship amount, a visa, or a job.

---

## Task 1 — Understanding the student

He lives in Mumbai with his parents. Middle class, not struggling in public, not comfortable in private. His father does a 9–5 in an MNC and is the only salary in the house. His mother is a housewife. They eat out once a week. The month is built around that salary. There is almost nothing in savings.

He has finished engineering in India. It went well — above average, not a story he has to dress up. He is fun, easy with people, and he plays football and cricket. He does not want another engineering degree. He wants a one-year business master’s abroad, in London, because London is a hub and a year is a year he can explain at home.

He will go only if they agree to pay. They do not yet know how they would pay. That unknown sits on the dining table before any university name does.

### What they are hoping for

Three years on, he wants a good job, a life that is not only the job, and travel. Work–life balance is not a slogan to him; it is the opposite of watching his father do the same 9–5.

His parents want a bigger house, and a car they could never buy on this salary. Those hopes are the same *bet* — this master’s is how the family’s life is supposed to jump — and a different *prize*. He wants a life. They want assets.

Success for him is not a famous university stamp. It is being able to stay in a city, earn, travel, and not be the son who came home. Success for them is that the jump actually happens, without the father spending the rest of his working life paying for it.

### What they are afraid of

The father is afraid of debt. A number that looked possible in a brochure and then kept growing would confirm what he already suspects: this is how families like theirs get stuck.

He is afraid of coming back to Mumbai without a job. The degree would then be a year he spent, and a fee they cannot undo, and a story his friends will not let go.

His mother will say no if the fees look too high. She does not need a spreadsheet for that. If year one looks impossible on the first look, the conversation is over.

They will look for how many graduates get jobs. That is a family want, not a fact we have. Inventing a placement figure would be the fastest way to lose them later, when a relative asks for the source.

### Why UEL, another UK university, or India

UEL is in play because the degree is one year, the city is London, and the fees feel reasonable next to names they cannot say out loud at dinner. Another UK university that costs more, or takes two years, is not the comparison that actually happens in this house.

The real competitor is a good job in India: one that can carry the family’s monthly expenses *and* leave savings. If that offer arrives, London can wait. A more famous UK name does not beat that. A scholarship that makes year one feel possible might.

What makes UEL “enough” for the father is not branding. It is a scholarship range he can put next to the fee, without being told a personal amount that UEL has not decided.

### Trust, giving up, applying

He finds this from an Instagram reel. He knows little about UEL. He will stay if the result uses what he actually said — football, cricket, a master’s after engineering, we don’t know how we’d pay — and gives it back as a year he can picture, not a brochure.

He will close it halfway if it smells like a last-few-seats scam: countdowns, “apply in the next two hours,” a phone number before he has seen anything. That is how this student decides something is not real.

He will show it to his father only if it looks like he *appears to meet* the published requirements. A rejection, or a page that pretends he has a place, does not go to the dining table. A good, honest result might.

The father says apply if a scholarship makes the fee feel possible. Then an adviser can talk, and UEL decides. The Finder’s job is to get a true picture onto that table — course, published requirements, a range not an award, the full first-year stack including the lines we have not guessed — and then get out of the way.

---

## Task 3 — The questions

Every question below is the on-screen wording. The live prototype uses **six** of them (marked **Prototype**). The rest are designed for the full product and are already in the same spec, so the prototype is a slice, not a second quiz.

Phone: one column, large targets, **Back**, a light progress bar on question screens, primary button pinned. Answers and the landing URL sit in `sessionStorage`. We never ask which reel they watched, for a passport, 10th marks, IELTS, or uploads.

No fake urgency on any screen.

### How the screens are grouped

| # | Screen | On it | Button | Prototype |
| --- | --- | --- | --- | --- |
| 0 | Landing | Scholarship headline | Start | Yes |
| 1 | Level | Bachelor’s or master’s | Continue | Yes |
| 2 | Stage | Class 12 / finished / graduate | Continue | Yes |
| 3 | Subject | What they want to study | Continue | Yes |
| 4 | Marks | Percentage + board or degree | Continue | Yes |
| 5 | Life | Life outside your studies. Full product also city and career | Continue | Yes (interest only) |
| 6 | Money and family | Who decides + how they’d pay | View my result | Yes |
| — | Start date | January / September 2027 | Continue | Full product |
| — | Maths | Year 12 Maths, computing/engineering UG only | Continue | Full product |
| 7 | Teaser | Course name + scholarship *may* apply | View the full result | Yes |
| 8 | Gate | Name, Indian phone, two consents | View my result | Yes |
| 9 | Results | From `match()` | Share with parents / Speak with an adviser | Yes |
| 10 | Thanks | What we will and will not do | Done | Yes |

A parent who opens `/p/[id]` is not in this flow. No extra questions.

### Screen 0 — Landing

| Element | Exact words |
| --- | --- |
| Headline | See what a UEL scholarship could mean for your first year in London. |
| Subline | A short set of questions on your phone. This is not an application. This is not an offer. |
| Honesty | UEL decides any place and any scholarship. |
| Button | Start |

Never on this screen: fake urgency, a countdown, a name, a phone number.

On load we store `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content` from the URL. Default channel is an Instagram reel. We do not ask which video they watched.

The scholarship is why they tapped. If this looks like a scam, the Mumbai student closes it.

### Q1 — Level

| | |
| --- | --- |
| **On screen** | Which qualification are you considering? |
| **Format** | choose one |
| **Who** | everyone |
| **Prototype** | Yes |

| Option | |
| --- | --- |
| Bachelor’s degree | |
| Master’s degree | |

**Why / what it changes.** Which course pool, fees, and India rules we use. We do **not** hide master’s from someone still in Class 12, and we do **not** silently switch them to a bachelor’s. That mismatch is `wrong_level` at results (Task 6).

### Q2 — Stage

| | |
| --- | --- |
| **On screen** | What is your current stage of study? |
| **Format** | choose one |
| **Who** | everyone |
| **Prototype** | Yes |

| Option |
| --- |
| Currently in Class 12 |
| Completed Class 12 |
| Graduate |

**Why / what it changes.** With Q1 this is the wrong-level test. Currently in Class 12 + bachelor’s is `too_early` (Student B): we plan, we do not pretend results are in. Completed Class 12 uses achieved marks (Student A). Graduate + master’s is the Mumbai path. Also chooses whether Q4 asks for a board or a bachelor’s subject, and the exact marks wording.

### Q3 — Subject

| | |
| --- | --- |
| **On screen** | Which subject are you considering? |
| **Format** | choose one |
| **Who** | everyone |
| **Prototype** | Yes |

| Option | Prototype |
| --- | --- |
| Business / Management | Yes |
| Computer Science | Yes |
| Engineering | Full product |
| Law | Full product |
| Psychology | Full product |
| A different subject | Yes |

Business / Management is first. The Mumbai graduate is a first-class path, not buried under computing.

**Why / what it changes.** Course family. Today that is Business Management BSc, International Business Management MSc (one year, not the MBA by default), Computer Science BSc / MSc. “A different subject” uses the nearest sourced family and says so — never a silent computing result. A B.Com who picks a computing master’s still reaches Computer Science MSc as a **subject gap**, not as meeting entry.

### Q4 — Marks

| | |
| --- | --- |
| **Format** | typed number, 1 to 100 |
| **Helper** | Enter the overall percentage as shown on your marksheet. |
| **Who** | everyone (wording follows Q2) |
| **Prototype** | Yes, same screen as board or degree |

| If they said | On screen |
| --- | --- |
| Currently in Class 12 | What percentage do you expect in Class 12? |
| Completed Class 12 | What overall percentage did you achieve in Class 12? |
| Graduate | What overall percentage did you achieve in your bachelor’s degree? |

**Why / what it changes.** Compared to the sourced India threshold on the matched course (CBSE group often 60% UG / 50% PG; Kerala Year 12 65% if they pick that board). Exact threshold → they appear to meet published requirements. Below → we still show the course; the scholarship is not a consolation prize. Expected marks never become “you appear to meet.” Blank, 0 or 101 stay on this screen.

#### Board (Class 12 current or finished)

**On screen:** Which examination board?

| Option |
| --- |
| CBSE |
| ISC / CISCE |
| Kerala State Board |
| Another State Board |
| A different board |

India-page bands already live on UG courses. We do not apply 60% CBSE to everyone.

#### Bachelor’s subject (graduates only)

**On screen:** What was the subject of your bachelor’s degree?

| Option |
| --- |
| Engineering (B.E. / B.Tech) |
| Commerce (B.Com) |
| Computing and IT |
| Another bachelor’s subject |

Commerce + computing master’s is a subject gap. Engineering + a business master’s is allowed: International Business Management MSc is published as not needing a business background. We do not ask for a UK 2:1 / 2:2. India entry is a percentage.

### Q5 — Life outside your studies

| | |
| --- | --- |
| **On screen** | What do you enjoy outside your studies? |
| **Format** | choose one |
| **Who** | everyone |
| **Prototype** | Yes |

| Option |
| --- |
| Football |
| Cricket |
| Food and cooking |
| A different interest |

**Why / what it changes.** The centre of the results page. Football → East London parks and weekends that still have a game (Student A). Food → Stratford shops and spices (Student B). Cricket → parks, not a club we did not source. A different interest → a neutral London line; we must not invent a hobby. This is how the Mumbai student decides the tool used his answers.

**Full product only, not in the prototype**

- **Where in India are you based?** Mumbai / Hyderabad / Kochi / A different city / Prefer not to say. Copy only (“From Hyderabad…”). Never eligibility. If skipped, we do not invent a city.
- **What do you hope this degree leads to?** Work in the UK / take it home / travel / work–life balance / Not sure yet. Copy only, always as a hope. We still do not promise a job, a visa, or the right to stay.

### Q6 — Money and family

**Screen heading:** Decision and funding

**On screen:** Who will decide whether you apply?

| Option |
| --- |
| I will decide |
| My family will decide |
| I will decide, if my parents agree to fund it |

**On screen:** How would the first year be funded?

**Helper:** If cost is a concern at home, we still show the full picture — including PLACEHOLDER lines — not a reduced figure that later falls apart.

| Option |
| --- |
| Education loan |
| Family funding |
| Not yet decided |

**Why / what it changes.** Parents are part of the product.

- Family decides → cost-first tone, parent WhatsApp (Student B).
- I will decide, if my parents agree to fund it → a year-one picture for the father; the extra button “Share with your father” when they appear to meet (Mumbai).
- Loan → year one as a number for a lender (Student A).
- Not yet decided is valid, not a missing answer. The cost stack does not change.

The fee is always the sourced stack: tuition, scholarship **range**, living, visa, IHS, deposit, room, flights, dated RBI rupees. We do not hide cost until they pick a method. We do not force loan vs family.

### Q7 — Start date (full product)

**On screen:** When would you prefer to start?

| Option |
| --- |
| January 2027 |
| September 2027 |
| Not sure yet |

Helps course scoring and whether an adviser should call soon. The prototype skips this. We do not offer a September 2026 start after that teaching has begun.

### Q8 — Maths (full product; computing or engineering UG only)

**On screen:** Did you study Mathematics in Class 12? Some of these courses require it.

| Option |
| --- |
| Yes, 50% or above |
| Yes, below 50% |
| No, or not sure |

The prototype does not ask. `match()` already adds: this course also asks for X — an adviser will check. We never invent that they have Maths.

### Screen 7 — Teaser

Not a question. After the last prototype question we run `match()` and show **only**:

| Element | Exact words |
| --- | --- |
| Heading | Your course match is ready. |
| Course | The course title — or, if wrong level: A master’s needs a bachelor’s. We have not matched you to a master’s course. |
| Scholarship | An international scholarship of £500–£5,000 may apply. UEL decides the amount, in an offer letter. |
| Honesty | This is not an offer. |
| Button | View the full result |

Not here: the full cost stack, life in London, parent WhatsApp, name, phone.

A phone number on screen one loses the student who just watched a 30-second reel. They have already answered. They can see a result exists. The trade is honest: details for the full picture.

### Screen 8 — Gate

| Element | Exact words |
| --- | --- |
| Heading | Your result is ready. |
| Subline | Enter your name and an Indian mobile number to see the full year-one picture. |
| Name | Full name |
| Phone | Indian mobile number, default **+91**, placeholder 98765 43210 |
| Consent 1 | Contact me on WhatsApp about this result. |
| Consent 2 | UEL can use my details to continue the conversation. |
| Button | View my result |

Checkboxes start unchecked. Silence is not yes. They can unlock results with either consent off; then we do not WhatsApp, and we do not pass details to UEL. Without WhatsApp consent the lead is not callable.

### Screen 9 — Results

Same `match()` as Task 4 and Task 6, in this order: headline; course and eligibility; scholarship range with honesty next to it; first-year cost (GBP, dated INR, PLACEHOLDER lines visible); life in London from what they love; next step.

| Button | When |
| --- | --- |
| Share with your parents | always |
| Speak with an adviser | always |
| Share with your father | they go only if parents pay, **and** they appear to meet |

### Screen 10 — Thanks

| Element | Exact words |
| --- | --- |
| Heading | What happens next |
| We will | We will WhatsApp you if you asked us to. An adviser may call if you look likely to apply, or if you need to apply soon. |
| We will not | We will not promise a place, a scholarship amount, a visa, or a job. |
| UEL | Nothing has been sent to UEL unless you said they can use your details. |
| Button | Done |

### How they should feel, and why this order

They arrived from a reel, knowing little about UEL. By results they should feel: this used what I told you; year one might be possible because of a scholarship **range**; I could show this at home; nobody hurried me.

| Stage | What they should feel |
| --- | --- |
| Landing | Cost might not be impossible |
| Q1–Q2 | This is about my actual situation |
| Q3 | There is a course that could be mine |
| Q4 | They are taking my marks seriously |
| Q5 | This might be written for me |
| Q6 | My family is in this, and cost will be shown straight |
| Teaser | There *is* a result, and a scholarship may apply |
| Gate | A fair swap, not a trap |
| Results | I can picture a year in London, and my father can see a number |

Student A should feel loan-ready and able to see himself playing football in East London — without a UK job promise. Student B’s family should feel they have something to discuss, not a promised place or amount. The Mumbai graduate should feel he can put a one-year business master’s on the dining table if he appears to meet requirements.

### How parents get involved

1. **During questions.** Three decision patterns, including “I will decide, if my parents agree to fund it.” Funding may be “not yet decided.” Kochi (family decides) and Mumbai (he decides if they pay) do not get the same copy.
2. **On results.** Forward to parents. WhatsApp under 120 words: course, eligibility in plain language, scholarship range, year-one picture, caveats. Not “your weekends playing football” written as if the parent plays.
3. **Parent link.** `/p/[id]`. Same facts, calmer layout, more cost, no second questionnaire.
4. **Share with your father** when he appears to meet and he goes only if they pay. We still do not invent job figures.

### Where the tool could mislead, and how we prevent it

Every student-facing string must pass the honesty check. We never state as fact a place, a personal award, a visa outcome, a job, a salary, or how many graduates are employed.

| Risk | What we do |
| --- | --- |
| Class 12 picks a master’s | Wrong level. Offer to *show* bachelor’s options. Never silent remap |
| Expected 75% treated as a result | Too early, plus a provisional sentence. Not Student A’s copy |
| Marks below the published guide | Course still shown. Scholarship is not a consolation prize |
| B.Com → computing master’s | Subject gap. Data Science MSc (any subject) may be mentioned as a *different* sourced course, not a pretend Computer Science match |
| Teaser looks like an offer | “May apply.” “UEL decides.” “This is not an offer.” |
| Max scholarship subtracted as “your fee” | Range shown; tuition stays the full sourced fee |
| Missing cost lines omitted | Flights stay PLACEHOLDER. Visa, IHS and London living are sourced. Halls are not added on top of the visa living figure. No fake grand total |
| Maths assumed | Prototype does not ask; an adviser will check |
| Job figures because the father wants them | Named as a family want in Task 1. Not in the product |
| Phone on screen one | Gate is after the teaser |
| Fake urgency | Not on any screen |

### What the adviser and UEL get, and who is called first

Stored on the lead, never shown as “you are a hot lead”: name, phone, both consents, the answers, the match (course, eligibility, scholarship range, year-one stack), which URL brought them, and a call priority 1 / 2 / 3.

UEL sees the same facts **only if** the student said they can. UEL decides the place and the scholarship.

**Call first (1)** when they appear to meet, a start is soon, there is real intent (loan, family decides, or self-if-parents-pay), **and** WhatsApp consent.

**Medium (2):** still in Class 12 and close to the guide; family planning before results.

**Later / not callable (3):** no WhatsApp consent; wrong level; a graduate far below with no honest path.

The prototype stores the lead. There is no adviser dashboard in Task 5.

### How we tell which video brought them

Reel descriptions use a link like:

`/?utm_source=instagram&utm_medium=reel&utm_campaign=reel-april&utm_content=creator-priya`

The landing page stores this on first load. It is still on the lead after six questions and the gate. If someone types the URL with no tags, the Finder still works.

That is worth knowing because a Finder applicant is a student UEL does not pay an agent for (often £2,000 or more). Attribution is how we see which creative produces people who finish and take a call.

---

## Task 4 — The results page

Exact words, not a description. Under 300 words each. WhatsApp under 120. Honesty sits next to the scholarship, not only at the end.

These pages are written for the people the brief named. Regenerating from `match()` must not contradict them on course, eligibility, fee or range. The live prototype uses the same engine; it omits city and career lines when those questions were not asked.

### Student A — Hyderabad

Computing in London, with football on the weekends.

Computer Science BSc (Hons) at Docklands. You appear to meet the published entry requirements — CBSE 82% against the published 60% India guide. UEL still decides any place. This course also asks about Year 12 Maths; an adviser will check.

International scholarships are typically £500–£5,000 off first-year tuition. They are considered automatically after a complete application. UEL decides the amount; it appears in an offer letter. This is not your award, and it is not based on your marks. This is not an offer.

Year one, 2026/27 — pounds are the source of truth. Rupees are a labelled RBI snapshot (126.4657 per pound, 28 October 2026), not live FX.

Tuition £16,020 (about ₹20,25,981).
Scholarship £500–£5,000 off first-year tuition (range, not deducted from the fee).
Living in London (GOV.UK visa financial requirement, 9 months): £13,761.
Student visa (from outside the UK): £558.
Immigration Health Surcharge (student rate, one year): £776.
Tuition deposit £1,500.
Typical room £8,010 — UEL halls, not a second rent on top of the GOV.UK living figure.
Flights India → London: PLACEHOLDER — confirm on GOV.UK / UEL.

Sourced lines so far: £32,615. Not a complete year-one total while PLACEHOLDER lines remain.

From Hyderabad, Docklands sits in East London, near the parks around the Queen Elizabeth Olympic Park. Weekends can look like football with other students.

You said an education loan is arranged. These are estimates you can take to a lender, not a bill.

You hope to look for work in the UK after graduating. Some graduates do look; that is not guaranteed. This tool cannot promise a job, a visa, or the right to stay.

Talk to an adviser about applying, with the year-one numbers for your lender.

Button: Talk to an adviser

#### Why this would work

**Headline.** He already plays football. Leading with that, and with London, is how he decides the tool used his answers. “Your results” would feel like every university site.

**Course and eligibility.** He only puts a good result in front of a lender or his family. “You appear to meet the published requirements” is the confidence he needs, without pretending UEL has given him a place. The Maths line is on the course page, so an adviser checks it; we do not invent that he has it.

**Scholarship.** A loan student stays if year one looks possible. The range sits here, not in a footer. We refuse a personal amount and we refuse tying it to 82%.

**First-year cost.** The lender wants pounds. Home wants a rupee snapshot with a date. GOV.UK visa, IHS and London maintenance are sourced. Flights stay PLACEHOLDER. £32,615 is only the sourced lines, labelled as incomplete, and does not add halls rent on top of the visa living figure.

**Life in London.** Hyderabad to Docklands, weekends that still have football. UK work is named as his hope and then refused as a promise — the family will look for jobs after the degree; we still do not invent one.

**Next step.** Small and honest: talk to an adviser, take the numbers to the lender.

On the **live prototype** (six answers, no city, no career) the same student still gets this headline, this course, appears-to-meet, the range, the stack, football and the loan line. The page does not add “From Hyderabad” or the UK-work sentence, because those questions were not asked.

### Student B — Kochi

A business degree to plan with your family, before results are in.

Business Management BSc (Hons) at University Square Stratford. You can plan now; you apply when results are in. If you achieve around 75%, you would be above the published 60% CBSE guide. That is not a final result. UEL still decides any place.

Cost is the first thing to look at together. International scholarships are typically £500–£5,000 off first-year tuition, considered automatically after a complete application. UEL decides the amount; it appears in an offer letter. This is not an amount promised to your family. This is not an offer.

Year one, 2026/27 — pounds first. Rupees are a labelled RBI snapshot (126.4657 per pound, 28 October 2026), not live FX.

Tuition £16,020 (about ₹20,25,981).
Scholarship £500–£5,000 off first-year tuition (range, not deducted from the fee).
Living in London (GOV.UK visa financial requirement, 9 months): £13,761.
Student visa (from outside the UK): £558.
Immigration Health Surcharge (student rate, one year): £776.
Tuition deposit £1,500.
Typical room £8,010 — UEL halls, not a second rent on top of the GOV.UK living figure.
Flights India → London: PLACEHOLDER — confirm on GOV.UK / UEL.

Sourced lines so far: £32,615. Not a complete year-one total while PLACEHOLDER lines remain.

From Kochi, East London is a practical place to cook. Shops and markets around Stratford make it easier to find the spices and vegetables you already know, and to try other food when you want a change.

Your family will decide together. This is the year-one picture to put on the table — including the lines we have not guessed.

Share this with your family and plan the application for when results are in.

Button: Forward this to your parents

#### Why this would work

**Headline.** They are 17, still in Class 12, and the whole family decides. This page is a plan to discuss, not a result that pretends the exams are over.

**Course and eligibility.** Business is what they asked for. The 75% is expected, so we say above the published 60% guide and immediately that it is not a final result. That stops two lies: a fake place, and a panic that they already failed.

**Scholarship.** Cost is the worry that would kill UEL at the dining table. The range sits next to the honesty line so “maybe we can” does not turn into “they will give us £3,000.”

**First-year cost.** Mother says no if the fee looks too high, and she will also say no if a later number appears that we hid. Full stack, pounds first, GOV.UK living / visa / IHS sourced, PLACEHOLDER left on flights. Halls rent is shown, not added on top of the visa living figure.

**Life in London.** Food and cooking, not football, not a generic campus paragraph. Stratford shops let them picture an ordinary week.

**Next step.** A family conversation. The button forwards WhatsApp they can put on the table.

### WhatsApp Student B could forward

I looked at UEL (University of East London). This is not an offer.

Course: Business Management BSc (Hons), University Square Stratford.

I’m still in Class 12. If I get around 75%, that would sit above the published 60% India guide. Not a result yet.

Scholarship: typically £500–£5,000 off first-year tuition. UEL decides the amount in an offer letter — not a figure they have given me.

Year one (2026/27), in pounds: tuition £16,020. GOV.UK London living £13,761. Visa £558. IHS £776. Typical room £8,010 (not extra rent). Flights: PLACEHOLDER. Rupees: RBI snapshot 28 Oct 2026, not live.

Can we sit with this? An adviser can talk it through. UEL decides any place and any scholarship.

#### Why this would work

It is meant to be forwarded, so it is in their voice, short, and about money and honesty — not “my weekends cooking.” Parents in Kochi are deciding with cost and safety. Under 120 words so it actually gets read. Nothing here promises a place, an amount, a visa, or a job.

---

## Task 6 — Judgement

What each person would see in the **live prototype**, using the same `match()` as Task 4. Not a new design. Right or not is the product call we already locked.

### 1. A student still in Class 12 who chooses a master’s

**What they answer (enough to run the tool).** Master’s. Currently in Class 12. Business / Management. Expected marks 80%, CBSE. A different interest outside class. They decide; funding unsure.

**Teaser.** “Your course match is ready.” Then: *A master’s needs a bachelor’s. We have not matched you to a master’s course.* Scholarship *may* apply. This is not an offer.

**Results.** Headline: **A master’s comes after a bachelor’s.**

They are told a master’s needs a bachelor’s degree; we have not matched them to a master’s course; we have not switched them to a bachelor’s behind their back. If they want, an adviser can show bachelor’s options in business — that would be a new choice. No MSc title is presented as their match. Scholarship is not a personal reading. Next step: we can show bachelor’s options in the same subject; a master’s waits until they have a bachelor’s.

**Is that right?** **Yes.** Silent remapping would read as if they chose a bachelor’s. Showing an MSc would pretend a Class 12 student can enter a master’s. Wrong level is the honest product call.

### 2. A student whose marks are below the entry requirement

**What they answer.** Bachelor’s. Completed Class 12. Computing. **55%**, CBSE. Football. Loan arranged. (Same shape as Student A, marks under the published 60% India guide.)

**Results.** Headline: **Computer Science BSc (Hons) is still worth a conversation.**

The course is still there: Computer Science BSc (Hons) at Docklands. *Your marks (55%) are below the published requirement of 60%.* An adviser can talk through options. *A scholarship is only a possibility if you later receive an offer — not a consolation for marks.* The £500–£5,000 range is still described as UEL’s international scholarship, not as something they missed or were given. Next step: ask an adviser about options; the scholarship is not a prize for low marks.

**Is that right?** **Yes.** A fake “you appear to meet” would be the lie. A blank screen would be the other one. Honesty plus a path is better than either. We do not invent a foundation year we have not sourced.

### 3. A commerce graduate (B.Com) who wants a master’s in computing

**What they answer.** Master’s. Graduate. Computing. 65%. Bachelor’s in commerce (B.Com or similar).

**Results.** Headline: **Computing at master’s level needs a computing background.**

Course shown: Computer Science MSc at Docklands. Eligibility is **not** “you appear to meet.” *Your background may not match Computer Science MSc. We have not treated this as meeting computing entry.* The sourced extra line on that page (a computing bachelor’s / significant maths and computing content) is left as an adviser check. **Data Science MSc** is mentioned as published for a bachelor’s in any subject — *a different course, not a silent remap of Computer Science.* Next step: ask an adviser about subject fit; we will not pretend this is a match.

**Is that right?** **Yes.** “Would I get in?” includes subject fit. Matching Computer Science MSc as if they meet entry would be the lie. Inventing a conversion programme we did not source would be the other one. Naming Data Science with its published “any subject” line is the sourced alternative, labelled as a different choice.

### 4. A parent who opens a link their child sent

**What they do.** They open `/p/[id]`. They do not sit the questionnaire.

Take Student B’s child as the example (Kochi, still in Class 12, business, family decides). The parent sees:

- “{Name} sent you this”
- This is not an offer. UEL decides any place and any scholarship.
- Course: Business Management BSc (Hons) at University Square Stratford.
- Scholarship range £500–£5,000, with “This is not an offer” beside it.
- The same year-one stack as the child: tuition £16,020, GOV.UK London living £13,761, visa £558, IHS £776, room £8,010, deposit £1,500, flights still PLACEHOLDER, dated RBI rupees, sourced lines labelled incomplete.
- A short line on looking after them: this is a year-one money picture, not a promise they will be safe. UEL is in East London. Halls prices are published. An adviser can talk through campus and support. UEL decides any place.
- A short forwardable paragraph in “they” language: still in Class 12; if they achieve around 75% that would be above the published 60%; not a final result; UEL decides.

No second form. No “your weekends playing football.” Cost, honesty, and what we can actually say about being looked after. The fee is not a different number from the child’s page.

**Is that right?** **Yes.** The parent is deciding with money and safety, not browsing courses. Making them re-answer would lose the thread. Promising they will be safe, or a place, or an amount, would be the lie the brief would mark us down for.

---

The six tasks are one tool. Task 1 is why the scholarship is early and why we never hurry them. Task 3 is the questions that tool asks. Task 4 is the page two named people would get. Task 6 is four corners of the same `match()`, already running in the prototype.
