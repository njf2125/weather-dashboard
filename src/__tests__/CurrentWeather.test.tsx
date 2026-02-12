import React from 'react';
import { render, screen } from '@testing-library/react';
import CurrentWeather from '../components/CurrentWeather';
import { CurrentWeatherData } from '../interfaces';

describe('CurrentWeather', () => {
    const mockData: CurrentWeatherData = {
        dt: 1678886400,
        sunrise: 1678860000,
        sunset: 1678900000,
        temp: 20.5,
        feels_like: 19.0,
        pressure: 1012,
        humidity: 70,
        dew_point: 10.0,
        uvi: 5.0,
        clouds: 40,
        visibility: 10000,
        wind_speed: 4.5, // m/s
        wind_deg: 200,
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
    };

    it('renders weather data correctly in metric', () => {
        render(<CurrentWeather data={mockData} unit="metric" />);
        expect(screen.getByText(/Temperature: 21°C/)).toBeInTheDocument(); // Math.round(20.5) -> 21
        expect(screen.getByText(/Feels like: 19°C/)).toBeInTheDocument();
        expect(screen.getByText(/Wind Speed: 4.5 m\/s/)).toBeInTheDocument();
        expect(screen.getByText(/Condition: Clear sky/)).toBeInTheDocument();
    });

    it('renders weather data correctly in imperial', () => {
        render(<CurrentWeather data={mockData} unit="imperial" />);
        expect(screen.getByText(/Temperature: 21°F/)).toBeInTheDocument();
        expect(screen.getByText(/Wind Speed: 4.5 mph/)).toBeInTheDocument();
    });

    it('renders nothing available message when data is null', () => {
        render(<CurrentWeather data={null} unit="metric" />);
        expect(screen.getByText('Current weather data not available.')).toBeInTheDocument();
    });
});
