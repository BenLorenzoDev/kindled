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

const REPURPOSE_PROMPT = `You are a content repurposing expert. Transform this LinkedIn post into 6 different content formats while preserving the core message and value.

FORMATS TO CREATE:

1. **Twitter/X Thread** (5-8 tweets)
   - First tweet is the hook (under 280 chars)
   - Number each tweet (1/, 2/, etc.)
   - End with a call to action
   - Include relevant hashtags on last tweet only

2. **Email Newsletter**
   - Compelling subject line
   - Personal greeting
   - Expanded content with more context
   - Clear CTA at the end
   - Professional sign-off

3. **Instagram Carousel** (6-8 slides)
   - Slide 1: Bold hook/title
   - Slides 2-6: One key point per slide (short, punchy)
   - Slide 7: Summary or key takeaway
   - Slide 8: CTA (Save, Share, Follow)
   - Keep each slide under 50 words

4. **Video Script** (60-90 seconds)
   - Opening hook (first 3 seconds crucial)
   - Main content with clear sections
   - Include [PAUSE] markers for emphasis
   - End with strong CTA
   - Conversational, spoken tone

5. **Blog Outline**
   - SEO-friendly title
   - Meta description (155 chars)
   - H2 headers for main sections
   - Bullet points under each section
   - Suggested word count: 800-1200

6. **Cold Email** (A-GAME FRAMEWORK)
   CRITICAL RULES:
   - MUST be under 80 words total (body only, not counting subject lines)
   - 4th grade reading level - simple words, short sentences
   - Tone: Like texting an old friend you're checking in on
   - NO sales pitch, NO corporate speak, NO buzzwords
   - Anti-pitch CTA: Soft, curious, zero pressure (e.g., "Worth a chat?" or "Open to hearing more?" or "Curious if this resonates?")

   Subject Lines (provide 3-4 options using hook styles):
   - Contrarian: Challenge an assumption
   - Question: Spark curiosity
   - Confession: Vulnerable/honest opener
   - Number/Stat: Specific data point

   Body Structure:
   - Line 1: Personal connection or observation (not about you)
   - Line 2-3: The insight or value nugget (from the post)
   - Line 4: Anti-pitch CTA
   - Sign off: Just first name, casual

Return a JSON object with this exact structure:
{
    "twitterThread": "Full thread with numbered tweets...",
    "emailNewsletter": {
        "subjectLine": "Subject here",
        "body": "Full email content..."
    },
    "instagramCarousel": [
        "Slide 1 content",
        "Slide 2 content"
    ],
    "videoScript": "Full script with [PAUSE] markers...",
    "blogOutline": {
        "title": "SEO title",
        "metaDescription": "Meta description",
        "sections": [
            { "heading": "H2 heading", "points": ["point 1", "point 2"] }
        ]
    },
    "coldEmail": {
        "subjectLines": [
            "Subject option 1",
            "Subject option 2",
            "Subject option 3"
        ],
        "body": "The cold email body under 80 words..."
    }
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
        const { content } = await req.json();

        if (!content || typeof content !== 'string') {
            return new Response("Missing content", { status: 400 });
        }

        const openai = getOpenAI();

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: REPURPOSE_PROMPT },
                { role: 'user', content: `Transform this LinkedIn post:\n\n${content}` }
            ],
            temperature: 0.7,
            max_tokens: 3000,
        });

        let resultText = response.choices[0]?.message?.content?.trim();

        if (!resultText) {
            return new Response("Failed to repurpose content", { status: 500 });
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
        } catch (parseError) {
            console.error('[repurpose-content] Failed to parse JSON:', resultText);
            console.error('[repurpose-content] Parse error:', parseError);

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
        console.error('[repurpose-content] Error:', error);
        return new Response("Error repurposing content", { status: 500 });
    }
}
