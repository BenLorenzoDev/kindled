'use client';

import { cn } from '@/lib/utils';
import { X, Loader2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export interface HookVariation {
    type: string;
    hook: string;
    strength: number;
}

interface HookVariationsProps {
    isOpen: boolean;
    onClose: () => void;
    hooks: HookVariation[];
    isLoading: boolean;
    onSelectHook: (hook: string) => void;
    isDark?: boolean;
}

export function HookVariations({ isOpen, onClose, hooks, isLoading, onSelectHook, isDark = false }: HookVariationsProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    if (!isOpen) return null;

    const handleCopy = async (hook: string, index: number) => {
        await navigator.clipboard.writeText(hook);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const getStrengthColor = (strength: number) => {
        if (strength >= 80) return 'text-green-500';
        if (strength >= 60) return 'text-blue-500';
        if (strength >= 40) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getStrengthBg = (strength: number) => {
        if (strength >= 80) return isDark ? 'bg-green-900/20' : 'bg-green-50';
        if (strength >= 60) return isDark ? 'bg-blue-900/20' : 'bg-blue-50';
        if (strength >= 40) return isDark ? 'bg-yellow-900/20' : 'bg-yellow-50';
        return isDark ? 'bg-red-900/20' : 'bg-red-50';
    };

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'contrarian': return 'bg-purple-500';
            case 'confession': return 'bg-pink-500';
            case 'number/stat': return 'bg-cyan-500';
            case 'question': return 'bg-orange-500';
            case 'story': return 'bg-emerald-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <div
                className={cn(
                    "w-full max-w-2xl rounded-lg shadow-xl overflow-hidden max-h-[80vh] flex flex-col",
                    isDark ? "bg-neutral-800" : "bg-white"
                )}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={cn(
                    "p-4 border-b flex items-center justify-between",
                    isDark ? "border-neutral-700" : "border-gray-200"
                )}>
                    <div>
                        <h2 className={cn(
                            "text-lg font-semibold",
                            isDark ? "text-neutral-100" : "text-gray-900"
                        )}>
                            5 Hook Variations
                        </h2>
                        <p className={cn(
                            "text-xs",
                            isDark ? "text-neutral-400" : "text-gray-500"
                        )}>
                            Click any hook to use it, or copy to clipboard
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className={cn(
                            "p-1.5 rounded-lg transition-colors",
                            isDark ? "hover:bg-neutral-700 text-neutral-400" : "hover:bg-gray-100 text-gray-500"
                        )}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 size={32} className={cn("animate-spin mb-3", isDark ? "text-neutral-400" : "text-gray-400")} />
                            <p className={cn("text-sm", isDark ? "text-neutral-400" : "text-gray-500")}>
                                Generating 5 unique hooks...
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {hooks.map((hook, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.01]",
                                        getStrengthBg(hook.strength),
                                        isDark ? "border-neutral-600 hover:border-neutral-500" : "border-gray-200 hover:border-gray-300"
                                    )}
                                    onClick={() => onSelectHook(hook.hook)}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={cn(
                                                    "text-xs px-2 py-0.5 rounded-full text-white font-medium",
                                                    getTypeColor(hook.type)
                                                )}>
                                                    {hook.type}
                                                </span>
                                                <span className={cn(
                                                    "text-xs font-bold",
                                                    getStrengthColor(hook.strength)
                                                )}>
                                                    {hook.strength}% strength
                                                </span>
                                            </div>
                                            <p className={cn(
                                                "text-sm leading-relaxed",
                                                isDark ? "text-neutral-200" : "text-gray-800"
                                            )}>
                                                {hook.hook}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopy(hook.hook, index);
                                            }}
                                            className={cn(
                                                "p-1.5 rounded transition-colors flex-shrink-0",
                                                copiedIndex === index
                                                    ? "text-green-500"
                                                    : isDark
                                                        ? "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700"
                                                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                            )}
                                        >
                                            {copiedIndex === index ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={cn(
                    "p-3 border-t",
                    isDark ? "border-neutral-700" : "border-gray-200"
                )}>
                    <button
                        onClick={onClose}
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
            </div>
        </div>
    );
}
