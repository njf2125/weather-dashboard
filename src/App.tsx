import React, { useState, useEffect } from "react";
import { useWeather } from "./hooks/useWeather";
import { LocationData } from "./interfaces";
import SearchSection from "./components/SearchSection";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import Alerts from "./components/Alerts";
import LoadingOverlay from "./components/LoadingOverlay";
import ErrorMessage from "./components/ErrorMessage";
import SplashScreen from "./components/SplashScreen";

const LAST_LOCATION_KEY = "lastWeatherLocation";
const FAVORITE_CITIES_KEY = "favoriteWeatherCities";

const App: React.FC = () => {
    const [unit, setUnit] = useState<"metric" | "imperial">("imperial");
    const [favorites, setFavorites] = useState<LocationData[]>([]);
    const [initializing, setInitializing] = useState(true);
    const {
        weatherData,
        loading,
        error,
        currentLocation,
        searchCity,
        getUserLocation,
        getWeather,
    } = useWeather();

    // Load favorites and initial location on mount
    useEffect(() => {
        const storedFavorites = localStorage.getItem(FAVORITE_CITIES_KEY);
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }

        // ALWAYS try to get the current location as the primary source at startup
        getUserLocation(unit);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Hide splash screen once we have data or an error
    useEffect(() => {
        if (weatherData || error) {
            // Keep splash screen for at least a short moment for better UX
            const timer = setTimeout(() => setInitializing(false), 1200);
            return () => clearTimeout(timer);
        }
    }, [weatherData, error]);

    // Persist favorites
    useEffect(() => {
        localStorage.setItem(FAVORITE_CITIES_KEY, JSON.stringify(favorites));
    }, [favorites]);

    // Persist last location (whenever currentLocation changes)
    useEffect(() => {
        if (currentLocation) {
            localStorage.setItem(
                LAST_LOCATION_KEY,
                JSON.stringify(currentLocation),
            );
        }
    }, [currentLocation]);

    // Re-fetch weather when unit changes
    useEffect(() => {
        if (currentLocation) {
            getWeather(
                currentLocation.lat,
                currentLocation.lon,
                unit,
                currentLocation,
            );
        }
    }, [unit]);

    const handleFavoriteToggle = () => {
        if (!currentLocation) return;

        const isFav = favorites.some(
            (fav) => fav.name === currentLocation.name,
        );
        if (isFav) {
            setFavorites(
                favorites.filter((fav) => fav.name !== currentLocation.name),
            );
        } else {
            setFavorites([...favorites, currentLocation]);
        }
    };

    const isCurrentLocationFavorite = currentLocation
        ? favorites.some((fav) => fav.name === currentLocation.name)
        : false;

    return (
        <>
            {initializing && <SplashScreen />}
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
                    onSelectLocation={(loc) =>
                        getWeather(loc.lat, loc.lon, unit, loc)
                    }
                    onRemoveFavorite={(loc) =>
                        setFavorites(
                            favorites.filter((fav) => fav.name !== loc.name),
                        )
                    }
                />

                {currentLocation && (
                    <div id="city-name-display" style={{ display: "block" }}>
                        <span id="location-name">
                            {currentLocation.name}
                            {currentLocation.state
                                ? `, ${currentLocation.state}`
                                : ""}
                            {currentLocation.country
                                ? `, ${currentLocation.country}`
                                : ""}
                        </span>
                        <span
                            id="favorite-star"
                            style={{
                                cursor: "pointer",
                                marginLeft: "10px",
                                color: "#f39c12",
                            }}
                            onClick={handleFavoriteToggle}
                        >
                            {isCurrentLocationFavorite ? "★" : "☆"}
                        </span>
                    </div>
                )}

                <ErrorMessage message={error} />

                <div className="weather-container">
                    <CurrentWeather
                        data={weatherData ? weatherData.current : null}
                        unit={unit}
                    />
                    <Forecast
                        data={weatherData ? weatherData.daily : null}
                        unit={unit}
                    />
                </div>

                <Alerts alerts={weatherData?.alerts} />
            </main>
        </>
    );
};

export default App;
