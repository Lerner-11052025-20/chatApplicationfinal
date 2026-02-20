import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Users, MessageSquare, Globe2, Zap, TrendingUp, Shield, ArrowUpRight } from 'lucide-react';

/* ─── Easing Utilities ─────────────────────────────────────────────────── */
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/* ─── Hook: runs counter animation once the ref enters the viewport ──────── */
function useCountUp(end, duration = 2200, decimals = 0) {
    const [value, setValue] = useState(0);
    const ref = useRef(null);
    const animationId = useRef(null);
    const started = useRef(false);

    const start = useCallback(() => {
        if (started.current) return;
        started.current = true;
        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutExpo(progress);
            setValue(parseFloat((end * eased).toFixed(decimals)));
            if (progress < 1) {
                animationId.current = requestAnimationFrame(tick);
            } else {
                setValue(end);
            }
        };

        animationId.current = requestAnimationFrame(tick);
    }, [end, duration, decimals]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    start();
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(el);

        return () => {
            observer.disconnect();
            if (animationId.current) cancelAnimationFrame(animationId.current);
        };
    }, [start]);

    return { value, ref };
}

/* ─── Stat data ─────────────────────────────────────────────────────────── */
const STATS = [
    {
        icon: Users,
        value: 50000,
        suffix: '+',
        decimals: 0,
        label: 'Active Users',
        description: 'Trusted by professionals across 150+ countries',
        color: '#3b82f6',
        gradientFrom: 'rgba(59,130,246,0.18)',
        gradientTo: 'rgba(99,102,241,0.06)',
        accentRGB: '59,130,246',
    },
    {
        icon: MessageSquare,
        value: 10,
        suffix: 'M+',
        decimals: 0,
        label: 'Messages Sent',
        description: 'End-to-end encrypted transmissions daily',
        color: '#8b5cf6',
        gradientFrom: 'rgba(139,92,246,0.18)',
        gradientTo: 'rgba(59,130,246,0.06)',
        accentRGB: '139,92,246',
    },
    {
        icon: Globe2,
        value: 150,
        suffix: '+',
        decimals: 0,
        label: 'Countries',
        description: 'Global edge infrastructure coverage',
        color: '#06b6d4',
        gradientFrom: 'rgba(6,182,212,0.18)',
        gradientTo: 'rgba(99,102,241,0.06)',
        accentRGB: '6,182,212',
    },
    {
        icon: Zap,
        value: 99.9,
        suffix: '%',
        decimals: 1,
        label: 'Uptime SLA',
        description: 'Maximum reliability, zero compromise',
        color: '#10b981',
        gradientFrom: 'rgba(16,185,129,0.18)',
        gradientTo: 'rgba(6,182,212,0.06)',
        accentRGB: '16,185,129',
    },
];

/* ─── Individual Stat Card ───────────────────────────────────────────────── */
const StatCard = ({ stat, index }) => {
    const { value, ref } = useCountUp(stat.value, 2400, stat.decimals);
    const Icon = stat.icon;
    const [hovered, setHovered] = useState(false);

    const displayValue = stat.decimals > 0 ? value.toFixed(stat.decimals) : Math.floor(value).toLocaleString();

    return (
        <div
            className="stats-card"
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                '--accent': stat.color,
                '--accentRGB': stat.accentRGB,
                '--gFrom': stat.gradientFrom,
                '--gTo': stat.gradientTo,
                '--delay': `${index * 0.12}s`,
            }}
        >
            {/* Ambient background glow */}
            <div className="stats-card-glow" />

            {/* Top row: icon + arrow */}
            <div className="stats-card-header">
                <div className="stats-icon-wrap">
                    <Icon size={22} strokeWidth={2} />
                </div>
                <div className={`stats-arrow ${hovered ? 'stats-arrow-active' : ''}`}>
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                </div>
            </div>

            {/* Counter */}
            <div className="stats-counter">
                <span className="stats-number">
                    {displayValue}
                </span>
                <span className="stats-suffix">{stat.suffix}</span>
            </div>

            {/* Label */}
            <div className="stats-label">{stat.label}</div>

            {/* Description */}
            <p className="stats-description">{stat.description}</p>

            {/* Progress bar accent */}
            <div className="stats-bar-track">
                <div className={`stats-bar-fill ${hovered ? 'stats-bar-full' : ''}`} />
            </div>
        </div>
    );
};

/* ─── Main Stats Section ─────────────────────────────────────────────────── */
const Stats = () => {
    return (
        <section id="stats" className="stats-section">
            {/* Background mesh */}
            <div className="stats-bg-mesh" aria-hidden="true" />

            <div className="stats-container">
                {/* Header */}
                <div className="stats-header">
                    <div className="stats-badge">
                        <span className="stats-badge-dot" />
                        <span>Live Metrics</span>
                    </div>

                    <h2 className="stats-title">
                        Built for{' '}
                        <span className="stats-title-gradient">Scale & Speed</span>
                    </h2>

                    <p className="stats-subtitle">
                        Real numbers behind the world's most trusted communication platform.
                        Every metric updated in real time.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="stats-grid">
                    {STATS.map((stat, i) => (
                        <StatCard key={i} stat={stat} index={i} />
                    ))}
                </div>

                {/* Bottom trust strip */}
                <div className="stats-trust-strip">
                    <Shield size={14} strokeWidth={2} className="stats-trust-icon" />
                    <span>All metrics independently audited · Updated every 24 hours · ISO 27001 Certified</span>
                </div>
            </div>

            <style>{`
        /* ── Section ─────────────────────────────────────────────── */
        .stats-section {
          position: relative;
          padding: 7rem 1.5rem;
          overflow: hidden;
          background: #030014;
        }

        .stats-bg-mesh {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 0% 0%,   rgba(59,130,246,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 100% 0%,  rgba(99,102,241,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 50% 100%, rgba(6,182,212,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .stats-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        /* ── Header ─────────────────────────────────────────────── */
        .stats-header {
          text-align: center;
          margin-bottom: 4.5rem;
          animation: fadeInUp 0.7s ease both;
        }

        .stats-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 1rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 1.5rem;
        }

        .stats-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3b82f6;
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(59,130,246,0.6); }
          50%       { opacity: 0.7; box-shadow: 0 0 0 6px rgba(59,130,246,0); }
        }

        .stats-title {
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 1.25rem;
        }

        .stats-title-gradient {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stats-subtitle {
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: 1.05rem;
          font-weight: 500;
          color: #64748b;
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* ── Grid ───────────────────────────────────────────────── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr; }
          .stats-section { padding: 5rem 1rem; }
        }

        /* ── Card ───────────────────────────────────────────────── */
        .stats-card {
          position: relative;
          padding: 2rem 1.75rem 1.75rem;
          border-radius: 1.5rem;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          cursor: pointer;
          overflow: hidden;
          transition:
            transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
            border-color 0.35s ease,
            box-shadow 0.35s ease;
          animation: fadeInUp 0.6s ease both;
          animation-delay: var(--delay);
          will-change: transform;
        }

        .stats-card:hover {
          transform: translateY(-8px) scale(1.015);
          border-color: rgba(var(--accentRGB), 0.35);
          box-shadow:
            0 20px 60px rgba(var(--accentRGB), 0.15),
            0 0 0 1px rgba(var(--accentRGB), 0.12),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        /* ambient glow blob */
        .stats-card-glow {
          position: absolute;
          top: -50%;
          right: -30%;
          width: 70%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(circle, var(--gFrom) 0%, var(--gTo) 60%, transparent 100%);
          pointer-events: none;
          transition: opacity 0.4s ease;
          opacity: 0.6;
          filter: blur(30px);
        }

        .stats-card:hover .stats-card-glow {
          opacity: 1;
        }

        /* ── Card Header ────────────────────────────────────────── */
        .stats-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .stats-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(var(--accentRGB), 0.12);
          border: 1px solid rgba(var(--accentRGB), 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.3s ease;
          flex-shrink: 0;
        }

        .stats-card:hover .stats-icon-wrap {
          transform: scale(1.12) rotate(-3deg);
          background: rgba(var(--accentRGB), 0.2);
        }

        .stats-arrow {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .stats-arrow-active,
        .stats-card:hover .stats-arrow {
          background: rgba(var(--accentRGB), 0.15);
          border-color: rgba(var(--accentRGB), 0.3);
          color: var(--accent);
          transform: rotate(-45deg);
        }

        /* ── Counter ────────────────────────────────────────────── */
        .stats-counter {
          display: flex;
          align-items: baseline;
          gap: 0.1em;
          margin-bottom: 0.4rem;
          line-height: 1;
        }

        .stats-number {
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: clamp(2.4rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #ffffff;
          line-height: 1;
          transition: color 0.3s ease;
          display: inline-block;
          /* GPU-accelerated text rendering */
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }

        .stats-card:hover .stats-number {
          color: var(--accent);
          text-shadow: 0 0 30px rgba(var(--accentRGB), 0.4);
        }

        .stats-suffix {
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--accent);
          letter-spacing: -0.02em;
          opacity: 0.85;
        }

        /* ── Label & Description ────────────────────────────────── */
        .stats-label {
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.6rem;
        }

        .stats-description {
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          color: #475569;
          line-height: 1.6;
          margin: 0 0 1.25rem;
          transition: color 0.3s ease;
        }

        .stats-card:hover .stats-description {
          color: #64748b;
        }

        /* ── Progress Bar ───────────────────────────────────────── */
        .stats-bar-track {
          height: 3px;
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
          overflow: hidden;
        }

        .stats-bar-fill {
          height: 100%;
          width: 35%;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--accent) 0%, transparent 100%);
          transition: width 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }

        .stats-bar-full,
        .stats-card:hover .stats-bar-fill {
          width: 100%;
        }

        /* ── Trust Strip ────────────────────────────────────────── */
        .stats-trust-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 3.5rem;
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #334155;
        }

        .stats-trust-icon {
          color: #1e40af;
          flex-shrink: 0;
        }

        /* ── Keyframes ──────────────────────────────────────────── */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Reduced Motion ─────────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .stats-card,
          .stats-card-glow,
          .stats-icon-wrap,
          .stats-bar-fill {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
        </section>
    );
};

export default Stats;
