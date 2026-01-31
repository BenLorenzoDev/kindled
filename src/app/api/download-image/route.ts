import { auth } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: Request) {
    // Authentication check
    const session = await auth();
    if (!session?.user?.email) {
        return new Response("Unauthorized", { status: 401 });
    }

    const allowedUsers = process.env.ALLOWED_USERS?.split(",").map(e => e.trim()) || [];
    if (!allowedUsers.includes(session.user.email)) {
        return new Response("Forbidden", { status: 403 });
    }

    try {
        const url = new URL(req.url);
        const imageUrl = url.searchParams.get('url');

        if (!imageUrl) {
            return new Response("Missing image URL", { status: 400 });
        }

        // Fetch the image from OpenAI's servers
        const response = await fetch(imageUrl);

        if (!response.ok) {
            return new Response("Failed to fetch image", { status: 500 });
        }

        const blob = await response.blob();

        // Return the image with proper headers for download
        return new Response(blob, {
            headers: {
                'Content-Type': 'image/png',
                'Content-Disposition': `attachment; filename="callview-post-image-${Date.now()}.png"`,
            },
        });

    } catch (error) {
        console.error('[download-image] Error:', error);
        return new Response("Error downloading image", { status: 500 });
    }
}
