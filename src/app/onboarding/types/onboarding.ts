/**
 * Onboarding Wizard Types
 * Type definitions for the multi-step onboarding flow
 */

export interface BusinessInfo {
  name: string;
  types: string[];
  oneLiner: string;
  website?: string;
}

export interface AudienceInfo {
  idealClient: string;
  painPoints: string[];
  customPainPoint?: string;
}

export interface StoryInfo {
  origin: string;
  commonMistake: string;
  transformation: string;
}

export interface VoiceInfo {
  styles: string[];
  tone: 'professional' | 'conversational' | 'mix';
}

export interface OnboardingData {
  business: BusinessInfo;
  audience: AudienceInfo;
  story: StoryInfo;
  voice: VoiceInfo;
}

export interface ContentPillar {
  name: string;
  problem: string;
  truth: string;
  narrative: string;
}

export interface HookLibrary {
  numbers: string[];
  confession: string[];
  challenge: string[];
  curiosity: string[];
}

export interface CTALibrary {
  debate: string[];
  selfAudit: string[];
  question: string[];
  share: string[];
}

export interface DailyTemplate {
  name: string;
  goal: string;
  structure: string;
}

export interface GeneratedStrategy {
  brand: {
    name: string;
    tagline: string;
    industry: string;
    hashtags: {
      primary: string;
      secondary: string[];
    };
  };
  pillars: ContentPillar[];
  hooks: HookLibrary;
  ctas: CTALibrary;
  voice: {
    tone: string;
    styles: string[];
    guidelines: string[];
  };
  dailyTemplates: {
    monday: DailyTemplate;
    tuesday: DailyTemplate;
    wednesday: DailyTemplate;
    thursday: DailyTemplate;
    friday: DailyTemplate;
  };
}

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6;

export const BUSINESS_TYPES = [
  'Consulting',
  'Coaching',
  'Agency',
  'SaaS',
  'E-commerce',
  'Professional Services',
  'Real Estate',
  'Financial Services',
  'Healthcare',
  'Education',
  'Other',
] as const;

export const PAIN_POINTS = [
  'Too many manual/repetitive tasks',
  'Struggling to scale without hiring',
  'Leads falling through the cracks',
  'Inconsistent revenue/pipeline',
  'Tech overwhelm / too many tools',
  'Not enough time for strategic work',
  'Difficulty standing out from competitors',
  'Trouble communicating value',
] as const;

export const VOICE_STYLES = [
  { id: 'direct', label: 'Direct & No-BS', description: 'Straight to the point, no fluff' },
  { id: 'friendly', label: 'Warm & Friendly', description: 'Approachable and personable' },
  { id: 'technical', label: 'Technical', description: 'Detail-oriented, precise' },
  { id: 'casual', label: 'Casual & Relatable', description: 'Conversational, like talking to a friend' },
  { id: 'bold', label: 'Bold & Provocative', description: 'Challenges conventional thinking' },
  { id: 'data', label: 'Data-Driven', description: 'Numbers and evidence-based' },
  { id: 'story', label: 'Story-Based', description: 'Uses narratives and examples' },
  { id: 'educational', label: 'Educational', description: 'Teaching and explaining' },
] as const;

export const TONE_OPTIONS = [
  { id: 'professional', label: 'Professional', description: 'Polished and business-appropriate' },
  { id: 'conversational', label: 'Conversational', description: 'Relaxed and natural' },
  { id: 'mix', label: 'Mix of Both', description: 'Professional with a human touch' },
] as const;
