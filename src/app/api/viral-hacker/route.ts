import OpenAI from 'openai';
import { auth } from '@/lib/auth';
import { brandConfig, getHashtags } from '@/config';

export const runtime = 'nodejs';

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openaiClient;
}

const hashtagList = getHashtags(5).join(', ');

const VIRAL_HACKER_PROMPT = `You are a LinkedIn content strategist who reverse-engineers viral posts. Your job is to analyze a viral post and rewrite it for a new author while keeping the EXACT structural elements that made it go viral.

VIRAL POST ANALYSIS FRAMEWORK:
1. **Hook Structure** - How did the first 1-2 lines grab attention?
2. **Emotional Triggers** - What emotions does it evoke? (curiosity, fear, aspiration, controversy)
3. **Format Pattern** - Short sentences? Line breaks? Lists? Story arc?
4. **Engagement Drivers** - What made people comment? (questions, hot takes, relatable pain)
5. **Value Delivery** - What insight or transformation does it promise?

YOUR TASK:
1. First, briefly analyze WHY this post went viral (2-3 bullet points)
2. Then rewrite it completely with:
   - SAME viral structure and format
   - SAME emotional triggers and hooks
   - DIFFERENT topic/angle (aligned with the brand's content strategy)
   - Professional but authentic voice

The rewritten post should feel like a completely original post that just happens to use the same "viral DNA."

IMPORTANT:
- Match the EXACT line break pattern
- Match the sentence length rhythm
- Match the hook style (question, bold claim, confession, etc.)
- Include relevant hashtags at the end (choose from: ${hashtagList})
- Do NOT copy any specific phrases - only the STRUCTURE

Return a JSON object:
{
    "viralAnalysis": {
        "hookType": "type of hook used",
        "emotionalTriggers": ["list", "of", "triggers"],
        "whyItWorked": "1-2 sentence explanation"
    },
    "rewrittenPost": "The full rewritten post here...",
    "predictedEngagement": "High/Very High/Viral based on structure"
}

Return ONLY valid JSON, no markdown, no explanation.`;

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return new Response("Unauthorized", { status: 401 });
    }

    const allowedUsers = process.env.ALLOWED_USERS?.split(",").map(e => e.trim()) || [];
    if (!allowedUsers.includes(session.user.email)) {
        return new Response("Forbidden", { status: 403 });
    }

    try {
        const { viralPost, comments, likes } = await req.json();

        if (!viralPost || typeof viralPost !== 'string') {
            return new Response("Missing viral post content", { status: 400 });
        }

        const openai = getOpenAI();

        const engagementContext = `
ORIGINAL VIRAL POST (${comments ? `${comments} comments` : 'unknown comments'}, ${likes ? `${likes} likes` : 'unknown likes'}):

${viralPost}
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: VIRAL_HACKER_PROMPT },
                { role: 'user', content: engagementContext }
            ],
            temperature: 0.7,
            max_tokens: 1500,
        });

        let resultText = response.choices[0]?.message?.content?.trim();

        if (!resultText) {
            return new Response("Failed to analyze viral post", { status: 500 });
        }

        // Strip markdown code blocks if present
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
            const result = JSON.parse(resultText);
            return Response.json(result);
        } catch {
            console.error('[viral-hacker] Failed to parse JSON:', resultText);
            // Try to extract JSON from the response
            const jsonMatch = resultText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const result = JSON.parse(jsonMatch[0]);
                    return Response.json(result);
                } catch {
                    // Still failed
                }
            }
            return new Response("Failed to parse result", { status: 500 });
        }

    } catch (error) {
        console.error('[viral-hacker] Error:', error);
        return new Response("Error processing viral post", { status: 500 });
    }
}
