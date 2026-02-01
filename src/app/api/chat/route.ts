import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { hydratePrompt } from '@/lib/server-utils';
import { getProductBrief } from '@/lib/onboarding-status';
import { PERSONA_TEMPLATES, MODE_INSTRUCTIONS } from '@/lib/prompts/config';
import { getMessageContent } from '@/lib/utils';
import type { PersonaType, ModeType, TemperatureType } from '@/types';
import { TEMPERATURE_VALUES } from '@/types';

// Explicitly set Node.js runtime (required for fs operations)
export const runtime = 'nodejs';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Zod schema for message validation - supports both content and parts format
const messageSchema = z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().optional(),
    parts: z.array(z.object({
        type: z.string(),
        text: z.string().optional(),
    })).optional(),
}).refine(
    (msg) => msg.content !== undefined || (msg.parts && msg.parts.length > 0),
    { message: "Message must have either content or parts" }
);

const requestSchema = z.object({
    messages: z.array(messageSchema),
    persona: z.enum(['coach', 'architect']).optional().default('coach'),
    mode: z.enum(['arm', 'outcome']).optional().default('arm'),
    temperature: z.enum(['low', 'medium', 'high']).optional().default('medium'),
});


export async function POST(req: Request) {
    console.log('[API/chat] POST request received');

    // Authentication check - verify user is authenticated and whitelisted
    const session = await auth();
    console.log('[API/chat] Session:', session?.user?.email ? `User: ${session.user.email}` : 'No session');

    if (!session?.user?.email) {
        console.log('[API/chat] Unauthorized - no session');
        return new Response("Unauthorized", { status: 401 });
    }

    // Check whitelist
    const allowedUsers = process.env.ALLOWED_USERS?.split(",").map(e => e.trim()) || [];
    console.log('[API/chat] Allowed users count:', allowedUsers.length);

    if (!allowedUsers.includes(session.user.email)) {
        console.log('[API/chat] Forbidden - user not in whitelist');
        return new Response("Forbidden", { status: 403 });
    }

    // Validate request body with Zod
    let messages;
    let persona: PersonaType;
    let mode: ModeType;
    let temperature: TemperatureType;
    try {
        const body = await req.json();
        console.log('[API/chat] Request body received, messages count:', body.messages?.length);
        const validated = requestSchema.parse(body);
        messages = validated.messages;
        persona = validated.persona;
        mode = validated.mode;
        temperature = validated.temperature;
        console.log('[API/chat] Validated - persona:', persona, 'mode:', mode, 'temp:', temperature);
    } catch (error) {
        console.error('[API/chat] Validation error:', error);
        return new Response("Invalid request body", { status: 400 });
    }

    // Load user's strategy from database
    let strategyContent: string;
    try {
        const productBrief = await getProductBrief(session.user.id);
        if (!productBrief) {
            console.log('[API/chat] No strategy found - user needs to complete onboarding');
            return new Response("Please complete onboarding first", { status: 400 });
        }
        strategyContent = productBrief;
        console.log('[API/chat] User strategy loaded, length:', strategyContent.length);
    } catch (error) {
        console.error('[API/chat] Error loading user strategy:', error);
        return new Response("Failed to load strategy", { status: 500 });
    }

    // Select template and mode based on request
    const template = PERSONA_TEMPLATES[persona];
    const modeInstructions = MODE_INSTRUCTIONS[mode];

    // Hydrate Prompt with user's strategy and mode instructions
    const systemPrompt = hydratePrompt(template, {
        CONTEXT: strategyContent,
        MODE: modeInstructions,
    });

    // Get model from environment or use default
    const modelId = process.env.OPENAI_MODEL || 'gpt-4o';
    console.log('[API/chat] Using model:', modelId);

    try {
        // Convert messages to standard format for AI SDK
        const formattedMessages = messages.map(msg => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: getMessageContent(msg),
        }));
        console.log('[API/chat] Formatted messages, calling OpenAI...');

        const result = streamText({
            model: openai(modelId),
            system: systemPrompt,
            messages: formattedMessages,
            temperature: TEMPERATURE_VALUES[temperature],
        });

        console.log('[API/chat] Streaming response started');
        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("[API/chat] Stream Error:", error);
        return new Response("Error generating response", { status: 500 });
    }
}
