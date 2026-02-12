import React from 'react';

interface LoadingOverlayProps {
    isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div id="loading-overlay">
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingOverlay;
