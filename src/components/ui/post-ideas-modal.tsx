'use client';

import { cn } from '@/lib/utils';
import { X, Lightbulb, Loader2, Copy, Check, Sparkles, Hash } from 'lucide-react';
import { useState } from 'react';

interface PostIdea {
    hook: string;
    angle: string;
    format: string;
    hashtags: string[];
}

interface PostIdeasModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUseIdea: (hook: string) => void;
}

const FORMAT_COLORS: Record<string, string> = {
    'Story': 'bg-purple-100 text-purple-700',
    'List': 'bg-blue-100 text-blue-700',
    'Contrarian': 'bg-red-100 text-red-700',
    'Data': 'bg-green-100 text-green-700',
    'Question': 'bg-amber-100 text-amber-700',
    'How-To': 'bg-cyan-100 text-cyan-700',
    'Confession': 'bg-pink-100 text-pink-700',
    'Comparison': 'bg-indigo-100 text-indigo-700',
};

export function PostIdeasModal({ isOpen, onClose, onUseIdea }: PostIdeasModalProps) {
    const [topic, setTopic] = useState('');
    const [ideas, setIdeas] = useState<PostIdea[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        if (!topic.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setIdeas([]);

        try {
            const response = await fetch('/api/generate-ideas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: topic.trim() }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate ideas');
            }

            const data = await response.json();
            setIdeas(data.ideas || []);
        } catch (err) {
            setError('Failed to generate ideas. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async (hook: string, index: number) => {
        await navigator.clipboard.writeText(hook);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleUse = (hook: string) => {
        onUseIdea(hook);
        onClose();
    };

    const handleClose = () => {
        setTopic('');
        setIdeas([]);
        setError(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
            <div
                className="w-full max-w-2xl rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col bg-white"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                            <Lightbulb size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Post Ideas Generator
                            </h2>
                            <p className="text-xs text-gray-500">
                                Enter a topic, get 8 viral post ideas with hooks
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 text-gray-500"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Input */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            placeholder="Enter a topic (e.g., sales leadership, AI in business, remote work)"
                            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={!topic.trim() || isLoading}
                            className="px-4 py-2.5 rounded-lg font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Sparkles size={16} />
                            )}
                            Generate
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
                            <Loader2 size={32} className="animate-spin text-amber-500 mb-3" />
                            <p className="text-sm text-gray-500">Generating post ideas...</p>
                        </div>
                    )}

                    {!isLoading && ideas.length === 0 && !error && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Lightbulb size={48} className="text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm mb-1">Enter a topic to generate ideas</p>
                            <p className="text-gray-400 text-xs">e.g., "sales objections", "leadership lessons", "AI productivity"</p>
                        </div>
                    )}

                    {ideas.length > 0 && (
                        <div className="space-y-3">
                            {ideas.map((idea, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg border border-gray-200 hover:border-amber-300 hover:shadow-sm transition-all"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={cn(
                                                    "text-xs font-medium px-2 py-0.5 rounded",
                                                    FORMAT_COLORS[idea.format] || 'bg-gray-100 text-gray-700'
                                                )}>
                                                    {idea.format}
                                                </span>
                                                <span className="text-xs text-gray-400">#{index + 1}</span>
                                            </div>
                                            <p className="font-medium text-gray-900 mb-1">
                                                "{idea.hook}"
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {idea.angle}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hashtags */}
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        <Hash size={12} className="text-gray-400" />
                                        {idea.hashtags.map((tag, i) => (
                                            <span key={i} className="text-xs text-blue-600">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCopy(idea.hook, index)}
                                            className="flex-1 py-1.5 rounded text-xs font-medium border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                                        >
                                            {copiedIndex === index ? (
                                                <>
                                                    <Check size={12} className="text-green-500" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={12} />
                                                    Copy Hook
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleUse(idea.hook)}
                                            className="flex-1 py-1.5 rounded text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 transition-all"
                                        >
                                            Use This Idea
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
