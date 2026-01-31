import OpenAI from 'openai';
import type { OnboardingData, GeneratedStrategy } from '@/app/onboarding/types/onboarding';

export const runtime = 'nodejs';
export const maxDuration = 60;

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

const STRATEGY_GENERATION_PROMPT = `You are an expert content strategist. Based on the business information provided, generate a comprehensive LinkedIn content strategy.

Your output must be a valid JSON object matching this exact structure:

{
  "brand": {
    "name": "Company name",
    "tagline": "A compelling one-line tagline",
    "industry": "Primary industry",
    "hashtags": {
      "primary": "#MainHashtag",
      "secondary": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
    }
  },
  "pillars": [
    {
      "name": "Pillar Name",
      "problem": "The pain point this pillar addresses",
      "truth": "The insight or solution you offer",
      "narrative": "A memorable one-liner that captures this pillar"
    }
  ],
  "hooks": {
    "numbers": ["Hook 1", "Hook 2", "Hook 3"],
    "confession": ["Hook 1", "Hook 2", "Hook 3"],
    "challenge": ["Hook 1", "Hook 2", "Hook 3"],
    "curiosity": ["Hook 1", "Hook 2", "Hook 3"]
  },
  "ctas": {
    "debate": ["CTA 1", "CTA 2"],
    "selfAudit": ["CTA 1", "CTA 2"],
    "question": ["CTA 1", "CTA 2"],
    "share": ["CTA 1", "CTA 2"]
  },
  "voice": {
    "tone": "Overall tone description",
    "styles": ["Style 1", "Style 2", "Style 3"],
    "guidelines": ["Guideline 1", "Guideline 2", "Guideline 3", "Guideline 4"]
  },
  "dailyTemplates": {
    "monday": {
      "name": "Template Name",
      "goal": "What this achieves",
      "structure": "Brief structure description"
    },
    "tuesday": { "name": "", "goal": "", "structure": "" },
    "wednesday": { "name": "", "goal": "", "structure": "" },
    "thursday": { "name": "", "goal": "", "structure": "" },
    "friday": { "name": "", "goal": "", "structure": "" }
  }
}

IMPORTANT GUIDELINES:
1. Generate exactly 3 content pillars based on their business and audience pain points
2. Each pillar should address a specific pain point with a clear insight and memorable narrative
3. Hooks should be specific to their industry and audience - not generic
4. CTAs should encourage engagement without being salesy
5. Voice guidelines should reflect their chosen communication styles
6. Daily templates should provide a balanced weekly rhythm:
   - Monday: Mindset/Philosophy (challenge thinking)
   - Tuesday: Tactical/How-To (show methods in action)
   - Wednesday: Contrarian Take (spark debate)
   - Thursday: Story/Case Study (agitate pain or show success)
   - Friday: Soft Sell (social proof, lighter content)

Make the content specific to their business - use their terminology, reference their specific audience, and create hooks that would resonate with their ideal clients.

Return ONLY valid JSON. No markdown, no explanation, no additional text.`;

export async function POST(req: Request) {
  try {
    const data: OnboardingData = await req.json();

    const openai = getOpenAI();

    // Build the context from user inputs
    const userContext = `
BUSINESS INFORMATION:
- Company Name: ${data.business.name}
- Business Type: ${data.business.types.join(', ')}
- What They Do: ${data.business.oneLiner}
${data.business.website ? `- Website: ${data.business.website}` : ''}

TARGET AUDIENCE:
- Ideal Client: ${data.audience.idealClient}
- Pain Points: ${data.audience.painPoints.join('; ')}
${data.audience.customPainPoint ? `- Additional Pain Point: ${data.audience.customPainPoint}` : ''}

FOUNDER STORY:
- Origin: ${data.story.origin}
- Common Mistake Clients Make: ${data.story.commonMistake}
- Transformation Delivered: ${data.story.transformation}

COMMUNICATION STYLE:
- Preferred Styles: ${data.voice.styles.join(', ')}
- Tone: ${data.voice.tone}

Based on this information, generate a complete content strategy that feels authentic to this specific business.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: STRATEGY_GENERATION_PROMPT },
        { role: 'user', content: userContext },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    let resultText = response.choices[0]?.message?.content?.trim();

    if (!resultText) {
      return new Response('Failed to generate strategy', { status: 500 });
    }

    // Clean up the response
    if (resultText.startsWith('```json')) {
      resultText = resultText.slice(7);
    } else if (resultText.startsWith('```')) {
      resultText = resultText.slice(3);
    }
    if (resultText.endsWith('```')) {
      resultText = resultText.slice(0, -3);
    }
    resultText = resultText.trim();

    try {
      const strategy: GeneratedStrategy = JSON.parse(resultText);

      return Response.json({
        success: true,
        strategy,
      });
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const strategy: GeneratedStrategy = JSON.parse(jsonMatch[0]);
          return Response.json({
            success: true,
            strategy,
          });
        } catch {
          console.error('[onboarding/generate] Failed to parse extracted JSON');
        }
      }

      console.error('[onboarding/generate] Failed to parse JSON:', resultText);
      return new Response('Failed to parse strategy', { status: 500 });
    }
  } catch (error) {
    console.error('[onboarding/generate] Error:', error);
    return new Response('Error generating strategy', { status: 500 });
  }
}
