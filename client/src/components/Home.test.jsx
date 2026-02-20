import React, { useEffect } from 'react';

function Home() {
    useEffect(() => {
        // Scroll to top on load
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[var(--bg)] min-h-screen relative overflow-x-hidden flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Testing...</h1>
                <p className="text-[var(--muted)]">If you see this, the basic app is working.</p>
            </div>
        </div>
    );
}

export default Home;
