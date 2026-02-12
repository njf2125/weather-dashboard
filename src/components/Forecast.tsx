import React from 'react';
import { DailyForecastData } from '../interfaces';
import WeatherIcon from './WeatherIcon';

interface ForecastProps {
    data: DailyForecastData[] | null;
    unit: 'metric' | 'imperial';
}

const Forecast: React.FC<ForecastProps> = ({ data, unit }) => {
    if (!data || data.length === 0) {
        return (
            <section id="forecast">
                <h2>5-Day Forecast</h2>
                <div id="forecast-display">
                    <p>Forecast data not available.</p>
                </div>
            </section>
        );
    }

    const forecastDays = data.slice(1, 6);
    const tempUnitSymbol = unit === 'metric' ? '°C' : '°F';

    return (
        <section id="forecast">
            <h2>5-Day Forecast</h2>
            <div id="forecast-display">
                {forecastDays.map((day) => {
                    const date = new Date(day.dt * 1000);
                    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
                    const monthDay = date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    });

                    return (
                        <div key={day.dt} className="forecast-card">
                            <h4>{dayOfWeek}<br />{monthDay}</h4>
                            <WeatherIcon iconCode={day.weather[0].icon} />
                            <p>
                                {day.weather[0].description.charAt(0).toUpperCase() +
                                    day.weather[0].description.slice(1)}
                            </p>
                            <p>High: {Math.round(day.temp.max)}{tempUnitSymbol}</p>
                            <p>Low: {Math.round(day.temp.min)}{tempUnitSymbol}</p>
                            <p>Precipitation: {Math.round(day.pop * 100)}%</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Forecast;
