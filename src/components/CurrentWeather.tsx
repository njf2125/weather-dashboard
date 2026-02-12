import React from 'react';
import { CurrentWeatherData } from '../interfaces';
import WeatherIcon from './WeatherIcon';

interface CurrentWeatherProps {
    data: CurrentWeatherData | null;
    unit: 'metric' | 'imperial';
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit }) => {
    if (!data) {
        return (
            <section id="current-weather">
                <h2>Current Conditions</h2>
                <div id="current-weather-display">
                    <p>Current weather data not available.</p>
                </div>
            </section>
        );
    }

    const date = new Date(data.dt * 1000);
    const tempUnitSymbol = unit === 'metric' ? '°C' : '°F';
    const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

    return (
        <section id="current-weather">
            <h2>Current Conditions</h2>
            <div id="current-weather-display" style={{ display: 'flex' }}>
                <h3>
                    {date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                    <br />
                    {date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </h3>
                <p>
                    Temperature: {Math.round(data.temp)}{tempUnitSymbol} (Feels like: {Math.round(data.feels_like)}{tempUnitSymbol})
                </p>
                <p>
                    Condition: {data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}
                    <br />
                    <WeatherIcon iconCode={data.weather[0].icon} className="weather-icon-large" />
                </p>
                <p>Humidity: {data.humidity}%</p>
                <p>Wind Speed: {data.wind_speed} {speedUnit}</p>
                <p>Sunrise: {new Date(data.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                <p>Sunset: {new Date(data.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                <p>UV Index: {data.uvi}</p>
            </div>
        </section>
    );
};

export default CurrentWeather;
