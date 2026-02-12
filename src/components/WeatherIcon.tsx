import React from 'react';

const weatherIconMap: { [key: string]: string } = {
    "01d": "wi-day-sunny",
    "01n": "wi-night-clear",
    "02d": "wi-day-cloudy",
    "02n": "wi-night-alt-cloudy",
    "03d": "wi-cloud",
    "03n": "wi-cloud",
    "04d": "wi-cloudy",
    "04n": "wi-cloudy",
    "09d": "wi-day-showers",
    "09n": "wi-night-alt-showers",
    "10d": "wi-day-rain",
    "10n": "wi-night-alt-rain",
    "11d": "wi-day-thunderstorm",
    "11n": "wi-night-alt-thunderstorm",
    "13d": "wi-day-snow",
    "13n": "wi-night-alt-snow",
    "50d": "wi-day-fog",
    "50n": "wi-night-fog",
};

interface WeatherIconProps {
    iconCode: string;
    className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ iconCode, className = '' }) => {
    const iconClass = weatherIconMap[iconCode] || "wi-na";
    return <i className={`wi ${iconClass} ${className}`} />;
};

export default WeatherIcon;
