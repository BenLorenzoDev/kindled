'use client';

import { cn } from '@/lib/utils';
import type { BusinessInfo } from '../types/onboarding';
import { BUSINESS_TYPES } from '../types/onboarding';

interface StepBusinessProps {
  data: BusinessInfo;
  onUpdate: (updates: Partial<BusinessInfo>) => void;
}

export function StepBusiness({ data, onUpdate }: StepBusinessProps) {
  const toggleType = (type: string) => {
    const newTypes = data.types.includes(type)
      ? data.types.filter((t) => t !== type)
      : [...data.types, type];
    onUpdate({ types: newTypes });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Let's start with your business
        </h2>
        <p className="text-gray-600">
          Tell us about what you do so we can craft content that sounds like you.
        </p>
      </div>

      {/* Company Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          What's your company or brand name?
        </label>
        <input
          id="name"
          type="text"
          value={data.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="e.g., Acme Agency, John Smith Consulting"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-gray-900"
        />
      </div>

      {/* Business Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What type of business is this? <span className="text-gray-400">(select all that apply)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {BUSINESS_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                data.types.includes(type)
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* One-Liner */}
      <div>
        <label htmlFor="oneLiner" className="block text-sm font-medium text-gray-700 mb-2">
          Describe what you do in one sentence
        </label>
        <textarea
          id="oneLiner"
          value={data.oneLiner}
          onChange={(e) => onUpdate({ oneLiner: e.target.value })}
          placeholder="e.g., I help agencies automate their operations so they can scale without hiring more staff."
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-gray-900 resize-none"
        />
        <p className="mt-1 text-xs text-gray-500">
          Don't overthink it. Just explain it like you would to a friend.
        </p>
      </div>

      {/* Website (Optional) */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
          Website <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="website"
          type="url"
          value={data.website || ''}
          onChange={(e) => onUpdate({ website: e.target.value })}
          placeholder="https://yourwebsite.com"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-gray-900"
        />
      </div>
    </div>
  );
}
