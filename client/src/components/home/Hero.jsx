import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Zap, MessageCircle, Lock, Users, Globe, Check } from 'lucide-react';

/* ─── Messages list ─────────────────────────────────────────────────────── */
const MESSAGES = [
  { from: 'Priya', text: 'Hey! Just saw the new update 🔥', time: '10:21', align: 'left', delay: 400 },
  { from: 'You', text: 'Right? The encryption is now AES-256 👌', time: '10:22', align: 'right', delay: 1200 },
  { from: 'Alex', text: 'Joined the team channel. This is fast!', time: '10:23', align: 'left', delay: 2100 },
  { from: 'You', text: 'Welcome aboard Alex! 🎉', time: '10:23', align: 'right', delay: 3000 },
];

/* ─── Animated counter ──────────────────────────────────────────────────── */
function useCounter(target, duration = 2000) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  const t0 = useRef(null);
  useEffect(() => {
    const tick = (ts) => {
      if (!t0.current) t0.current = ts;
      const p = Math.min((ts - t0.current) / duration, 1);
      const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setVal(Math.floor(ease * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val;
}

/* ─── ChatBubble ────────────────────────────────────────────────────────── */
const ChatBubble = ({ from, text, time, align, visible }) => {
  const isRight = align === 'right';
  const colors = { Priya: '#3b82f6', Alex: '#10b981', You: '#8b5cf6' };
  const c = colors[from] || '#3b82f6';

  return (
    <div className={`hb hb--${align} ${visible ? 'hb--vis' : ''}`}>
      {!isRight && (
        <div className="hb__av" style={{ background: `${c}22`, borderColor: c, color: c }}>
          {from[0]}
        </div>
      )}
      <div className="hb__col">
        <div className={`hb__meta ${isRight ? 'hb__meta--r' : ''}`}>
          {!isRight && <span className="hb__name">{from}</span>}
          <span className="hb__time">{time}</span>
          {isRight && <span className="hb__name">You</span>}
        </div>
        <div className={`hb__bubble ${isRight ? 'hb__bubble--r' : ''}`} style={{ '--bc': c }}>
          {text}
          {isRight && (
            <span className="hb__delivered">
              <Check size={9} strokeWidth={3} /><Check size={9} strokeWidth={3} />
            </span>
          )}
        </div>
      </div>
      {isRight && (
        <div className="hb__av" style={{ background: `${c}22`, borderColor: c, color: c }}>
          Y
        </div>
      )}
    </div>
  );
};

/* ─── TypingDots ────────────────────────────────────────────────────────── */
const TypingDots = ({ visible }) => (
  <div className={`htyp ${visible ? 'htyp--vis' : ''}`}>
    <div className="htyp__av" />
    <div className="htyp__bubble">
      <span /><span /><span />
    </div>
  </div>
);

/* ─── Hero ──────────────────────────────────────────────────────────────── */
const Hero = () => {
  const navigate = useNavigate();
  const userCount = useCounter(50241, 2200);

  /* Stagger bubble visibility */
  const [shown, setShown] = useState([]);
  const [typing, setTyping] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  useEffect(() => {
    MESSAGES.forEach((msg, i) => {
      // show typing indicator just before "right" bubble
      if (msg.align === 'left') {
        setTimeout(() => {
          setTyping(true);
          setTimeout(() => {
            setTyping(false);
            setShown(prev => [...prev, i]);
          }, 500);
        }, msg.delay);
      } else {
        setTimeout(() => setShown(prev => [...prev, i]), msg.delay);
      }
    });
  }, []);

  return (
    <section className="hero-s" id="home">
      {/* ── Ambient BG ─────────────────────────────── */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hbg hbg--tl" />
        <div className="hbg hbg--br" />
        <div className="hbg hbg--c" />
        <div className="hbg__grid" />
      </div>

      <div className="hero-wrap">
        {/* ══ LEFT ══════════════════════════════════ */}
        <div className={`hero-l ${mounted ? 'hero-l--vis' : ''}`}>

          {/* Live status pill */}
          <div className="hstat-pill">
            <span className="hstat-pill__dot" />
            <span>Real-time · End-to-end encrypted · Always on</span>
          </div>

          {/* Headline */}
          <h1 className="hero-h1">
            The smarter way<br />
            to <span className="hero-h1__g">chat &amp; connect</span>
          </h1>

          <p className="hero-p">
            Experience lightning-fast messaging with end-to-end security.
            Join millions of users who trust ChatWave for their daily conversations.
          </p>

          {/* CTA */}
          <div className="hero-cta">
            <button className="h-btn h-btn--pri" onClick={() => navigate('/signup')}>
              Get Started <ArrowRight size={17} strokeWidth={2.5} />
            </button>
            <button className="h-btn h-btn--ghost" onClick={() => navigate('/login')}>
              Sign in
            </button>
          </div>

          {/* Avatar strip */}
          <div className="hero-strip">
            <div className="hero-strip__avs">
              {[
                { l: 'A', c: '#3b82f6' },
                { l: 'K', c: '#8b5cf6' },
                { l: 'R', c: '#10b981' },
              ].map(({ l, c }, i) => (
                <div key={i} className="hero-strip__av"
                  style={{ background: `${c}22`, borderColor: c, color: c }}>
                  {l}
                </div>
              ))}
              <div className="hero-strip__plus">+2k</div>
            </div>
            <p className="hero-strip__txt">Joined this week</p>
          </div>

          {/* Feature chips */}
          <div className="hero-chips">
            {[
              { icon: Shield, label: 'AES-256 Encrypted', c: '#10b981' },
              { icon: Zap, label: '99.9% Uptime', c: '#f59e0b' },
              { icon: Globe, label: '150+ Countries', c: '#3b82f6' },
            ].map(({ icon: Icon, label, c }, i) => (
              <div key={i} className="hero-chip" style={{ '--cc': c }}>
                <Icon size={13} strokeWidth={2} style={{ color: c }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT — Chat mockup ═══════════════════ */}
        <div className={`hero-r ${mounted ? 'hero-r--vis' : ''}`}>
          {/* Outer glow ring */}
          <div className="hring" aria-hidden="true" />
          <div className="hring hring--2" aria-hidden="true" />

          {/* Chat card */}
          <div className="hchat">
            {/* Chrome bar */}
            <div className="hchat__bar">
              <div className="hchat__dots">
                <span style={{ background: '#ff5f57' }} />
                <span style={{ background: '#febc2e' }} />
                <span style={{ background: '#28c840' }} />
              </div>
              <div className="hchat__title">
                <MessageCircle size={13} strokeWidth={2} />
                <span>ChatWave</span>
              </div>
              <div className="hchat__live">
                <span className="hchat__livdot" /> Live
              </div>
            </div>

            {/* Scrollable messages */}
            <div className="hchat__msgs">
              {MESSAGES.map((m, i) => (
                <ChatBubble key={i} {...m} visible={shown.includes(i)} />
              ))}
              <TypingDots visible={typing} />
            </div>

            {/* Input row */}
            <div className="hchat__input-row">
              <div className="hchat__field">Type a message…</div>
              <button className="hchat__send">
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Floating stat — top right */}
          <div className="hfloat hfloat--tr">
            <div className="hfloat__icon" style={{ background: 'rgba(59,130,246,.15)', color: '#60a5fa' }}>
              <Users size={18} strokeWidth={2} />
            </div>
            <div>
              <div className="hfloat__val">{userCount.toLocaleString()}+</div>
              <div className="hfloat__lbl">Active users</div>
            </div>
          </div>

          {/* Floating stat — bottom left */}
          <div className="hfloat hfloat--bl">
            <div className="hfloat__icon" style={{ background: 'rgba(16,185,129,.15)', color: '#34d399' }}>
              <Lock size={18} strokeWidth={2} />
            </div>
            <div>
              <div className="hfloat__val">AES-256</div>
              <div className="hfloat__lbl">Encryption</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hscroll">
        <div className="hscroll__line" />
        <span>Scroll</span>
      </div>

      {/* ══ All CSS ══════════════════════════════════════════════════════ */}
      <style>{`
        /* ─ Section ─────────────────────────────────────────────────── */
        .hero-s {
          position: relative; min-height: 100svh;
          display: flex; flex-direction: column; justify-content: center;
          overflow: hidden; background: #030014;
          padding: 7rem 1.5rem 5rem;
        }

        /* ─ BG ──────────────────────────────────────────────────────── */
        .hero-bg { position: absolute; inset: 0; pointer-events: none; }
        .hbg {
          position: absolute; border-radius: 50%;
          filter: blur(110px); will-change: opacity;
          animation: hOrbPulse 9s ease-in-out infinite alternate;
        }
        .hbg--tl { top:-20%; left:-14%; width:55%; aspect-ratio:1; background:rgba(59,130,246,.13); }
        .hbg--br { bottom:-20%; right:-14%; width:50%; aspect-ratio:1; background:rgba(139,92,246,.13); animation-delay:3s; }
        .hbg--c  { top:35%; left:38%; width:32%; aspect-ratio:1; background:rgba(6,182,212,.07); animation-delay:6s; }
        @keyframes hOrbPulse {
          from { opacity:.6; transform:scale(1); }
          to   { opacity:1;  transform:scale(1.18); }
        }
        .hbg__grid {
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
        }

        /* ─ Layout ──────────────────────────────────────────────────── */
        .hero-wrap {
          max-width: 1200px; margin: 0 auto; width: 100%;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 3.5rem; align-items: center; position: relative; z-index: 10;
        }
        @media(max-width:960px){
          .hero-wrap{grid-template-columns:1fr;gap:2.5rem;}
          .hero-r{order:-1;}
        }

        /* ─ Left col ────────────────────────────────────────────────── */
        .hero-l {
          display:flex; flex-direction:column; gap:0;
          opacity:0; transform:translateX(-28px);
          transition:opacity .9s ease, transform .9s cubic-bezier(.34,1.56,.64,1);
        }
        .hero-l--vis { opacity:1; transform:none; }

        .hstat-pill {
          display:inline-flex; align-items:center; gap:.5rem;
          padding:.35rem 1rem; border-radius:999px;
          background:rgba(16,185,129,.08); border:1px solid rgba(16,185,129,.22);
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:.7rem; font-weight:700; color:#34d399;
          margin-bottom:1.75rem; align-self:flex-start;
        }
        .hstat-pill__dot {
          width:7px; height:7px; border-radius:50%; background:#10b981;
          animation:hBlink 1.8s ease-in-out infinite;
        }
        @keyframes hBlink {
          0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.7)}
          50%{box-shadow:0 0 0 6px rgba(16,185,129,0)}
        }

        .hero-h1 {
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:clamp(2.4rem,5vw,3.9rem);
          font-weight:800; color:#fff; letter-spacing:-.04em;
          line-height:1.1; margin:0 0 1.2rem;
        }
        .hero-h1__g {
          background:linear-gradient(130deg,#3b82f6 0%,#8b5cf6 50%,#06b6d4 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .hero-p {
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:1.02rem; font-weight:500; color:#64748b;
          line-height:1.8; max-width:480px; margin:0 0 2rem;
        }

        /* CTA */
        .hero-cta { display:flex; flex-wrap:wrap; gap:.85rem; align-items:center; margin-bottom:1.75rem; }
        .h-btn {
          display:inline-flex; align-items:center; gap:.5rem;
          padding:.85rem 1.75rem; border-radius:999px;
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:.9rem; font-weight:800; cursor:pointer; border:none;
          transition:transform .22s,box-shadow .22s,opacity .22s; letter-spacing:.01em;
        }
        .h-btn--pri {
          background:linear-gradient(135deg,#3b82f6,#6366f1); color:#fff;
          box-shadow:0 8px 28px rgba(59,130,246,.38);
        }
        .h-btn--pri:hover { transform:translateY(-3px) scale(1.03); box-shadow:0 14px 36px rgba(59,130,246,.55); }
        .h-btn--pri:active { transform:scale(.96); }
        .h-btn--ghost {
          background:rgba(255,255,255,.06); color:#94a3b8;
          border:1px solid rgba(255,255,255,.12);
        }
        .h-btn--ghost:hover { background:rgba(255,255,255,.11); color:#fff; transform:translateY(-2px); }

        /* Avatar strip */
        .hero-strip { display:flex; align-items:center; gap:.75rem; margin-bottom:1.5rem; }
        .hero-strip__avs { display:flex; align-items:center; gap:6px; }
        .hero-strip__av {
          width:36px; height:36px; border-radius:50%;
          border:2px solid; flex-shrink:0;
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:.85rem; font-weight:800;
          display:flex; align-items:center; justify-content:center;
          transition:transform .2s,box-shadow .2s;
          cursor:default;
        }
        .hero-strip__av:hover { transform:scale(1.15) translateY(-3px); box-shadow:0 6px 18px rgba(0,0,0,.4); }
        .hero-strip__plus {
          width:36px; height:36px; border-radius:50%; flex-shrink:0;
          background:linear-gradient(135deg,#3b82f6,#6366f1);
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:.7rem; font-weight:800; color:#fff;
          display:flex; align-items:center; justify-content:center;
          border:2px solid #030014;
        }
        .hero-strip__txt {
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:.8rem; font-weight:600; color:#475569;
        }

        /* Chips */
        .hero-chips { display:flex; flex-wrap:wrap; gap:.5rem; }
        .hero-chip {
          display:inline-flex; align-items:center; gap:.4rem;
          padding:.3rem .75rem; border-radius:999px;
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:.7rem; font-weight:700; color:#64748b;
          transition:background .2s, border-color .2s, color .2s, box-shadow .2s;
          cursor:default;
        }
        .hero-chip:hover {
          background:rgba(var(--cc),.08);
          border-color:rgba(255,255,255,.16);
          color:#94a3b8;
          box-shadow:0 0 16px rgba(0,0,0,.3);
        }

        /* ─ Right col ───────────────────────────────────────────────── */
        .hero-r {
          position:relative;
          opacity:0; transform:translateX(28px) scale(.97);
          transition:opacity 1s ease .15s, transform 1s cubic-bezier(.34,1.56,.64,1) .15s;
        }
        .hero-r--vis { opacity:1; transform:none; }

        /* Glow rings */
        .hring {
          position:absolute; inset:-24px; border-radius:2.4rem;
          background:linear-gradient(135deg,rgba(59,130,246,.18),rgba(139,92,246,.14));
          filter:blur(32px); pointer-events:none;
          animation:hRingPulse 5s ease-in-out infinite alternate;
        }
        .hring--2 {
          inset:-8px;
          background:linear-gradient(225deg,rgba(6,182,212,.1),rgba(139,92,246,.1));
          filter:blur(16px);
          animation-delay:2.5s;
        }
        @keyframes hRingPulse {
          from{opacity:.7} to{opacity:1}
        }

        /* ─ Chat window ─────────────────────────────────────────────── */
        .hchat {
          position:relative; border-radius:1.6rem;
          background:rgba(15,18,40,.85);
          border:1px solid rgba(255,255,255,.1);
          overflow:hidden;
          box-shadow:
            0 32px 90px rgba(0,0,0,.65),
            inset 0 1px 0 rgba(255,255,255,.08),
            0 0 0 1px rgba(59,130,246,.07);
          backdrop-filter:blur(24px);
          transition:box-shadow .4s,border-color .4s;
        }
        .hchat:hover {
          border-color:rgba(59,130,246,.25);
          box-shadow:
            0 40px 110px rgba(0,0,0,.7),
            inset 0 1px 0 rgba(255,255,255,.1),
            0 0 60px rgba(59,130,246,.08);
        }

        /* Chrome bar */
        .hchat__bar {
          display:flex; align-items:center; gap:1rem;
          padding:.9rem 1.25rem;
          background:rgba(255,255,255,.03);
          border-bottom:1px solid rgba(255,255,255,.07);
        }
        .hchat__dots { display:flex; gap:.4rem; }
        .hchat__dots span { width:11px; height:11px; border-radius:50%; display:block; }
        .hchat__title {
          display:flex; align-items:center; gap:.45rem; flex:1; justify-content:center;
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:.82rem; font-weight:700; color:#94a3b8;
        }
        .hchat__live {
          display:flex; align-items:center; gap:.35rem;
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:.65rem; font-weight:700; color:#10b981;
        }
        .hchat__livdot {
          width:7px; height:7px; border-radius:50%;
          background:#10b981; display:block;
          animation:hBlink 1.8s ease-in-out infinite;
        }

        /* Messages area */
        .hchat__msgs {
          padding:1.4rem 1.25rem 1rem;
          display:flex; flex-direction:column; gap:.9rem;
          min-height:260px;
        }

        /* Input row */
        .hchat__input-row {
          display:flex; align-items:center; gap:.65rem;
          padding:.9rem 1.25rem;
          border-top:1px solid rgba(255,255,255,.06);
          background:rgba(255,255,255,.015);
        }
        .hchat__field {
          flex:1; padding:.52rem 1rem; border-radius:999px;
          background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.09);
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:.78rem; color:#334155;
        }
        .hchat__send {
          width:34px; height:34px; border-radius:50%; flex-shrink:0;
          background:linear-gradient(135deg,#3b82f6,#6366f1);
          color:#fff; border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:transform .22s, box-shadow .22s;
          box-shadow:0 4px 14px rgba(59,130,246,.4);
        }
        .hchat__send:hover { transform:scale(1.12); box-shadow:0 6px 20px rgba(59,130,246,.6); }

        /* ─ Chat bubble ─────────────────────────────────────────────── */
        .hb {
          display:flex; align-items:flex-start; gap:.55rem;
          opacity:0; transform:translateY(14px) scale(.97);
          transition:opacity .45s cubic-bezier(.34,1.56,.64,1),
                      transform .45s cubic-bezier(.34,1.56,.64,1);
        }
        .hb--vis { opacity:1; transform:none; }
        .hb--right { flex-direction:row-reverse; }

        .hb__av {
          width:30px; height:30px; border-radius:50%; flex-shrink:0;
          border:1.5px solid;
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:.78rem; font-weight:800;
          display:flex; align-items:center; justify-content:center;
        }
        .hb__col { display:flex; flex-direction:column; gap:.2rem; max-width:75%; }
        .hb__meta {
          display:flex; align-items:center; gap:.4rem;
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
        }
        .hb__meta--r { flex-direction:row-reverse; }
        .hb__name { font-size:.65rem; font-weight:800; color:#94a3b8; }
        .hb__time { font-size:.6rem; font-weight:500; color:#334155; }

        .hb__bubble {
          padding:.55rem .95rem;
          border-radius:1.1rem 1.1rem 1.1rem .3rem;
          background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.08);
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:.82rem; font-weight:500; color:#cbd5e1; line-height:1.55;
          position:relative;
          transition:
            background .25s, box-shadow .25s, border-color .25s,
            transform .22s cubic-bezier(.34,1.56,.64,1),
            filter .25s;
          cursor:default;
        }
        /* Hover: extra blurry glow */
        .hb__bubble:hover {
          background:rgba(var(--bc,59,130,246),.14);
          border-color:rgba(var(--bc,59,130,246),.3);
          box-shadow:0 0 24px rgba(var(--bc,59,130,246),.22),
                     0 8px 32px rgba(0,0,0,.4);
          transform:scale(1.025) translateY(-1px);
          filter:brightness(1.08);
        }
        .hb__bubble--r {
          border-radius:1.1rem 1.1rem .3rem 1.1rem;
          background:rgba(99,102,241,.16);
          border-color:rgba(99,102,241,.25);
          color:#c7d2fe;
        }
        .hb__bubble--r:hover {
          background:rgba(99,102,241,.26);
          border-color:rgba(139,92,246,.45);
          box-shadow:0 0 28px rgba(139,92,246,.3), 0 8px 32px rgba(0,0,0,.4);
        }
        .hb__delivered {
          display:inline-flex; gap:1px; margin-left:.35rem;
          color:#60a5fa; vertical-align:middle;
        }

        /* ─ Typing indicator ────────────────────────────────────────── */
        .htyp {
          display:flex; align-items:center; gap:.5rem;
          opacity:0; transform:translateY(10px);
          transition:opacity .35s ease, transform .35s ease;
        }
        .htyp--vis { opacity:1; transform:none; }
        .htyp__av {
          width:30px; height:30px; border-radius:50%;
          background:rgba(59,130,246,.15); border:1.5px solid rgba(59,130,246,.3);
          flex-shrink:0;
        }
        .htyp__bubble {
          display:flex; align-items:center; gap:4px;
          padding:.55rem .85rem; border-radius:1.1rem 1.1rem 1.1rem .3rem;
          background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08);
        }
        .htyp__bubble span {
          width:6px; height:6px; border-radius:50%; background:#475569;
          animation:tDot 1.2s ease-in-out infinite;
        }
        .htyp__bubble span:nth-child(2){animation-delay:.2s;}
        .htyp__bubble span:nth-child(3){animation-delay:.4s;}
        @keyframes tDot {
          0%,80%,100%{transform:scale(.75);opacity:.4}
          40%{transform:scale(1.1);opacity:1}
        }

        /* ─ Floating stat cards ─────────────────────────────────────── */
        .hfloat {
          position:absolute;
          display:flex; align-items:center; gap:.7rem;
          padding:.75rem 1.1rem; border-radius:1.1rem;
          background:rgba(12,15,38,.85);
          border:1px solid rgba(255,255,255,.1);
          backdrop-filter:blur(18px);
          box-shadow:0 10px 40px rgba(0,0,0,.5);
          transition:
            transform .3s cubic-bezier(.34,1.56,.64,1),
            box-shadow .3s,
            border-color .3s,
            filter .3s;
          cursor:default;
        }
        .hfloat:hover {
          transform:translateY(-6px) scale(1.04)!important;
          box-shadow:0 20px 60px rgba(0,0,0,.6),
                     0 0 30px rgba(59,130,246,.18);
          border-color:rgba(59,130,246,.3);
          filter:brightness(1.1);
        }
        .hfloat--tr {
          top:-14px; right:-14px;
          animation:hFloat 5s ease-in-out infinite alternate;
        }
        .hfloat--bl {
          bottom:-14px; left:-14px;
          animation:hFloat 6s ease-in-out 1s infinite alternate-reverse;
        }
        @keyframes hFloat {
          from{transform:translateY(0);}
          to{transform:translateY(-10px);}
        }
        .hfloat__icon {
          width:38px; height:38px; border-radius:11px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
        }
        .hfloat__val {
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:1rem; font-weight:800; color:#fff; line-height:1;
        }
        .hfloat__lbl {
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:.62rem; font-weight:600; color:#64748b; margin-top:.1rem;
        }

        /* ─ Scroll indicator ────────────────────────────────────────── */
        .hscroll {
          position:absolute; bottom:2rem; left:50%; translate:-50% 0;
          display:flex; flex-direction:column; align-items:center; gap:.5rem;
          animation:hScrollBob 2.2s ease-in-out infinite;
          z-index:10;
        }
        @keyframes hScrollBob {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)}
        }
        .hscroll__line {
          width:1px; height:40px;
          background:linear-gradient(to bottom,transparent,rgba(255,255,255,.15),transparent);
        }
        .hscroll span {
          font-family:'Space Grotesk','Inter',system-ui,sans-serif;
          font-size:.6rem; font-weight:700; letter-spacing:.3em;
          text-transform:uppercase; color:rgba(255,255,255,.2);
        }

        @media(prefers-reduced-motion:reduce){
          .hbg,.hring,.hfloat,.hscroll,.hb,.htyp,.hstat-pill__dot,.hchat__livdot{
            animation:none!important; transition:none!important;
          }
          .hero-l,.hero-r{opacity:1!important;transform:none!important;}
          .hb{opacity:1!important;transform:none!important;}
        }
      `}</style>
    </section>
  );
};

export default Hero;
