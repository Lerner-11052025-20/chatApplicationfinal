import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifiedBadge = ({ size = 16, className = "" }) => {
    return (
        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center justify-center text-blue-400 bg-blue-500/10 rounded-full p-0.5 border border-blue-500/20 ${className}`}
            title="Verified User"
        >
            <ShieldCheck size={size} fill="currentColor" fillOpacity={0.2} />
        </motion.div>
    );
};

export default VerifiedBadge;
