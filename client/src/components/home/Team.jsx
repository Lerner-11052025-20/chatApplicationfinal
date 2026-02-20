import React, { useRef, useEffect, useState } from 'react';
import { Github, Linkedin, Twitter, Code2, Shield, Palette, Server } from 'lucide-react';

/* ─── Team Data ─────────────────────────────────────────────────────────── */
const TEAM = [
    {
        name: 'Xavier Reed',
        role: 'Full-Stack Lead',
        dept: 'Engineering',
        bio: 'Architect of ChatWave\'s real-time WebSocket engine and core API. Passionate about scalable systems and zero-latency communication.',
        icon: Code2,
        accent: '#3b82f6',
        accentRGB: '59,130,246',
        social: { twitter: '#', linkedin: '#', github: '#' },
    },
    {
        name: 'Amara Voss',
        role: 'Security Engineer',
        dept: 'Cryptography',
        bio: 'Lead on end-to-end encryption and 2FA implementation. Ensures every message in ChatWave stays private by design.',
        icon: Shield,
        accent: '#10b981',
        accentRGB: '16,185,129',
        social: { twitter: '#', linkedin: '#', github: '#' },
    },
    {
        name: 'Kael Thorne',
        role: 'UI/UX Designer',
        dept: 'Design',
        bio: 'Crafts the visual language of ChatWave — from the glassmorphism design system to every micro-animation and interaction detail.',
        icon: Palette,
        accent: '#8b5cf6',
        accentRGB: '139,92,246',
        social: { twitter: '#', linkedin: '#', github: '#' },
    },
    {
        name: 'Suki Miya',
        role: 'DevOps Architect',
        dept: 'Infrastructure',
        bio: 'Maintains ChatWave\'s 99.9% uptime SLA across global edge nodes. Expert in containerization and zero-downtime deployments.',
        icon: Server,
        accent: '#f59e0b',
        accentRGB: '245,158,11',
        social: { twitter: '#', linkedin: '#', github: '#' },
    },
];

/* ─── useIntersection hook ──────────────────────────────────────────────── */
function useIntersection(ref) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold: 0.15 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return visible;
}

/* ─── TeamCard ──────────────────────────────────────────────────────────── */
const TeamCard = ({ member, index }) => {
    const ref = useRef(null);
    const visible = useIntersection(ref);
    const Icon = member.icon;

    return (
        <div
            ref={ref}
            className="tm-card"
            style={{
                '--accent': member.accent,
                '--rgb': member.accentRGB,
                '--i': index,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(32px)',
                transition: `opacity .6s ease ${index * 0.1}s, transform .6s ease ${index * 0.1}s`,
            }}
        >
            <div className="tm-card__glow" />

            {/* Role dept badge */}
            <div className="tm-card__dept">{member.dept}</div>

            {/* Avatar */}
            <div className="tm-card__avatar-wrap">
                <div className="tm-card__avatar">
                    {member.name[0]}
                </div>
                <div className="tm-card__icon-chip">
                    <Icon size={14} strokeWidth={2} />
                </div>
            </div>

            {/* Name + Role */}
            <h3 className="tm-card__name">{member.name}</h3>
            <div className="tm-card__role">{member.role}</div>

            {/* Bio */}
            <p className="tm-card__bio">{member.bio}</p>

            {/* Social */}
            <div className="tm-card__social">
                {[
                    { Icon: Twitter, href: member.social.twitter },
                    { Icon: Github, href: member.social.github },
                    { Icon: Linkedin, href: member.social.linkedin },
                ].map(({ Icon: SIcon, href }, i) => (
                    <a key={i} href={href} className="tm-card__social-btn" target="_blank" rel="noreferrer">
                        <SIcon size={15} strokeWidth={2} />
                    </a>
                ))}
            </div>

            {/* Bottom accent bar */}
            <div className="tm-card__bar" />
        </div>
    );
};

/* ─── Main Section ──────────────────────────────────────────────────────── */
const Team = () => {
    const headerRef = useRef(null);
    const headerVisible = useIntersection(headerRef);

    return (
        <section id="team" className="tm-section">
            <div className="tm-bg" aria-hidden="true" />

            <div className="tm-container">
                {/* Header */}
                <div
                    ref={headerRef}
                    className="tm-header"
                    style={{
                        opacity: headerVisible ? 1 : 0,
                        transform: headerVisible ? 'none' : 'translateY(28px)',
                        transition: 'opacity .7s ease, transform .7s ease',
                    }}
                >
                    <div className="tm-badge">
                        <span className="tm-badge-dot" />
                        <span>Meet the Team</span>
                    </div>
                    <h2 className="tm-title">
                        The minds behind{' '}
                        <span className="tm-gradient">ChatWave</span>
                    </h2>
                    <p className="tm-subtitle">
                        A passionate team of engineers, designers, and security experts
                        building the future of trusted, real-time communication.
                    </p>
                </div>

                {/* Cards */}
                <div className="tm-grid">
                    {TEAM.map((m, i) => <TeamCard key={i} member={m} index={i} />)}
                </div>
            </div>

            <style>{`
        .tm-section{position:relative;padding:7rem 1.5rem;background:#030014;overflow:hidden;}
        .tm-bg{position:absolute;inset:0;pointer-events:none;
          background:
            radial-gradient(ellipse 70% 50% at 0% 30%,rgba(59,130,246,.09) 0%,transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 20%,rgba(16,185,129,.09) 0%,transparent 55%),
            radial-gradient(ellipse 60% 50% at 50% 100%,rgba(139,92,246,.07) 0%,transparent 55%);}
        .tm-container{max-width:1100px;margin:0 auto;position:relative;z-index:10;}

        /* Header */
        .tm-header{text-align:center;margin-bottom:4rem;}
        .tm-badge{display:inline-flex;align-items:center;gap:.5rem;padding:.3rem .9rem;
          border-radius:999px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);
          font-size:.68rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;
          color:#94a3b8;margin-bottom:1.4rem;
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;}
        .tm-badge-dot{width:6px;height:6px;border-radius:50%;background:#06b6d4;
          animation:tmpulse 2s ease-in-out infinite;}
        @keyframes tmpulse{0%,100%{box-shadow:0 0 0 0 rgba(6,182,212,.6)}50%{box-shadow:0 0 0 6px rgba(6,182,212,0)}}
        .tm-title{font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:clamp(2rem,4.5vw,3.2rem);font-weight:800;color:#fff;
          letter-spacing:-.03em;line-height:1.15;margin-bottom:1rem;}
        .tm-gradient{background:linear-gradient(130deg,#06b6d4 0%,#3b82f6 50%,#8b5cf6 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .tm-subtitle{font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:1rem;font-weight:500;color:#64748b;line-height:1.75;margin:0;max-width:540px;margin:0 auto;}

        /* Grid */
        .tm-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.15rem;}
        @media(max-width:1024px){.tm-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:560px){.tm-grid{grid-template-columns:1fr;}}

        /* Card */
        .tm-card{position:relative;padding:1.75rem 1.5rem 1.5rem;border-radius:1.4rem;
          background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);
          overflow:hidden;text-align:center;cursor:default;
          will-change:transform;
          transition:border-color .3s,box-shadow .3s,transform .35s cubic-bezier(.34,1.56,.64,1);
        }
        .tm-card:hover{
          border-color:rgba(var(--rgb),.35);
          box-shadow:0 16px 48px rgba(var(--rgb),.14);
          transform:translateY(-6px)!important;
        }
        .tm-card__glow{position:absolute;top:-40%;right:-20%;width:70%;aspect-ratio:1;
          border-radius:50%;background:radial-gradient(circle,rgba(var(--rgb),.12) 0%,transparent 70%);
          filter:blur(24px);pointer-events:none;opacity:0;transition:opacity .4s;}
        .tm-card:hover .tm-card__glow{opacity:1;}

        .tm-card__dept{display:inline-flex;align-items:center;padding:.2rem .6rem;
          border-radius:999px;background:rgba(var(--rgb),.1);border:1px solid rgba(var(--rgb),.2);
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:.6rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
          color:var(--accent);margin-bottom:1.25rem;}

        .tm-card__avatar-wrap{position:relative;width:72px;height:72px;margin:0 auto 1rem;}
        .tm-card__avatar{width:100%;height:100%;border-radius:20px;
          background:rgba(var(--rgb),.14);border:2px solid rgba(var(--rgb),.3);
          color:#fff;font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:1.8rem;font-weight:800;
          display:flex;align-items:center;justify-content:center;
          transition:background .3s,border-color .3s,transform .35s cubic-bezier(.34,1.56,.64,1);}
        .tm-card:hover .tm-card__avatar{background:rgba(var(--rgb),.24);transform:scale(1.08) rotate(-3deg);}
        .tm-card__icon-chip{position:absolute;bottom:-4px;right:-4px;
          width:24px;height:24px;border-radius:8px;
          background:#030014;border:1px solid rgba(var(--rgb),.4);
          color:var(--accent);display:flex;align-items:center;justify-content:center;}

        .tm-card__name{font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:1rem;font-weight:800;color:#fff;margin:0 0 .25rem;
          letter-spacing:-.01em;transition:color .3s;}
        .tm-card:hover .tm-card__name{color:var(--accent);}
        .tm-card__role{font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
          color:var(--accent);margin-bottom:.8rem;}
        .tm-card__bio{font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:.78rem;font-weight:500;color:#475569;line-height:1.7;
          margin:0 0 1.2rem;}

        /* Social */
        .tm-card__social{display:flex;justify-content:center;gap:.5rem;}
        .tm-card__social-btn{width:32px;height:32px;border-radius:9px;
          background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
          color:#64748b;display:flex;align-items:center;justify-content:center;
          text-decoration:none;
          transition:background .2s,border-color .2s,color .2s,transform .2s;}
        .tm-card__social-btn:hover{
          background:rgba(var(--rgb),.12);border-color:rgba(var(--rgb),.25);
          color:var(--accent);transform:scale(1.12)translateY(-2px);}

        /* Bar */
        .tm-card__bar{position:absolute;bottom:0;left:0;right:0;height:2px;
          background:linear-gradient(90deg,transparent,rgba(var(--rgb),.5),transparent);
          transform:scaleX(0);transition:transform .5s cubic-bezier(.34,1.56,.64,1);}
        .tm-card:hover .tm-card__bar{transform:scaleX(1);}

        @media(prefers-reduced-motion:reduce){
          .tm-card{transition:none!important;animation:none!important;}
        }
      `}</style>
        </section>
    );
};

export default Team;
