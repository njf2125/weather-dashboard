import { useState, useCallback } from 'react';
import { OpenWeatherOneCallResponse, LocationData } from '../interfaces';
import { fetchWeatherData, fetchLocationFromQuery, fetchReverseGeocoding } from '../utils/api';

export const useWeather = () => {
    const [weatherData, setWeatherData] = useState<OpenWeatherOneCallResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);

    const getWeather = useCallback(async (lat: number, lon: number, unit: 'metric' | 'imperial', locationInfo?: LocationData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchWeatherData(lat, lon, unit);
            setWeatherData(data);
            if (locationInfo) {
                setCurrentLocation(locationInfo);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchCity = useCallback(async (query: string, unit: 'metric' | 'imperial') => {
        setLoading(true);
        setError(null);
        try {
            const location = await fetchLocationFromQuery(query);
            if (location) {
                setCurrentLocation(location);
                // We need to call getWeather here, but since getWeather sets loading, we might want to do it sequentially or pass the promise.
                // Better to just call the API directly inside here or reuse logic.
                // Reuse logic:
                const data = await fetchWeatherData(location.lat, location.lon, unit);
                setWeatherData(data);
                return location;
            } else {
                setError(`City "${query}" not found.`);
                return null;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to search city');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserLocation = useCallback(async (unit: 'metric' | 'imperial') => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        setLoading(true);
        setError(null);
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                try {
                    const location = await fetchReverseGeocoding(lat, lon);
                    const locationData = location || { lat, lon, name: "Unknown Location" };
                    setCurrentLocation(locationData);
                    const data = await fetchWeatherData(lat, lon, unit);
                    setWeatherData(data);
                } catch (err) {
                    setError('Failed to fetch weather for your location.');
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setLoading(false);
                let errorMessage = "Unable to retrieve your location.";
                 switch (err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage = "Location access denied. Please enable location services.";
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable.";
                        break;
                    case err.TIMEOUT:
                        errorMessage = "The request to get user location timed out.";
                        break;
                }
                setError(errorMessage);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, []);

    return {
        weatherData,
        loading,
        error,
        currentLocation,
        getWeather,
        searchCity,
        getUserLocation,
        setError
    };
};
