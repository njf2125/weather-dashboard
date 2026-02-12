import React from 'react';

interface ErrorMessageProps {
    message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div id="error-message">
            {message}
        </div>
    );
};

export default ErrorMessage;
