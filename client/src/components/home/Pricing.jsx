import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Crown, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
    const [isYearly, setIsYearly] = useState(false);
    const navigate = useNavigate();

    const plans = [
        {
            name: 'Lite',
            tier: 'Level_01',
            icon: Zap,
            color: 'var(--primary)',
            price: { monthly: 0, yearly: 0 },
            description: 'Essential infrastructure for solo operatives.',
            features: [
                '1k Encrypted Packets/day',
                'P2P Node Access',
                'Level 1 Integrity',
                'Standard Latency',
                '1GB Core Storage'
            ],
            cta: 'Initialize',
            popular: false
        },
        {
            name: 'Elite',
            tier: 'Level_02',
            icon: Crown,
            color: 'var(--primary)',
            price: { monthly: 12, yearly: 120 },
            description: 'Advanced protocols for tactical team coordination.',
            features: [
                'Unlimited Packets',
                'Hyper-Sync Enabled',
                'Multi-Node Mesh',
                'Priority Latency',
                '100GB Core Storage',
                'Messenger Hooks',
                'Dossier Analytics'
            ],
            cta: 'Sign Up Now',
            popular: true
        },
        {
            name: 'Super',
            tier: 'Level_03',
            icon: Rocket,
            color: 'var(--primary)',
            price: { monthly: 49, yearly: 490 },
            description: 'Industrial-grade security for large networks.',
            features: [
                'Tier 3 Infrastructure',
                'Dedicated Neural Core',
                'Zero-Knowledge Sync',
                'Unlimited Capacity',
                'Custom Deployment',
                'SLA Guarantee',
                'Hardware Key Support',
                'Active-Active failover'
            ],
            cta: 'Join Now',
            popular: false
        }
    ];

    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-indigo/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            Subscription . Protocols . V3.0
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]"
                    >
                        Scalable <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-cyan">Infrastructure</span>
                    </motion.h2>

                    <p className="text-gray-500 text-lg font-medium leading-relaxed">
                        Global bandwidth for the next generation of digital architects. Choose your operational tier.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center items-center gap-6 mb-16">
                    <span className={`text-sm font-bold transition-colors ${!isYearly ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
                    <button
                        onClick={() => setIsYearly(!isYearly)}
                        className="w-16 h-8 rounded-full bg-white/5 border border-white/10 relative p-1 transition-all hover:border-brand-blue/50 group"
                    >
                        <motion.div
                            animate={{ x: isYearly ? 32 : 0 }}
                            className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-blue to-brand-indigo shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform"
                        />
                    </button>
                    <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold transition-colors ${isYearly ? 'text-white' : 'text-gray-500'}`}>Yearly</span>
                        <span className="px-2 py-0.5 rounded-md bg-brand-blue/10 border border-brand-blue/20 text-[10px] font-black text-brand-blue uppercase">
                            Save 17%
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => {
                        const Icon = plan.icon;
                        const price = isYearly ? plan.price.yearly : plan.price.monthly;

                        return (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className={`relative group p-8 rounded-[2.5rem] border transition-all duration-500 ${plan.popular
                                    ? 'bg-white/5 border-brand-blue/30 shadow-[0_0_50px_rgba(59,130,246,0.1)]'
                                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-brand-blue text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                                        Tactical Choice
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-8">
                                    <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                        <Icon size={28} className="text-brand-blue" />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{plan.tier}</span>
                                </div>

                                <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                                <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
                                    {plan.description}
                                </p>

                                <div className="mb-8">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black text-white tracking-tighter">${price}</span>
                                        <span className="text-gray-500 text-sm font-bold uppercase tracking-widest">
                                            /{isYearly ? 'Annual' : 'Session'}
                                        </span>
                                    </div>
                                    {isYearly && plan.price.yearly > 0 && (
                                        <p className="text-[10px] font-black text-brand-cyan mt-2 uppercase tracking-widest">Discount applied</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => navigate('/signup')}
                                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 mb-8 ${plan.popular
                                        ? 'bg-gradient-to-r from-brand-blue to-brand-indigo text-white shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-[0.98]'
                                        : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    {plan.cta}
                                </button>

                                <ul className="space-y-4">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                                            <span className="text-sm font-bold text-gray-400">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
