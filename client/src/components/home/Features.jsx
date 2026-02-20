import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Zap, Lock, Users, Image, ToggleRight, MessageSquare,
  ShieldCheck, UserCircle2, ChevronRight, Sparkles, Check,
  Star, Globe2, TrendingUp, Award
} from 'lucide-react';

/* ─── Feature Data — Real app capabilities ─────────────────────────────── */
const FEATURES = [
  {
    id: 'realtime',
    icon: Zap,
    title: 'Real-Time Messaging',
    tagline: 'Zero-lag delivery',
    description:
      'Send and receive messages instantly using WebSocket technology. No refresh, no delay — every message lands in real time across all devices.',
    bullets: ['WebSocket-powered', 'Typing indicators', 'Read receipts', 'Instant delivery'],
    accent: '#3b82f6',
    accentRGB: '59,130,246',
    tag: 'Core',
  },
  {
    id: 'encryption',
    icon: Lock,
    title: 'End-to-End Encryption',
    tagline: 'Military-grade security',
    description:
      'All messages, files, and media are encrypted with AES-256 before leaving your device. Only you and your recipient can ever read them.',
    bullets: ['AES-256 encryption', 'Zero-knowledge server', 'Secure key exchange', 'Private by default'],
    accent: '#8b5cf6',
    accentRGB: '139,92,246',
    tag: 'Security',
  },
  {
    id: '2fa',
    icon: ShieldCheck,
    title: 'Two-Factor Auth',
    tagline: 'Double-lock your account',
    description:
      'Enable TOTP-based two-factor authentication for an extra layer of protection. Your account stays secure even if your password is compromised.',
    bullets: ['TOTP authenticator app', 'Backup recovery codes', 'Device trust management', 'Login alerts'],
    accent: '#10b981',
    accentRGB: '16,185,129',
    tag: 'Security',
  },
  {
    id: 'media',
    icon: Image,
    title: 'Rich Media Sharing',
    tagline: 'Share anything instantly',
    description:
      'Share images, videos, documents, and files of any type directly in your conversations. Preview inline without leaving the chat.',
    bullets: ['All file types', 'Inline image preview', 'Video playback', 'Drag & drop upload'],
    accent: '#06b6d4',
    accentRGB: '6,182,212',
    tag: 'Sharing',
  },
  {
    id: 'groups',
    icon: Users,
    title: 'Group Conversations',
    tagline: 'Collaborate at scale',
    description:
      'Create group chats with multiple members. Mention teammates, organize discussions, and keep everyone on the same page effortlessly.',
    bullets: ['Unlimited members', '@mention support', 'Admin controls', 'Group media gallery'],
    accent: '#f59e0b',
    accentRGB: '245,158,11',
    tag: 'Collaboration',
  },
  {
    id: 'presence',
    icon: ToggleRight,
    title: 'Live Presence',
    tagline: 'Always know who\'s online',
    description:
      'See who\'s online, away, or busy with live presence indicators. Know the right time to reach out before you even hit send.',
    bullets: ['Online / Away / Busy status', 'Last seen timestamp', 'Custom status messages', 'Invisible mode'],
    accent: '#ec4899',
    accentRGB: '236,72,153',
    tag: 'Social',
  },
  {
    id: 'reactions',
    icon: MessageSquare,
    title: 'Reactions & Replies',
    tagline: 'Express with one tap',
    description:
      'React to messages with emoji, or reply directly in a thread. Keep conversations contextual and expressive without cluttering the main chat.',
    bullets: ['Emoji reactions', 'Threaded replies', 'Message quoting', 'Reaction analytics'],
    accent: '#f97316',
    accentRGB: '249,115,22',
    tag: 'Engagement',
  },
  {
    id: 'profile',
    icon: UserCircle2,
    title: 'Rich User Profiles',
    tagline: 'Identity & personalisation',
    description:
      'Set your avatar, cover photo, bio, and custom status. Update your profile info, manage your privacy, and control who sees what.',
    bullets: ['Custom avatar & bio', 'Privacy controls', 'Account settings', 'Password management'],
    accent: '#a855f7',
    accentRGB: '168,85,247',
    tag: 'Profile',
  },
];

/* ─── Tag colour mapping ────────────────────────────────────────────────── */
const TAG_COLORS = {
  Core: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
  Security: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  Sharing: { bg: 'rgba(6,182,212,0.12)', color: '#06b6d4' },
  Collaboration: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  Social: { bg: 'rgba(236,72,153,0.12)', color: '#ec4899' },
  Engagement: { bg: 'rgba(249,115,22,0.12)', color: '#f97316' },
  Profile: { bg: 'rgba(168,85,247,0.12)', color: '#a855f7' },
};

/* ─── useIntersection hook ──────────────────────────────────────────────── */
function useIntersection(ref, options = {}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return visible;
}

/* ─── Feature Card ──────────────────────────────────────────────────────── */
const FeatureCard = ({ feature, index, isActive, onClick }) => {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const Icon = feature.icon;
  const tagStyle = TAG_COLORS[feature.tag] || TAG_COLORS.Core;

  return (
    <div
      ref={ref}
      className={`feat-card ${visible ? 'feat-card--visible' : ''} ${isActive ? 'feat-card--active' : ''}`}
      style={{ '--accent': feature.accent, '--rgb': feature.accentRGB, '--i': index }}
      onClick={() => onClick(feature.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(feature.id)}
      aria-pressed={isActive}
    >
      {/* Glow blob */}
      <div className="feat-card__glow" />

      {/* Header row */}
      <div className="feat-card__header">
        <div className="feat-card__icon">
          <Icon size={20} strokeWidth={2} />
        </div>
        <span
          className="feat-card__tag"
          style={{ background: tagStyle.bg, color: tagStyle.color }}
        >
          {feature.tag}
        </span>
      </div>

      {/* Title */}
      <h3 className="feat-card__title">{feature.title}</h3>
      <p className="feat-card__tagline">{feature.tagline}</p>

      {/* Active indicator bar */}
      <div className="feat-card__bar" />
    </div>
  );
};

/* ─── App mini-stats (static, shown below the feature detail) ─────────── */
const APP_MINI_STATS = [
  { icon: Users, value: '50K+', label: 'Active Users' },
  { icon: Globe2, value: '150+', label: 'Countries' },
  { icon: TrendingUp, value: '99.9%', label: 'Uptime SLA' },
];

/* ─── Badge capsule tags shown in the panel ────────────────────────────── */
const PLATFORM_BADGES = [
  { label: 'Open Source' },
  { label: 'GDPR Compliant' },
  { label: 'ISO 27001' },
  { label: 'End-to-End Encrypted' },
  { label: 'Zero Knowledge' },
  { label: 'WebSocket Real-Time' },
];

/* ─── Spotlight Panel ───────────────────────────────────────────────────── */
const SpotlightPanel = ({ feature }) => {
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey(k => k + 1);
  }, [feature.id]);

  const Icon = feature.icon;

  return (
    <div
      className="feat-spotlight"
      style={{ '--accent': feature.accent, '--rgb': feature.accentRGB }}
      key={animKey}
    >
      {/* Background gradient */}
      <div className="feat-spotlight__bg" />
      <div className="feat-spotlight__deco" />

      {/* ── TOP: Icon + title ─────────────────────────── */}
      <div className="feat-spotlight__top">
        <div className="feat-spotlight__icon-wrap">
          <Icon size={32} strokeWidth={1.8} />
        </div>
        <div>
          <div className="feat-spotlight__label">Featured Capability</div>
          <h2 className="feat-spotlight__title">{feature.title}</h2>
        </div>
      </div>

      {/* ── Description ──────────────────────────────── */}
      <p className="feat-spotlight__desc">{feature.description}</p>

      {/* ── Bullets ──────────────────────────────────── */}
      <ul className="feat-spotlight__bullets">
        {feature.bullets.map((b, i) => (
          <li key={i} className="feat-spotlight__bullet" style={{ '--bi': i }}>
            <span className="feat-spotlight__check">
              <Check size={12} strokeWidth={3} />
            </span>
            {b}
          </li>
        ))}
      </ul>

      {/* ── CTA ──────────────────────────────────────── */}
      <a href="#contact" className="feat-spotlight__cta">
        Get started free
        <ChevronRight size={16} strokeWidth={2.5} />
      </a>

      {/* ── Divider ──────────────────────────────────── */}
      <div className="feat-spotlight__divider" />

      {/* ── App mini-stats row ───────────────────────── */}
      <div className="feat-sp-stats">
        {APP_MINI_STATS.map(({ icon: SIcon, value, label }) => (
          <div key={label} className="feat-sp-stat">
            <SIcon size={14} strokeWidth={2} className="feat-sp-stat__icon" />
            <span className="feat-sp-stat__value">{value}</span>
            <span className="feat-sp-stat__label">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Divider ──────────────────────────────────── */}
      <div className="feat-spotlight__divider" />

      {/* ── About blurb ──────────────────────────────── */}
      <div className="feat-sp-about">
        <div className="feat-sp-about__header">
          <Award size={14} strokeWidth={2} />
          <span>Why ChatWave?</span>
        </div>
        <p className="feat-sp-about__text">
          ChatWave brings enterprise-grade security and real-time collaboration into one seamless platform.
          Built with WebSocket technology, AES-256 encryption, and a privacy-first architecture —
          it's communication designed for people who demand both speed and trust.
        </p>
      </div>

      {/* ── Badge capsule pills ──────────────────────── */}
      <div className="feat-sp-badges">
        {PLATFORM_BADGES.map(({ label }) => (
          <span key={label} className="feat-sp-badge">{label}</span>
        ))}
      </div>
    </div>
  );
};

/* ─── Main Features Section ─────────────────────────────────────────────── */
const Features = () => {
  const [activeId, setActiveId] = useState('realtime');
  const headerRef = useRef(null);
  const headerVisible = useIntersection(headerRef);
  const activeFeature = FEATURES.find(f => f.id === activeId) || FEATURES[0];

  const handleClick = useCallback((id) => setActiveId(id), []);

  return (
    <section id="features" className="feat-section">
      {/* Section mesh background */}
      <div className="feat-bg" aria-hidden="true" />

      <div className="feat-container">
        {/* ── Header ─────────────────────────────────────────── */}
        <div
          ref={headerRef}
          className={`feat-header ${headerVisible ? 'feat-header--visible' : ''}`}
        >
          <div className="feat-badge">
            <Sparkles size={12} strokeWidth={2.5} />
            <span>Platform Features</span>
          </div>

          <h2 className="feat-title">
            Everything you need to{' '}
            <span className="feat-title-gradient">communicate better</span>
          </h2>

          <p className="feat-subtitle">
            ChatWave is packed with powerful tools for real-time messaging,
            privacy, collaboration, and rich media — all in one elegant platform.
          </p>
        </div>

        {/* ── Main Content: Cards + Spotlight ────────────────── */}
        <div className="feat-body">
          {/* Card grid */}
          <div className="feat-grid">
            {FEATURES.map((f, i) => (
              <FeatureCard
                key={f.id}
                feature={f}
                index={i}
                isActive={f.id === activeId}
                onClick={handleClick}
              />
            ))}
          </div>

          {/* Spotlight panel */}
          <div className="feat-spotlight-wrap">
            <SpotlightPanel feature={activeFeature} />
          </div>
        </div>

        {/* ── Bottom strip ────────────────────────────────────── */}
        <div className="feat-strip">
          {['No credit card required', 'Free forever plan', 'Setup in 60 seconds', 'GDPR compliant'].map((t, i) => (
            <div key={i} className="feat-strip-item">
              <Check size={13} strokeWidth={3} className="feat-strip-check" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Inline styles ────────────────────────────────────── */}
      <style>{`
        /* ── Section ──────────────────────────────────── */
        .feat-section {
          position: relative;
          padding: 7rem 1.5rem;
          background: #030014;
          overflow: hidden;
        }

        .feat-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 90% 60% at 20% 10%, rgba(59,130,246,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 80% 0%,  rgba(139,92,246,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 50% 90%, rgba(6,182,212,0.07) 0%, transparent 55%);
        }

        .feat-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        /* ── Header ───────────────────────────────────── */
        .feat-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 4rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .feat-header--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .feat-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.3rem 0.9rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 1.5rem;
        }
        .feat-badge svg { color: #3b82f6; }

        .feat-title {
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1.15;
          margin-bottom: 1.1rem;
        }

        .feat-title-gradient {
          background: linear-gradient(130deg, #3b82f6 0%, #8b5cf6 60%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .feat-subtitle {
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: #64748b;
          line-height: 1.75;
          margin: 0;
        }

        /* ── Body layout ──────────────────────────────── */
        .feat-body {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 1.5rem;
          align-items: stretch;
        }

        @media (max-width: 1024px) {
          .feat-body { grid-template-columns: 1fr; }
          .feat-spotlight-wrap { order: -1; }
        }

        /* ── Cards grid ───────────────────────────────── */
        .feat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.85rem;
        }

        @media (max-width: 500px) {
          .feat-grid { grid-template-columns: 1fr; }
        }

        /* ── Individual card ──────────────────────────── */
        .feat-card {
          position: relative;
          padding: 1.4rem 1.5rem;
          border-radius: 1.15rem;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
          overflow: hidden;
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 0.5s ease calc(var(--i) * 0.07s),
            transform 0.5s ease calc(var(--i) * 0.07s),
            border-color 0.3s ease,
            background 0.3s ease,
            box-shadow 0.3s ease;
          will-change: transform;
          /* outline reset for keyboard nav */
          outline-offset: 3px;
        }
        .feat-card--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .feat-card:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(var(--rgb), 0.3);
          box-shadow: 0 8px 32px rgba(var(--rgb), 0.12);
          transform: translateY(-3px);
        }
        .feat-card--active {
          background: rgba(var(--rgb), 0.07) !important;
          border-color: rgba(var(--rgb), 0.5) !important;
          box-shadow:
            0 0 0 1px rgba(var(--rgb), 0.2),
            0 12px 40px rgba(var(--rgb), 0.15) !important;
          transform: translateY(0) !important;
        }

        /* glow blob on hover/active */
        .feat-card__glow {
          position: absolute;
          top: -40%;
          right: -20%;
          width: 60%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(var(--rgb), 0.14) 0%, transparent 70%);
          filter: blur(20px);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .feat-card:hover .feat-card__glow,
        .feat-card--active .feat-card__glow { opacity: 1; }

        .feat-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.8rem;
        }

        .feat-card__icon {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: rgba(var(--rgb), 0.12);
          border: 1px solid rgba(var(--rgb), 0.2);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.3s;
          flex-shrink: 0;
        }
        .feat-card:hover .feat-card__icon,
        .feat-card--active .feat-card__icon {
          transform: scale(1.1) rotate(-5deg);
          background: rgba(var(--rgb), 0.22);
        }

        .feat-card__tag {
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
        }

        .feat-card__title {
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: 0.97rem;
          font-weight: 700;
          color: #e2e8f0;
          letter-spacing: -0.01em;
          margin: 0 0 0.2rem;
          transition: color 0.3s;
        }
        .feat-card--active .feat-card__title { color: #fff; }

        .feat-card__tagline {
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          color: #475569;
          margin: 0 0 0.8rem;
          transition: color 0.3s;
        }
        .feat-card:hover .feat-card__tagline { color: #64748b; }

        .feat-card__bar {
          height: 2px;
          background: rgba(255,255,255,0.05);
          border-radius: 999px;
          overflow: hidden;
          position: relative;
        }
        .feat-card__bar::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, var(--accent), transparent);
          width: 0%;
          border-radius: 999px;
          transition: width 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }
        .feat-card:hover .feat-card__bar::after { width: 60%; }
        .feat-card--active .feat-card__bar::after { width: 100%; }

        /* ── Spotlight panel ──────────────────────────── */
        .feat-spotlight-wrap {
          position: sticky;
          top: 6rem;
          /* stretches the wrap to card grid height */
          display: flex;
          flex-direction: column;
        }

        .feat-spotlight {
          position: relative;
          padding: 2.25rem 2rem;
          border-radius: 1.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(var(--rgb), 0.2);
          overflow: hidden;
          animation: spotlightIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
          box-shadow:
            0 0 0 1px rgba(var(--rgb), 0.08),
            0 20px 60px rgba(var(--rgb), 0.10),
            inset 0 1px 0 rgba(255,255,255,0.05);
          /* grow to fill vertical space */
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        @keyframes spotlightIn {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }

        .feat-spotlight__bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 100% 0%, rgba(var(--rgb), 0.14) 0%, transparent 60%);
          pointer-events: none;
        }

        .feat-spotlight__deco {
          position: absolute;
          bottom: -60px;
          left: -40px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(var(--rgb), 0.08) 0%, transparent 70%);
          filter: blur(30px);
          pointer-events: none;
        }

        .feat-spotlight__top {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .feat-spotlight__icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: rgba(var(--rgb), 0.14);
          border: 1px solid rgba(var(--rgb), 0.25);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          animation: iconPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        @keyframes iconPop {
          from { transform: scale(0.7) rotate(-10deg); }
          to   { transform: scale(1) rotate(0deg); }
        }

        .feat-spotlight__label {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.3rem;
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
        }

        .feat-spotlight__title {
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: 1.45rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.025em;
          margin: 0;
          line-height: 1.2;
        }

        .feat-spotlight__desc {
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: #64748b;
          line-height: 1.75;
          margin: 0 0 1.5rem;
        }

        .feat-spotlight__bullets {
          list-style: none;
          padding: 0;
          margin: 0 0 1.75rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.55rem;
        }

        .feat-spotlight__bullet {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          color: #94a3b8;
          animation: bulletIn 0.35s ease calc(var(--bi) * 0.06s) both;
        }

        @keyframes bulletIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .feat-spotlight__check {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          background: rgba(var(--rgb), 0.15);
          border: 1px solid rgba(var(--rgb), 0.25);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feat-spotlight__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.72rem 1.4rem;
          border-radius: 999px;
          background: var(--accent);
          color: #fff;
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 8px 24px rgba(var(--rgb), 0.35);
        }
        .feat-spotlight__cta:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(var(--rgb), 0.45);
        }

        /* ── Horizontal divider ───────────────────────── */
        .feat-spotlight__divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
          margin: 1.4rem 0;
        }

        /* ── Mini stats row ───────────────────────────── */
        .feat-sp-stats {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 0.75rem;
        }

        .feat-sp-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.8rem 0.5rem;
          border-radius: 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          transition: background 0.25s, border-color 0.25s;
        }
        .feat-sp-stat:hover {
          background: rgba(var(--rgb), 0.07);
          border-color: rgba(var(--rgb), 0.2);
        }

        .feat-sp-stat__icon {
          color: var(--accent);
          margin-bottom: 0.1rem;
        }

        .feat-sp-stat__value {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .feat-sp-stat__label {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          color: #475569;
          text-align: center;
          letter-spacing: 0.04em;
        }

        /* ── About blurb ──────────────────────────────── */
        .feat-sp-about {
          flex: 1;
        }

        .feat-sp-about__header {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.65rem;
        }
        .feat-sp-about__header svg { flex-shrink: 0; }

        .feat-sp-about__text {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: #475569;
          line-height: 1.75;
          margin: 0;
        }

        /* ── Badge capsule pills ──────────────────────── */
        .feat-sp-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0;
        }

        .feat-sp-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.28rem 0.7rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #64748b;
          white-space: nowrap;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .feat-sp-badge:hover {
          background: rgba(var(--rgb), 0.1);
          border-color: rgba(var(--rgb), 0.25);
          color: var(--accent);
        }

        /* ── Bottom strip ─────────────────────────────── */
        .feat-strip {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 2.5rem;
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .feat-strip-item {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;
        }

        .feat-strip-check {
          color: #22c55e;
          flex-shrink: 0;
        }

        /* ── Reduced motion ───────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .feat-card,
          .feat-spotlight,
          .feat-spotlight__icon-wrap,
          .feat-spotlight__bullet,
          .feat-header {
            transition: none !important;
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Features;
