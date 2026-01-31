'use client';

import { useEffect } from 'react';

export default function PitchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        // Override the body overflow for pitch page
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';

        return () => {
            // Reset when leaving pitch page
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
        };
    }, []);

    return <>{children}</>;
}
