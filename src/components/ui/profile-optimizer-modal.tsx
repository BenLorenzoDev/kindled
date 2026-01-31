'use client';

import { cn } from '@/lib/utils';
import { X, User, Loader2, Copy, Check, Sparkles, Briefcase, Award, Zap, Upload, FileText, AlertTriangle, Clock } from 'lucide-react';
import { useState, useRef } from 'react';

interface OptimizedExperience {
    optimizedBullets: string[];
    headline: string;
    keySkills: string[];
    tips: string;
}

interface ResumeExperience {
    originalTitle: string;
    optimizedTitle: string;
    company: string;
    duration: string;
    isShortTenure: boolean;
    reframedAs?: string;
    bullets: string[];
    keySkills: string[];
}

interface OptimizedResume {
    summary: string;
    headline: string;
    experiences: ResumeExperience[];
    overallTips: string;
}

interface ProfileOptimizerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'single' | 'resume';

export function ProfileOptimizerModal({ isOpen, onClose }: ProfileOptimizerModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>('resume');

    // Single experience state
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [optimized, setOptimized] = useState<OptimizedExperience | null>(null);

    // Resume upload state
    const [resumeText, setResumeText] = useState('');
    const [fileName, setFileName] = useState('');
    const [optimizedResume, setOptimizedResume] = useState<OptimizedResume | null>(null);
    const [expandedExp, setExpandedExp] = useState<number | null>(0);

    // Shared state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        setResumeText('');
        setFileName('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/parse-resume', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to parse resume');
            }

            const data = await response.json();
            setResumeText(data.text);
            setFileName(data.fileName);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to parse file');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptimizeResume = async () => {
        if (!resumeText.trim()) {
            setError('Please upload a resume first');
            return;
        }

        setIsLoading(true);
        setError(null);
        setOptimizedResume(null);

        try {
            const response = await fetch('/api/optimize-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeText }),
            });

            if (!response.ok) {
                throw new Error('Failed to optimize resume');
            }

            const data = await response.json();
            setOptimizedResume(data);
            setExpandedExp(0);
        } catch (err) {
            setError('Failed to optimize resume. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptimizeSingle = async () => {
        if (!jobTitle.trim() || !description.trim()) {
            setError('Please enter at least a job title and description');
            return;
        }

        setIsLoading(true);
        setError(null);
        setOptimized(null);

        try {
            const response = await fetch('/api/optimize-experience', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobTitle: jobTitle.trim(),
                    company: company.trim(),
                    duration: duration.trim(),
                    description: description.trim(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to optimize experience');
            }

            const data = await response.json();
            setOptimized(data);
        } catch (err) {
            setError('Failed to optimize. Please try again.');
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

    const handleCopyExperience = async (exp: ResumeExperience, index: number) => {
        const text = `${exp.optimizedTitle} at ${exp.company}\n${exp.duration}\n\n${exp.bullets.map(b => `• ${b}`).join('\n')}`;
        await handleCopy(text, `exp-${index}`);
    };

    const handleCopyAllResume = async () => {
        if (!optimizedResume) return;

        let text = `${optimizedResume.headline}\n\n${optimizedResume.summary}\n\n`;
        text += optimizedResume.experiences.map(exp =>
            `${exp.optimizedTitle} at ${exp.company}\n${exp.duration}\n${exp.bullets.map(b => `• ${b}`).join('\n')}`
        ).join('\n\n---\n\n');

        await handleCopy(text, 'all-resume');
    };

    const handleClose = () => {
        setJobTitle('');
        setCompany('');
        setDuration('');
        setDescription('');
        setOptimized(null);
        setResumeText('');
        setFileName('');
        setOptimizedResume(null);
        setError(null);
        onClose();
    };

    const handleReset = () => {
        if (activeTab === 'single') {
            setOptimized(null);
        } else {
            setOptimizedResume(null);
            setResumeText('');
            setFileName('');
        }
        setError(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
            <div
                className="w-full max-w-3xl rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col bg-white"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-violet-500 to-purple-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/20">
                            <User size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Profile Optimizer
                            </h2>
                            <p className="text-xs text-white/80">
                                Transform your experience into recruiter-magnet content
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

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('resume')}
                        className={cn(
                            "flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2",
                            activeTab === 'resume'
                                ? "text-violet-600 border-b-2 border-violet-500 bg-violet-50"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        )}
                    >
                        <Upload size={16} />
                        Upload Resume
                    </button>
                    <button
                        onClick={() => setActiveTab('single')}
                        className={cn(
                            "flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2",
                            activeTab === 'single'
                                ? "text-violet-600 border-b-2 border-violet-500 bg-violet-50"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        )}
                    >
                        <Briefcase size={16} />
                        Single Experience
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-4 flex items-center gap-2">
                            <AlertTriangle size={16} />
                            {error}
                        </div>
                    )}

                    {/* Resume Upload Tab */}
                    {activeTab === 'resume' && !optimizedResume && (
                        <div className="space-y-4">
                            {/* File Upload */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                                    resumeText
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-300 hover:border-violet-400 hover:bg-violet-50"
                                )}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx,.txt"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                {isLoading ? (
                                    <div className="flex flex-col items-center">
                                        <Loader2 size={32} className="animate-spin text-violet-500 mb-2" />
                                        <p className="text-sm text-gray-600">Parsing resume...</p>
                                    </div>
                                ) : resumeText ? (
                                    <div className="flex flex-col items-center">
                                        <FileText size={32} className="text-green-500 mb-2" />
                                        <p className="text-sm font-medium text-green-700">{fileName}</p>
                                        <p className="text-xs text-green-600 mt-1">
                                            {resumeText.length.toLocaleString()} characters extracted
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">Click to upload a different file</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Upload size={32} className="text-gray-400 mb-2" />
                                        <p className="text-sm font-medium text-gray-700">
                                            Drop your resume here or click to upload
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Supports PDF, DOC, DOCX, and TXT files
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Or paste text */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-2 bg-white text-gray-500">or paste your resume text</span>
                                </div>
                            </div>

                            <textarea
                                value={resumeText}
                                onChange={(e) => {
                                    setResumeText(e.target.value);
                                    setFileName('');
                                }}
                                placeholder="Paste your LinkedIn profile or resume text here..."
                                rows={8}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm resize-none"
                                disabled={isLoading}
                            />

                            <button
                                onClick={handleOptimizeResume}
                                disabled={isLoading || !resumeText.trim()}
                                className="w-full py-3 rounded-lg font-medium bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Analyzing & Optimizing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Optimize Full Resume
                                    </>
                                )}
                            </button>

                            {/* What it does */}
                            <div className="p-4 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
                                <p className="text-sm font-medium text-violet-800 mb-2">What this does:</p>
                                <ul className="text-xs text-violet-700 space-y-1.5">
                                    <li className="flex items-start gap-2">
                                        <Zap size={12} className="mt-0.5 flex-shrink-0" />
                                        Rewrites each experience with <strong>Pain → Solution → Result</strong> framework
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Clock size={12} className="mt-0.5 flex-shrink-0" />
                                        Reframes short tenures (&lt;1 year) as <strong>strategic consulting engagements</strong>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Award size={12} className="mt-0.5 flex-shrink-0" />
                                        Adds metrics and quantifiable achievements to every bullet
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <User size={12} className="mt-0.5 flex-shrink-0" />
                                        Generates a compelling headline and professional summary
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Resume Results */}
                    {activeTab === 'resume' && optimizedResume && (
                        <div className="space-y-4">
                            {/* Summary & Headline */}
                            <div className="p-4 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-medium text-violet-600">OPTIMIZED HEADLINE</p>
                                    <button
                                        onClick={() => handleCopy(optimizedResume.headline, 'headline')}
                                        className="text-xs text-violet-500 hover:text-violet-700"
                                    >
                                        {copiedField === 'headline' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                    </button>
                                </div>
                                <p className="text-sm font-semibold text-violet-900 mb-4">{optimizedResume.headline}</p>

                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-medium text-violet-600">PROFESSIONAL SUMMARY</p>
                                    <button
                                        onClick={() => handleCopy(optimizedResume.summary, 'summary')}
                                        className="text-xs text-violet-500 hover:text-violet-700"
                                    >
                                        {copiedField === 'summary' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                    </button>
                                </div>
                                <p className="text-sm text-violet-800">{optimizedResume.summary}</p>
                            </div>

                            {/* Copy All Button */}
                            <button
                                onClick={handleCopyAllResume}
                                className="w-full py-2 rounded-lg text-sm font-medium border border-violet-300 text-violet-700 hover:bg-violet-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {copiedField === 'all-resume' ? (
                                    <>
                                        <Check size={16} className="text-green-500" />
                                        Copied All!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} />
                                        Copy Entire Optimized Resume
                                    </>
                                )}
                            </button>

                            {/* Experiences */}
                            <div className="space-y-3">
                                <p className="text-xs font-medium text-gray-500">WORK EXPERIENCES ({optimizedResume.experiences.length})</p>

                                {optimizedResume.experiences.map((exp, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg overflow-hidden"
                                    >
                                        <button
                                            onClick={() => setExpandedExp(expandedExp === index ? null : index)}
                                            className="w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <span className="font-medium text-gray-900">{exp.optimizedTitle}</span>
                                                        {exp.isShortTenure && (
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                                                {exp.reframedAs || 'Consulting'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">{exp.company}</p>
                                                    <p className="text-xs text-gray-400">{exp.duration}</p>
                                                </div>
                                                <div className="text-gray-400">
                                                    {expandedExp === index ? '−' : '+'}
                                                </div>
                                            </div>
                                        </button>

                                        {expandedExp === index && (
                                            <div className="border-t border-gray-200 p-4 bg-gray-50">
                                                {exp.isShortTenure && (
                                                    <div className="mb-3 p-2 rounded bg-amber-50 border border-amber-200 text-xs text-amber-700 flex items-center gap-2">
                                                        <Clock size={12} />
                                                        Reframed as: <strong>{exp.reframedAs}</strong> to highlight strategic value
                                                    </div>
                                                )}

                                                <ul className="space-y-2 mb-4">
                                                    {exp.bullets.map((bullet, bIndex) => (
                                                        <li key={bIndex} className="flex items-start gap-2 text-sm text-gray-700 group">
                                                            <span className="text-violet-500 mt-0.5">•</span>
                                                            <span className="flex-1">{bullet}</span>
                                                            <button
                                                                onClick={() => handleCopy(bullet, `bullet-${index}-${bIndex}`)}
                                                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
                                                            >
                                                                {copiedField === `bullet-${index}-${bIndex}` ? (
                                                                    <Check size={14} className="text-green-500" />
                                                                ) : (
                                                                    <Copy size={14} />
                                                                )}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-wrap gap-1">
                                                        {exp.keySkills.map((skill, sIndex) => (
                                                            <span key={sIndex} className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <button
                                                        onClick={() => handleCopyExperience(exp, index)}
                                                        className="text-xs px-2 py-1 rounded bg-violet-100 text-violet-700 hover:bg-violet-200 flex items-center gap-1"
                                                    >
                                                        {copiedField === `exp-${index}` ? (
                                                            <>
                                                                <Check size={12} />
                                                                Copied!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy size={12} />
                                                                Copy This
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Tips */}
                            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-xs font-medium text-amber-700 mb-1">Pro Tips for Your Profile</p>
                                <p className="text-xs text-amber-600">{optimizedResume.overallTips}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleReset}
                                    className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    Upload Another Resume
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Single Experience Tab - Input */}
                    {activeTab === 'single' && !optimized && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Job Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        placeholder="e.g., Sales Manager"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        placeholder="e.g., Acme Corp"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration
                                </label>
                                <input
                                    type="text"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    placeholder="e.g., Jan 2020 - Present (4 years)"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Description / Duties *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Paste your current job description or list your duties here..."
                                    rows={6}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm resize-none"
                                    disabled={isLoading}
                                />
                            </div>

                            <button
                                onClick={handleOptimizeSingle}
                                disabled={isLoading || !jobTitle.trim() || !description.trim()}
                                className="w-full py-3 rounded-lg font-medium bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Optimizing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Optimize Experience
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Single Experience Tab - Results */}
                    {activeTab === 'single' && optimized && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Briefcase size={16} className="text-violet-600" />
                                    <span className="text-sm font-medium text-violet-700">{jobTitle}</span>
                                    {company && <span className="text-sm text-violet-500">at {company}</span>}
                                </div>
                                {duration && <p className="text-xs text-violet-500">{duration}</p>}
                            </div>

                            <div className="p-4 rounded-lg bg-white border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Zap size={14} className="text-amber-500" />
                                        <p className="text-xs font-medium text-gray-500">SUGGESTED HEADLINE</p>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(optimized.headline, 'single-headline')}
                                        className="text-xs text-gray-400 hover:text-gray-600"
                                    >
                                        {copiedField === 'single-headline' ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                    </button>
                                </div>
                                <p className="text-sm text-gray-800 font-medium">{optimized.headline}</p>
                            </div>

                            <div className="p-4 rounded-lg bg-white border border-gray-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <Award size={14} className="text-violet-500" />
                                    <p className="text-xs font-medium text-gray-500">OPTIMIZED BULLETS</p>
                                </div>
                                <ul className="space-y-2">
                                    {optimized.optimizedBullets.map((bullet, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700 group">
                                            <span className="text-violet-500 mt-0.5">•</span>
                                            <span className="flex-1">{bullet}</span>
                                            <button
                                                onClick={() => handleCopy(bullet, `single-bullet-${index}`)}
                                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
                                            >
                                                {copiedField === `single-bullet-${index}` ? (
                                                    <Check size={14} className="text-green-500" />
                                                ) : (
                                                    <Copy size={14} />
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-4 rounded-lg bg-white border border-gray-200">
                                <p className="text-xs font-medium text-gray-500 mb-2">KEY SKILLS</p>
                                <div className="flex flex-wrap gap-2">
                                    {optimized.keySkills.map((skill, index) => (
                                        <span key={index} className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-xs font-medium text-amber-700 mb-1">Pro Tip</p>
                                <p className="text-xs text-amber-600">{optimized.tips}</p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleReset}
                                    className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    Optimize Another
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 transition-all"
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
