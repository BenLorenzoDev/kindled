'use client';

import { cn } from '@/lib/utils';
import { X, Loader2, Zap, Copy, Check, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface ViralAnalysis {
    hookType: string;
    emotionalTriggers: string[];
    whyItWorked: string;
}

interface ViralHackerResult {
    viralAnalysis: ViralAnalysis;
    rewrittenPost: string;
    predictedEngagement: string;
}

interface ViralHackerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUsePost: (content: string) => void;
    isDark?: boolean;
}

export function ViralHackerModal({ isOpen, onClose, onUsePost, isDark = false }: ViralHackerModalProps) {
    const [viralPost, setViralPost] = useState('');
    const [comments, setComments] = useState('');
    const [likes, setLikes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ViralHackerResult | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleAnalyze = async () => {
        if (!viralPost.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/viral-hacker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    viralPost: viralPost.trim(),
                    comments: comments ? parseInt(comments) : undefined,
                    likes: likes ? parseInt(likes) : undefined,
                }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error('Viral hacker failed:', err);
            setError(err instanceof Error ? err.message : 'Failed to analyze post');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!result) return;
        await navigator.clipboard.writeText(result.rewrittenPost);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUsePost = () => {
        if (!result) return;
        onUsePost(result.rewrittenPost);
        onClose();
    };

    const handleClose = () => {
        setViralPost('');
        setComments('');
        setLikes('');
        setResult(null);
        setError(null);
        onClose();
    };

    const getEngagementColor = (engagement: string) => {
        switch (engagement.toLowerCase()) {
            case 'viral': return 'text-green-500 bg-green-500/10';
            case 'very high': return 'text-blue-500 bg-blue-500/10';
            default: return 'text-yellow-500 bg-yellow-500/10';
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
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                            <Zap size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className={cn(
                                "text-lg font-semibold",
                                isDark ? "text-neutral-100" : "text-gray-900"
                            )}>
                                Viral Post Hacker
                            </h2>
                            <p className={cn(
                                "text-xs",
                                isDark ? "text-neutral-400" : "text-gray-500"
                            )}>
                                Reverse-engineer viral posts and make them yours
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
                    {!result ? (
                        <div className="space-y-4">
                            {/* Viral Post Input */}
                            <div>
                                <label className={cn(
                                    "block text-sm font-medium mb-2",
                                    isDark ? "text-neutral-300" : "text-gray-700"
                                )}>
                                    Paste the viral LinkedIn post
                                </label>
                                <textarea
                                    value={viralPost}
                                    onChange={(e) => setViralPost(e.target.value)}
                                    placeholder="Paste the viral post content here..."
                                    rows={8}
                                    className={cn(
                                        "w-full rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2",
                                        isDark
                                            ? "bg-neutral-700 border border-neutral-600 text-neutral-100 placeholder:text-neutral-500 focus:ring-purple-500"
                                            : "bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-purple-500"
                                    )}
                                />
                            </div>

                            {/* Engagement Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={cn(
                                        "block text-sm font-medium mb-2",
                                        isDark ? "text-neutral-300" : "text-gray-700"
                                    )}>
                                        Comments (optional)
                                    </label>
                                    <input
                                        type="number"
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        placeholder="e.g., 500"
                                        className={cn(
                                            "w-full rounded-lg p-3 text-sm focus:outline-none focus:ring-2",
                                            isDark
                                                ? "bg-neutral-700 border border-neutral-600 text-neutral-100 placeholder:text-neutral-500 focus:ring-purple-500"
                                                : "bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-purple-500"
                                        )}
                                    />
                                </div>
                                <div>
                                    <label className={cn(
                                        "block text-sm font-medium mb-2",
                                        isDark ? "text-neutral-300" : "text-gray-700"
                                    )}>
                                        Likes (optional)
                                    </label>
                                    <input
                                        type="number"
                                        value={likes}
                                        onChange={(e) => setLikes(e.target.value)}
                                        placeholder="e.g., 5000"
                                        className={cn(
                                            "w-full rounded-lg p-3 text-sm focus:outline-none focus:ring-2",
                                            isDark
                                                ? "bg-neutral-700 border border-neutral-600 text-neutral-100 placeholder:text-neutral-500 focus:ring-purple-500"
                                                : "bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-purple-500"
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Analyze Button */}
                            <button
                                onClick={handleAnalyze}
                                disabled={!viralPost.trim() || isLoading}
                                className={cn(
                                    "w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                                    !viralPost.trim() || isLoading
                                        ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
                                        : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                                )}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Analyzing & Rewriting...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={18} />
                                        Hack This Post
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Viral Analysis */}
                            <div className={cn(
                                "p-4 rounded-lg",
                                isDark ? "bg-neutral-700/50" : "bg-purple-50"
                            )}>
                                <h3 className={cn(
                                    "text-sm font-semibold mb-3 flex items-center gap-2",
                                    isDark ? "text-purple-400" : "text-purple-700"
                                )}>
                                    <TrendingUp size={16} />
                                    Why This Post Went Viral
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={cn(
                                            "text-xs px-2 py-1 rounded-full font-medium",
                                            isDark ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-700"
                                        )}>
                                            Hook: {result.viralAnalysis.hookType}
                                        </span>
                                        {result.viralAnalysis.emotionalTriggers.map((trigger, i) => (
                                            <span key={i} className={cn(
                                                "text-xs px-2 py-1 rounded-full",
                                                isDark ? "bg-pink-900/50 text-pink-300" : "bg-pink-100 text-pink-700"
                                            )}>
                                                {trigger}
                                            </span>
                                        ))}
                                    </div>
                                    <p className={cn(
                                        "text-sm",
                                        isDark ? "text-neutral-300" : "text-gray-600"
                                    )}>
                                        {result.viralAnalysis.whyItWorked}
                                    </p>
                                </div>
                            </div>

                            {/* Predicted Engagement */}
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-xs font-medium px-3 py-1.5 rounded-full",
                                    getEngagementColor(result.predictedEngagement)
                                )}>
                                    Predicted: {result.predictedEngagement} Engagement
                                </span>
                            </div>

                            {/* Rewritten Post */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className={cn(
                                        "text-sm font-medium",
                                        isDark ? "text-neutral-300" : "text-gray-700"
                                    )}>
                                        Your Rewritten Post
                                    </label>
                                    <button
                                        onClick={handleCopy}
                                        className={cn(
                                            "text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors",
                                            copied
                                                ? "text-green-500"
                                                : isDark
                                                    ? "text-neutral-400 hover:text-neutral-200"
                                                    : "text-gray-500 hover:text-gray-700"
                                        )}
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div className={cn(
                                    "p-4 rounded-lg text-sm whitespace-pre-wrap leading-relaxed",
                                    isDark ? "bg-neutral-700 text-neutral-100" : "bg-gray-50 text-gray-800"
                                )}>
                                    {result.rewrittenPost}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setResult(null)}
                                    className={cn(
                                        "flex-1 py-2.5 rounded-lg font-medium transition-colors",
                                        isDark
                                            ? "bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    )}
                                >
                                    Try Another
                                </button>
                                <button
                                    onClick={handleUsePost}
                                    className="flex-1 py-2.5 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
                                >
                                    Use This Post
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
