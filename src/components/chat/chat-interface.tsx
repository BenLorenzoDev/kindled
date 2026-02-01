'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowUp, RefreshCw, ChevronDown, Clock, Sparkles, HelpCircle, Wrench } from 'lucide-react';
import Image from 'next/image';
import { SettingsPanel } from './settings-panel';
import { MessageCard } from './message-card';
import { Toast } from '@/components/ui/toast';
import { HistorySidebar, type HistoryItem } from '@/components/ui/history-sidebar';
import { AnalyticsBadge } from '@/components/ui/analytics-badge';
import { HelpModal } from '@/components/ui/help-modal';
import { ViralHackerModal } from '@/components/ui/viral-hacker-modal';
import { ViralTemplatesModal } from '@/components/ui/viral-templates-modal';
import { PostIdeasModal } from '@/components/ui/post-ideas-modal';
import { TrendScannerModal } from '@/components/ui/trend-scanner-modal';
import { ProfileOptimizerModal } from '@/components/ui/profile-optimizer-modal';
import { CadenceGeneratorModal } from '@/components/ui/cadence-generator-modal';
import { EngagementResponderModal } from '@/components/ui/engagement-responder-modal';
import { CommentGeneratorModal } from '@/components/ui/comment-generator-modal';
import { ContentCalendarModal } from '@/components/ui/content-calendar-modal';
import { JobAlertsModal } from '@/components/ui/job-alerts-modal';
import { ToolsSidebar } from '@/components/ui/tools-sidebar';
import { SeriesGeneratorModal } from '@/components/ui/series-generator-modal';
import { SeriesManagerModal } from '@/components/ui/series-manager-modal';
import { getMessageContent } from '@/lib/utils';
import type { PersonaType, ModeType, TemperatureType, ContentSeries, SeriesPostStatus } from '@/types';

type ToneType = 'default' | 'inspirational' | 'data-driven' | 'conversational';

const EXAMPLE_PROMPTS = [
    "Write a post about why most people get content strategy wrong",
    "Create a story about a lesson learned the hard way in my industry",
    "Write about a common misconception in my field",
    "Share a confession about a mistake I made early in my career",
];

const TONE_OPTIONS: { value: ToneType; label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'data-driven', label: 'Data-Driven' },
    { value: 'conversational', label: 'Conversational' },
];

export function ChatInterface() {
    const [persona, setPersona] = useState<PersonaType>('coach');
    const [mode, setMode] = useState<ModeType>('arm');
    const [temperature, setTemperature] = useState<TemperatureType>('medium');
    const [tone, setTone] = useState<ToneType>('default');
    const [showSettings, setShowSettings] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showViralHacker, setShowViralHacker] = useState(false);
    const [showViralTemplates, setShowViralTemplates] = useState(false);
    const [showPostIdeas, setShowPostIdeas] = useState(false);
    const [showTrendScanner, setShowTrendScanner] = useState(false);
    const [showProfileOptimizer, setShowProfileOptimizer] = useState(false);
    const [showCadenceGenerator, setShowCadenceGenerator] = useState(false);
    const [showEngagementResponder, setShowEngagementResponder] = useState(false);
    const [showCommentGenerator, setShowCommentGenerator] = useState(false);
    const [showContentCalendar, setShowContentCalendar] = useState(false);
    const [showJobAlerts, setShowJobAlerts] = useState(false);
    const [showTools, setShowTools] = useState(false);
    const [showSeriesGenerator, setShowSeriesGenerator] = useState(false);
    const [showSeriesManager, setShowSeriesManager] = useState(false);
    const [seriesList, setSeriesList] = useState<ContentSeries[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [stats, setStats] = useState({ postsGenerated: 0, wordsWritten: 0 });

    const { messages, status, sendMessage, error, setMessages } = useChat();
    const [inputValue, setInputValue] = useState('');
    const [lastMessage, setLastMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const isLoading = status === 'streaming' || status === 'submitted';
    const hasError = status === 'error' || error !== undefined;
    const isDark = false; // Light mode only

    // Load history, stats, favorites, and series from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem('linkedin-copywriter-history');
        const savedStats = localStorage.getItem('linkedin-copywriter-stats');
        const savedFavorites = localStorage.getItem('linkedin-copywriter-favorites');
        const savedSeries = localStorage.getItem('linkedin-copywriter-series');
        if (savedHistory) setHistory(JSON.parse(savedHistory));
        if (savedStats) setStats(JSON.parse(savedStats));
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        if (savedSeries) setSeriesList(JSON.parse(savedSeries));
    }, []);

    // Save history to localStorage
    useEffect(() => {
        localStorage.setItem('linkedin-copywriter-history', JSON.stringify(history));
    }, [history]);

    // Save stats to localStorage
    useEffect(() => {
        localStorage.setItem('linkedin-copywriter-stats', JSON.stringify(stats));
    }, [stats]);

    // Save favorites to localStorage
    useEffect(() => {
        localStorage.setItem('linkedin-copywriter-favorites', JSON.stringify(favorites));
    }, [favorites]);

    // Save series to localStorage
    useEffect(() => {
        localStorage.setItem('linkedin-copywriter-series', JSON.stringify(seriesList));
    }, [seriesList]);

    // Track new assistant messages for history and stats
    useEffect(() => {
        const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
        const lastUserMessage = messages.filter(m => m.role === 'user').pop();

        if (lastAssistantMessage && lastUserMessage && status === 'ready') {
            const content = getMessageContent(lastAssistantMessage);
            const prompt = getMessageContent(lastUserMessage);
            const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

            // Check if this message is already in history
            const exists = history.some(h => h.id === lastAssistantMessage.id);
            if (!exists && content.length > 0) {
                setHistory(prev => [{
                    id: lastAssistantMessage.id,
                    prompt,
                    content,
                    timestamp: Date.now(),
                }, ...prev].slice(0, 50)); // Keep last 50

                setStats(prev => ({
                    postsGenerated: prev.postsGenerated + 1,
                    wordsWritten: prev.wordsWritten + wordCount,
                }));
            }
        }
    }, [messages, status, history]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
        }
    }, [inputValue]);

    const emptyState = messages.length === 0;
    const MIN_CHARS = 10;
    const isValidInput = inputValue.trim().length >= MIN_CHARS;
    const hasAssistantMessage = messages.some(m => m.role === 'assistant');

    const buildPromptWithTone = (message: string) => {
        if (tone === 'default') return message;
        const toneInstructions: Record<ToneType, string> = {
            default: '',
            inspirational: '\n\n[Write this in an inspirational, motivating tone]',
            'data-driven': '\n\n[Write this with a data-driven, analytical tone using specific numbers]',
            conversational: '\n\n[Write this in a casual, conversational tone like talking to a friend]',
        };
        return message + toneInstructions[tone];
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidInput || isLoading) return;
        const message = buildPromptWithTone(inputValue);
        setLastMessage(inputValue);
        setInputValue('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        try {
            await sendMessage(
                { text: message },
                { body: { persona, mode, temperature } }
            );
        } catch (error) {
            console.error('[ChatInterface] sendMessage error:', error);
        }
    };

    const onResend = async () => {
        if (lastMessage && !isLoading) {
            const message = buildPromptWithTone(lastMessage);
            await sendMessage(
                { text: message },
                { body: { persona, mode, temperature } }
            );
        }
    };

    const onExampleClick = (example: string) => {
        setInputValue(example);
        textareaRef.current?.focus();
    };

    const onVariation = useCallback(async (type: 'shorter' | 'bolder' | 'professional') => {
        const lastAssistant = messages.filter(m => m.role === 'assistant').pop();
        if (!lastAssistant) return;

        const content = getMessageContent(lastAssistant);
        const variationPrompts: Record<string, string> = {
            shorter: `Make this post shorter and more concise while keeping the key message:\n\n${content}`,
            bolder: `Make this post bolder and more provocative while keeping the core idea:\n\n${content}`,
            professional: `Make this post more professional and polished while keeping the message:\n\n${content}`,
        };

        await sendMessage(
            { text: variationPrompts[type] },
            { body: { persona, mode, temperature } }
        );
    }, [messages, sendMessage, persona, mode, temperature]);

    const onCompare = useCallback(async () => {
        const lastAssistant = messages.filter(m => m.role === 'assistant').pop();
        const lastUser = messages.filter(m => m.role === 'user').pop();
        if (!lastAssistant || !lastUser) return;

        const originalPrompt = getMessageContent(lastUser);
        const comparePrompt = `Write a completely different version of a LinkedIn post about the same topic. Use a different hook, different structure, and different angle. Keep the same core message but approach it from a fresh perspective.

Original topic: ${originalPrompt}

Write the alternative version now:`;

        await sendMessage(
            { text: comparePrompt },
            { body: { persona, mode, temperature } }
        );
    }, [messages, sendMessage, persona, mode, temperature]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e);
        }
    };

    const handleCopySuccess = () => {
        setToast({ message: 'Copied to clipboard!', type: 'success' });
    };

    const handleHistorySelect = (item: HistoryItem) => {
        setMessages([
            { id: 'user-' + item.id, role: 'user', parts: [{ type: 'text', text: item.prompt }] },
            { id: item.id, role: 'assistant', parts: [{ type: 'text', text: item.content }] },
        ] as Parameters<typeof setMessages>[0]);
        setShowHistory(false);
    };

    const handleHistoryDelete = (id: string) => {
        setHistory(prev => prev.filter(h => h.id !== id));
    };

    const handleHistoryClear = () => {
        setHistory([]);
        setStats({ postsGenerated: 0, wordsWritten: 0 });
    };

    const handleSaveFavorite = useCallback((content: string) => {
        setFavorites(prev => {
            const isAlreadyFavorited = prev.includes(content);
            if (isAlreadyFavorited) {
                setToast({ message: 'Removed from favorites', type: 'success' });
                return prev.filter(f => f !== content);
            } else {
                setToast({ message: 'Saved to favorites!', type: 'success' });
                return [content, ...prev];
            }
        });
    }, []);

    const handleViralHackerUsePost = useCallback((content: string) => {
        // Add the hacked post as a new assistant message
        const newId = `viral-${Date.now()}`;
        setMessages([
            ...messages,
            { id: `user-${newId}`, role: 'user', parts: [{ type: 'text', text: '[Viral Post Hacker] Generated from viral template' }] },
            { id: newId, role: 'assistant', parts: [{ type: 'text', text: content }] },
        ] as Parameters<typeof setMessages>[0]);
        setShowViralHacker(false);
    }, [messages, setMessages]);

    const handleTemplateRepurpose = useCallback((post: string) => {
        // Add the template post as a message so it can be repurposed
        const newId = `template-${Date.now()}`;
        setMessages([
            ...messages,
            { id: `user-${newId}`, role: 'user', parts: [{ type: 'text', text: '[Viral Template] Selected for repurposing' }] },
            { id: newId, role: 'assistant', parts: [{ type: 'text', text: post }] },
        ] as Parameters<typeof setMessages>[0]);
        setShowViralTemplates(false);
        setToast({ message: 'Template loaded! Use the Repurpose button on the post', type: 'success' });
    }, [messages, setMessages]);

    const handleUseIdea = useCallback((hook: string) => {
        // Put the hook in the input field so user can expand on it
        setInputValue(hook);
        textareaRef.current?.focus();
        setToast({ message: 'Hook added! Expand on it or generate a post', type: 'success' });
    }, []);

    const handleUseTrendPost = useCallback((post: string) => {
        // Add the trend-generated post as a message
        const newId = `trend-${Date.now()}`;
        setMessages([
            ...messages,
            { id: `user-${newId}`, role: 'user', parts: [{ type: 'text', text: '[Trend Scanner] Generated from industry trend' }] },
            { id: newId, role: 'assistant', parts: [{ type: 'text', text: post }] },
        ] as Parameters<typeof setMessages>[0]);
        setToast({ message: 'Trend post loaded! Edit or use as-is', type: 'success' });
    }, [messages, setMessages]);

    const handleOpenTool = useCallback((tool: string) => {
        switch (tool) {
            case 'profile': setShowProfileOptimizer(true); break;
            case 'trends': setShowTrendScanner(true); break;
            case 'ideas': setShowPostIdeas(true); break;
            case 'templates': setShowViralTemplates(true); break;
            case 'hacker': setShowViralHacker(true); break;
            case 'cadence': setShowCadenceGenerator(true); break;
            case 'engage': setShowEngagementResponder(true); break;
            case 'comment': setShowCommentGenerator(true); break;
            case 'calendar': setShowContentCalendar(true); break;
            case 'jobs': setShowJobAlerts(true); break;
            case 'series': setShowSeriesGenerator(true); break;
            case 'series-manager': setShowSeriesManager(true); break;
        }
    }, []);

    // Series handlers
    const handleSeriesCreated = useCallback((series: ContentSeries) => {
        setSeriesList(prev => [series, ...prev]);
        setToast({ message: `Series "${series.title}" created with ${series.numberOfPosts} posts!`, type: 'success' });
    }, []);

    const handleDeleteSeries = useCallback((seriesId: string) => {
        setSeriesList(prev => prev.filter(s => s.id !== seriesId));
        setToast({ message: 'Series deleted', type: 'success' });
    }, []);

    const handleUpdatePostStatus = useCallback((seriesId: string, postId: string, status: SeriesPostStatus) => {
        setSeriesList(prev => prev.map(series => {
            if (series.id !== seriesId) return series;
            return {
                ...series,
                posts: series.posts.map(post =>
                    post.id === postId ? { ...post, status } : post
                ),
                updatedAt: Date.now()
            };
        }));
    }, []);

    const handleAddSeriesToCalendar = useCallback((series: ContentSeries) => {
        // This will open the calendar with the series posts pre-populated
        // For now, just show a toast and open the calendar
        setToast({ message: `Opening calendar to add ${series.numberOfPosts} posts from "${series.title}"`, type: 'success' });
        setShowContentCalendar(true);
    }, []);

    // Keyboard shortcut for tools sidebar
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key === 't' || e.key === 'T') {
                setShowTools(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <div className="flex flex-col h-full bg-[#F4F2EE]">
                {/* LinkedIn-style Top bar */}
                <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-[rgba(0,0,0,0.08)]">
                    <button
                        type="button"
                        onClick={() => setShowHistory(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors text-[rgba(0,0,0,0.6)] hover:text-[rgba(0,0,0,0.9)] hover:bg-[#EEF3F8]"
                    >
                        <Clock size={16} />
                        <span className="hidden sm:inline">History</span>
                        {history.length > 0 && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#0A66C2] text-white font-medium">
                                {history.length}
                            </span>
                        )}
                    </button>

                    <AnalyticsBadge
                        postsGenerated={stats.postsGenerated}
                        wordsWritten={stats.wordsWritten}
                        isDark={isDark}
                    />

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowTools(true)}
                            aria-label="Tools"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all bg-[#0A66C2] text-white hover:bg-[#004182]"
                        >
                            <Wrench size={16} />
                            <span className="hidden sm:inline">Tools</span>
                            <span className="px-1.5 py-0.5 text-[10px] bg-white/20 rounded-full">12</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowHelp(true)}
                            aria-label="Help"
                            className="p-2 rounded-full transition-colors text-[rgba(0,0,0,0.6)] hover:text-[rgba(0,0,0,0.9)] hover:bg-[#EEF3F8]"
                        >
                            <HelpCircle size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    {emptyState ? (
                        <div className="h-full flex flex-col items-center justify-center">
                            {/* LinkedIn-style Card for Empty State */}
                            <div className="w-full max-w-xl bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm p-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-[#0A66C2] rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-2xl">in</span>
                                    </div>
                                    <h1 className="text-xl font-semibold text-[rgba(0,0,0,0.9)] mb-2">
                                        Create a post
                                    </h1>
                                    <p className="text-sm text-[rgba(0,0,0,0.6)] mb-6">
                                        Share your ideas and I&apos;ll craft authentic LinkedIn content that builds your authority.
                                    </p>

                                    {/* Example prompts */}
                                    <div className="space-y-3 text-left">
                                        <p className="text-xs font-medium text-[rgba(0,0,0,0.6)] flex items-center gap-1">
                                            <Sparkles size={12} className="text-[#0A66C2]" />
                                            Try an example:
                                        </p>
                                        <div className="grid gap-2">
                                            {EXAMPLE_PROMPTS.map((example, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => onExampleClick(example)}
                                                    className="text-left px-4 py-3 rounded-lg text-sm transition-all bg-[#EEF3F8] text-[rgba(0,0,0,0.9)] hover:bg-[#E1E9F0] border border-transparent hover:border-[#0A66C2]"
                                                >
                                                    {example}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto space-y-4">
                            {messages.map(m => {
                                const content = getMessageContent(m);
                                return (
                                    <MessageCard
                                        key={m.id}
                                        role={m.role as 'user' | 'assistant'}
                                        content={content}
                                        isDark={isDark}
                                        onVariation={m.role === 'assistant' ? onVariation : undefined}
                                        onCopySuccess={handleCopySuccess}
                                        onCompare={m.role === 'assistant' ? onCompare : undefined}
                                        onSaveFavorite={m.role === 'assistant' ? handleSaveFavorite : undefined}
                                        isFavorited={favorites.includes(content)}
                                    />
                                );
                            })}

                            {isLoading && (
                                <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white font-bold text-sm">
                                            in
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-[rgba(0,0,0,0.9)]">
                                                LinkedIn Copywriter
                                            </div>
                                            <div className="flex items-center gap-2 text-[rgba(0,0,0,0.6)]">
                                                <div className="w-2 h-2 rounded-full animate-pulse bg-[#0A66C2]" />
                                                <span className="text-xs">Writing your post...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {hasError && (
                                <div className="bg-white rounded-lg border border-[#B24020] shadow-sm p-4">
                                    <p className="text-[#B24020] text-sm mb-3">
                                        {error?.message || 'Something went wrong. Please try again.'}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={onResend}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#B24020] border border-[#B24020] hover:bg-[#B24020]/10 rounded-full transition-colors"
                                    >
                                            <RefreshCw size={12} />
                                            Try again
                                        </button>
                                    </div>
                            )}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area - LinkedIn Style */}
                <div className="px-4 pb-4">
                    <div className="max-w-3xl mx-auto">
                        {/* LinkedIn-style Post Creator Card */}
                        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm p-4">
                            {/* Regenerate button */}
                            {hasAssistantMessage && !hasError && !isLoading && (
                                <div className="flex justify-center mb-3">
                                    <button
                                        type="button"
                                        onClick={onResend}
                                        className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-full transition-colors text-[#0A66C2] hover:bg-[#EEF3F8]"
                                    >
                                        <RefreshCw size={12} />
                                        Regenerate
                                    </button>
                                </div>
                            )}

                            {/* Settings and Tone toggles */}
                            <div className="flex items-center gap-4 mb-3 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="inline-flex items-center gap-1 text-xs transition-colors text-[rgba(0,0,0,0.6)] hover:text-[rgba(0,0,0,0.9)] hover:bg-[#EEF3F8] px-2 py-1 rounded-full"
                                >
                                    <span>{mode === 'arm' ? 'Story' : 'Tactical'} Mode</span>
                                    <ChevronDown size={12} className={showSettings ? 'rotate-180 transition-transform' : 'transition-transform'} />
                                </button>

                                {/* Tone selector - LinkedIn pill style */}
                                <div className="flex items-center gap-1">
                                    {TONE_OPTIONS.map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setTone(option.value)}
                                            className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                                tone === option.value
                                                    ? 'bg-[#0A66C2] text-white'
                                                    : 'text-[rgba(0,0,0,0.6)] hover:bg-[#EEF3F8]'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {showSettings && (
                                <div className="mb-3">
                                    <SettingsPanel
                                        persona={persona}
                                        mode={mode}
                                        temperature={temperature}
                                        onPersonaChange={setPersona}
                                        onModeChange={setMode}
                                        onTemperatureChange={setTemperature}
                                        disabled={isLoading}
                                        isDark={isDark}
                                    />
                                </div>
                            )}

                            {/* Input box - LinkedIn style */}
                            <form onSubmit={onSubmit} className="relative">
                                <div className="relative flex items-end rounded-lg border border-[rgba(0,0,0,0.15)] transition-colors focus-within:border-[#0A66C2] focus-within:shadow-[0_0_0_1px_#0A66C2] bg-[#EEF3F8]">
                                    <textarea
                                        ref={textareaRef}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="What do you want to talk about?"
                                        rows={1}
                                        className="flex-1 bg-transparent px-4 py-3 focus:outline-none resize-none text-sm leading-relaxed max-h-[200px] text-[rgba(0,0,0,0.9)] placeholder:text-[rgba(0,0,0,0.6)]"
                                        aria-label="Message input"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading || !isValidInput}
                                        aria-label="Send message"
                                        className="m-2 px-4 py-2 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#0A66C2] text-white hover:bg-[#004182] font-semibold text-sm"
                                    >
                                        Post
                                    </button>
                                </div>

                                {inputValue.length > 0 && !isValidInput && (
                                    <p className="text-xs mt-2 text-center text-[rgba(0,0,0,0.6)]">
                                        {MIN_CHARS - inputValue.trim().length} more characters needed
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* History Sidebar */}
            <HistorySidebar
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                history={history}
                onSelect={handleHistorySelect}
                onDelete={handleHistoryDelete}
                onClear={handleHistoryClear}
                isDark={isDark}
            />

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                    isDark={isDark}
                />
            )}

            {/* Help Modal */}
            <HelpModal
                isOpen={showHelp}
                onClose={() => setShowHelp(false)}
                isDark={isDark}
            />

            {/* Viral Hacker Modal */}
            <ViralHackerModal
                isOpen={showViralHacker}
                onClose={() => setShowViralHacker(false)}
                onUsePost={handleViralHackerUsePost}
                isDark={isDark}
            />

            {/* Viral Templates Modal */}
            <ViralTemplatesModal
                isOpen={showViralTemplates}
                onClose={() => setShowViralTemplates(false)}
                onRepurpose={handleTemplateRepurpose}
                isDark={isDark}
            />

            {/* Post Ideas Modal */}
            <PostIdeasModal
                isOpen={showPostIdeas}
                onClose={() => setShowPostIdeas(false)}
                onUseIdea={handleUseIdea}
            />

            {/* Trend Scanner Modal */}
            <TrendScannerModal
                isOpen={showTrendScanner}
                onClose={() => setShowTrendScanner(false)}
                onUsePost={handleUseTrendPost}
            />

            {/* Profile Optimizer Modal */}
            <ProfileOptimizerModal
                isOpen={showProfileOptimizer}
                onClose={() => setShowProfileOptimizer(false)}
            />

            {/* Cadence Generator Modal */}
            <CadenceGeneratorModal
                isOpen={showCadenceGenerator}
                onClose={() => setShowCadenceGenerator(false)}
            />

            {/* Engagement Responder Modal */}
            <EngagementResponderModal
                isOpen={showEngagementResponder}
                onClose={() => setShowEngagementResponder(false)}
            />

            {/* Comment Generator Modal */}
            <CommentGeneratorModal
                isOpen={showCommentGenerator}
                onClose={() => setShowCommentGenerator(false)}
                isDark={isDark}
            />

            {/* Content Calendar Modal */}
            <ContentCalendarModal
                isOpen={showContentCalendar}
                onClose={() => setShowContentCalendar(false)}
                isDark={isDark}
            />

            {/* Job Alerts Modal */}
            <JobAlertsModal
                isOpen={showJobAlerts}
                onClose={() => setShowJobAlerts(false)}
            />

            {/* Tools Sidebar */}
            <ToolsSidebar
                isOpen={showTools}
                onClose={() => setShowTools(false)}
                onOpenTool={handleOpenTool}
                isDark={isDark}
            />

            {/* Series Generator Modal */}
            <SeriesGeneratorModal
                isOpen={showSeriesGenerator}
                onClose={() => setShowSeriesGenerator(false)}
                onSeriesCreated={handleSeriesCreated}
            />

            {/* Series Manager Modal */}
            <SeriesManagerModal
                isOpen={showSeriesManager}
                onClose={() => setShowSeriesManager(false)}
                seriesList={seriesList}
                onDeleteSeries={handleDeleteSeries}
                onUpdatePostStatus={handleUpdatePostStatus}
                onAddToCalendar={handleAddSeriesToCalendar}
            />
        </>
    );
}
