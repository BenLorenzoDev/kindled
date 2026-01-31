'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, RefreshCw, Check, Sparkles } from 'lucide-react';
import type { GeneratedStrategy } from '../types/onboarding';

interface StepPreviewProps {
  strategy: GeneratedStrategy;
  onRegenerate: () => void;
  onSave: () => Promise<boolean>;
  isRegenerating?: boolean;
}

type Section = 'pillars' | 'hooks' | 'ctas' | 'voice' | 'templates';

export function StepPreview({ strategy, onRegenerate, onSave, isRegenerating }: StepPreviewProps) {
  const [expandedSections, setExpandedSections] = useState<Section[]>(['pillars']);
  const [isSaving, setIsSaving] = useState(false);

  const toggleSection = (section: Section) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await onSave();
    if (success) {
      window.location.href = '/';
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Content Strategy is Ready!
        </h2>
        <p className="text-gray-600">
          Review your personalized strategy below. You can regenerate if needed.
        </p>
      </div>

      {/* Brand Summary */}
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            {strategy.brand.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{strategy.brand.name}</h3>
            <p className="text-sm text-gray-600">{strategy.brand.tagline}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-violet-600 text-white text-sm rounded-full font-medium">
            {strategy.brand.hashtags.primary}
          </span>
          {strategy.brand.hashtags.secondary.slice(0, 4).map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white text-violet-600 text-sm rounded-full border border-violet-200">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content Pillars */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('pillars')}
          className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🎯</span>
            <span className="font-semibold text-gray-900">Content Pillars</span>
            <span className="text-sm text-gray-500">({strategy.pillars.length} pillars)</span>
          </div>
          {expandedSections.includes('pillars') ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expandedSections.includes('pillars') && (
          <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
            {strategy.pillars.map((pillar, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">{pillar.name}</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-red-600">Problem:</span> {pillar.problem}</p>
                  <p><span className="font-medium text-emerald-600">Truth:</span> {pillar.truth}</p>
                  <p><span className="font-medium text-violet-600">Narrative:</span> "{pillar.narrative}"</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hooks */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('hooks')}
          className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🎣</span>
            <span className="font-semibold text-gray-900">Hook Library</span>
            <span className="text-sm text-gray-500">(12 templates)</span>
          </div>
          {expandedSections.includes('hooks') ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expandedSections.includes('hooks') && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="grid gap-4">
              {Object.entries(strategy.hooks).map(([type, hooks]) => (
                <div key={type} className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2 capitalize">{type} Hooks</h4>
                  <ul className="space-y-1">
                    {hooks.map((hook: string, i: number) => (
                      <li key={i} className="text-sm text-gray-600 italic">"{hook}"</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('ctas')}
          className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">💬</span>
            <span className="font-semibold text-gray-900">CTA Library</span>
            <span className="text-sm text-gray-500">(8 templates)</span>
          </div>
          {expandedSections.includes('ctas') ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expandedSections.includes('ctas') && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="grid gap-4">
              {Object.entries(strategy.ctas).map(([type, ctas]) => (
                <div key={type} className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2 capitalize">{type}</h4>
                  <ul className="space-y-1">
                    {ctas.map((cta: string, i: number) => (
                      <li key={i} className="text-sm text-gray-600">• {cta}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Voice */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('voice')}
          className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🎤</span>
            <span className="font-semibold text-gray-900">Voice Profile</span>
          </div>
          {expandedSections.includes('voice') ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expandedSections.includes('voice') && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
              <p><span className="font-medium">Tone:</span> {strategy.voice.tone}</p>
              <p><span className="font-medium">Styles:</span> {strategy.voice.styles.join(', ')}</p>
              <div>
                <span className="font-medium">Guidelines:</span>
                <ul className="mt-1 space-y-1">
                  {strategy.voice.guidelines.map((g, i) => (
                    <li key={i} className="text-sm text-gray-600">• {g}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className={cn(
            "flex-1 py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
            "border border-gray-300 text-gray-700 hover:bg-gray-50",
            isRegenerating && "opacity-50 cursor-not-allowed"
          )}
        >
          <RefreshCw className={cn("w-5 h-5", isRegenerating && "animate-spin")} />
          {isRegenerating ? 'Regenerating...' : 'Regenerate Strategy'}
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "flex-1 py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
            "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700",
            isSaving && "opacity-50 cursor-not-allowed"
          )}
        >
          <Check className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save & Start Creating'}
        </button>
      </div>
    </div>
  );
}
