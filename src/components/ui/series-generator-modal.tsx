'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, Loader2, Calendar, Clock, Layers, ChevronDown, ChevronUp, Copy, Check, Pencil, Save, RotateCcw } from 'lucide-react';
import type { ContentSeries, SeriesPost } from '@/types';

interface SeriesGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSeriesCreated: (series: ContentSeries) => void;
}

export function SeriesGeneratorModal({ isOpen, onClose, onSeriesCreated }: SeriesGeneratorModalProps) {
    const [topic, setTopic] = useState('');
    const [numberOfPosts, setNumberOfPosts] = useState(5);
    const [startDate, setStartDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    });
    const [defaultTime, setDefaultTime] = useState('10:00');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [series, setSeries] = useState<ContentSeries | null>(null);
    const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set([0]));
    const [editingPost, setEditingPost] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic for your content series');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/generate-series', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: topic.trim(),
                    numberOfPosts,
                    startDate,
                    defaultTime
                }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data: ContentSeries = await response.json();
            setSeries(data);
            // Expand first post by default
            setExpandedPosts(new Set([0]));
        } catch (err) {
            console.error('Series generation failed:', err);
            setError(err instanceof Error ? err.message : 'Failed to generate series');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePost = (index: number) => {
        setExpandedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const handleCopy = async (content: string, postId: string) => {
        await navigator.clipboard.writeText(content);
        setCopiedId(postId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const startEditing = (index: number, content: string) => {
        setEditingPost(index);
        setEditContent(content);
    };

    const saveEdit = () => {
        if (series && editingPost !== null) {
            const updatedPosts = [...series.posts];
            updatedPosts[editingPost] = {
                ...updatedPosts[editingPost],
                content: editContent
            };
            setSeries({ ...series, posts: updatedPosts, updatedAt: Date.now() });
            setEditingPost(null);
            setEditContent('');
        }
    };

    const cancelEdit = () => {
        setEditingPost(null);
        setEditContent('');
    };

    const handleSaveSeries = () => {
        if (series) {
            onSeriesCreated(series);
            handleClose();
        }
    };

    const handleClose = () => {
        setSeries(null);
        setTopic('');
        setError(null);
        setExpandedPosts(new Set([0]));
        setEditingPost(null);
        onClose();
    };

    const handleRegenerate = () => {
        setSeries(null);
        setExpandedPosts(new Set([0]));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
            <div
                className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-[rgba(0,0,0,0.08)] flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#004182] flex items-center justify-center">
                            <Layers size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)]">
                                Content Series Generator
                            </h2>
                            <p className="text-xs text-[rgba(0,0,0,0.6)]">
                                Create connected multi-day posts that reference each other
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full transition-colors hover:bg-[#EEF3F8] text-[rgba(0,0,0,0.6)]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {!series ? (
                        /* Configuration Form */
                        <div className="space-y-4">
                            {/* Topic Input */}
                            <div>
                                <label className="block text-sm font-medium text-[rgba(0,0,0,0.9)] mb-1">
                                    Series Topic
                                </label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., 5 sales leadership lessons I learned the hard way"
                                    className="w-full px-4 py-3 rounded-lg border border-[rgba(0,0,0,0.15)] bg-[#EEF3F8] text-[rgba(0,0,0,0.9)] placeholder:text-[rgba(0,0,0,0.5)] focus:outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2]"
                                />
                                <p className="mt-1 text-xs text-[rgba(0,0,0,0.6)]">
                                    Describe the theme or topic for your content series
                                </p>
                            </div>

                            {/* Number of Posts */}
                            <div>
                                <label className="block text-sm font-medium text-[rgba(0,0,0,0.9)] mb-1">
                                    Number of Posts
                                </label>
                                <div className="flex gap-2">
                                    {[3, 4, 5, 6, 7].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setNumberOfPosts(num)}
                                            className={cn(
                                                "flex-1 py-2 rounded-lg font-medium transition-colors",
                                                numberOfPosts === num
                                                    ? "bg-[#0A66C2] text-white"
                                                    : "bg-[#EEF3F8] text-[rgba(0,0,0,0.6)] hover:bg-[#E1E9F0]"
                                            )}
                                        >
                                            {num} days
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Start Date and Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[rgba(0,0,0,0.9)] mb-1">
                                        <Calendar size={14} className="inline mr-1" />
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-[rgba(0,0,0,0.15)] bg-[#EEF3F8] text-[rgba(0,0,0,0.9)] focus:outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[rgba(0,0,0,0.9)] mb-1">
                                        <Clock size={14} className="inline mr-1" />
                                        Default Time
                                    </label>
                                    <input
                                        type="time"
                                        value={defaultTime}
                                        onChange={(e) => setDefaultTime(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-[rgba(0,0,0,0.15)] bg-[#EEF3F8] text-[rgba(0,0,0,0.9)] focus:outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2]"
                                    />
                                </div>
                            </div>

                            {/* Preview Info */}
                            <div className="p-4 rounded-lg bg-[#EEF3F8]">
                                <h3 className="text-sm font-medium text-[rgba(0,0,0,0.9)] mb-2">How it works</h3>
                                <ul className="space-y-1 text-xs text-[rgba(0,0,0,0.6)]">
                                    <li>1. Day 1 introduces your main theme with a strong hook</li>
                                    <li>2. Each following day explicitly references the previous post</li>
                                    <li>3. Uses callbacks like "Yesterday I shared..." to create continuity</li>
                                    <li>4. Final day wraps up with a synthesis of the entire series</li>
                                </ul>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !topic.trim()}
                                className={cn(
                                    "w-full py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2",
                                    isLoading || !topic.trim()
                                        ? "bg-[rgba(0,0,0,0.08)] text-[rgba(0,0,0,0.3)] cursor-not-allowed"
                                        : "bg-[#0A66C2] text-white hover:bg-[#004182]"
                                )}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Generating {numberOfPosts} connected posts...
                                    </>
                                ) : (
                                    <>
                                        <Layers size={18} />
                                        Generate {numberOfPosts}-Day Series
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        /* Series Preview */
                        <div className="space-y-4">
                            {/* Series Header */}
                            <div className="p-4 rounded-lg bg-gradient-to-r from-[#0A66C2]/10 to-[#004182]/10 border border-[#0A66C2]/20">
                                <h3 className="text-lg font-semibold text-[rgba(0,0,0,0.9)]">{series.title}</h3>
                                {series.description && (
                                    <p className="text-sm text-[rgba(0,0,0,0.6)] mt-1">{series.description}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-xs text-[rgba(0,0,0,0.6)]">
                                    <span className="flex items-center gap-1">
                                        <Layers size={12} />
                                        {series.numberOfPosts} posts
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        Starts {new Date(series.startDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Posts */}
                            <div className="space-y-3">
                                {series.posts.map((post, index) => (
                                    <div
                                        key={post.id}
                                        className="rounded-lg border border-[rgba(0,0,0,0.08)] bg-white overflow-hidden"
                                    >
                                        {/* Post Header */}
                                        <button
                                            onClick={() => togglePost(index)}
                                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#EEF3F8] transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center text-sm font-bold">
                                                    {post.dayNumber}
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-medium text-[rgba(0,0,0,0.9)] text-sm">
                                                        {post.dayLabel} - {post.title}
                                                    </div>
                                                    <div className="text-xs text-[rgba(0,0,0,0.6)]">
                                                        {new Date(post.scheduledDate).toLocaleDateString()} at {post.scheduledTime}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {post.callbackPhrase && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                                        Links to Day {post.dayNumber - 1}
                                                    </span>
                                                )}
                                                {expandedPosts.has(index) ? (
                                                    <ChevronUp size={18} className="text-[rgba(0,0,0,0.4)]" />
                                                ) : (
                                                    <ChevronDown size={18} className="text-[rgba(0,0,0,0.4)]" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Post Content */}
                                        {expandedPosts.has(index) && (
                                            <div className="px-4 pb-4 border-t border-[rgba(0,0,0,0.08)]">
                                                {/* Callback info */}
                                                {post.previousSummary && (
                                                    <div className="mt-3 p-2 rounded bg-[#EEF3F8] text-xs text-[rgba(0,0,0,0.6)]">
                                                        <span className="font-medium">References Day {post.dayNumber - 1}:</span> {post.previousSummary}
                                                    </div>
                                                )}

                                                {/* Content */}
                                                {editingPost === index ? (
                                                    <div className="mt-3">
                                                        <textarea
                                                            value={editContent}
                                                            onChange={(e) => setEditContent(e.target.value)}
                                                            className="w-full p-3 rounded-lg border border-[rgba(0,0,0,0.15)] text-sm leading-relaxed min-h-[200px] focus:outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2]"
                                                        />
                                                        <div className="flex gap-2 mt-2">
                                                            <button
                                                                onClick={saveEdit}
                                                                className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#0A66C2] text-white hover:bg-[#004182] flex items-center gap-1"
                                                            >
                                                                <Save size={12} />
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={cancelEdit}
                                                                className="px-3 py-1.5 rounded-full text-xs font-medium text-[rgba(0,0,0,0.6)] hover:bg-[#EEF3F8] flex items-center gap-1"
                                                            >
                                                                <X size={12} />
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="mt-3 text-sm text-[rgba(0,0,0,0.9)] whitespace-pre-wrap leading-relaxed">
                                                            {post.content}
                                                        </div>
                                                        <div className="flex gap-2 mt-3">
                                                            <button
                                                                onClick={() => handleCopy(post.content, post.id)}
                                                                className={cn(
                                                                    "px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-colors",
                                                                    copiedId === post.id
                                                                        ? "bg-green-100 text-green-700"
                                                                        : "text-[rgba(0,0,0,0.6)] hover:bg-[#EEF3F8]"
                                                                )}
                                                            >
                                                                {copiedId === post.id ? (
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
                                                            <button
                                                                onClick={() => startEditing(index, post.content)}
                                                                className="px-3 py-1.5 rounded-full text-xs font-medium text-[rgba(0,0,0,0.6)] hover:bg-[#EEF3F8] flex items-center gap-1"
                                                            >
                                                                <Pencil size={12} />
                                                                Edit
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {series && (
                    <div className="p-4 border-t border-[rgba(0,0,0,0.08)] bg-white flex items-center justify-between">
                        <button
                            onClick={handleRegenerate}
                            className="px-4 py-2 rounded-full text-sm font-medium text-[rgba(0,0,0,0.6)] hover:bg-[#EEF3F8] flex items-center gap-2"
                        >
                            <RotateCcw size={16} />
                            Start Over
                        </button>
                        <button
                            onClick={handleSaveSeries}
                            className="px-6 py-2 rounded-full text-sm font-semibold bg-[#0A66C2] text-white hover:bg-[#004182] flex items-center gap-2"
                        >
                            <Save size={16} />
                            Save Series
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
