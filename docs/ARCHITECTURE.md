# Kindled - Architecture Document

**Version:** 1.0
**Date:** January 30, 2026
**Author:** BenMagz + BMAD Agent Team (Winston, Barry)
**Status:** Draft

---

## System Overview

Kindled is a dual-delivery AI-powered LinkedIn content platform consisting of:

1. **Web Application** - Next.js app for full dashboard experience
2. **Chrome Extension** - Context-aware tools embedded in LinkedIn

Both share a common backend API and data layer.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           KINDLED SYSTEM                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────┐          ┌─────────────────┐                     │
│   │   WEB CLIENT    │          │ CHROME EXTENSION│                     │
│   │   (Next.js)     │          │ (React + Vite)  │                     │
│   │                 │          │                 │                     │
│   │ • Dashboard     │          │ • Side Panel    │                     │
│   │ • ICP Manager   │          │ • Context Aware │                     │
│   │ • Calendar      │          │ • Quick Actions │                     │
│   │ • Analytics     │          │ • LinkedIn DOM  │                     │
│   └────────┬────────┘          └────────┬────────┘                     │
│            │                            │                              │
│            └──────────┬─────────────────┘                              │
│                       │                                                │
│                       ▼                                                │
│   ┌─────────────────────────────────────────────────────────┐         │
│   │                    API LAYER                             │         │
│   │                 (Next.js API Routes)                     │         │
│   │                                                          │         │
│   │  /api/auth/*        Authentication (NextAuth)            │         │
│   │  /api/generate-*    AI Content Generation                │         │
│   │  /api/analyze-*     Content Analysis                     │         │
│   │  /api/icp/*         ICP Management                       │         │
│   │  /api/calendar/*    Content Calendar                     │         │
│   └─────────────────────────────────────────────────────────┘         │
│                       │                                                │
│            ┌──────────┼──────────┐                                     │
│            │          │          │                                     │
│            ▼          ▼          ▼                                     │
│   ┌─────────────┐ ┌─────────┐ ┌─────────────┐                         │
│   │   OpenAI    │ │ Database│ │   Email     │                         │
│   │   (GPT-4o)  │ │(Postgres)│ │  (Resend)   │                         │
│   └─────────────┘ └─────────┘ └─────────────┘                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Web Application

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | Next.js | 16.1.1 | Full-stack React framework |
| **Runtime** | React | 19.2.3 | UI components |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **AI SDK** | Vercel AI SDK | 6.0.3 | Streaming AI responses |
| **AI Provider** | OpenAI | GPT-4o | Content generation |
| **Auth** | NextAuth.js | 5.0-beta | Authentication |
| **Validation** | Zod | 4.x | Schema validation |
| **Icons** | Lucide React | 0.562+ | Icon library |

### Chrome Extension

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Build** | Vite | 5.x | Fast bundling |
| **Extension** | CRXJS | 2.x | Chrome extension Vite plugin |
| **UI** | React | 18.x | Side panel components |
| **Styling** | Tailwind CSS | 3.x | Consistent with web app |
| **State** | Zustand | 4.x | Lightweight state management |
| **Storage** | Chrome Storage API | - | Persistent user data |

### Backend Services

| Service | Technology | Purpose |
|---------|------------|---------|
| **Database** | PostgreSQL (via Supabase) | User data, ICPs, posts |
| **Cache** | Redis (optional) | API response caching |
| **Email** | Resend | Calendar reminders |
| **File Storage** | Vercel Blob | Resume uploads |
| **Deployment** | Railway / Vercel | Hosting |

---

## Directory Structure

### Web Application

```
kindled/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/[...nextauth]/   # Auth endpoints
│   │   │   ├── generate-icp/         # ICP generation
│   │   │   ├── generate-pillars/     # Content pillars
│   │   │   ├── generate-post/        # Post generation
│   │   │   ├── generate-hooks/       # Hook variations
│   │   │   ├── generate-comment/     # Comment generation
│   │   │   ├── viral-hacker/         # Post reverse-engineering
│   │   │   ├── analyze-post/         # Post analysis
│   │   │   ├── icp/                  # ICP CRUD
│   │   │   ├── pillars/              # Pillar CRUD
│   │   │   └── calendar/             # Calendar operations
│   │   ├── (dashboard)/              # Protected routes
│   │   │   ├── page.tsx              # Main dashboard
│   │   │   ├── icp/page.tsx          # ICP management
│   │   │   ├── pillars/page.tsx      # Content pillars
│   │   │   ├── calendar/page.tsx     # Content calendar
│   │   │   └── analytics/page.tsx    # Engagement analytics
│   │   ├── signin/page.tsx           # Sign in page
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   │
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── icp-generator-modal.tsx
│   │   │   ├── pillar-generator-modal.tsx
│   │   │   ├── post-generator.tsx
│   │   │   ├── engagement-dashboard.tsx
│   │   │   ├── content-calendar.tsx
│   │   │   └── ... (existing components)
│   │   ├── chat/                     # Chat interface components
│   │   └── auth/                     # Auth components
│   │
│   ├── config/                       # Brand configuration
│   │   ├── brand.json                # Brand settings
│   │   ├── knowledge.md              # Content strategy bible
│   │   └── personas/                 # Writing personas
│   │       ├── default.ts
│   │       └── [custom].ts
│   │
│   ├── lib/
│   │   ├── auth.ts                   # NextAuth config
│   │   ├── db.ts                     # Database client
│   │   ├── ai/                       # AI utilities
│   │   │   ├── openai.ts             # OpenAI client
│   │   │   ├── prompts/              # Prompt templates
│   │   │   │   ├── icp.ts
│   │   │   │   ├── pillars.ts
│   │   │   │   ├── posts.ts
│   │   │   │   └── analysis.ts
│   │   │   └── schemas/              # Response schemas
│   │   ├── utils.ts                  # Shared utilities
│   │   └── constants.ts              # App constants
│   │
│   └── types/
│       └── index.ts                  # TypeScript types
│
├── public/                           # Static assets
├── prisma/                           # Database schema
│   └── schema.prisma
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### Chrome Extension

```
kindled-extension/
├── src/
│   ├── background/
│   │   └── service-worker.ts         # Background service worker
│   │
│   ├── content/
│   │   ├── content-script.ts         # Main content script
│   │   ├── context-detector.ts       # LinkedIn page detection
│   │   ├── dom-parser.ts             # Data extraction
│   │   └── injector.ts               # UI injection
│   │
│   ├── sidepanel/
│   │   ├── index.html                # Side panel entry
│   │   ├── main.tsx                  # React entry
│   │   ├── App.tsx                   # Root component
│   │   ├── components/
│   │   │   ├── Header.tsx            # Panel header
│   │   │   ├── ContextDisplay.tsx    # Current context
│   │   │   ├── CreatePanel.tsx       # Create tab
│   │   │   ├── AnalyzePanel.tsx      # Analyze tab
│   │   │   ├── EngagePanel.tsx       # Engage tab
│   │   │   ├── SettingsPanel.tsx     # Settings tab
│   │   │   └── shared/               # Shared components
│   │   ├── hooks/
│   │   │   ├── useLinkedInContext.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useApi.ts
│   │   └── store/
│   │       └── index.ts              # Zustand store
│   │
│   ├── popup/
│   │   ├── index.html                # Popup entry
│   │   └── Popup.tsx                 # Quick actions popup
│   │
│   └── utils/
│       ├── api-client.ts             # API wrapper
│       ├── storage.ts                # Chrome storage wrapper
│       ├── linkedin-selectors.ts     # DOM selectors
│       └── messaging.ts              # Extension messaging
│
├── public/
│   └── icons/                        # Extension icons
│       ├── icon-16.png
│       ├── icon-48.png
│       └── icon-128.png
│
├── manifest.json                     # Extension manifest
├── vite.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Data Models

### Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ AUTH ============

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  icps          ICP[]
  pillars       ContentPillar[]
  posts         Post[]
  engagements   Engagement[]
  brandConfig   BrandConfig?
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ============ BRAND CONFIG ============

model BrandConfig {
  id              String   @id @default(cuid())
  userId          String   @unique
  companyName     String
  tagline         String?
  philosophy      String?  @db.Text
  oldWay          String?  @db.Text
  newWay          String?  @db.Text
  hashtags        String[] // Array of default hashtags
  bannedWords     String[] // Words to avoid
  writingLevel    String   @default("4th grade")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ============ ICP ============

model ICP {
  id           String   @id @default(cuid())
  userId       String
  name         String   // e.g., "The Scaling Sales Manager"
  description  String   @db.Text
  titles       String[] // Array of job titles
  companySize  CompanySize
  industries   String[]
  locations    String[]
  painPoints   String[] @db.Text
  goals        String[] @db.Text
  contentHooks String[] @db.Text
  isActive     Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  user    User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  pillars ContentPillar[]
  posts   Post[]
}

enum CompanySize {
  STARTUP     // 1-50
  SMB         // 50-500
  ENTERPRISE  // 500+
}

// ============ CONTENT PILLARS ============

model ContentPillar {
  id            String   @id @default(cuid())
  userId        String
  icpId         String
  name          String   // e.g., "The Visibility Gap"
  theme         String   @db.Text
  emotionFrom   String   // e.g., "Frustration"
  emotionTo     String   // e.g., "Relief"
  postTypes     String[] // e.g., ["Horror stories", "Stat reveals"]
  exampleHooks  String[] @db.Text
  sortOrder     Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  icp   ICP   @relation(fields: [icpId], references: [id], onDelete: Cascade)
  posts Post[]
}

// ============ POSTS ============

model Post {
  id              String     @id @default(cuid())
  userId          String
  icpId           String?
  pillarId        String?
  content         String     @db.Text
  hooks           String[]   @db.Text // Alternative hooks
  mode            PostMode
  tone            PostTone
  status          PostStatus @default(DRAFT)
  scheduledFor    DateTime?
  postedAt        DateTime?
  linkedinPostId  String?    // LinkedIn post ID if posted

  // Analytics (populated after posting)
  reactions       Int?
  comments        Int?
  views           Int?
  engagementScore Int?       // 1-100

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user        User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  icp         ICP?           @relation(fields: [icpId], references: [id])
  pillar      ContentPillar? @relation(fields: [pillarId], references: [id])
  engagements Engagement[]
}

enum PostMode {
  STORY
  TACTICAL
}

enum PostTone {
  DEFAULT
  INSPIRATIONAL
  DATA_DRIVEN
  CONVERSATIONAL
}

enum PostStatus {
  DRAFT
  SCHEDULED
  POSTED
  ARCHIVED
}

// ============ ENGAGEMENTS ============

model Engagement {
  id               String         @id @default(cuid())
  userId           String
  postId           String
  engagerName      String
  engagerTitle     String?
  engagerCompany   String?
  engagerLinkedIn  String?        // LinkedIn profile URL
  engagementType   EngagementType
  comment          String?        @db.Text
  icpMatchScore    Int?           // 0-100
  icpMatchReasons  String[]
  responseStatus   ResponseStatus @default(PENDING)
  responseSent     String?        @db.Text
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
}

enum EngagementType {
  REACTION
  COMMENT
}

enum ResponseStatus {
  PENDING
  DRAFTED
  SENT
  SKIPPED
}
```

### TypeScript Types

```typescript
// src/types/index.ts

// ============ ICP ============

export interface ICP {
  id: string;
  name: string;
  description: string;
  titles: string[];
  companySize: 'startup' | 'smb' | 'enterprise';
  industries: string[];
  locations: string[];
  painPoints: string[];
  goals: string[];
  contentHooks: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICPGeneratorInput {
  productDescription: string;
  targetRoles: string;
  companySize: 'startup' | 'smb' | 'enterprise';
  industries: string;
  locations: string;
}

export interface ICPGeneratorOutput {
  icps: Omit<ICP, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>[];
}

// ============ CONTENT PILLARS ============

export interface ContentPillar {
  id: string;
  icpId: string;
  name: string;
  theme: string;
  emotionFrom: string;
  emotionTo: string;
  postTypes: string[];
  exampleHooks: string[];
  sortOrder: number;
}

export interface PillarGeneratorInput {
  icp: ICP;
  philosophy: string;
  oldWay: string;
  newWay: string;
}

export interface PillarGeneratorOutput {
  pillars: Omit<ContentPillar, 'id' | 'sortOrder'>[];
}

// ============ POSTS ============

export interface Post {
  id: string;
  content: string;
  hooks: string[];
  mode: 'story' | 'tactical';
  tone: 'default' | 'inspirational' | 'data_driven' | 'conversational';
  status: 'draft' | 'scheduled' | 'posted' | 'archived';
  scheduledFor?: Date;
  postedAt?: Date;
  icpId?: string;
  pillarId?: string;
  analytics?: PostAnalytics;
}

export interface PostAnalytics {
  reactions: number;
  comments: number;
  views: number;
  engagementScore: number;
  hookStrength: 'weak' | 'moderate' | 'strong' | 'viral';
  readabilityGrade: number;
}

export interface PostGeneratorInput {
  topic: string;
  mode: 'story' | 'tactical';
  tone: string;
  icpId?: string;
  pillarId?: string;
}

// ============ ENGAGEMENT ============

export interface Engagement {
  id: string;
  postId: string;
  engagerName: string;
  engagerTitle?: string;
  engagerCompany?: string;
  engagerLinkedIn?: string;
  engagementType: 'reaction' | 'comment';
  comment?: string;
  icpMatchScore?: number;
  icpMatchReasons: string[];
  responseStatus: 'pending' | 'drafted' | 'sent' | 'skipped';
  responseSent?: string;
}

export interface EngagerMatch {
  engagement: Engagement;
  matchScore: number;
  matchReasons: string[];
  suggestedResponse?: string;
}

// ============ LINKEDIN CONTEXT ============

export type LinkedInContext =
  | { type: 'feed' }
  | { type: 'post'; postId: string; postData: LinkedInPost }
  | { type: 'profile'; profileId: string; profileData: LinkedInProfile }
  | { type: 'composer'; draftText: string }
  | { type: 'search'; query: string; results: LinkedInProfile[] }
  | { type: 'myPost'; postId: string; postData: LinkedInPost; engagements: LinkedInEngagement[] };

export interface LinkedInPost {
  id: string;
  text: string;
  authorName: string;
  authorTitle?: string;
  authorCompany?: string;
  authorLinkedIn: string;
  reactions: number;
  comments: number;
  reposts: number;
  timestamp: string;
}

export interface LinkedInProfile {
  id: string;
  name: string;
  title?: string;
  company?: string;
  location?: string;
  linkedInUrl: string;
  connectionDegree: '1st' | '2nd' | '3rd+';
}

export interface LinkedInEngagement {
  type: 'reaction' | 'comment';
  profile: LinkedInProfile;
  reactionType?: string;
  commentText?: string;
  timestamp: string;
}

// ============ API RESPONSES ============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface StreamingResponse {
  content: string;
  done: boolean;
}
```

---

## API Specifications

### Authentication

All API routes (except `/api/auth/*`) require authentication via NextAuth session.

```typescript
// Middleware check
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... handle request
}
```

### Core Endpoints

#### ICP Generation

```typescript
// POST /api/generate-icp
// Request
{
  "productDescription": "AI-powered sales coaching platform",
  "targetRoles": "Sales Managers, VPs of Sales",
  "companySize": "smb",
  "industries": "SaaS, Tech",
  "locations": "North America"
}

// Response (streaming)
{
  "icps": [
    {
      "name": "The Scaling Sales Manager",
      "description": "...",
      "titles": ["Sales Manager", "Director of Sales"],
      "companySize": "smb",
      "industries": ["SaaS", "Tech"],
      "locations": ["US", "Canada"],
      "painPoints": ["...", "..."],
      "goals": ["...", "..."],
      "contentHooks": ["...", "..."]
    }
  ]
}
```

#### Content Pillar Generation

```typescript
// POST /api/generate-pillars
// Request
{
  "icpId": "clx...",
  "philosophy": "Data over Intuition",
  "oldWay": "Managing by vibes, random call listening",
  "newWay": "Conversation intelligence, 100% visibility"
}

// Response (streaming)
{
  "pillars": [
    {
      "name": "The Visibility Gap",
      "theme": "Sales managers only hear 1-2% of calls",
      "emotionFrom": "Frustration",
      "emotionTo": "Relief",
      "postTypes": ["Horror stories", "Stat reveals"],
      "exampleHooks": ["...", "..."]
    }
  ]
}
```

#### Post Analysis

```typescript
// POST /api/analyze-post
// Request
{
  "postText": "I managed 12 reps for 2 years...",
  "includeViralDNA": true
}

// Response
{
  "hookStrength": "strong",
  "engagementScore": 78,
  "readabilityGrade": 5,
  "framework": "Hook-Struggle-Lesson",
  "emotionalTriggers": ["vulnerability", "relatability"],
  "improvements": ["...", "..."],
  "viralDNA": {
    "hookTechnique": "Vulnerable confession",
    "structure": "...",
    "callToAction": "Question-based"
  }
}
```

#### Comment Generation

```typescript
// POST /api/generate-comment
// Request
{
  "postText": "...",
  "authorName": "John Doe",
  "userContext": "Sales Manager at TechCorp"
}

// Response
{
  "comments": [
    {
      "style": "Insight Adder",
      "text": "...",
      "engagementScore": 72
    },
    {
      "style": "Thoughtful Question",
      "text": "...",
      "engagementScore": 85
    }
  ]
}
```

---

## Chrome Extension Architecture

### Manifest Configuration

```json
{
  "manifest_version": 3,
  "name": "Kindled",
  "version": "1.0.0",
  "description": "Spark conversations that convert - AI-powered LinkedIn content",
  "permissions": [
    "activeTab",
    "storage",
    "sidePanel",
    "scripting"
  ],
  "host_permissions": [
    "https://www.linkedin.com/*",
    "https://kindled.ai/*"
  ],
  "background": {
    "service_worker": "src/background/service-worker.ts",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["https://www.linkedin.com/*"],
      "js": ["src/content/content-script.ts"],
      "css": ["src/content/styles.css"],
      "run_at": "document_idle"
    }
  ],
  "side_panel": {
    "default_path": "src/sidepanel/index.html"
  },
  "action": {
    "default_icon": {
      "16": "public/icons/icon-16.png",
      "48": "public/icons/icon-48.png",
      "128": "public/icons/icon-128.png"
    },
    "default_title": "Open Kindled"
  },
  "icons": {
    "16": "public/icons/icon-16.png",
    "48": "public/icons/icon-48.png",
    "128": "public/icons/icon-128.png"
  }
}
```

### Context Detection System

```typescript
// src/content/context-detector.ts

import type { LinkedInContext } from '@/types';
import { parsePost, parseProfile, parseEngagements } from './dom-parser';

export function detectContext(): LinkedInContext {
  const url = window.location.href;
  const pathname = window.location.pathname;

  // Check for composer modal first
  const composer = document.querySelector('[data-test="share-box"]');
  if (composer) {
    const draftText = composer.querySelector('[data-test="share-box-text"]')?.textContent || '';
    return { type: 'composer', draftText };
  }

  // Single post view
  if (pathname.includes('/posts/') || pathname.includes('/feed/update/')) {
    const postId = extractPostId(url);
    const postData = parsePost(document);
    const isOwnPost = checkIsOwnPost(postData);

    if (isOwnPost) {
      const engagements = parseEngagements(document);
      return { type: 'myPost', postId, postData, engagements };
    }

    return { type: 'post', postId, postData };
  }

  // Profile view
  if (pathname.startsWith('/in/')) {
    const profileId = pathname.split('/in/')[1]?.split('/')[0] || '';
    const profileData = parseProfile(document);
    return { type: 'profile', profileId, profileData };
  }

  // Search results
  if (pathname.includes('/search/')) {
    const query = new URLSearchParams(window.location.search).get('keywords') || '';
    const results = parseSearchResults(document);
    return { type: 'search', query, results };
  }

  // Default: feed
  return { type: 'feed' };
}

export function watchForContextChanges(callback: (context: LinkedInContext) => void) {
  let currentUrl = window.location.href;

  // URL change detection
  const observer = new MutationObserver(() => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      setTimeout(() => callback(detectContext()), 500); // Wait for DOM update
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial detection
  callback(detectContext());

  return () => observer.disconnect();
}
```

### Side Panel State Management

```typescript
// src/sidepanel/store/index.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LinkedInContext, ICP, Post } from '@/types';

interface KindledState {
  // Context
  context: LinkedInContext | null;
  setContext: (context: LinkedInContext) => void;

  // User
  user: { id: string; email: string; name: string } | null;
  setUser: (user: KindledState['user']) => void;

  // ICP
  activeICP: ICP | null;
  setActiveICP: (icp: ICP | null) => void;

  // UI State
  activeTab: 'create' | 'analyze' | 'engage' | 'settings';
  setActiveTab: (tab: KindledState['activeTab']) => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Recent posts
  recentPosts: Post[];
  addRecentPost: (post: Post) => void;
}

export const useKindledStore = create<KindledState>()(
  persist(
    (set) => ({
      context: null,
      setContext: (context) => set({ context }),

      user: null,
      setUser: (user) => set({ user }),

      activeICP: null,
      setActiveICP: (activeICP) => set({ activeICP }),

      activeTab: 'create',
      setActiveTab: (activeTab) => set({ activeTab }),

      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),

      recentPosts: [],
      addRecentPost: (post) =>
        set((state) => ({
          recentPosts: [post, ...state.recentPosts].slice(0, 10),
        })),
    }),
    {
      name: 'kindled-storage',
      partialize: (state) => ({
        activeICP: state.activeICP,
        recentPosts: state.recentPosts,
      }),
    }
  )
);
```

### Message Passing

```typescript
// src/utils/messaging.ts

type MessageType =
  | { type: 'GET_CONTEXT'; payload?: undefined }
  | { type: 'CONTEXT_UPDATE'; payload: LinkedInContext }
  | { type: 'COPY_TO_CLIPBOARD'; payload: string }
  | { type: 'PASTE_TO_COMPOSER'; payload: string }
  | { type: 'OPEN_SIDE_PANEL'; payload?: undefined };

// Content script → Background
export function sendToBackground(message: MessageType): Promise<any> {
  return chrome.runtime.sendMessage(message);
}

// Background → Content script
export function sendToContent(tabId: number, message: MessageType): Promise<any> {
  return chrome.tabs.sendMessage(tabId, message);
}

// Side panel → Content script (via background)
export async function sendToActiveTab(message: MessageType): Promise<any> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    return sendToContent(tab.id, message);
  }
}

// Listener setup
export function onMessage(
  callback: (message: MessageType, sender: chrome.runtime.MessageSender) => void | Promise<any>
) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const result = callback(message, sender);
    if (result instanceof Promise) {
      result.then(sendResponse);
      return true; // Keep channel open for async response
    }
    return false;
  });
}
```

---

## Security Considerations

### Authentication Flow

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Chrome    │      │    Web      │      │   NextAuth  │
│  Extension  │      │    App      │      │   Server    │
└──────┬──────┘      └──────┬──────┘      └──────┬──────┘
       │                    │                    │
       │  1. Open auth page │                    │
       │───────────────────>│                    │
       │                    │  2. OAuth flow     │
       │                    │<──────────────────>│
       │                    │                    │
       │                    │  3. Session cookie │
       │                    │<───────────────────│
       │                    │                    │
       │  4. Get session    │                    │
       │    (includes auth) │                    │
       │───────────────────>│  5. Validate       │
       │                    │───────────────────>│
       │  6. Session data   │                    │
       │<───────────────────│<───────────────────│
       │                    │                    │
```

### Data Protection

1. **No sensitive data in extension storage** - Only user preferences and ICP IDs
2. **All API calls authenticated** - Session validation on every request
3. **HTTPS only** - All communications encrypted
4. **Rate limiting** - Prevent abuse of AI endpoints
5. **Input sanitization** - Zod validation on all inputs

### LinkedIn Compliance

1. **No automation of LinkedIn actions** - Extension only generates content
2. **No data scraping at scale** - Only contextual data for active page
3. **User-initiated actions only** - All features require user click
4. **Clear extension purpose** - Content creation, not automation

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE                               │
│                      (CDN + DDoS Protection)                     │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                          VERCEL                                  │
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │   Next.js App   │    │   Edge Config   │                    │
│  │   (Serverless)  │    │   (Feature Flags)│                    │
│  └────────┬────────┘    └─────────────────┘                    │
│           │                                                      │
│           ├──────────────────────────────────┐                  │
│           │                                  │                  │
│           ▼                                  ▼                  │
│  ┌─────────────────┐              ┌─────────────────┐          │
│  │   Vercel Blob   │              │   Vercel KV     │          │
│  │   (File Storage)│              │   (Rate Limit)  │          │
│  └─────────────────┘              └─────────────────┘          │
│                                                                  │
└─────────────────────────────────────┬───────────────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              ▼                       ▼                       ▼
     ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
     │    Supabase     │    │     OpenAI      │    │     Resend      │
     │   (PostgreSQL)  │    │   (GPT-4o API)  │    │    (Email)      │
     └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Environment Variables

```bash
# .env.local

# Authentication
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
AUTH_SECRET=xxx
AUTH_URL=https://kindled.ai

# Database
DATABASE_URL=postgresql://user:pass@host:5432/kindled

# AI
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4o

# Email
RESEND_API_KEY=re_xxx

# Feature Flags
ENABLE_EXTENSION_AUTH=true
ENABLE_ANALYTICS=true
```

---

## Performance Optimization

### Caching Strategy

| Data Type | Cache Location | TTL | Invalidation |
|-----------|---------------|-----|--------------|
| User session | NextAuth | 24h | On logout |
| ICP data | React Query | 5min | On mutation |
| Generated content | None | - | Real-time |
| Static assets | Vercel CDN | 1 year | On deploy |
| API responses | Vercel KV | 1h | On relevant mutation |

### AI Token Optimization

1. **Prompt compression** - Remove redundant instructions
2. **Response streaming** - Show progress, reduce perceived latency
3. **Caching similar requests** - Hash inputs, cache outputs
4. **Model selection** - Use GPT-4o-mini for simple tasks

---

## Monitoring & Observability

### Logging

```typescript
// Using Vercel's built-in logging
import { log } from '@vercel/functions';

export async function POST(request: Request) {
  log.info('ICP generation started', { userId: session.user.id });

  try {
    const result = await generateICP(input);
    log.info('ICP generation completed', { count: result.icps.length });
    return Response.json(result);
  } catch (error) {
    log.error('ICP generation failed', { error: error.message });
    throw error;
  }
}
```

### Metrics (Future)

- API response times
- AI token usage per user
- Extension daily active users
- Feature adoption rates
- Error rates by endpoint

---

## Appendix

### A. LinkedIn DOM Selectors

```typescript
// src/utils/linkedin-selectors.ts
// These may change as LinkedIn updates their UI

export const SELECTORS = {
  // Posts
  POST_CONTAINER: '[data-urn^="urn:li:activity"]',
  POST_TEXT: '.feed-shared-update-v2__description',
  POST_AUTHOR: '.feed-shared-actor__name',
  POST_REACTIONS: '.social-details-social-counts__reactions-count',
  POST_COMMENTS: '.social-details-social-counts__comments',

  // Composer
  COMPOSER_MODAL: '[data-test="share-box"]',
  COMPOSER_TEXT: '[data-test="share-box-text"]',

  // Profile
  PROFILE_NAME: '.text-heading-xlarge',
  PROFILE_TITLE: '.text-body-medium',
  PROFILE_COMPANY: '[aria-label="Current company"]',

  // Engagement
  REACTORS_LIST: '.social-details-reactors-tab__list',
  COMMENTS_LIST: '.comments-comments-list',
};
```

### B. AI Prompt Templates

See `/src/lib/ai/prompts/` for full prompt templates.

### C. Error Codes

| Code | Description | User Message |
|------|-------------|--------------|
| AUTH_001 | Invalid session | Please sign in again |
| AI_001 | OpenAI rate limit | Too many requests, try again in a minute |
| AI_002 | Token limit exceeded | Input too long, please shorten |
| ICP_001 | ICP not found | Please create an ICP first |
| EXT_001 | Context detection failed | Unable to detect LinkedIn content |
