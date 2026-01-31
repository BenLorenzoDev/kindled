import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { auth } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

interface ScheduledReminder {
    id: string;
    email: string;
    postContent: string;
    postDate: string;
    postTime: string;
    reminderTime: string; // ISO string when to send
    sent: boolean;
    createdAt: number;
}

const REMINDERS_FILE = path.join(process.cwd(), 'data', 'reminders.json');

function ensureDataDir() {
    const dir = path.dirname(REMINDERS_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function loadReminders(): ScheduledReminder[] {
    try {
        ensureDataDir();
        if (fs.existsSync(REMINDERS_FILE)) {
            return JSON.parse(fs.readFileSync(REMINDERS_FILE, 'utf-8'));
        }
    } catch (error) {
        console.error('Error loading reminders:', error);
    }
    return [];
}

function saveReminders(reminders: ScheduledReminder[]) {
    ensureDataDir();
    fs.writeFileSync(REMINDERS_FILE, JSON.stringify(reminders, null, 2));
}

// POST - Schedule a new reminder
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { postContent, postDate, postTime, reminderMinutesBefore, email } = await req.json();

        if (!postContent || !postDate || !postTime || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Calculate reminder time
        const postDateTime = new Date(`${postDate}T${postTime}`);
        const reminderTime = new Date(postDateTime.getTime() - (reminderMinutesBefore || 60) * 60 * 1000);

        // If reminder time is in the past, send immediately
        if (reminderTime <= new Date()) {
            return await sendReminderEmail(email, postContent, postDate, postTime);
        }

        // Schedule the reminder
        const reminder: ScheduledReminder = {
            id: `reminder-${Date.now()}`,
            email,
            postContent,
            postDate,
            postTime,
            reminderTime: reminderTime.toISOString(),
            sent: false,
            createdAt: Date.now(),
        };

        const reminders = loadReminders();
        reminders.push(reminder);
        saveReminders(reminders);

        return NextResponse.json({
            success: true,
            message: `Reminder scheduled for ${reminderTime.toLocaleString()}`,
            reminderId: reminder.id,
        });
    } catch (error) {
        console.error('Error scheduling reminder:', error);
        return NextResponse.json({ error: 'Failed to schedule reminder' }, { status: 500 });
    }
}

// GET - Process due reminders (called by cron)
export async function GET(req: NextRequest) {
    // Verify cron secret for security
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const reminders = loadReminders();
        const now = new Date();
        let sentCount = 0;

        for (const reminder of reminders) {
            if (reminder.sent) continue;

            const reminderTime = new Date(reminder.reminderTime);
            if (reminderTime <= now) {
                // Send the reminder
                await sendReminderEmail(
                    reminder.email,
                    reminder.postContent,
                    reminder.postDate,
                    reminder.postTime
                );
                reminder.sent = true;
                sentCount++;
            }
        }

        // Clean up old sent reminders (older than 7 days)
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const activeReminders = reminders.filter(r => !r.sent || r.createdAt > weekAgo);
        saveReminders(activeReminders);

        return NextResponse.json({
            success: true,
            processed: sentCount,
            pending: activeReminders.filter(r => !r.sent).length,
        });
    } catch (error) {
        console.error('Error processing reminders:', error);
        return NextResponse.json({ error: 'Failed to process reminders' }, { status: 500 });
    }
}

// DELETE - Cancel a reminder
export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { reminderId } = await req.json();

        const reminders = loadReminders();
        const filtered = reminders.filter(r => r.id !== reminderId);
        saveReminders(filtered);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error canceling reminder:', error);
        return NextResponse.json({ error: 'Failed to cancel reminder' }, { status: 500 });
    }
}

async function sendReminderEmail(email: string, postContent: string, postDate: string, postTime: string) {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
        console.log('Resend not configured - logging reminder instead');
        console.log(`REMINDER: Post scheduled for ${postDate} at ${postTime}`);
        console.log(`Content: ${postContent.substring(0, 100)}...`);
        return NextResponse.json({ success: true, message: 'Reminder logged (email not configured)' });
    }

    const resend = new Resend(resendApiKey);

    const formattedDate = new Date(`${postDate}T${postTime}`).toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .post-preview { background: #f9fafb; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #6366f1; }
        .time-badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 15px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; background: #f9fafb; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">📅 Time to Post!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your scheduled LinkedIn post is ready</p>
        </div>
        <div class="content">
            <p>Hey there! 👋</p>
            <p>This is your reminder that you have a LinkedIn post scheduled:</p>

            <div class="time-badge">
                🕐 ${formattedDate}
            </div>

            <div class="post-preview">
                <strong>Your Post:</strong>
                <p style="white-space: pre-wrap; margin-top: 10px;">${postContent}</p>
            </div>

            <p><strong>Quick tips for maximum engagement:</strong></p>
            <ul>
                <li>Post when your audience is most active</li>
                <li>Engage with comments in the first hour</li>
                <li>Share to relevant groups</li>
            </ul>

            <center>
                <a href="https://www.linkedin.com" class="cta-button">Open LinkedIn →</a>
            </center>
        </div>
        <div class="footer">
            LinkedIn Copywriter - Your AI Content Partner<br>
            <small>You're receiving this because you scheduled a post reminder.</small>
        </div>
    </div>
</body>
</html>
`;

    try {
        const result = await resend.emails.send({
            from: 'LinkedIn Copywriter <onboarding@resend.dev>',
            to: email,
            subject: `📅 Reminder: Time to post on LinkedIn!`,
            html: emailHtml,
        });

        console.log('Reminder email sent:', result);
        return NextResponse.json({ success: true, message: 'Reminder sent!' });
    } catch (error) {
        console.error('Failed to send reminder email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
