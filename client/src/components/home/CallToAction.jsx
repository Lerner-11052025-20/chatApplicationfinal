import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, MessageCircle, Users, Shield, Zap, Check } from 'lucide-react';

const PERKS = [
    { icon: MessageCircle, label: 'Real-time messaging' },
    { icon: Shield, label: 'AES-256 encryption' },
    { icon: Users, label: 'Group chats & teams' },
    { icon: Zap, label: '99.9% uptime SLA' },
];

const CTA_CHECKS = [
    'Free forever plan',
    'No credit card needed',
    'Setup in 60 seconds',
    'GDPR compliant',
];

const CallToAction = () => {
    const navigate = useNavigate();
    const ref = useRef(null);
    const [vis, setVis] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVis(true); obs.disconnect(); }
        }, { threshold: 0.2 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <section id="contact" className="cta-section">
            {/* ambient outer glow */}
            <div className="cta-outer-glow" aria-hidden="true" />

            <div className="cta-container" ref={ref}>
                {/* Floating perk icons — decorative */}
                <div className="cta-perk-ring" aria-hidden="true">
                    {PERKS.map(({ icon: Icon, label }, i) => (
                        <div key={i} className="cta-perk" style={{ '--pi': i }}>
                            <Icon size={18} strokeWidth={1.8} />
                        </div>
                    ))}
                </div>

                {/* Main card */}
                <div className={`cta-card ${vis ? 'cta-card--vis' : ''}`}>
                    {/* Background glow layers */}
                    <div className="cta-card__tl" />
                    <div className="cta-card__br" />
                    <div className="cta-card__grid" />

                    <div className="cta-inner">
                        {/* Badge */}
                        <div className="cta-badge">
                            <Sparkles size={13} strokeWidth={2} />
                            <span>Start for free today</span>
                        </div>

                        {/* Headline */}
                        <h2 className="cta-heading">
                            The smarter way to
                            <br />
                            <span className="cta-heading-grad">stay connected</span>
                        </h2>

                        {/* Subtext */}
                        <p className="cta-subtext">
                            Join 50,000+ users who trust ChatWave for secure, real-time
                            communication. Encrypted by default. Fast by design.
                        </p>

                        {/* Check list */}
                        <div className="cta-checks">
                            {CTA_CHECKS.map((c, i) => (
                                <div key={i} className="cta-check">
                                    <span className="cta-check__icon"><Check size={11} strokeWidth={3} /></span>
                                    <span>{c}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="cta-btns">
                            <button className="cta-btn cta-btn--primary" onClick={() => navigate('/signup')}>
                                Get Started Free
                                <ArrowRight size={18} strokeWidth={2.5} />
                            </button>
                            <button className="cta-btn cta-btn--ghost" onClick={() => navigate('/login')}>
                                Sign in
                            </button>
                        </div>

                        {/* Feature pills */}
                        <div className="cta-pills">
                            {PERKS.map(({ icon: Icon, label }, i) => (
                                <div key={i} className="cta-pill">
                                    <Icon size={13} strokeWidth={2} />
                                    <span>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .cta-section {
          position: relative;
          padding: 7rem 1.5rem 6rem;
          background: #030014;
          overflow: hidden;
        }

        .cta-outer-glow {
          position: absolute;
          left: 50%; top: 50%;
          translate: -50% -50%;
          width: 900px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(59,130,246,.10) 0%, rgba(139,92,246,.07) 40%, transparent 70%);
          pointer-events: none;
          filter: blur(40px);
        }

        .cta-container {
          max-width: 860px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        /* Floating perk ring — purely decorative */
        .cta-perk-ring {
          position: absolute;
          inset: -60px;
          pointer-events: none;
        }
        .cta-perk {
          position: absolute;
          width: 44px; height: 44px;
          border-radius: 14px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          color: #475569;
          display: flex; align-items: center; justify-content: center;
          animation: ctaFloat calc(6s + var(--pi) * 1.3s) ease-in-out infinite alternate;
        }
        .cta-perk:nth-child(1){top:10%;left:2%;}
        .cta-perk:nth-child(2){top:15%;right:3%;}
        .cta-perk:nth-child(3){bottom:20%;left:0%;}
        .cta-perk:nth-child(4){bottom:15%;right:2%;}
        @keyframes ctaFloat {
          from{transform:translateY(0) rotate(0deg);}
          to{transform:translateY(-18px) rotate(8deg);}
        }

        /* Card */
        .cta-card {
          position: relative;
          border-radius: 2rem;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.1);
          overflow: hidden;
          opacity: 0;
          transform: scale(.96) translateY(24px);
          transition: opacity .8s ease, transform .8s cubic-bezier(.34,1.56,.64,1), border-color .4s;
          box-shadow:
            0 0 0 1px rgba(59,130,246,.06),
            0 40px 100px rgba(0,0,0,.5),
            inset 0 1px 0 rgba(255,255,255,.06);
        }
        .cta-card--vis {
          opacity: 1;
          transform: none;
        }
        .cta-card:hover {
          border-color: rgba(59,130,246,.25);
          box-shadow: 0 0 0 1px rgba(59,130,246,.1), 0 40px 100px rgba(0,0,0,.6), 0 0 80px rgba(59,130,246,.08), inset 0 1px 0 rgba(255,255,255,.08);
        }

        /* Decorative gradients inside card */
        .cta-card__tl {
          position: absolute; top: -80px; left: -80px;
          width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,.18) 0%, transparent 70%);
          pointer-events: none; filter: blur(40px);
        }
        .cta-card__br {
          position: absolute; bottom: -100px; right: -80px;
          width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,.15) 0%, transparent 70%);
          pointer-events: none; filter: blur(40px);
        }
        .cta-card__grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .cta-inner {
          position: relative;
          z-index: 10;
          padding: 4rem 3rem;
          text-align: center;
        }
        @media(max-width:640px){.cta-inner{padding:2.5rem 1.5rem;}}

        /* Badge */
        .cta-badge {
          display: inline-flex;
          align-items: center;
          gap: .45rem;
          padding: .35rem 1rem;
          border-radius: 999px;
          background: rgba(59,130,246,.1);
          border: 1px solid rgba(59,130,246,.25);
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .7rem; font-weight: 800; letter-spacing: .14em;
          text-transform: uppercase; color: #60a5fa;
          margin-bottom: 1.75rem;
        }
        .cta-badge svg { color: #60a5fa; }

        /* Heading */
        .cta-heading {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: clamp(2.4rem,5vw,3.8rem);
          font-weight: 800; color: #fff; letter-spacing: -.04em;
          line-height: 1.1; margin-bottom: 1.25rem;
        }
        .cta-heading-grad {
          background: linear-gradient(130deg,#3b82f6 0%,#8b5cf6 50%,#06b6d4 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Subtext */
        .cta-subtext {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: 1rem; font-weight: 500; color: #64748b;
          line-height: 1.75; max-width: 520px; margin: 0 auto 2rem;
        }

        /* Checks */
        .cta-checks {
          display: flex; flex-wrap: wrap; gap: .75rem 2rem;
          justify-content: center; margin-bottom: 2.25rem;
        }
        .cta-check {
          display: flex; align-items: center; gap: .4rem;
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .78rem; font-weight: 600; color: #64748b;
        }
        .cta-check__icon {
          width: 18px; height: 18px; border-radius: 6px;
          background: rgba(16,185,129,.14); border: 1px solid rgba(16,185,129,.25);
          color: #10b981; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* Buttons */
        .cta-btns {
          display: flex; flex-wrap: wrap; gap: .9rem; justify-content: center;
          margin-bottom: 2rem;
        }
        .cta-btn {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .85rem 1.9rem; border-radius: 999px;
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .9rem; font-weight: 800; cursor: pointer;
          transition: transform .2s, box-shadow .2s, opacity .2s;
          border: none; text-decoration: none; letter-spacing: .01em;
        }
        .cta-btn--primary {
          background: linear-gradient(135deg,#3b82f6,#6366f1);
          color: #fff;
          box-shadow: 0 8px 28px rgba(59,130,246,.35);
        }
        .cta-btn--primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 14px 36px rgba(59,130,246,.5);
        }
        .cta-btn--primary:active { transform: scale(.97); }
        .cta-btn--ghost {
          background: rgba(255,255,255,.06);
          color: #94a3b8;
          border: 1px solid rgba(255,255,255,.12);
        }
        .cta-btn--ghost:hover {
          background: rgba(255,255,255,.1);
          color: #fff;
          transform: translateY(-2px);
        }

        /* Feature pills */
        .cta-pills {
          display: flex; flex-wrap: wrap; gap: .55rem; justify-content: center;
        }
        .cta-pill {
          display: inline-flex; align-items: center; gap: .4rem;
          padding: .28rem .75rem; border-radius: 999px;
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .68rem; font-weight: 600; color: #475569;
          transition: background .2s, border-color .2s, color .2s;
        }
        .cta-pill:hover {
          background: rgba(59,130,246,.1); border-color: rgba(59,130,246,.25);
          color: #60a5fa;
        }
        .cta-pill svg { color: inherit; }

        @media(prefers-reduced-motion:reduce){
          .cta-card,.cta-perk,.cta-btn{animation:none!important;transition:none!important;}
          .cta-card{opacity:1!important;transform:none!important;}
        }
      `}</style>
        </section>
    );
};

export default CallToAction;
