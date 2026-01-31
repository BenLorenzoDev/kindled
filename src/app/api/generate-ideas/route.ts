import OpenAI from 'openai';
import { auth } from '@/lib/auth';

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

const IDEAS_PROMPT = `You are a LinkedIn content strategist. Generate 8 unique post ideas based on the given topic.

For each idea, provide:
1. A compelling hook (first line that stops the scroll)
2. The angle/approach for the post
3. The format type (Story, List, Contrarian, Data, Question, How-To, Confession, Comparison)

Return a JSON array with this structure:
[
    {
        "hook": "The attention-grabbing first line",
        "angle": "Brief description of the post angle/approach",
        "format": "Story|List|Contrarian|Data|Question|How-To|Confession|Comparison",
        "hashtags": ["relevant", "hashtags", "max5"]
    }
]

Rules:
- Each hook must be under 100 characters
- Hooks should create curiosity gaps or emotional triggers
- Vary the formats - don't repeat the same type
- Make angles specific and actionable
- Include 3-5 relevant hashtags per idea
- Focus on engagement potential

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
        const { topic } = await req.json();

        if (!topic || typeof topic !== 'string') {
            return new Response("Missing topic", { status: 400 });
        }

        const openai = getOpenAI();

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: IDEAS_PROMPT },
                { role: 'user', content: `Generate 8 LinkedIn post ideas about: ${topic}` }
            ],
            temperature: 0.8,
            max_tokens: 2000,
        });

        let resultText = response.choices[0]?.message?.content?.trim();

        if (!resultText) {
            return new Response("Failed to generate ideas", { status: 500 });
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
            const ideas = JSON.parse(resultText);
            return Response.json({ ideas });
        } catch {
            // Try to extract JSON array from response
            const jsonMatch = resultText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                try {
                    const ideas = JSON.parse(jsonMatch[0]);
                    return Response.json({ ideas });
                } catch {
                    // Still failed
                }
            }
            console.error('[generate-ideas] Failed to parse JSON:', resultText);
            return new Response("Failed to parse ideas", { status: 500 });
        }

    } catch (error) {
        console.error('[generate-ideas] Error:', error);
        return new Response("Error generating ideas", { status: 500 });
    }
}
