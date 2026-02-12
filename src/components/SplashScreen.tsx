import React from "react";

const SplashScreen: React.FC = () => {
    return (
        <div id="splash-screen">
            <div className="splash-content">
                <div className="splash-logo">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                            fill="currentColor"
                        />
                        <path
                            d="M12 2V4M12 20V22M4 12H2M22 12H20M19.07 4.93L17.65 6.35M6.35 17.65L4.93 19.07M19.07 19.07L17.65 17.65M6.35 6.35L4.93 4.93"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
                <h1 className="splash-title">SkyCast</h1>
                <p className="splash-subtitle">Setting up your forecast...</p>
                <div className="splash-loader">
                    <div className="loader-bar"></div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
