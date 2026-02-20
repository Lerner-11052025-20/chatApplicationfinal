import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus, HelpCircle, MessageCircle, Lock, CreditCard, Users } from 'lucide-react';

const FAQS = [
    { cat: 'Security', icon: Lock, question: 'How secure are my messages on ChatWave?', answer: 'Every message is AES-256 end-to-end encrypted before leaving your device. Our zero-knowledge architecture means even our servers cannot read your messages — only you and your recipient hold the keys.' },
    { cat: 'Security', icon: Lock, question: 'What is 2FA and how do I enable it?', answer: '2FA adds a second layer of protection using a time-based one-time code from your authenticator app. Enable it in Settings → Security → Two-Factor Auth. Backup recovery codes are also provided.' },
    { cat: 'Features', icon: MessageCircle, question: 'Can I share files and media in chats?', answer: 'Yes — share any file type: images, videos, PDFs, documents. Files are encrypted before upload and preview inline within the chat. Drag-and-drop is supported on desktop.' },
    { cat: 'Features', icon: MessageCircle, question: 'How do reactions and threaded replies work?', answer: 'Hover any message to react with emoji or start a thread. Threads keep conversations contextual without cluttering the main chat, and you can always jump back to the original message.' },
    { cat: 'Teams', icon: Users, question: 'Can I create group chats with many members?', answer: 'Yes — unlimited members per group. Assign admin roles, use @mentions, and access a shared media gallery for all files shared in the group. Admins control member permissions at any time.' },
    { cat: 'Teams', icon: Users, question: 'Is ChatWave suitable for enterprise teams?', answer: 'Absolutely. ChatWave offers admin controls, audit logs, dedicated infra, 99.9% uptime SLA, and GDPR-compliant data handling for organizations of any size.' },
    { cat: 'Billing', icon: CreditCard, question: 'Is there a free plan?', answer: 'Yes — a generous free forever plan with unlimited messaging, file sharing up to 5MB, groups of up to 25 members, and base encryption. Upgrade unlocks unlimited file sizes and priority support.' },
    { cat: 'Billing', icon: CreditCard, question: 'Can I cancel my subscription anytime?', answer: 'Yes, cancel anytime with no penalty. Premium features stay active until the end of your billing period, then your account moves to the free plan — no data loss.' },
];

const CATS = ['All', 'Security', 'Features', 'Teams', 'Billing'];
const CAT_COLORS = { Security: '#10b981', Features: '#3b82f6', Teams: '#8b5cf6', Billing: '#f59e0b', All: '#06b6d4' };
const RGB_MAP = { '#10b981': '16,185,129', '#3b82f6': '59,130,246', '#8b5cf6': '139,92,246', '#f59e0b': '245,158,11', '#06b6d4': '6,182,212' };

const AccordionItem = ({ faq, index, isOpen, onToggle }) => {
    const Icon = faq.icon;
    const color = CAT_COLORS[faq.cat] || '#3b82f6';
    const rgb = RGB_MAP[color] || '59,130,246';
    const bodyRef = useRef(null);

    return (
        <div className="faq-item" style={{ '--accent': color, '--rgb': rgb, '--border': isOpen ? `rgba(${rgb},.35)` : 'rgba(255,255,255,.07)', '--bg': isOpen ? `rgba(${rgb},.04)` : 'rgba(255,255,255,.025)' }}>
            <button className="faq-item__btn" onClick={onToggle} aria-expanded={isOpen}>
                <div className="faq-item__left">
                    <span className="faq-item__num">0{index + 1}</span>
                    <div className={`faq-item__icon ${isOpen ? 'faq-item__icon--open' : ''}`}>
                        <Icon size={16} strokeWidth={2} />
                    </div>
                    <span className="faq-item__q">{faq.question}</span>
                </div>
                <div className={`faq-item__toggle ${isOpen ? 'faq-item__toggle--open' : ''}`}>
                    {isOpen ? <Minus size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
                </div>
            </button>
            <div ref={bodyRef} className="faq-item__body" style={{ maxHeight: isOpen ? `${bodyRef.current?.scrollHeight || 300}px` : '0px' }}>
                <p className="faq-item__answer">{faq.answer}</p>
            </div>
        </div>
    );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const [activeCat, setActiveCat] = useState('All');
    const headerRef = useRef(null);
    const [vis, setVis] = useState(false);

    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.2 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const filtered = activeCat === 'All' ? FAQS : FAQS.filter(f => f.cat === activeCat);

    return (
        <section id="faq" className="faq-section">
            <div className="faq-bg" aria-hidden="true" />
            <div className="faq-container">
                <div ref={headerRef} className={`faq-header ${vis ? 'faq-header--vis' : ''}`}>
                    <div className="faq-badge"><HelpCircle size={12} strokeWidth={2.5} style={{ color: '#06b6d4' }} /><span>Frequently Asked</span></div>
                    <h2 className="faq-title">Got <span className="faq-gradient">questions?</span> We have answers.</h2>
                    <p className="faq-subtitle">Everything you need to know about ChatWave. Can't find your answer? <a href="#contact" className="faq-link">Reach out to us.</a></p>
                </div>

                <div className="faq-tabs">
                    {CATS.map(cat => (
                        <button key={cat} className={`faq-tab ${activeCat === cat ? 'faq-tab--active' : ''}`}
                            style={{ '--tc': CAT_COLORS[cat] }} onClick={() => { setActiveCat(cat); setOpenIndex(-1); }}>
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="faq-list">
                    {filtered.map((faq, i) => (
                        <AccordionItem key={`${activeCat}-${i}`} faq={faq} index={i} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
                    ))}
                </div>
            </div>

            <style>{`
        .faq-section{position:relative;padding:7rem 1.5rem;background:#030014;overflow:hidden;}
        .faq-bg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 70% 50% at 80% 20%,rgba(6,182,212,.09) 0%,transparent 55%),radial-gradient(ellipse 60% 40% at 10% 80%,rgba(59,130,246,.09) 0%,transparent 55%);}
        .faq-container{max-width:820px;margin:0 auto;position:relative;z-index:10;}
        .faq-header{text-align:center;margin-bottom:3rem;opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease;}
        .faq-header--vis{opacity:1;transform:none;}
        .faq-badge{display:inline-flex;align-items:center;gap:.45rem;padding:.3rem .9rem;border-radius:999px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);font-size:.68rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#94a3b8;margin-bottom:1.4rem;font-family:'Space Grotesk','Inter',system-ui,sans-serif;}
        .faq-title{font-family:'Space Grotesk','Inter',system-ui,sans-serif;font-size:clamp(2rem,4.5vw,3.2rem);font-weight:800;color:#fff;letter-spacing:-.03em;line-height:1.15;margin-bottom:1rem;}
        .faq-gradient{background:linear-gradient(130deg,#06b6d4 0%,#3b82f6 60%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .faq-subtitle{font-family:'Space Grotesk','Inter',system-ui,sans-serif;font-size:.95rem;font-weight:500;color:#64748b;line-height:1.7;margin:0;}
        .faq-link{color:#3b82f6;text-decoration:none;font-weight:600;}
        .faq-link:hover{text-decoration:underline;}
        .faq-tabs{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;margin-bottom:2.5rem;}
        .faq-tab{padding:.38rem .9rem;border-radius:999px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);font-family:'Space Grotesk','Inter',system-ui,sans-serif;font-size:.72rem;font-weight:700;letter-spacing:.08em;color:#64748b;cursor:pointer;transition:background .2s,border-color .2s,color .2s;}
        .faq-tab:hover{background:rgba(255,255,255,.08);color:#94a3b8;}
        .faq-tab--active{background:rgba(255,255,255,.08);border-color:var(--tc);color:var(--tc);}
        .faq-list{display:flex;flex-direction:column;gap:.7rem;}
        .faq-item{border-radius:1.1rem;background:var(--bg);border:1px solid var(--border);overflow:hidden;transition:background .3s,border-color .3s;}
        .faq-item__btn{width:100%;padding:1.1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;cursor:pointer;background:none;border:none;text-align:left;gap:.75rem;}
        .faq-item__left{display:flex;align-items:center;gap:.75rem;flex:1;min-width:0;}
        .faq-item__num{font-family:'Space Grotesk','Inter',system-ui,sans-serif;font-size:.62rem;font-weight:800;color:#334155;letter-spacing:.08em;flex-shrink:0;width:24px;}
        .faq-item__icon{width:34px;height:34px;border-radius:10px;flex-shrink:0;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#64748b;display:flex;align-items:center;justify-content:center;transition:background .3s,border-color .3s,color .3s;}
        .faq-item__icon--open{background:rgba(var(--rgb),.14);border-color:rgba(var(--rgb),.3);color:var(--accent);}
        .faq-item__q{font-family:'Space Grotesk','Inter',system-ui,sans-serif;font-size:.92rem;font-weight:700;color:#94a3b8;line-height:1.5;transition:color .3s;}
        .faq-item__btn:hover .faq-item__q,.faq-item__icon--open~.faq-item__q{color:#fff;}
        .faq-item__toggle{width:30px;height:30px;border-radius:999px;flex-shrink:0;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#64748b;display:flex;align-items:center;justify-content:center;transition:background .3s,color .3s;}
        .faq-item__toggle--open{background:rgba(var(--rgb),.14);border-color:rgba(var(--rgb),.3);color:var(--accent);}
        .faq-item__body{max-height:0;overflow:hidden;transition:max-height .4s cubic-bezier(.4,0,.2,1);}
        .faq-item__answer{margin:0;padding:.1rem 1.25rem 1.2rem 3.5rem;font-family:'Space Grotesk','Inter',system-ui,sans-serif;font-size:.85rem;font-weight:500;color:#64748b;line-height:1.75;}
        @media(prefers-reduced-motion:reduce){.faq-item,.faq-item__body,.faq-header{transition:none!important;animation:none!important;opacity:1!important;transform:none!important;}}
      `}</style>
        </section>
    );
};

export default FAQ;
