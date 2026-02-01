import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { GeneratedStrategy } from '@/app/onboarding/types/onboarding';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { strategy }: { strategy: GeneratedStrategy } = await req.json();

    if (!strategy) {
      return new Response('Missing strategy', { status: 400 });
    }

    // Generate the product brief markdown
    const productBriefMd = generateProductBrief(strategy);

    // Upsert strategy in database (create or update)
    await prisma.strategy.upsert({
      where: { userId: session.user.id },
      update: {
        brandName: strategy.brand.name,
        brandTagline: strategy.brand.tagline,
        brandIndustry: strategy.brand.industry,
        pillars: JSON.stringify(strategy.pillars),
        hooks: JSON.stringify(strategy.hooks),
        ctas: JSON.stringify(strategy.ctas),
        voice: JSON.stringify(strategy.voice),
        dailyTemplates: JSON.stringify(strategy.dailyTemplates),
        hashtags: JSON.stringify(strategy.brand.hashtags),
        productBrief: productBriefMd,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        brandName: strategy.brand.name,
        brandTagline: strategy.brand.tagline,
        brandIndustry: strategy.brand.industry,
        pillars: JSON.stringify(strategy.pillars),
        hooks: JSON.stringify(strategy.hooks),
        ctas: JSON.stringify(strategy.ctas),
        voice: JSON.stringify(strategy.voice),
        dailyTemplates: JSON.stringify(strategy.dailyTemplates),
        hashtags: JSON.stringify(strategy.brand.hashtags),
        productBrief: productBriefMd,
      },
    });

    return Response.json({
      success: true,
      message: 'Strategy saved successfully',
    });
  } catch (error) {
    console.error('[onboarding/save] Error:', error);
    return new Response('Error saving strategy', { status: 500 });
  }
}

function generateProductBrief(strategy: GeneratedStrategy): string {
  return `# ${strategy.brand.name} Content Strategy Bible

## Part 1: Core Pillars

${strategy.pillars
  .map(
    (pillar, index) => `### Pillar ${String.fromCharCode(65 + index)}: ${pillar.name}

- **The Problem:** ${pillar.problem}
- **The Truth:** ${pillar.truth}
- **The Narrative:** "${pillar.narrative}"
`
  )
  .join('\n')}

---

## Part 2: Daily Post Templates

### Monday: ${strategy.dailyTemplates.monday.name}

**Goal:** ${strategy.dailyTemplates.monday.goal}

**Structure:** ${strategy.dailyTemplates.monday.structure}

### Tuesday: ${strategy.dailyTemplates.tuesday.name}

**Goal:** ${strategy.dailyTemplates.tuesday.goal}

**Structure:** ${strategy.dailyTemplates.tuesday.structure}

### Wednesday: ${strategy.dailyTemplates.wednesday.name}

**Goal:** ${strategy.dailyTemplates.wednesday.goal}

**Structure:** ${strategy.dailyTemplates.wednesday.structure}

### Thursday: ${strategy.dailyTemplates.thursday.name}

**Goal:** ${strategy.dailyTemplates.thursday.goal}

**Structure:** ${strategy.dailyTemplates.thursday.structure}

### Friday: ${strategy.dailyTemplates.friday.name}

**Goal:** ${strategy.dailyTemplates.friday.goal}

**Structure:** ${strategy.dailyTemplates.friday.structure}

---

## Part 3: Hook Library

### Numbers Hooks:
${strategy.hooks.numbers.map((h) => `- "${h}"`).join('\n')}

### Confession Hooks:
${strategy.hooks.confession.map((h) => `- "${h}"`).join('\n')}

### Direct Challenge Hooks:
${strategy.hooks.challenge.map((h) => `- "${h}"`).join('\n')}

### Curiosity Hooks:
${strategy.hooks.curiosity.map((h) => `- "${h}"`).join('\n')}

---

## Part 4: CTA Library

### The Debate:
${strategy.ctas.debate.map((c) => `- "${c}"`).join('\n')}

### The Self-Audit:
${strategy.ctas.selfAudit.map((c) => `- "${c}"`).join('\n')}

### The Question:
${strategy.ctas.question.map((c) => `- "${c}"`).join('\n')}

### The Share:
${strategy.ctas.share.map((c) => `- "${c}"`).join('\n')}

---

## Part 5: Voice Guidelines

**Tone:** ${strategy.voice.tone}

**Styles:** ${strategy.voice.styles.join(', ')}

**Guidelines:**
${strategy.voice.guidelines.map((g) => `- ${g}`).join('\n')}

### What We Never Do

- Pitch products directly in content
- Use corporate jargon
- Write generic motivational fluff
- Sound like marketing copy
- End with "DM me" or "Book a call"

---

## Part 6: Hashtags

**Primary:** ${strategy.brand.hashtags.primary}

**Secondary:** ${strategy.brand.hashtags.secondary.join(', ')}
`;
}
