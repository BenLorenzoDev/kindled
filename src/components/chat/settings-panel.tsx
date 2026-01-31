'use client';

import { cn } from '@/lib/utils';
import type { PersonaType, ModeType, TemperatureType } from '@/types';

interface SettingsPanelProps {
    persona: PersonaType;
    mode: ModeType;
    temperature: TemperatureType;
    onPersonaChange: (persona: PersonaType) => void;
    onModeChange: (mode: ModeType) => void;
    onTemperatureChange: (temp: TemperatureType) => void;
    disabled?: boolean;
    isDark?: boolean;
}

interface OptionButtonProps {
    selected: boolean;
    onClick: () => void;
    disabled?: boolean;
    isDark?: boolean;
    children: React.ReactNode;
}

function OptionButton({ selected, onClick, disabled, isDark = false, children }: OptionButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                selected
                    ? isDark
                        ? "bg-neutral-100 text-neutral-900"
                        : "bg-stone-800 text-white"
                    : isDark
                        ? "text-neutral-400 hover:bg-neutral-700"
                        : "text-stone-600 hover:bg-stone-100",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            {children}
        </button>
    );
}

interface SettingGroupProps {
    label: string;
    isDark?: boolean;
    children: React.ReactNode;
}

function SettingGroup({ label, isDark = false, children }: SettingGroupProps) {
    return (
        <div className="flex items-center gap-3">
            <span className={cn(
                "text-xs min-w-[70px]",
                isDark ? "text-neutral-500" : "text-stone-500"
            )}>
                {label}
            </span>
            <div className="flex gap-1">
                {children}
            </div>
        </div>
    );
}

export function SettingsPanel({
    persona,
    mode,
    temperature,
    onPersonaChange,
    onModeChange,
    onTemperatureChange,
    disabled,
    isDark = false
}: SettingsPanelProps) {
    return (
        <div className={cn(
            "rounded-xl p-4 space-y-3",
            isDark ? "bg-neutral-800" : "bg-stone-50"
        )}>
            <SettingGroup label="Persona" isDark={isDark}>
                <OptionButton
                    selected={persona === 'coach'}
                    onClick={() => onPersonaChange('coach')}
                    disabled={disabled}
                    isDark={isDark}
                >
                    Sales Coach
                </OptionButton>
                <OptionButton
                    selected={persona === 'architect'}
                    onClick={() => onPersonaChange('architect')}
                    disabled={disabled}
                    isDark={isDark}
                >
                    Architect
                </OptionButton>
            </SettingGroup>

            <SettingGroup label="Mode" isDark={isDark}>
                <OptionButton
                    selected={mode === 'arm'}
                    onClick={() => onModeChange('arm')}
                    disabled={disabled}
                    isDark={isDark}
                >
                    Story
                </OptionButton>
                <OptionButton
                    selected={mode === 'outcome'}
                    onClick={() => onModeChange('outcome')}
                    disabled={disabled}
                    isDark={isDark}
                >
                    Tactical
                </OptionButton>
            </SettingGroup>

            <SettingGroup label="Creativity" isDark={isDark}>
                <OptionButton
                    selected={temperature === 'low'}
                    onClick={() => onTemperatureChange('low')}
                    disabled={disabled}
                    isDark={isDark}
                >
                    Low
                </OptionButton>
                <OptionButton
                    selected={temperature === 'medium'}
                    onClick={() => onTemperatureChange('medium')}
                    disabled={disabled}
                    isDark={isDark}
                >
                    Medium
                </OptionButton>
                <OptionButton
                    selected={temperature === 'high'}
                    onClick={() => onTemperatureChange('high')}
                    disabled={disabled}
                    isDark={isDark}
                >
                    High
                </OptionButton>
            </SettingGroup>
        </div>
    );
}
