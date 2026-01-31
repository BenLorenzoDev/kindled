# Kindled - Product Requirements Document (PRD)

**Version:** 1.0
**Date:** January 30, 2026
**Author:** BenMagz + BMAD Agent Team
**Status:** Draft

---

## Executive Summary

### Product Vision

**Kindled** is an AI-powered LinkedIn content and engagement platform that helps sales leaders, founders, and marketers attract their ideal customers through strategic content creation rather than cold outreach.

### Tagline

*"Spark conversations that convert"*

### Core Belief

> Trust cannot be automated. Authority must be earned.

### Problem Statement

Sales professionals and marketers face a critical challenge:

1. **Cold outreach is dying** - Response rates are plummeting, spam filters are rising, and prospects are exhausted
2. **Content creation is hard** - Writing engaging LinkedIn content consistently requires time and skill most professionals don't have
3. **Engagement is scattered** - There's no system to connect WHO you want to reach with WHAT you create and HOW you nurture relationships
4. **Tools are fragmented** - Existing solutions are either outbound-focused (Waalaxy) or simple content schedulers (Taplio) - none provide a complete inbound system

### Solution

Kindled provides a complete inbound content engine with a unique flow:

```
KNOW → SPARK → NURTURE → CONVERT
(ICP)  (Content) (Engage)  (Trust)
```

Delivered through:
- **Web Application** - Full dashboard for strategy, planning, and analytics
- **Chrome Extension** - Context-aware tools that live inside LinkedIn

---

## Target Users

### Primary Personas

#### 1. The Scaling Sales Manager
- **Title:** Sales Manager, Director of Sales
- **Company:** SaaS startup, 50-200 employees
- **Pain Points:**
  - Team doubled but can't maintain personal brand
  - Spending hours on cold outreach with diminishing returns
  - Knows content works but doesn't have time to create it
- **Goals:**
  - Build authority in their space
  - Generate inbound leads
  - Scale personal brand without sacrificing family time

#### 2. The Founder Building in Public
- **Title:** Founder, CEO, Co-founder
- **Company:** Early-stage startup, pre-seed to Series A
- **Pain Points:**
  - Wearing too many hats to focus on content
  - Inconsistent posting kills momentum
  - Doesn't know what content resonates with target customers
- **Goals:**
  - Attract investors and customers through thought leadership
  - Build company brand alongside personal brand
  - Create content that drives demo requests

#### 3. The B2B Marketer
- **Title:** Content Marketing Manager, Head of Marketing
- **Company:** SMB, 50-500 employees
- **Pain Points:**
  - Executive team won't post consistently
  - Hard to measure LinkedIn ROI
  - Content feels generic, doesn't attract ideal customers
- **Goals:**
  - Enable executives as thought leaders
  - Generate attributable pipeline from LinkedIn
  - Create a repeatable content system

### Secondary Personas

- Recruiters building employer brand
- Consultants establishing expertise
- Sales reps warming up before outbound

---

## Core User Flow

### The Kindled Journey

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  1. KNOW              2. SPARK           3. NURTURE       4. CONVERT   │
│  ──────────           ──────────         ──────────       ──────────   │
│                                                                         │
│  Define ICP     →     Generate      →    Engage with  →   Build        │
│  (who to             Content             commenters       relationships │
│  attract)            Pillars             & reactors       through       │
│                      & Posts                              trust         │
│                                                                         │
│  ┌─────────┐         ┌─────────┐         ┌─────────┐     ┌─────────┐  │
│  │ ICP     │         │ Pillar  │         │ ICP     │     │ Warm    │  │
│  │Generator│────────►│Generator│────────►│ Match   │────►│ Follow- │  │
│  │         │         │         │         │ Filter  │     │ up      │  │
│  └─────────┘         └─────────┘         └─────────┘     └─────────┘  │
│       │                   │                   │               │        │
│       ▼                   ▼                   ▼               ▼        │
│  Pain points         Hook-Struggle-      Personalized    Connection    │
│  Goals               Lesson framework    responses       requests      │
│  Content hooks       Calendar            Reply drafts    DM templates  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Feature Requirements

### Phase 1: Foundation (Weeks 1-2)

#### F1.1: Configuration-Based Architecture
**Priority:** P0 (Critical)
**Description:** Refactor the existing codebase to support multi-brand configuration

**Requirements:**
- [ ] Create `/config` folder structure
- [ ] Move hardcoded brand elements to `brand.json`
- [ ] Move knowledge base to configurable `knowledge.md`
- [ ] Move personas to `personas/*.ts` files
- [ ] Update all prompts to pull from config
- [ ] Remove CallView-specific references from UI

**Acceptance Criteria:**
- A new user can configure their brand without code changes
- All CallView references are removed or configurable
- Existing functionality works with new config structure

#### F1.2: ICP Generator
**Priority:** P0 (Critical)
**Description:** AI-powered Ideal Customer Profile generator

**User Story:**
> As a user, I want to define my ideal customer profile so that all my content is targeted to attract the right people.

**Requirements:**
- [ ] Input form with fields:
  - Product/service description
  - Target roles/titles
  - Company size (startup/SMB/enterprise)
  - Industries
  - Geographic focus
- [ ] AI generates 3-5 detailed ICP profiles including:
  - Profile name and description
  - Job titles
  - Company characteristics
  - Pain points (3-5)
  - Goals (3-5)
  - Content hooks (3-5 example hooks)
- [ ] User can select, edit, or delete ICPs
- [ ] Selected ICP persists and informs all content generation

**API Endpoint:** `POST /api/generate-icp`

**Acceptance Criteria:**
- User can generate ICPs in under 30 seconds
- Generated ICPs include actionable content hooks
- Selected ICP is stored and accessible across sessions

#### F1.3: Content Pillars Generator
**Priority:** P0 (Critical)
**Description:** Generate content pillars based on selected ICP

**User Story:**
> As a user, I want content pillars that align with my ICP's pain points so that my content strategy is focused and effective.

**Requirements:**
- [ ] Input: Selected ICP + user's core philosophy
- [ ] AI generates 4-6 content pillars including:
  - Pillar name
  - Theme description
  - Emotional journey (from → to)
  - Recommended post types
  - 3-5 example hooks per pillar
- [ ] User can edit, reorder, or delete pillars
- [ ] Pillars link to Content Calendar

**API Endpoint:** `POST /api/generate-content-pillars`

**Acceptance Criteria:**
- Pillars clearly map to ICP pain points
- Each pillar has distinct, non-overlapping themes
- Example hooks are ready to use in post generation

### Phase 2: Chrome Extension MVP (Weeks 3-5)

#### F2.1: Extension Infrastructure
**Priority:** P0 (Critical)
**Description:** Chrome extension that injects into LinkedIn

**Requirements:**
- [ ] Manifest V3 configuration
- [ ] Content script injection on `linkedin.com/*`
- [ ] Side panel UI (React + Tailwind)
- [ ] Background service worker for API calls
- [ ] Chrome storage for user preferences
- [ ] Authentication sync with web app

**Technical Specs:**
- Build: Vite + CRXJS
- UI: React 18 + Tailwind CSS
- State: Zustand
- API: Fetch to existing Next.js backend

**Acceptance Criteria:**
- Extension installs without errors
- Side panel opens on LinkedIn pages
- User can authenticate via extension

#### F2.2: Context Detection
**Priority:** P0 (Critical)
**Description:** Detect what the user is viewing on LinkedIn

**Requirements:**
- [ ] Detect page types:
  - Feed
  - Single post view
  - Profile page
  - Search results
  - Composer (modal open)
  - Own post with engagements
- [ ] Extract relevant data per context:
  - Post: text, author, engagement counts, comments
  - Profile: name, title, company, about
  - Search: query, result profiles
- [ ] Display context in side panel header

**Acceptance Criteria:**
- Context updates within 500ms of page change
- Correct context detected on all LinkedIn page types
- Data extraction works without breaking LinkedIn UI

#### F2.3: Analyze Post
**Priority:** P1 (High)
**Description:** Analyze any LinkedIn post for engagement potential

**User Story:**
> As a user viewing a post, I want to analyze what makes it effective so I can learn and apply those techniques.

**Requirements:**
- [ ] One-click analysis from side panel
- [ ] Results include:
  - Hook strength (Weak/Moderate/Strong/Viral)
  - Engagement prediction (1-100 score)
  - Writing framework detection
  - Emotional triggers identified
  - Readability grade
  - Improvement suggestions
- [ ] "Generate My Version" CTA

**API Endpoint:** `POST /api/analyze-post` (existing, enhanced)

**Acceptance Criteria:**
- Analysis completes in under 5 seconds
- Results are actionable and educational
- Hook strength correlates with actual engagement

#### F2.4: Generate Comment
**Priority:** P1 (High)
**Description:** Generate strategic comments for any post

**User Story:**
> As a user, I want to generate thoughtful comments quickly so I can engage strategically and build relationships.

**Requirements:**
- [ ] One-click comment generation from side panel
- [ ] 5 comment styles:
  - Insight Adder
  - Thoughtful Question
  - Agreeable Challenger
  - Story Connector
  - Value Amplifier
- [ ] Each comment shows:
  - Generated text
  - Engagement score (likelihood of reply)
  - One-click copy
- [ ] Optional: User context (role/expertise) for personalization

**API Endpoint:** `POST /api/generate-comment` (existing)

**Acceptance Criteria:**
- Comments generated in under 3 seconds
- Comments feel authentic, not AI-generated
- At least one comment per batch has >70% engagement score

#### F2.5: Viral Hacker (Generate My Version)
**Priority:** P1 (High)
**Description:** Reverse-engineer any post and create your version

**User Story:**
> As a user, I want to create my own version of a viral post so I can leverage proven frameworks with my unique perspective.

**Requirements:**
- [ ] Extract post via context detection
- [ ] AI analysis of:
  - Structure and framework
  - Hook technique
  - Emotional triggers
  - Call-to-action style
- [ ] Generate user's version with:
  - Same framework, different content
  - Aligned to user's ICP
  - User's voice and positioning
- [ ] Output shows original DNA + new version

**API Endpoint:** `POST /api/viral-hacker` (existing)

**Acceptance Criteria:**
- Generated version is clearly different from original
- Framework is preserved while content is unique
- Post aligns with user's configured ICP

#### F2.6: Quick Post Creator
**Priority:** P2 (Medium)
**Description:** Generate posts directly from extension

**User Story:**
> As a user on LinkedIn, I want to quickly generate a post without leaving the platform.

**Requirements:**
- [ ] Topic/idea input field in side panel
- [ ] Mode selection (Story/Tactical)
- [ ] Tone selection
- [ ] Generate button
- [ ] Results display with:
  - Generated post
  - Hook variations (expandable)
  - Engagement prediction
  - Copy button
  - "Open in full editor" link

**Acceptance Criteria:**
- Post generated in under 5 seconds
- Post follows Hook-Struggle-Lesson framework
- Copy button works and confirms success

### Phase 3: Enhanced Features (Weeks 6-8)

#### F3.1: Engagement Dashboard
**Priority:** P1 (High)
**Description:** Track and respond to engagement on your posts

**User Story:**
> As a user, I want to see who engaged with my posts and identify which engagers match my ICP so I can prioritize follow-ups.

**Requirements:**
- [ ] List all engagers (reactions + comments) on selected post
- [ ] ICP matching score for each engager (0-100%)
- [ ] Match reasons displayed (title, company, comment content)
- [ ] Filter by:
  - ICP match threshold
  - Engagement type (reaction/comment)
- [ ] Actions per engager:
  - Generate reply (if comment)
  - Generate connection request
  - Generate thank-you DM
- [ ] Batch actions for multiple engagers

**Acceptance Criteria:**
- Engagers loaded within 3 seconds
- ICP matching is accurate based on available profile data
- Generated messages are personalized to engagement type

#### F3.2: Content Calendar Integration
**Priority:** P2 (Medium)
**Description:** Schedule and manage posts from ICP-driven pillars

**User Story:**
> As a user, I want to plan my content weeks in advance based on my content pillars.

**Requirements:**
- [ ] Calendar view (week/month)
- [ ] Drag-and-drop scheduling
- [ ] Auto-suggest posts based on:
  - Content pillars
  - Posting frequency goals
  - Best times to post
- [ ] Post status tracking:
  - Draft
  - Scheduled
  - Posted
- [ ] Email reminders before scheduled posts

**Acceptance Criteria:**
- Calendar reflects pillar distribution
- Reminders sent at configured times
- Posted content syncs back from LinkedIn (manual confirmation)

#### F3.3: Feed Analyzer (Extension)
**Priority:** P3 (Nice-to-have)
**Description:** Passive analysis of posts as user scrolls

**User Story:**
> As a user scrolling my feed, I want to see which posts are high-performing and get content ideas without clicking.

**Requirements:**
- [ ] Small, non-intrusive badges on posts
- [ ] Badge types:
  - High engagement indicator
  - Trending topic tag
  - "Content idea" spark
- [ ] Click badge to:
  - See quick analysis
  - Generate similar post
  - Save for later

**Acceptance Criteria:**
- Badges don't break LinkedIn UI
- Analysis is accurate within 80%
- Feature can be toggled off

#### F3.4: Composer Assistant (Extension)
**Priority:** P3 (Nice-to-have)
**Description:** Real-time suggestions while writing in LinkedIn composer

**User Story:**
> As a user writing a post, I want real-time suggestions to improve my hook and content.

**Requirements:**
- [ ] Detect when LinkedIn composer is open
- [ ] Analyze draft text as user types (debounced)
- [ ] Show suggestions panel:
  - Hook strength indicator
  - "Strengthen hook" suggestions
  - Readability score
  - ICP alignment check
- [ ] One-click apply suggestions

**Acceptance Criteria:**
- Suggestions appear within 1 second of pause
- Suggestions are contextually relevant
- Applying suggestion updates composer text

---

## Non-Functional Requirements

### Performance
- Web app page load: < 2 seconds
- AI generation: < 5 seconds for most operations
- Extension context detection: < 500ms
- Extension side panel load: < 1 second

### Security
- All API calls authenticated via NextAuth
- No sensitive data stored in extension local storage
- HTTPS only for all communications
- Rate limiting on AI endpoints

### Scalability
- Support 1,000+ concurrent users
- Handle 100,000+ API calls/day
- Efficient token usage for AI calls

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible

### Browser Support
- Chrome 100+ (extension)
- Firefox, Safari, Edge (web app only)

---

## Success Metrics

### North Star Metric
**Conversations Started** - Number of meaningful engagements (comments, DMs, connections) initiated through Kindled-generated content

### Key Performance Indicators (KPIs)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Weekly Active Users | 1,000 (Month 3) | Unique users generating content |
| Posts Generated | 10,000/month | API calls to post generation |
| Extension Installs | 5,000 (Month 3) | Chrome Web Store |
| ICP Match Rate | >30% | Engagers matching user's ICP |
| User Retention (Week 4) | >40% | Users active after 4 weeks |
| NPS Score | >50 | Quarterly survey |

### Engagement Metrics
- Average posts generated per user per week
- Comment generation usage
- Viral Hacker usage
- ICP profiles created per user
- Content pillars per ICP

---

## Competitive Positioning

### Market Position

```
                        OUTBOUND
                           │
                           │
         Waalaxy           │           Apollo.io
         (Automation)      │           (Data + Sequences)
                           │
    ─────────────────────────────────────────────
    TACTICAL               │              STRATEGIC
    (Tools)                │              (System)
                           │
                           │
         Taplio            │         🔥 KINDLED
         (Content Tools)   │         (ICP → Content → Engage)
                           │
                           │
                        INBOUND
```

### Competitive Differentiation

| Competitor | Their Focus | Kindled's Advantage |
|------------|-------------|---------------------|
| Waalaxy | Cold outreach automation | We attract, they chase |
| Taplio | Content scheduling | We provide full strategy + ICP |
| Shield | Analytics only | We create + analyze + engage |
| AuthoredUp | Formatting tools | We provide intelligent strategy |
| Copy.ai | Generic AI writing | We're LinkedIn-native + contextual |

### Key Differentiators
1. **ICP-Driven Content** - Every post targets your ideal customer
2. **Full-Funnel System** - Know → Spark → Nurture → Convert
3. **Context-Aware Extension** - Works inside LinkedIn, not alongside
4. **Engagement Intelligence** - Who engaged + ICP match + personalized follow-up
5. **Anti-Pitch Philosophy** - Build trust, don't blast messages

---

## Go-to-Market Strategy

### Phase 1: Private Beta (Weeks 1-6)
- 50 hand-picked users from target personas
- Weekly feedback sessions
- Iterate on core features
- Build case studies

### Phase 2: Public Launch (Week 7)
- ProductHunt launch: "The Anti-Waalaxy"
- LinkedIn content campaign (using Kindled!)
- Sales community outreach (r/sales, RevGenius)
- Partner with sales influencers

### Phase 3: Growth (Ongoing)
- Chrome Web Store optimization
- SEO for "LinkedIn content tool" keywords
- Waalaxy user targeting (content about low engagement)
- Integration partnerships

### Pricing Strategy (Future)

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 5 posts/month, basic analytics, no ICP |
| **Pro** | $29/month | Unlimited posts, ICP generator, extension |
| **Team** | $79/user/month | Multi-user, shared ICPs, team analytics |

---

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| LinkedIn API changes | High | Medium | Build scraping fallbacks, monitor changelog |
| Chrome extension policy changes | High | Low | Follow Manifest V3 best practices |
| AI cost overruns | Medium | Medium | Implement token budgets, caching |
| Competitor copies features | Medium | High | Move fast, build community moat |
| Low user retention | High | Medium | Focus on ICP → Results connection |

---

## Timeline

| Week | Phase | Deliverables |
|------|-------|--------------|
| 1-2 | Foundation | Config refactor, ICP generator, Content pillars |
| 3-4 | Extension MVP | Infrastructure, context detection, analyze/comment |
| 5 | Extension MVP | Viral hacker, quick post creator |
| 6 | Launch Prep | Testing, bug fixes, documentation |
| 7 | Launch | ProductHunt, public release |
| 8+ | Growth | Engagement dashboard, calendar, advanced features |

---

## Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **ICP** | Ideal Customer Profile - detailed description of your target customer |
| **Content Pillar** | Thematic category for content that aligns with ICP pain points |
| **Hook** | Opening line of a post designed to stop scrolling |
| **Viral Hacker** | Feature that reverse-engineers posts and creates your version |
| **Engagement Intelligence** | AI analysis of who engaged and why they match your ICP |

### B. References

- Original repository: `linkedin-copywriter`
- Competitor: [Waalaxy](https://www.waalaxy.com/)
- Competitor: [Taplio](https://taplio.com/)

### C. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-30 | BenMagz + BMAD | Initial PRD |
