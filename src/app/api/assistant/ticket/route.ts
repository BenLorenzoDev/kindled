import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface TicketData {
    email: string;
    subject: string;
    description: string;
    category: 'bug' | 'feature' | 'question' | 'billing' | 'other';
    priority: 'low' | 'medium' | 'high';
    conversationHistory?: Array<{ role: string; content: string }>;
    userAgent?: string;
    timestamp: string;
}

export async function POST(req: NextRequest) {
    try {
        const data: TicketData = await req.json();

        const { email, subject, description, category, priority, conversationHistory } = data;

        // Generate ticket ID
        const ticketId = `PP-${Date.now().toString(36).toUpperCase()}`;

        // Log the ticket (always do this for backup)
        console.log('=== NEW SUPPORT TICKET ===');
        console.log('Ticket ID:', ticketId);
        console.log('From:', email);
        console.log('Category:', category);
        console.log('Priority:', priority);
        console.log('Subject:', subject);
        console.log('Description:', description);
        if (conversationHistory && conversationHistory.length > 0) {
            console.log('Conversation History:', JSON.stringify(conversationHistory, null, 2));
        }
        console.log('=== END TICKET ===');

        // Check if Resend is configured
        const resendConfigured = !!process.env.RESEND_API_KEY;
        const supportEmail = process.env.SUPPORT_EMAIL || 'support@postpipeline.ai';

        if (resendConfigured) {
            const resend = new Resend(process.env.RESEND_API_KEY);

            console.log('Resend configured, sending emails...');

            // Email to support team
            const supportEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; }
        .value { margin-top: 5px; padding: 10px; background: white; border-radius: 5px; border: 1px solid #e5e7eb; }
        .priority-high { border-left: 4px solid #ef4444; }
        .priority-medium { border-left: 4px solid #f59e0b; }
        .priority-low { border-left: 4px solid #10b981; }
        .conversation { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .conversation-msg { padding: 10px; margin: 10px 0; border-radius: 8px; }
        .user-msg { background: #dbeafe; }
        .assistant-msg { background: white; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">🎫 New Support Ticket</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Ticket ID: ${ticketId}</p>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">Priority</div>
                <div class="value priority-${priority}">
                    ${priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢'} ${priority.toUpperCase()}
                </div>
            </div>
            <div class="field">
                <div class="label">Category</div>
                <div class="value">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
            </div>
            <div class="field">
                <div class="label">From</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            <div class="field">
                <div class="label">Subject</div>
                <div class="value"><strong>${subject}</strong></div>
            </div>
            <div class="field">
                <div class="label">Description</div>
                <div class="value">${description.replace(/\n/g, '<br>')}</div>
            </div>
            ${conversationHistory && conversationHistory.length > 0 ? `
            <div class="conversation">
                <div class="label">💬 Chat History</div>
                ${conversationHistory.map(msg => `
                    <div class="conversation-msg ${msg.role === 'user' ? 'user-msg' : 'assistant-msg'}">
                        <strong>${msg.role === 'user' ? '👤 User' : '🤖 Pip'}</strong><br>
                        ${msg.content.replace(/\n/g, '<br>')}
                    </div>
                `).join('')}
            </div>
            ` : ''}
            <div class="field" style="margin-top: 20px;">
                <div class="label">Submitted</div>
                <div class="value">${new Date(data.timestamp).toLocaleString()}</div>
            </div>
        </div>
        <div class="footer">
            PostPipeline Support System
        </div>
    </div>
</body>
</html>
`;

            // Email to user (confirmation)
            const userEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .ticket-box { background: #f3f4f6; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .ticket-id { font-size: 24px; font-weight: bold; color: #2563eb; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; background: #f9fafb; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">✅ Ticket Received!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">We've got your message</p>
        </div>
        <div class="content">
            <p>Hi there! 👋</p>
            <p>Thanks for reaching out to PostPipeline support. We've received your ticket and our team will get back to you within 24 hours.</p>

            <div class="ticket-box">
                <div style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Your Ticket ID</div>
                <div class="ticket-id">${ticketId}</div>
            </div>

            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Category:</strong> ${category.charAt(0).toUpperCase() + category.slice(1)}</p>

            <p style="margin-top: 30px;">In the meantime, you might find these helpful:</p>
            <ul>
                <li>Check out our features guide in the app</li>
                <li>Chat with Pip (our AI assistant) for quick answers</li>
            </ul>

            <p>Best,<br>The PostPipeline Team</p>
        </div>
        <div class="footer">
            © ${new Date().getFullYear()} PostPipeline. All rights reserved.<br>
            <a href="mailto:support@postpipeline.ai" style="color: #2563eb;">support@postpipeline.ai</a>
        </div>
    </div>
</body>
</html>
`;

            try {
                // Send email to support
                console.log('Sending to support:', supportEmail);
                const supportResult = await resend.emails.send({
                    from: 'PostPipeline <onboarding@resend.dev>',
                    to: supportEmail,
                    subject: `[${ticketId}] ${priority === 'high' ? '🔴 URGENT: ' : ''}${subject}`,
                    html: supportEmailHtml,
                    replyTo: email,
                });
                console.log('Support email result:', supportResult);

                // Send confirmation to user
                console.log('Sending confirmation to:', email);
                const userResult = await resend.emails.send({
                    from: 'PostPipeline <onboarding@resend.dev>',
                    to: email,
                    subject: `[${ticketId}] We received your support request`,
                    html: userEmailHtml,
                });
                console.log('User email result:', userResult);

                console.log('All emails sent successfully for ticket:', ticketId);
            } catch (emailError: unknown) {
                const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown error';
                console.error('EMAIL ERROR:', errorMessage);
                console.error('Full error:', emailError);
            }
        } else {
            console.log('Resend not configured (RESEND_API_KEY missing) - ticket logged to console only');
        }

        return NextResponse.json({
            success: true,
            ticketId,
            message: `Your ticket (${ticketId}) has been submitted! ${resendConfigured ? 'Check your email for confirmation.' : 'Our team will review it shortly.'}`,
        });
    } catch (error) {
        console.error('Ticket submission error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to submit ticket. Please try again or email us directly at support@postpipeline.ai'
            },
            { status: 500 }
        );
    }
}
