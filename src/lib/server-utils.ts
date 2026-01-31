import { promises as fs } from 'fs'
import path from 'path'

/**
 * Load the CallView knowledge base from markdown file
 * Used by the Context Injection Pipeline to enrich prompts with product knowledge
 *
 * @returns Promise<string> - The full text content of the knowledge base
 * @throws Error if the knowledge base file cannot be read
 */
export async function loadKnowledgeBase(): Promise<string> {
    const kbPath = path.join(process.cwd(), 'src/lib/knowledge/product-brief.md')
    try {
        const content = await fs.readFile(kbPath, 'utf-8')
        return content
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error(`[loadKnowledgeBase] Failed to read ${kbPath}: ${errorMessage}`)
        throw new Error(`Failed to load knowledge base: ${errorMessage}`)
    }
}

/**
 * Hydrate a prompt template by replacing placeholders with values
 * Follows the "Hydration Pattern" from architecture - {{PLACEHOLDERS}} replaced at runtime
 *
 * @param template - The prompt template with {{PLACEHOLDER}} tokens
 * @param variables - Object mapping placeholder names to values
 * @returns The hydrated prompt string with all placeholders replaced
 *
 * @example
 * hydratePrompt("Hello {{NAME}}, your mode is {{MODE}}", { NAME: "User", MODE: "ARM" })
 * // Returns: "Hello User, your mode is ARM"
 */
export function hydratePrompt(
    template: string,
    variables: Record<string, string>
): string {
    const missingPlaceholders: string[] = []

    const result = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        if (variables[key] !== undefined) {
            return variables[key]
        }
        missingPlaceholders.push(key)
        return match
    })

    // Warn about unmatched placeholders - these could leak into LLM prompts
    if (missingPlaceholders.length > 0) {
        console.warn(
            `[hydratePrompt] Missing placeholders: ${missingPlaceholders.join(', ')}. ` +
            'Unhydrated placeholders may appear in LLM prompts.'
        )
    }

    return result
}
