import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

/* ─── Data ──────────────────────────────────────────────────────────────── */
const REVIEWS = [
    {
        name: 'Leo Hudson',
        role: 'Security Director',
        company: 'TechSecure Inc.',
        text: 'ChatWave completely transformed how our security team communicates. The end-to-end encryption gives us absolute confidence that sensitive discussions stay private. It\'s not just a chat app — it\'s a trust infrastructure.',
        stars: 5,
        accent: '#3b82f6',
        accentRGB: '59,130,246',
    },
    {
        name: 'Elena Zhou',
        role: 'Systems Architect',
        company: 'CloudNova',
        text: 'The real-time messaging is genuinely instant. No refresh delays, no message drops. The WebSocket implementation is rock-solid, and the group chat features make remote team collaboration feel effortless.',
        stars: 5,
        accent: '#8b5cf6',
        accentRGB: '139,92,246',
    },
    {
        name: 'Marcus Ray',
        role: 'Startup Founder',
        company: 'LaunchLab',
        text: 'We moved our entire team communication to ChatWave. The 2FA security, file sharing, and clean UI are outstanding. Our team onboarded in minutes and productivity visibly improved within the first week.',
        stars: 5,
        accent: '#10b981',
        accentRGB: '16,185,129',
    },
    {
        name: 'Priya Mehta',
        role: 'Product Manager',
        company: 'DesignFirst',
        text: 'Finally a communication platform that balances beauty and function. The UI is stunning, the reactions and threaded replies keep conversations organized, and the mobile experience is just as polished as desktop.',
        stars: 5,
        accent: '#06b6d4',
        accentRGB: '6,182,212',
    },
    {
        name: 'James O\'Brien',
        role: 'DevOps Engineer',
        company: 'InfraStack',
        text: 'As someone who\'s tried every chat platform imaginable, ChatWave stands above. The uptime is genuinely 99.9% — we\'ve had zero outages in 8 months. The live presence indicators alone save us hours of back-and-forth.',
        stars: 5,
        accent: '#f59e0b',
        accentRGB: '245,158,11',
    },
];

/* ─── StarRow ────────────────────────────────────────────────────────────── */
const StarRow = ({ count, color }) => (
    <div style={{ display: 'flex', gap: '3px' }}>
        {Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={14}
                fill={i < count ? color : 'transparent'}
                stroke={i < count ? color : '#334155'}
                strokeWidth={1.5}
            />
        ))}
    </div>
);

/* ─── Main Component ─────────────────────────────────────────────────────── */
const Testimonials = () => {
    const [active, setActive] = useState(0);
    const [animDir, setAnimDir] = useState('next'); // 'next' | 'prev'
    const [playing, setPlaying] = useState(true);
    const timerRef = useRef(null);
    const sectionRef = useRef(null);
    const [visible, setVisible] = useState(false);

    /* Intersection Observer */
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold: 0.15 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    /* Auto-play */
    const go = useCallback((dir) => {
        setAnimDir(dir);
        setActive(prev =>
            dir === 'next'
                ? (prev + 1) % REVIEWS.length
                : (prev - 1 + REVIEWS.length) % REVIEWS.length
        );
    }, []);

    useEffect(() => {
        if (!playing) return;
        timerRef.current = setInterval(() => go('next'), 5000);
        return () => clearInterval(timerRef.current);
    }, [playing, go, active]);

    const handleNav = (dir) => {
        clearInterval(timerRef.current);
        setPlaying(false);
        go(dir);
        setTimeout(() => setPlaying(true), 8000);
    };

    const review = REVIEWS[active];

    return (
        <section id="testimonials" ref={sectionRef} className="tsec">
            <div className="tsec__bg" aria-hidden="true" />

            <div className="tsec__container">
                {/* Header */}
                <div className={`tsec__header ${visible ? 'tsec__header--vis' : ''}`}>
                    <div className="tsec__badge">
                        <span className="tsec__badge-dot" />
                        <span>What People Say</span>
                    </div>
                    <h2 className="tsec__title">
                        Trusted by teams{' '}
                        <span className="tsec__gradient">worldwide</span>
                    </h2>
                    <p className="tsec__subtitle">
                        Real feedback from real users who rely on ChatWave every day to communicate, collaborate, and stay secure.
                    </p>
                </div>

                {/* Carousel area */}
                <div className="tsec__carousel" style={{ '--accent': review.accent, '--rgb': review.accentRGB }}>
                    {/* Giant decorative quote */}
                    <div className="tsec__quote-deco" aria-hidden="true">
                        <Quote size={120} strokeWidth={1} />
                    </div>

                    {/* Card */}
                    <div className="tsec__card">
                        <div className="tsec__card-bg" />

                        {/* Stars + company */}
                        <div className="tsec__card-top">
                            <StarRow count={review.stars} color={review.accent} />
                            <span className="tsec__company">{review.company}</span>
                        </div>

                        {/* Quote text */}
                        <blockquote className="tsec__text">
                            "{review.text}"
                        </blockquote>

                        {/* Author */}
                        <div className="tsec__author">
                            <div className="tsec__avatar">
                                {review.name[0]}
                            </div>
                            <div>
                                <div className="tsec__author-name">{review.name}</div>
                                <div className="tsec__author-role">{review.role}</div>
                            </div>
                        </div>
                    </div>

                    {/* Dot indicators */}
                    <div className="tsec__dots">
                        {REVIEWS.map((_, i) => (
                            <button
                                key={i}
                                className={`tsec__dot ${i === active ? 'tsec__dot--active' : ''}`}
                                onClick={() => { clearInterval(timerRef.current); setActive(i); setPlaying(false); setTimeout(() => setPlaying(true), 8000); }}
                                aria-label={`Review ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Nav arrows */}
                    <div className="tsec__nav">
                        <button className="tsec__nav-btn" onClick={() => handleNav('prev')} aria-label="Previous">
                            <ChevronLeft size={20} strokeWidth={2} />
                        </button>
                        <button className="tsec__nav-btn tsec__nav-btn--next" onClick={() => handleNav('next')} aria-label="Next">
                            <ChevronRight size={20} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Mini review avatars strip */}
                <div className={`tsec__strip ${visible ? 'tsec__strip--vis' : ''}`}>
                    {REVIEWS.map((r, i) => (
                        <button
                            key={i}
                            className={`tsec__strip-avatar ${i === active ? 'tsec__strip-avatar--active' : ''}`}
                            style={{ '--c': r.accentRGB }}
                            onClick={() => { setActive(i); setPlaying(false); setTimeout(() => setPlaying(true), 8000); }}
                            title={r.name}
                        >
                            {r.name[0]}
                        </button>
                    ))}
                    <span className="tsec__strip-label">+2k joined this week</span>
                </div>
            </div>

            <style>{`
        .tsec {
          position: relative;
          padding: 7rem 1.5rem;
          background: #030014;
          overflow: hidden;
        }
        .tsec__bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 50% at 10% 20%, rgba(99,102,241,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 90% 10%, rgba(59,130,246,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 50% 100%, rgba(6,182,212,0.07) 0%, transparent 55%);
        }
        .tsec__container {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        /* Header */
        .tsec__header {
          text-align: center;
          margin-bottom: 3.5rem;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .7s ease, transform .7s ease;
        }
        .tsec__header--vis { opacity: 1; transform: none; }
        .tsec__badge {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .3rem .9rem; border-radius: 999px;
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1);
          font-size: .68rem; font-weight: 800; letter-spacing: .16em;
          text-transform: uppercase; color: #94a3b8; margin-bottom: 1.4rem;
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
        }
        .tsec__badge-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #8b5cf6;
          animation: tpulse 2s ease-in-out infinite;
        }
        @keyframes tpulse {
          0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,.6)}
          50%{box-shadow:0 0 0 6px rgba(139,92,246,0)}
        }
        .tsec__title {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: clamp(2rem,4.5vw,3.2rem);
          font-weight: 800; color: #fff; letter-spacing: -.03em;
          line-height: 1.15; margin-bottom: 1rem;
        }
        .tsec__gradient {
          background: linear-gradient(130deg,#8b5cf6 0%,#3b82f6 50%,#06b6d4 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .tsec__subtitle {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: 1rem; font-weight: 500; color: #64748b; line-height: 1.75; margin: 0;
        }

        /* Carousel */
        .tsec__carousel {
          position: relative;
          padding-bottom: 1rem;
        }
        .tsec__quote-deco {
          position: absolute;
          top: -1.5rem; right: 1rem;
          color: rgba(var(--rgb),.06);
          pointer-events: none;
          transition: color .5s ease;
        }
        .tsec__card {
          position: relative;
          padding: 2.5rem 2.25rem;
          border-radius: 1.6rem;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(var(--rgb),.22);
          box-shadow: 0 20px 60px rgba(var(--rgb),.10), inset 0 1px 0 rgba(255,255,255,.05);
          overflow: hidden;
          transition: border-color .5s ease, box-shadow .5s ease;
          animation: tCardIn .45s cubic-bezier(.34,1.56,.64,1) both;
        }
        @keyframes tCardIn {
          from{opacity:0;transform:scale(.97) translateY(12px)}
          to{opacity:1;transform:none}
        }
        .tsec__card-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 60% at 100% 0%, rgba(var(--rgb),.12) 0%, transparent 60%);
          pointer-events: none;
          transition: background .5s ease;
        }
        .tsec__card-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .tsec__company {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .7rem; font-weight: 700; letter-spacing: .12em;
          text-transform: uppercase; color: #475569;
        }
        .tsec__text {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: clamp(1rem,2vw,1.2rem);
          font-weight: 500; color: #cbd5e1; line-height: 1.8;
          margin: 0 0 2rem; font-style: normal;
        }
        .tsec__author {
          display: flex; align-items: center; gap: 1rem;
        }
        .tsec__avatar {
          width: 48px; height: 48px; border-radius: 14px; flex-shrink: 0;
          background: rgba(var(--rgb),.18);
          border: 2px solid rgba(var(--rgb),.35);
          color: #fff; font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: 1.2rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          transition: background .5s ease, border-color .5s ease;
        }
        .tsec__author-name {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .95rem; font-weight: 800; color: #fff; margin-bottom: .15rem;
        }
        .tsec__author-role {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .75rem; font-weight: 600; color: #64748b;
        }

        /* Dots */
        .tsec__dots {
          display: flex; gap: .5rem; justify-content: center; margin-top: 1.75rem;
        }
        .tsec__dot {
          width: 28px; height: 4px; border-radius: 999px;
          background: rgba(255,255,255,.08); border: none; cursor: pointer;
          transition: width .4s ease, background .4s ease;
          padding: 0;
        }
        .tsec__dot--active {
          width: 52px;
          background: var(--accent);
          box-shadow: 0 0 12px rgba(var(--rgb),.45);
        }

        /* Nav */
        .tsec__nav {
          display: flex; gap: .75rem; justify-content: center; margin-top: 1rem;
        }
        .tsec__nav-btn {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1);
          color: #94a3b8; display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background .2s, border-color .2s, color .2s, transform .2s;
        }
        .tsec__nav-btn:hover {
          background: rgba(var(--rgb),.12);
          border-color: rgba(var(--rgb),.3);
          color: var(--accent);
          transform: scale(1.08);
        }

        /* Strip */
        .tsec__strip {
          display: flex; align-items: center; justify-content: center;
          gap: .5rem; margin-top: 2.5rem;
          opacity: 0; transform: translateY(16px);
          transition: opacity .6s ease .3s, transform .6s ease .3s;
        }
        .tsec__strip--vis { opacity: 1; transform: none; }
        .tsec__strip-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(var(--c),.18);
          border: 2px solid rgba(var(--c),.35);
          color: #fff; font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .85rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; margin-left: -8px;
          transition: transform .2s, border-color .2s;
        }
        .tsec__strip-avatar:first-child { margin-left: 0; }
        .tsec__strip-avatar:hover { transform: scale(1.12) translateY(-2px); z-index: 2; }
        .tsec__strip-avatar--active {
          border-color: white;
          box-shadow: 0 0 0 3px rgba(var(--c),.4);
        }
        .tsec__strip-label {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .78rem; font-weight: 600; color: #475569; margin-left: .75rem;
        }

        @media (prefers-reduced-motion:reduce){
          .tsec__card,.tsec__header,.tsec__strip{animation:none!important;transition:none!important;opacity:1!important;transform:none!important;}
        }
      `}</style>
        </section>
    );
};

export default Testimonials;
