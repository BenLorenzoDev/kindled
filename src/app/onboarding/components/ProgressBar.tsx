'use client';

import { cn } from '@/lib/utils';
import type { OnboardingStep } from '../types/onboarding';

interface ProgressBarProps {
  currentStep: OnboardingStep;
  onStepClick?: (step: OnboardingStep) => void;
}

const STEPS = [
  { step: 1 as const, label: 'Business' },
  { step: 2 as const, label: 'Audience' },
  { step: 3 as const, label: 'Story' },
  { step: 4 as const, label: 'Voice' },
  { step: 5 as const, label: 'Generate' },
  { step: 6 as const, label: 'Preview' },
];

export function ProgressBar({ currentStep, onStepClick }: ProgressBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map(({ step, label }, index) => (
          <div key={step} className="flex items-center">
            <button
              onClick={() => step < currentStep && onStepClick?.(step)}
              disabled={step >= currentStep}
              className={cn(
                "flex flex-col items-center",
                step < currentStep && "cursor-pointer",
                step >= currentStep && "cursor-default"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  step < currentStep && "bg-emerald-500 text-white",
                  step === currentStep && "bg-violet-600 text-white ring-4 ring-violet-200",
                  step > currentStep && "bg-gray-200 text-gray-500"
                )}
              >
                {step < currentStep ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium hidden sm:block",
                  step <= currentStep ? "text-gray-900" : "text-gray-400"
                )}
              >
                {label}
              </span>
            </button>

            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-8 sm:w-16 h-1 mx-1 sm:mx-2 rounded-full transition-all",
                  step < currentStep ? "bg-emerald-500" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
