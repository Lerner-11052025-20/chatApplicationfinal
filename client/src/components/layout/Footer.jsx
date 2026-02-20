import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Github, Twitter, Linkedin, Mail, ArrowUp, Shield, Zap, ArrowRight, Check } from 'lucide-react';

/* ─── Data ──────────────────────────────────────────────────────────────── */
const LINK_COLS = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Security', href: '#features' },
      { name: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'FAQ', href: '#faq' },
      { name: 'Status', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '#team' },
      { name: 'Team', href: '#team' },
      { name: 'Testimonials', href: '#testimonials' },
      { name: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'GDPR', href: '#' },
    ],
  },
];

const SOCIALS = [
  { icon: Github, href: '#', label: 'GitHub', c: '#fff' },
  { icon: Twitter, href: '#', label: 'Twitter', c: '#1d9bf0' },
  { icon: Linkedin, href: '#', label: 'LinkedIn', c: '#0a66c2' },
  { icon: Mail, href: '#', label: 'Email', c: '#06b6d4' },
];

const TRUST = [
  { icon: Shield, label: 'GDPR Compliant' },
  { icon: Zap, label: '99.9% Uptime' },
];

/* ─── Smooth scroll util ────────────────────────────────────────────────── */
function scrollTo(href) {
  if (!href.startsWith('#')) return;
  const el = document.querySelector(href);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ─── Footer ────────────────────────────────────────────────────────────── */
const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setEmail('');
  };

  return (
    <footer className="ft">
      {/* Ambient glows */}
      <div className="ft-bg" aria-hidden="true">
        <div className="ft-bg__tl" />
        <div className="ft-bg__br" />
        <div className="ft-bg__grid" />
      </div>

      <div className="ft-inner">
        {/* ── TOP SECTION ── */}
        <div className="ft-top">
          {/* Brand col */}
          <div className="ft-brand">
            <button className="ft-logo" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <div className="ft-logo__icon">
                <MessageCircle size={22} strokeWidth={2} style={{ color: '#fff' }} />
              </div>
              <span className="ft-logo__name">
                ChatWave<span style={{ color: '#3b82f6' }}>.</span>
              </span>
            </button>

            <p className="ft-brand__desc">
              Secure, real-time messaging for teams and individuals worldwide.
              Encrypted end-to-end by default, always.
            </p>

            {/* Trust badges */}
            <div className="ft-trust">
              {TRUST.map(({ icon: Icon, label }, i) => (
                <div key={i} className="ft-trust__item">
                  <Icon size={12} strokeWidth={2} />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="ft-socials">
              {SOCIALS.map(({ icon: Icon, href, label, c }, i) => (
                <a
                  key={i}
                  href={href}
                  className="ft-social"
                  style={{ '--sc': c }}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon size={17} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="ft-links">
            {LINK_COLS.map((col, ci) => (
              <div key={ci} className="ft-col">
                <h4 className="ft-col__title">{col.title}</h4>
                <ul className="ft-col__list">
                  {col.links.map((l, li) => (
                    <li key={li}>
                      <a
                        href={l.href}
                        className="ft-link"
                        onClick={e => { e.preventDefault(); scrollTo(l.href); }}
                      >
                        {l.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── NEWSLETTER ── */}
        <div className="ft-news">
          <div className="ft-news__copy">
            <h3 className="ft-news__title">Stay in the loop</h3>
            <p className="ft-news__sub">Get product updates, security tips, and ChatWave news.</p>
          </div>
          <form className="ft-news__form" onSubmit={handleSubscribe}>
            <input
              type="email"
              className="ft-news__input"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" className={`ft-news__btn ${sent ? 'ft-news__btn--sent' : ''}`}>
              {sent ? <Check size={16} strokeWidth={2.5} /> : <ArrowRight size={16} strokeWidth={2.5} />}
              <span>{sent ? 'Subscribed!' : 'Subscribe'}</span>
            </button>
          </form>
        </div>

        {/* ── DIVIDER ── */}
        <div className="ft-divider" />

        {/* ── BOTTOM BAR ── */}
        <div className="ft-bottom">
          <span className="ft-copyright">
            © {year} ChatWave, Inc. — Built with ❤️ for secure communication.
          </span>

          <div className="ft-bottom__right">
            <nav className="ft-legal">
              <a href="#" className="ft-legal__link">Privacy</a>
              <a href="#" className="ft-legal__link">Terms</a>
              <a href="#" className="ft-legal__link">Cookies</a>
            </nav>

            <button
              className="ft-totop"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll to top"
            >
              <ArrowUp size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ── BIG WORDMARK ── */}
        <div className="ft-wordmark" aria-hidden="true">CHATWAVE</div>
      </div>

      <style>{`
        /* ── Shell ─────────────────────────────────────────────────── */
        .ft {
          position: relative;
          background: #030014;
          overflow: hidden;
          padding-top: 5rem;
        }
        .ft-bg { position: absolute; inset: 0; pointer-events: none; }
        .ft-bg__tl {
          position: absolute; top: 0; left: 25%;
          width: 500px; height: 500px; border-radius: 50%;
          background: rgba(59,130,246,.05); filter: blur(120px);
          transform: translateY(-50%);
        }
        .ft-bg__br {
          position: absolute; bottom: 0; right: 25%;
          width: 500px; height: 500px; border-radius: 50%;
          background: rgba(139,92,246,.05); filter: blur(120px);
          transform: translateY(50%);
        }
        .ft-bg__grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
        }

        .ft-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 1.5rem;
          position: relative; z-index: 10;
        }

        /* ── Top: brand + links ─────────────────────────────────────── */
        .ft-top {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 4rem;
          padding-bottom: 3.5rem;
        }
        @media(max-width:960px){.ft-top{grid-template-columns:1fr;gap:2.5rem;}}

        /* Brand */
        .ft-brand { display: flex; flex-direction: column; gap: 0; }
        .ft-logo {
          display: inline-flex; align-items: center; gap: .75rem;
          cursor: pointer; background: none; border: none; margin-bottom: 1.25rem;
          align-self: flex-start;
          transition: opacity .2s;
        }
        .ft-logo:hover { opacity: .8; }
        .ft-logo__icon {
          width: 44px; height: 44px; border-radius: 13px;
          background: linear-gradient(135deg,#3b82f6,#6366f1);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 20px rgba(59,130,246,.35);
          transition: transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .ft-logo:hover .ft-logo__icon { transform: rotate(8deg) scale(1.05); }
        .ft-logo__name {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: 1.5rem; font-weight: 800; color: #fff; letter-spacing: -.02em;
        }
        .ft-brand__desc {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .85rem; font-weight: 500; color: #475569;
          line-height: 1.75; margin: 0 0 1.1rem;
        }
        .ft-trust {
          display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1.3rem;
        }
        .ft-trust__item {
          display: inline-flex; align-items: center; gap: .35rem;
          padding: .25rem .65rem; border-radius: 999px;
          background: rgba(16,185,129,.06); border: 1px solid rgba(16,185,129,.15);
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .62rem; font-weight: 700; color: #34d399; letter-spacing: .06em;
        }
        .ft-socials { display: flex; gap: .5rem; }
        .ft-social {
          width: 38px; height: 38px; border-radius: 11px;
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
          color: #64748b; display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          transition: background .2s, border-color .2s, color .2s, transform .2s;
        }
        .ft-social:hover {
          background: rgba(255,255,255,.09); color: var(--sc);
          border-color: rgba(255,255,255,.14); transform: translateY(-3px);
        }

        /* Link columns */
        .ft-links {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 2rem;
        }
        @media(max-width:720px){.ft-links{grid-template-columns:repeat(2,1fr);}}

        .ft-col__title {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .65rem; font-weight: 800; letter-spacing: .18em;
          text-transform: uppercase; color: #06b6d4;
          margin-bottom: 1.2rem;
        }
        .ft-col__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .7rem; }
        .ft-link {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .82rem; font-weight: 600; color: #475569;
          text-decoration: none; position: relative;
          transition: color .2s;
        }
        .ft-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0;
          width: 0; height: 1px; background: #3b82f6;
          transition: width .3s ease;
        }
        .ft-link:hover { color: #fff; }
        .ft-link:hover::after { width: 100%; }

        /* ── Newsletter ─────────────────────────────────────────────── */
        .ft-news {
          display: flex; flex-wrap: wrap; align-items: center;
          justify-content: space-between; gap: 1.5rem;
          padding: 2rem 2.25rem;
          border-radius: 1.4rem;
          background: rgba(255,255,255,.025);
          border: 1px solid rgba(255,255,255,.07);
          margin-bottom: 3rem;
        }
        .ft-news__title {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: 1.05rem; font-weight: 800; color: #fff; margin: 0 0 .2rem;
        }
        .ft-news__sub {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .8rem; font-weight: 500; color: #64748b; margin: 0;
        }
        .ft-news__form {
          display: flex; gap: .5rem; flex: 1; max-width: 400px;
        }
        .ft-news__input {
          flex: 1;
          padding: .65rem 1rem;
          border-radius: 999px;
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .82rem; color: #fff;
          outline: none;
          transition: border-color .2s;
        }
        .ft-news__input::placeholder { color: #334155; }
        .ft-news__input:focus { border-color: rgba(59,130,246,.4); }
        .ft-news__btn {
          display: inline-flex; align-items: center; gap: .4rem;
          padding: .65rem 1.25rem;
          border-radius: 999px;
          background: linear-gradient(135deg,#3b82f6,#6366f1);
          color: #fff; border: none; cursor: pointer;
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .8rem; font-weight: 700;
          transition: transform .2s, box-shadow .2s, background .3s;
          box-shadow: 0 4px 16px rgba(59,130,246,.3);
          white-space: nowrap;
        }
        .ft-news__btn:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(59,130,246,.45); }
        .ft-news__btn--sent { background: linear-gradient(135deg,#10b981,#059669); }

        /* ── Divider ────────────────────────────────────────────────── */
        .ft-divider {
          height: 1px;
          background: rgba(255,255,255,.06);
          margin-bottom: 2rem;
        }

        /* ── Bottom ─────────────────────────────────────────────────── */
        .ft-bottom {
          display: flex; flex-wrap: wrap; align-items: center;
          justify-content: space-between; gap: 1rem;
          padding-bottom: 1.5rem;
        }
        .ft-copyright {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .75rem; font-weight: 600; color: #334155;
        }
        .ft-bottom__right { display: flex; align-items: center; gap: 1.5rem; }
        .ft-legal { display: flex; gap: 1rem; }
        .ft-legal__link {
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: .72rem; font-weight: 600; color: #334155;
          text-decoration: none;
          transition: color .2s;
        }
        .ft-legal__link:hover { color: #94a3b8; }
        .ft-totop {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09);
          color: #64748b; display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background .2s, color .2s, transform .2s;
        }
        .ft-totop:hover { background: rgba(59,130,246,.12); color: #60a5fa; transform: translateY(-3px); }

        /* ── Wordmark ───────────────────────────────────────────────── */
        .ft-wordmark {
          text-align: center;
          font-family: 'Space Grotesk','Inter',system-ui,sans-serif;
          font-size: clamp(4rem,14vw,13rem);
          font-weight: 900;
          color: rgba(24, 27, 93, 1);
          letter-spacing: -.04em;
          line-height: 1;
          user-select: none;
          pointer-events: none;
          margin-top: .5rem;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
