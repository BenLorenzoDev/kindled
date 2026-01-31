/**
 * Shared configuration for prompt templates and modes
 * Centralizes template mappings to ensure consistency across API routes and server actions
 */

import { SYSTEM_COACH } from './system-coach'
import { SYSTEM_ARCHITECT } from './system-architect'
import { ARM_MODE, OUTCOME_MODE } from './modes'
import type { PersonaType, ModeType } from '@/types'

/**
 * Maps persona types to their corresponding system prompt templates
 * Used by both the streaming chat API and server actions
 */
export const PERSONA_TEMPLATES: Record<PersonaType, string> = {
    coach: SYSTEM_COACH,
    architect: SYSTEM_ARCHITECT,
}

/**
 * Maps mode types to their corresponding instruction strings
 * Injected into templates via the {{MODE}} placeholder
 */
export const MODE_INSTRUCTIONS: Record<ModeType, string> = {
    arm: ARM_MODE,
    outcome: OUTCOME_MODE,
}
