import { prisma } from './db';

/**
 * Check if a user has completed onboarding by checking if they have a strategy in the database
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  try {
    const strategy = await prisma.strategy.findUnique({
      where: { userId },
      select: { id: true },
    });

    return strategy !== null;
  } catch (error) {
    console.error('[hasCompletedOnboarding] Error:', error);
    return false;
  }
}

/**
 * Get the user's strategy from the database
 */
export async function getUserStrategy(userId: string) {
  try {
    const strategy = await prisma.strategy.findUnique({
      where: { userId },
    });

    if (!strategy) return null;

    return {
      brandName: strategy.brandName,
      brandTagline: strategy.brandTagline,
      brandIndustry: strategy.brandIndustry,
      pillars: JSON.parse(strategy.pillars),
      hooks: JSON.parse(strategy.hooks),
      ctas: JSON.parse(strategy.ctas),
      voice: JSON.parse(strategy.voice),
      dailyTemplates: JSON.parse(strategy.dailyTemplates),
      hashtags: JSON.parse(strategy.hashtags),
      productBrief: strategy.productBrief,
    };
  } catch (error) {
    console.error('[getUserStrategy] Error:', error);
    return null;
  }
}

/**
 * Get just the product brief markdown for AI context
 */
export async function getProductBrief(userId: string): Promise<string | null> {
  try {
    const strategy = await prisma.strategy.findUnique({
      where: { userId },
      select: { productBrief: true },
    });

    return strategy?.productBrief || null;
  } catch (error) {
    console.error('[getProductBrief] Error:', error);
    return null;
  }
}
