'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Confetti/Party Popper component - pops from button position
function Confetti({ trigger, position }: { trigger: boolean; position: { x: number; y: number } | null }) {
    const [particles, setParticles] = useState<Array<{
        id: number;
        x: number;
        y: number;
        color: string;
        rotation: number;
        scale: number;
        tx: number;
        ty: number;
        r: number;
    }>>([]);

    useEffect(() => {
        if (trigger && position) {
            const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA'];
            const newParticles = Array.from({ length: 60 }, (_, i) => ({
                id: i,
                x: position.x,
                y: position.y,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                scale: 0.4 + Math.random() * 0.8,
                tx: (Math.random() - 0.5) * 300,
                ty: (Math.random() - 0.5) * 200 - 100,
                r: Math.random() * 720 - 360,
            }));
            setParticles(newParticles);

            // Clear after animation
            setTimeout(() => setParticles([]), 2000);
        }
    }, [trigger, position]);

    if (particles.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute animate-confetti"
                    style={{
                        left: particle.x,
                        top: particle.y,
                        backgroundColor: particle.color,
                        width: `${8 * particle.scale}px`,
                        height: `${8 * particle.scale}px`,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        transform: `rotate(${particle.rotation}deg)`,
                        '--tx': `${particle.tx}px`,
                        '--ty': `${particle.ty}px`,
                        '--r': `${particle.r}deg`,
                    } as React.CSSProperties}
                />
            ))}
            <style jsx>{`
                @keyframes confetti-fall {
                    0% {
                        transform: translate(0, 0) rotate(0deg) scale(1);
                        opacity: 1;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--tx), var(--ty)) rotate(var(--r)) scale(0.5);
                        opacity: 0;
                    }
                }
                .animate-confetti {
                    animation: confetti-fall 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
            `}</style>
        </div>
    );
}

// Snowfall component
function Snowfall() {
    const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number }>>([]);

    useEffect(() => {
        const flakes = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 10,
            duration: 10 + Math.random() * 20,
            size: 4 + Math.random() * 8,
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute rounded-full bg-white opacity-80 animate-snowfall"
                    style={{
                        left: `${flake.left}%`,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                        animationDelay: `${flake.delay}s`,
                        animationDuration: `${flake.duration}s`,
                        boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes snowfall {
                    0% {
                        transform: translateY(-10px) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.8;
                    }
                    90% {
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
                .animate-snowfall {
                    animation: snowfall linear infinite;
                }
            `}</style>
        </div>
    );
}
import {
    ArrowRight,
    Check,
    Sparkles,
    TrendingUp,
    Lightbulb,
    Zap,
    Target,
    Heart,
    User,
    MessageSquare,
    Mail,
    Phone,
    FileText,
    Video,
    Twitter,
    ChevronDown,
    ChevronUp,
    Star,
    Clock,
    BarChart3,
    Repeat,
    Shield,
    Rocket,
    ShieldCheck,
    ShieldAlert,
    Ban,
    Copy,
    Lock,
    Eye,
    Menu,
    X
} from 'lucide-react';

export default function LandingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiPosition, setConfettiPosition] = useState<{ x: number; y: number } | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleStartTrial = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        // Set position to center of button
        setConfettiPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        });
        setShowConfetti(prev => !prev); // Toggle to trigger effect
    };

    const features = [
        {
            icon: <Sparkles className="w-6 h-6" />,
            title: "AI Post Generator",
            description: "Enter any idea, get a scroll-stopping LinkedIn post. Multiple tones, story vs tactical modes, and temperature control.",
            color: "bg-violet-500"
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: "Trend Scanner",
            description: "Scans Reddit, G2, Forbes & Gartner for trending topics. Generate posts positioned around what's hot right now.",
            color: "bg-emerald-500"
        },
        {
            icon: <Lightbulb className="w-6 h-6" />,
            title: "Post Ideas Generator",
            description: "Stuck? Get 8 viral post ideas with hooks, formats, and hashtags. Never stare at a blank screen again.",
            color: "bg-yellow-500"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Viral Post Hacker",
            description: "Paste any viral post, AI reverse-engineers the formula and creates your version. Ethically steal what works.",
            color: "bg-purple-500"
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: "Sales Cadence Generator",
            description: "Turn engagement into pipeline. Get 7-step outreach sequences: connection request → DMs → email → cold call scripts.",
            color: "bg-blue-500"
        },
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Engagement Responder",
            description: "Paste everyone who liked/commented. Get personalized connection requests and thank-you DMs for each person.",
            color: "bg-pink-500"
        },
        {
            icon: <User className="w-6 h-6" />,
            title: "Profile Optimizer",
            description: "Upload your resume, get LinkedIn-optimized bullets using Pain → Solution → Result framework. Stand out to recruiters.",
            color: "bg-indigo-500"
        },
        {
            icon: <Repeat className="w-6 h-6" />,
            title: "Content Repurposer",
            description: "One post → Twitter thread, email newsletter, Instagram carousel, video script, blog outline, cold email. 6 formats.",
            color: "bg-orange-500"
        }
    ];

    const repurposeFormats = [
        { icon: <Twitter className="w-5 h-5" />, label: "Twitter Thread", desc: "5-8 tweet breakdown" },
        { icon: <Mail className="w-5 h-5" />, label: "Email Newsletter", desc: "Full email + subject line" },
        { icon: <FileText className="w-5 h-5" />, label: "Instagram Carousel", desc: "6-8 slide content" },
        { icon: <Video className="w-5 h-5" />, label: "Video Script", desc: "60-90 sec with pauses" },
        { icon: <FileText className="w-5 h-5" />, label: "Blog Outline", desc: "SEO title + H2 sections" },
        { icon: <Mail className="w-5 h-5" />, label: "Cold Email", desc: "<80 words, high convert" },
    ];

    const faqs = [
        {
            q: "How is this different from ChatGPT?",
            a: "ChatGPT is a general-purpose AI. PostPipeline is built specifically for LinkedIn growth and sales prospecting. Every prompt is optimized for scroll-stopping hooks, engagement, and conversion. Plus, you get trend scanning, viral templates, cadence generation, and batch engagement tools that ChatGPT simply can't do."
        },
        {
            q: "Do I need to connect my LinkedIn account?",
            a: "No. PostPipeline generates content you copy and paste. This keeps your LinkedIn account 100% safe from automation flags or bans. You stay in control of what gets posted."
        },
        {
            q: "What makes the Sales Cadence feature special?",
            a: "Most content tools stop at posting. We help you convert engagement into conversations. When someone likes your post, you get a personalized connection request + 7-step nurture sequence (DMs, email, cold call script) tailored to them."
        },
        {
            q: "Can I cancel anytime?",
            a: "Yes. No contracts, no commitments. Cancel anytime from your dashboard. We're confident you'll stay because the tool pays for itself with one closed deal."
        },
        {
            q: "Is there a free trial?",
            a: "We offer a 7-day money-back guarantee. Try it risk-free. If it's not for you, get a full refund, no questions asked."
        },
        {
            q: "Who is this for?",
            a: "Founders doing their own sales, SDRs and sales teams, coaches and consultants, B2B marketers, and anyone who wants to turn LinkedIn into a lead generation machine without spending hours writing."
        }
    ];

    const testimonials = [
        {
            quote: "I went from posting once a month to daily. My engagement is up 400% and I've booked 12 calls this month directly from LinkedIn.",
            name: "Sarah Chen",
            title: "Founder, TechRecruit.io",
            avatar: "SC"
        },
        {
            quote: "The Engagement Responder alone is worth the price. I process 50+ reactions in minutes and have real conversations instead of generic 'thanks for connecting'.",
            name: "Marcus Johnson",
            title: "Enterprise SDR, SalesForce",
            avatar: "MJ"
        },
        {
            quote: "Finally, a tool that gets LinkedIn isn't just about content—it's about pipeline. The cadence generator changed how my team does outbound.",
            name: "David Park",
            title: "VP Sales, CloudStack",
            avatar: "DP"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Confetti Effect */}
            <Confetti trigger={showConfetti} position={confettiPosition} />

            {/* Snowfall Effect */}
            <Snowfall />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                                <Rocket className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg sm:text-xl text-gray-900">PostPipeline</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
                            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
                            <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
                        </div>
                        <div className="hidden sm:flex items-center gap-3">
                            <Link href="/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                Sign In
                            </Link>
                            <button
                                onClick={handleStartTrial}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all shadow-md hover:shadow-lg"
                            >
                                Start Free Trial
                            </button>
                        </div>
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="sm:hidden p-2 text-gray-600 hover:text-gray-900"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="sm:hidden bg-white border-t border-gray-100 py-4 px-4">
                        <div className="flex flex-col gap-4">
                            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 hover:text-gray-900 py-2">Features</a>
                            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 hover:text-gray-900 py-2">How It Works</a>
                            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 hover:text-gray-900 py-2">Pricing</a>
                            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 hover:text-gray-900 py-2">FAQ</a>
                            <hr className="border-gray-200" />
                            <Link href="/signin" className="text-gray-600 hover:text-gray-900 py-2">Sign In</Link>
                            <button
                                onClick={handleStartTrial}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium rounded-lg"
                            >
                                Start Free Trial
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                            AI-Powered LinkedIn Growth + Sales Prospecting
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
                            Turn LinkedIn Posts Into{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                                Sales Pipeline
                            </span>
                        </h1>
                        <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                            Stop posting into the void. Create scroll-stopping content, then convert every like, comment, and share into warm conversations and booked meetings.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                            <button
                                onClick={handleStartTrial}
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
                            >
                                Start Your Free Trial
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <a
                                href="#how-it-works"
                                className="w-full sm:w-auto px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-lg"
                            >
                                See How It Works
                            </a>
                        </div>
                        <p className="text-sm text-gray-500">
                            7-day money-back guarantee • No credit card required • Cancel anytime
                        </p>
                    </div>

                    {/* Hero Video */}
                    <div className="mt-12 sm:mt-16 relative">
                        <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
                            <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="ml-4 text-slate-400 text-sm">Product Demo</span>
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
                </div>
            </section>

            {/* Social Proof Bar */}
            <section className="py-8 sm:py-12 bg-gray-50 border-y border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-8 md:gap-16">
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex -space-x-2">
                                {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'].map((color, i) => (
                                    <div key={i} className={`w-7 h-7 sm:w-8 sm:h-8 ${color} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                                        {['J', 'S', 'M', 'K'][i]}
                                    </div>
                                ))}
                            </div>
                            <span className="text-gray-600 text-xs sm:text-sm">500+ creators & sales pros</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="ml-2 text-gray-600 text-xs sm:text-sm">4.9/5 rating</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                            <span className="text-gray-600 text-xs sm:text-sm">10M+ impressions</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Manual - Account Safety Section */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-100 rounded-full text-green-700 text-xs sm:text-sm font-medium mb-4">
                            <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                            Account Safety First
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Why we don't automate LinkedIn
                        </h2>
                        <p className="text-sm sm:text-lg text-gray-600 px-2">
                            We intentionally built PostPipeline as a copy-paste tool. Here's why that protects you:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
                        {/* The Danger */}
                        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-red-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                    <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm sm:text-base">The Automation Trap</h3>
                            </div>
                            <ul className="space-y-2 sm:space-y-3">
                                {[
                                    { icon: <Ban className="w-3 h-3 sm:w-4 sm:h-4" />, text: "LinkedIn actively detects and bans automation tools" },
                                    { icon: <Lock className="w-3 h-3 sm:w-4 sm:h-4" />, text: "Accounts get restricted or permanently suspended" },
                                    { icon: <Eye className="w-3 h-3 sm:w-4 sm:h-4" />, text: "API access violations can trigger immediate lockouts" },
                                    { icon: <ShieldAlert className="w-3 h-3 sm:w-4 sm:h-4" />, text: "Third-party tools with LinkedIn access put your data at risk" },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 sm:gap-3">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-red-600">
                                            {item.icon}
                                        </div>
                                        <span className="text-gray-700 text-sm sm:text-base">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Our Approach */}
                        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-green-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Our Safe Approach</h3>
                            </div>
                            <ul className="space-y-2 sm:space-y-3">
                                {[
                                    { icon: <Copy className="w-3 h-3 sm:w-4 sm:h-4" />, text: "Copy-paste workflow — zero LinkedIn integration" },
                                    { icon: <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />, text: "Your account stays 100% safe from automation flags" },
                                    { icon: <Eye className="w-3 h-3 sm:w-4 sm:h-4" />, text: "You review everything before it goes live" },
                                    { icon: <Lock className="w-3 h-3 sm:w-4 sm:h-4" />, text: "No LinkedIn credentials or API access required" },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 sm:gap-3">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-green-600">
                                            {item.icon}
                                        </div>
                                        <span className="text-gray-700 text-sm sm:text-base">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Quote */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 max-w-3xl mx-auto text-center">
                        <p className="text-sm sm:text-lg text-gray-700 italic mb-3 sm:mb-4">
                            "LinkedIn's algorithm actually rewards genuine, manual engagement. Automation might save time, but it costs you reach — and potentially your entire account."
                        </p>
                        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            <span>PostPipeline keeps you safe while maximizing your results</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            LinkedIn is broken for most people
                        </h2>
                        <p className="text-sm sm:text-lg text-gray-600">
                            You know you should post. You know engagement matters. But...
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
                        {[
                            { problem: "You stare at a blank screen for 30 minutes", result: "Then give up and don't post" },
                            { problem: "You finally post something decent", result: "Get 3 likes from your mom and coworkers" },
                            { problem: "Someone engages with your content", result: "You don't know what to say, so you ignore it" },
                        ].map((item, i) => (
                            <div key={i} className="p-6 bg-red-50 rounded-2xl border border-red-100">
                                <div className="text-red-600 font-semibold mb-2">The Problem:</div>
                                <p className="text-gray-800 font-medium mb-4">{item.problem}</p>
                                <div className="text-red-600 font-semibold mb-2">The Result:</div>
                                <p className="text-gray-600">{item.result}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-violet-600">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                        What if every post led to pipeline?
                    </h2>
                    <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto mb-12">
                        PostPipeline connects the dots: Content → Engagement → Conversations → Revenue
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                        {[
                            { step: "1", title: "Create", desc: "AI writes scroll-stopping posts in seconds" },
                            { step: "2", title: "Post", desc: "Copy, paste, and watch engagement roll in" },
                            { step: "3", title: "Respond", desc: "Turn every like into a personalized outreach" },
                            { step: "4", title: "Close", desc: "Nurture with cadences that book meetings" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                                    {item.step}
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                                <p className="text-blue-100 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Everything you need to dominate LinkedIn
                        </h2>
                        <p className="text-sm sm:text-lg text-gray-600">
                            80+ features built for creators who want results, not just likes
                        </p>
                    </div>

                    {/* Visual Feature Showcase */}
                    <div className="space-y-6 sm:space-y-16">
                        {/* Row 1: Trend Scanner & Profile Optimizer */}
                        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200">
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white">
                                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Trend Scanner</h3>
                                        <p className="text-xs sm:text-sm text-gray-600">Find what's hot, create what converts</p>
                                    </div>
                                </div>
                                <div className="rounded-lg sm:rounded-xl overflow-hidden border border-emerald-200 shadow-md">
                                    <Image src="/screenshots/trend-scanner.png" alt="Trend Scanner" width={600} height={400} className="w-full h-auto" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-violet-200">
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-violet-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white">
                                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Profile Optimizer</h3>
                                        <p className="text-xs sm:text-sm text-gray-600">Upload resume, get LinkedIn-ready bullets</p>
                                    </div>
                                </div>
                                <div className="rounded-lg sm:rounded-xl overflow-hidden border border-violet-200 shadow-md">
                                    <Image src="/screenshots/profile-optimizer.png" alt="Profile Optimizer" width={600} height={400} className="w-full h-auto" />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Viral Templates & Viral Hacker */}
                        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200">
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white">
                                        <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Top 10 Viral Templates</h3>
                                        <p className="text-xs sm:text-sm text-gray-600">Proven frameworks that get engagement</p>
                                    </div>
                                </div>
                                <div className="rounded-lg sm:rounded-xl overflow-hidden border border-amber-200 shadow-md">
                                    <Image src="/screenshots/viral-templates.png" alt="Viral Templates" width={600} height={400} className="w-full h-auto" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200">
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white">
                                        <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Viral Post Hacker</h3>
                                        <p className="text-xs sm:text-sm text-gray-600">Reverse-engineer any viral post</p>
                                    </div>
                                </div>
                                <div className="rounded-lg sm:rounded-xl overflow-hidden border border-purple-200 shadow-md">
                                    <Image src="/screenshots/viral-hacker.png" alt="Viral Post Hacker" width={600} height={400} className="w-full h-auto" />
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Post Ideas & Engagement Responder */}
                        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
                            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-yellow-200">
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white">
                                        <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Post Ideas Generator</h3>
                                        <p className="text-xs sm:text-sm text-gray-600">8 viral ideas with hooks in seconds</p>
                                    </div>
                                </div>
                                <div className="rounded-lg sm:rounded-xl overflow-hidden border border-yellow-200 shadow-md">
                                    <Image src="/screenshots/post-ideas.png" alt="Post Ideas Generator" width={600} height={400} className="w-full h-auto" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-pink-200">
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white">
                                        <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Engagement Responder</h3>
                                        <p className="text-xs sm:text-sm text-gray-600">Batch respond to reactions & comments</p>
                                    </div>
                                </div>
                                <div className="rounded-lg sm:rounded-xl overflow-hidden border border-pink-200 shadow-md">
                                    <Image src="/screenshots/engagement-responder.png" alt="Engagement Responder" width={600} height={400} className="w-full h-auto" />
                                </div>
                            </div>
                        </div>

                        {/* Row 4: Sales Cadence - Full Width */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-blue-200">
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white">
                                    <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-xl font-bold text-gray-900">Sales Cadence Generator</h3>
                                    <p className="text-xs sm:text-base text-gray-600">7-step outreach sequence: Connection → DMs → Email → Cold Call</p>
                                </div>
                            </div>
                            <div className="rounded-lg sm:rounded-xl overflow-hidden border border-blue-200 shadow-lg">
                                <Image src="/screenshots/cadence.png" alt="Sales Cadence Generator" width={1200} height={600} className="w-full h-auto" />
                            </div>
                        </div>
                    </div>

                    {/* Complete Feature List */}
                    <div className="mt-12 sm:mt-20 bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-200 p-6 sm:p-8">
                        <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-gray-900">Complete Feature List</h3>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {/* Core AI Writing */}
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-blue-600 mb-3 sm:mb-4 flex items-center gap-2">
                                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" /> Core AI Writing
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> AI Post Generation (GPT-4o)</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> 4 Tone Options</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Story/Tactical Mode</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Temperature Control</li>
                                </ul>
                            </div>

                            {/* Content Intelligence */}
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-emerald-600 mb-3 sm:mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> Content Intelligence
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Trend Scanner (Reddit, G2, Forbes)</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Post Ideas Generator (8 viral ideas)</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Top 10 Viral Templates</li>
                                </ul>
                            </div>

                            {/* Post Enhancement */}
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-violet-600 mb-3 sm:mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> Post Enhancement
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> 5 Hook Variations</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Viral Post Hacker</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Auto-Simplify (Grade 6+ readability)</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Variations (Shorter, Bolder, Professional)</li>
                                </ul>
                            </div>

                            {/* Analytics */}
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-yellow-600 mb-3 sm:mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" /> Analytics & Optimization
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Engagement Score (1-100)</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Hook Strength Rating</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Best Time to Post</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Readability Grade</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Hashtag Suggestions</li>
                                </ul>
                            </div>

                            {/* Content Repurposing */}
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-pink-600 mb-3 sm:mb-4 flex items-center gap-2">
                                    <Repeat className="w-4 h-4 sm:w-5 sm:h-5" /> Content Repurposing
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Twitter/X Thread (5-8 tweets)</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Email Newsletter</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Instagram Carousel</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Video Script (60-90 sec)</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Blog Outline + Cold Email</li>
                                </ul>
                            </div>

                            {/* Profile Optimization */}
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-indigo-600 mb-3 sm:mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4 sm:w-5 sm:h-5" /> Profile Optimization
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Resume Upload & Parse</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Full Resume Rewrite</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Headline Generator</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Metrics Enhancement</li>
                                </ul>
                            </div>

                            {/* Sales Cadence */}
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-orange-600 mb-3 sm:mb-4 flex items-center gap-2">
                                    <Target className="w-4 h-4 sm:w-5 sm:h-5" /> Sales Cadence Generator
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> 7-Step Outreach Cadence</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Connection Request Script</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> DM Scripts (No Pitch → Value → Ask)</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Email + Cold Call Script</li>
                                </ul>
                            </div>

                            {/* Engagement Responder */}
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-red-600 mb-3 sm:mb-4 flex items-center gap-2">
                                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" /> Engagement Responder
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Batch Engagement Processing</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Reaction & Comment Detection</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Connection Request Generator</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Thank You DM Generator</li>
                                </ul>
                            </div>

                            {/* Content Series */}
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-purple-600 mb-3 sm:mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> Content Series
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Multi-Day Series Generator (3-7 days)</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Explicit Callbacks Between Posts</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Series Manager with Progress</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Calendar Integration</li>
                                </ul>
                            </div>

                            {/* Comment Generator & Calendar */}
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-teal-600 mb-3 sm:mb-4 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" /> Comments & Calendar
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> 5 Comment Variations</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Content Calendar</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Email Reminders</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Job Alerts Dashboard</li>
                                </ul>
                            </div>

                            {/* Visual & Preview */}
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-cyan-600 mb-3 sm:mb-4 flex items-center gap-2">
                                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> Visual & Preview
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> LinkedIn Preview</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> DALL-E 3 Image Generation</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Character Counter</li>
                                </ul>
                            </div>

                            {/* Utility */}
                            <div>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-600 mb-3 sm:mb-4 flex items-center gap-2">
                                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" /> Utility Features
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> History (Last 50 posts)</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Favorites</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> One-Click Copy</li>
                                    <li className="flex items-start gap-2"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" /> Stats Tracking</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200 text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-green-500 mb-2">80+</div>
                            <div className="text-gray-600 text-sm sm:text-base">Total Features Built & Working</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Repurpose Section */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-center">
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                One post. Six platforms.
                            </h2>
                            <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8">
                                Stop rewriting content for every channel. Create once, repurpose everywhere with a single click.
                            </p>
                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                {repurposeFormats.map((format, i) => (
                                    <div key={i} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl border border-gray-200">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-md sm:rounded-lg flex items-center justify-center text-gray-600 flex-shrink-0">
                                            {format.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-medium text-gray-900 text-xs sm:text-sm truncate">{format.label}</div>
                                            <div className="text-xs text-gray-500 hidden sm:block">{format.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-lg">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <Repeat className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                                <span className="font-semibold text-gray-900 text-sm sm:text-base">Content Repurposer</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                                <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Original LinkedIn Post:</p>
                                <p className="text-gray-800 text-sm sm:text-base">"The best salespeople don't sell. They solve problems. Here's what I learned from 1,000 cold calls..."</p>
                            </div>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {['Twitter Thread', 'Email', 'Carousel', 'Video Script'].map((format, i) => (
                                    <span key={i} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs sm:text-sm font-medium">
                                        → {format}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            From idea to booked meeting in minutes
                        </h2>
                        <p className="text-sm sm:text-lg text-gray-600">
                            Here's exactly how PostPipeline turns your LinkedIn into a revenue machine
                        </p>
                    </div>
                    <div className="space-y-8 sm:space-y-12">
                        {[
                            {
                                step: "01",
                                title: "Generate content that stops the scroll",
                                desc: "Enter your topic or use our Trend Scanner to find what's hot. AI generates a post optimized for engagement with viral hooks, clean formatting, and strategic CTAs.",
                                features: ["AI Post Generator", "Trend Scanner", "Viral Templates", "5 Hook Variations"],
                                image: "/screenshots/trend-scanner.png"
                            },
                            {
                                step: "02",
                                title: "Analyze and optimize before you post",
                                desc: "Get instant feedback: engagement score, hook strength, readability grade, and best time to post. Make it perfect before it goes live.",
                                features: ["Engagement Score", "Hook Strength", "Readability Analysis", "Best Time to Post"],
                                image: "/screenshots/post-ideas.png"
                            },
                            {
                                step: "03",
                                title: "Convert engagement into conversations",
                                desc: "Someone liked your post? Paste their name into Engagement Responder. Get a personalized connection request + thank-you DM instantly.",
                                features: ["Engagement Responder", "Batch Processing", "Personalized Messages", "One-Click Copy"],
                                image: "/screenshots/engagement-responder.png"
                            },
                            {
                                step: "04",
                                title: "Nurture with proven cadences",
                                desc: "For hot prospects, generate a full 7-step outreach sequence: connection → DMs → email → cold call script. All personalized to their engagement.",
                                features: ["7-Step Cadence", "DM Scripts", "Email Templates", "Cold Call Scripts"],
                                image: "/screenshots/cadence.png"
                            }
                        ].map((item, i) => (
                            <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-6 sm:gap-8 items-center`}>
                                <div className="flex-1 w-full">
                                    <div className="text-4xl sm:text-5xl font-bold text-gray-200 mb-2 sm:mb-4">{item.step}</div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">{item.title}</h3>
                                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{item.desc}</p>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {item.features.map((f, j) => (
                                            <span key={j} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1 w-full">
                                    <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={600}
                                            height={400}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Loved by founders & sales teams
                        </h2>
                        <p className="text-sm sm:text-lg text-gray-600">
                            Join hundreds who've transformed their LinkedIn presence
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
                        {testimonials.map((testimonial, i) => (
                            <div key={i} className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                                        <div className="text-xs sm:text-sm text-gray-500">{testimonial.title}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Simple pricing. Unlimited potential.
                        </h2>
                        <p className="text-sm sm:text-lg text-gray-600">
                            One plan. All features. No upsells. No hidden fees.
                        </p>
                    </div>
                    <div className="max-w-lg mx-auto">
                        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-blue-500 shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-4 sm:p-6 text-center">
                                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                                    FULL ACCESS
                                </span>
                                <div className="flex items-baseline justify-center gap-2 mb-1 sm:mb-2">
                                    <span className="text-4xl sm:text-5xl font-bold text-white">$50</span>
                                    <span className="text-blue-100 text-sm sm:text-base">/month</span>
                                </div>
                                <p className="text-blue-100 text-sm sm:text-base">Billed monthly. Cancel anytime.</p>
                            </div>
                            <div className="p-4 sm:p-6">
                                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                    {[
                                        "Unlimited AI post generation",
                                        "All 80+ features included",
                                        "Trend Scanner & Post Ideas",
                                        "Viral Templates & Post Hacker",
                                        "Profile Optimizer with resume upload",
                                        "Sales Cadence Generator",
                                        "Content Series (multi-day posts)",
                                        "Engagement Responder (batch)",
                                        "6 content repurpose formats",
                                        "Analytics & optimization tools",
                                        "Priority support"
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                                            </div>
                                            <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={handleStartTrial}
                                    className="block w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl text-center hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
                                >
                                    Start Your 7-Day Free Trial
                                </button>
                                <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                                    No credit card required to start
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                <span>7-day money-back guarantee</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ROI Calculator */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                        The math is simple
                    </h2>
                    <p className="text-base sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
                        If PostPipeline helps you close just ONE deal per year, it pays for itself 10x over.
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:gap-8 max-w-3xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/20">
                            <div className="text-xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">$600</div>
                            <div className="text-gray-400 text-xs sm:text-base">Annual cost</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/20">
                            <div className="text-xl sm:text-4xl font-bold text-green-400 mb-1 sm:mb-2">$6K+</div>
                            <div className="text-gray-400 text-xs sm:text-base">Deal value</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/20">
                            <div className="text-xl sm:text-4xl font-bold text-yellow-400 mb-1 sm:mb-2">10x</div>
                            <div className="text-gray-400 text-xs sm:text-base">ROI</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Frequently asked questions
                        </h2>
                        <p className="text-sm sm:text-lg text-gray-600">
                            Everything you need to know about PostPipeline
                        </p>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors gap-3"
                                >
                                    <span className="font-semibold text-gray-900 text-sm sm:text-base">{faq.q}</span>
                                    {openFaq === i ? (
                                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                                    )}
                                </button>
                                {openFaq === i && (
                                    <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
                                        <p className="text-gray-600 text-sm sm:text-base">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-violet-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                        Ready to turn LinkedIn into your sales machine?
                    </h2>
                    <p className="text-sm sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                        Join 500+ founders and sales pros who stopped posting into the void and started booking meetings.
                    </p>
                    <button
                        onClick={handleStartTrial}
                        className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl text-base sm:text-lg"
                    >
                        Start Your Free Trial
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <p className="mt-4 sm:mt-6 text-blue-100 text-xs sm:text-sm">
                        No credit card required • 7-day money-back guarantee
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col items-center gap-4 sm:gap-6 text-center md:flex-row md:justify-between md:text-left">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                                <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg sm:text-xl text-white">PostPipeline</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="mailto:support@postpipeline.ai" className="hover:text-white transition-colors">Contact</a>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-400">
                            © {new Date().getFullYear()} PostPipeline. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
