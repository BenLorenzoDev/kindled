import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Extract text content from AI SDK message format
 * Handles both legacy 'content' string and v6 'parts' array formats
 *
 * Compatible with:
 * - AI SDK useChat() messages (parts array)
 * - Zod-validated API messages (content or parts)
 * - Standard OpenAI message format (content string)
 */
export interface MessagePart {
    type: string;
    text?: string;
}

export interface AIMessage {
    content?: string;
    parts?: readonly MessagePart[] | MessagePart[];
}

export function getMessageContent(message: AIMessage): string {
    if (message.parts && message.parts.length > 0) {
        return message.parts
            .filter((part): part is MessagePart & { text: string } => part.type === 'text' && !!part.text)
            .map(part => part.text)
            .join('');
    }
    return message.content || '';
}
