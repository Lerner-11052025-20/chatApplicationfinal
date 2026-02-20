import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft, MessageCircle } from "lucide-react";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        axios.post("http://localhost:3334/api/forgotpassword", { email })
            .then(() => setSuccess(true))
            .catch(err => setError(err.response?.data?.message || "Something went wrong"))
            .finally(() => setLoading(false));
    };

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-50 -z-10" />
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                {/* Auth Card */}
                <div className="glass p-8 lg:p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 rounded-[2rem] bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mx-auto mb-6"
                        >
                            <Mail size={28} className="text-white fill-white/20" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white mb-2">Trouble logging in?</h1>
                        <p className="text-gray-500 text-sm">Enter your email and we'll send you a link to reset your password.</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                    <AlertCircle size={14} />
                                    <span>{error}</span>
                                </div>
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                                    <CheckCircle2 size={14} />
                                    <span>Reset link sent! Check your email.</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 ml-4">Email Address</label>
                            <div className="relative group/input">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-blue-400 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white/10 transition-all text-sm text-white placeholder:text-gray-600"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Send Reset Link'}
                        </motion.button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                </div>

                <p className="text-center text-gray-600 text-xs mt-8 tracking-widest uppercase font-bold">
                    ChatWave · Secured Connection
                </p>
            </motion.div>
        </div>
    );
}

export default ForgotPassword;
