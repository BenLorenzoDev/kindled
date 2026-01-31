'use client';

import { cn } from '@/lib/utils';
import {
    X,
    Zap,
    TrendingUp,
    Lightbulb,
    Radar,
    User,
    Target,
    Heart,
    MessageCircle,
    CalendarDays,
    ChevronRight,
    Briefcase,
    Layers,
    FolderOpen,
} from 'lucide-react';

interface Tool {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
}

interface ToolsSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenTool: (tool: string) => void;
    isDark?: boolean;
}

export function ToolsSidebar({ isOpen, onClose, onOpenTool }: ToolsSidebarProps) {
    const tools: Tool[] = [
        {
            id: 'profile',
            name: 'Profile Optimizer',
            description: 'Upload resume & optimize experience',
            icon: <User size={20} />,
            onClick: () => onOpenTool('profile'),
        },
        {
            id: 'trends',
            name: 'Trend Scanner',
            description: 'Scan industry trends & generate content',
            icon: <Radar size={20} />,
            onClick: () => onOpenTool('trends'),
        },
        {
            id: 'ideas',
            name: 'Post Ideas',
            description: 'Generate 8 viral post ideas with hooks',
            icon: <Lightbulb size={20} />,
            onClick: () => onOpenTool('ideas'),
        },
        {
            id: 'templates',
            name: 'Top 10 Viral Templates',
            description: 'Proven viral post frameworks',
            icon: <TrendingUp size={20} />,
            onClick: () => onOpenTool('templates'),
        },
        {
            id: 'hacker',
            name: 'Viral Post Hacker',
            description: 'Reverse-engineer any viral post',
            icon: <Zap size={20} />,
            onClick: () => onOpenTool('hacker'),
        },
        {
            id: 'cadence',
            name: 'Sales Cadence',
            description: 'Generate outreach scripts from engagement',
            icon: <Target size={20} />,
            onClick: () => onOpenTool('cadence'),
        },
        {
            id: 'engage',
            name: 'Engagement Responder',
            description: 'Batch respond to reactions & comments',
            icon: <Heart size={20} />,
            onClick: () => onOpenTool('engage'),
        },
        {
            id: 'comment',
            name: 'Comment Generator',
            description: 'Generate thoughtful comments',
            icon: <MessageCircle size={20} />,
            onClick: () => onOpenTool('comment'),
        },
        {
            id: 'calendar',
            name: 'Content Calendar',
            description: 'Plan and schedule your posts',
            icon: <CalendarDays size={20} />,
            onClick: () => onOpenTool('calendar'),
        },
        {
            id: 'jobs',
            name: 'Job Alerts',
            description: 'Track LinkedIn job alerts with AI matching',
            icon: <Briefcase size={20} />,
            onClick: () => onOpenTool('jobs'),
        },
        {
            id: 'series',
            name: 'Content Series',
            description: 'Create multi-day connected posts',
            icon: <Layers size={20} />,
            onClick: () => onOpenTool('series'),
        },
        {
            id: 'series-manager',
            name: 'Series Manager',
            description: 'View and manage saved series',
            icon: <FolderOpen size={20} />,
            onClick: () => onOpenTool('series-manager'),
        },
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar - LinkedIn Style */}
            <div
                className={cn(
                    "fixed top-0 right-0 z-50 h-full w-80 shadow-xl transition-transform duration-300 ease-out flex flex-col bg-white",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="p-4 border-b border-[rgba(0,0,0,0.08)] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center">
                            <span className="text-white font-bold">in</span>
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-[rgba(0,0,0,0.9)]">
                                Tools
                            </h2>
                            <p className="text-xs text-[rgba(0,0,0,0.6)]">
                                12 tools to boost your LinkedIn
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full transition-colors hover:bg-[#EEF3F8] text-[rgba(0,0,0,0.6)]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tools List */}
                <div className="flex-1 overflow-y-auto py-2">
                    {tools.map((tool) => (
                        <button
                            key={tool.id}
                            onClick={() => {
                                tool.onClick();
                                onClose();
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 transition-all group text-left hover:bg-[#EEF3F8]"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#EEF3F8] flex items-center justify-center text-[#0A66C2] group-hover:bg-[#0A66C2] group-hover:text-white transition-colors">
                                {tool.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm text-[rgba(0,0,0,0.9)]">
                                    {tool.name}
                                </div>
                                <div className="text-xs text-[rgba(0,0,0,0.6)] truncate">
                                    {tool.description}
                                </div>
                            </div>
                            <ChevronRight
                                size={16}
                                className="text-[rgba(0,0,0,0.4)] transition-transform group-hover:translate-x-1 group-hover:text-[#0A66C2]"
                            />
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[rgba(0,0,0,0.08)] text-center">
                    <p className="text-xs text-[rgba(0,0,0,0.6)]">
                        Press <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#EEF3F8] text-[rgba(0,0,0,0.9)]">T</kbd> to toggle tools
                    </p>
                </div>
            </div>
        </>
    );
}
