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

const SIMPLIFY_PROMPT = `You are a LinkedIn copywriting expert who specializes in making content MORE READABLE and HUMAN.

Your job is to rewrite this LinkedIn post to achieve a Grade 4 reading level or lower.

SIMPLIFICATION RULES:
1. **Short sentences** - Max 10-12 words per sentence
2. **Simple words** - Replace jargon with everyday words
3. **No corporate speak** - Remove buzzwords like "leverage", "synergy", "optimize"
4. **Conversational tone** - Write like you're texting a friend
5. **Active voice** - "I did X" not "X was done"
6. **One idea per sentence** - Break up complex thoughts
7. **Real talk** - Sound like a human, not a press release

WORD REPLACEMENTS:
- "utilize" → "use"
- "implement" → "do" or "start"
- "leverage" → "use"
- "optimize" → "improve"
- "synergy" → cut it entirely
- "stakeholders" → "people" or "team"
- "bandwidth" → "time"
- "circle back" → "talk later"
- "deep dive" → "look at"
- "low-hanging fruit" → "easy wins"
- "move the needle" → "make a difference"
- "thought leader" → cut it
- "disrupt" → "change"
- "scalable" → "grows with you"

STRUCTURE:
- Keep line breaks and white space
- Keep the hook punchy
- Keep hashtags at the end
- Preserve the core message and CTA

The rewritten post should feel like a smart friend explaining something simply - not dumbed down, just CLEAR.

Return ONLY the rewritten post, no explanation, no quotes around it.`;

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
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: SIMPLIFY_PROMPT },
                { role: 'user', content: `Simplify this LinkedIn post to Grade 4 reading level:\n\n${content}` }
            ],
            temperature: 0.6,
            max_tokens: 1500,
        });

        const simplifiedContent = response.choices[0]?.message?.content?.trim();

        if (!simplifiedContent) {
            return new Response("Failed to simplify post", { status: 500 });
        }

        return Response.json({ content: simplifiedContent });

    } catch (error) {
        console.error('[simplify-post] Error:', error);
        return new Response("Error simplifying post", { status: 500 });
    }
}
