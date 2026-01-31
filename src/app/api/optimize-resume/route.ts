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

const ANALYZE_PROMPT = `You are an elite career strategist and executive resume writer who has helped thousands of professionals land their dream roles. Your expertise is in transforming ordinary resumes into compelling career narratives that make recruiters and potential clients say "I need to meet this person."

ANALYZE THE RESUME AND EXTRACT:
1. Each work experience (job title, company, dates, description)
2. Calculate tenure for each role
3. Identify the industry/domain

For EACH work experience, rewrite it using this framework:

## THE PAIN-SOLUTION-RESULT FRAMEWORK:
1. **Context/Pain Point**: What business challenge or pain point did this role address? What was broken, inefficient, or needed improvement?
2. **Strategy/Solution**: What specific approach, methodology, or strategy did you implement? Be specific about tools, frameworks, and tactics.
3. **Measurable Results**: What were the quantifiable outcomes? Use metrics, percentages, revenue figures, time saved, etc.

## SPECIAL HANDLING FOR SHORT TENURES (under 12 months):
If a role lasted less than 1 year, reframe it as one of these:
- **Strategic Consulting Engagement** - "Engaged as [Fractional/Consulting] [Title] to..."
- **Project-Based Leadership** - "Brought in to lead [specific initiative]..."
- **Transformation Specialist** - "Contracted to architect and execute..."
- **Turnaround Expert** - "Recruited to address critical [challenge]..."

This makes short stints look intentional and high-value, not like job-hopping.

## WRITING STYLE:
- Start each bullet with powerful action verbs (Spearheaded, Orchestrated, Pioneered, Transformed, Architected)
- Include specific metrics even if you need to estimate reasonable ranges
- Show strategic thinking, not just task execution
- Make it clear you SOLVED problems, not just held a job
- Keep each experience to 4-5 impactful bullets maximum
- Write for both recruiters AND potential clients who want to hire you

## OUTPUT FORMAT:
Return a JSON object:
{
    "summary": "A powerful 2-3 sentence professional summary that positions you as an expert problem-solver",
    "headline": "A compelling LinkedIn headline (under 120 chars)",
    "experiences": [
        {
            "originalTitle": "The original job title",
            "optimizedTitle": "Enhanced title (if short tenure, add Fractional/Consulting prefix)",
            "company": "Company name",
            "duration": "Original duration",
            "isShortTenure": true/false,
            "reframedAs": "If short tenure, how it's positioned (Consulting Engagement, Project-Based, etc.)",
            "bullets": [
                "Rewritten bullet with pain-solution-result framework",
                ...
            ],
            "keySkills": ["skill1", "skill2", "skill3"]
        }
    ],
    "overallTips": "2-3 sentences of additional advice for this specific profile"
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
        const { resumeText } = await req.json();

        if (!resumeText || resumeText.length < 100) {
            return new Response("Resume text is too short", { status: 400 });
        }

        const openai = getOpenAI();

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: ANALYZE_PROMPT },
                { role: 'user', content: `Here is the resume to analyze and optimize:\n\n${resumeText}\n\nTransform each work experience using the Pain-Solution-Result framework. For any roles under 12 months, reframe them as strategic consulting or project-based engagements.` }
            ],
            temperature: 0.7,
            max_tokens: 4000,
        });

        let resultText = response.choices[0]?.message?.content?.trim();

        if (!resultText) {
            return new Response("Failed to optimize resume", { status: 500 });
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
            console.error('[optimize-resume] Failed to parse JSON:', resultText);
            return new Response("Failed to parse optimized resume", { status: 500 });
        }

    } catch (error) {
        console.error('[optimize-resume] Error:', error);
        return new Response("Error optimizing resume", { status: 500 });
    }
}
// Trigger redeploy
