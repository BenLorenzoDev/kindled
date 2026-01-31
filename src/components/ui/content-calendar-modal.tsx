'use client';

import { cn } from '@/lib/utils';
import { X, ChevronLeft, ChevronRight, Plus, Calendar, Clock, Trash2, Edit2, Copy, Check, Bell, Mail, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ScheduledPost {
    id: string;
    content: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    status: 'draft' | 'scheduled';
    createdAt: number;
    reminderEnabled?: boolean;
    reminderEmail?: string;
    reminderId?: string;
}

interface ContentCalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImportPost?: (content: string) => void;
    currentPost?: string;
    isDark?: boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const BEST_TIMES = [
    { day: 'Tuesday', time: '10:00 AM', score: 95 },
    { day: 'Wednesday', time: '12:00 PM', score: 92 },
    { day: 'Thursday', time: '8:00 AM', score: 88 },
    { day: 'Tuesday', time: '5:00 PM', score: 85 },
    { day: 'Monday', time: '10:00 AM', score: 82 },
];

const STORAGE_KEY = 'linkedin-copywriter-calendar';

export function ContentCalendarModal({ isOpen, onClose, onImportPost, currentPost, isDark = false }: ContentCalendarModalProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [posts, setPosts] = useState<ScheduledPost[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
    const [formContent, setFormContent] = useState('');
    const [formTime, setFormTime] = useState('10:00');
    const [formStatus, setFormStatus] = useState<'draft' | 'scheduled'>('scheduled');
    const [formReminderEnabled, setFormReminderEnabled] = useState(false);
    const [formReminderEmail, setFormReminderEmail] = useState('');
    const [formReminderMinutes, setFormReminderMinutes] = useState(60);
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    // Load saved email from localStorage
    useEffect(() => {
        const savedEmail = localStorage.getItem('linkedin-copywriter-reminder-email');
        if (savedEmail) {
            setFormReminderEmail(savedEmail);
        }
    }, []);

    // Load posts from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setPosts(JSON.parse(saved));
        }
    }, []);

    // Save posts to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }, [posts]);

    // Pre-fill with current post if available
    useEffect(() => {
        if (currentPost && showAddForm && !editingPost) {
            setFormContent(currentPost);
        }
    }, [currentPost, showAddForm, editingPost]);

    if (!isOpen) return null;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date().toISOString().split('T')[0];

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const getPostsForDate = (date: string) => posts.filter(p => p.date === date);

    const formatDate = (day: number) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const handleDayClick = (day: number) => {
        const date = formatDate(day);
        setSelectedDate(date);
        setShowAddForm(false);
        setEditingPost(null);
    };

    const handleAddNew = () => {
        setFormContent(currentPost || '');
        setFormTime('10:00');
        setFormStatus('scheduled');
        setFormReminderEnabled(false);
        setEditingPost(null);
        setShowAddForm(true);
    };

    const handleEdit = (post: ScheduledPost) => {
        setFormContent(post.content);
        setFormTime(post.time);
        setFormStatus(post.status);
        setFormReminderEnabled(post.reminderEnabled || false);
        if (post.reminderEmail) setFormReminderEmail(post.reminderEmail);
        setEditingPost(post);
        setShowAddForm(true);
    };

    const handleSave = async () => {
        if (!formContent.trim() || !selectedDate) return;

        setIsSaving(true);

        try {
            let reminderId: string | undefined;

            // Schedule email reminder if enabled
            if (formReminderEnabled && formReminderEmail && formStatus === 'scheduled') {
                // Save email for future use
                localStorage.setItem('linkedin-copywriter-reminder-email', formReminderEmail);

                const response = await fetch('/api/calendar-reminder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        postContent: formContent,
                        postDate: selectedDate,
                        postTime: formTime,
                        reminderMinutesBefore: formReminderMinutes,
                        email: formReminderEmail,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    reminderId = data.reminderId;
                }
            }

            if (editingPost) {
                setPosts(prev => prev.map(p =>
                    p.id === editingPost.id
                        ? {
                            ...p,
                            content: formContent,
                            time: formTime,
                            status: formStatus,
                            reminderEnabled: formReminderEnabled,
                            reminderEmail: formReminderEmail,
                            reminderId: reminderId || p.reminderId,
                        }
                        : p
                ));
            } else {
                const newPost: ScheduledPost = {
                    id: `post-${Date.now()}`,
                    content: formContent,
                    date: selectedDate,
                    time: formTime,
                    status: formStatus,
                    createdAt: Date.now(),
                    reminderEnabled: formReminderEnabled,
                    reminderEmail: formReminderEmail,
                    reminderId,
                };
                setPosts(prev => [...prev, newPost]);
            }

            setShowAddForm(false);
            setEditingPost(null);
            setFormContent('');
        } catch (error) {
            console.error('Error saving post:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id: string) => {
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    const handleCopy = async (id: string, content: string) => {
        await navigator.clipboard.writeText(content);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleClose = () => {
        setSelectedDate(null);
        setShowAddForm(false);
        setEditingPost(null);
        onClose();
    };

    const selectedPosts = selectedDate ? getPostsForDate(selectedDate) : [];

    // Generate calendar days
    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
            <div
                className={cn(
                    "w-full max-w-5xl rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col",
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
                        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                            <Calendar size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className={cn(
                                "text-lg font-semibold",
                                isDark ? "text-neutral-100" : "text-gray-900"
                            )}>
                                Content Calendar
                            </h2>
                            <p className={cn(
                                "text-xs",
                                isDark ? "text-neutral-400" : "text-gray-500"
                            )}>
                                Plan and schedule your LinkedIn posts
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
                    {/* Calendar Grid */}
                    <div className={cn(
                        "flex-1 p-4 overflow-y-auto",
                        isDark ? "border-r border-neutral-700" : "border-r border-gray-200"
                    )}>
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={prevMonth}
                                className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    isDark ? "hover:bg-neutral-700 text-neutral-400" : "hover:bg-gray-100 text-gray-500"
                                )}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h3 className={cn(
                                "text-lg font-semibold",
                                isDark ? "text-neutral-100" : "text-gray-900"
                            )}>
                                {MONTHS[month]} {year}
                            </h3>
                            <button
                                onClick={nextMonth}
                                className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    isDark ? "hover:bg-neutral-700 text-neutral-400" : "hover:bg-gray-100 text-gray-500"
                                )}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {DAYS.map(day => (
                                <div
                                    key={day}
                                    className={cn(
                                        "text-center text-xs font-medium py-2",
                                        isDark ? "text-neutral-500" : "text-gray-500"
                                    )}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, index) => {
                                if (day === null) {
                                    return <div key={`empty-${index}`} className="aspect-square" />;
                                }

                                const date = formatDate(day);
                                const dayPosts = getPostsForDate(date);
                                const isToday = date === today;
                                const isSelected = date === selectedDate;
                                const isPast = date < today;

                                return (
                                    <button
                                        key={day}
                                        onClick={() => handleDayClick(day)}
                                        className={cn(
                                            "aspect-square p-1 rounded-lg transition-all flex flex-col items-center justify-start",
                                            isSelected
                                                ? "bg-indigo-500 text-white"
                                                : isToday
                                                    ? isDark
                                                        ? "bg-indigo-900/50 text-indigo-300 ring-1 ring-indigo-500"
                                                        : "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-300"
                                                    : isPast
                                                        ? isDark
                                                            ? "text-neutral-600 hover:bg-neutral-700"
                                                            : "text-gray-400 hover:bg-gray-50"
                                                        : isDark
                                                            ? "text-neutral-300 hover:bg-neutral-700"
                                                            : "text-gray-700 hover:bg-gray-100"
                                        )}
                                    >
                                        <span className="text-sm font-medium">{day}</span>
                                        {dayPosts.length > 0 && (
                                            <div className="flex gap-0.5 mt-1">
                                                {dayPosts.slice(0, 3).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={cn(
                                                            "w-1.5 h-1.5 rounded-full",
                                                            isSelected
                                                                ? "bg-white"
                                                                : "bg-indigo-500"
                                                        )}
                                                    />
                                                ))}
                                                {dayPosts.length > 3 && (
                                                    <span className={cn(
                                                        "text-[10px]",
                                                        isSelected ? "text-white" : "text-indigo-500"
                                                    )}>
                                                        +{dayPosts.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Best Times */}
                        <div className={cn(
                            "mt-6 p-4 rounded-lg",
                            isDark ? "bg-neutral-700/50" : "bg-indigo-50"
                        )}>
                            <h4 className={cn(
                                "text-sm font-semibold mb-3 flex items-center gap-2",
                                isDark ? "text-indigo-400" : "text-indigo-700"
                            )}>
                                <Clock size={14} />
                                Best Times to Post
                            </h4>
                            <div className="space-y-2">
                                {BEST_TIMES.slice(0, 3).map((slot, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "flex items-center justify-between text-sm",
                                            isDark ? "text-neutral-300" : "text-gray-700"
                                        )}
                                    >
                                        <span>{slot.day} at {slot.time}</span>
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-full",
                                            slot.score >= 90
                                                ? "bg-green-500/20 text-green-500"
                                                : "bg-blue-500/20 text-blue-500"
                                        )}>
                                            {slot.score}% optimal
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Selected Date / Add Form */}
                    <div className={cn(
                        "w-80 p-4 overflow-y-auto",
                        isDark ? "bg-neutral-850" : "bg-gray-50"
                    )}>
                        {!selectedDate ? (
                            <div className={cn(
                                "h-full flex items-center justify-center text-center",
                                isDark ? "text-neutral-500" : "text-gray-400"
                            )}>
                                <div>
                                    <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">Select a date to view or add posts</p>
                                </div>
                            </div>
                        ) : showAddForm ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className={cn(
                                        "font-semibold",
                                        isDark ? "text-neutral-200" : "text-gray-800"
                                    )}>
                                        {editingPost ? 'Edit Post' : 'New Post'}
                                    </h4>
                                    <button
                                        onClick={() => { setShowAddForm(false); setEditingPost(null); }}
                                        className={cn(
                                            "text-xs px-2 py-1 rounded",
                                            isDark ? "text-neutral-400 hover:text-neutral-200" : "text-gray-500 hover:text-gray-700"
                                        )}
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <div>
                                    <label className={cn(
                                        "block text-xs font-medium mb-1",
                                        isDark ? "text-neutral-400" : "text-gray-600"
                                    )}>
                                        Date: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </label>
                                </div>

                                <div>
                                    <label className={cn(
                                        "block text-xs font-medium mb-1",
                                        isDark ? "text-neutral-400" : "text-gray-600"
                                    )}>
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        value={formTime}
                                        onChange={(e) => setFormTime(e.target.value)}
                                        className={cn(
                                            "w-full rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
                                            isDark
                                                ? "bg-neutral-700 border border-neutral-600 text-neutral-100"
                                                : "bg-white border border-gray-200 text-gray-800"
                                        )}
                                    />
                                </div>

                                <div>
                                    <label className={cn(
                                        "block text-xs font-medium mb-1",
                                        isDark ? "text-neutral-400" : "text-gray-600"
                                    )}>
                                        Post Content
                                    </label>
                                    <textarea
                                        value={formContent}
                                        onChange={(e) => setFormContent(e.target.value)}
                                        placeholder="Write or paste your post content..."
                                        rows={8}
                                        className={cn(
                                            "w-full rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500",
                                            isDark
                                                ? "bg-neutral-700 border border-neutral-600 text-neutral-100 placeholder:text-neutral-500"
                                                : "bg-white border border-gray-200 text-gray-800 placeholder:text-gray-400"
                                        )}
                                    />
                                </div>

                                <div>
                                    <label className={cn(
                                        "block text-xs font-medium mb-2",
                                        isDark ? "text-neutral-400" : "text-gray-600"
                                    )}>
                                        Status
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setFormStatus('draft')}
                                            className={cn(
                                                "flex-1 py-2 rounded-lg text-xs font-medium transition-colors",
                                                formStatus === 'draft'
                                                    ? "bg-yellow-500 text-white"
                                                    : isDark
                                                        ? "bg-neutral-700 text-neutral-400"
                                                        : "bg-gray-200 text-gray-600"
                                            )}
                                        >
                                            Draft
                                        </button>
                                        <button
                                            onClick={() => setFormStatus('scheduled')}
                                            className={cn(
                                                "flex-1 py-2 rounded-lg text-xs font-medium transition-colors",
                                                formStatus === 'scheduled'
                                                    ? "bg-green-500 text-white"
                                                    : isDark
                                                        ? "bg-neutral-700 text-neutral-400"
                                                        : "bg-gray-200 text-gray-600"
                                            )}
                                        >
                                            Scheduled
                                        </button>
                                    </div>
                                </div>

                                {/* Email Reminder Section */}
                                {formStatus === 'scheduled' && (
                                    <div className={cn(
                                        "p-3 rounded-lg border",
                                        isDark ? "bg-neutral-700/50 border-neutral-600" : "bg-indigo-50 border-indigo-100"
                                    )}>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formReminderEnabled}
                                                onChange={(e) => setFormReminderEnabled(e.target.checked)}
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500"
                                            />
                                            <Bell size={14} className={isDark ? "text-indigo-400" : "text-indigo-600"} />
                                            <span className={cn(
                                                "text-xs font-medium",
                                                isDark ? "text-neutral-200" : "text-gray-700"
                                            )}>
                                                Email me a reminder
                                            </span>
                                        </label>

                                        {formReminderEnabled && (
                                            <div className="mt-3 space-y-3">
                                                <div>
                                                    <label className={cn(
                                                        "block text-xs font-medium mb-1",
                                                        isDark ? "text-neutral-400" : "text-gray-600"
                                                    )}>
                                                        Email address
                                                    </label>
                                                    <div className="relative">
                                                        <Mail size={14} className={cn(
                                                            "absolute left-2.5 top-1/2 -translate-y-1/2",
                                                            isDark ? "text-neutral-500" : "text-gray-400"
                                                        )} />
                                                        <input
                                                            type="email"
                                                            value={formReminderEmail}
                                                            onChange={(e) => setFormReminderEmail(e.target.value)}
                                                            placeholder="your@email.com"
                                                            className={cn(
                                                                "w-full rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
                                                                isDark
                                                                    ? "bg-neutral-700 border border-neutral-600 text-neutral-100 placeholder:text-neutral-500"
                                                                    : "bg-white border border-gray-200 text-gray-800 placeholder:text-gray-400"
                                                            )}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className={cn(
                                                        "block text-xs font-medium mb-1",
                                                        isDark ? "text-neutral-400" : "text-gray-600"
                                                    )}>
                                                        Remind me
                                                    </label>
                                                    <select
                                                        value={formReminderMinutes}
                                                        onChange={(e) => setFormReminderMinutes(Number(e.target.value))}
                                                        className={cn(
                                                            "w-full rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
                                                            isDark
                                                                ? "bg-neutral-700 border border-neutral-600 text-neutral-100"
                                                                : "bg-white border border-gray-200 text-gray-800"
                                                        )}
                                                    >
                                                        <option value={15}>15 minutes before</option>
                                                        <option value={30}>30 minutes before</option>
                                                        <option value={60}>1 hour before</option>
                                                        <option value={120}>2 hours before</option>
                                                        <option value={1440}>1 day before</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={handleSave}
                                    disabled={!formContent.trim() || isSaving || (formReminderEnabled && !formReminderEmail)}
                                    className={cn(
                                        "w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                                        (!formContent.trim() || isSaving || (formReminderEnabled && !formReminderEmail))
                                            ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
                                            : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                                    )}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        editingPost ? 'Save Changes' : 'Add to Calendar'
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className={cn(
                                        "font-semibold",
                                        isDark ? "text-neutral-200" : "text-gray-800"
                                    )}>
                                        {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </h4>
                                    <button
                                        onClick={handleAddNew}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                                    >
                                        <Plus size={14} />
                                        Add Post
                                    </button>
                                </div>

                                {selectedPosts.length === 0 ? (
                                    <div className={cn(
                                        "text-center py-8",
                                        isDark ? "text-neutral-500" : "text-gray-400"
                                    )}>
                                        <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No posts scheduled</p>
                                        <p className="text-xs mt-1">Click &quot;Add Post&quot; to schedule content</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedPosts
                                            .sort((a, b) => a.time.localeCompare(b.time))
                                            .map(post => (
                                                <div
                                                    key={post.id}
                                                    className={cn(
                                                        "p-3 rounded-lg border",
                                                        isDark ? "bg-neutral-700 border-neutral-600" : "bg-white border-gray-200"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={12} className={isDark ? "text-neutral-400" : "text-gray-400"} />
                                                            <span className={cn(
                                                                "text-xs",
                                                                isDark ? "text-neutral-400" : "text-gray-500"
                                                            )}>
                                                                {post.time}
                                                            </span>
                                                            <span className={cn(
                                                                "text-xs px-1.5 py-0.5 rounded",
                                                                post.status === 'scheduled'
                                                                    ? "bg-green-500/20 text-green-500"
                                                                    : "bg-yellow-500/20 text-yellow-600"
                                                            )}>
                                                                {post.status}
                                                            </span>
                                                            {post.reminderEnabled && (
                                                                <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-500 flex items-center gap-1">
                                                                    <Bell size={10} />
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleCopy(post.id, post.content)}
                                                                className={cn(
                                                                    "p-1 rounded transition-colors",
                                                                    copied === post.id
                                                                        ? "text-green-500"
                                                                        : isDark
                                                                            ? "text-neutral-400 hover:text-neutral-200"
                                                                            : "text-gray-400 hover:text-gray-600"
                                                                )}
                                                            >
                                                                {copied === post.id ? <Check size={14} /> : <Copy size={14} />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleEdit(post)}
                                                                className={cn(
                                                                    "p-1 rounded transition-colors",
                                                                    isDark ? "text-neutral-400 hover:text-neutral-200" : "text-gray-400 hover:text-gray-600"
                                                                )}
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(post.id)}
                                                                className="p-1 rounded text-red-400 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className={cn(
                                                        "text-sm line-clamp-3",
                                                        isDark ? "text-neutral-300" : "text-gray-700"
                                                    )}>
                                                        {post.content}
                                                    </p>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Stats */}
                <div className={cn(
                    "p-3 border-t flex items-center justify-between text-xs",
                    isDark ? "border-neutral-700 text-neutral-400" : "border-gray-200 text-gray-500"
                )}>
                    <div className="flex items-center gap-4">
                        <span>Total: {posts.length} posts</span>
                        <span>Scheduled: {posts.filter(p => p.status === 'scheduled').length}</span>
                        <span>Drafts: {posts.filter(p => p.status === 'draft').length}</span>
                    </div>
                    <div>
                        This week: {posts.filter(p => {
                            const postDate = new Date(p.date);
                            const now = new Date();
                            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                            const weekEnd = new Date(weekStart);
                            weekEnd.setDate(weekEnd.getDate() + 7);
                            return postDate >= weekStart && postDate < weekEnd;
                        }).length} posts
                    </div>
                </div>
            </div>
        </div>
    );
}
