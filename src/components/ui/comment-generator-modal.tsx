'use client';

import { cn } from '@/lib/utils';
import { X, Loader2, MessageCircle, Copy, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface CommentResult {
    style: string;
    comment: string;
    engagement_score: number;
}

interface CommentGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDark?: boolean;
}

export function CommentGeneratorModal({ isOpen, onClose, isDark = false }: CommentGeneratorModalProps) {
    const [postContent, setPostContent] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [yourContext, setYourContext] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState<CommentResult[] | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        if (!postContent.trim()) return;

        setIsLoading(true);
        setError(null);
        setComments(null);

        try {
            const response = await fetch('/api/generate-comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postContent: postContent.trim(),
                    authorName: authorName.trim() || undefined,
                    yourContext: yourContext.trim() || undefined,
                }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();
            setComments(data.comments);
        } catch (err) {
            console.error('Comment generation failed:', err);
            setError(err instanceof Error ? err.message : 'Failed to generate comments');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async (index: number, comment: string) => {
        await navigator.clipboard.writeText(comment);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleClose = () => {
        setPostContent('');
        setAuthorName('');
        setYourContext('');
        setComments(null);
        setError(null);
        onClose();
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500 bg-green-500/10';
        if (score >= 60) return 'text-blue-500 bg-blue-500/10';
        return 'text-yellow-500 bg-yellow-500/10';
    };

    const getStyleColor = (style: string) => {
        switch (style) {
            case 'Insight Adder': return isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700';
            case 'Thoughtful Question': return isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700';
            case 'Agreeable Challenger': return isDark ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-700';
            case 'Story Connector': return isDark ? 'bg-pink-900/50 text-pink-300' : 'bg-pink-100 text-pink-700';
            case 'Value Amplifier': return isDark ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700';
            default: return isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
            <div
                className={cn(
                    "w-full max-w-3xl rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col",
                    isDark ? "bg-neutral-800" : "bg-white"
                )}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={cn(
                    "p-4 border-b flex items-center justify-between",
                    isDark ? "border-neutral-700" : "border-gray-200"
                )}>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                            <MessageCircle size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className={cn(
                                "text-lg font-semibold",
                                isDark ? "text-neutral-100" : "text-gray-900"
                            )}>
                                Comment Generator
                            </h2>
                            <p className={cn(
                                "text-xs",
                                isDark ? "text-neutral-400" : "text-gray-500"
                            )}>
                                Generate thoughtful comments to boost your visibility
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className={cn(
                            "p-1.5 rounded-lg transition-colors",
                            isDark ? "hover:bg-neutral-700 text-neutral-400" : "hover:bg-gray-100 text-gray-500"
                        )}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {!comments ? (
                        <div className="space-y-4">
                            {/* Post Content Input */}
                            <div>
                                <label className={cn(
                                    "block text-sm font-medium mb-2",
                                    isDark ? "text-neutral-300" : "text-gray-700"
                                )}>
                                    Paste the LinkedIn post you want to comment on
                                </label>
                                <textarea
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    placeholder="Paste the post content here..."
                                    rows={6}
                                    className={cn(
                                        "w-full rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2",
                                        isDark
                                            ? "bg-neutral-700 border border-neutral-600 text-neutral-100 placeholder:text-neutral-500 focus:ring-cyan-500"
                                            : "bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-cyan-500"
                                    )}
                                />
                            </div>

                            {/* Optional Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={cn(
                                        "block text-sm font-medium mb-2",
                                        isDark ? "text-neutral-300" : "text-gray-700"
                                    )}>
                                        Author name (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={authorName}
                                        onChange={(e) => setAuthorName(e.target.value)}
                                        placeholder="e.g., John Smith"
                                        className={cn(
                                            "w-full rounded-lg p-3 text-sm focus:outline-none focus:ring-2",
                                            isDark
                                                ? "bg-neutral-700 border border-neutral-600 text-neutral-100 placeholder:text-neutral-500 focus:ring-cyan-500"
                                                : "bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-cyan-500"
                                        )}
                                    />
                                </div>
                                <div>
                                    <label className={cn(
                                        "block text-sm font-medium mb-2",
                                        isDark ? "text-neutral-300" : "text-gray-700"
                                    )}>
                                        Your context (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={yourContext}
                                        onChange={(e) => setYourContext(e.target.value)}
                                        placeholder="e.g., Sales leader at SaaS company"
                                        className={cn(
                                            "w-full rounded-lg p-3 text-sm focus:outline-none focus:ring-2",
                                            isDark
                                                ? "bg-neutral-700 border border-neutral-600 text-neutral-100 placeholder:text-neutral-500 focus:ring-cyan-500"
                                                : "bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-cyan-500"
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Tips */}
                            <div className={cn(
                                "p-3 rounded-lg text-xs",
                                isDark ? "bg-cyan-900/20 text-cyan-300" : "bg-cyan-50 text-cyan-700"
                            )}>
                                <Sparkles size={14} className="inline mr-1" />
                                <strong>Pro tip:</strong> Adding your context helps generate comments that naturally lead to conversations about what you do.
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={!postContent.trim() || isLoading}
                                className={cn(
                                    "w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                                    !postContent.trim() || isLoading
                                        ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
                                        : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
                                )}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Generating Comments...
                                    </>
                                ) : (
                                    <>
                                        <MessageCircle size={18} />
                                        Generate 5 Comments
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Results Header */}
                            <div className="flex items-center justify-between">
                                <h3 className={cn(
                                    "text-sm font-semibold",
                                    isDark ? "text-neutral-200" : "text-gray-800"
                                )}>
                                    Generated Comments
                                </h3>
                                <button
                                    onClick={() => setComments(null)}
                                    className={cn(
                                        "text-xs px-3 py-1.5 rounded-lg transition-colors",
                                        isDark
                                            ? "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700"
                                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    Generate More
                                </button>
                            </div>

                            {/* Comment Cards */}
                            {comments.map((item, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "p-4 rounded-lg border",
                                        isDark ? "bg-neutral-700/50 border-neutral-600" : "bg-gray-50 border-gray-200"
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-xs px-2 py-1 rounded-full font-medium",
                                                getStyleColor(item.style)
                                            )}>
                                                {item.style}
                                            </span>
                                            <span className={cn(
                                                "text-xs px-2 py-1 rounded-full font-medium",
                                                getScoreColor(item.engagement_score)
                                            )}>
                                                {item.engagement_score}% likely to get a reply
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(index, item.comment)}
                                            className={cn(
                                                "text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors",
                                                copiedIndex === index
                                                    ? "text-green-500"
                                                    : isDark
                                                        ? "text-neutral-400 hover:text-neutral-200"
                                                        : "text-gray-500 hover:text-gray-700"
                                            )}
                                        >
                                            {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />}
                                            {copiedIndex === index ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                    <p className={cn(
                                        "text-sm leading-relaxed",
                                        isDark ? "text-neutral-200" : "text-gray-700"
                                    )}>
                                        {item.comment}
                                    </p>
                                </div>
                            ))}

                            {/* Try Another Button */}
                            <button
                                onClick={() => setComments(null)}
                                className={cn(
                                    "w-full py-2.5 rounded-lg font-medium transition-colors",
                                    isDark
                                        ? "bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                )}
                            >
                                Try Different Post
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
