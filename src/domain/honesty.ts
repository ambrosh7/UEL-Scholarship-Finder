/**
 * Honesty is a system, not a disclaimer.
 * The Finder never promises a place, a scholarship amount, a visa, or a job.
 */

export type ForbiddenClaim = {
  id: string;
  phrase?: string;
  pattern?: RegExp;
  allowedInstead: string;
};

export const FORBIDDEN_PHRASES = [
  "limited seats",
  "you have a place",
  "you are in",
  "you're in",
  "you will get a visa",
  "you will get a uk job",
  "you will get a job",
  "guaranteed placement",
  "placement rate",
  "50% postgraduate scholarship",
] as const;

export const FORBIDDEN_CLAIMS: readonly ForbiddenClaim[] = [
  {
    id: "limited-seats",
    phrase: "limited seats",
    allowedInstead: "Nothing. No urgency theatre.",
  },
  {
    id: "few-seats",
    phrase: "only a few seats",
    allowedInstead: "Nothing. No urgency theatre.",
  },
  {
    id: "places-left",
    phrase: "few places left",
    allowedInstead: "Nothing. No urgency theatre.",
  },
  {
    id: "you-have-a-place",
    phrase: "you have a place",
    allowedInstead: "You appear to meet the published requirements",
  },
  {
    id: "you-are-in",
    pattern: /\byou are in\b/i,
    allowedInstead: "You appear to meet the published requirements",
  },
  {
    id: "specific-award",
    pattern: /you will get £\s*[\d,]+/i,
    allowedInstead:
      "International scholarships are typically £500–£5,000, decided by UEL",
  },
  {
    id: "visa-promise",
    phrase: "you will get a visa",
    allowedInstead: "You would apply for a student visa if UEL makes an offer",
  },
  {
    id: "visa-guaranteed",
    phrase: "visa is guaranteed",
    allowedInstead: "You would apply for a student visa if UEL makes an offer",
  },
  {
    id: "uk-job-promise",
    phrase: "you will get a uk job",
    allowedInstead:
      "Some graduates look for work in the UK; that is not guaranteed",
  },
  {
    id: "job-promise",
    phrase: "you will get a job",
    allowedInstead:
      "Some graduates look for work in the UK; that is not guaranteed",
  },
  {
    id: "guaranteed-job",
    phrase: "guaranteed job",
    allowedInstead:
      "Some graduates look for work in the UK; that is not guaranteed",
  },
  {
    id: "guaranteed-placement",
    phrase: "guaranteed placement",
    allowedInstead:
      "Some graduates look for work in the UK; that is not guaranteed",
  },
  {
    id: "placement-rate",
    phrase: "placement rate",
    allowedInstead: "Do not invent placement statistics",
  },
  {
    id: "fake-urgency-hours",
    pattern: /apply in the next\s*\d+\s*hours/i,
    allowedInstead: "Nothing. No urgency theatre.",
  },
  {
    id: "countdown",
    pattern: /\d+\s*(hours?|minutes?)\s*left/i,
    allowedInstead: "Nothing. No urgency theatre.",
  },
  {
    id: "youre-in",
    pattern: /\byou['’]re in\b/i,
    allowedInstead: "You appear to meet the published requirements",
  },
  {
    id: "personal-scholarship",
    pattern: /your scholarship is £\s*[\d,]+/i,
    allowedInstead:
      "International scholarships are typically £500–£5,000, decided by UEL",
  },
  {
    id: "home-pg-scholarship",
    phrase: "50% postgraduate scholarship",
    allowedInstead:
      "Do not offer the Home postgraduate scholarship to an international student",
  },
  {
    id: "percent-employed",
    pattern: /\d+\s*%\s*employed/i,
    allowedInstead:
      "Some graduates look for work in the UK; that is not guaranteed",
  },
  {
    id: "only-n-left",
    pattern: /only\s+\d+\s+left/i,
    allowedInstead: "Nothing. No urgency theatre.",
  },
  {
    id: "only-n-seats",
    pattern: /only\s+\d+\s+seats/i,
    allowedInstead: "Nothing. No urgency theatre.",
  },
];

export type ForbiddenMatch = {
  id: string;
  excerpt: string;
};

export function findForbiddenClaims(copy: string): ForbiddenMatch[] {
  const matches: ForbiddenMatch[] = [];
  const lower = copy.toLowerCase();

  for (const claim of FORBIDDEN_CLAIMS) {
    if (claim.phrase && lower.includes(claim.phrase.toLowerCase())) {
      matches.push({ id: claim.id, excerpt: claim.phrase });
      continue;
    }
    if (claim.pattern) {
      const found = copy.match(claim.pattern);
      if (found) {
        matches.push({ id: claim.id, excerpt: found[0] });
      }
    }
  }

  return matches;
}

export function assertHonest(copy: string): string {
  const matches = findForbiddenClaims(copy);
  if (matches.length > 0) {
    const list = matches.map((m) => `${m.id} (“${m.excerpt}”)`).join("; ");
    throw new Error(`Honesty pass failed: ${list}`);
  }
  return copy;
}
