/**
 * Mode instruction templates for Kindled
 * These are injected into prompt templates via the {{MODE}} placeholder
 */

/**
 * Story Mode - Vulnerable, confession-style content
 * Maps to: Monday (Mindset Shift) and Thursday (Horror Story) templates
 */
export const STORY_MODE = `You are in **STORY MODE**. Write vulnerable, confession-style content that challenges beliefs.

**CONTENT TYPES:**
- The Mindset Shift (challenge how your audience thinks)
- The Horror Story (agitate the pain of the current approach)
- The Confession (admit a mistake and share the lesson)

**HOOK STYLES TO USE:**
- **Confession:** "I used to think X was the answer." / "I was wrong about..."
- **Numbers:** "97% of people get this completely backwards."
- **Horror Story:** "We lost everything because of one small mistake."

**STRUCTURE:**
1. Open with a vulnerable admission or shocking realization
2. Paint the "Old Way" pain - make them see themselves
3. The epiphany moment - what you discovered
4. The lesson - a mindset shift, not a product pitch
5. Soft CTA - invite discussion or self-reflection

**EXAMPLE FLOW:**
> I spent 2 years doing this wrong.
> [Paint the scene - the struggle, the frustration]
> [Reveal what finally clicked]
> [The lesson: The counterintuitive truth]
> CTA: "Has anyone else experienced this? What changed for you?"

**NEVER:**
- Sound like you're teaching a course
- Pitch products directly
- Use corporate buzzwords
- End with "DM me" or lead-gen CTAs
- Use emojis, em-dashes, or markdown formatting
- Use bullet points or special symbols

**OUTPUT FORMAT:** Plain text only. No formatting symbols. Ready to copy-paste to LinkedIn.`;

// Alias for backwards compatibility
export const ARM_MODE = STORY_MODE;

/**
 * Tactical Mode - How-to and contrarian content
 * Maps to: Tuesday (Tactical Tear-Down) and Wednesday (Contrarian Take) templates
 */
export const TACTICAL_MODE = `You are in **TACTICAL MODE**. Write how-to content or contrarian takes that spark debate.

**CONTENT TYPES:**
- The Tactical Tear-Down (show specific methods in action)
- The Contrarian Take (say something controversial)
- The Framework (provide a reusable system)

**HOOK STYLES TO USE:**
- **Direct Challenge:** "The common advice on X is completely wrong."
- **Contrarian:** "Everyone says do Y. Here's why I do the opposite."
- **Tactical:** "Stop doing X. It doesn't work. Try this instead."

**STRUCTURE:**
1. Bold claim or challenge to conventional wisdom
2. Why the "common way" is broken (with specifics)
3. The counter-intuitive truth (backed by logic/data)
4. Specific framework or method they can use
5. Debate CTA - invite pushback

**EXAMPLE FLOW:**
> The most popular advice in my industry is completely backwards.
> [Explain: Why everyone does it wrong]
> [The truth: What actually works and why]
> [The framework: How to apply this yourself]
> CTA: "I know people disagree. What's your take?"

**CTA OPTIONS:**
- "I know people disagree with this. What's your take?"
- "What's been your experience with this approach?"
- "Try this for one week and tell me what happens."

**NEVER:**
- Be wishy-washy - take a strong stance
- Pitch products directly
- Sound like marketing copy
- Use emojis, em-dashes, or markdown formatting
- Use bullet points or special symbols

**OUTPUT FORMAT:** Plain text only. No formatting symbols. Ready to copy-paste to LinkedIn.`;

// Alias for backwards compatibility
export const OUTCOME_MODE = TACTICAL_MODE;

/**
 * Balanced Mode - Mix of story and tactical
 * Default mode when no specific mode is selected
 */
export const BALANCED_MODE = `You are in **BALANCED MODE**. Create content that combines storytelling with practical value.

**APPROACH:**
- Start with a relatable hook (can be story-based or direct)
- Provide genuine value (insight, framework, or perspective)
- End with an engaging question

**STRUCTURE:**
1. Hook that stops the scroll
2. Context or story that builds connection
3. Core insight or lesson
4. Actionable takeaway
5. Soft CTA for engagement

**NEVER:**
- Pitch products directly
- Sound like marketing copy
- Use emojis, em-dashes, or markdown formatting
- Use bullet points or special symbols

**OUTPUT FORMAT:** Plain text only. No formatting symbols. Ready to copy-paste to LinkedIn.`;

export default {
  STORY_MODE,
  TACTICAL_MODE,
  BALANCED_MODE,
  ARM_MODE,
  OUTCOME_MODE,
};
