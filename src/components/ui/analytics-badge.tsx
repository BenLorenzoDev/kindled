'use client';

import { cn } from '@/lib/utils';
import { FileText, Type } from 'lucide-react';

interface AnalyticsBadgeProps {
    postsGenerated: number;
    wordsWritten: number;
    isDark?: boolean;
}

export function AnalyticsBadge({ postsGenerated, wordsWritten, isDark = false }: AnalyticsBadgeProps) {
    return (
        <div className={cn(
            "flex items-center gap-4 text-xs",
            isDark ? "text-neutral-500" : "text-stone-400"
        )}>
            <div className="flex items-center gap-1.5">
                <FileText size={12} />
                <span>{postsGenerated} posts</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Type size={12} />
                <span>{wordsWritten.toLocaleString()} words</span>
            </div>
        </div>
    );
}
