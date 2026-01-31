import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import OpenAI from 'openai';

function getOpenAIClient() {
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    link: string;
    description: string;
    salary?: string;
    postedDate: string;
    receivedAt: string;
    score?: number;
    scoreReason?: string;
    status: 'new' | 'interested' | 'applied' | 'rejected' | 'archived';
    keywords: string[];
}

interface JobsData {
    jobs: Job[];
    keywords: string[];
    lastUpdated: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');

async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

async function getJobsData(): Promise<JobsData> {
    try {
        await ensureDataDir();
        const data = await fs.readFile(JOBS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return { jobs: [], keywords: [], lastUpdated: new Date().toISOString() };
    }
}

async function saveJobsData(data: JobsData): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(JOBS_FILE, JSON.stringify(data, null, 2));
}

function parseLinkedInEmail(emailBody: string, emailSubject: string): Partial<Job>[] {
    const jobs: Partial<Job>[] = [];

    // LinkedIn job alert emails typically have patterns like:
    // "Job Title" at "Company" - Location
    // Or structured HTML with job cards

    // Try to extract from subject line first (often contains main job)
    const subjectMatch = emailSubject.match(/^(.+?)\s+(?:at|@)\s+(.+?)(?:\s*[-–]\s*(.+))?$/i);
    if (subjectMatch) {
        jobs.push({
            title: subjectMatch[1].trim(),
            company: subjectMatch[2].trim(),
            location: subjectMatch[3]?.trim() || 'Remote',
        });
    }

    // Extract job listings from email body
    // Pattern 1: "Title\nCompany · Location"
    const jobPattern1 = /([A-Z][^\n]{5,80})\n([A-Za-z0-9\s&.,]+)\s*[·•]\s*([^\n]+)/g;
    let match;
    while ((match = jobPattern1.exec(emailBody)) !== null) {
        const title = match[1].trim();
        // Skip if it looks like a header or navigation
        if (!title.toLowerCase().includes('view') &&
            !title.toLowerCase().includes('click') &&
            !title.toLowerCase().includes('unsubscribe')) {
            jobs.push({
                title,
                company: match[2].trim(),
                location: match[3].trim(),
            });
        }
    }

    // Pattern 2: Look for LinkedIn job URLs and nearby text
    const urlPattern = /https:\/\/www\.linkedin\.com\/jobs\/view\/(\d+)/g;
    const urls: string[] = [];
    while ((match = urlPattern.exec(emailBody)) !== null) {
        urls.push(match[0]);
    }

    // If we found URLs but no jobs yet, create entries for them
    if (jobs.length === 0 && urls.length > 0) {
        urls.forEach((url, index) => {
            jobs.push({
                title: `Job Opportunity ${index + 1}`,
                company: 'See LinkedIn',
                location: 'See LinkedIn',
                link: url,
            });
        });
    }

    // Add URLs to jobs that don't have them
    jobs.forEach((job, index) => {
        if (!job.link && urls[index]) {
            job.link = urls[index];
        }
    });

    return jobs;
}

async function scoreJob(job: Partial<Job>, keywords: string[]): Promise<{ score: number; reason: string }> {
    if (keywords.length === 0) {
        return { score: 50, reason: 'No keywords set for matching' };
    }

    try {
        const response = await getOpenAIClient().chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a job matching assistant. Score how well a job matches the user's target keywords/skills on a scale of 0-100. Be concise.`
                },
                {
                    role: 'user',
                    content: `Job: ${job.title} at ${job.company} (${job.location})
${job.description ? `Description: ${job.description}` : ''}

User's target keywords/skills: ${keywords.join(', ')}

Rate match 0-100 and explain in 1 sentence why.
Format: SCORE: [number] | REASON: [explanation]`
                }
            ],
            max_tokens: 100,
            temperature: 0.3,
        });

        const result = response.choices[0]?.message?.content || '';
        const scoreMatch = result.match(/SCORE:\s*(\d+)/i);
        const reasonMatch = result.match(/REASON:\s*(.+)/i);

        return {
            score: scoreMatch ? parseInt(scoreMatch[1]) : 50,
            reason: reasonMatch ? reasonMatch[1].trim() : 'Unable to analyze',
        };
    } catch (error) {
        console.error('Error scoring job:', error);
        // Fallback: simple keyword matching
        const jobText = `${job.title} ${job.company} ${job.description || ''}`.toLowerCase();
        const matchedKeywords = keywords.filter(kw => jobText.includes(kw.toLowerCase()));
        const score = Math.round((matchedKeywords.length / keywords.length) * 100);
        return {
            score,
            reason: matchedKeywords.length > 0
                ? `Matches: ${matchedKeywords.join(', ')}`
                : 'No keyword matches found',
        };
    }
}

// POST - Receive job alert from Power Automate webhook
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Expected format from Power Automate:
        // { subject: string, body: string, receivedAt: string }
        const { subject, body: emailBody, receivedAt } = body;

        if (!subject && !emailBody) {
            return NextResponse.json(
                { error: 'Missing email subject or body' },
                { status: 400 }
            );
        }

        const jobsData = await getJobsData();
        const parsedJobs = parseLinkedInEmail(emailBody || '', subject || '');

        if (parsedJobs.length === 0) {
            return NextResponse.json({
                message: 'No jobs found in email',
                processed: 0,
            });
        }

        const newJobs: Job[] = [];

        for (const parsedJob of parsedJobs) {
            // Check for duplicates by title + company
            const isDuplicate = jobsData.jobs.some(
                existing =>
                    existing.title.toLowerCase() === parsedJob.title?.toLowerCase() &&
                    existing.company.toLowerCase() === parsedJob.company?.toLowerCase()
            );

            if (isDuplicate) continue;

            // Score the job
            const { score, reason } = await scoreJob(parsedJob, jobsData.keywords);

            const job: Job = {
                id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: parsedJob.title || 'Unknown Position',
                company: parsedJob.company || 'Unknown Company',
                location: parsedJob.location || 'Not specified',
                link: parsedJob.link || '',
                description: parsedJob.description || '',
                salary: parsedJob.salary,
                postedDate: new Date().toISOString(),
                receivedAt: receivedAt || new Date().toISOString(),
                score,
                scoreReason: reason,
                status: 'new',
                keywords: jobsData.keywords.filter(kw =>
                    `${parsedJob.title} ${parsedJob.company} ${parsedJob.description || ''}`
                        .toLowerCase()
                        .includes(kw.toLowerCase())
                ),
            };

            newJobs.push(job);
            jobsData.jobs.unshift(job); // Add to beginning
        }

        jobsData.lastUpdated = new Date().toISOString();
        await saveJobsData(jobsData);

        return NextResponse.json({
            message: 'Jobs processed successfully',
            processed: newJobs.length,
            jobs: newJobs,
        });
    } catch (error) {
        console.error('Error processing job alert:', error);
        return NextResponse.json(
            { error: 'Failed to process job alert' },
            { status: 500 }
        );
    }
}

// GET - Retrieve all jobs
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const minScore = searchParams.get('minScore');

        const jobsData = await getJobsData();
        let jobs = jobsData.jobs;

        // Filter by status
        if (status && status !== 'all') {
            jobs = jobs.filter(job => job.status === status);
        }

        // Filter by minimum score
        if (minScore) {
            const min = parseInt(minScore);
            jobs = jobs.filter(job => (job.score || 0) >= min);
        }

        return NextResponse.json({
            jobs,
            keywords: jobsData.keywords,
            total: jobsData.jobs.length,
            lastUpdated: jobsData.lastUpdated,
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch jobs' },
            { status: 500 }
        );
    }
}

// PATCH - Update job status or keywords
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { jobId, status, keywords } = body;

        const jobsData = await getJobsData();

        // Update keywords if provided
        if (keywords !== undefined) {
            jobsData.keywords = keywords;

            // Re-score all jobs with new keywords
            for (const job of jobsData.jobs) {
                const { score, reason } = await scoreJob(job, keywords);
                job.score = score;
                job.scoreReason = reason;
                job.keywords = keywords.filter((kw: string) =>
                    `${job.title} ${job.company} ${job.description}`
                        .toLowerCase()
                        .includes(kw.toLowerCase())
                );
            }
        }

        // Update job status if provided
        if (jobId && status) {
            const job = jobsData.jobs.find(j => j.id === jobId);
            if (job) {
                job.status = status;
            }
        }

        jobsData.lastUpdated = new Date().toISOString();
        await saveJobsData(jobsData);

        return NextResponse.json({
            message: 'Updated successfully',
            keywords: jobsData.keywords,
        });
    } catch (error) {
        console.error('Error updating:', error);
        return NextResponse.json(
            { error: 'Failed to update' },
            { status: 500 }
        );
    }
}

// DELETE - Remove a job
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const jobId = searchParams.get('jobId');

        if (!jobId) {
            return NextResponse.json(
                { error: 'Job ID required' },
                { status: 400 }
            );
        }

        const jobsData = await getJobsData();
        jobsData.jobs = jobsData.jobs.filter(j => j.id !== jobId);
        jobsData.lastUpdated = new Date().toISOString();
        await saveJobsData(jobsData);

        return NextResponse.json({ message: 'Job deleted' });
    } catch (error) {
        console.error('Error deleting job:', error);
        return NextResponse.json(
            { error: 'Failed to delete job' },
            { status: 500 }
        );
    }
}
