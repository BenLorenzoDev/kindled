'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check, Pencil, X, RotateCcw, Eye, Minimize2, Maximize2, Sparkles, ImageIcon, Download, Loader2, BarChart3, GitCompare, Star, Lightbulb, Repeat, Feather } from 'lucide-react';
import { LinkedInPreview } from '@/components/ui/linkedin-preview';
import { PostAnalytics, type PostAnalysis } from '@/components/ui/post-analytics';
import { HookVariations, type HookVariation } from '@/components/ui/hook-variations';
import { RepurposeModal } from '@/components/ui/repurpose-modal';

interface MessageCardProps {
    role: 'user' | 'assistant';
    content: string;
    isDark?: boolean;
    onVariation?: (type: 'shorter' | 'bolder' | 'professional') => void;
    onCopySuccess?: () => void;
    onCompare?: () => void;
    onSaveFavorite?: (content: string) => void;
    isFavorited?: boolean;
}

export function MessageCard({ role, content, isDark = false, onVariation, onCopySuccess, onCompare, onSaveFavorite, isFavorited = false }: MessageCardProps) {
    const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
    const [isEditing, setIsEditing] = useState(false);
    const [localEdits, setLocalEdits] = useState<string | null>(null);
    const [editedContent, setEditedContent] = useState(content);
    const [showPreview, setShowPreview] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<{ url: string; prompt: string } | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<PostAnalysis | null>(null);
    const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);
    const [hooks, setHooks] = useState<HookVariation[]>([]);
    const [showHooks, setShowHooks] = useState(false);
    const [showRepurpose, setShowRepurpose] = useState(false);
    const [isSimplifying, setIsSimplifying] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const displayContent = localEdits ?? content;
    const charCount = displayContent.length;
    const wordCount = displayContent.trim().split(/\s+/).filter(Boolean).length;
    const isOverLimit = charCount > 3000;

    useEffect(() => {
        if (textareaRef.current && isEditing) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [editedContent, isEditing]);

    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
        };
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(displayContent);
            setCopyState('copied');
            onCopySuccess?.();
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
            copyTimeoutRef.current = setTimeout(() => setCopyState('idle'), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            setCopyState('failed');
            if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
            copyTimeoutRef.current = setTimeout(() => setCopyState('idle'), 2000);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(displayContent);
    };

    const handleSaveEdit = useCallback(() => {
        setLocalEdits(editedContent);
        setIsEditing(false);
    }, [editedContent]);

    const handleCancelEdit = useCallback(() => {
        setEditedContent(displayContent);
        setIsEditing(false);
    }, [displayContent]);

    useEffect(() => {
        if (!isEditing) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleCancelEdit();
            } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleSaveEdit();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isEditing, handleCancelEdit, handleSaveEdit]);

    const handleReset = useCallback(() => {
        setLocalEdits(null);
        setEditedContent(content);
        setIsEditing(false);
    }, [content]);

    const handleGenerateImage = async () => {
        setIsGeneratingImage(true);
        setImageError(null);
        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: displayContent }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();
            setGeneratedImage({ url: data.imageUrl, prompt: data.prompt });
        } catch (err) {
            console.error('Image generation failed:', err);
            setImageError(err instanceof Error ? err.message : 'Failed to generate image');
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleDownloadImage = () => {
        if (!generatedImage) return;
        // Use server-side proxy to bypass CORS
        const downloadUrl = `/api/download-image?url=${encodeURIComponent(generatedImage.url)}`;
        window.open(downloadUrl, '_blank');
    };

    const handleAnalyze = async () => {
        if (analysis) return; // Already analyzed
        setIsAnalyzing(true);
        try {
            const response = await fetch('/api/analyze-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: displayContent }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();
            setAnalysis(data);
        } catch (err) {
            console.error('Analysis failed:', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGenerateHooks = async () => {
        setIsGeneratingHooks(true);
        setShowHooks(true);
        try {
            const response = await fetch('/api/generate-hooks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: displayContent }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();
            setHooks(data.hooks || []);
        } catch (err) {
            console.error('Hook generation failed:', err);
        } finally {
            setIsGeneratingHooks(false);
        }
    };

    const handleSelectHook = (hook: string) => {
        // Replace the first line(s) of the content with the new hook
        const lines = displayContent.split('\n');
        const hookEndIndex = lines.findIndex((line, i) => i > 0 && line.trim() === '') || 2;
        const newContent = hook + '\n\n' + lines.slice(hookEndIndex).join('\n').trim();
        setLocalEdits(newContent);
        setEditedContent(newContent);
        setShowHooks(false);
    };

    const handleSimplify = async () => {
        setIsSimplifying(true);
        try {
            const response = await fetch('/api/simplify-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: displayContent }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();
            setLocalEdits(data.content);
            setEditedContent(data.content);
            // Reset analysis since content changed
            setAnalysis(null);
        } catch (err) {
            console.error('Simplify failed:', err);
        } finally {
            setIsSimplifying(false);
        }
    };

    const isUser = role === 'user';
    const hasBeenEdited = localEdits !== null;

    return (
        <>
            <div className={cn(
                "py-6",
                isUser
                    ? "bg-transparent"
                    : isDark ? "bg-neutral-800/50" : "bg-stone-50"
            )}>
                <div className="max-w-3xl mx-auto px-4">
                    {/* Role indicator with stats for assistant */}
                    <div className="flex items-center justify-between mb-2">
                        <div className={cn(
                            "text-xs font-medium",
                            isDark
                                ? isUser ? "text-neutral-500" : "text-neutral-400"
                                : isUser ? "text-stone-500" : "text-stone-600"
                        )}>
                            {isUser ? 'You' : 'LinkedIn Copywriter'}
                        </div>
                        {!isUser && !isEditing && (
                            <div className={cn(
                                "text-xs",
                                isOverLimit ? "text-red-500" : isDark ? "text-neutral-500" : "text-stone-400"
                            )}>
                                {charCount.toLocaleString()} chars • {wordCount} words
                                {isOverLimit && " (over limit)"}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    {isEditing ? (
                        <textarea
                            ref={textareaRef}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            aria-label="Edit generated content"
                            className={cn(
                                "w-full rounded-lg p-4 focus:outline-none focus:ring-2 resize-none min-h-[120px] text-[15px] leading-relaxed",
                                isDark
                                    ? "bg-neutral-700 border border-neutral-600 text-neutral-100 focus:ring-neutral-500"
                                    : "bg-white border border-stone-200 text-stone-800 focus:ring-stone-400"
                            )}
                            autoFocus
                        />
                    ) : (
                        <div className={cn(
                            "text-[15px] leading-relaxed whitespace-pre-wrap",
                            isDark ? "text-neutral-200" : "text-stone-800"
                        )}>
                            {displayContent}
                        </div>
                    )}

                    {/* Action buttons - Only for assistant messages */}
                    {!isUser && (
                        <div className="mt-4 space-y-3">
                            {/* Main actions */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {isEditing ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleSaveEdit}
                                            aria-label="Save changes"
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                                isDark
                                                    ? "text-neutral-900 bg-neutral-100 hover:bg-white"
                                                    : "text-white bg-stone-800 hover:bg-stone-900"
                                            )}
                                        >
                                            <Check size={12} />
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            aria-label="Cancel editing"
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                                isDark
                                                    ? "text-neutral-400 hover:bg-neutral-700"
                                                    : "text-stone-600 hover:bg-stone-100"
                                            )}
                                        >
                                            <X size={12} />
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleCopy}
                                            aria-label={copyState === 'copied' ? 'Copied' : 'Copy'}
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                                copyState === 'copied'
                                                    ? "text-green-500 bg-green-500/10"
                                                    : isDark
                                                        ? "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700"
                                                        : "text-stone-500 hover:text-stone-700 hover:bg-stone-100"
                                            )}
                                        >
                                            {copyState === 'copied' ? <Check size={12} /> : <Copy size={12} />}
                                            {copyState === 'copied' ? 'Copied' : 'Copy'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleEdit}
                                            aria-label="Edit"
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                                isDark
                                                    ? "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700"
                                                    : "text-stone-500 hover:text-stone-700 hover:bg-stone-100"
                                            )}
                                        >
                                            <Pencil size={12} />
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowPreview(true)}
                                            aria-label="Preview on LinkedIn"
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                                isDark
                                                    ? "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700"
                                                    : "text-stone-500 hover:text-stone-700 hover:bg-stone-100"
                                            )}
                                        >
                                            <Eye size={12} />
                                            Preview
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleGenerateImage}
                                            disabled={isGeneratingImage}
                                            aria-label="Generate Image"
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                                isGeneratingImage
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : isDark
                                                        ? "text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                                                        : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            )}
                                        >
                                            {isGeneratingImage ? (
                                                <Loader2 size={12} className="animate-spin" />
                                            ) : (
                                                <ImageIcon size={12} />
                                            )}
                                            {isGeneratingImage ? 'Generating...' : 'Generate Image'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAnalyze}
                                            disabled={isAnalyzing || !!analysis}
                                            aria-label="Analyze Post"
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                                isAnalyzing || analysis
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : isDark
                                                        ? "text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"
                                                        : "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                            )}
                                        >
                                            {isAnalyzing ? (
                                                <Loader2 size={12} className="animate-spin" />
                                            ) : (
                                                <BarChart3 size={12} />
                                            )}
                                            {isAnalyzing ? 'Analyzing...' : analysis ? 'Analyzed' : 'Analyze'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleGenerateHooks}
                                            disabled={isGeneratingHooks}
                                            aria-label="Generate Hook Variations"
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                                isGeneratingHooks
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : isDark
                                                        ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/30"
                                                        : "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                            )}
                                        >
                                            {isGeneratingHooks ? (
                                                <Loader2 size={12} className="animate-spin" />
                                            ) : (
                                                <Lightbulb size={12} />
                                            )}
                                            {isGeneratingHooks ? 'Generating...' : '5 Hooks'}
                                        </button>
                                        {onSaveFavorite && (
                                            <button
                                                type="button"
                                                onClick={() => onSaveFavorite(displayContent)}
                                                aria-label={isFavorited ? "Saved" : "Save to Favorites"}
                                                className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                                    isFavorited
                                                        ? "text-amber-500 bg-amber-500/10"
                                                        : isDark
                                                            ? "text-amber-400 hover:text-amber-300 hover:bg-amber-900/30"
                                                            : "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                                )}
                                            >
                                                <Star size={12} className={isFavorited ? "fill-current" : ""} />
                                                {isFavorited ? 'Saved' : 'Save'}
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setShowRepurpose(true)}
                                            aria-label="Repurpose Content"
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                                isDark
                                                    ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/30"
                                                    : "text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                                            )}
                                        >
                                            <Repeat size={12} />
                                            Repurpose
                                        </button>
                                        {onCompare && (
                                            <button
                                                type="button"
                                                onClick={onCompare}
                                                aria-label="Compare Versions"
                                                className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                                    isDark
                                                        ? "text-orange-400 hover:text-orange-300 hover:bg-orange-900/30"
                                                        : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                )}
                                            >
                                                <GitCompare size={12} />
                                                Compare
                                            </button>
                                        )}
                                        {hasBeenEdited && (
                                            <button
                                                type="button"
                                                onClick={handleReset}
                                                aria-label="Reset"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors"
                                            >
                                                <RotateCcw size={12} />
                                                Reset
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Variation buttons */}
                            {!isEditing && onVariation && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={cn(
                                        "text-xs",
                                        isDark ? "text-neutral-500" : "text-stone-400"
                                    )}>
                                        <Sparkles size={12} className="inline mr-1" />
                                        Variations:
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onVariation('shorter')}
                                        className={cn(
                                            "px-2.5 py-1 text-xs rounded-md transition-colors",
                                            isDark
                                                ? "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                        )}
                                    >
                                        <Minimize2 size={10} className="inline mr-1" />
                                        Shorter
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onVariation('bolder')}
                                        className={cn(
                                            "px-2.5 py-1 text-xs rounded-md transition-colors",
                                            isDark
                                                ? "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                        )}
                                    >
                                        <Maximize2 size={10} className="inline mr-1" />
                                        Bolder
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onVariation('professional')}
                                        className={cn(
                                            "px-2.5 py-1 text-xs rounded-md transition-colors",
                                            isDark
                                                ? "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                        )}
                                    >
                                        More Professional
                                    </button>
                                </div>
                            )}

                            {/* Post Analytics */}
                            {(isAnalyzing || analysis) && (
                                <PostAnalytics
                                    analysis={analysis}
                                    isLoading={isAnalyzing}
                                    isDark={isDark}
                                />
                            )}

                            {/* Simplify Button - appears when readability grade is 6+ */}
                            {analysis && analysis.readabilityGrade && analysis.readabilityGrade >= 6 && (
                                <div className={cn(
                                    "mt-3 p-3 rounded-lg border",
                                    isDark ? "border-green-800 bg-green-900/20" : "border-green-200 bg-green-50"
                                )}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={cn(
                                                "text-sm font-medium",
                                                isDark ? "text-green-400" : "text-green-700"
                                            )}>
                                                Make it more readable?
                                            </p>
                                            <p className={cn(
                                                "text-xs",
                                                isDark ? "text-green-500/70" : "text-green-600/70"
                                            )}>
                                                Rewrite to Grade 4 - simpler words, shorter sentences, no jargon
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleSimplify}
                                            disabled={isSimplifying}
                                            className={cn(
                                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                                                isSimplifying
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "hover:scale-105",
                                                isDark
                                                    ? "bg-green-600 text-white hover:bg-green-500"
                                                    : "bg-green-600 text-white hover:bg-green-700"
                                            )}
                                        >
                                            {isSimplifying ? (
                                                <>
                                                    <Loader2 size={14} className="animate-spin" />
                                                    Simplifying...
                                                </>
                                            ) : (
                                                <>
                                                    <Feather size={14} />
                                                    Simplify
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Image Error */}
                            {imageError && (
                                <div className="text-xs text-red-500 mt-2">
                                    {imageError}
                                </div>
                            )}

                            {/* Generated Image Preview */}
                            {generatedImage && (
                                <div className={cn(
                                    "mt-4 rounded-lg overflow-hidden border",
                                    isDark ? "border-neutral-700" : "border-stone-200"
                                )}>
                                    <div className={cn(
                                        "px-3 py-2 flex items-center justify-between",
                                        isDark ? "bg-neutral-800" : "bg-stone-100"
                                    )}>
                                        <span className={cn(
                                            "text-xs font-medium",
                                            isDark ? "text-neutral-300" : "text-stone-600"
                                        )}>
                                            Generated Image
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleDownloadImage}
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded transition-colors",
                                                isDark
                                                    ? "text-blue-400 hover:bg-blue-900/30"
                                                    : "text-blue-600 hover:bg-blue-50"
                                            )}
                                        >
                                            <Download size={12} />
                                            Download
                                        </button>
                                    </div>
                                    <img
                                        src={generatedImage.url}
                                        alt="Generated post image"
                                        className="w-full max-h-96 object-contain"
                                    />
                                    <div className={cn(
                                        "px-3 py-2 text-xs",
                                        isDark ? "bg-neutral-800 text-neutral-500" : "bg-stone-50 text-stone-400"
                                    )}>
                                        <span className="font-medium">Prompt:</span> {generatedImage.prompt}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* LinkedIn Preview Modal */}
            {showPreview && (
                <LinkedInPreview
                    content={displayContent}
                    isDark={isDark}
                    onClose={() => setShowPreview(false)}
                    imageUrl={generatedImage?.url}
                />
            )}

            {/* Hook Variations Modal */}
            <HookVariations
                isOpen={showHooks}
                onClose={() => setShowHooks(false)}
                hooks={hooks}
                isLoading={isGeneratingHooks}
                onSelectHook={handleSelectHook}
                isDark={isDark}
            />

            {/* Repurpose Modal */}
            <RepurposeModal
                isOpen={showRepurpose}
                onClose={() => setShowRepurpose(false)}
                content={displayContent}
                isDark={isDark}
            />
        </>
    );
}
