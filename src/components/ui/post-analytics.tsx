'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, Zap, Clock, Loader2, Eye, BookOpen, Hash, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export interface PostAnalysis {
    engagementScore: number;
    engagementLabel: string;
    hookStrength: string;
    hookAnalysis: string;
    bestDay: string;
    bestTime: string;
    postingReason: string;
    estimatedReachMin?: number;
    estimatedReachMax?: number;
    readabilityGrade?: number;
    readabilityLabel?: string;
    suggestedHashtags?: string[];
}

interface PostAnalyticsProps {
    analysis: PostAnalysis | null;
    isLoading: boolean;
    isDark?: boolean;
}

export function PostAnalytics({ analysis, isLoading, isDark = false }: PostAnalyticsProps) {
    const [copiedHashtags, setCopiedHashtags] = useState(false);

    const handleCopyHashtags = async () => {
        if (analysis?.suggestedHashtags) {
            const hashtagString = analysis.suggestedHashtags.map(h => `#${h}`).join(' ');
            await navigator.clipboard.writeText(hashtagString);
            setCopiedHashtags(true);
            setTimeout(() => setCopiedHashtags(false), 2000);
        }
    };

    if (isLoading) {
        return (
            <div className={cn(
                "flex items-center gap-2 text-xs",
                isDark ? "text-neutral-500" : "text-stone-400"
            )}>
                <Loader2 size={12} className="animate-spin" />
                Analyzing post...
            </div>
        );
    }

    if (!analysis) return null;

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-blue-500';
        if (score >= 40) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return isDark ? 'bg-green-900/30' : 'bg-green-50';
        if (score >= 60) return isDark ? 'bg-blue-900/30' : 'bg-blue-50';
        if (score >= 40) return isDark ? 'bg-yellow-900/30' : 'bg-yellow-50';
        return isDark ? 'bg-red-900/30' : 'bg-red-50';
    };

    const getHookColor = (strength: string) => {
        switch (strength.toLowerCase()) {
            case 'viral': return 'text-green-500';
            case 'strong': return 'text-blue-500';
            case 'moderate': return 'text-yellow-500';
            default: return 'text-red-500';
        }
    };

    const getHookBg = (strength: string) => {
        switch (strength.toLowerCase()) {
            case 'viral': return isDark ? 'bg-green-900/30' : 'bg-green-50';
            case 'strong': return isDark ? 'bg-blue-900/30' : 'bg-blue-50';
            case 'moderate': return isDark ? 'bg-yellow-900/30' : 'bg-yellow-50';
            default: return isDark ? 'bg-red-900/30' : 'bg-red-50';
        }
    };

    const getHookWidth = (strength: string) => {
        switch (strength.toLowerCase()) {
            case 'viral': return 'w-full';
            case 'strong': return 'w-3/4';
            case 'moderate': return 'w-1/2';
            default: return 'w-1/4';
        }
    };

    const formatReach = (min?: number, max?: number) => {
        if (!min || !max) return 'N/A';
        const formatNum = (n: number) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : n.toString();
        return `${formatNum(min)} - ${formatNum(max)}`;
    };

    return (
        <div className={cn(
            "mt-4 p-3 rounded-lg border",
            isDark ? "border-neutral-700 bg-neutral-800/50" : "border-stone-200 bg-stone-50"
        )}>
            {/* First row: 3 main metrics */}
            <div className="grid grid-cols-3 gap-3">
                {/* Engagement Score */}
                <div className={cn("p-2 rounded-lg", getScoreBg(analysis.engagementScore))}>
                    <div className="flex items-center gap-1.5 mb-1">
                        <TrendingUp size={12} className={getScoreColor(analysis.engagementScore)} />
                        <span className={cn("text-xs font-medium", isDark ? "text-neutral-300" : "text-stone-600")}>
                            Engagement
                        </span>
                    </div>
                    <div className={cn("text-2xl font-bold", getScoreColor(analysis.engagementScore))}>
                        {analysis.engagementScore}
                    </div>
                    <div className={cn("text-xs", getScoreColor(analysis.engagementScore))}>
                        {analysis.engagementLabel}
                    </div>
                </div>

                {/* Hook Strength */}
                <div className={cn("p-2 rounded-lg", getHookBg(analysis.hookStrength))}>
                    <div className="flex items-center gap-1.5 mb-1">
                        <Zap size={12} className={getHookColor(analysis.hookStrength)} />
                        <span className={cn("text-xs font-medium", isDark ? "text-neutral-300" : "text-stone-600")}>
                            Hook
                        </span>
                    </div>
                    <div className={cn("text-lg font-bold", getHookColor(analysis.hookStrength))}>
                        {analysis.hookStrength}
                    </div>
                    {/* Progress bar */}
                    <div className={cn("h-1.5 rounded-full mt-1", isDark ? "bg-neutral-700" : "bg-stone-200")}>
                        <div className={cn(
                            "h-full rounded-full transition-all",
                            getHookWidth(analysis.hookStrength),
                            analysis.hookStrength.toLowerCase() === 'viral' ? 'bg-green-500' :
                            analysis.hookStrength.toLowerCase() === 'strong' ? 'bg-blue-500' :
                            analysis.hookStrength.toLowerCase() === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                        )} />
                    </div>
                </div>

                {/* Best Time */}
                <div className={cn(
                    "p-2 rounded-lg",
                    isDark ? "bg-purple-900/30" : "bg-purple-50"
                )}>
                    <div className="flex items-center gap-1.5 mb-1">
                        <Clock size={12} className="text-purple-500" />
                        <span className={cn("text-xs font-medium", isDark ? "text-neutral-300" : "text-stone-600")}>
                            Best Time
                        </span>
                    </div>
                    <div className="text-purple-500 font-bold text-sm">
                        {analysis.bestDay}
                    </div>
                    <div className="text-purple-500 text-xs">
                        {analysis.bestTime}
                    </div>
                </div>
            </div>

            {/* Second row: Reach and Readability */}
            <div className="grid grid-cols-2 gap-3 mt-3">
                {/* Estimated Reach */}
                <div className={cn(
                    "p-2 rounded-lg",
                    isDark ? "bg-cyan-900/30" : "bg-cyan-50"
                )}>
                    <div className="flex items-center gap-1.5 mb-1">
                        <Eye size={12} className="text-cyan-500" />
                        <span className={cn("text-xs font-medium", isDark ? "text-neutral-300" : "text-stone-600")}>
                            Est. Reach
                        </span>
                    </div>
                    <div className="text-cyan-500 font-bold text-lg">
                        {formatReach(analysis.estimatedReachMin, analysis.estimatedReachMax)}
                    </div>
                    <div className={cn("text-xs", isDark ? "text-neutral-500" : "text-stone-400")}>
                        impressions
                    </div>
                </div>

                {/* Readability */}
                <div className={cn(
                    "p-2 rounded-lg",
                    analysis.readabilityGrade && analysis.readabilityGrade <= 6
                        ? isDark ? "bg-green-900/30" : "bg-green-50"
                        : isDark ? "bg-yellow-900/30" : "bg-yellow-50"
                )}>
                    <div className="flex items-center gap-1.5 mb-1">
                        <BookOpen size={12} className={analysis.readabilityGrade && analysis.readabilityGrade <= 6 ? "text-green-500" : "text-yellow-500"} />
                        <span className={cn("text-xs font-medium", isDark ? "text-neutral-300" : "text-stone-600")}>
                            Readability
                        </span>
                    </div>
                    <div className={cn(
                        "font-bold text-lg",
                        analysis.readabilityGrade && analysis.readabilityGrade <= 6 ? "text-green-500" : "text-yellow-500"
                    )}>
                        Grade {analysis.readabilityGrade || 'N/A'}
                    </div>
                    <div className={cn("text-xs", analysis.readabilityGrade && analysis.readabilityGrade <= 6 ? "text-green-500" : "text-yellow-500")}>
                        {analysis.readabilityLabel || 'Analyzing...'}
                    </div>
                </div>
            </div>

            {/* Hook Analysis */}
            <div className={cn(
                "mt-3 text-xs",
                isDark ? "text-neutral-400" : "text-stone-500"
            )}>
                <span className="font-medium">Hook insight:</span> {analysis.hookAnalysis}
            </div>

            {/* Suggested Hashtags */}
            {analysis.suggestedHashtags && analysis.suggestedHashtags.length > 0 && (
                <div className={cn(
                    "mt-3 p-2 rounded-lg",
                    isDark ? "bg-indigo-900/30" : "bg-indigo-50"
                )}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                            <Hash size={12} className="text-indigo-500" />
                            <span className={cn("text-xs font-medium", isDark ? "text-neutral-300" : "text-stone-600")}>
                                Suggested Hashtags
                            </span>
                        </div>
                        <button
                            onClick={handleCopyHashtags}
                            className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600 transition-colors"
                        >
                            {copiedHashtags ? (
                                <>
                                    <Check size={10} />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy size={10} />
                                    Copy All
                                </>
                            )}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {analysis.suggestedHashtags.map((tag, i) => (
                            <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
