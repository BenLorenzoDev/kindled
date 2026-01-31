'use client';

import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
    message: string;
    type?: 'success' | 'error';
    duration?: number;
    onClose: () => void;
    isDark?: boolean;
}

export function Toast({ message, type = 'success', duration = 2000, onClose, isDark = false }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={cn(
                "fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
                type === 'success'
                    ? isDark ? "bg-green-900/90 text-green-100" : "bg-green-600 text-white"
                    : isDark ? "bg-red-900/90 text-red-100" : "bg-red-600 text-white"
            )}
        >
            {type === 'success' ? <Check size={16} /> : <X size={16} />}
            <span className="text-sm font-medium">{message}</span>
        </div>
    );
}
