'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Layers, Calendar, ChevronDown, ChevronUp, Copy, Check, Trash2, Clock, Eye, CheckCircle, Circle } from 'lucide-react';
import type { ContentSeries, SeriesPost, SeriesPostStatus } from '@/types';

interface SeriesManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    seriesList: ContentSeries[];
    onDeleteSeries: (seriesId: string) => void;
    onUpdatePostStatus: (seriesId: string, postId: string, status: SeriesPostStatus) => void;
    onAddToCalendar: (series: ContentSeries) => void;
}

export function SeriesManagerModal({
    isOpen,
    onClose,
    seriesList,
    onDeleteSeries,
    onUpdatePostStatus,
    onAddToCalendar
}: SeriesManagerModalProps) {
    const [expandedSeries, setExpandedSeries] = useState<string | null>(null);
    const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    if (!isOpen) return null;

    const toggleSeries = (seriesId: string) => {
        setExpandedSeries(prev => prev === seriesId ? null : seriesId);
    };

    const togglePost = (postId: string) => {
        setExpandedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };

    const handleCopy = async (content: string, postId: string) => {
        await navigator.clipboard.writeText(content);
        setCopiedId(postId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = (seriesId: string) => {
        if (confirmDelete === seriesId) {
            onDeleteSeries(seriesId);
            setConfirmDelete(null);
        } else {
            setConfirmDelete(seriesId);
            setTimeout(() => setConfirmDelete(null), 3000);
        }
    };

    const getStatusIcon = (status: SeriesPostStatus) => {
        switch (status) {
            case 'posted':
                return <CheckCircle size={14} className="text-green-500" />;
            case 'scheduled':
                return <Clock size={14} className="text-[#0A66C2]" />;
            default:
                return <Circle size={14} className="text-[rgba(0,0,0,0.3)]" />;
        }
    };

    const getStatusBadge = (status: SeriesPostStatus) => {
        switch (status) {
            case 'posted':
                return <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">Posted</span>;
            case 'scheduled':
                return <span className="px-2 py-0.5 text-xs rounded-full bg-[#EEF3F8] text-[#0A66C2]">Scheduled</span>;
            default:
                return <span className="px-2 py-0.5 text-xs rounded-full bg-[rgba(0,0,0,0.08)] text-[rgba(0,0,0,0.6)]">Draft</span>;
        }
    };

    const getSeriesProgress = (series: ContentSeries) => {
        const posted = series.posts.filter(p => p.status === 'posted').length;
        const scheduled = series.posts.filter(p => p.status === 'scheduled').length;
        return { posted, scheduled, total: series.posts.length };
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <div
                className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-[rgba(0,0,0,0.08)] flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Layers size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)]">
                                Series Manager
                            </h2>
                            <p className="text-xs text-[rgba(0,0,0,0.6)]">
                                {seriesList.length} {seriesList.length === 1 ? 'series' : 'series'} saved
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full transition-colors hover:bg-[#EEF3F8] text-[rgba(0,0,0,0.6)]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {seriesList.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EEF3F8] flex items-center justify-center">
                                <Layers size={32} className="text-[rgba(0,0,0,0.3)]" />
                            </div>
                            <h3 className="text-lg font-medium text-[rgba(0,0,0,0.9)] mb-1">No series yet</h3>
                            <p className="text-sm text-[rgba(0,0,0,0.6)]">
                                Create a content series to see it here
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {seriesList.map(series => {
                                const progress = getSeriesProgress(series);
                                const isExpanded = expandedSeries === series.id;

                                return (
                                    <div
                                        key={series.id}
                                        className="rounded-lg border border-[rgba(0,0,0,0.08)] bg-white overflow-hidden"
                                    >
                                        {/* Series Header */}
                                        <div className="p-4">
                                            <div className="flex items-start justify-between">
                                                <button
                                                    onClick={() => toggleSeries(series.id)}
                                                    className="flex-1 text-left"
                                                >
                                                    <h3 className="font-semibold text-[rgba(0,0,0,0.9)]">{series.title}</h3>
                                                    {series.description && (
                                                        <p className="text-sm text-[rgba(0,0,0,0.6)] mt-0.5">{series.description}</p>
                                                    )}
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-[rgba(0,0,0,0.6)]">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {new Date(series.startDate).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Layers size={12} />
                                                            {series.numberOfPosts} posts
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <CheckCircle size={12} />
                                                            {progress.posted}/{progress.total} posted
                                                        </span>
                                                    </div>
                                                </button>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleSeries(series.id)}
                                                        className="p-2 rounded-full hover:bg-[#EEF3F8] text-[rgba(0,0,0,0.4)]"
                                                    >
                                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mt-3 h-2 bg-[rgba(0,0,0,0.08)] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 transition-all"
                                                    style={{ width: `${(progress.posted / progress.total) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Expanded Posts */}
                                        {isExpanded && (
                                            <div className="border-t border-[rgba(0,0,0,0.08)]">
                                                {series.posts.map(post => (
                                                    <div
                                                        key={post.id}
                                                        className="border-b border-[rgba(0,0,0,0.08)] last:border-b-0"
                                                    >
                                                        <button
                                                            onClick={() => togglePost(post.id)}
                                                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#EEF3F8]/50 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {getStatusIcon(post.status)}
                                                                <div className="text-left">
                                                                    <div className="text-sm font-medium text-[rgba(0,0,0,0.9)]">
                                                                        Day {post.dayNumber}: {post.title}
                                                                    </div>
                                                                    <div className="text-xs text-[rgba(0,0,0,0.6)]">
                                                                        {post.dayLabel}, {new Date(post.scheduledDate).toLocaleDateString()} at {post.scheduledTime}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {getStatusBadge(post.status)}
                                                                {expandedPosts.has(post.id) ? (
                                                                    <ChevronUp size={16} className="text-[rgba(0,0,0,0.4)]" />
                                                                ) : (
                                                                    <ChevronDown size={16} className="text-[rgba(0,0,0,0.4)]" />
                                                                )}
                                                            </div>
                                                        </button>

                                                        {expandedPosts.has(post.id) && (
                                                            <div className="px-4 pb-4">
                                                                {post.callbackPhrase && (
                                                                    <div className="mb-2 p-2 rounded bg-green-50 text-xs text-green-700">
                                                                        <span className="font-medium">Callback:</span> {post.callbackPhrase}
                                                                    </div>
                                                                )}
                                                                <div className="text-sm text-[rgba(0,0,0,0.9)] whitespace-pre-wrap leading-relaxed bg-[#EEF3F8] rounded-lg p-3">
                                                                    {post.content}
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-3">
                                                                    <button
                                                                        onClick={() => handleCopy(post.content, post.id)}
                                                                        className={cn(
                                                                            "px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-colors",
                                                                            copiedId === post.id
                                                                                ? "bg-green-100 text-green-700"
                                                                                : "text-[rgba(0,0,0,0.6)] hover:bg-[#EEF3F8]"
                                                                        )}
                                                                    >
                                                                        {copiedId === post.id ? <Check size={12} /> : <Copy size={12} />}
                                                                        {copiedId === post.id ? 'Copied!' : 'Copy'}
                                                                    </button>
                                                                    {post.status === 'draft' && (
                                                                        <button
                                                                            onClick={() => onUpdatePostStatus(series.id, post.id, 'scheduled')}
                                                                            className="px-3 py-1.5 rounded-full text-xs font-medium text-[#0A66C2] hover:bg-[#EEF3F8] flex items-center gap-1"
                                                                        >
                                                                            <Clock size={12} />
                                                                            Mark Scheduled
                                                                        </button>
                                                                    )}
                                                                    {post.status === 'scheduled' && (
                                                                        <button
                                                                            onClick={() => onUpdatePostStatus(series.id, post.id, 'posted')}
                                                                            className="px-3 py-1.5 rounded-full text-xs font-medium text-green-600 hover:bg-green-50 flex items-center gap-1"
                                                                        >
                                                                            <CheckCircle size={12} />
                                                                            Mark Posted
                                                                        </button>
                                                                    )}
                                                                    {post.status === 'posted' && (
                                                                        <button
                                                                            onClick={() => onUpdatePostStatus(series.id, post.id, 'draft')}
                                                                            className="px-3 py-1.5 rounded-full text-xs font-medium text-[rgba(0,0,0,0.6)] hover:bg-[#EEF3F8] flex items-center gap-1"
                                                                        >
                                                                            <Circle size={12} />
                                                                            Reset to Draft
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {/* Series Actions */}
                                                <div className="p-4 bg-[#EEF3F8]/50 flex items-center justify-between">
                                                    <button
                                                        onClick={() => onAddToCalendar(series)}
                                                        className="px-4 py-2 rounded-full text-sm font-medium text-[#0A66C2] hover:bg-[#EEF3F8] flex items-center gap-2"
                                                    >
                                                        <Calendar size={16} />
                                                        Add to Calendar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(series.id)}
                                                        className={cn(
                                                            "px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors",
                                                            confirmDelete === series.id
                                                                ? "bg-red-500 text-white"
                                                                : "text-red-500 hover:bg-red-50"
                                                        )}
                                                    >
                                                        <Trash2 size={16} />
                                                        {confirmDelete === series.id ? 'Click to Confirm' : 'Delete Series'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
