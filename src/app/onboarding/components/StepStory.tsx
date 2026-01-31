'use client';

import type { StoryInfo } from '../types/onboarding';

interface StepStoryProps {
  data: StoryInfo;
  onUpdate: (updates: Partial<StoryInfo>) => void;
}

export function StepStory({ data, onUpdate }: StepStoryProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tell us your story
        </h2>
        <p className="text-gray-600">
          Your unique perspective is what makes your content stand out.
        </p>
      </div>

      {/* Origin Story */}
      <div>
        <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
          Why did you start this business?
        </label>
        <textarea
          id="origin"
          value={data.origin}
          onChange={(e) => onUpdate({ origin: e.target.value })}
          placeholder="e.g., I was an operations manager at an agency, working 70-hour weeks doing repetitive tasks. I built automations to save myself, and realized others needed the same help."
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-gray-900 resize-none"
        />
        <p className="mt-1 text-xs text-gray-500">
          What problem did you experience that led you here?
        </p>
      </div>

      {/* Common Mistake */}
      <div>
        <label htmlFor="commonMistake" className="block text-sm font-medium text-gray-700 mb-2">
          What mistake do clients make before finding you?
        </label>
        <textarea
          id="commonMistake"
          value={data.commonMistake}
          onChange={(e) => onUpdate({ commonMistake: e.target.value })}
          placeholder="e.g., They try to hire more people to handle the workload instead of building systems. They end up spending $50K+ on staff when a $500/month tool could do it better."
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-gray-900 resize-none"
        />
        <p className="mt-1 text-xs text-gray-500">
          This becomes great "horror story" content material.
        </p>
      </div>

      {/* Transformation */}
      <div>
        <label htmlFor="transformation" className="block text-sm font-medium text-gray-700 mb-2">
          What transformation do you help people achieve?
        </label>
        <textarea
          id="transformation"
          value={data.transformation}
          onChange={(e) => onUpdate({ transformation: e.target.value })}
          placeholder="e.g., They go from working 60-hour weeks chasing tasks to 25-hour weeks focused on growth. Same revenue, half the stress, and finally able to take vacations."
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-gray-900 resize-none"
        />
        <p className="mt-1 text-xs text-gray-500">
          Focus on the before → after. Be specific about results.
        </p>
      </div>
    </div>
  );
}
