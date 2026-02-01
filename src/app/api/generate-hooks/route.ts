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

const HOOKS_PROMPT = `You are a LinkedIn hook expert. Generate 5 completely different opening hooks for a LinkedIn post.

HOOK TYPES TO USE:
1. **Contrarian** - Challenge a common belief ("Unpopular opinion: The common advice is wrong")
2. **Confession** - Vulnerable admission ("I used to make this mistake constantly...")
3. **Number/Stat** - Specific data point ("87% of professionals overlook this")
4. **Question** - Provocative question ("What if everything you believed about this is wrong?")
5. **Story** - Narrative opener ("Last Tuesday, something happened that changed my perspective...")

RULES:
- Each hook should be 1-2 lines max
- Make them scroll-stopping
- No emojis
- Different structure for each
- Write for LinkedIn B2B audience

Return a JSON array with exactly 5 objects:
[
  { "type": "Contrarian", "hook": "...", "strength": 85 },
  { "type": "Confession", "hook": "...", "strength": 78 },
  ...
]

The "strength" is your confidence score (1-100) for how well this hook will perform.

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
        const { content } = await req.json();

        if (!content || typeof content !== 'string') {
            return new Response("Missing post content", { status: 400 });
        }

        const openai = getOpenAI();

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: HOOKS_PROMPT },
                { role: 'user', content: `Generate 5 hook variations for this LinkedIn post topic/content:\n\n${content}` }
            ],
            temperature: 0.8,
            max_tokens: 600,
        });

        let hooksText = response.choices[0]?.message?.content?.trim();

        if (!hooksText) {
            return new Response("Failed to generate hooks", { status: 500 });
        }

        // Strip markdown code blocks if present
        if (hooksText.startsWith('```json')) {
            hooksText = hooksText.slice(7);
        } else if (hooksText.startsWith('```')) {
            hooksText = hooksText.slice(3);
        }
        if (hooksText.endsWith('```')) {
            hooksText = hooksText.slice(0, -3);
        }
        hooksText = hooksText.trim();

        try {
            const hooks = JSON.parse(hooksText);
            return Response.json({ hooks });
        } catch {
            console.error('[generate-hooks] Failed to parse JSON:', hooksText);
            // Try to extract JSON array from the response
            const jsonMatch = hooksText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                try {
                    const hooks = JSON.parse(jsonMatch[0]);
                    return Response.json({ hooks });
                } catch {
                    // Still failed
                }
            }
            return new Response("Failed to parse hooks", { status: 500 });
        }

    } catch (error) {
        console.error('[generate-hooks] Error:', error);
        return new Response("Error generating hooks", { status: 500 });
    }
}
