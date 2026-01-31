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

const COMMENT_PROMPT = `You are a LinkedIn engagement expert. Generate thoughtful, authentic comments for LinkedIn posts that:
1. Add genuine value to the conversation
2. Show expertise without being preachy
3. Encourage further discussion
4. Build relationships with the author

COMMENT STYLES:
1. **Insight Adder** - Share a relevant insight or experience that builds on their point
2. **Thoughtful Question** - Ask a question that shows you read carefully and want to learn more
3. **Agreeable Challenger** - Agree with the main point but offer a nuanced perspective
4. **Story Connector** - Share a brief relevant anecdote that relates to their post
5. **Value Amplifier** - Highlight and expand on a specific point they made

RULES:
- Keep comments between 2-4 sentences
- Be conversational, not formal
- No generic phrases like "Great post!" or "Thanks for sharing"
- No hashtags or emojis unless the post uses them
- Sound like a thoughtful peer, not a fan
- Reference specific parts of their post to show you actually read it

Return a JSON array with exactly 5 objects:
[
  { "style": "Insight Adder", "comment": "...", "engagement_score": 85 },
  { "style": "Thoughtful Question", "comment": "...", "engagement_score": 78 },
  ...
]

The "engagement_score" is your confidence (1-100) that this comment will get a response from the author.

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
        const { postContent, authorName, yourContext } = await req.json();

        if (!postContent || typeof postContent !== 'string') {
            return new Response("Missing post content", { status: 400 });
        }

        const openai = getOpenAI();

        let userPrompt = `Generate 5 thoughtful comment variations for this LinkedIn post:\n\n${postContent}`;

        if (authorName) {
            userPrompt += `\n\nPost author: ${authorName}`;
        }

        if (yourContext) {
            userPrompt += `\n\nAbout me (use this to make comments more relevant): ${yourContext}`;
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: COMMENT_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.8,
            max_tokens: 800,
        });

        let commentsText = response.choices[0]?.message?.content?.trim();

        if (!commentsText) {
            return new Response("Failed to generate comments", { status: 500 });
        }

        // Strip markdown code blocks if present
        if (commentsText.startsWith('```json')) {
            commentsText = commentsText.slice(7);
        } else if (commentsText.startsWith('```')) {
            commentsText = commentsText.slice(3);
        }
        if (commentsText.endsWith('```')) {
            commentsText = commentsText.slice(0, -3);
        }
        commentsText = commentsText.trim();

        try {
            const comments = JSON.parse(commentsText);
            return Response.json({ comments });
        } catch {
            console.error('[generate-comment] Failed to parse JSON:', commentsText);
            // Try to extract JSON array from the response
            const jsonMatch = commentsText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                try {
                    const comments = JSON.parse(jsonMatch[0]);
                    return Response.json({ comments });
                } catch {
                    // Still failed
                }
            }
            return new Response("Failed to parse comments", { status: 500 });
        }

    } catch (error) {
        console.error('[generate-comment] Error:', error);
        return new Response("Error generating comments", { status: 500 });
    }
}
