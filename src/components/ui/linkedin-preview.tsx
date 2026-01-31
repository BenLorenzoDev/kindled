'use client';

import { cn } from '@/lib/utils';
import { ThumbsUp, MessageCircle, Repeat2, Send } from 'lucide-react';

interface LinkedInPreviewProps {
    content: string;
    isDark?: boolean;
    onClose: () => void;
    imageUrl?: string;
    authorName?: string;
    authorTitle?: string;
}

export function LinkedInPreview({
    content,
    isDark = false,
    onClose,
    imageUrl,
    authorName = "Your Name",
    authorTitle = "Your Title • Just now"
}: LinkedInPreviewProps) {
    const charCount = content.length;
    const isOverLimit = charCount > 3000;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <div
                className={cn(
                    "w-full max-w-lg rounded-lg shadow-xl overflow-hidden",
                    isDark ? "bg-neutral-800" : "bg-white"
                )}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={cn(
                    "p-4 border-b",
                    isDark ? "border-neutral-700" : "border-gray-200"
                )}>
                    <div className="flex items-center gap-3">
                        <img
                            src="/profile.gif"
                            alt={authorName}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <div className={cn(
                                "font-semibold",
                                isDark ? "text-neutral-100" : "text-gray-900"
                            )}>
                                {authorName}
                            </div>
                            <div className={cn(
                                "text-xs",
                                isDark ? "text-neutral-400" : "text-gray-500"
                            )}>
                                {authorTitle}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className={cn(
                    "p-4 max-h-60 overflow-y-auto",
                    isDark ? "text-neutral-200" : "text-gray-800"
                )}>
                    <div className="whitespace-pre-wrap text-[14px] leading-relaxed">
                        {content}
                    </div>
                </div>

                {/* Post Image */}
                {imageUrl && (
                    <div className="w-full">
                        <img
                            src={imageUrl}
                            alt="Post image"
                            className="w-full object-cover max-h-72"
                        />
                    </div>
                )}

                {/* Character count */}
                <div className={cn(
                    "px-4 py-2 text-xs",
                    isOverLimit ? "text-red-500" : isDark ? "text-neutral-500" : "text-gray-400"
                )}>
                    {charCount.toLocaleString()} / 3,000 characters
                    {isOverLimit && " (over limit!)"}
                </div>

                {/* Engagement bar */}
                <div className={cn(
                    "px-4 py-3 border-t flex items-center justify-around",
                    isDark ? "border-neutral-700" : "border-gray-200"
                )}>
                    <button className={cn(
                        "flex items-center gap-2 text-sm",
                        isDark ? "text-neutral-400 hover:text-neutral-200" : "text-gray-500 hover:text-gray-700"
                    )}>
                        <ThumbsUp size={18} />
                        Like
                    </button>
                    <button className={cn(
                        "flex items-center gap-2 text-sm",
                        isDark ? "text-neutral-400 hover:text-neutral-200" : "text-gray-500 hover:text-gray-700"
                    )}>
                        <MessageCircle size={18} />
                        Comment
                    </button>
                    <button className={cn(
                        "flex items-center gap-2 text-sm",
                        isDark ? "text-neutral-400 hover:text-neutral-200" : "text-gray-500 hover:text-gray-700"
                    )}>
                        <Repeat2 size={18} />
                        Repost
                    </button>
                    <button className={cn(
                        "flex items-center gap-2 text-sm",
                        isDark ? "text-neutral-400 hover:text-neutral-200" : "text-gray-500 hover:text-gray-700"
                    )}>
                        <Send size={18} />
                        Send
                    </button>
                </div>

                {/* Close button */}
                <div className={cn(
                    "p-3 border-t",
                    isDark ? "border-neutral-700" : "border-gray-200"
                )}>
                    <button
                        onClick={onClose}
                        className={cn(
                            "w-full py-2 text-sm font-medium rounded-lg transition-colors",
                            isDark
                                ? "bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
}
