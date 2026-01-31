'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
    X,
    Send,
    Loader2,
    HelpCircle,
    Ticket,
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Bug,
    Lightbulb,
    CreditCard,
    MessageSquare
} from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

type ViewMode = 'chat' | 'ticket' | 'ticket-success';
type TicketCategory = 'bug' | 'feature' | 'question' | 'billing' | 'other';
type TicketPriority = 'low' | 'medium' | 'high';

export function AIAssistantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('chat');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hey! 👋 I'm Pip, your PostPipeline assistant. I can help you with:\n\n• How to use features\n• Troubleshooting issues\n• Best practices for LinkedIn growth\n• Submitting support tickets\n\nWhat can I help you with today?",
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPulse, setShowPulse] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Ticket form state
    const [ticketEmail, setTicketEmail] = useState('');
    const [ticketSubject, setTicketSubject] = useState('');
    const [ticketDescription, setTicketDescription] = useState('');
    const [ticketCategory, setTicketCategory] = useState<TicketCategory>('question');
    const [ticketPriority, setTicketPriority] = useState<TicketPriority>('medium');
    const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
    const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setShowPulse(false);
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        const userInput = input.trim();
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.message,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);

            // If AI suggests creating a ticket, pre-fill the form
            if (data.shouldCreateTicket || userInput.toLowerCase().includes('ticket') || userInput.toLowerCase().includes('support')) {
                // Don't auto-switch, but the user can click the ticket button
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting right now. Please try again in a moment, or submit a support ticket if the issue persists.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSubmitTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketEmail || !ticketSubject || !ticketDescription) return;

        setIsSubmittingTicket(true);

        try {
            const response = await fetch('/api/assistant/ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: ticketEmail,
                    subject: ticketSubject,
                    description: ticketDescription,
                    category: ticketCategory,
                    priority: ticketPriority,
                    conversationHistory: messages.slice(1).map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                    timestamp: new Date().toISOString(),
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSubmittedTicketId(data.ticketId);
                setViewMode('ticket-success');
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Ticket submission error:', error);
            alert('Failed to submit ticket. Please try again or email support directly.');
        } finally {
            setIsSubmittingTicket(false);
        }
    };

    const resetTicketForm = () => {
        setTicketEmail('');
        setTicketSubject('');
        setTicketDescription('');
        setTicketCategory('question');
        setTicketPriority('medium');
        setSubmittedTicketId(null);
        setViewMode('chat');
    };

    const quickActions = [
        { icon: <HelpCircle size={14} />, label: 'How to use', action: () => setInput('How do I create my first LinkedIn post?') },
        { icon: <AlertCircle size={14} />, label: 'Issue', action: () => setInput('I\'m having a problem with the app') },
        { icon: <Ticket size={14} />, label: 'Ticket', action: () => setViewMode('ticket') },
    ];

    const categoryOptions: { value: TicketCategory; label: string; icon: React.ReactNode }[] = [
        { value: 'bug', label: 'Bug Report', icon: <Bug size={16} /> },
        { value: 'feature', label: 'Feature Request', icon: <Lightbulb size={16} /> },
        { value: 'question', label: 'Question', icon: <HelpCircle size={16} /> },
        { value: 'billing', label: 'Billing', icon: <CreditCard size={16} /> },
        { value: 'other', label: 'Other', icon: <MessageSquare size={16} /> },
    ];

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-sm h-[70vh] sm:h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-4 flex items-center gap-3">
                        {viewMode !== 'chat' && (
                            <button
                                onClick={() => viewMode === 'ticket-success' ? resetTicketForm() : setViewMode('chat')}
                                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white"
                            >
                                <ArrowLeft size={18} />
                            </button>
                        )}
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 bg-white flex-shrink-0">
                            <Image
                                src="/assistant-avatar.gif"
                                alt="Pip"
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                                unoptimized
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate">
                                {viewMode === 'chat' ? 'Pip - AI Assistant' : viewMode === 'ticket' ? 'Submit Ticket' : 'Ticket Submitted!'}
                            </h3>
                            <p className="text-blue-100 text-xs">
                                {viewMode === 'chat' ? 'Ask me anything about PostPipeline' : viewMode === 'ticket' ? 'We\'ll get back within 24 hours' : 'Check your email for confirmation'}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white flex-shrink-0"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Chat View */}
                    {viewMode === 'chat' && (
                        <>
                            {/* Quick Actions */}
                            <div className="px-3 py-2 border-b border-gray-100 flex gap-2 overflow-x-auto">
                                {quickActions.map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={action.action}
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-600 transition-colors whitespace-nowrap"
                                    >
                                        {action.icon}
                                        {action.label}
                                    </button>
                                ))}
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                                                message.role === 'user'
                                                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-br-md'
                                                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                                            }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-3 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Ask Pip anything..."
                                        className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                        disabled={isLoading}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isLoading}
                                        className="p-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-full hover:from-blue-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Ticket Form View */}
                    {viewMode === 'ticket' && (
                        <form onSubmit={handleSubmitTicket} className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-4">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                                    <input
                                        type="email"
                                        value={ticketEmail}
                                        onChange={(e) => setTicketEmail(e.target.value)}
                                        required
                                        placeholder="you@example.com"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {categoryOptions.slice(0, 3).map((cat) => (
                                            <button
                                                key={cat.value}
                                                type="button"
                                                onClick={() => setTicketCategory(cat.value)}
                                                className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-all ${
                                                    ticketCategory === cat.value
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                {cat.icon}
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {categoryOptions.slice(3).map((cat) => (
                                            <button
                                                key={cat.value}
                                                type="button"
                                                onClick={() => setTicketCategory(cat.value)}
                                                className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-all ${
                                                    ticketCategory === cat.value
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                {cat.icon}
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <div className="flex gap-2">
                                        {(['low', 'medium', 'high'] as TicketPriority[]).map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setTicketPriority(p)}
                                                className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                                                    ticketPriority === p
                                                        ? p === 'high'
                                                            ? 'border-red-500 bg-red-50 text-red-700'
                                                            : p === 'medium'
                                                            ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                                                            : 'border-green-500 bg-green-50 text-green-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                {p === 'high' ? '🔴' : p === 'medium' ? '🟡' : '🟢'} {p.charAt(0).toUpperCase() + p.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                                    <input
                                        type="text"
                                        value={ticketSubject}
                                        onChange={(e) => setTicketSubject(e.target.value)}
                                        required
                                        placeholder="Brief description of your issue"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                    <textarea
                                        value={ticketDescription}
                                        onChange={(e) => setTicketDescription(e.target.value)}
                                        required
                                        rows={4}
                                        placeholder="Please provide as much detail as possible..."
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                </div>

                                {/* Note about chat history */}
                                {messages.length > 1 && (
                                    <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                        💬 Your chat history with Pip will be included with this ticket to help us understand the context.
                                    </p>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmittingTicket || !ticketEmail || !ticketSubject || !ticketDescription}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmittingTicket ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Ticket size={18} />
                                            Submit Ticket
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Ticket Success View */}
                    {viewMode === 'ticket-success' && (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle size={32} className="text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ticket Submitted!</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                We've sent a confirmation to your email. Our team will respond within 24 hours.
                            </p>
                            {submittedTicketId && (
                                <div className="bg-gray-100 px-4 py-2 rounded-lg mb-6">
                                    <p className="text-xs text-gray-500">Ticket ID</p>
                                    <p className="text-lg font-mono font-bold text-blue-600">{submittedTicketId}</p>
                                </div>
                            )}
                            <button
                                onClick={resetTicketForm}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all"
                            >
                                Back to Chat
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
                    isOpen ? 'bg-gray-800' : ''
                }`}
                style={{
                    boxShadow: isOpen ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(59, 130, 246, 0.5)',
                }}
            >
                {isOpen ? (
                    <div className="w-full h-full flex items-center justify-center text-white">
                        <X size={24} />
                    </div>
                ) : (
                    <div className="relative w-full h-full">
                        {/* Pulse animation */}
                        {showPulse && (
                            <>
                                <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-30" />
                                <div className="absolute inset-0 rounded-full bg-blue-500 animate-pulse opacity-20" />
                            </>
                        )}
                        {/* Avatar */}
                        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white shadow-inner">
                            <Image
                                src="/assistant-avatar.gif"
                                alt="Chat with Pip"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                                unoptimized
                            />
                        </div>
                        {/* Online indicator */}
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                )}
            </button>
        </>
    );
}
