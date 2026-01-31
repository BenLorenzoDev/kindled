'use client';

import { cn } from '@/lib/utils';
import { X, TrendingUp, MessageSquare, Heart, Copy, Check, ChevronRight, Repeat, Eye } from 'lucide-react';
import { useState } from 'react';
import { VIRAL_TEMPLATES, type ViralTemplate } from '@/lib/viral-templates';

interface ViralTemplatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRepurpose: (post: string) => void;
    isDark?: boolean;
}

export function ViralTemplatesModal({ isOpen, onClose, onRepurpose, isDark = false }: ViralTemplatesModalProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<ViralTemplate | null>(null);
    const [copied, setCopied] = useState(false);
    const [showFullPost, setShowFullPost] = useState(false);

    if (!isOpen) return null;

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = () => {
        setSelectedTemplate(null);
        setShowFullPost(false);
        onClose();
    };

    const getEngagementColor = (potential: string) => {
        if (potential === 'Viral') return isDark ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-100';
        return isDark ? 'text-blue-400 bg-blue-900/30' : 'text-blue-600 bg-blue-100';
    };

    const handleRepurpose = () => {
        if (selectedTemplate) {
            onRepurpose(selectedTemplate.examplePost);
            handleClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
            <div
                className={cn(
                    "w-full max-w-4xl rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col",
                    isDark ? "bg-neutral-800" : "bg-white"
                )}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={cn(
                    "p-4 border-b flex items-center justify-between",
                    isDark ? "border-neutral-700" : "border-gray-200"
                )}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                            <TrendingUp size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className={cn(
                                "text-lg font-semibold",
                                isDark ? "text-neutral-100" : "text-gray-900"
                            )}>
                                Top 10 Viral Templates
                            </h2>
                            <p className={cn(
                                "text-xs",
                                isDark ? "text-neutral-400" : "text-gray-500"
                            )}>
                                Proven frameworks with AI + Human loop magic
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
                <div className="flex-1 overflow-hidden flex">
                    {/* Template List */}
                    <div className={cn(
                        "w-1/3 border-r overflow-y-auto",
                        isDark ? "border-neutral-700" : "border-gray-200"
                    )}>
                        {VIRAL_TEMPLATES.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => {
                                    setSelectedTemplate(template);
                                    setShowFullPost(false);
                                }}
                                className={cn(
                                    "w-full p-3 text-left border-b transition-colors",
                                    isDark ? "border-neutral-700" : "border-gray-100",
                                    selectedTemplate?.id === template.id
                                        ? isDark ? "bg-neutral-700" : "bg-amber-50"
                                        : isDark ? "hover:bg-neutral-700/50" : "hover:bg-gray-50"
                                )}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={cn(
                                                "text-xs font-bold px-1.5 py-0.5 rounded",
                                                isDark ? "bg-amber-900/50 text-amber-300" : "bg-amber-100 text-amber-700"
                                            )}>
                                                #{template.id}
                                            </span>
                                            <span className={cn(
                                                "text-xs px-1.5 py-0.5 rounded",
                                                getEngagementColor(template.engagementPotential)
                                            )}>
                                                {template.engagementPotential}
                                            </span>
                                        </div>
                                        <h3 className={cn(
                                            "text-sm font-medium truncate",
                                            isDark ? "text-neutral-100" : "text-gray-900"
                                        )}>
                                            {template.title}
                                        </h3>
                                        <p className={cn(
                                            "text-xs truncate mt-0.5",
                                            isDark ? "text-neutral-400" : "text-gray-500"
                                        )}>
                                            {template.hookType}
                                        </p>
                                    </div>
                                    <ChevronRight size={16} className={cn(
                                        "flex-shrink-0 mt-1",
                                        isDark ? "text-neutral-500" : "text-gray-400"
                                    )} />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Template Detail */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {selectedTemplate ? (
                            <div className="space-y-4">
                                {/* Title & Stats */}
                                <div>
                                    <h3 className={cn(
                                        "text-xl font-bold mb-2",
                                        isDark ? "text-neutral-100" : "text-gray-900"
                                    )}>
                                        {selectedTemplate.title}
                                    </h3>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className={cn(
                                            "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                                            getEngagementColor(selectedTemplate.engagementPotential)
                                        )}>
                                            <TrendingUp size={12} />
                                            {selectedTemplate.engagementPotential}
                                        </span>
                                        <span className={cn(
                                            "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                                            isDark ? "bg-pink-900/30 text-pink-400" : "bg-pink-100 text-pink-600"
                                        )}>
                                            <Heart size={12} />
                                            {selectedTemplate.avgLikes} likes
                                        </span>
                                        <span className={cn(
                                            "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                                            isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"
                                        )}>
                                            <MessageSquare size={12} />
                                            {selectedTemplate.avgComments} comments
                                        </span>
                                    </div>
                                </div>

                                {/* Framework */}
                                <div className={cn(
                                    "p-3 rounded-lg",
                                    isDark ? "bg-neutral-700" : "bg-gray-50"
                                )}>
                                    <h4 className={cn(
                                        "text-xs font-semibold mb-1",
                                        isDark ? "text-neutral-400" : "text-gray-500"
                                    )}>
                                        FRAMEWORK
                                    </h4>
                                    <p className={cn(
                                        "text-sm font-medium",
                                        isDark ? "text-neutral-100" : "text-gray-800"
                                    )}>
                                        {selectedTemplate.framework}
                                    </p>
                                </div>

                                {/* Why It Works */}
                                <div className={cn(
                                    "p-3 rounded-lg",
                                    isDark ? "bg-amber-900/20" : "bg-amber-50"
                                )}>
                                    <h4 className={cn(
                                        "text-xs font-semibold mb-1",
                                        isDark ? "text-amber-400" : "text-amber-700"
                                    )}>
                                        WHY IT WORKS
                                    </h4>
                                    <p className={cn(
                                        "text-sm",
                                        isDark ? "text-amber-200" : "text-amber-800"
                                    )}>
                                        {selectedTemplate.whyItWorks}
                                    </p>
                                </div>

                                {/* Emotional Triggers */}
                                <div>
                                    <h4 className={cn(
                                        "text-xs font-semibold mb-2",
                                        isDark ? "text-neutral-400" : "text-gray-500"
                                    )}>
                                        EMOTIONAL TRIGGERS
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTemplate.emotionalTriggers.map((trigger, i) => (
                                            <span key={i} className={cn(
                                                "text-xs px-2 py-1 rounded-full",
                                                isDark ? "bg-purple-900/30 text-purple-300" : "bg-purple-100 text-purple-700"
                                            )}>
                                                {trigger}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* DNA */}
                                <div>
                                    <h4 className={cn(
                                        "text-xs font-semibold mb-2",
                                        isDark ? "text-neutral-400" : "text-gray-500"
                                    )}>
                                        DNA / STRUCTURE
                                    </h4>
                                    <ul className="space-y-1">
                                        {selectedTemplate.dna.map((item, i) => (
                                            <li key={i} className={cn(
                                                "text-sm flex items-start gap-2",
                                                isDark ? "text-neutral-300" : "text-gray-600"
                                            )}>
                                                <span className="text-amber-500 mt-0.5">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Example Post */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className={cn(
                                            "text-xs font-semibold",
                                            isDark ? "text-neutral-400" : "text-gray-500"
                                        )}>
                                            EXAMPLE POST
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setShowFullPost(!showFullPost)}
                                                className={cn(
                                                    "text-xs px-2 py-1 rounded flex items-center gap-1",
                                                    isDark ? "text-neutral-400 hover:text-neutral-200" : "text-gray-500 hover:text-gray-700"
                                                )}
                                            >
                                                <Eye size={12} />
                                                {showFullPost ? 'Collapse' : 'Expand'}
                                            </button>
                                            <button
                                                onClick={() => handleCopy(selectedTemplate.examplePost)}
                                                className={cn(
                                                    "text-xs px-2 py-1 rounded flex items-center gap-1",
                                                    copied
                                                        ? "text-green-500"
                                                        : isDark ? "text-neutral-400 hover:text-neutral-200" : "text-gray-500 hover:text-gray-700"
                                                )}
                                            >
                                                {copied ? <Check size={12} /> : <Copy size={12} />}
                                                {copied ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-lg text-sm whitespace-pre-wrap leading-relaxed overflow-hidden transition-all",
                                        isDark ? "bg-neutral-700 text-neutral-100" : "bg-gray-50 text-gray-800",
                                        showFullPost ? "max-h-none" : "max-h-48"
                                    )}>
                                        {selectedTemplate.examplePost}
                                    </div>
                                    {!showFullPost && (
                                        <div className={cn(
                                            "text-center text-xs py-1",
                                            isDark ? "text-neutral-500" : "text-gray-400"
                                        )}>
                                            Click Expand to see full post
                                        </div>
                                    )}
                                </div>

                                {/* Action Button */}
                                <div className="pt-2">
                                    <button
                                        onClick={handleRepurpose}
                                        className="w-full py-2.5 rounded-lg font-medium bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Repeat size={16} />
                                        Repurpose This Template
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <TrendingUp size={48} className={cn(
                                        "mx-auto mb-3",
                                        isDark ? "text-neutral-600" : "text-gray-300"
                                    )} />
                                    <p className={cn(
                                        "text-sm",
                                        isDark ? "text-neutral-500" : "text-gray-400"
                                    )}>
                                        Select a template to see details
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
