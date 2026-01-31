import { readFileSync } from 'fs';
import { join } from 'path';
import brandConfig from './brand.json';

// Re-export brand config
export { brandConfig };

// Type definitions
export interface BrandConfig {
  company: {
    name: string;
    tagline: string;
    website: string;
    logo: string;
  };
  philosophy: {
    core: string;
    approach: string;
    belief: string;
  };
  positioning: {
    oldWay: {
      label: string;
      description: string;
    };
    newWay: {
      label: string;
      description: string;
    };
  };
  contentPillars: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  writing: {
    readingLevel: string;
    tone: string;
    style: string;
  };
  hashtags: {
    primary: string;
    secondary: string[];
  };
  bannedWords: string[];
  formatting: {
    useEmojis: boolean;
    useEmDashes: boolean;
    useMarkdown: boolean;
    useBulletSymbols: boolean;
  };
  cta: {
    style: string;
    examples: string[];
    avoid: string[];
  };
}

// Load knowledge base content
export const getKnowledge = (): string => {
  try {
    return readFileSync(join(process.cwd(), 'src/config/knowledge.md'), 'utf-8');
  } catch {
    return '';
  }
};

// Get company name
export const getCompanyName = (): string => brandConfig.company.name;

// Get primary hashtag
export const getPrimaryHashtag = (): string => brandConfig.hashtags.primary;

// Get all hashtags formatted for a post
export const getHashtags = (count: number = 4): string[] => {
  const tags = [brandConfig.hashtags.primary, ...brandConfig.hashtags.secondary];
  return tags.slice(0, count);
};

// Get banned words for validation
export const getBannedWords = (): string[] => brandConfig.bannedWords;

// Check if content contains banned words
export const containsBannedWords = (content: string): string[] => {
  const lowerContent = content.toLowerCase();
  return brandConfig.bannedWords.filter(word =>
    lowerContent.includes(word.toLowerCase())
  );
};

// Get soft CTA examples
export const getSoftCTAExamples = (): string[] => brandConfig.cta.examples;

// Get CTAs to avoid
export const getCTAsToAvoid = (): string[] => brandConfig.cta.avoid;

// Get formatting rules as a string for prompts
export const getFormattingRules = (): string => {
  const rules: string[] = [];

  if (!brandConfig.formatting.useEmojis) {
    rules.push('NEVER use emojis');
  }
  if (!brandConfig.formatting.useEmDashes) {
    rules.push('NEVER use em-dashes (—), use regular dashes (-) instead');
  }
  if (!brandConfig.formatting.useMarkdown) {
    rules.push('NEVER use markdown formatting symbols');
  }
  if (!brandConfig.formatting.useBulletSymbols) {
    rules.push('NEVER use bullet point symbols');
  }

  return rules.join('. ');
};

// Export typed config
export const config: BrandConfig = brandConfig as BrandConfig;

export default config;
