'use client';

import { useState, useCallback } from 'react';
import type {
  OnboardingData,
  OnboardingStep,
  BusinessInfo,
  AudienceInfo,
  StoryInfo,
  VoiceInfo,
  GeneratedStrategy,
} from '../types/onboarding';

const initialBusinessInfo: BusinessInfo = {
  name: '',
  types: [],
  oneLiner: '',
  website: '',
};

const initialAudienceInfo: AudienceInfo = {
  idealClient: '',
  painPoints: [],
  customPainPoint: '',
};

const initialStoryInfo: StoryInfo = {
  origin: '',
  commonMistake: '',
  transformation: '',
};

const initialVoiceInfo: VoiceInfo = {
  styles: [],
  tone: 'mix',
};

const initialData: OnboardingData = {
  business: initialBusinessInfo,
  audience: initialAudienceInfo,
  story: initialStoryInfo,
  voice: initialVoiceInfo,
};

export function useOnboardingState() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStrategy, setGeneratedStrategy] = useState<GeneratedStrategy | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateBusiness = useCallback((updates: Partial<BusinessInfo>) => {
    setData((prev) => ({
      ...prev,
      business: { ...prev.business, ...updates },
    }));
  }, []);

  const updateAudience = useCallback((updates: Partial<AudienceInfo>) => {
    setData((prev) => ({
      ...prev,
      audience: { ...prev.audience, ...updates },
    }));
  }, []);

  const updateStory = useCallback((updates: Partial<StoryInfo>) => {
    setData((prev) => ({
      ...prev,
      story: { ...prev.story, ...updates },
    }));
  }, []);

  const updateVoice = useCallback((updates: Partial<VoiceInfo>) => {
    setData((prev) => ({
      ...prev,
      voice: { ...prev.voice, ...updates },
    }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 6) as OnboardingStep);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as OnboardingStep);
  }, []);

  const goToStep = useCallback((step: OnboardingStep) => {
    setCurrentStep(step);
  }, []);

  const validateStep = useCallback((step: OnboardingStep): boolean => {
    switch (step) {
      case 1:
        return (
          data.business.name.trim() !== '' &&
          data.business.types.length > 0 &&
          data.business.oneLiner.trim() !== ''
        );
      case 2:
        return (
          data.audience.idealClient.trim() !== '' &&
          data.audience.painPoints.length > 0
        );
      case 3:
        return (
          data.story.origin.trim() !== '' &&
          data.story.commonMistake.trim() !== '' &&
          data.story.transformation.trim() !== ''
        );
      case 4:
        return data.voice.styles.length >= 2 && data.voice.styles.length <= 4;
      default:
        return true;
    }
  }, [data]);

  const generateStrategy = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/onboarding/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate strategy');
      }

      const result = await response.json();
      setGeneratedStrategy(result.strategy);
      setCurrentStep(6);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  }, [data]);

  const regenerateStrategy = useCallback(async () => {
    setCurrentStep(5);
    await generateStrategy();
  }, [generateStrategy]);

  const saveStrategy = useCallback(async () => {
    if (!generatedStrategy) return false;

    try {
      const response = await fetch('/api/onboarding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy: generatedStrategy }),
      });

      if (!response.ok) {
        throw new Error('Failed to save strategy');
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      return false;
    }
  }, [generatedStrategy]);

  const reset = useCallback(() => {
    setCurrentStep(1);
    setData(initialData);
    setGeneratedStrategy(null);
    setError(null);
  }, []);

  return {
    currentStep,
    data,
    isGenerating,
    generatedStrategy,
    error,
    updateBusiness,
    updateAudience,
    updateStory,
    updateVoice,
    nextStep,
    prevStep,
    goToStep,
    validateStep,
    generateStrategy,
    regenerateStrategy,
    saveStrategy,
    reset,
  };
}
