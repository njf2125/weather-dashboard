"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("weather-icons/css/weather-icons.css");
console.log("Hello from the Weather Dashboard!");
const API_KEY = '63f740ae509cf372418696e2940a01f2'; // <<< REPLACE THIS WITH YOUR ACTUAL API KEY
const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';
// Get references to our HTML elements
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const currentWeatherDisplay = document.getElementById('current-weather-display');
const forecastDisplay = document.getElementById('forecast-display');
const alertsDisplay = document.getElementById('alerts-display');
const cityDisplayName = document.getElementById('city-name-display');
console.log("cityDisplayName element:", cityDisplayName);
const weatherIconMap = {
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
function getWeatherIconClass(iconCode) {
    return weatherIconMap[iconCode] || "wi-na"; // Default to "not available" icon
}
// Function to fetch weather data
function getWeatherData(lat, lon) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${BASE_URL}?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`;
        // Note: units=metric gives Celsius, set to 'imperial' for Fahrenheit
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                // If response is not 2xx, throw an error
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            console.log("Weather data received:", data); // Log the full response to inspect it
            displayCurrentWeather(data.current);
            displayForecast(data.daily);
            displayAlerts(data.alerts);
        }
        catch (error) {
            console.error("Could not fetch weather data:", error);
            alert(`Failed to fetch weather data: ${error instanceof Error ? error.message : "Unknown error"}`);
            currentWeatherDisplay.innerHTML = '<p>Failed to load current weather.</p>';
            forecastDisplay.innerHTML = '<p>Failed to load forecast.</p>';
            alertsDisplay.innerHTML = '<p>Failed to load alerts.</p>';
        }
    });
}
// Function to display current weather
function displayCurrentWeather(current) {
    // Clear previous content
    currentWeatherDisplay.innerHTML = '';
    const date = new Date(current.dt * 1000); // Convert Unix timestamp to Date object
    const iconClass = getWeatherIconClass(current.weather[0].icon);
    currentWeatherDisplay.innerHTML = `
        <h3>${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h3>
        <p>Temperature: ${current.temp}°F (Feels like: ${current.feels_like}°F)</p>
        <p>Condition: ${current.weather[0].description} <i class="wi ${iconClass}"></i></p>
        <p>Humidity: ${current.humidity}%</p>
        <p>Wind Speed: ${current.wind_speed} m/s</p>
        <p>UV Index: ${current.uvi}</p>
    `;
}
// Function to display forecast
function displayForecast(daily) {
    forecastDisplay.innerHTML = ''; // Clear previous content
    // We want 7 days starting from *tomorrow*.
    // The first element (daily[0]) is today's forecast, which is covered by current weather.
    // So we slice from index 1 and take 7 elements.
    const forecastDays = daily.slice(1, 8); // Gets elements from index 1 up to (but not including) 8
    if (forecastDays.length === 0) {
        forecastDisplay.innerHTML = '<p>No forecast data available.</p>';
        return;
    }
    forecastDays.forEach(day => {
        const date = new Date(day.dt * 1000); // Convert Unix timestamp to Date object
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const iconClass = getWeatherIconClass(day.weather[0].icon);
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card'; // We'll add CSS for this later
        forecastCard.innerHTML = `
            <h4>${dayOfWeek}, ${monthDay}</h4>
            <i class="wi ${iconClass}"></i>
            <p>${day.weather[0].description}</p>
            <p>High: ${day.temp.max}°F</p>
            <p>Low: ${day.temp.min}°F</p>
        `;
        forecastDisplay.appendChild(forecastCard);
    });
}
// Function to display alerts
function displayAlerts(alerts) {
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
    }
    else {
        alertsDisplay.innerHTML = '<p>No active weather alerts.</p>';
    }
}
// Add an event listener to the search button
searchButton.addEventListener('click', performSearch);
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});
function performSearch() {
    return __awaiter(this, void 0, void 0, function* () {
        const city = cityInput.value.trim();
        if (city) {
            console.log(`Searching for weather in: ${city}`);
            const coords = yield getLatLonFromCity(city);
            if (coords) {
                getWeatherData(coords.lat, coords.lon);
                // Also, update the display name to include the state if available
                cityDisplayName.textContent = coords.state ? `${coords.name}, ${coords.state}` : coords.name;
                cityDisplayName.style.display = 'block';
            }
        }
        else {
            alert('Please enter a city name or zip code!');
            currentWeatherDisplay.innerHTML = '';
            forecastDisplay.innerHTML = '';
            alertsDisplay.innerHTML = '';
            cityDisplayName.textContent = '';
            cityDisplayName.style.display = 'none';
        }
    });
}
// Function to get Lat/Lon from city name (using OpenWeatherMap's Geocoding API)
function getLatLonFromCity(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let geoUrl;
        // Check if the input is a zip code (5 digits for US zip codes)
        if (/^\d{5}$/.test(input)) {
            geoUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${input},US&appid=${API_KEY}`;
        }
        else {
            // Assume it's a city name
            const query = `${input},US`; // Example: "Wilmington,US"
            geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`;
        }
        try {
            const response = yield fetch(geoUrl);
            if (!response.ok) {
                // Check for specific HTTP errors
                if (response.status === 400) {
                    throw new Error("Bad request. Please check your input format.");
                }
                else if (response.status === 401) {
                    throw new Error("Unauthorized. Please check your API key.");
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            if (/^\d{5}$/.test(input)) { // If it was a zip code search
                if (data.lat && data.lon) {
                    console.log("Geocoding data for zip code", input, ":", data);
                    return { lat: data.lat, lon: data.lon, name: data.name, state: data.state };
                }
                else {
                    alert(`Zip code "${input}" not found. Please try again.`);
                    cityDisplayName.textContent = '';
                    cityDisplayName.style.display = 'none';
                    return null;
                }
            }
            else { // If it was a city name search
                if (data.length > 0) {
                    console.log("Geocoding data for", input, ":", data[0]);
                    return { lat: data[0].lat, lon: data[0].lon, name: data[0].name, state: data[0].state };
                }
                else {
                    alert(`City "${input}" not found. Please try adding state/country (e.g., "Wilmington, NC, US" or "London, UK").`);
                    cityDisplayName.textContent = '';
                    cityDisplayName.style.display = 'none';
                    return null;
                }
            }
        }
        catch (error) {
            console.error("Error fetching geocoding data:", error);
            alert(`Failed to get coordinates: ${error instanceof Error ? error.message : "Unknown error"}. Please check your input or API key.`);
            return null;
        }
    });
}
// Initial call to get weather for a default location (e.g., New York)
// This can be commented out if you prefer the dashboard to be empty on load
getLatLonFromCity("New York").then(coords => {
    if (coords) {
        getWeatherData(coords.lat, coords.lon);
        cityDisplayName.textContent = coords.state ? `${coords.name}, ${coords.state}` : coords.name;
        cityDisplayName.style.display = 'block';
    }
});
