import OpenAI from 'openai';
import { auth } from '@/lib/auth';
import { brandConfig, getHashtags } from '@/config';

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

// Default search keywords - can be customized based on brand configuration
const SEARCH_QUERIES = [
    'LinkedIn content strategy trends site:reddit.com OR site:medium.com',
    'AI writing tools for LinkedIn site:forbes.com OR site:techcrunch.com',
    'B2B content marketing trends site:reddit.com OR site:quora.com',
    'LinkedIn engagement tips site:reddit.com',
    'content marketing AI tools 2024 2025',
    'social selling LinkedIn best practices',
];

async function searchWeb(query: string): Promise<string[]> {
    try {
        // Use a search API or scraping service
        // For now, we'll use the OpenAI to simulate search results based on known patterns
        // In production, you'd use SerpAPI, Google Custom Search, or similar
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

const hashtagList = getHashtags(8).join(', ');

const ANALYSIS_PROMPT = `You are a content strategist for ${brandConfig.company.name}. ${brandConfig.company.tagline}

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
        const { customKeywords } = await req.json();

        const openai = getOpenAI();

        // Gather search results
        let searchResults: string[] = [];

        // If Google Search API is configured, use it
        if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_CX) {
            const queries = customKeywords
                ? [`${customKeywords} site:reddit.com OR site:g2.com`, `${customKeywords} trends 2025`]
                : SEARCH_QUERIES.slice(0, 3);

            for (const query of queries) {
                const results = await searchWeb(query);
                searchResults.push(...results);
            }
        }

        // Build context for AI analysis
        const searchContext = searchResults.length > 0
            ? `Recent discussions and trends found:\n${searchResults.join('\n\n')}`
            : `Analyze current trends in: conversation intelligence, AI sales coaching, call analytics, revenue intelligence, sales call recording analysis, human-in-the-loop AI for sales.

Consider common pain points discussed on Reddit, G2, and industry forums:
- Sales managers spending too much time listening to call recordings
- Lack of actionable insights from conversation data
- AI tools that miss context and nuance
- Difficulty coaching remote sales teams
- CRM data quality issues from manual call logging
- Compliance and call monitoring challenges`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: ANALYSIS_PROMPT },
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
// Trigger redeploy
