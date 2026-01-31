/**
 * Type definitions for LinkedIn Copywriter
 */

/**
 * Available persona types for content generation
 * - coach: Sales Coach persona (default) - focuses on LinkedIn content with ARM framework
 * - architect: Site Architect persona - generates Lovable.dev UI specifications
 */
export type PersonaType = 'coach' | 'architect'

/**
 * Available mode types for controlling output structure
 * - arm: ARM Mode (default) - enforces Acknowledge, Respond, Move Forward structure
 * - outcome: Outcome Mode - flexible goal-driven approach
 */
export type ModeType = 'arm' | 'outcome'

/**
 * Temperature/creativity levels for generation
 * - low: More focused, deterministic outputs (0.3)
 * - medium: Balanced creativity (0.7) - default
 * - high: More creative, varied outputs (1.0)
 */
export type TemperatureType = 'low' | 'medium' | 'high'

/**
 * Temperature value mapping for LLM API calls
 */
export const TEMPERATURE_VALUES: Record<TemperatureType, number> = {
  low: 0.3,
  medium: 0.7,
  high: 1.0,
}

/**
 * Generation settings passed to the API
 */
export interface GenerationSettings {
  persona: PersonaType
  mode: ModeType
  temperature: TemperatureType
}

/**
 * Content Series types for multi-day post sequences
 */

export type SeriesPostStatus = 'draft' | 'scheduled' | 'posted'

export interface SeriesPost {
  id: string
  dayNumber: number
  dayLabel: string // "Monday", "Day 1", etc.
  title: string
  content: string
  scheduledDate: string // ISO date string
  scheduledTime: string // "10:00"
  previousSummary?: string // Brief summary of what previous post covered
  callbackPhrase?: string // The explicit callback used (e.g., "Yesterday I shared...")
  status: SeriesPostStatus
}

export interface ContentSeries {
  id: string
  title: string // e.g., "Sales Leadership Week"
  topic: string // Main topic/theme
  description?: string // Brief description of the series
  numberOfPosts: number // 5-7 typically
  startDate: string // ISO date string
  defaultTime: string // Default posting time
  posts: SeriesPost[]
  createdAt: number
  updatedAt: number
}

export interface SeriesGenerationRequest {
  topic: string
  numberOfPosts: number
  startDate: string
  defaultTime: string
  mode?: ModeType
  temperature?: TemperatureType
}
