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

const ENGAGEMENT_PROMPT = `You are an expert at LinkedIn social selling. Your job is to help turn post engagement into warm conversations.

Given a LinkedIn post and a list of people who engaged, generate personalized outreach for each person.

RULES:
1. Connection Request: Short (under 300 chars), reference their engagement, no pitch
2. Thank You DM: Casual, genuine appreciation, ask a question to start conversation, NO pitch
3. For commenters: Reference what they said specifically
4. For reactors (emoji only): Thank them for the support, ask their perspective on the topic
5. Tone: Warm, curious, human - NOT salesy

OUTPUT FORMAT - Return JSON:
{
    "postSummary": "Brief 1-line summary of the post topic",
    "engagements": [
        {
            "name": "Person's name",
            "engagementType": "comment" or "reaction",
            "theirComment": "What they said (if comment)",
            "connectionRequest": "Short connection request message",
            "thankYouDM": "Thank you + conversation starter DM"
        }
    ]
}

Keep messages genuine and conversational. Each person should feel like you wrote it just for them.
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
        const { postContent, engagementList } = await req.json();

        if (!postContent || !engagementList) {
            return new Response("Post content and engagement list are required", { status: 400 });
        }

        const openai = getOpenAI();

        const context = `
MY LINKEDIN POST:
"""
${postContent}
"""

PEOPLE WHO ENGAGED:
${engagementList}

YOUR CONTEXT: I am Emil Halili, Co-Founder of CallView.ai - a conversation intelligence platform. I want to thank these people for engaging and potentially start a conversation that could lead to a business relationship, but I do NOT want to pitch them. Just genuine appreciation and curiosity.

Generate personalized Connection Request and Thank You DM for each person listed.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: ENGAGEMENT_PROMPT },
                { role: 'user', content: context }
            ],
            temperature: 0.7,
            max_tokens: 3000,
        });

        let resultText = response.choices[0]?.message?.content?.trim();

        if (!resultText) {
            return new Response("Failed to process engagements", { status: 500 });
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
            const jsonMatch = resultText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const result = JSON.parse(jsonMatch[0]);
                    return Response.json(result);
                } catch {
                    // Still failed
                }
            }
            console.error('[process-engagements] Failed to parse JSON:', resultText);
            return new Response("Failed to parse results", { status: 500 });
        }

    } catch (error) {
        console.error('[process-engagements] Error:', error);
        return new Response("Error processing engagements", { status: 500 });
    }
}
