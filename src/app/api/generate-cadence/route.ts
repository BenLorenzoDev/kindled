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

const CADENCE_PROMPT = `You are an expert B2B sales strategist specializing in LinkedIn social selling. Your approach is consultative, not pushy - building genuine relationships that naturally lead to business conversations.

Generate a 7-step outreach cadence for someone who engaged with a LinkedIn post. Each step should feel natural and human, not salesy.

RULES:
1. Step 1 (Connection Request): Short, reference their engagement, no pitch
2. Step 2 (Thank You DM): Casual appreciation, ask a question about them, NO pitch
3. Step 3 (Value-Add DM): Share a relevant insight/resource, position as helpful
4. Step 4 (Soft Intro DM): Naturally mention what you do, still focused on them
5. Step 5 (Meeting Ask DM): Soft ask for a chat, provide clear value proposition
6. Step 6 (Email): Professional follow-up, new channel, clear CTA
7. Step 7 (Cold Call Script): Warm opener referencing LinkedIn, handle objections

TONE: Professional but warm, curious, helpful. Never desperate or pushy.

OUTPUT FORMAT - Return JSON:
{
    "prospect": {
        "name": "Their name or 'this person'",
        "title": "Their title if known",
        "context": "Brief context about the engagement"
    },
    "steps": [
        {
            "step": 1,
            "name": "Connection Request",
            "timing": "Same day",
            "channel": "LinkedIn",
            "script": "The exact message to send",
            "tips": "Quick tip for this step",
            "charCount": 123
        }
    ]
}

Keep Connection Request under 300 chars. DMs under 500 chars. Be specific and personalized.
Return ONLY valid JSON.`;

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
        const { postTopic, postContent, engagementType, personName, personTitle, personCompany, theirComment } = await req.json();

        if (!postTopic || !engagementType) {
            return new Response("Post topic and engagement type are required", { status: 400 });
        }

        const openai = getOpenAI();

        const context = `
POST TOPIC: ${postTopic}

${postContent ? `FULL POST CONTENT:
"""
${postContent}
"""

IMPORTANT: Reference specific points, phrases, or insights from this post in your scripts to build rapport and show you're paying attention to their engagement.
` : ''}
ENGAGEMENT TYPE: ${engagementType}
${theirComment ? `THEIR COMMENT: "${theirComment}"` : ''}

PROSPECT INFO:
- Name: ${personName || 'Unknown'}
- Title: ${personTitle || 'Unknown'}
- Company: ${personCompany || 'Unknown'}

YOUR CONTEXT: You are Emil Halili, Co-Founder of CallView.ai - a conversation intelligence platform that uses AI + Human loop to analyze sales calls and provide actionable insights. Your target audience is sales leaders and revenue teams.

Generate a personalized 7-step cadence to nurture this prospect from engagement to meeting. ${postContent ? 'Make sure to reference specific insights or phrases from the post to build rapport.' : ''}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: CADENCE_PROMPT },
                { role: 'user', content: context }
            ],
            temperature: 0.7,
            max_tokens: 3000,
        });

        let resultText = response.choices[0]?.message?.content?.trim();

        if (!resultText) {
            return new Response("Failed to generate cadence", { status: 500 });
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
            const cadence = JSON.parse(resultText);
            return Response.json(cadence);
        } catch {
            const jsonMatch = resultText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const cadence = JSON.parse(jsonMatch[0]);
                    return Response.json(cadence);
                } catch {
                    // Still failed
                }
            }
            console.error('[generate-cadence] Failed to parse JSON:', resultText);
            return new Response("Failed to parse cadence", { status: 500 });
        }

    } catch (error) {
        console.error('[generate-cadence] Error:', error);
        return new Response("Error generating cadence", { status: 500 });
    }
}
