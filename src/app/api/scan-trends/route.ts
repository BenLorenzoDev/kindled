import OpenAI from 'openai';
import { auth } from '@/lib/auth';
import { getUserStrategy } from '@/lib/onboarding-status';

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

async function searchWeb(query: string): Promise<string[]> {
    try {
        const response = await fetch(
            `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_CX}&q=${encodeURIComponent(query)}&num=5`,
            { next: { revalidate: 3600 } }
        );

        if (response.ok) {
            const data = await response.json();
            return data.items?.map((item: { title: string; snippet: string; link: string }) =>
                `${item.title}: ${item.snippet} (${item.link})`
            ) || [];
        }
    } catch (error) {
        console.error('[scan-trends] Search error:', error);
    }
    return [];
}

function buildAnalysisPrompt(brandName: string, industry: string, hashtags: string[]): string {
    const hashtagList = hashtags.join(', ');

    return `You are a content strategist for ${brandName}, a company in the ${industry} space.

Based on the trending discussions and pain points found, create content opportunities.

For each trend/pain point, provide:
1. The trend or pain point identified
2. Why it matters to the target audience
3. A LinkedIn post hook that addresses this
4. The brand angle (how this relates to the brand's philosophy)
5. A full LinkedIn post draft (200-300 words) that provides genuine value

IMPORTANT RULES:
- Don't be salesy - be educational and value-first
- Use storytelling and real scenarios
- Position insights naturally, not as a hard pitch
- Make posts engaging with hooks that stop the scroll
- Use hashtags from this list: ${hashtagList}

Return a JSON array with this structure:
[
    {
        "trend": "The trend or pain point",
        "source": "Where this was found (Reddit, G2, etc.)",
        "whyItMatters": "Why this matters to the audience",
        "hook": "The attention-grabbing first line",
        "brandAngle": "How this relates to the brand's philosophy",
        "fullPost": "The complete LinkedIn post (200-300 words)",
        "hashtags": ["relevant", "hashtags"]
    }
]

Generate 4-5 content opportunities.
Return ONLY valid JSON, no markdown, no explanation.`;
}

function buildSearchQueries(industry: string): string[] {
    return [
        `${industry} trends 2025 site:reddit.com OR site:medium.com`,
        `${industry} pain points site:reddit.com OR site:quora.com`,
        `${industry} LinkedIn content strategy`,
        `${industry} best practices site:forbes.com OR site:techcrunch.com`,
    ];
}

function buildFallbackContext(industry: string, pillars: Array<{ name: string; problem: string }>): string {
    const pillarProblems = pillars
        .map(p => `- ${p.problem}`)
        .join('\n');

    return `Analyze current trends in: ${industry}, content marketing, LinkedIn engagement, thought leadership.

Consider common pain points discussed on Reddit, G2, and industry forums related to ${industry}:
${pillarProblems}
- Difficulty standing out in a crowded market
- Building authentic thought leadership
- Creating consistent, engaging content
- Converting LinkedIn engagement into business results`;
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
        return new Response("Unauthorized", { status: 401 });
    }

    const allowedUsers = process.env.ALLOWED_USERS?.split(",").map(e => e.trim()) || [];
    if (!allowedUsers.includes(session.user.email)) {
        return new Response("Forbidden", { status: 403 });
    }

    try {
        // Load user's strategy
        const strategy = await getUserStrategy(session.user.id);
        if (!strategy) {
            return new Response("Please complete onboarding first", { status: 400 });
        }

        const { customKeywords } = await req.json();
        const openai = getOpenAI();

        const industry = strategy.brandIndustry || 'business';
        const brandName = strategy.brandName || 'Your Brand';
        const hashtags = [
            strategy.hashtags?.primary || '#LinkedIn',
            ...(strategy.hashtags?.secondary || ['#ContentStrategy', '#ThoughtLeadership'])
        ];
        const pillars = strategy.pillars || [];

        // Build search queries based on user's industry
        const searchQueries = buildSearchQueries(industry);

        // Gather search results
        let searchResults: string[] = [];

        // If Google Search API is configured, use it
        if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_CX) {
            const queries = customKeywords
                ? [`${customKeywords} ${industry} site:reddit.com OR site:g2.com`, `${customKeywords} trends 2025`]
                : searchQueries.slice(0, 3);

            for (const query of queries) {
                const results = await searchWeb(query);
                searchResults.push(...results);
            }
        }

        // Build context for AI analysis
        const searchContext = searchResults.length > 0
            ? `Recent discussions and trends found:\n${searchResults.join('\n\n')}`
            : buildFallbackContext(industry, pillars);

        // Build dynamic prompt based on user's strategy
        const analysisPrompt = buildAnalysisPrompt(brandName, industry, hashtags);

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: analysisPrompt },
                { role: 'user', content: `${searchContext}\n\nGenerate content opportunities based on these trends and pain points.` }
            ],
            temperature: 0.8,
            max_tokens: 4000,
        });

        let resultText = response.choices[0]?.message?.content?.trim();

        if (!resultText) {
            return new Response("Failed to analyze trends", { status: 500 });
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
            const trends = JSON.parse(resultText);
            return Response.json({
                trends,
                searchResults: searchResults.length > 0 ? searchResults : null,
                source: searchResults.length > 0 ? 'live_search' : 'ai_analysis'
            });
        } catch {
            // Try to extract JSON array from response
            const jsonMatch = resultText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                try {
                    const trends = JSON.parse(jsonMatch[0]);
                    return Response.json({
                        trends,
                        searchResults: searchResults.length > 0 ? searchResults : null,
                        source: searchResults.length > 0 ? 'live_search' : 'ai_analysis'
                    });
                } catch {
                    // Still failed
                }
            }
            console.error('[scan-trends] Failed to parse JSON:', resultText);
            return new Response("Failed to parse trends", { status: 500 });
        }

    } catch (error) {
        console.error('[scan-trends] Error:', error);
        return new Response("Error scanning trends", { status: 500 });
    }
}
