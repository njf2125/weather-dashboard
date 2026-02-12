// src/interfaces.ts

// Basic structure for the main weather data (temperature, feels_like, humidity, etc.)
export interface MainWeather {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
}

// Structure for weather description (main, description, icon)
export interface WeatherDescription {
    id: number;
    main: string;
    description: string;
    icon: string;
}

// Structure for wind data
export interface Wind {
    speed: number;
    deg: number;
}

// Structure for current weather data (part of the One Call API response)
export interface CurrentWeatherData {
    dt: number; // Time of data calculation, Unix, UTC
    sunrise: number; // Sunrise time, Unix, UTC
    sunset: number; // Sunset time, Unix, UTC
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number; // UV index
    clouds: number; // Cloudiness, %
    visibility: number; // Average visibility, metres
    wind_speed: number;
    wind_deg: number;
    weather: WeatherDescription[]; // Array of weather conditions
}

// Structure for daily forecast data (part of the One Call API response)
export interface DailyForecastData {
    dt: number; // Time of the forecasted data, Unix, UTC
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    temp: {
        day: number;
        min: number;
        max: number;
        night: number;
        eve: number;
        morn: number;
    };
    feels_like: {
        day: number;
        night: number;
        eve: number;
        morn: number;
    };
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number; // Optional
    weather: WeatherDescription[]; // Array of weather conditions
    clouds: number;
    pop: number; // Probability of precipitation
    rain?: number; // Optional, precipitation volume
    uvi: number;
}

// Structure for weather alert data (part of the One Call API response)
export interface WeatherAlert {
    sender_name: string;
    event: string;
    start: number; // Date and time of the start of the alert, Unix, UTC
    end: number;   // Date and time of the end of the alert, Unix, UTC
    description: string;
    tags: string[]; // Optional
}

// The complete One Call API 3.0 response structure
export interface OpenWeatherOneCallResponse {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    current: CurrentWeatherData;
    daily: DailyForecastData[]; // Array of daily forecasts (up to 8 days)
    alerts?: WeatherAlert[]; // Optional array of weather alerts
}

export interface LocationData {
    name: string;
    lat: number;
    lon: number;
    state?: string;
    country?: string;
}
