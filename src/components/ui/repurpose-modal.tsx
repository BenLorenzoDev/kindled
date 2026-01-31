'use client';

import { cn } from '@/lib/utils';
import { X, Loader2, Copy, Check, Twitter, Mail, Instagram, Video, FileText, Repeat, Send } from 'lucide-react';
import { useState } from 'react';

interface EmailContent {
    subjectLine: string;
    body: string;
}

interface BlogSection {
    heading: string;
    points: string[];
}

interface BlogOutline {
    title: string;
    metaDescription: string;
    sections: BlogSection[];
}

interface ColdEmail {
    subjectLines: string[];
    body: string;
}

interface RepurposeResult {
    twitterThread: string;
    emailNewsletter: EmailContent;
    instagramCarousel: string[];
    videoScript: string;
    blogOutline: BlogOutline;
    coldEmail: ColdEmail;
}

type TabType = 'twitter' | 'email' | 'instagram' | 'video' | 'blog' | 'coldemail';

interface RepurposeModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: string;
    isDark?: boolean;
}

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'coldemail', label: 'Cold Email', icon: <Send size={16} /> },
    { id: 'twitter', label: 'Twitter/X', icon: <Twitter size={16} /> },
    { id: 'email', label: 'Newsletter', icon: <Mail size={16} /> },
    { id: 'instagram', label: 'Carousel', icon: <Instagram size={16} /> },
    { id: 'video', label: 'Video', icon: <Video size={16} /> },
    { id: 'blog', label: 'Blog', icon: <FileText size={16} /> },
];

export function RepurposeModal({ isOpen, onClose, content, isDark = false }: RepurposeModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>('coldemail');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<RepurposeResult | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleRepurpose = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/repurpose-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error('Repurpose failed:', err);
            setError(err instanceof Error ? err.message : 'Failed to repurpose content');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async (text: string, key: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleClose = () => {
        setResult(null);
        setError(null);
        onClose();
    };

    const renderContent = () => {
        if (!result) return null;

        switch (activeTab) {
            case 'twitter':
                return (
                    <div className="space-y-3">
                        <div className="flex justify-end">
                            <button
                                onClick={() => handleCopy(result.twitterThread, 'twitter')}
                                className={cn(
                                    "text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors",
                                    copied === 'twitter'
                                        ? "text-green-500"
                                        : isDark
                                            ? "text-neutral-400 hover:text-neutral-200"
                                            : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {copied === 'twitter' ? <Check size={14} /> : <Copy size={14} />}
                                {copied === 'twitter' ? 'Copied!' : 'Copy All'}
                            </button>
                        </div>
                        <div className={cn(
                            "p-4 rounded-lg text-sm whitespace-pre-wrap leading-relaxed",
                            isDark ? "bg-neutral-700 text-neutral-100" : "bg-blue-50 text-gray-800"
                        )}>
                            {result.twitterThread}
                        </div>
                    </div>
                );

            case 'email':
                return (
                    <div className="space-y-3">
                        <div className={cn(
                            "p-3 rounded-lg",
                            isDark ? "bg-neutral-700" : "bg-amber-50"
                        )}>
                            <div className="flex items-center justify-between mb-1">
                                <span className={cn("text-xs font-medium", isDark ? "text-neutral-400" : "text-amber-700")}>
                                    Subject Line
                                </span>
                                <button
                                    onClick={() => handleCopy(result.emailNewsletter.subjectLine, 'subject')}
                                    className={cn(
                                        "text-xs px-1.5 py-0.5 rounded flex items-center gap-1",
                                        copied === 'subject' ? "text-green-500" : isDark ? "text-neutral-400" : "text-amber-600"
                                    )}
                                >
                                    {copied === 'subject' ? <Check size={12} /> : <Copy size={12} />}
                                </button>
                            </div>
                            <p className={cn("text-sm font-medium", isDark ? "text-neutral-100" : "text-gray-800")}>
                                {result.emailNewsletter.subjectLine}
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => handleCopy(result.emailNewsletter.body, 'email')}
                                className={cn(
                                    "text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors",
                                    copied === 'email'
                                        ? "text-green-500"
                                        : isDark
                                            ? "text-neutral-400 hover:text-neutral-200"
                                            : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {copied === 'email' ? <Check size={14} /> : <Copy size={14} />}
                                {copied === 'email' ? 'Copied!' : 'Copy Body'}
                            </button>
                        </div>
                        <div className={cn(
                            "p-4 rounded-lg text-sm whitespace-pre-wrap leading-relaxed",
                            isDark ? "bg-neutral-700 text-neutral-100" : "bg-gray-50 text-gray-800"
                        )}>
                            {result.emailNewsletter.body}
                        </div>
                    </div>
                );

            case 'instagram':
                return (
                    <div className="space-y-3">
                        <div className="flex justify-end">
                            <button
                                onClick={() => handleCopy(result.instagramCarousel.join('\n\n---\n\n'), 'instagram')}
                                className={cn(
                                    "text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors",
                                    copied === 'instagram'
                                        ? "text-green-500"
                                        : isDark
                                            ? "text-neutral-400 hover:text-neutral-200"
                                            : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {copied === 'instagram' ? <Check size={14} /> : <Copy size={14} />}
                                {copied === 'instagram' ? 'Copied!' : 'Copy All'}
                            </button>
                        </div>
                        <div className="grid gap-2">
                            {result.instagramCarousel.map((slide, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "p-3 rounded-lg",
                                        isDark ? "bg-neutral-700" : "bg-gradient-to-r from-pink-50 to-purple-50"
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={cn(
                                            "text-xs font-bold px-2 py-0.5 rounded-full",
                                            isDark ? "bg-pink-900/50 text-pink-300" : "bg-pink-100 text-pink-700"
                                        )}>
                                            Slide {i + 1}
                                        </span>
                                        <button
                                            onClick={() => handleCopy(slide, `slide-${i}`)}
                                            className={cn(
                                                "text-xs px-1.5 py-0.5 rounded flex items-center gap-1",
                                                copied === `slide-${i}` ? "text-green-500" : isDark ? "text-neutral-400" : "text-pink-600"
                                            )}
                                        >
                                            {copied === `slide-${i}` ? <Check size={12} /> : <Copy size={12} />}
                                        </button>
                                    </div>
                                    <p className={cn("text-sm", isDark ? "text-neutral-100" : "text-gray-800")}>
                                        {slide}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'video':
                return (
                    <div className="space-y-3">
                        <div className="flex justify-end">
                            <button
                                onClick={() => handleCopy(result.videoScript, 'video')}
                                className={cn(
                                    "text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors",
                                    copied === 'video'
                                        ? "text-green-500"
                                        : isDark
                                            ? "text-neutral-400 hover:text-neutral-200"
                                            : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {copied === 'video' ? <Check size={14} /> : <Copy size={14} />}
                                {copied === 'video' ? 'Copied!' : 'Copy Script'}
                            </button>
                        </div>
                        <div className={cn(
                            "p-4 rounded-lg text-sm whitespace-pre-wrap leading-relaxed",
                            isDark ? "bg-neutral-700 text-neutral-100" : "bg-red-50 text-gray-800"
                        )}>
                            {result.videoScript}
                        </div>
                    </div>
                );

            case 'blog':
                const blogText = `# ${result.blogOutline.title}\n\n${result.blogOutline.metaDescription}\n\n${result.blogOutline.sections.map(s => `## ${s.heading}\n${s.points.map(p => `- ${p}`).join('\n')}`).join('\n\n')}`;
                return (
                    <div className="space-y-3">
                        <div className={cn(
                            "p-3 rounded-lg",
                            isDark ? "bg-neutral-700" : "bg-green-50"
                        )}>
                            <span className={cn("text-xs font-medium", isDark ? "text-neutral-400" : "text-green-700")}>
                                Meta Description
                            </span>
                            <p className={cn("text-sm mt-1", isDark ? "text-neutral-100" : "text-gray-800")}>
                                {result.blogOutline.metaDescription}
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => handleCopy(blogText, 'blog')}
                                className={cn(
                                    "text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors",
                                    copied === 'blog'
                                        ? "text-green-500"
                                        : isDark
                                            ? "text-neutral-400 hover:text-neutral-200"
                                            : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {copied === 'blog' ? <Check size={14} /> : <Copy size={14} />}
                                {copied === 'blog' ? 'Copied!' : 'Copy Outline'}
                            </button>
                        </div>
                        <div className={cn(
                            "p-4 rounded-lg",
                            isDark ? "bg-neutral-700" : "bg-gray-50"
                        )}>
                            <h3 className={cn("text-lg font-bold mb-3", isDark ? "text-neutral-100" : "text-gray-900")}>
                                {result.blogOutline.title}
                            </h3>
                            {result.blogOutline.sections.map((section, i) => (
                                <div key={i} className="mb-4 last:mb-0">
                                    <h4 className={cn("text-sm font-semibold mb-2", isDark ? "text-neutral-200" : "text-gray-700")}>
                                        {section.heading}
                                    </h4>
                                    <ul className="space-y-1">
                                        {section.points.map((point, j) => (
                                            <li key={j} className={cn("text-sm flex items-start gap-2", isDark ? "text-neutral-300" : "text-gray-600")}>
                                                <span className="text-green-500 mt-1">•</span>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'coldemail':
                const wordCount = result.coldEmail?.body?.split(/\s+/).filter(Boolean).length || 0;
                return (
                    <div className="space-y-4">
                        {/* Subject Line Options */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className={cn(
                                    "text-sm font-semibold",
                                    isDark ? "text-neutral-200" : "text-gray-700"
                                )}>
                                    Subject Lines (pick one)
                                </span>
                            </div>
                            <div className="space-y-2">
                                {result.coldEmail?.subjectLines?.map((subject, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "p-3 rounded-lg flex items-center justify-between group cursor-pointer transition-all",
                                            isDark
                                                ? "bg-neutral-700 hover:bg-neutral-600"
                                                : "bg-orange-50 hover:bg-orange-100"
                                        )}
                                        onClick={() => handleCopy(subject, `subject-${i}`)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-xs font-bold px-2 py-0.5 rounded-full",
                                                isDark ? "bg-orange-900/50 text-orange-300" : "bg-orange-200 text-orange-700"
                                            )}>
                                                {i + 1}
                                            </span>
                                            <span className={cn(
                                                "text-sm",
                                                isDark ? "text-neutral-100" : "text-gray-800"
                                            )}>
                                                {subject}
                                            </span>
                                        </div>
                                        <span className={cn(
                                            "text-xs opacity-0 group-hover:opacity-100 transition-opacity",
                                            copied === `subject-${i}` ? "text-green-500" : isDark ? "text-neutral-400" : "text-gray-500"
                                        )}>
                                            {copied === `subject-${i}` ? 'Copied!' : 'Click to copy'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Email Body */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-sm font-semibold",
                                        isDark ? "text-neutral-200" : "text-gray-700"
                                    )}>
                                        Email Body
                                    </span>
                                    <span className={cn(
                                        "text-xs px-2 py-0.5 rounded-full",
                                        wordCount <= 80
                                            ? isDark ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
                                            : isDark ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-700"
                                    )}>
                                        {wordCount} words {wordCount <= 80 ? '✓' : '(over 80)'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleCopy(result.coldEmail?.body || '', 'coldemail')}
                                    className={cn(
                                        "text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors",
                                        copied === 'coldemail'
                                            ? "text-green-500"
                                            : isDark
                                                ? "text-neutral-400 hover:text-neutral-200"
                                                : "text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    {copied === 'coldemail' ? <Check size={14} /> : <Copy size={14} />}
                                    {copied === 'coldemail' ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <div className={cn(
                                "p-4 rounded-lg text-sm whitespace-pre-wrap leading-relaxed",
                                isDark ? "bg-neutral-700 text-neutral-100" : "bg-gray-50 text-gray-800"
                            )}>
                                {result.coldEmail?.body}
                            </div>
                        </div>

                        {/* A-Game Tips */}
                        <div className={cn(
                            "p-3 rounded-lg text-xs",
                            isDark ? "bg-orange-900/20 text-orange-300" : "bg-orange-50 text-orange-700"
                        )}>
                            <span className="font-semibold">A-Game Tips:</span> Send like you&apos;re checking in on an old friend. No pitch, just curiosity. Keep it real.
                        </div>
                    </div>
                );
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
                            <Repeat size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className={cn(
                                "text-lg font-semibold",
                                isDark ? "text-neutral-100" : "text-gray-900"
                            )}>
                                Content Repurposing Engine
                            </h2>
                            <p className={cn(
                                "text-xs",
                                isDark ? "text-neutral-400" : "text-gray-500"
                            )}>
                                Turn 1 post into 5 pieces of content
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
                <div className="flex-1 overflow-y-auto">
                    {!result ? (
                        <div className="p-6 space-y-4">
                            <div className={cn(
                                "p-4 rounded-lg text-sm whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto",
                                isDark ? "bg-neutral-700 text-neutral-100" : "bg-gray-50 text-gray-800"
                            )}>
                                {content}
                            </div>

                            {error && (
                                <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleRepurpose}
                                disabled={isLoading}
                                className={cn(
                                    "w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                                    isLoading
                                        ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
                                        : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
                                )}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Generating 5 formats...
                                    </>
                                ) : (
                                    <>
                                        <Repeat size={18} />
                                        Repurpose This Post
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            {/* Tabs */}
                            <div className={cn(
                                "flex border-b px-4",
                                isDark ? "border-neutral-700" : "border-gray-200"
                            )}>
                                {TABS.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                                            activeTab === tab.id
                                                ? isDark
                                                    ? "border-cyan-500 text-cyan-400"
                                                    : "border-blue-500 text-blue-600"
                                                : isDark
                                                    ? "border-transparent text-neutral-400 hover:text-neutral-200"
                                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                        )}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {renderContent()}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {result && (
                    <div className={cn(
                        "p-3 border-t",
                        isDark ? "border-neutral-700" : "border-gray-200"
                    )}>
                        <button
                            onClick={handleClose}
                            className={cn(
                                "w-full py-2 text-sm font-medium rounded-lg transition-colors",
                                isDark
                                    ? "bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
