'use client';

import { cn } from '@/lib/utils';
import { X, Loader2, Copy, Check, Heart, MessageCircle, Send, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface Engagement {
    name: string;
    engagementType: 'comment' | 'reaction';
    theirComment?: string;
    connectionRequest: string;
    thankYouDM: string;
}

interface ProcessedEngagements {
    postSummary: string;
    engagements: Engagement[];
}

interface EngagementResponderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EngagementResponderModal({ isOpen, onClose }: EngagementResponderModalProps) {
    const [postContent, setPostContent] = useState('');
    const [engagementList, setEngagementList] = useState('');
    const [results, setResults] = useState<ProcessedEngagements | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleProcess = async () => {
        if (!postContent.trim() || !engagementList.trim()) {
            setError('Please paste both your post and the engagement list');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await fetch('/api/process-engagements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postContent: postContent.trim(),
                    engagementList: engagementList.trim(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to process engagements');
            }

            const data = await response.json();
            setResults(data);
            setExpandedIndex(0);
        } catch (err) {
            setError('Failed to process. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async (text: string, field: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleClose = () => {
        setPostContent('');
        setEngagementList('');
        setResults(null);
        setExpandedIndex(null);
        setError(null);
        onClose();
    };

    const handleReset = () => {
        setResults(null);
        setExpandedIndex(null);
        setError(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
            <div
                className="w-full max-w-3xl rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col bg-white"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-pink-500 to-rose-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/20">
                            <Heart size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Engagement Responder
                            </h2>
                            <p className="text-xs text-white/80">
                                Turn reactions & comments into warm conversations
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

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {!results ? (
                        <div className="space-y-4">
                            {/* Post Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    1. Paste your LinkedIn post *
                                </label>
                                <textarea
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    placeholder="Copy and paste your full LinkedIn post here..."
                                    rows={5}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm resize-none"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Engagement List */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    2. Paste people who engaged *
                                </label>
                                <textarea
                                    value={engagementList}
                                    onChange={(e) => setEngagementList(e.target.value)}
                                    placeholder={`Paste names and comments here. Examples:

John Smith - 👍 (liked)
Sarah Jones - "Great insight! We struggle with this too"
Mike Chen - 🔥
Lisa Wang - "This is exactly what we need"
David Lee - 👏`}
                                    rows={6}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm resize-none font-mono"
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Format: Name - emoji for reactions, or Name - "their comment" for commenters
                                </p>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleProcess}
                                disabled={isLoading || !postContent.trim() || !engagementList.trim()}
                                className="w-full py-3 rounded-lg font-medium bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Generating personalized outreach...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Generate Outreach for Everyone
                                    </>
                                )}
                            </button>

                            {/* Info Box */}
                            <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                                <p className="text-sm font-medium text-pink-800 mb-2">What you'll get for each person:</p>
                                <ul className="text-xs text-pink-700 space-y-1">
                                    <li className="flex items-center gap-2">
                                        <Send size={12} />
                                        <strong>Connection Request</strong> - Short, personalized, references their engagement
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <MessageCircle size={12} />
                                        <strong>Thank You DM</strong> - Warm appreciation + question to start conversation
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Summary */}
                            <div className="p-3 rounded-lg bg-gray-100 text-sm text-gray-600">
                                <strong>Post:</strong> {results.postSummary}
                            </div>

                            {/* Results Count */}
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-700">
                                    {results.engagements.length} people processed
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Heart size={12} className="text-pink-500" />
                                        {results.engagements.filter(e => e.engagementType === 'reaction').length} reactions
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle size={12} className="text-blue-500" />
                                        {results.engagements.filter(e => e.engagementType === 'comment').length} comments
                                    </span>
                                </div>
                            </div>

                            {/* Engagement Cards */}
                            <div className="space-y-2">
                                {results.engagements.map((engagement, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg overflow-hidden"
                                    >
                                        <button
                                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                                            className="w-full p-3 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center text-white",
                                                    engagement.engagementType === 'comment' ? "bg-blue-500" : "bg-pink-500"
                                                )}>
                                                    {engagement.engagementType === 'comment' ? (
                                                        <MessageCircle size={14} />
                                                    ) : (
                                                        <Heart size={14} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{engagement.name}</p>
                                                    {engagement.theirComment && (
                                                        <p className="text-xs text-gray-500 truncate max-w-xs">
                                                            "{engagement.theirComment}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {expandedIndex === index ? (
                                                <ChevronUp size={18} className="text-gray-400" />
                                            ) : (
                                                <ChevronDown size={18} className="text-gray-400" />
                                            )}
                                        </button>

                                        {expandedIndex === index && (
                                            <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
                                                {/* Connection Request */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                                            <Send size={12} />
                                                            CONNECTION REQUEST
                                                        </p>
                                                        <button
                                                            onClick={() => handleCopy(engagement.connectionRequest, `conn-${index}`)}
                                                            className="text-xs text-pink-600 hover:text-pink-700 flex items-center gap-1"
                                                        >
                                                            {copiedField === `conn-${index}` ? (
                                                                <>
                                                                    <Check size={12} />
                                                                    Copied!
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy size={12} />
                                                                    Copy
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-white border border-gray-200 text-sm text-gray-700">
                                                        {engagement.connectionRequest}
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {engagement.connectionRequest.length} characters
                                                    </p>
                                                </div>

                                                {/* Thank You DM */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                                            <MessageCircle size={12} />
                                                            THANK YOU DM (after they accept)
                                                        </p>
                                                        <button
                                                            onClick={() => handleCopy(engagement.thankYouDM, `dm-${index}`)}
                                                            className="text-xs text-pink-600 hover:text-pink-700 flex items-center gap-1"
                                                        >
                                                            {copiedField === `dm-${index}` ? (
                                                                <>
                                                                    <Check size={12} />
                                                                    Copied!
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy size={12} />
                                                                    Copy
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap">
                                                        {engagement.thankYouDM}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={handleReset}
                                    className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    Process New Engagements
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
