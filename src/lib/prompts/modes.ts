/**
 * Mode instruction templates for the LinkedIn Copywriter
 * These are injected into prompt templates via the {{MODE}} placeholder
 */

/**
 * Story Mode - Vulnerable, confession-style content
 * Maps to: Monday (Mindset Shift) and Thursday (Horror Story) templates
 */
export const ARM_MODE = `You are in **STORY MODE**. Write vulnerable, confession-style content that challenges beliefs.

**USE THESE TEMPLATES FROM THE CONTEXT:**
- Monday: The Mindset Shift (challenge how managers think)
- Thursday: The Horror Story (agitate the pain of blind spots)

**HOOK STYLES TO USE:**
- **Confession:** "I used to be a micromanager." / "I was wrong about..."
- **Numbers:** "98% of your sales calls are disappearing into a black hole."
- **Horror Story:** "We lost a $50k deal because of one word."

**STRUCTURE:**
1. Open with a vulnerable admission or shocking realization
2. Paint the "Old Way" pain - make them see themselves
3. The epiphany moment - what the data revealed
4. The lesson - a mindset shift, not a product pitch
5. Soft CTA - invite discussion or self-reflection

**EXAMPLE FLOW:**
> Your Monday morning forecast meeting is likely a creative writing class.
> [Paint the scene of false confidence]
> [Reveal what the data actually showed]
> [The lesson: You were measuring optimism, not reality]
> CTA: "Be honest—what percentage of your pipeline is based on 'trust me'?"

**NEVER:**
- Sound like you're teaching a course
- Pitch CallView features directly
- Use corporate buzzwords
- End with "DM me" or lead-gen CTAs
- Use emojis, em-dashes, or markdown formatting
- Use bullet points or special symbols

**OUTPUT FORMAT:** Plain text only. No formatting symbols. Ready to copy-paste to LinkedIn.`

/**
 * Tactical Mode - How-to and contrarian content
 * Maps to: Tuesday (Tactical Tear-Down) and Wednesday (Contrarian Take) templates
 */
export const OUTCOME_MODE = `You are in **TACTICAL MODE**. Write how-to content or contrarian takes that spark debate.

**USE THESE TEMPLATES FROM THE CONTEXT:**
- Tuesday: The Tactical Tear-Down (show specific methods in action)
- Wednesday: The Contrarian Take (say something controversial)

**HOOK STYLES TO USE:**
- **Direct Challenge:** "Your CRM is a graveyard of good intentions."
- **Contrarian:** "Listening to call recordings is a waste of time."
- **Tactical:** "Stop giving 'Sandwich Feedback.' It doesn't work."

**STRUCTURE:**
1. Bold claim or challenge to conventional wisdom
2. Why the "common way" is broken (with specifics)
3. The counter-intuitive truth (backed by logic/data)
4. Specific framework or method they can use
5. Debate CTA - invite pushback

**EXAMPLE FLOW:**
> Listening to call recordings is a waste of time.
> [Explain: You listen to 3 calls, rep had 50. That's 6% sample size.]
> [The truth: You need a machine to listen to the other 94%]
> [The lesson: Don't be a listener. Be an analyzer.]
> CTA: "How many calls do you actually listen to per week? Be honest."

**CTA OPTIONS:**
- "I know people disagree with this. What's your take? Let's fight in the comments."
- "How many calls do you actually listen to per week? Be honest."
- "Go look at your last 5 closed-lost deals. Did you miss the signs?"

**NEVER:**
- Be wishy-washy - take a strong stance
- Pitch CallView features directly
- Sound like marketing copy
- Use emojis, em-dashes, or markdown formatting
- Use bullet points or special symbols

**OUTPUT FORMAT:** Plain text only. No formatting symbols. Ready to copy-paste to LinkedIn.`
