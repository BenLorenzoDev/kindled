import OpenAI from 'openai';
import nodemailer from 'nodemailer';
import { brandConfig } from '@/config';

export const runtime = 'nodejs';
export const maxDuration = 60;

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openaiClient;
}

// Default search keywords for content trends
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
        console.error('[cron-scan-trends] Search error:', error);
    }
    return [];
}

const ANALYSIS_PROMPT = `You are a content strategist for ${brandConfig.company.name}. ${brandConfig.company.tagline}

Based on trending discussions, identify the TOP 3 most timely and relevant content opportunities.

For each, provide:
1. The trend/pain point
2. Why it's trending NOW
3. A scroll-stopping LinkedIn hook
4. The brand angle

Return JSON array:
[
    {
        "trend": "The trend",
        "whyNow": "Why this is timely",
        "hook": "The LinkedIn hook",
        "brandAngle": "How this relates to content strategy",
        "urgency": "high/medium/low"
    }
]

Focus on HIGH URGENCY items that should be posted this week.
Return ONLY valid JSON.`;

async function sendEmail(trends: Array<{ trend: string; whyNow: string; hook: string; brandAngle: string; urgency: string }>) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const highUrgency = trends.filter(t => t.urgency === 'high');
    const otherTrends = trends.filter(t => t.urgency !== 'high');

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0; opacity: 0.9; font-size: 14px; }
        .trend-card { background: #f8f9fa; border-radius: 12px; padding: 16px; margin-bottom: 16px; border-left: 4px solid #8b5cf6; }
        .trend-card.high { border-left-color: #ef4444; background: #fef2f2; }
        .urgency { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
        .urgency.high { background: #fee2e2; color: #dc2626; }
        .urgency.medium { background: #fef3c7; color: #d97706; }
        .urgency.low { background: #dbeafe; color: #2563eb; }
        .trend-title { font-weight: 600; font-size: 16px; margin: 8px 0; color: #1f2937; }
        .why-now { font-size: 13px; color: #6b7280; margin-bottom: 12px; }
        .hook { background: white; padding: 12px; border-radius: 8px; font-style: italic; color: #4b5563; border: 1px solid #e5e7eb; margin-bottom: 12px; }
        .angle { font-size: 13px; color: #7c3aed; }
        .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; }
        .cta { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔥 New Content Opportunities</h1>
        <p>Trending topics for your LinkedIn - ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
    </div>

    ${highUrgency.length > 0 ? `
    <h2 style="color: #dc2626; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">🚨 Post This Week</h2>
    ${highUrgency.map(t => `
    <div class="trend-card high">
        <span class="urgency high">High Priority</span>
        <div class="trend-title">${t.trend}</div>
        <div class="why-now">📈 ${t.whyNow}</div>
        <div class="hook">"${t.hook}"</div>
        <div class="angle">💡 Brand Angle: ${t.brandAngle}</div>
    </div>
    `).join('')}
    ` : ''}

    ${otherTrends.length > 0 ? `
    <h2 style="color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">📋 Other Opportunities</h2>
    ${otherTrends.map(t => `
    <div class="trend-card">
        <span class="urgency ${t.urgency}">${t.urgency}</span>
        <div class="trend-title">${t.trend}</div>
        <div class="why-now">📈 ${t.whyNow}</div>
        <div class="hook">"${t.hook}"</div>
        <div class="angle">💡 Brand Angle: ${t.brandAngle}</div>
    </div>
    `).join('')}
    ` : ''}

    <div style="text-align: center;">
        <a href="${process.env.NEXTAUTH_URL || 'https://linkedin-copywriter.up.railway.app'}" class="cta">
            Open LinkedIn Copywriter →
        </a>
    </div>

    <div class="footer">
        Sent by ${brandConfig.company.name}
    </div>
</body>
</html>`;

    await transporter.sendMail({
        from: `"LinkedIn Copywriter" <${process.env.GMAIL_USER}>`,
        to: process.env.NOTIFICATION_EMAIL || process.env.GMAIL_USER,
        subject: `🔥 ${highUrgency.length > 0 ? `${highUrgency.length} High-Priority` : trends.length} Content Opportunities Found`,
        html: emailHtml,
    });
}

export async function GET(req: Request) {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const openai = getOpenAI();

        // Gather search results if Google Search is configured
        let searchResults: string[] = [];
        if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_CX) {
            for (const query of SEARCH_QUERIES.slice(0, 3)) {
                const results = await searchWeb(query);
                searchResults.push(...results);
            }
        }

        const searchContext = searchResults.length > 0
            ? `Recent discussions found:\n${searchResults.join('\n\n')}`
            : `Analyze current trends in: conversation intelligence, AI sales coaching, call analytics, revenue intelligence.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: ANALYSIS_PROMPT },
                { role: 'user', content: searchContext }
            ],
            temperature: 0.8,
            max_tokens: 2000,
        });

        let resultText = response.choices[0]?.message?.content?.trim();
        if (!resultText) {
            return new Response('No trends found', { status: 500 });
        }

        // Strip markdown
        if (resultText.startsWith('```json')) resultText = resultText.slice(7);
        else if (resultText.startsWith('```')) resultText = resultText.slice(3);
        if (resultText.endsWith('```')) resultText = resultText.slice(0, -3);
        resultText = resultText.trim();

        let trends;
        try {
            trends = JSON.parse(resultText);
        } catch {
            const jsonMatch = resultText.match(/\[[\s\S]*\]/);
            if (jsonMatch) trends = JSON.parse(jsonMatch[0]);
            else throw new Error('Failed to parse trends');
        }

        // Send email notification
        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
            await sendEmail(trends);
            return Response.json({
                success: true,
                message: `Email sent with ${trends.length} trends`,
                trends
            });
        } else {
            return Response.json({
                success: false,
                message: 'Email not configured - missing GMAIL_USER or GMAIL_APP_PASSWORD',
                trends
            });
        }

    } catch (error) {
        console.error('[cron-scan-trends] Error:', error);
        return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
    }
}
