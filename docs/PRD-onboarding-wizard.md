# PRD: Kindled Onboarding Wizard

## Overview

**Feature Name:** Onboarding Wizard
**Version:** 1.0
**Author:** John (PM) with BMAD Agent Team
**Date:** 2026-01-31
**Status:** Ready for Development

---

## Problem Statement

### Current State
Kindled requires users to manually configure their content strategy by editing:
- `src/config/brand.json` - Company information and hashtags
- `src/lib/knowledge/product-brief.md` - Full content strategy (pillars, hooks, CTAs)

This requires users to:
1. Understand content strategy frameworks
2. Know what "content pillars" and "hook libraries" mean
3. Write marketing copy for themselves
4. Navigate code/config files

### User Pain
> "I know my business. I know what I sell. But I don't know marketing frameworks. I just want to create LinkedIn posts that sound like me."

### Impact
- Only ~5% of potential users can successfully onboard (marketing-savvy founders)
- 95% of the market is locked out due to complexity
- High abandonment rate at setup stage

---

## Solution

### The Onboarding Wizard

A guided, conversational setup flow that:
1. Asks simple questions about the user's business
2. Extracts the raw material needed for content strategy
3. Uses AI to synthesize answers into a complete strategy
4. Generates `brand.json` and `product-brief.md` automatically

### User Journey

```
Sign Up → Onboarding Wizard (5 min) → First Post Generated (<10 min total)
```

---

## User Stories

### Primary Stories

**US-1: New User Onboarding**
> As a new user, I want to answer simple questions about my business so that Kindled can generate content that sounds like me without learning marketing frameworks.

**Acceptance Criteria:**
- [ ] Wizard completes in under 5 minutes
- [ ] Questions use plain language (no jargon)
- [ ] Progress indicator shows completion status
- [ ] User can go back to edit previous answers
- [ ] AI generates complete strategy from answers

**US-2: Strategy Preview**
> As a user completing onboarding, I want to preview my generated strategy before saving so I can verify it represents my business accurately.

**Acceptance Criteria:**
- [ ] Preview shows generated pillars, hooks, and CTAs
- [ ] User can regenerate if unsatisfied
- [ ] User can edit individual sections
- [ ] Clear "Save & Continue" action

**US-3: Strategy Regeneration**
> As a user, I want to regenerate my content strategy if it doesn't feel right so I can get better results.

**Acceptance Criteria:**
- [ ] "Regenerate" button available on preview
- [ ] Can regenerate individual sections or entire strategy
- [ ] Previous answers preserved during regeneration

---

## Functional Requirements

### FR-1: Multi-Step Form

**Step 1: Your Business (30 seconds)**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Company Name | Text | Yes | Business or personal brand name |
| Business Type | Multi-select | Yes | Categories: Consulting, Coaching, Agency, SaaS, E-commerce, Services, Other |
| One-Liner | Textarea | Yes | "Describe what you do in one sentence" |
| Website | URL | No | Optional company website |

**Step 2: Your Audience (45 seconds)**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Ideal Client | Textarea | Yes | "Who is your ideal client? Describe them." |
| Primary Pain Point | Multi-select + Other | Yes | Common pain points with custom option |
| Secondary Pain Points | Multi-select | No | Additional challenges they face |

**Step 3: Your Story (60 seconds)**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Origin Story | Textarea | Yes | "Why did you start this business?" |
| Common Mistake | Textarea | Yes | "What mistake do clients make before finding you?" |
| Transformation | Textarea | Yes | "What result do you help people achieve?" |

**Step 4: Your Voice (30 seconds)**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Communication Style | Multi-select (pick 3) | Yes | Options: Direct, Friendly, Technical, Casual, Bold, Data-Driven, Story-Based, Educational, Provocative, Warm |
| Tone Preference | Single-select | Yes | Professional / Conversational / Mix |

**Step 5: Generation**
- Loading state with progress messages
- AI processes all inputs
- Generates complete strategy

**Step 6: Preview & Save**
- Display generated strategy
- Edit/regenerate options
- Save and continue to main app

### FR-2: AI Strategy Generation

**Input:** All form answers as structured JSON

**Output:** Complete strategy object containing:
```typescript
interface GeneratedStrategy {
  brand: {
    name: string;
    tagline: string;
    industry: string;
    hashtags: {
      primary: string;
      secondary: string[];
    };
  };
  pillars: Array<{
    name: string;
    problem: string;
    truth: string;
    narrative: string;
  }>;
  hooks: {
    numbers: string[];
    confession: string[];
    challenge: string[];
    curiosity: string[];
  };
  ctas: {
    debate: string[];
    selfAudit: string[];
    question: string[];
    share: string[];
  };
  voice: {
    tone: string;
    style: string[];
    guidelines: string[];
  };
  dailyTemplates: {
    monday: { name: string; goal: string; structure: string };
    tuesday: { name: string; goal: string; structure: string };
    wednesday: { name: string; goal: string; structure: string };
    thursday: { name: string; goal: string; structure: string };
    friday: { name: string; goal: string; structure: string };
  };
}
```

### FR-3: File Generation

On save, wizard generates:

1. **`src/config/brand.json`** - Updated with user's brand info
2. **`src/lib/knowledge/product-brief.md`** - Complete strategy document

For multi-tenant (future): Store in database per user instead of files.

---

## Technical Architecture

### File Structure
```
/app/onboarding/
├── page.tsx                      # Main wizard container
├── layout.tsx                    # Onboarding-specific layout
├── components/
│   ├── OnboardingWizard.tsx      # Wizard state machine
│   ├── StepBusiness.tsx          # Step 1
│   ├── StepAudience.tsx          # Step 2
│   ├── StepStory.tsx             # Step 3
│   ├── StepVoice.tsx             # Step 4
│   ├── StepGenerating.tsx        # Step 5 loading
│   ├── StepPreview.tsx           # Step 6 preview
│   ├── ProgressBar.tsx           # Progress indicator
│   └── NavigationButtons.tsx     # Back/Next controls
├── hooks/
│   └── useOnboardingState.ts     # Form state management
├── types/
│   └── onboarding.ts             # TypeScript interfaces
└── actions/
    └── generateStrategy.ts       # Server action for AI

/api/onboarding/
└── generate/route.ts             # AI generation endpoint
```

### API Endpoint

**POST `/api/onboarding/generate`**

Request:
```json
{
  "business": {
    "name": "string",
    "type": ["string"],
    "oneLiner": "string",
    "website": "string?"
  },
  "audience": {
    "idealClient": "string",
    "painPoints": ["string"]
  },
  "story": {
    "origin": "string",
    "commonMistake": "string",
    "transformation": "string"
  },
  "voice": {
    "styles": ["string"],
    "tone": "string"
  }
}
```

Response:
```json
{
  "success": true,
  "strategy": { /* GeneratedStrategy object */ },
  "files": {
    "brandJson": "/* generated content */",
    "productBrief": "/* generated markdown */"
  }
}
```

### AI Prompt Structure

```
You are a content strategist. Based on the following business information,
generate a complete LinkedIn content strategy.

BUSINESS CONTEXT:
{{business}}

TARGET AUDIENCE:
{{audience}}

FOUNDER STORY:
{{story}}

COMMUNICATION STYLE:
{{voice}}

Generate a comprehensive content strategy with:
1. Three content pillars (each with: name, problem, truth, narrative)
2. Hook library (4 types: numbers, confession, challenge, curiosity - 3 each)
3. CTA library (4 types: debate, self-audit, question, share - 2 each)
4. Voice guidelines
5. Daily post template structure (Monday-Friday rhythm)
6. Recommended hashtags (1 primary, 5-8 secondary)

Return as valid JSON matching the GeneratedStrategy schema.
```

---

## UI/UX Requirements

### Design Principles
1. **Conversational** - Feel like a friendly interview, not a form
2. **Progressive** - One focus at a time, no overwhelming fields
3. **Encouraging** - Celebrate progress, validate inputs
4. **Recoverable** - Easy to go back and edit

### Visual Design
- Clean, minimal interface
- Progress bar showing steps
- Large, comfortable input fields
- Helpful placeholder text with examples
- Subtle animations for transitions

### Responsive
- Mobile-first design
- Works on all screen sizes
- Touch-friendly inputs

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Wizard completion rate | > 80% |
| Time to complete | < 5 minutes |
| Strategy acceptance rate (no regeneration) | > 70% |
| User satisfaction (if surveyed) | > 4/5 |

---

## Implementation Phases

### Phase 1: Core Wizard (MVP)
- Steps 1-6 functional
- AI strategy generation
- File output (brand.json, product-brief.md)
- Basic preview

### Phase 2: Enhancement
- Edit individual sections in preview
- Regenerate specific parts
- Save to localStorage for recovery
- Better loading animations

### Phase 3: Multi-Tenant (Future)
- Database storage per user
- User accounts with saved strategies
- Multiple brand profiles per account

---

## Dependencies

- OpenAI API (GPT-4o) for strategy generation
- Existing Kindled config system
- Next.js App Router

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| AI generates poor strategy | Allow regeneration, provide editing |
| User abandons mid-wizard | Save progress to localStorage |
| Generation takes too long | Streaming response, engaging loading state |
| Strategy doesn't match brand | Preview step with edit capability |

---

## Appendix: Sample Generated Output

### For: AI Automation Agency

**Generated Pillar Example:**
```markdown
### Pillar A: The Hiring Trap
- **The Problem:** Business owners think hiring VAs will solve their scaling problems
- **The Truth:** Systems scale. People don't. One n8n workflow replaces 3 VAs.
- **The Narrative:** "Stop hiring your way out of chaos. Build your way out."
```

**Generated Hook Examples:**
```
Numbers: "I replaced 40 hours of weekly admin work with one automation. Here's the exact workflow."
Confession: "I wasted $50K on virtual assistants before I discovered this."
Challenge: "If you're still manually sending follow-up emails in 2026, you're leaving money on the table."
```

**Generated CTA Examples:**
```
Debate: "Agree or disagree: Every agency should automate before they hire. Fight me."
Self-Audit: "Look at your last week. How many hours were spent on tasks a robot could do?"
```
