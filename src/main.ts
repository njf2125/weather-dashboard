// src/main.ts
import { OpenWeatherOneCallResponse, CurrentWeatherData, DailyForecastData, WeatherAlert } from './interfaces';
import 'weather-icons/css/weather-icons.css';

console.log("Hello from the Weather Dashboard!");

const API_KEY = '63f740ae509cf372418696e2940a01f2'; // <<< REPLACE THIS WITH YOUR ACTUAL API KEY

const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';

const LAST_LOCATION_KEY = 'lastWeatherLocation';
const FAVORITE_CITIES_KEY = 'favoriteWeatherCities';

// Function to save favorite cities to localStorage
function saveFavoriteCities(favorites: { name: string; lat: number; lon: number; state?: string }[]) {
    try {
        localStorage.setItem(FAVORITE_CITIES_KEY, JSON.stringify(favorites));
    } catch (e) {
        console.error("Error saving favorite cities to localStorage:", e);
    }
}

// Function to load favorite cities from localStorage
function loadFavoriteCities(): { name: string; lat: number; lon: number; state?: string }[] {
    try {
        const stored = localStorage.getItem(FAVORITE_CITIES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Error loading favorite cities from localStorage:", e);
        return [];
    }
}

// Function to save the last searched location to localStorage
function saveLastLocation(location: { lat: number; lon: number; name: string; state?: string }) {
    try {
        localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(location));
    } catch (e) {
        console.error("Error saving last location to localStorage:", e);
    }
}

// Function to load the last searched location from localStorage
function loadLastLocation(): { lat: number; lon: number; name: string; state?: string } | null {
    try {
        const stored = localStorage.getItem(LAST_LOCATION_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        console.error("Error loading last location from localStorage:", e);
        return null;
    }
}

let preferredUnits: 'metric' | 'imperial' = 'imperial'; // Default to Fahrenheit

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

function getWeatherIconClass(iconCode: string): string {
    return weatherIconMap[iconCode] || "wi-na"; // Default to "not available" icon
}

// Helper function to display error messages on the page
function displayError(errorMessageDisplay: HTMLDivElement, message: string | null) {
    if (message) {
        errorMessageDisplay.textContent = message;
        errorMessageDisplay.classList.remove('hidden');
    } else {
        errorMessageDisplay.textContent = '';
        errorMessageDisplay.classList.add('hidden');
    }
}

// Helper function to show/hide loading spinner
function showLoading(loadingOverlay: HTMLDivElement, isLoading: boolean) {
    if (isLoading) {
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

// Function to fetch weather data
export async function getWeatherData(lat: number, lon: number, locationData: { lat: number; lon: number; name: string; state?: string }, uiElements: UIElements) {
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=${preferredUnits}&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            showLoading(uiElements.loadingOverlay, false);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: OpenWeatherOneCallResponse = await response.json();
        console.log("Weather data received:", data);

        displayCurrentWeather(uiElements.currentWeatherDisplay, data.current, preferredUnits);
        displayForecast(uiElements.forecastDisplay, data.daily, preferredUnits);
        displayAlerts(uiElements.alertsDisplay, uiElements.activeAlertsLink, data.alerts);
        if (locationData) {
            saveLastLocation(locationData);
        }
        showLoading(uiElements.loadingOverlay, false);

    } catch (error) {
        showLoading(uiElements.loadingOverlay, false);
        console.error("Could not fetch weather data:", error);
        displayError(uiElements.errorMessageDisplay, `Failed to fetch weather data: ${error instanceof Error ? error.message : "Unknown error"}`);
        uiElements.currentWeatherDisplay.innerHTML = '<p>Failed to load current weather.</p>';
        uiElements.forecastDisplay.innerHTML = '<p>Failed to load forecast.</p>';
        uiElements.alertsDisplay.innerHTML = '<p>Failed to load alerts.</p>';
    }
}

// Function to display current weather
export function displayCurrentWeather(currentWeatherDisplay: HTMLDivElement, current: CurrentWeatherData, preferredUnits: 'metric' | 'imperial') {
    // Clear previous content
    currentWeatherDisplay.innerHTML = '';

    const date = new Date(current.dt * 1000); // Convert Unix timestamp to Date object
    const iconClass = getWeatherIconClass(current.weather[0].icon);
    const tempUnitSymbol = preferredUnits === 'metric' ? '°C' : '°F';

    currentWeatherDisplay.innerHTML = `
        <h3>${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br>${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h3>
        <p>Temperature: ${Math.round(current.temp)}${tempUnitSymbol} (Feels like: ${Math.round(current.feels_like)}${tempUnitSymbol})</p>
        <p>Condition: ${current.weather[0].description.charAt(0).toUpperCase() + current.weather[0].description.slice(1)} <br><i class="wi ${iconClass}"></i></p>
        <p>Humidity: ${current.humidity}%</p>
        <p>Wind Speed: ${current.wind_speed} ${preferredUnits === 'metric' ? 'm/s' : 'mph'}</p>
        <p>Sunrise: ${new Date(current.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p>Sunset: ${new Date(current.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p>UV Index: ${current.uvi}</p>
    `;

    // Show the display now that it has content
    currentWeatherDisplay.style.display = 'flex';
}

// Function to display forecast
export function displayForecast(forecastDisplay: HTMLDivElement, daily: DailyForecastData[], preferredUnits: 'metric' | 'imperial') {
    forecastDisplay.innerHTML = ''; // Clear previous content

    // We want 5 days starting from *tomorrow*.
    // The first element (daily[0]) is today's forecast, which is covered by current weather.
    // So we slice from index 1 and take 5 elements.
    const forecastDays = daily.slice(1, 6); // Gets elements from index 1 up to (but not including) 6
    const tempUnitSymbol = preferredUnits === 'metric' ? '°C' : '°F';

    if (forecastDays.length === 0) {
        forecastDisplay.innerHTML = '<p>No forecast data available.</p>';
        return;
    }

    forecastDays.forEach(day => {
        const date = new Date(day.dt * 1000); // Convert Unix timestamp to Date object
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const iconClass = getWeatherIconClass(day.weather[0].icon);

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card'; // We'll add CSS for this later

        forecastCard.innerHTML = `
            <h4>${dayOfWeek}<br>${monthDay}</h4>
            <i class="wi ${iconClass}"></i>
            <p>${day.weather[0].description.charAt(0).toUpperCase() + day.weather[0].description.slice(1)}</p>
            <p>High: ${Math.round(day.temp.max)}${tempUnitSymbol}</p>
            <p>Low: ${Math.round(day.temp.min)}${tempUnitSymbol}</p>
            <p>Precipitation: ${Math.round(day.pop * 100)}%</p>
        `;
        forecastDisplay.appendChild(forecastCard);
    });
}

// Function to display alerts
export function displayAlerts(alertsDisplay: HTMLDivElement, activeAlertsLink: HTMLAnchorElement, alerts?: WeatherAlert[]) {
    alertsDisplay.innerHTML = ''; // Clear previous content
    if (alerts && alerts.length > 0) {
        alertsDisplay.innerHTML = `<h3>Active Alerts:</h3>`;
        alerts.forEach(alert => {
            const startDate = new Date(alert.start * 1000).toLocaleString();
            const endDate = new Date(alert.end * 1000).toLocaleString();
            alertsDisplay.innerHTML += `
                <div class="alert-item">
                    <h4>${alert.event}</h4>
                    <p>Sender: ${alert.sender_name}</p>
                    <p>From: ${startDate} to ${endDate}</p>
                    <p>${alert.description}</p>
                </div>
            `;
        });
        activeAlertsLink.classList.remove('hidden');
    } else {
        alertsDisplay.innerHTML = '<p>No active weather alerts.</p>';
        activeAlertsLink.classList.add('hidden');
    }
}

// Function to get Lat/Lon from city name (using OpenWeatherMap's Geocoding API)
export async function getLatLonFromCity(input: string, uiElements: UIElements): Promise<{ lat: number; lon: number; name: string; state?: string } | null> {
    let geoUrl: string;
    // Check if the input is a zip code (5 digits for US zip codes)
    if (/^\d{5}$/.test(input)) {
        geoUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${input},US&appid=${API_KEY}`;
    } else {
        // Assume it's a city name
        const query = input;
        geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`;
    }

    try {
        const response = await fetch(geoUrl);
        if (!response.ok) {
            // Check for specific HTTP errors
            if (response.status === 400) {
                showLoading(uiElements.loadingOverlay, false);
                throw new Error("Bad request. Please check your input format.");
            } else if (response.status === 401) {
                showLoading(uiElements.loadingOverlay, false);
                 throw new Error("Unauthorized. Please check your API key.");
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (/^\d{5}$/.test(input)) { // If it was a zip code search
            if (data.lat && data.lon) {
                console.log("Geocoding data for zip code", input, ":", data);
                // For zip codes, we need to do a reverse lookup to get the state
                const reverseGeoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${data.lat}&lon=${data.lon}&limit=1&appid=${API_KEY}`;
                const reverseResponse = await fetch(reverseGeoUrl);
                if (!reverseResponse.ok) {
                    // We can still proceed without the state, just log the error
                    console.error(`HTTP error on reverse geocoding! status: ${reverseResponse.status}`);
                    showLoading(uiElements.loadingOverlay, false);
                    return { lat: data.lat, lon: data.lon, name: data.name };
                }
                const reverseData = await reverseResponse.json();
                const state = reverseData.length > 0 ? reverseData[0].state : undefined;
                showLoading(uiElements.loadingOverlay, false);
                return { lat: data.lat, lon: data.lon, name: data.name, state: state };
            } else {
                displayError(uiElements.errorMessageDisplay, `Zip code "${input}" not found. Please try again.`);
                uiElements.cityDisplayName.textContent = '';
                uiElements.cityDisplayName.style.display = 'none';
                showLoading(uiElements.loadingOverlay, false);
                return null;
            }
        } else { // If it was a city name search
            if (data.length > 0) {
                console.log("Geocoding data for", input, ":", data[0]);
                showLoading(uiElements.loadingOverlay, false);
                return { lat: data[0].lat, lon: data[0].lon, name: data[0].name, state: data[0].state };
            } else {
                displayError(uiElements.errorMessageDisplay, `City "${input}" not found. Please try adding state/country (e.g., "Wilmington, NC, US" or "London, UK").`);
                uiElements.cityDisplayName.textContent = '';
                uiElements.cityDisplayName.style.display = 'none';
                showLoading(uiElements.loadingOverlay, false);
                return null;
            }
        }
    } catch (error) {
        console.error("Error fetching geocoding data:", error);
        displayError(uiElements.errorMessageDisplay, `Failed to get coordinates: ${error instanceof Error ? error.message : "Unknown error"}. Please check your input or API key.`);
        showLoading(uiElements.loadingOverlay, false);
        return null;
    }
}

interface UIElements {
    cityInput: HTMLInputElement;
    searchButton: HTMLButtonElement;
    currentWeatherDisplay: HTMLDivElement;
    forecastDisplay: HTMLDivElement;
    alertsDisplay: HTMLDivElement;
    cityDisplayName: HTMLDivElement;
    locationNameSpan: HTMLSpanElement;
    activeAlertsLink: HTMLAnchorElement;
    unitToggle: HTMLDivElement;
    currentLocationButton: HTMLButtonElement;
    loadingOverlay: HTMLDivElement;
    errorMessageDisplay: HTMLDivElement;
    citySuggestions: HTMLDivElement;
    favoriteStar: HTMLSpanElement;
}

// Export initializeUI function
export function initializeUI(): UIElements {
    // Assign DOM elements
    const cityInput = document.getElementById('city-input') as HTMLInputElement;
    const searchButton = document.getElementById('search-button') as HTMLButtonElement;
    const currentWeatherDisplay = document.getElementById('current-weather-display') as HTMLDivElement;
    const forecastDisplay = document.getElementById('forecast-display') as HTMLDivElement;
    const alertsDisplay = document.getElementById('alerts-display') as HTMLDivElement;
    const cityDisplayName = document.getElementById('city-name-display') as HTMLDivElement;
    const locationNameSpan = document.getElementById('location-name') as HTMLSpanElement;
    const activeAlertsLink = document.getElementById('active-alerts-link') as HTMLAnchorElement;
    const unitToggle = document.getElementById('unit-toggle') as HTMLDivElement;
    const currentLocationButton = document.getElementById('current-location-button') as HTMLButtonElement;
    const loadingOverlay = document.getElementById('loading-overlay') as HTMLDivElement;
    const errorMessageDisplay = document.getElementById('error-message') as HTMLDivElement;
    const citySuggestions = document.getElementById('city-suggestions') as HTMLDivElement;
    const favoriteStar = document.getElementById('favorite-star') as HTMLSpanElement;

    const uiElements: UIElements = {
        cityInput, searchButton, currentWeatherDisplay, forecastDisplay, alertsDisplay,
        cityDisplayName, locationNameSpan, activeAlertsLink, unitToggle, currentLocationButton,
        loadingOverlay, errorMessageDisplay, citySuggestions, favoriteStar
    };

    // Event Listeners
    searchButton.addEventListener('click', () => performSearch(uiElements));

    unitToggle.addEventListener('change', async (event) => {
        const target = event.target as HTMLInputElement;
        if (target.name === 'temp-unit') {
            preferredUnits = target.value as 'metric' | 'imperial';
            displayError(uiElements.errorMessageDisplay, null); // Clear any previous errors

            const lastLocation = loadLastLocation();
            if (lastLocation) {
                showLoading(uiElements.loadingOverlay, true); // Show loading when re-fetching for unit change
                await getWeatherData(lastLocation.lat, lastLocation.lon, lastLocation, uiElements);
                // Update display name if it was cleared or changed
                uiElements.locationNameSpan.textContent = lastLocation.state ? `${lastLocation.name}, ${lastLocation.state}` : lastLocation.name;
                uiElements.cityDisplayName.style.display = 'block';
            } else if (uiElements.cityInput.value.trim()) {
                // If there's text in the input but no lastLocation (e.g., first search after refresh)
                performSearch(uiElements);
            }
        }
    });

    currentLocationButton.addEventListener('click', () => getUserLocation(uiElements));

    uiElements.cityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performSearch(uiElements);
        }
    });

    uiElements.cityInput.addEventListener('input', () => {
        if (uiElements.cityInput.value.length > 2) {
            getCitySuggestions(uiElements.cityInput.value, uiElements);
        } else {
            displayFavoriteCities(uiElements);
        }
    });

    uiElements.cityInput.addEventListener('click', () => {
        if (uiElements.cityInput.value.length === 0) {
            displayFavoriteCities(uiElements);
        }
    });

    document.addEventListener('click', (event) => {
        if (!uiElements.cityInput.contains(event.target as Node)) {
            uiElements.citySuggestions.innerHTML = '';
        }
    });

    return uiElements;
}

async function getCitySuggestions(query: string, uiElements: UIElements) {
    if (query.length < 3) {
        uiElements.citySuggestions.innerHTML = '';
        return;
    }

    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const result = await response.json();
        displayCitySuggestions(result, uiElements);
    } catch (error) {
        console.error(error);
    }
}

function displayCitySuggestions(suggestions: any[], uiElements: UIElements) {
    uiElements.citySuggestions.innerHTML = '';
    if (!suggestions) return;

    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        let text = suggestion.name;
        if (suggestion.state) {
            text += `, ${suggestion.state}`;
        }
        if (suggestion.country) {
            text += `, ${suggestion.country}`;
        }
        item.textContent = text;
        item.addEventListener('click', () => {
            uiElements.cityInput.value = text;
            uiElements.citySuggestions.innerHTML = '';
            performSearch(uiElements);
        });
        uiElements.citySuggestions.appendChild(item);
    });
}

// These functions now accept uiElements as a parameter
async function performSearch(uiElements: UIElements) {
    const city = uiElements.cityInput.value.trim();
    if (city) {
        displayError(uiElements.errorMessageDisplay, null); // Clear any previous errors
        showLoading(uiElements.loadingOverlay, true); // Show loading when initiating city search
        console.log(`Searching for weather in: ${city}`);
        const coords = await getLatLonFromCity(city, uiElements);
        if (coords) {
            getWeatherData(coords.lat, coords.lon, coords, uiElements);
            // Update the display name using the span
            uiElements.locationNameSpan.textContent = coords.state ? `${coords.name}, ${coords.state}` : coords.name;
            uiElements.cityDisplayName.style.display = 'block';

            const favorites = loadFavoriteCities();
            const isFavorite = favorites.some(fav => fav.name === (coords.state ? `${coords.name}, ${coords.state}` : coords.name));
            updateFavoriteStar(isFavorite, uiElements);

            uiElements.favoriteStar.onclick = () => {
                const currentFavorites = loadFavoriteCities();
                const isCurrentlyFavorite = currentFavorites.some(fav => fav.name === (coords.state ? `${coords.name}, ${coords.state}` : coords.name));
                if (isCurrentlyFavorite) {
                    removeFavorite({ name: (coords.state ? `${coords.name}, ${coords.state}` : coords.name), lat: coords.lat, lon: coords.lon, state: coords.state }, uiElements);
                } else {
                    addFavorite({ name: (coords.state ? `${coords.name}, ${coords.state}` : coords.name), lat: coords.lat, lon: coords.lon, state: coords.state }, uiElements);
                }
            };

        } else {
            showLoading(uiElements.loadingOverlay, false); // Hide loading if coords not found
        }
    }
    else {
        displayError(uiElements.errorMessageDisplay, 'Please enter a city name or use "Use My Location".');
        uiElements.currentWeatherDisplay.innerHTML = '';
        uiElements.currentWeatherDisplay.style.display = 'none'; // Hide it
        uiElements.forecastDisplay.innerHTML = '';
        uiElements.alertsDisplay.innerHTML = '';
        uiElements.cityDisplayName.style.display = 'none';
        uiElements.locationNameSpan.textContent = ''; // Clear the span content
        uiElements.activeAlertsLink.classList.add('hidden'); // Hide the link
    }
    uiElements.citySuggestions.innerHTML = '';
}

function displayFavoriteCities(uiElements: UIElements) {
    const favorites = loadFavoriteCities();
    uiElements.citySuggestions.innerHTML = '';
    if (favorites.length > 0) {
        favorites.forEach(fav => {
            const item = document.createElement('div');
            item.classList.add('favorite-item');

            const name = document.createElement('span');
            name.textContent = fav.name;
            item.appendChild(name);

            const removeButton = document.createElement('span');
            removeButton.className = 'remove-favorite';
            removeButton.textContent = 'x';
            removeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFavorite(fav, uiElements);
            });
            item.appendChild(removeButton);

            item.addEventListener('click', () => {
                uiElements.cityInput.value = fav.name;
                uiElements.citySuggestions.innerHTML = '';
                performSearch(uiElements);
            });
            uiElements.citySuggestions.appendChild(item);
        });
    }
}

function addFavorite(location: { name: string; lat: number; lon: number; state?: string }, uiElements: UIElements) {
    const favorites = loadFavoriteCities();
    if (!favorites.some(fav => fav.name === location.name)) {
        favorites.push(location);
        saveFavoriteCities(favorites);
        displayFavoriteCities(uiElements);
        updateFavoriteStar(true, uiElements);
    }
}

function removeFavorite(location: { name: string; lat: number; lon: number; state?: string }, uiElements: UIElements) {
    let favorites = loadFavoriteCities();
    favorites = favorites.filter(fav => fav.name !== location.name);
    saveFavoriteCities(favorites);
    displayFavoriteCities(uiElements);
    updateFavoriteStar(false, uiElements);
}

function updateFavoriteStar(isFavorite: boolean, uiElements: UIElements) {
    uiElements.favoriteStar.textContent = isFavorite ? '★' : '☆';
    uiElements.favoriteStar.classList.remove('hidden');
}

async function getUserLocation(uiElements: UIElements) {
    if (navigator.geolocation) {
        showLoading(uiElements.loadingOverlay, true); // Show loading when getting geolocation
        uiElements.cityInput.value = "Getting your location..."; // Provide feedback
        uiElements.currentWeatherDisplay.innerHTML = '';
        uiElements.forecastDisplay.innerHTML = '';
        uiElements.alertsDisplay.innerHTML = '';

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log("Geolocation successful:", lat, lon);
                // Clear the "Getting your location..." message
                uiElements.cityInput.value = ''; // Clear placeholder after successful location retrieval
                const reverseGeoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
                const reverseResponse = await fetch(reverseGeoUrl);
                if (reverseResponse.ok) {
                    const reverseData = await reverseResponse.json();
                    if (reverseData.length > 0) {
                        const location = reverseData[0];
                        const locationData = { lat: lat, lon: lon, name: location.name, state: location.state };
                        uiElements.locationNameSpan.textContent = location.state ? `${location.name}, ${location.state}` : location.name;
                        uiElements.cityDisplayName.style.display = 'block';
                        await getWeatherData(lat, lon, locationData, uiElements);
                    } else {
                        // Fallback if reverse geocoding fails to find a name
                        await getWeatherData(lat, lon, { lat: lat, lon: lon, name: "Unknown Location" }, uiElements);
                    }
                } else {
                    // Fallback if reverse geocoding API call fails
                    console.error(`HTTP error on reverse geocoding! status: ${reverseResponse.status}`);
                    await getWeatherData(lat, lon, { lat: lat, lon: lon, name: "Unknown Location" }, uiElements);
                }
                showLoading(uiElements.loadingOverlay, false); // Hide loading on success
            },
            (error) => {
                showLoading(uiElements.loadingOverlay, false); // Hide loading on error
                uiElements.cityInput.value = ''; // Clear placeholder
                console.error("Geolocation error:", error);
                let errorMessage = "Unable to retrieve your location.";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location access denied. Please enable location services for this site in your browser settings.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "The request to get user location timed out.";
                        break;
                }
                displayError(uiElements.errorMessageDisplay, errorMessage);
                uiElements.currentWeatherDisplay.innerHTML = `<p>${errorMessage}</p>`;
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Options for geolocation
        );
    } else {
        displayError(uiElements.errorMessageDisplay, "Geolocation is not supported by your browser.");
    }
}

// Initial setup when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    const uiElements = initializeUI(); // Initialize UI elements and event listeners
    const lastLocation = loadLastLocation();
    if (lastLocation) {
        uiElements.cityInput.value = lastLocation.name; // Display the name in the input
        uiElements.locationNameSpan.textContent = lastLocation.state ? `${lastLocation.name}, ${lastLocation.state}` : lastLocation.name;
        uiElements.cityDisplayName.style.display = 'block';
        await getWeatherData(lastLocation.lat, lastLocation.lon, lastLocation, uiElements); // Use stored lat/lon and pass the full object
    } else {
        // If no last location is stored, get the user's current location
        await getUserLocation(uiElements);
    }
});