import { auth } from '@/lib/auth';
import { extractText } from 'unpdf';

export const runtime = 'nodejs';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mammoth = require('mammoth');

async function parsePDF(buffer: Buffer): Promise<string> {
    const uint8Array = new Uint8Array(buffer);
    const { text } = await extractText(uint8Array);
    return Array.isArray(text) ? text.join('\n') : String(text);
}

async function parseDOCX(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
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
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return new Response("No file provided", { status: 400 });
        }

        const fileName = file.name.toLowerCase();
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        let text = '';

        if (fileName.endsWith('.pdf')) {
            text = await parsePDF(buffer);
        } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
            text = await parseDOCX(buffer);
        } else if (fileName.endsWith('.txt')) {
            text = buffer.toString('utf-8');
        } else {
            return new Response("Unsupported file type. Please upload PDF, DOC, DOCX, or TXT", { status: 400 });
        }

        // Clean up the text
        text = text
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        if (!text || text.length < 50) {
            return new Response("Could not extract enough text from the file", { status: 400 });
        }

        return Response.json({
            text,
            fileName: file.name,
            fileSize: file.size,
            charCount: text.length
        });

    } catch (error) {
        console.error('[parse-resume] Error:', error);
        return new Response("Error parsing resume file", { status: 500 });
    }
}
