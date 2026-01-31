'use client';

import { cn } from '@/lib/utils';
import { X, Radar, Loader2, Copy, Check, ChevronDown, ChevronUp, Sparkles, ExternalLink, Hash } from 'lucide-react';
import { useState } from 'react';

interface TrendItem {
    trend: string;
    source: string;
    whyItMatters: string;
    hook: string;
    brandAngle: string;
    fullPost: string;
    hashtags: string[];
}

interface TrendScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUsePost: (post: string) => void;
}

const PRESET_TOPICS = [
    { label: 'LinkedIn Content', value: 'LinkedIn content strategy tips' },
    { label: 'AI Writing', value: 'AI writing tools for social media' },
    { label: 'B2B Marketing', value: 'B2B content marketing trends' },
    { label: 'Social Selling', value: 'social selling LinkedIn best practices' },
    { label: 'Personal Branding', value: 'personal branding LinkedIn' },
];

export function TrendScannerModal({ isOpen, onClose, onUsePost }: TrendScannerModalProps) {
    const [trends, setTrends] = useState<TrendItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [customKeywords, setCustomKeywords] = useState('');
    const [scanSource, setScanSource] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleScan = async (keywords?: string) => {
        setIsLoading(true);
        setError(null);
        setTrends([]);
        setScanSource(null);

        try {
            const response = await fetch('/api/scan-trends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customKeywords: keywords || customKeywords || null }),
            });

            if (!response.ok) {
                throw new Error('Failed to scan trends');
            }

            const data = await response.json();
            setTrends(data.trends || []);
            setScanSource(data.source);
            if (data.trends?.length > 0) {
                setExpandedIndex(0);
            }
        } catch (err) {
            setError('Failed to scan trends. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async (text: string, index: number) => {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleUsePost = (post: string, hashtags: string[]) => {
        const fullPost = `${post}\n\n${hashtags.map(h => `#${h}`).join(' ')}`;
        onUsePost(fullPost);
        onClose();
    };

    const handleClose = () => {
        setTrends([]);
        setError(null);
        setExpandedIndex(null);
        setCustomKeywords('');
        setScanSource(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
            <div
                className="w-full max-w-3xl rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col bg-white"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/20">
                            <Radar size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Trend Scanner
                            </h2>
                            <p className="text-xs text-white/80">
                                Find trending topics & generate brand-aligned content
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1.5 rounded-lg transition-colors hover:bg-white/20 text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Search Section */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 mb-2">Quick Scan Topics</p>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_TOPICS.map((topic) => (
                                <button
                                    key={topic.value}
                                    onClick={() => handleScan(topic.value)}
                                    disabled={isLoading}
                                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors disabled:opacity-50"
                                >
                                    {topic.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={customKeywords}
                            onChange={(e) => setCustomKeywords(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                            placeholder="Or enter custom keywords to scan..."
                            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => handleScan()}
                            disabled={isLoading}
                            className="px-4 py-2.5 rounded-lg font-medium bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Radar size={16} />
                            )}
                            Scan
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 size={32} className="animate-spin text-emerald-500 mb-3" />
                            <p className="text-sm text-gray-500 mb-1">Scanning for trends...</p>
                            <p className="text-xs text-gray-400">Analyzing Reddit, G2, industry sources</p>
                        </div>
                    )}

                    {!isLoading && trends.length === 0 && !error && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Radar size={48} className="text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm mb-1">Ready to scan for trending topics</p>
                            <p className="text-gray-400 text-xs">Click a quick topic or enter custom keywords</p>
                        </div>
                    )}

                    {trends.length > 0 && (
                        <div className="space-y-3">
                            {scanSource && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                    <Sparkles size={12} className="text-emerald-500" />
                                    {scanSource === 'live_search'
                                        ? 'Results from live web search'
                                        : 'AI-analyzed industry trends'
                                    }
                                </div>
                            )}

                            {trends.map((trend, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg overflow-hidden hover:border-emerald-300 transition-colors"
                                >
                                    {/* Trend Header */}
                                    <button
                                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                                        className="w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                                                        {trend.source}
                                                    </span>
                                                </div>
                                                <h3 className="font-medium text-gray-900 mb-1">
                                                    {trend.trend}
                                                </h3>
                                                <p className="text-sm text-gray-500 line-clamp-2">
                                                    {trend.whyItMatters}
                                                </p>
                                            </div>
                                            {expandedIndex === index ? (
                                                <ChevronUp size={20} className="text-gray-400 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Expanded Content */}
                                    {expandedIndex === index && (
                                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                                            {/* Hook Preview */}
                                            <div className="mb-4">
                                                <p className="text-xs font-medium text-gray-500 mb-1">HOOK</p>
                                                <p className="text-sm font-medium text-gray-900 italic">
                                                    "{trend.hook}"
                                                </p>
                                            </div>

                                            {/* Brand Angle */}
                                            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                                                <p className="text-xs font-medium text-emerald-700 mb-1">BRAND ANGLE</p>
                                                <p className="text-sm text-emerald-800">
                                                    {trend.brandAngle}
                                                </p>
                                            </div>

                                            {/* Full Post */}
                                            <div className="mb-4">
                                                <p className="text-xs font-medium text-gray-500 mb-1">FULL POST</p>
                                                <div className="p-3 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                                                    {trend.fullPost}
                                                </div>
                                            </div>

                                            {/* Hashtags */}
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Hash size={12} className="text-gray-400" />
                                                    <p className="text-xs font-medium text-gray-500">HASHTAGS</p>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {trend.hashtags.map((tag, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleCopy(trend.fullPost, index)}
                                                    className="flex-1 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    {copiedIndex === index ? (
                                                        <>
                                                            <Check size={14} className="text-green-500" />
                                                            Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={14} />
                                                            Copy Post
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleUsePost(trend.fullPost, trend.hashtags)}
                                                    className="flex-1 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Sparkles size={14} />
                                                    Use This Post
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
