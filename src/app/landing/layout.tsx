'use client';

import { useEffect } from 'react';

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        // Override the body overflow for landing page
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';

        return () => {
            // Reset when leaving landing page
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
        };
    }, []);

    return <>{children}</>;
}
