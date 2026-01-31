export interface ViralTemplate {
    id: number;
    title: string;
    framework: string;
    hookType: string;
    engagementPotential: string;
    avgLikes: string;
    avgComments: string;
    emotionalTriggers: string[];
    dna: string[];
    whyItWorks: string;
    examplePost: string;
}

export const VIRAL_TEMPLATES: ViralTemplate[] = [
    {
        id: 1,
        title: "The Career Confession",
        framework: "Confession → Story → Lesson",
        hookType: "Vulnerable Confession",
        engagementPotential: "Viral",
        avgLikes: "15K-50K",
        avgComments: "500-2K",
        emotionalTriggers: ["Vulnerability", "Relatability", "Hope"],
        dna: [
            "Opens with personal failure or setback",
            "Short punchy sentences",
            "Line breaks after every 1-2 sentences",
            "Ends with inspirational takeaway",
            "No corporate jargon"
        ],
        whyItWorks: "People connect with struggle. Showing vulnerability builds trust and makes success feel attainable. The 'I was there too' effect.",
        examplePost: `I got fired at 32.

No warning. No severance. Just a box and a security escort.

I cried in my car for an hour.

Then I did something crazy.

I started posting on LinkedIn every single day.

Not about finding a job.
About what I was learning.

Day 30: 100 followers
Day 60: 1,000 followers
Day 90: First client

That firing was the best thing that happened to me.

Here's what I learned:

Your worst day can become your origin story.

But only if you start writing it.

#CareerGrowth #Leadership #PersonalBrand`
    },
    {
        id: 2,
        title: "The Unpopular Opinion",
        framework: "Contrarian Claim → Evidence → New Perspective",
        hookType: "Contrarian",
        engagementPotential: "Viral",
        avgLikes: "10K-40K",
        avgComments: "300-1.5K",
        emotionalTriggers: ["Controversy", "Curiosity", "Validation"],
        dna: [
            "Starts with 'Unpopular opinion:' or bold claim",
            "Challenges widely accepted belief",
            "Provides logical reasoning",
            "Ends with reframe",
            "Invites debate in comments"
        ],
        whyItWorks: "Controversy creates conversation. People either strongly agree or disagree, both driving comments. The algorithm loves debate.",
        examplePost: `Unpopular opinion:

Cold calling isn't dead.

Your approach is.

I know, I know. Everyone says:
- "Nobody answers their phone"
- "Email is more effective"
- "It's a numbers game"

Wrong.

I made 50 cold calls last week.
Booked 12 meetings.

Here's the difference:

I didn't pitch.
I asked one question.
Then I shut up.

The question?

"What's the biggest challenge you're facing with [specific problem] right now?"

That's it.

Stop selling. Start listening.

Cold calling works.
But only when you make it about them.

#Sales #ColdCalling #B2B`
    },
    {
        id: 3,
        title: "The Data Bomb",
        framework: "Surprising Stat → Context → Actionable Insight",
        hookType: "Number/Stat",
        engagementPotential: "High",
        avgLikes: "8K-25K",
        avgComments: "200-800",
        emotionalTriggers: ["Surprise", "FOMO", "Authority"],
        dna: [
            "Leads with specific, surprising number",
            "Creates information gap",
            "Explains the 'so what'",
            "Provides actionable takeaway",
            "Positions you as expert"
        ],
        whyItWorks: "Specific numbers feel credible and shareable. People save data-driven posts and cite them in their own content.",
        examplePost: `We analyzed 1.2 million sales calls.

Here's what separates top performers from everyone else:

Talk-to-listen ratio.

Average reps: 72% talking, 28% listening
Top performers: 46% talking, 54% listening

The best salespeople listen MORE than they talk.

But here's what nobody tells you:

It's not just about listening.

It's WHEN you listen.

Top performers go silent after asking:
- Discovery questions
- Pricing concerns
- Objection handling

They let the silence do the work.

Most reps fill silence with more pitching.

Top reps let it breathe.

Try this on your next call:

Ask a question.
Count to 5.
Don't say a word.

Watch what happens.

#Sales #Data #SalesIntelligence`
    },
    {
        id: 4,
        title: "The Boss Horror Story",
        framework: "Story Hook → Tension → Resolution → Lesson",
        hookType: "Story/Narrative",
        engagementPotential: "Viral",
        avgLikes: "20K-60K",
        avgComments: "800-3K",
        emotionalTriggers: ["Anger", "Validation", "Justice"],
        dna: [
            "Starts mid-action (in medias res)",
            "Short sentences build tension",
            "Dialogue makes it vivid",
            "Universal workplace frustration",
            "Empowering conclusion"
        ],
        whyItWorks: "Everyone has had a bad boss. This validates shared frustrations and people share it saying 'This!' The revenge/justice arc is deeply satisfying.",
        examplePost: `My boss pulled me into his office.

"Close the door."

My heart sank.

"I've been watching your numbers," he said.

I braced myself.

"You're making the rest of the team look bad."

Wait, what?

"You need to slow down. You're setting unrealistic expectations."

I was being punished for working too hard.

That's when I realized:

I was in the wrong room.

Not the wrong job.
The wrong room.

Some environments reward excellence.
Some environments punish it.

Know the difference.

And if you're being told to dim your light?

Find a room with higher ceilings.

#Leadership #CareerAdvice #WorkCulture`
    },
    {
        id: 5,
        title: "The Question Hook",
        framework: "Provocative Question → Build Up → Answer → CTA",
        hookType: "Question",
        engagementPotential: "High",
        avgLikes: "5K-20K",
        avgComments: "400-1.2K",
        emotionalTriggers: ["Curiosity", "Self-reflection", "Engagement"],
        dna: [
            "Opens with thought-provoking question",
            "Makes reader pause and think",
            "Builds anticipation before answer",
            "Delivers unexpected insight",
            "Ends with question to drive comments"
        ],
        whyItWorks: "Questions activate the brain differently than statements. People mentally answer before reading, creating investment in your post.",
        examplePost: `What if your CRM is lying to you?

Sounds crazy, right?

But think about it.

Your CRM shows:
- 50 calls made
- 10 emails sent
- 5 meetings booked

Looks productive.

But what it doesn't show:

- 45 of those calls went to voicemail
- 8 of those emails were templates
- 3 of those meetings were no-shows

The data says you're crushing it.
Reality says you're spinning wheels.

Here's the truth:

Activity metrics are vanity metrics.

What actually matters:
- Conversations had
- Problems uncovered
- Next steps committed

Stop measuring motion.
Start measuring progress.

What metric do you think is most overrated?

#Sales #CRM #Metrics`
    },
    {
        id: 6,
        title: "The Myth Buster",
        framework: "Common Belief → 'Actually...' → New Truth → Proof",
        hookType: "Contrarian",
        engagementPotential: "High",
        avgLikes: "8K-30K",
        avgComments: "300-1K",
        emotionalTriggers: ["Surprise", "Education", "Authority"],
        dna: [
            "Identifies widely held misconception",
            "Uses 'Actually' or 'Wrong' pivot",
            "Provides evidence or logic",
            "Reframes understanding",
            "Actionable new approach"
        ],
        whyItWorks: "People love feeling like they learned something others don't know. Creates 'insider knowledge' feeling that's highly shareable.",
        examplePost: `"Follow up until they buy or die."

Worst sales advice ever.

Here's why:

I used to follow up 15+ times.
Sent cute GIFs.
Tried every trick.

Result?
Crickets. And damaged relationships.

Then I learned something:

The problem isn't follow-up frequency.
It's follow-up VALUE.

Now I send 3 follow-ups max.

Each one delivers something new:
- A relevant article
- A case study
- An insight about THEIR business

Not "just checking in."
Not "bumping this up."

Value. Every. Single. Time.

My response rate tripled.

The old way: Persistence
The new way: Relevance

Which one are you using?

#Sales #FollowUp #B2BSales`
    },
    {
        id: 7,
        title: "The Simple List",
        framework: "Promise → Numbered List → Quick Takeaway",
        hookType: "List/Number",
        engagementPotential: "High",
        avgLikes: "10K-35K",
        avgComments: "200-600",
        emotionalTriggers: ["Value", "Simplicity", "Actionable"],
        dna: [
            "Clear value promise in hook",
            "Scannable numbered format",
            "One idea per line",
            "Practical and actionable",
            "Easy to save and share"
        ],
        whyItWorks: "Lists are the most saved content type on LinkedIn. Easy to consume, easy to reference later, easy to share with teams.",
        examplePost: `10 things I wish I knew before my first sales job:

1. Your quota doesn't care about your excuses
2. The best reps ask the most questions
3. Rejection is redirection, not failure
4. Your network is your net worth
5. Nobody remembers your pitch, they remember how you made them feel
6. Follow up is where deals are won
7. The phone is still your most powerful tool
8. Learn your product, but master your customer's problems
9. Confidence comes from preparation, not personality
10. The best time to prospect is when you don't need to

Save this.
Share it with someone starting out.

Which one hit home for you?

#Sales #CareerAdvice #SalesTips`
    },
    {
        id: 8,
        title: "The Before/After",
        framework: "Old Way → Transformation → New Way → Results",
        hookType: "Transformation",
        engagementPotential: "High",
        avgLikes: "8K-25K",
        avgComments: "300-900",
        emotionalTriggers: ["Hope", "Inspiration", "Possibility"],
        dna: [
            "Clear contrast between states",
            "Specific time markers",
            "Tangible results",
            "Relatable starting point",
            "Achievable transformation"
        ],
        whyItWorks: "Transformation stories inspire action. People see themselves in the 'before' and aspire to the 'after'. Creates hope and engagement.",
        examplePost: `6 months ago:
- 0 LinkedIn followers
- Terrified to post
- No personal brand
- Invisible in my industry

Today:
- 15,000 followers
- Posts reaching 100K+ views
- Speaking invitations
- Inbound leads daily

What changed?

I stopped trying to be an "expert."
I started being a student.

I shared what I was learning.
Not what I had mastered.

Every post was a note from the trenches:
- What worked
- What failed
- What surprised me

People don't want gurus.
They want guides.

Someone a few steps ahead, not miles away.

Start before you're ready.
Share before you're perfect.

That's the whole playbook.

#PersonalBrand #LinkedIn #ContentCreation`
    },
    {
        id: 9,
        title: "The Hot Take",
        framework: "Bold Statement → Reasoning → Call to Action",
        hookType: "Contrarian",
        engagementPotential: "Viral",
        avgLikes: "12K-45K",
        avgComments: "500-2K",
        emotionalTriggers: ["Controversy", "Agreement", "Debate"],
        dna: [
            "Unapologetic opening statement",
            "No hedging or qualifiers",
            "Strong opinion with reasoning",
            "Invites discussion",
            "Polarizing but defensible"
        ],
        whyItWorks: "Hot takes force a reaction. People either rally behind you or argue against you. Either way, they engage. Silence is the only failure.",
        examplePost: `I'm going to say what everyone's thinking:

Most LinkedIn content is garbage.

Same recycled tips.
Same humble brags.
Same "I'm so grateful" posts.

It's exhausting.

You know what's actually valuable?

Specificity.

Don't tell me "communication is important."
Tell me the exact words you used.

Don't tell me you "failed forward."
Tell me how much money you lost.

Don't tell me to "add value."
Show me exactly how.

Generic advice is safe.
Specific advice is scary.

That's exactly why it works.

Be specific or be forgotten.

Agree or disagree?

#LinkedIn #ContentCreation #Marketing`
    },
    {
        id: 10,
        title: "The Micro-Story",
        framework: "Scene → Dialogue → Twist → Lesson",
        hookType: "Story",
        engagementPotential: "Viral",
        avgLikes: "15K-50K",
        avgComments: "400-1.5K",
        emotionalTriggers: ["Curiosity", "Emotion", "Connection"],
        dna: [
            "Starts with vivid scene-setting",
            "Uses real or realistic dialogue",
            "Unexpected twist or revelation",
            "Universal human truth",
            "Memorable one-liner ending"
        ],
        whyItWorks: "Stories are 22x more memorable than facts. The dialogue makes it feel real and immediate. People share stories that moved them.",
        examplePost: `"Dad, what do you do at work?"

My 6-year-old asked me this at dinner.

I froze.

I started explaining:
"Well, I help companies optimize their..."

Her eyes glazed over.

I tried again:
"I make sure people's computers work..."

She looked confused.

Then my wife jumped in:
"Daddy helps people solve problems."

My daughter smiled.
"That's cool."

And it hit me:

If you can't explain your job to a 6-year-old, you don't understand it yourself.

Jargon isn't expertise.
Simplicity is.

The best communicators make complex simple.
Not simple complex.

What do you do?

Can you explain it in one sentence a kid would understand?

#Communication #Leadership #Simplicity`
    }
];
