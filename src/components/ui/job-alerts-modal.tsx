'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
    X,
    Briefcase,
    Building2,
    MapPin,
    ExternalLink,
    Star,
    Check,
    Archive,
    Trash2,
    Filter,
    Plus,
    RefreshCw,
    Settings,
    TrendingUp,
    Clock,
} from 'lucide-react';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    link: string;
    description: string;
    salary?: string;
    postedDate: string;
    receivedAt: string;
    score?: number;
    scoreReason?: string;
    status: 'new' | 'interested' | 'applied' | 'rejected' | 'archived';
    keywords: string[];
}

interface JobAlertsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function JobAlertsModal({ isOpen, onClose }: JobAlertsModalProps) {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [newKeyword, setNewKeyword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState<string>('all');
    const [minScore, setMinScore] = useState<number>(0);
    const [showSettings, setShowSettings] = useState(false);
    const [webhookUrl, setWebhookUrl] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchJobs();
            // Set webhook URL based on current domain
            if (typeof window !== 'undefined') {
                setWebhookUrl(`${window.location.origin}/api/job-alerts`);
            }
        }
    }, [isOpen]);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter !== 'all') params.set('status', filter);
            if (minScore > 0) params.set('minScore', minScore.toString());

            const response = await fetch(`/api/job-alerts?${params}`);
            const data = await response.json();
            setJobs(data.jobs || []);
            setKeywords(data.keywords || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateJobStatus = async (jobId: string, status: Job['status']) => {
        try {
            await fetch('/api/job-alerts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId, status }),
            });
            setJobs(prev =>
                prev.map(job =>
                    job.id === jobId ? { ...job, status } : job
                )
            );
        } catch (error) {
            console.error('Error updating job:', error);
        }
    };

    const deleteJob = async (jobId: string) => {
        try {
            await fetch(`/api/job-alerts?jobId=${jobId}`, { method: 'DELETE' });
            setJobs(prev => prev.filter(job => job.id !== jobId));
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const addKeyword = async () => {
        if (!newKeyword.trim() || keywords.includes(newKeyword.trim())) return;

        const updatedKeywords = [...keywords, newKeyword.trim()];
        setKeywords(updatedKeywords);
        setNewKeyword('');

        try {
            await fetch('/api/job-alerts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords: updatedKeywords }),
            });
            fetchJobs(); // Refresh to get updated scores
        } catch (error) {
            console.error('Error saving keywords:', error);
        }
    };

    const removeKeyword = async (keyword: string) => {
        const updatedKeywords = keywords.filter(k => k !== keyword);
        setKeywords(updatedKeywords);

        try {
            await fetch('/api/job-alerts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords: updatedKeywords }),
            });
            fetchJobs();
        } catch (error) {
            console.error('Error saving keywords:', error);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-[#057642] bg-[#057642]/10';
        if (score >= 60) return 'text-[#0A66C2] bg-[#0A66C2]/10';
        if (score >= 40) return 'text-[#915907] bg-[#915907]/10';
        return 'text-[rgba(0,0,0,0.6)] bg-[rgba(0,0,0,0.05)]';
    };

    const getStatusIcon = (status: Job['status']) => {
        switch (status) {
            case 'interested': return <Star size={14} className="text-[#915907]" />;
            case 'applied': return <Check size={14} className="text-[#057642]" />;
            case 'rejected': return <X size={14} className="text-[#B24020]" />;
            case 'archived': return <Archive size={14} className="text-[rgba(0,0,0,0.4)]" />;
            default: return <Clock size={14} className="text-[#0A66C2]" />;
        }
    };

    const filteredJobs = jobs.filter(job => {
        if (filter !== 'all' && job.status !== filter) return false;
        if (minScore > 0 && (job.score || 0) < minScore) return false;
        return true;
    });

    const copyWebhookUrl = () => {
        navigator.clipboard.writeText(webhookUrl);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-[rgba(0,0,0,0.08)] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center">
                            <Briefcase size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)]">
                                Job Alerts
                            </h2>
                            <p className="text-xs text-[rgba(0,0,0,0.6)]">
                                {jobs.length} jobs tracked
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={cn(
                                "p-2 rounded-full transition-colors",
                                showSettings
                                    ? "bg-[#0A66C2] text-white"
                                    : "hover:bg-[#EEF3F8] text-[rgba(0,0,0,0.6)]"
                            )}
                        >
                            <Settings size={20} />
                        </button>
                        <button
                            onClick={fetchJobs}
                            disabled={isLoading}
                            className="p-2 rounded-full hover:bg-[#EEF3F8] text-[rgba(0,0,0,0.6)] transition-colors"
                        >
                            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-[#EEF3F8] text-[rgba(0,0,0,0.6)] transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                    <div className="p-4 border-b border-[rgba(0,0,0,0.08)] bg-[#F4F2EE]">
                        <h3 className="font-semibold text-sm text-[rgba(0,0,0,0.9)] mb-3">
                            Setup Instructions
                        </h3>

                        <div className="space-y-4">
                            {/* Webhook URL */}
                            <div>
                                <label className="text-xs font-medium text-[rgba(0,0,0,0.6)] block mb-1">
                                    Webhook URL (for Power Automate)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={webhookUrl}
                                        readOnly
                                        className="flex-1 px-3 py-2 text-sm bg-white border border-[rgba(0,0,0,0.15)] rounded-lg font-mono"
                                    />
                                    <button
                                        onClick={copyWebhookUrl}
                                        className="px-3 py-2 text-sm font-semibold text-[#0A66C2] border border-[#0A66C2] rounded-full hover:bg-[#0A66C2]/10 transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            {/* Keywords */}
                            <div>
                                <label className="text-xs font-medium text-[rgba(0,0,0,0.6)] block mb-1">
                                    Target Keywords (for AI matching)
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={newKeyword}
                                        onChange={(e) => setNewKeyword(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                                        placeholder="e.g. React, Senior, Remote..."
                                        className="flex-1 px-3 py-2 text-sm bg-white border border-[rgba(0,0,0,0.15)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                                    />
                                    <button
                                        onClick={addKeyword}
                                        className="p-2 bg-[#0A66C2] text-white rounded-full hover:bg-[#004182] transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {keywords.map((keyword) => (
                                        <span
                                            key={keyword}
                                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-[#0A66C2]/10 text-[#0A66C2] rounded-full"
                                        >
                                            {keyword}
                                            <button
                                                onClick={() => removeKeyword(keyword)}
                                                className="hover:bg-[#0A66C2]/20 rounded-full p-0.5"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                    {keywords.length === 0 && (
                                        <span className="text-xs text-[rgba(0,0,0,0.4)]">
                                            No keywords set - add some to enable AI matching
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="p-4 border-b border-[rgba(0,0,0,0.08)] flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-[rgba(0,0,0,0.6)]" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="text-sm border border-[rgba(0,0,0,0.15)] rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                        >
                            <option value="all">All Jobs</option>
                            <option value="new">New</option>
                            <option value="interested">Interested</option>
                            <option value="applied">Applied</option>
                            <option value="rejected">Rejected</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-[rgba(0,0,0,0.6)]" />
                        <select
                            value={minScore}
                            onChange={(e) => setMinScore(parseInt(e.target.value))}
                            className="text-sm border border-[rgba(0,0,0,0.15)] rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                        >
                            <option value={0}>Any Score</option>
                            <option value={40}>40%+ Match</option>
                            <option value={60}>60%+ Match</option>
                            <option value={80}>80%+ Match</option>
                        </select>
                    </div>
                    <span className="text-xs text-[rgba(0,0,0,0.6)]">
                        Showing {filteredJobs.length} of {jobs.length} jobs
                    </span>
                </div>

                {/* Jobs List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw size={24} className="animate-spin text-[#0A66C2]" />
                        </div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="text-center py-12">
                            <Briefcase size={48} className="mx-auto text-[rgba(0,0,0,0.2)] mb-4" />
                            <p className="text-[rgba(0,0,0,0.6)] mb-2">No jobs yet</p>
                            <p className="text-xs text-[rgba(0,0,0,0.4)]">
                                Set up Power Automate to forward LinkedIn job alerts here
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredJobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="bg-white border border-[rgba(0,0,0,0.08)] rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Company Logo Placeholder */}
                                        <div className="w-12 h-12 bg-[#EEF3F8] rounded-lg flex items-center justify-center shrink-0">
                                            <Building2 size={24} className="text-[rgba(0,0,0,0.4)]" />
                                        </div>

                                        {/* Job Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-semibold text-[rgba(0,0,0,0.9)] hover:text-[#0A66C2] cursor-pointer">
                                                        {job.link ? (
                                                            <a
                                                                href={job.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1"
                                                            >
                                                                {job.title}
                                                                <ExternalLink size={14} />
                                                            </a>
                                                        ) : (
                                                            job.title
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-[rgba(0,0,0,0.6)]">{job.company}</p>
                                                </div>

                                                {/* Score Badge */}
                                                {job.score !== undefined && (
                                                    <div className={cn(
                                                        "px-2 py-1 rounded-full text-xs font-semibold shrink-0",
                                                        getScoreColor(job.score)
                                                    )}>
                                                        {job.score}% match
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 mt-2 text-xs text-[rgba(0,0,0,0.6)]">
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={12} />
                                                    {job.location}
                                                </span>
                                                {job.salary && (
                                                    <span className="text-[#057642] font-medium">
                                                        {job.salary}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    {getStatusIcon(job.status)}
                                                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                                </span>
                                            </div>

                                            {job.scoreReason && (
                                                <p className="text-xs text-[rgba(0,0,0,0.5)] mt-2 italic">
                                                    {job.scoreReason}
                                                </p>
                                            )}

                                            {/* Keywords */}
                                            {job.keywords.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {job.keywords.map((kw) => (
                                                        <span
                                                            key={kw}
                                                            className="px-1.5 py-0.5 text-[10px] bg-[#057642]/10 text-[#057642] rounded"
                                                        >
                                                            {kw}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[rgba(0,0,0,0.08)]">
                                        <button
                                            onClick={() => updateJobStatus(job.id, 'interested')}
                                            className={cn(
                                                "px-3 py-1 text-xs font-semibold rounded-full transition-colors",
                                                job.status === 'interested'
                                                    ? "bg-[#915907] text-white"
                                                    : "text-[#915907] hover:bg-[#915907]/10"
                                            )}
                                        >
                                            <Star size={12} className="inline mr-1" />
                                            Interested
                                        </button>
                                        <button
                                            onClick={() => updateJobStatus(job.id, 'applied')}
                                            className={cn(
                                                "px-3 py-1 text-xs font-semibold rounded-full transition-colors",
                                                job.status === 'applied'
                                                    ? "bg-[#057642] text-white"
                                                    : "text-[#057642] hover:bg-[#057642]/10"
                                            )}
                                        >
                                            <Check size={12} className="inline mr-1" />
                                            Applied
                                        </button>
                                        <button
                                            onClick={() => updateJobStatus(job.id, 'archived')}
                                            className={cn(
                                                "px-3 py-1 text-xs font-semibold rounded-full transition-colors",
                                                job.status === 'archived'
                                                    ? "bg-[rgba(0,0,0,0.6)] text-white"
                                                    : "text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.05)]"
                                            )}
                                        >
                                            <Archive size={12} className="inline mr-1" />
                                            Archive
                                        </button>
                                        <button
                                            onClick={() => deleteJob(job.id)}
                                            className="px-3 py-1 text-xs font-semibold rounded-full text-[#B24020] hover:bg-[#B24020]/10 transition-colors ml-auto"
                                        >
                                            <Trash2 size={12} className="inline mr-1" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
