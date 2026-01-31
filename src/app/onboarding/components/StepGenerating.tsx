'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const LOADING_MESSAGES = [
  { icon: '🔥', text: 'Analyzing your business...' },
  { icon: '📊', text: 'Building content pillars...' },
  { icon: '🎣', text: 'Generating hook templates...' },
  { icon: '✍️', text: 'Crafting your brand voice...' },
  { icon: '🎯', text: 'Creating CTA library...' },
  { icon: '📅', text: 'Setting up daily templates...' },
  { icon: '✨', text: 'Finalizing your strategy...' },
];

export function StepGenerating() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentMessage = LOADING_MESSAGES[messageIndex];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl">
          {currentMessage.icon}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        Creating Your Content Strategy
      </h2>

      <p className="text-gray-600 mb-8 text-center animate-pulse">
        {currentMessage.text}
      </p>

      <div className="w-full max-w-xs">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${((messageIndex + 1) / LOADING_MESSAGES.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          This usually takes 10-15 seconds
        </p>
      </div>
    </div>
  );
}
