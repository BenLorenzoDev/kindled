'use client';

import { cn } from '@/lib/utils';
import { X, Loader2, Copy, Check, Users, MessageCircle, Mail, Phone, ChevronRight, Clock, Sparkles, Target } from 'lucide-react';
import { useState } from 'react';

interface CadenceStep {
    step: number;
    name: string;
    timing: string;
    channel: string;
    script: string;
    tips: string;
    charCount?: number;
}

interface Cadence {
    prospect: {
        name: string;
        title?: string;
        context: string;
    };
    steps: CadenceStep[];
}

interface CadenceGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ENGAGEMENT_TYPES = [
    { value: 'liked', label: 'Liked my post', icon: '👍' },
    { value: 'commented', label: 'Commented on my post', icon: '💬' },
    { value: 'shared', label: 'Shared my post', icon: '🔄' },
    { value: 'viewed_profile', label: 'Viewed my profile', icon: '👀' },
];

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
    'LinkedIn': <MessageCircle size={14} />,
    'Email': <Mail size={14} />,
    'Phone': <Phone size={14} />,
    'Call': <Phone size={14} />,
};

const STEP_COLORS = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
];

export function CadenceGeneratorModal({ isOpen, onClose }: CadenceGeneratorModalProps) {
    const [postTopic, setPostTopic] = useState('');
    const [postContent, setPostContent] = useState('');
    const [engagementType, setEngagementType] = useState('');
    const [personName, setPersonName] = useState('');
    const [personTitle, setPersonTitle] = useState('');
    const [personCompany, setPersonCompany] = useState('');
    const [theirComment, setTheirComment] = useState('');
    const [cadence, setCadence] = useState<Cadence | null>(null);
    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedStep, setCopiedStep] = useState<number | null>(null);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        if (!postTopic.trim() || !engagementType) {
            setError('Please enter post topic and select engagement type');
            return;
        }

        setIsLoading(true);
        setError(null);
        setCadence(null);

        try {
            const response = await fetch('/api/generate-cadence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postTopic: postTopic.trim(),
                    postContent: postContent.trim(),
                    engagementType,
                    personName: personName.trim(),
                    personTitle: personTitle.trim(),
                    personCompany: personCompany.trim(),
                    theirComment: theirComment.trim(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate cadence');
            }

            const data = await response.json();
            setCadence(data);
            setActiveStep(0);
        } catch (err) {
            setError('Failed to generate cadence. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async (text: string, stepNum: number) => {
        await navigator.clipboard.writeText(text);
        setCopiedStep(stepNum);
        setTimeout(() => setCopiedStep(null), 2000);
    };

    const handleClose = () => {
        setPostTopic('');
        setPostContent('');
        setEngagementType('');
        setPersonName('');
        setPersonTitle('');
        setPersonCompany('');
        setTheirComment('');
        setCadence(null);
        setActiveStep(0);
        setError(null);
        onClose();
    };

    const handleReset = () => {
        setCadence(null);
        setActiveStep(0);
        setError(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
            <div
                className="w-full max-w-4xl rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col bg-white"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/20">
                            <Target size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Sales Cadence Generator
                            </h2>
                            <p className="text-xs text-white/80">
                                Turn engagement into meetings with personalized outreach
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
                <div className="flex-1 overflow-y-auto">
                    {error && (
                        <div className="m-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {!cadence ? (
                        <div className="p-4 space-y-4">
                            {/* Post Topic */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    What was your post about? *
                                </label>
                                <input
                                    type="text"
                                    value={postTopic}
                                    onChange={(e) => setPostTopic(e.target.value)}
                                    placeholder="e.g., Why sales managers spend too much time on call reviews"
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Post Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Paste your post content <span className="text-gray-400 font-normal">(for more relevant scripts)</span>
                                </label>
                                <textarea
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    placeholder="Paste your LinkedIn post here so the scripts can reference specific points you made..."
                                    rows={4}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Engagement Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    How did they engage? *
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {ENGAGEMENT_TYPES.map((type) => (
                                        <button
                                            key={type.value}
                                            onClick={() => setEngagementType(type.value)}
                                            disabled={isLoading}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all",
                                                engagementType === type.value
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                                            )}
                                        >
                                            <span className="text-lg">{type.icon}</span>
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment (if commented) */}
                            {engagementType === 'commented' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        What did they comment?
                                    </label>
                                    <textarea
                                        value={theirComment}
                                        onChange={(e) => setTheirComment(e.target.value)}
                                        placeholder="Paste their comment here for more personalized scripts..."
                                        rows={2}
                                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none"
                                        disabled={isLoading}
                                    />
                                </div>
                            )}

                            {/* Prospect Info */}
                            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                                <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <Users size={16} />
                                    Prospect Info (optional, for personalization)
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    <input
                                        type="text"
                                        value={personName}
                                        onChange={(e) => setPersonName(e.target.value)}
                                        placeholder="Name"
                                        className="px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 outline-none text-sm"
                                        disabled={isLoading}
                                    />
                                    <input
                                        type="text"
                                        value={personTitle}
                                        onChange={(e) => setPersonTitle(e.target.value)}
                                        placeholder="Title"
                                        className="px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 outline-none text-sm"
                                        disabled={isLoading}
                                    />
                                    <input
                                        type="text"
                                        value={personCompany}
                                        onChange={(e) => setPersonCompany(e.target.value)}
                                        placeholder="Company"
                                        className="px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 outline-none text-sm"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !postTopic.trim() || !engagementType}
                                className="w-full py-3 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Generating 7-Step Cadence...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Generate Outreach Cadence
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="flex h-[500px]">
                            {/* Steps Sidebar */}
                            <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                                <div className="p-3 border-b border-gray-200 bg-white">
                                    <p className="text-xs font-medium text-gray-500">PROSPECT</p>
                                    <p className="text-sm font-semibold text-gray-900">{cadence.prospect.name}</p>
                                    {cadence.prospect.title && (
                                        <p className="text-xs text-gray-500">{cadence.prospect.title}</p>
                                    )}
                                </div>
                                <div className="p-2">
                                    {cadence.steps.map((step, index) => (
                                        <button
                                            key={step.step}
                                            onClick={() => setActiveStep(index)}
                                            className={cn(
                                                "w-full text-left p-3 rounded-lg mb-1 transition-all",
                                                activeStep === index
                                                    ? "bg-white shadow-sm border border-gray-200"
                                                    : "hover:bg-white/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold",
                                                    STEP_COLORS[index % STEP_COLORS.length]
                                                )}>
                                                    {step.step}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {step.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {step.timing}
                                                    </p>
                                                </div>
                                                {activeStep === index && (
                                                    <ChevronRight size={16} className="text-gray-400" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Active Step Content */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {cadence.steps[activeStep] && (
                                    <div className="space-y-4">
                                        {/* Step Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                                                    STEP_COLORS[activeStep % STEP_COLORS.length]
                                                )}>
                                                    {cadence.steps[activeStep].step}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {cadence.steps[activeStep].name}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            {CHANNEL_ICONS[cadence.steps[activeStep].channel] || <MessageCircle size={14} />}
                                                            {cadence.steps[activeStep].channel}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={14} />
                                                            {cadence.steps[activeStep].timing}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleCopy(cadence.steps[activeStep].script, activeStep)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium"
                                            >
                                                {copiedStep === activeStep ? (
                                                    <>
                                                        <Check size={16} />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={16} />
                                                        Copy Script
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Script */}
                                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                {cadence.steps[activeStep].script}
                                            </p>
                                            {cadence.steps[activeStep].charCount && (
                                                <p className="text-xs text-gray-400 mt-2">
                                                    {cadence.steps[activeStep].charCount} characters
                                                </p>
                                            )}
                                        </div>

                                        {/* Tips */}
                                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                                            <p className="text-xs font-medium text-amber-700 mb-1">💡 Pro Tip</p>
                                            <p className="text-sm text-amber-800">{cadence.steps[activeStep].tips}</p>
                                        </div>

                                        {/* Navigation */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <button
                                                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                                                disabled={activeStep === 0}
                                                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            >
                                                ← Previous Step
                                            </button>
                                            <span className="text-sm text-gray-400">
                                                Step {activeStep + 1} of {cadence.steps.length}
                                            </span>
                                            <button
                                                onClick={() => setActiveStep(Math.min(cadence.steps.length - 1, activeStep + 1))}
                                                disabled={activeStep === cadence.steps.length - 1}
                                                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Next Step →
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cadence && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-white transition-colors"
                        >
                            Generate New Cadence
                        </button>
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
