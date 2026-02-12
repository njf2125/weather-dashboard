import React from 'react';

interface UnitToggleProps {
    unit: 'metric' | 'imperial';
    onToggle: (unit: 'metric' | 'imperial') => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ unit, onToggle }) => {
    return (
        <div id="unit-toggle">
            <label>
                <input
                    type="radio"
                    name="temp-unit"
                    value="imperial"
                    checked={unit === 'imperial'}
                    onChange={() => onToggle('imperial')}
                /> °F
            </label>
            <label>
                <input
                    type="radio"
                    name="temp-unit"
                    value="metric"
                    checked={unit === 'metric'}
                    onChange={() => onToggle('metric')}
                /> °C
            </label>
        </div>
    );
};

export default UnitToggle;
