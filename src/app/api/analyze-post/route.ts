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

const ANALYSIS_PROMPT = `You are a LinkedIn content analyst. Analyze the following post and return a JSON object with these exact fields:

1. "engagementScore": A number from 1-100 predicting engagement potential
2. "engagementLabel": One of "Low", "Average", "Strong", "Viral Potential"
3. "hookStrength": One of "Weak", "Moderate", "Strong", "Viral"
4. "hookAnalysis": Brief 1-sentence explanation of the hook's effectiveness
5. "bestDay": Best day to post (e.g., "Tuesday", "Wednesday")
6. "bestTime": Best time to post (e.g., "8:15 AM", "12:30 PM")
7. "postingReason": Brief 1-sentence explanation of why this time
8. "estimatedReachMin": Minimum estimated impressions (number, e.g., 1500)
9. "estimatedReachMax": Maximum estimated impressions (number, e.g., 5000)
10. "readabilityGrade": Reading grade level as number (e.g., 4, 6, 8)
11. "readabilityLabel": One of "Easy (Grade 4)", "Simple (Grade 6)", "Moderate (Grade 8)", "Complex (Grade 10+)"
12. "suggestedHashtags": Array of 5 relevant hashtags (without # symbol, e.g., ["Sales", "Leadership", "B2B"])

SCORING CRITERIA:
- Engagement Score: Based on hook strength, emotional resonance, specificity, storytelling, controversy/debate potential
- Hook Strength: First 1-2 lines - does it stop the scroll? Is it specific? Does it create curiosity?
- Best Time: B2B content performs best Tue-Thu mornings (8-10 AM) or lunch (12-1 PM)
- Estimated Reach: Based on engagement score. Low (500-1500), Average (1500-4000), Strong (4000-10000), Viral (10000-50000)
- Readability: Analyze sentence length, word complexity, jargon usage
- Hashtags: Pick trending, relevant hashtags that match the post topic and would increase discoverability

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
                { role: 'system', content: ANALYSIS_PROMPT },
                { role: 'user', content: content }
            ],
            temperature: 0.3,
            max_tokens: 300,
        });

        let analysisText = response.choices[0]?.message?.content?.trim();

        if (!analysisText) {
            return new Response("Failed to analyze post", { status: 500 });
        }

        // Strip markdown code blocks if present
        if (analysisText.startsWith('```json')) {
            analysisText = analysisText.slice(7);
        } else if (analysisText.startsWith('```')) {
            analysisText = analysisText.slice(3);
        }
        if (analysisText.endsWith('```')) {
            analysisText = analysisText.slice(0, -3);
        }
        analysisText = analysisText.trim();

        try {
            const analysis = JSON.parse(analysisText);
            return Response.json(analysis);
        } catch {
            console.error('[analyze-post] Failed to parse JSON:', analysisText);
            // Try to extract JSON from the response
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const analysis = JSON.parse(jsonMatch[0]);
                    return Response.json(analysis);
                } catch {
                    // Still failed
                }
            }
            return new Response("Failed to parse analysis", { status: 500 });
        }

    } catch (error) {
        console.error('[analyze-post] Error:', error);
        return new Response("Error analyzing post", { status: 500 });
    }
}
