import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const AnimatedCounter = ({
    end,
    duration = 2,
    suffix = '',
    prefix = '',
    decimals = 0
}) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (isInView && !hasAnimated) {
            setHasAnimated(true);
            let startTime;
            const startValue = 0;
            const endValue = end;

            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

                // Easing function (ease out)
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentCount = startValue + (endValue - startValue) * easeOut;

                setCount(currentCount);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        }
    }, [isInView, end, duration, hasAnimated]);

    const formatNumber = (num) => {
        return num.toFixed(decimals);
    };

    return (
        <span ref={ref}>
            {prefix}{formatNumber(count)}{suffix}
        </span>
    );
};

export default AnimatedCounter;
