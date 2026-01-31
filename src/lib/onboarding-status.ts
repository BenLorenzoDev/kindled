import { promises as fs } from 'fs';
import path from 'path';

/**
 * Check if the user has completed onboarding by verifying
 * that the product-brief.md has been customized (not template content)
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const briefPath = path.join(process.cwd(), 'src/lib/knowledge/product-brief.md');
    const content = await fs.readFile(briefPath, 'utf-8');

    // Check if the file contains template placeholders
    // The template has "[Name Your First Pillar]" and similar placeholders
    const isTemplate = content.includes('[Name Your First Pillar]') ||
                       content.includes('[What pain does your audience experience?]') ||
                       content.includes('This is a template');

    // Also check if it's too short (template is ~200 lines, real strategy is ~100+ lines of actual content)
    const hasSubstantialContent = content.length > 2000;

    return !isTemplate && hasSubstantialContent;
  } catch {
    // If file doesn't exist or can't be read, onboarding not complete
    return false;
  }
}

/**
 * Check if brand.json has been customized
 */
export async function hasBrandConfig(): Promise<boolean> {
  try {
    const brandPath = path.join(process.cwd(), 'src/config/brand.json');
    const content = await fs.readFile(brandPath, 'utf-8');
    const brand = JSON.parse(content);

    // Check if it still has default "Kindled" name
    return brand?.company?.name && brand.company.name !== 'Kindled';
  } catch {
    return false;
  }
}
