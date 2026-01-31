'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
    Rocket,
    TrendingUp,
    Target,
    Users,
    DollarSign,
    Shield,
    Zap,
    BarChart3,
    CheckCircle,
    ArrowRight,
    Mail,
    Calendar,
    Sparkles,
    AlertTriangle,
    Lightbulb,
    Heart,
    FileText,
    MessageSquare,
    X
} from 'lucide-react';

export default function PitchDeckPage() {
    const [showCalendar, setShowCalendar] = useState(false);

    return (
        <>
            {/* Calendar Modal */}
            {showCalendar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-3xl mx-4 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b border-slate-700">
                            <h3 className="text-lg font-semibold text-white">Schedule a Call with Emil</h3>
                            <button
                                onClick={() => setShowCalendar(false)}
                                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        <div className="h-[80vh] max-h-[800px]">
                            <iframe
                                src="https://link.appointmentlyy.com/widget/booking/AHdPlxShwXJfF1x5xujR"
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                title="Schedule a Call"
                            />
                        </div>
                    </div>
                </div>
            )}
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Slide 1: Cover */}
            <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-violet-600/20" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 text-center max-w-4xl">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center">
                            <Rocket className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-4xl font-bold">PostPipeline</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Turn LinkedIn Content Into{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                            Sales Pipeline
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto">
                        AI-powered content generation + engagement-to-pipeline conversion in one platform
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            <span>$2.3B Market</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            <span>80+ Features Built</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-400" />
                            <span>91% Gross Margin</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce">
                    <ArrowRight className="w-6 h-6 rotate-90 text-slate-500" />
                </div>
            </section>

            {/* Slide 2: Problem */}
            <section className="min-h-screen flex items-center px-6 py-20 bg-slate-900">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="flex items-center gap-2 text-red-400 mb-4">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">The Problem</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-12">
                        LinkedIn is broken for most sales teams
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                problem: "Stare at blank screen for 30 minutes",
                                result: "Give up and don't post",
                                stat: "73%",
                                label: "of professionals struggle with content"
                            },
                            {
                                problem: "Finally post something decent",
                                result: "Get 3 likes from coworkers",
                                stat: "94%",
                                label: "of posts get zero pipeline impact"
                            },
                            {
                                problem: "Someone engages with content",
                                result: "No follow-up, opportunity lost",
                                stat: "$50K+",
                                label: "average deal lost to poor follow-up"
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                <div className="text-4xl font-bold text-red-400 mb-2">{item.stat}</div>
                                <div className="text-sm text-slate-400 mb-6">{item.label}</div>
                                <div className="text-red-400/80 text-sm font-medium mb-2">The Problem:</div>
                                <p className="text-white font-medium mb-4">{item.problem}</p>
                                <div className="text-red-400/80 text-sm font-medium mb-2">The Result:</div>
                                <p className="text-slate-400">{item.result}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Slide 3: Solution */}
            <section className="min-h-screen flex items-center px-6 py-20 bg-gradient-to-br from-blue-600 to-violet-600">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="flex items-center gap-2 text-blue-200 mb-4">
                        <Lightbulb className="w-5 h-5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">The Solution</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Content + Engagement + Pipeline
                    </h2>
                    <p className="text-xl text-blue-100 mb-12 max-w-2xl">
                        PostPipeline connects the dots that other tools miss
                    </p>

                    <div className="grid md:grid-cols-4 gap-6 mb-12">
                        {[
                            { step: "1", title: "Create", desc: "AI writes scroll-stopping posts" },
                            { step: "2", title: "Post", desc: "Copy, paste, watch engagement" },
                            { step: "3", title: "Respond", desc: "Turn likes into conversations" },
                            { step: "4", title: "Close", desc: "Nurture with sales cadences" }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                                <p className="text-blue-100 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="ml-4 text-sm text-slate-400">Product Demo</span>
                        </div>
                        <div className="aspect-video">
                            <iframe
                                src="https://www.youtube.com/embed/LmhFgU0QhVU?autoplay=1&mute=1&loop=1&playlist=LmhFgU0QhVU"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                                style={{ border: 'none' }}
                                title="PostPipeline Demo Video"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Slide 4: Product Demo */}
            <section className="min-h-screen px-6 py-20 bg-slate-950">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-2 text-violet-400 mb-4">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Product Demo</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        80+ Features Already Built
                    </h2>
                    <p className="text-xl text-slate-400 mb-12">
                        Not a mockup. Not a prototype. A working product.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {[
                            { title: "Trend Scanner", desc: "Find what's hot, create what converts", image: "/screenshots/trend-scanner.png", icon: <TrendingUp className="w-5 h-5" />, color: "emerald" },
                            { title: "Viral Post Hacker", desc: "Reverse-engineer any viral post", image: "/screenshots/viral-hacker.png", icon: <Zap className="w-5 h-5" />, color: "purple" },
                            { title: "Post Ideas Generator", desc: "8 viral ideas with hooks in seconds", image: "/screenshots/post-ideas.png", icon: <Lightbulb className="w-5 h-5" />, color: "yellow" },
                            { title: "Viral Templates", desc: "Proven viral frameworks with DNA analysis", image: "/screenshots/viral-templates.png", icon: <Sparkles className="w-5 h-5" />, color: "orange" },
                            { title: "Engagement Responder", desc: "Batch respond to all reactions", image: "/screenshots/engagement-responder.png", icon: <Heart className="w-5 h-5" />, color: "pink" },
                            { title: "Sales Cadence Generator", desc: "7-step outreach sequences", image: "/screenshots/cadence.png", icon: <Target className="w-5 h-5" />, color: "blue" },
                            { title: "Profile Optimizer", desc: "LinkedIn-ready resume bullets", image: "/screenshots/profile-optimizer.png", icon: <FileText className="w-5 h-5" />, color: "indigo" }
                        ].map((feature, i) => (
                            <div key={i} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                                <div className="p-4 flex items-center gap-3 border-b border-slate-800">
                                    <div className={`w-10 h-10 bg-${feature.color}-500/20 rounded-lg flex items-center justify-center text-${feature.color}-400`}>
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{feature.title}</h3>
                                        <p className="text-sm text-slate-400">{feature.desc}</p>
                                    </div>
                                </div>
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    width={600}
                                    height={400}
                                    className="w-full h-auto"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Complete Features List */}
                    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
                        <h3 className="text-2xl font-bold text-center mb-8">Complete Feature List</h3>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Core AI Writing */}
                            <div>
                                <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5" /> Core AI Writing
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> AI Post Generation (GPT-4o)</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> 4 Tone Options (Default, Inspirational, Data-Driven, Conversational)</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Story/Tactical Mode</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Temperature Control (Low/Medium/High)</li>
                                </ul>
                            </div>

                            {/* Content Intelligence */}
                            <div>
                                <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" /> Content Intelligence
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Trend Scanner (Reddit, G2, Forbes, Gartner)</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Post Ideas Generator (8 viral ideas)</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Top 10 Viral Templates with DNA analysis</li>
                                </ul>
                            </div>

                            {/* Post Enhancement */}
                            <div>
                                <h4 className="text-lg font-semibold text-violet-400 mb-4 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" /> Post Enhancement
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> 5 Hook Variations</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Viral Post Hacker</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Auto-Simplify (Grade 6+ readability)</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Variations (Shorter, Bolder, Professional)</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Compare (different angle)</li>
                                </ul>
                            </div>

                            {/* Analytics & Optimization */}
                            <div>
                                <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" /> Analytics & Optimization
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Engagement Score (1-100)</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Hook Strength Rating</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Best Time to Post</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Estimated Reach</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Readability Grade</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Hashtag Suggestions</li>
                                </ul>
                            </div>

                            {/* Content Repurposing */}
                            <div>
                                <h4 className="text-lg font-semibold text-pink-400 mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5" /> Content Repurposing
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Twitter/X Thread (5-8 tweets)</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Email Newsletter</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Instagram Carousel (6-8 slides)</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Video Script (60-90 sec)</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Blog Outline (SEO optimized)</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Cold Email (A-Game format)</li>
                                </ul>
                            </div>

                            {/* Profile Optimization */}
                            <div>
                                <h4 className="text-lg font-semibold text-indigo-400 mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5" /> Profile Optimization
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Resume Upload (PDF, DOC, DOCX, TXT)</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Full Resume Rewrite</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Short Tenure Reframing</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Professional Summary Generator</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Headline Generator</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Key Skills Extractor</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Metrics Enhancement</li>
                                </ul>
                            </div>

                            {/* Sales Cadence */}
                            <div>
                                <h4 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5" /> Sales Cadence Generator
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> 7-Step Outreach Cadence</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Connection Request Script</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> First DM (No Pitch)</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Value-Add DM</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Meeting Ask DM</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Email Template</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Cold Call Script</li>
                                </ul>
                            </div>

                            {/* Engagement Responder */}
                            <div>
                                <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                                    <Heart className="w-5 h-5" /> Engagement Responder
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Batch Engagement Processing</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Reaction Detection</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Comment Parsing</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Connection Request Generator</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Thank You DM Generator</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Engagement Summary</li>
                                </ul>
                            </div>

                            {/* Comment Generator & More */}
                            <div>
                                <h4 className="text-lg font-semibold text-teal-400 mb-4 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" /> Comment Generator & More
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> 5 Comment Variations</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> 5 Comment Styles</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Content Calendar</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Post Scheduling</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Email Reminders</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Job Alerts Dashboard</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> AI Job Matching</li>
                                </ul>
                            </div>

                            {/* Content Series */}
                            <div>
                                <h4 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" /> Content Series
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Multi-Day Series Generator (3-7 days)</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Explicit Callbacks ("Yesterday I shared...")</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Topic-Based Planning</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Series Manager with Progress Tracking</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Calendar Integration</li>
                                </ul>
                            </div>

                            {/* Visual & Preview */}
                            <div>
                                <h4 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" /> Visual & Preview
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> LinkedIn Preview</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> DALL-E 3 Image Generation</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Character Counter</li>
                                </ul>
                            </div>

                            {/* Utility */}
                            <div>
                                <h4 className="text-lg font-semibold text-slate-400 mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5" /> Utility Features
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> History (Last 50 posts)</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Favorites</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> One-Click Copy</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Stats Tracking</li>
                                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> Help Modal</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                            <div className="text-4xl font-bold text-emerald-400 mb-2">80+</div>
                            <div className="text-slate-400">Total Features Built & Working</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Slide 5: Market Size */}
            <section className="min-h-screen flex items-center px-6 py-20 bg-slate-900">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="flex items-center gap-2 text-emerald-400 mb-4">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Market Opportunity</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-12">
                        $2.3 Billion Market, 47% CAGR
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 text-center">
                            <div className="text-5xl font-bold text-emerald-400 mb-2">$2.3B</div>
                            <div className="text-slate-400">LinkedIn AI Tools Market</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 text-center">
                            <div className="text-5xl font-bold text-blue-400 mb-2">47%</div>
                            <div className="text-slate-400">Annual Growth Rate (CAGR)</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 text-center">
                            <div className="text-5xl font-bold text-violet-400 mb-2">78%</div>
                            <div className="text-slate-400">Professionals Using AI on LinkedIn</div>
                        </div>
                    </div>

                    <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700">
                        <h3 className="text-xl font-semibold mb-6">Comparable Exits</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { company: "Jasper", valuation: "$1.5B", type: "AI Writing" },
                                { company: "Copy.ai", valuation: "$250M+", type: "AI Content" },
                                { company: "Loom", valuation: "$1.5B", type: "Video Comms" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">{item.company}</div>
                                        <div className="text-emerald-400 font-bold">{item.valuation}</div>
                                        <div className="text-sm text-slate-400">{item.type}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Slide 6: Business Model */}
            <section className="min-h-screen flex items-center px-6 py-20 bg-slate-950">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="flex items-center gap-2 text-blue-400 mb-4">
                        <DollarSign className="w-5 h-5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Business Model</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-12">
                        91% Gross Margin, Tiered Pricing
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {[
                            { tier: "Starter", price: "$29", period: "/month", users: "Side hustlers", features: ["50 posts/month", "Basic analytics", "Email support"] },
                            { tier: "Pro", price: "$79", period: "/month", users: "Founders & SDRs", features: ["Unlimited posts", "All features", "Priority support"], popular: true },
                            { tier: "Team", price: "$199", period: "/month", users: "Agencies", features: ["3 seats included", "Team workspace", "API access"] }
                        ].map((plan, i) => (
                            <div key={i} className={`rounded-2xl p-6 border ${plan.popular ? 'bg-gradient-to-br from-blue-600/20 to-violet-600/20 border-blue-500' : 'bg-slate-900 border-slate-800'}`}>
                                {plan.popular && (
                                    <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Most Popular</div>
                                )}
                                <div className="text-slate-400 text-sm mb-1">{plan.tier}</div>
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    <span className="text-slate-400">{plan.period}</span>
                                </div>
                                <div className="text-sm text-slate-400 mb-6">{plan.users}</div>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                        <h3 className="text-lg font-semibold mb-4">Unit Economics</h3>
                        <div className="grid md:grid-cols-4 gap-6 text-center">
                            <div>
                                <div className="text-2xl font-bold text-white">$72</div>
                                <div className="text-sm text-slate-400">Blended ARPU</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">$6.50</div>
                                <div className="text-sm text-slate-400">Variable Cost</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-400">$65.50</div>
                                <div className="text-sm text-slate-400">Contribution Margin</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-400">91%</div>
                                <div className="text-sm text-slate-400">Gross Margin</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Slide 7: Traction */}
            <section className="min-h-screen flex items-center px-6 py-20 bg-slate-900">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="flex items-center gap-2 text-yellow-400 mb-4">
                        <Zap className="w-5 h-5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Traction</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-12">
                        Product is 90% Built
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white mb-6">What's Already Done</h3>
                            {[
                                "80+ features fully functional",
                                "Landing page live and converting",
                                "Deployed on Railway (production)",
                                "Google OAuth authentication",
                                "OpenAI GPT-4o integration",
                                "Email system (Resend) integrated",
                                "Mobile-responsive design"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white mb-6">What's Needed for MVP</h3>
                            {[
                                "User persona system (multi-tenant)",
                                "Stripe payment integration",
                                "Usage tracking & limits",
                                "Onboarding wizard",
                                "Customer billing portal"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-slate-400">
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-600 flex-shrink-0" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-6 border border-emerald-500/30">
                        <div className="flex items-center gap-4">
                            <div className="text-5xl font-bold text-emerald-400">90%</div>
                            <div>
                                <div className="text-lg font-semibold text-white">Product Complete</div>
                                <div className="text-slate-400">6 weeks to MVP launch with payments</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Slide 8: Financials */}
            <section className="min-h-screen flex items-center px-6 py-20 bg-slate-950">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="flex items-center gap-2 text-emerald-400 mb-4">
                        <BarChart3 className="w-5 h-5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Financial Projections</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-12">
                        Break-Even at 131 Users
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6 mb-12">
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 text-center">
                            <div className="text-3xl font-bold text-white">$8,555</div>
                            <div className="text-sm text-slate-400">Monthly Burn</div>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 text-center">
                            <div className="text-3xl font-bold text-emerald-400">131</div>
                            <div className="text-sm text-slate-400">Users to Break-Even</div>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 text-center">
                            <div className="text-3xl font-bold text-blue-400">Month 6</div>
                            <div className="text-sm text-slate-400">Path to Profit</div>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 text-center">
                            <div className="text-3xl font-bold text-violet-400">$300K</div>
                            <div className="text-sm text-slate-400">Year 1 ARR Target</div>
                        </div>
                    </div>

                    {/* 12-Month Projection Table */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden mb-8">
                        <div className="p-4 border-b border-slate-800">
                            <h3 className="font-semibold">12-Month Projection (Conservative)</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-800/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-slate-400">Month</th>
                                        <th className="px-4 py-3 text-right text-slate-400">Users</th>
                                        <th className="px-4 py-3 text-right text-slate-400">MRR</th>
                                        <th className="px-4 py-3 text-right text-slate-400">Net</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { month: 1, users: 0, mrr: 0, net: -8555 },
                                        { month: 3, users: 35, mrr: 2520, net: -6150 },
                                        { month: 6, users: 130, mrr: 9360, net: 360, highlight: true },
                                        { month: 9, users: 230, mrr: 16560, net: 7160 },
                                        { month: 12, users: 350, mrr: 25200, net: 15300 }
                                    ].map((row, i) => (
                                        <tr key={i} className={row.highlight ? 'bg-emerald-500/10' : ''}>
                                            <td className="px-4 py-3 font-medium">{row.month}</td>
                                            <td className="px-4 py-3 text-right">{row.users}</td>
                                            <td className="px-4 py-3 text-right">${row.mrr.toLocaleString()}</td>
                                            <td className={`px-4 py-3 text-right font-medium ${row.net >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {row.net >= 0 ? '+' : ''}${row.net.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30 text-center">
                        <span className="text-emerald-400 font-medium">Month 6: Break-even achieved. Month 11: Cumulative profit positive.</span>
                    </div>
                </div>
            </section>

            {/* Slide 9: Competition */}
            <section className="min-h-screen flex items-center px-6 py-20 bg-slate-900">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="flex items-center gap-2 text-violet-400 mb-4">
                        <Target className="w-5 h-5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Competitive Positioning</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-12">
                        The Only LinkedIn-to-Pipeline Tool
                    </h2>

                    {/* Positioning Grid */}
                    <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-8">
                        <div className="grid grid-cols-3 gap-4 text-center mb-4">
                            <div></div>
                            <div className="text-sm text-slate-400">LinkedIn-Specific</div>
                            <div></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <div className="text-sm text-slate-400 text-right">Generic</div>
                            <div className="aspect-square bg-slate-700/50 rounded-xl relative">
                                <div className="absolute top-4 left-4 px-3 py-1 bg-slate-600 rounded text-xs">Taplio</div>
                                <div className="absolute bottom-4 left-4 px-3 py-1 bg-slate-600 rounded text-xs">ChatGPT</div>
                                <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded text-xs font-bold">PostPipeline</div>
                                <div className="absolute bottom-4 right-4 px-3 py-1 bg-slate-600 rounded text-xs">Lemlist</div>
                            </div>
                            <div className="text-sm text-slate-400">Sales-Focused</div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                            <h3 className="font-semibold mb-4 text-white">Why Users Stay (Moat)</h3>
                            <ul className="space-y-3">
                                {[
                                    "Personalized AI trained on their brand voice",
                                    "Content history = library of what works",
                                    "Cadences and workflows are customized",
                                    "Data flywheel gets smarter per industry"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                                        <Shield className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                            <h3 className="font-semibold mb-4 text-white">vs. Competitors</h3>
                            <ul className="space-y-3">
                                {[
                                    "ChatGPT: Too general, no LinkedIn focus",
                                    "Jasper: No sales pipeline features",
                                    "Taplio: Scheduling only, no AI content",
                                    "Lemlist: Cold outreach, no content creation"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Slide 10: Team */}
            <section className="min-h-screen flex items-center px-6 py-20 bg-slate-950">
                <div className="max-w-4xl mx-auto w-full text-center">
                    <div className="flex items-center justify-center gap-2 text-blue-400 mb-4">
                        <Users className="w-5 h-5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Team</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-12">
                        Founder-Led, Lean Team
                    </h2>

                    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 mb-8">
                        <div className="w-28 h-28 rounded-full mx-auto mb-6 overflow-hidden border-4 border-blue-500/50">
                            <Image
                                src="/profile.gif"
                                alt="Emil Halili"
                                width={112}
                                height={112}
                                className="w-full h-full object-cover"
                                unoptimized
                            />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Emil Halili</h3>
                        <p className="text-slate-400 mb-6">Founder & CEO</p>
                        <p className="text-slate-300 max-w-xl mx-auto mb-8">
                            Built this tool to solve our own problem at CallView.ai.
                            Co-founded the largest automation community in the Philippines.
                            Proven track record in AI-powered sales tools.
                        </p>
                        <div className="flex justify-center gap-6 text-sm">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">$5K</div>
                                <div className="text-slate-400">Monthly salary</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">100%</div>
                                <div className="text-slate-400">Committed</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                            <h4 className="font-semibold mb-2">+ Contract Engineer</h4>
                            <p className="text-slate-400 text-sm">$3,000/month for development</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                            <h4 className="font-semibold mb-2">+ Contract Designer</h4>
                            <p className="text-slate-400 text-sm">$500/month as-needed</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Slide 11: The Ask */}
            <section className="min-h-screen flex items-center px-6 py-20 bg-gradient-to-br from-blue-600 to-violet-600">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="flex items-center gap-2 text-blue-200 mb-4">
                        <DollarSign className="w-5 h-5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">The Ask</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        $150K - $200K Seed Round
                    </h2>
                    <p className="text-xl text-blue-100 mb-12">
                        18-24 month runway to profitability
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                            <h3 className="text-xl font-semibold mb-6">Use of Funds ($200K)</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "Founder Salary", amount: "$60K", percent: "30%", desc: "12 months @ $5K/mo" },
                                    { label: "Engineering", amount: "$36K", percent: "18%", desc: "12 months @ $3K/mo" },
                                    { label: "Marketing/Launch", amount: "$20K", percent: "10%", desc: "Product Hunt, ads, content" },
                                    { label: "Infrastructure", amount: "$15K", percent: "8%", desc: "Hosting, AI, tools" },
                                    { label: "Buffer", amount: "$55K", percent: "27%", desc: "Runway extension" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-white">{item.label}</div>
                                            <div className="text-sm text-blue-200">{item.desc}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-white">{item.amount}</div>
                                            <div className="text-sm text-blue-200">{item.percent}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                            <h3 className="text-xl font-semibold mb-6">Why This is Low-Risk</h3>
                            <div className="space-y-4">
                                {[
                                    { factor: "Technical Risk", derisked: "Product 90% built" },
                                    { factor: "Market Risk", derisked: "$2.3B market, 47% growth" },
                                    { factor: "Execution Risk", derisked: "Lean team, conservative projections" },
                                    { factor: "Financial Risk", derisked: "Break-even at 131 users" },
                                    { factor: "Exit Risk", derisked: "Jasper $1.5B, proven category" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-medium text-white">{item.factor}</div>
                                            <div className="text-sm text-blue-200">{item.derisked}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Slide 12: Contact */}
            <section className="min-h-screen flex items-center px-6 py-20 bg-slate-950">
                <div className="max-w-4xl mx-auto w-full text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl mx-auto mb-8 flex items-center justify-center">
                        <Rocket className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Let's Build the Future of LinkedIn Sales
                    </h2>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                        Ready to discuss? I'd love to show you a live demo and answer any questions.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <a
                            href="mailto:emil@appointmentlyy.com"
                            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-violet-600 transition-all"
                        >
                            <Mail className="w-5 h-5" />
                            emil@appointmentlyy.com
                        </a>
                        <button
                            onClick={() => setShowCalendar(true)}
                            className="flex items-center gap-2 px-8 py-4 border-2 border-slate-700 text-white font-semibold rounded-xl hover:border-slate-600 hover:bg-slate-900 transition-all"
                        >
                            <Calendar className="w-5 h-5" />
                            Schedule a Call
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-8 text-slate-500 text-sm">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Product demo available
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Data room ready
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            References available
                        </div>
                    </div>
                </div>
            </section>
        </div>
        </>
    );
}
