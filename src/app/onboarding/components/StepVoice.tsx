'use client';

import { cn } from '@/lib/utils';
import type { VoiceInfo } from '../types/onboarding';
import { VOICE_STYLES, TONE_OPTIONS } from '../types/onboarding';

interface StepVoiceProps {
  data: VoiceInfo;
  onUpdate: (updates: Partial<VoiceInfo>) => void;
}

export function StepVoice({ data, onUpdate }: StepVoiceProps) {
  const toggleStyle = (styleId: string) => {
    const newStyles = data.styles.includes(styleId)
      ? data.styles.filter((s) => s !== styleId)
      : data.styles.length < 4
        ? [...data.styles, styleId]
        : data.styles;
    onUpdate({ styles: newStyles });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          How do you like to communicate?
        </h2>
        <p className="text-gray-600">
          This helps us match your natural voice in the content we generate.
        </p>
      </div>

      {/* Communication Styles */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pick 2-4 styles that describe how you communicate
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Selected: {data.styles.length}/4
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VOICE_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => toggleStyle(style.id)}
              disabled={!data.styles.includes(style.id) && data.styles.length >= 4}
              className={cn(
                "p-4 rounded-lg text-left transition-all border",
                data.styles.includes(style.id)
                  ? "bg-violet-50 border-violet-500"
                  : "bg-white border-gray-200 hover:bg-gray-50",
                !data.styles.includes(style.id) && data.styles.length >= 4
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                    data.styles.includes(style.id)
                      ? "border-violet-500 bg-violet-500"
                      : "border-gray-300"
                  )}
                >
                  {data.styles.includes(style.id) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className={cn(
                    "font-medium",
                    data.styles.includes(style.id) ? "text-violet-700" : "text-gray-900"
                  )}>
                    {style.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {style.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Overall tone preference
        </label>
        <div className="space-y-2">
          {TONE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onUpdate({ tone: option.id as VoiceInfo['tone'] })}
              className={cn(
                "w-full p-4 rounded-lg text-left transition-all border flex items-center gap-3",
                data.tone === option.id
                  ? "bg-violet-50 border-violet-500"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                  data.tone === option.id
                    ? "border-violet-500"
                    : "border-gray-300"
                )}
              >
                {data.tone === option.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                )}
              </div>
              <div>
                <div className={cn(
                  "font-medium",
                  data.tone === option.id ? "text-violet-700" : "text-gray-900"
                )}>
                  {option.label}
                </div>
                <div className="text-sm text-gray-500">
                  {option.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
