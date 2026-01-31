'use client';

import { cn } from '@/lib/utils';
import type { AudienceInfo } from '../types/onboarding';
import { PAIN_POINTS } from '../types/onboarding';

interface StepAudienceProps {
  data: AudienceInfo;
  onUpdate: (updates: Partial<AudienceInfo>) => void;
}

export function StepAudience({ data, onUpdate }: StepAudienceProps) {
  const togglePainPoint = (point: string) => {
    const newPoints = data.painPoints.includes(point)
      ? data.painPoints.filter((p) => p !== point)
      : [...data.painPoints, point];
    onUpdate({ painPoints: newPoints });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Who do you help?
        </h2>
        <p className="text-gray-600">
          Understanding your audience helps us create content that resonates with them.
        </p>
      </div>

      {/* Ideal Client */}
      <div>
        <label htmlFor="idealClient" className="block text-sm font-medium text-gray-700 mb-2">
          Describe your ideal client
        </label>
        <textarea
          id="idealClient"
          value={data.idealClient}
          onChange={(e) => onUpdate({ idealClient: e.target.value })}
          placeholder="e.g., Agency owners doing $20K-$100K/month who are drowning in client work and can't scale because they're stuck doing everything themselves."
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-gray-900 resize-none"
        />
        <p className="mt-1 text-xs text-gray-500">
          Be specific. Include their role, industry, company size, or situation.
        </p>
      </div>

      {/* Pain Points */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What are their biggest pain points? <span className="text-gray-400">(select all that apply)</span>
        </label>
        <div className="space-y-2">
          {PAIN_POINTS.map((point) => (
            <button
              key={point}
              type="button"
              onClick={() => togglePainPoint(point)}
              className={cn(
                "w-full px-4 py-3 rounded-lg text-left text-sm font-medium transition-all border",
                data.painPoints.includes(point)
                  ? "bg-violet-50 border-violet-500 text-violet-700"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    data.painPoints.includes(point)
                      ? "border-violet-500 bg-violet-500"
                      : "border-gray-300"
                  )}
                >
                  {data.painPoints.includes(point) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                {point}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Pain Point */}
      <div>
        <label htmlFor="customPainPoint" className="block text-sm font-medium text-gray-700 mb-2">
          Any other pain points? <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="customPainPoint"
          type="text"
          value={data.customPainPoint || ''}
          onChange={(e) => onUpdate({ customPainPoint: e.target.value })}
          placeholder="Add a specific pain point for your audience..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-gray-900"
        />
      </div>
    </div>
  );
}
