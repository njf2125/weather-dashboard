import React, { useState, useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import { LocationData } from './interfaces';
import SearchSection from './components/SearchSection';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Alerts from './components/Alerts';
import LoadingOverlay from './components/LoadingOverlay';
import ErrorMessage from './components/ErrorMessage';

const LAST_LOCATION_KEY = "lastWeatherLocation";
const FAVORITE_CITIES_KEY = "favoriteWeatherCities";

const App: React.FC = () => {
    const [unit, setUnit] = useState<'metric' | 'imperial'>('imperial');
    const [favorites, setFavorites] = useState<LocationData[]>([]);
    const { 
        weatherData, 
        loading, 
        error, 
        currentLocation,
        searchCity, 
        getUserLocation, 
        getWeather 
    } = useWeather();

    // Load favorites and last location on mount
    useEffect(() => {
        const storedFavorites = localStorage.getItem(FAVORITE_CITIES_KEY);
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }

        const lastLocation = localStorage.getItem(LAST_LOCATION_KEY);
        if (lastLocation) {
            const parsedLocation = JSON.parse(lastLocation);
            getWeather(parsedLocation.lat, parsedLocation.lon, unit, parsedLocation);
        }
    }, []); // Run once on mount

    // Persist favorites
    useEffect(() => {
        localStorage.setItem(FAVORITE_CITIES_KEY, JSON.stringify(favorites));
    }, [favorites]);

    // Persist last location (whenever currentLocation changes)
    useEffect(() => {
        if (currentLocation) {
            localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(currentLocation));
        }
    }, [currentLocation]);

    // Re-fetch weather when unit changes
    useEffect(() => {
        if (currentLocation) {
            getWeather(currentLocation.lat, currentLocation.lon, unit, currentLocation);
        }
    }, [unit]);

    const handleFavoriteToggle = () => {
        if (!currentLocation) return;
        
        const isFav = favorites.some(fav => fav.name === currentLocation.name);
        if (isFav) {
            setFavorites(favorites.filter(fav => fav.name !== currentLocation.name));
        } else {
            setFavorites([...favorites, currentLocation]);
        }
    };

    const isCurrentLocationFavorite = currentLocation 
        ? favorites.some(fav => fav.name === currentLocation.name) 
        : false;

    return (
        <>
            <LoadingOverlay isLoading={loading} />
            <header>
                <h1>Weather Dashboard</h1>
            </header>
            <main>
                <SearchSection 
                    onSearch={(city) => searchCity(city, unit)}
                    onUseLocation={() => getUserLocation(unit)}
                    unit={unit}
                    onToggleUnit={setUnit}
                    favorites={favorites}
                    onSelectFavorite={(loc) => getWeather(loc.lat, loc.lon, unit, loc)}
                    onRemoveFavorite={(loc) => setFavorites(favorites.filter(fav => fav.name !== loc.name))}
                />

                {currentLocation && (
                    <div id="city-name-display" style={{ display: 'block' }}>
                        <span id="location-name">
                            {currentLocation.name}
                            {currentLocation.state ? `, ${currentLocation.state}` : ''}
                            {currentLocation.country ? `, ${currentLocation.country}` : ''}
                        </span>
                        <span 
                            id="favorite-star" 
                            style={{ cursor: 'pointer', marginLeft: '10px', color: '#f39c12' }}
                            onClick={handleFavoriteToggle}
                        >
                            {isCurrentLocationFavorite ? '★' : '☆'}
                        </span>
                    </div>
                )}

                <ErrorMessage message={error} />

                <div className="weather-container">
                    <CurrentWeather data={weatherData ? weatherData.current : null} unit={unit} />
                    <Forecast data={weatherData ? weatherData.daily : null} unit={unit} />
                </div>

                <Alerts alerts={weatherData?.alerts} />
            </main>
        </>
    );
};

export default App;
