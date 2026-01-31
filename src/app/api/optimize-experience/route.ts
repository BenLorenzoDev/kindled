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

const OPTIMIZE_PROMPT = `You are an expert LinkedIn profile optimizer and career coach. Your job is to transform work experience descriptions into compelling, achievement-focused bullet points that grab recruiters' and potential clients' attention.

TRANSFORMATION RULES:
1. Convert duties into accomplishments with measurable results when possible
2. Start each bullet with a strong action verb (Led, Spearheaded, Drove, Transformed, etc.)
3. Add estimated metrics if not provided (revenue %, time saved, team size, etc.)
4. Keep each bullet 1-2 lines maximum for easy scanning
5. Highlight transferable skills that apply broadly
6. Use industry-relevant keywords for SEO/searchability
7. Make it conversational yet professional - avoid corporate jargon
8. Focus on the VALUE you delivered, not just what you did

OUTPUT FORMAT:
Return a JSON object with this structure:
{
    "optimizedBullets": [
        "Achievement-focused bullet point 1",
        "Achievement-focused bullet point 2",
        ...
    ],
    "headline": "A compelling one-line summary of this role (for the headline section)",
    "keySkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
    "tips": "One brief tip for making this experience stand out even more"
}

Generate 4-6 optimized bullet points.
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
        const { jobTitle, company, duration, description } = await req.json();

        if (!jobTitle || !description) {
            return new Response("Job title and description are required", { status: 400 });
        }

        const openai = getOpenAI();

        const userInput = `
Job Title: ${jobTitle}
Company: ${company || 'Not specified'}
Duration: ${duration || 'Not specified'}

Current Description/Duties:
${description}

Transform this into compelling, achievement-focused bullet points that will impress recruiters and potential clients.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: OPTIMIZE_PROMPT },
                { role: 'user', content: userInput }
            ],
            temperature: 0.7,
            max_tokens: 1500,
        });

        let resultText = response.choices[0]?.message?.content?.trim();

        if (!resultText) {
            return new Response("Failed to optimize experience", { status: 500 });
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
            const optimized = JSON.parse(resultText);
            return Response.json(optimized);
        } catch {
            // Try to extract JSON from response
            const jsonMatch = resultText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const optimized = JSON.parse(jsonMatch[0]);
                    return Response.json(optimized);
                } catch {
                    // Still failed
                }
            }
            console.error('[optimize-experience] Failed to parse JSON:', resultText);
            return new Response("Failed to parse optimized experience", { status: 500 });
        }

    } catch (error) {
        console.error('[optimize-experience] Error:', error);
        return new Response("Error optimizing experience", { status: 500 });
    }
}
