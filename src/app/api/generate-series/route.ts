import OpenAI from 'openai';
import { auth } from '@/lib/auth';
import type { ContentSeries, SeriesPost, SeriesGenerationRequest } from '@/types';

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

const SERIES_PROMPT = `You are a LinkedIn content strategist creating a connected multi-day content series. Each post MUST explicitly reference the previous day's post to create narrative continuity.

**CORE PHILOSOPHY (The "Anti-Pitch"):**
You never pitch products directly. Instead, you sell the philosophy and provide genuine value. Educate first, build trust through insights.

- **Old Way (Villain):** The outdated approach that causes pain and frustration in the industry.
- **New Way (Hero):** The modern approach that solves these problems through better methods.

**SERIES STRUCTURE RULES:**

1. **Day 1**: Introduce the main theme with a strong hook. Set up the week's journey.

2. **Days 2-N**: Each post MUST start with an explicit callback to the previous day. Use one of these callback patterns:
   - "Yesterday I shared [brief recap]. Today, let's go deeper..."
   - "Following up on yesterday's post about [topic]..."
   - "Remember what I said yesterday about [key point]? Here's why that matters..."
   - "Yesterday we talked about [X]. But here's what I didn't tell you..."
   - "After yesterday's post, several of you asked about [topic]. Let me explain..."

3. **Final Day**: Wrap up the series with a synthesis of all previous days. Reference the journey.

**CALLBACK REQUIREMENTS:**
- Each post (except Day 1) MUST reference the previous day's specific content
- Include a brief 1-sentence summary of what you covered
- The callback should feel natural, not forced
- Create curiosity about how today's post connects

**WRITING FRAMEWORK (Hook-Struggle-Lesson):**

Each post must follow this structure:

1. **THE HOOK (Lines 1-2):** For Day 1: A pattern interrupt. For Days 2+: The callback + bridge to today's topic.

2. **THE STRUGGLE:** Describe the pain of the "Old Way." Agitate the problem.

3. **THE EPIPHANY:** Introduce the concept (not the tool).

4. **THE LESSON:** Actionable advice they can use WITHOUT buying software.

5. **THE SOFT CTA:** Ask for a comment or debate. On final day, invite them to revisit the series.

**STYLISTIC RULES:**
- Write at a 4th-grade reading level. Simple words.
- Use line breaks frequently. One or two sentences per paragraph.
- NEVER use emojis
- NEVER use em-dashes (—), use regular dashes (-) instead
- NEVER use markdown formatting (no #, *, **, _)
- NEVER use bullet points with symbols
- Include 3-4 hashtags at the end of each post
- Keep each post 150-250 words

**OUTPUT FORMAT:**
Return a JSON object with this EXACT structure:
{
    "seriesTitle": "The series title",
    "seriesDescription": "One sentence description of what this series covers",
    "posts": [
        {
            "dayNumber": 1,
            "title": "Post title for Day 1",
            "content": "Full post content including hashtags",
            "previousSummary": null,
            "callbackPhrase": null
        },
        {
            "dayNumber": 2,
            "title": "Post title for Day 2",
            "content": "Full post content starting with callback, including hashtags",
            "previousSummary": "Brief summary of Day 1's key point",
            "callbackPhrase": "Yesterday I shared..."
        }
    ]
}

Return ONLY valid JSON, no markdown code blocks, no explanation.`;

function getDayLabel(dayNumber: number, startDate: Date): string {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayNumber - 1);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

function getScheduledDate(startDate: Date, dayNumber: number): string {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayNumber - 1);
    return date.toISOString().split('T')[0];
}

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
        const body: SeriesGenerationRequest = await req.json();
        const { topic, numberOfPosts, startDate, defaultTime, temperature = 'medium' } = body;

        if (!topic || typeof topic !== 'string') {
            return new Response("Missing topic", { status: 400 });
        }

        if (!numberOfPosts || numberOfPosts < 3 || numberOfPosts > 7) {
            return new Response("numberOfPosts must be between 3 and 7", { status: 400 });
        }

        if (!startDate) {
            return new Response("Missing startDate", { status: 400 });
        }

        const openai = getOpenAI();
        const tempValue = temperature === 'low' ? 0.3 : temperature === 'high' ? 1.0 : 0.7;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: SERIES_PROMPT },
                {
                    role: 'user',
                    content: `Create a ${numberOfPosts}-day LinkedIn content series about: "${topic}"

The series should:
1. Build on each day's content progressively
2. Each post (after Day 1) must explicitly reference what was shared the day before
3. Create a narrative arc that keeps readers coming back
4. End with a synthesis that ties everything together

Generate exactly ${numberOfPosts} posts.`
                }
            ],
            temperature: tempValue,
            max_tokens: 4000,
        });

        let resultText = response.choices[0]?.message?.content?.trim();

        if (!resultText) {
            return new Response("Failed to generate series", { status: 500 });
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
            const parsed = JSON.parse(resultText);
            const parsedStartDate = new Date(startDate);

            // Build the ContentSeries object
            const series: ContentSeries = {
                id: `series-${Date.now()}`,
                title: parsed.seriesTitle || `${numberOfPosts}-Day Series: ${topic}`,
                topic: topic,
                description: parsed.seriesDescription || '',
                numberOfPosts: numberOfPosts,
                startDate: startDate,
                defaultTime: defaultTime || '10:00',
                posts: parsed.posts.map((post: {
                    dayNumber: number;
                    title: string;
                    content: string;
                    previousSummary?: string;
                    callbackPhrase?: string;
                }, index: number): SeriesPost => ({
                    id: `post-${Date.now()}-${index}`,
                    dayNumber: post.dayNumber || index + 1,
                    dayLabel: getDayLabel(post.dayNumber || index + 1, parsedStartDate),
                    title: post.title,
                    content: post.content,
                    scheduledDate: getScheduledDate(parsedStartDate, post.dayNumber || index + 1),
                    scheduledTime: defaultTime || '10:00',
                    previousSummary: post.previousSummary || undefined,
                    callbackPhrase: post.callbackPhrase || undefined,
                    status: 'draft'
                })),
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            return Response.json(series);

        } catch (parseError) {
            // Try to extract JSON object from response
            const jsonMatch = resultText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const parsed = JSON.parse(jsonMatch[0]);
                    const parsedStartDate = new Date(startDate);

                    const series: ContentSeries = {
                        id: `series-${Date.now()}`,
                        title: parsed.seriesTitle || `${numberOfPosts}-Day Series: ${topic}`,
                        topic: topic,
                        description: parsed.seriesDescription || '',
                        numberOfPosts: numberOfPosts,
                        startDate: startDate,
                        defaultTime: defaultTime || '10:00',
                        posts: parsed.posts.map((post: {
                            dayNumber: number;
                            title: string;
                            content: string;
                            previousSummary?: string;
                            callbackPhrase?: string;
                        }, index: number): SeriesPost => ({
                            id: `post-${Date.now()}-${index}`,
                            dayNumber: post.dayNumber || index + 1,
                            dayLabel: getDayLabel(post.dayNumber || index + 1, parsedStartDate),
                            title: post.title,
                            content: post.content,
                            scheduledDate: getScheduledDate(parsedStartDate, post.dayNumber || index + 1),
                            scheduledTime: defaultTime || '10:00',
                            previousSummary: post.previousSummary || undefined,
                            callbackPhrase: post.callbackPhrase || undefined,
                            status: 'draft'
                        })),
                        createdAt: Date.now(),
                        updatedAt: Date.now()
                    };

                    return Response.json(series);
                } catch {
                    // Still failed
                }
            }
            console.error('[generate-series] Failed to parse JSON:', resultText, parseError);
            return new Response("Failed to parse series", { status: 500 });
        }

    } catch (error) {
        console.error('[generate-series] Error:', error);
        return new Response("Error generating series", { status: 500 });
    }
}
