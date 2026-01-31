'use client';

import { cn } from '@/lib/utils';
import { X, MessageSquare, ImageIcon, Eye, Sparkles, Copy, Download } from 'lucide-react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDark?: boolean;
}

export function HelpModal({ isOpen, onClose, isDark = false }: HelpModalProps) {
    if (!isOpen) return null;

    const steps = [
        {
            icon: MessageSquare,
            title: "1. Describe Your Post",
            description: "Type what you want to write about. Be specific - mention the topic, angle, or story you want to tell."
        },
        {
            icon: Sparkles,
            title: "2. Generate & Refine",
            description: "Click send to generate. Use Shorter, Bolder, or Professional buttons to adjust the tone."
        },
        {
            icon: ImageIcon,
            title: "3. Generate Image",
            description: "Click 'Generate Image' to create a matching visual. Images show human reactions that capture the post's emotion."
        },
        {
            icon: Eye,
            title: "4. Preview",
            description: "Click 'Preview' to see how your post and image will look on LinkedIn."
        },
        {
            icon: Download,
            title: "5. Download Image",
            description: "Click 'Download' to save the image to your device."
        },
        {
            icon: Copy,
            title: "6. Copy & Post",
            description: "Click 'Copy' to copy the text, then paste it into LinkedIn along with your downloaded image."
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <div
                className={cn(
                    "w-full max-w-lg rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col",
                    isDark ? "bg-neutral-800" : "bg-white"
                )}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={cn(
                    "p-4 border-b flex items-center justify-between",
                    isDark ? "border-neutral-700" : "border-gray-200"
                )}>
                    <h2 className={cn(
                        "text-lg font-semibold",
                        isDark ? "text-neutral-100" : "text-gray-900"
                    )}>
                        How to Use
                    </h2>
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
                    <div className="space-y-4">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex gap-3 p-3 rounded-lg",
                                    isDark ? "bg-neutral-700/50" : "bg-gray-50"
                                )}
                            >
                                <div className={cn(
                                    "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                                    isDark ? "bg-blue-900/50 text-blue-400" : "bg-blue-100 text-blue-600"
                                )}>
                                    <step.icon size={20} />
                                </div>
                                <div>
                                    <h3 className={cn(
                                        "font-medium text-sm",
                                        isDark ? "text-neutral-200" : "text-gray-800"
                                    )}>
                                        {step.title}
                                    </h3>
                                    <p className={cn(
                                        "text-xs mt-1",
                                        isDark ? "text-neutral-400" : "text-gray-500"
                                    )}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tips */}
                    <div className={cn(
                        "mt-6 p-4 rounded-lg border",
                        isDark ? "border-neutral-600 bg-neutral-700/30" : "border-gray-200 bg-gray-50"
                    )}>
                        <h3 className={cn(
                            "font-medium text-sm mb-2",
                            isDark ? "text-neutral-200" : "text-gray-800"
                        )}>
                            Pro Tips
                        </h3>
                        <ul className={cn(
                            "text-xs space-y-1.5",
                            isDark ? "text-neutral-400" : "text-gray-500"
                        )}>
                            <li>Use the tone selector to match your mood (Inspirational, Data-Driven, etc.)</li>
                            <li>Edit posts inline by clicking the Edit button</li>
                            <li>Check character count - LinkedIn limit is 3,000 characters</li>
                            <li>Images cost about 4.5 cents each (OpenAI billing)</li>
                        </ul>
                    </div>
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
                                ? "bg-blue-600 text-white hover:bg-blue-500"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                        )}
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
}
