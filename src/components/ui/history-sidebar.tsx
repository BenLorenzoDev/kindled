'use client';

import { cn } from '@/lib/utils';
import { X, Clock, Trash2 } from 'lucide-react';

export interface HistoryItem {
    id: string;
    prompt: string;
    content: string;
    timestamp: number;
}

interface HistorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
    onDelete: (id: string) => void;
    onClear: () => void;
    isDark?: boolean;
}

export function HistorySidebar({
    isOpen,
    onClose,
    history,
    onSelect,
    onDelete,
    onClear,
    isDark = false
}: HistorySidebarProps) {
    if (!isOpen) return null;

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/30"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={cn(
                "fixed left-0 top-0 bottom-0 w-80 z-50 shadow-xl flex flex-col",
                isDark ? "bg-neutral-900" : "bg-white"
            )}>
                {/* Header */}
                <div className={cn(
                    "flex items-center justify-between p-4 border-b",
                    isDark ? "border-neutral-800" : "border-gray-200"
                )}>
                    <div className="flex items-center gap-2">
                        <Clock size={18} className={isDark ? "text-neutral-400" : "text-gray-500"} />
                        <h2 className={cn(
                            "font-semibold",
                            isDark ? "text-neutral-100" : "text-gray-900"
                        )}>
                            History
                        </h2>
                        <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            isDark ? "bg-neutral-800 text-neutral-400" : "bg-gray-100 text-gray-500"
                        )}>
                            {history.length}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className={cn(
                            "p-1.5 rounded-lg transition-colors",
                            isDark ? "hover:bg-neutral-800 text-neutral-400" : "hover:bg-gray-100 text-gray-500"
                        )}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* History list */}
                <div className="flex-1 overflow-y-auto p-2">
                    {history.length === 0 ? (
                        <div className={cn(
                            "text-center py-8 text-sm",
                            isDark ? "text-neutral-500" : "text-gray-400"
                        )}>
                            No history yet
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {history.map(item => (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "p-3 rounded-lg cursor-pointer group transition-colors",
                                        isDark ? "hover:bg-neutral-800" : "hover:bg-gray-50"
                                    )}
                                    onClick={() => onSelect(item)}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-sm font-medium truncate",
                                                isDark ? "text-neutral-200" : "text-gray-800"
                                            )}>
                                                {item.prompt.slice(0, 50)}...
                                            </p>
                                            <p className={cn(
                                                "text-xs mt-1 line-clamp-2",
                                                isDark ? "text-neutral-500" : "text-gray-500"
                                            )}>
                                                {item.content.slice(0, 100)}...
                                            </p>
                                            <p className={cn(
                                                "text-xs mt-2",
                                                isDark ? "text-neutral-600" : "text-gray-400"
                                            )}>
                                                {formatTime(item.timestamp)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(item.id);
                                            }}
                                            className={cn(
                                                "p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity",
                                                isDark ? "hover:bg-neutral-700 text-neutral-500" : "hover:bg-gray-200 text-gray-400"
                                            )}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Clear button */}
                {history.length > 0 && (
                    <div className={cn(
                        "p-3 border-t",
                        isDark ? "border-neutral-800" : "border-gray-200"
                    )}>
                        <button
                            onClick={onClear}
                            className={cn(
                                "w-full py-2 text-sm font-medium rounded-lg transition-colors",
                                isDark
                                    ? "text-red-400 hover:bg-red-900/30"
                                    : "text-red-600 hover:bg-red-50"
                            )}
                        >
                            Clear All History
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
