/**
 * Admin Panel Animation Utilities
 * Shared Framer Motion variants, timing configurations, and color constants
 * Used across all admin components for consistent, performant animations
 */

// ────────────────────────────────────────────────────────────────
// ANIMATION TIMING CONFIGURATIONS
// ────────────────────────────────────────────────────────────────

export const ANIMATION_TIMINGS = {
    // Fast interactions (button clicks, hover states)
    FAST: {
        duration: 0.15,
        ease: [0.4, 0, 0.2, 1] // cubic-bezier(0.4, 0, 0.2, 1)
    },
    // Standard animations (transitions, reveals)
    STANDARD: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
    },
    // Slower, more deliberate animations (page load, important reveals)
    SLOW: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
    },
    // Stagger delays for child elements
    STAGGER: 0.05,
    // Background animations (very slow, subtle)
    BG_ANIMATION: {
        duration: 12,
        ease: 'easeInOut'
    }
};

// ────────────────────────────────────────────────────────────────
// FRAMER MOTION VARIANTS - Container & Layout
// ────────────────────────────────────────────────────────────────

export const containerVariants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: ANIMATION_TIMINGS.STAGGER,
            delayChildren: 0
        }
    }
};

export const itemVariants = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: ANIMATION_TIMINGS.STANDARD
    }
};

// Sidebar navigation animation variants
export const sidebarContainerVariants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

export const sidebarItemVariants = {
    hidden: {
        opacity: 0,
        x: -20
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: ANIMATION_TIMINGS.STANDARD
    }
};

// Mobile menu overlay variants
export const mobileOverlayVariants = {
    hidden: {
        opacity: 0,
        backdropFilter: 'blur(0px)'
    },
    visible: {
        opacity: 1,
        backdropFilter: 'blur(4px)',
        transition: ANIMATION_TIMINGS.STANDARD
    },
    exit: {
        opacity: 0,
        backdropFilter: 'blur(0px)',
        transition: ANIMATION_TIMINGS.STANDARD
    }
};

// ────────────────────────────────────────────────────────────────
// FRAMER MOTION VARIANTS - Card & Content
// ────────────────────────────────────────────────────────────────

// Stat card hover animation
export const cardHoverVariants = {
    initial: {
        scale: 1,
        y: 0
    },
    whileHover: {
        scale: 1.02,
        y: -4,
        transition: ANIMATION_TIMINGS.FAST
    },
    whileTap: {
        scale: 0.98,
        y: 0
    }
};

// Glow effect on hover
export const glowVariants = {
    initial: {
        opacity: 0,
        scale: 0.8
    },
    whileHover: {
        opacity: 1,
        scale: 1,
        transition: ANIMATION_TIMINGS.FAST
    }
};

// Trend badge animation
export const trendBadgeVariants = {
    hidden: {
        opacity: 0,
        scale: 0.5
    },
    visible: {
        opacity: 1,
        scale: 1,
        animate: {
            scale: [1, 1.15, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
            }
        }
    }
};

// ────────────────────────────────────────────────────────────────
// FRAMER MOTION VARIANTS - Tabs & Transitions
// ────────────────────────────────────────────────────────────────

// Smooth tab switching with exit animation
export const tabContentVariants = {
    hidden: {
        opacity: 0,
        y: 10
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: ANIMATION_TIMINGS.STANDARD
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: ANIMATION_TIMINGS.FAST
    }
};

// Tab pills animation
export const tabPillVariants = {
    inactive: {
        color: 'rgba(255, 255, 255, 0.5)',
        borderBottomColor: 'transparent'
    },
    active: {
        color: 'rgb(59, 130, 246)',
        borderBottomColor: 'rgb(59, 130, 246)',
        transition: ANIMATION_TIMINGS.STANDARD
    }
};

// ────────────────────────────────────────────────────────────────
// FRAMER MOTION VARIANTS - Loading & Empty States
// ────────────────────────────────────────────────────────────────

// Skeleton loading animation
export const skeletonVariants = {
    loading: {
        background: [
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.1)',
            'rgba(255, 255, 255, 0.05)'
        ],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

// Pulse dot animation (typing indicator)
export const pulseDotVariants = {
    animate: (i) => ({
        y: [0, -10, 0],
        transition: {
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1
        }
    })
};

// Empty state animation
export const emptyStateVariants = {
    hidden: {
        opacity: 0,
        scale: 0.9
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: ANIMATION_TIMINGS.SLOW
    }
};

// ────────────────────────────────────────────────────────────────
// FRAMER MOTION VARIANTS - List Items & Timeline
// ────────────────────────────────────────────────────────────────

// List item animation
export const listItemVariants = {
    hidden: {
        opacity: 0,
        x: -20
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: ANIMATION_TIMINGS.STANDARD
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: ANIMATION_TIMINGS.FAST
    }
};

// Timeline entry animation
export const timelineEntryVariants = {
    hidden: {
        opacity: 0,
        y: 10,
        x: -10
    },
    visible: {
        opacity: 1,
        y: 0,
        x: 0,
        transition: ANIMATION_TIMINGS.STANDARD
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: ANIMATION_TIMINGS.FAST
    }
};

// Pulse ring animation (online indicator)
export const pulseRingVariants = {
    animate: {
        scale: [0.9, 1.3],
        opacity: [1, 0],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut'
        }
    }
};

// ────────────────────────────────────────────────────────────────
// FRAMER MOTION VARIANTS - Charts & Data Visualization
// ────────────────────────────────────────────────────────────────

// Chart animation entry
export const chartVariants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.4,
            staggerChildren: 0.05
        }
    }
};

// Chart bar animation
export const chartBarVariants = {
    hidden: {
        height: 0,
        opacity: 0
    },
    visible: {
        height: '100%',
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut'
        }
    }
};

// Ranking badge animation
export const rankBadgeVariants = {
    hidden: {
        opacity: 0,
        scale: 0
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: ANIMATION_TIMINGS.STANDARD
    }
};

// Progress bar animation
export const progressBarVariants = {
    hidden: {
        width: 0,
        opacity: 0
    },
    visible: {
        width: '100%',
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: 'easeOut'
        }
    }
};

// ────────────────────────────────────────────────────────────────
// BACKGROUND & DECORATIVE ANIMATIONS
// ────────────────────────────────────────────────────────────────

// Floating background orb animation
export const orbVariants = {
    animate: {
        y: [0, -30, 0],
        x: [0, 20, 0],
        opacity: [0.3, 0.5, 0.3],
        scale: [1, 1.1, 1],
        transition: {
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

// Scroll indicator animation
export const scrollIndicatorVariants = {
    initial: {
        scaleY: 0,
        opacity: 0
    },
    animate: {
        scaleY: 1,
        opacity: 1,
        transition: ANIMATION_TIMINGS.STANDARD
    }
};

// ────────────────────────────────────────────────────────────────
// COLOR CONSTANTS & PALETTE
// ────────────────────────────────────────────────────────────────

export const COLORS = {
    // Primary colors
    blue: '#3b82f6',
    indigo: '#6366f1',
    purple: '#8b5cf6',
    cyan: '#06b6d4',

    // Secondary colors
    green: '#10b981',
    orange: '#f59e0b',
    red: '#ef4444',
    pink: '#ec4899',

    // Neutral colors
    white: '#ffffff',
    black: '#000000',
    darkBg: '#030014',
    cardBg: 'rgba(255, 255, 255, 0.03)',

    // Status colors
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',

    // Text colors
    textPrimary: 'rgba(255, 255, 255, 1)',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textTertiary: 'rgba(255, 255, 255, 0.5)',
    textDisabled: 'rgba(255, 255, 255, 0.3)'
};

// ────────────────────────────────────────────────────────────────
// GRADIENT DEFINITIONS
// ────────────────────────────────────────────────────────────────

export const GRADIENTS = {
    // Status gradients
    banGradient: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))',
    verifyGradient: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))',
    deleteGradient: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(218,39,40,0.1))',
    pinGradient: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.1))',

    // Card gradients
    glassGradient: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
    hoverGradient: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.1))',

    // Chart gradients
    chartGradient: 'linear-gradient(to top, rgba(59,130,246,0.4), rgba(59,130,246,0.02))',
    heatmapGradient: 'linear-gradient(to right, rgba(6,182,212,0.3), rgba(59,130,246,0.3))',

    // Text shadows / glows
    textGlowBlue: '0 0 20px rgba(59, 130, 246, 0.5)',
    textGlowPurple: '0 0 20px rgba(139, 92, 246, 0.5)',
    boxGlowBlue: '0 0 20px rgba(59, 130, 246, 0.15)'
};

// ────────────────────────────────────────────────────────────────
// ACTION TYPE STYLING (for audit log and reports)
// ────────────────────────────────────────────────────────────────

export const ACTION_STYLES = {
    BAN: {
        bg: 'rgba(239,68,68,0.12)',
        border: 'rgba(239,68,68,0.3)',
        text: '#ef4444',
        dot: '#ef4444',
        gradient: GRADIENTS.banGradient,
        icon: 'ShieldAlert'
    },
    UNBAN: {
        bg: 'rgba(34,197,94,0.12)',
        border: 'rgba(34,197,94,0.3)',
        text: '#22c55e',
        dot: '#22c55e',
        gradient: GRADIENTS.verifyGradient,
        icon: 'UserCheck'
    },
    DELETE: {
        bg: 'rgba(239,68,68,0.12)',
        border: 'rgba(239,68,68,0.3)',
        text: '#ef4444',
        dot: '#ef4444',
        gradient: GRADIENTS.deleteGradient,
        icon: 'Trash2'
    },
    VERIFY: {
        bg: 'rgba(16,185,129,0.12)',
        border: 'rgba(16,185,129,0.3)',
        text: '#10b981',
        dot: '#10b981',
        gradient: GRADIENTS.verifyGradient,
        icon: 'CheckCircle'
    },
    REPORT: {
        bg: 'rgba(245,158,11,0.12)',
        border: 'rgba(245,158,11,0.3)',
        text: '#f59e0b',
        dot: '#f59e0b',
        gradient: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))',
        icon: 'AlertTriangle'
    }
};

// ────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ────────────────────────────────────────────────────────────────

/**
 * Generate gradient avatar based on username hash
 * Returns a gradient color pair from a predefined palette
 */
export const getGradientAvatar = (name = '') => {
    const gradients = [
        { from: '#3b82f6', to: '#06b6d4' },   // Blue to Cyan
        { from: '#8b5cf6', to: '#6366f1' },   // Purple to Indigo
        { from: '#ec4899', to: '#f43f5e' },   // Pink to Rose
        { from: '#f59e0b', to: '#ef4444' },   // Orange to Red
        { from: '#10b981', to: '#06b6d4' },   // Green to Cyan
        { from: '#06b6d4', to: '#3b82f6' },   // Cyan to Blue
    ];

    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
};

/**
 * Format large numbers with M, K, B suffixes
 */
export const formatNumber = (value) => {
    if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
    if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
    return value?.toString() || '0';
};

/**
 * Generate delay for staggered animations
 */
export const getStaggerDelay = (index, baseDelay = ANIMATION_TIMINGS.STAGGER) => {
    return index * baseDelay;
};

/**
 * Common spring animation transition for natural motion
 */
export const springTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 1
};

/**
 * Get text color based on background
 */
export const getContrastColor = (bgColor) => {
    // Simple contrast calculation
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
};

export default {
    ANIMATION_TIMINGS,
    containerVariants,
    itemVariants,
    sidebarContainerVariants,
    sidebarItemVariants,
    mobileOverlayVariants,
    cardHoverVariants,
    glowVariants,
    trendBadgeVariants,
    tabContentVariants,
    tabPillVariants,
    skeletonVariants,
    pulseDotVariants,
    emptyStateVariants,
    listItemVariants,
    timelineEntryVariants,
    pulseRingVariants,
    chartVariants,
    chartBarVariants,
    rankBadgeVariants,
    progressBarVariants,
    orbVariants,
    scrollIndicatorVariants,
    COLORS,
    GRADIENTS,
    ACTION_STYLES,
    getGradientAvatar,
    formatNumber,
    getStaggerDelay,
    springTransition,
    getContrastColor
};
