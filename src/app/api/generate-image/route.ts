import OpenAI from 'openai';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Lazy initialization to avoid build-time errors
let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openaiClient;
}

const IMAGE_PROMPT_SYSTEM = `You are an expert at creating DALL-E 3 image prompts for LinkedIn posts. Your job is to analyze a LinkedIn post and create a compelling image showing HUMAN FACIAL EXPRESSIONS and REACTIONS.

GOAL: Create images that show how READERS FEEL when they read this content. Capture the emotional reaction - the "aha moment", the frustration, the relief, the shock, the curiosity.

RULES:
1. ALWAYS include a human face with a clear emotional expression
2. Focus on RELATABLE REACTIONS: shock, realization, frustration, relief, curiosity, confidence, overwhelm, excitement
3. Professional people in business/office settings (diverse professionals)
4. Cinematic lighting, high quality portrait photography style
5. Emotions should match the post's core message
6. No text in images - purely visual
7. Style: Professional photography, cinematic, editorial quality, LinkedIn-appropriate

EMOTION MAPPING:
- Post about problems/pain points → frustrated, overwhelmed, confused, stressed expression
- Post about solutions/breakthroughs → relieved, enlightened, "aha moment" expression
- Post about surprising stats → shocked, wide-eyed, disbelief expression
- Post about success stories → confident, proud, accomplished expression
- Post about mistakes/lessons → thoughtful, reflective, "I've been there" expression
- Post about challenges → determined, focused, resilient expression

EXAMPLES:
- Post about "blind spots in sales" → "Professional sales manager with a shocked, wide-eyed expression of sudden realization, hand on forehead, cinematic lighting, shallow depth of field, office background blurred, editorial portrait photography"
- Post about "AI chaos without oversight" → "Business professional looking overwhelmed and frustrated, surrounded by multiple screens, rubbing temples, dramatic lighting, professional photography style"
- Post about "firehose of leads" → "Excited sales professional with an amazed, delighted expression, eyes wide with pleasant surprise, bright natural lighting, modern office, high-end portrait photography"

OUTPUT: Return ONLY the image prompt, nothing else. Keep it under 200 words.`;

export async function POST(req: Request) {
    // Authentication check
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

        // Step 1: Generate contextual image prompt using GPT
        const promptResponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: IMAGE_PROMPT_SYSTEM },
                { role: 'user', content: `Create an image prompt for this LinkedIn post:\n\n${content}` }
            ],
            temperature: 0.7,
            max_tokens: 300,
        });

        const imagePrompt = promptResponse.choices[0]?.message?.content?.trim();

        if (!imagePrompt) {
            return new Response("Failed to generate image prompt", { status: 500 });
        }

        console.log('[generate-image] Generated prompt:', imagePrompt);

        // Step 2: Generate image with DALL-E 3
        const imageResponse = await openai.images.generate({
            model: 'dall-e-3',
            prompt: imagePrompt,
            n: 1,
            size: '1024x1024',
            quality: 'standard',
            style: 'vivid',
        });

        const imageUrl = imageResponse.data?.[0]?.url;

        if (!imageUrl) {
            return new Response("Failed to generate image", { status: 500 });
        }

        return Response.json({
            imageUrl,
            prompt: imagePrompt,
        });

    } catch (error) {
        console.error('[generate-image] Error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return new Response(`Error generating image: ${message}`, { status: 500 });
    }
}
