'use server';

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { auth } from '@/lib/auth';
import { hydratePrompt } from '@/lib/server-utils';
import { getProductBrief } from '@/lib/onboarding-status';
import { PERSONA_TEMPLATES, MODE_INSTRUCTIONS } from '@/lib/prompts/config';
import type { PersonaType, ModeType } from '@/types';

interface GeneratePostOptions {
    persona?: PersonaType;
    mode?: ModeType;
}

export async function generatePostAction(
    userPrompt: string,
    options: GeneratePostOptions = {}
) {
    const { persona = 'coach', mode = 'arm' } = options;

    // Authentication check - verify user is authenticated and whitelisted
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
        return { success: false, error: "Unauthorized" };
    }

    // Check whitelist
    const allowedUsers = process.env.ALLOWED_USERS?.split(",").map(e => e.trim()) || [];
    if (!allowedUsers.includes(session.user.email)) {
        return { success: false, error: "Forbidden" };
    }

    try {
        // Load user's strategy from database
        const strategyContent = await getProductBrief(session.user.id);
        if (!strategyContent) {
            return { success: false, error: "Please complete onboarding first" };
        }

        // Select template and mode based on options
        const template = PERSONA_TEMPLATES[persona];
        const modeInstructions = MODE_INSTRUCTIONS[mode];

        // Hydrate prompt with user's strategy and mode instructions
        const systemPrompt = hydratePrompt(template, {
            CONTEXT: strategyContent,
            MODE: modeInstructions,
        });

        // Get model from environment or use default
        const modelId = process.env.OPENAI_MODEL || 'gpt-4o';

        const { text } = await generateText({
            model: openai(modelId),
            system: systemPrompt,
            prompt: userPrompt,
        });

        return { success: true, data: text };
    } catch (error) {
        console.error("Generation failed:", error);
        return { success: false, error: "Failed to generate post" };
    }
}
