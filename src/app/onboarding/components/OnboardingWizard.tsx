'use client';

import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboardingState } from '../hooks/useOnboardingState';
import { ProgressBar } from './ProgressBar';
import { StepBusiness } from './StepBusiness';
import { StepAudience } from './StepAudience';
import { StepStory } from './StepStory';
import { StepVoice } from './StepVoice';
import { StepGenerating } from './StepGenerating';
import { StepPreview } from './StepPreview';

export function OnboardingWizard() {
  const {
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
  } = useOnboardingState();

  const handleNext = async () => {
    if (currentStep === 4) {
      // Last input step - trigger generation
      nextStep(); // Go to step 5 (generating)
      await generateStrategy();
    } else {
      nextStep();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepBusiness data={data.business} onUpdate={updateBusiness} />;
      case 2:
        return <StepAudience data={data.audience} onUpdate={updateAudience} />;
      case 3:
        return <StepStory data={data.story} onUpdate={updateStory} />;
      case 4:
        return <StepVoice data={data.voice} onUpdate={updateVoice} />;
      case 5:
        return <StepGenerating />;
      case 6:
        return generatedStrategy ? (
          <StepPreview
            strategy={generatedStrategy}
            onRegenerate={regenerateStrategy}
            onSave={saveStrategy}
            isRegenerating={isGenerating}
          />
        ) : null;
      default:
        return null;
    }
  };

  const canProceed = validateStep(currentStep);
  const showNavigation = currentStep < 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Kindled
          </h1>
          <p className="text-gray-600 mt-1">Content Strategy Setup</p>
        </div>

        {/* Progress */}
        <ProgressBar currentStep={currentStep} onStepClick={goToStep} />

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {renderStep()}

          {/* Navigation */}
          {showNavigation && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                  currentStep === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all",
                  canProceed
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                {currentStep === 4 ? 'Generate Strategy' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Your information is used only to personalize your content strategy.
        </p>
      </div>
    </div>
  );
}
