import { CurrentWeatherData, DailyForecastData, WeatherDescription, WeatherAlert } from '../interfaces';
// Import the functions you want to test
import { displayCurrentWeather, displayForecast, displayAlerts, initializeUI } from '../main';

// Mock the DOM elements
let currentWeatherDisplay: HTMLDivElement;
let forecastDisplay: HTMLDivElement;
let alertsDisplay: HTMLDivElement;
let cityInput: HTMLInputElement;
let searchButton: HTMLButtonElement;
let unitToggle: HTMLDivElement;
let currentLocationButton: HTMLButtonElement;
let loadingOverlay: HTMLDivElement;
let errorMessageDisplay: HTMLDivElement;
let cityDisplayName: HTMLDivElement;
let locationNameSpan: HTMLSpanElement;
let activeAlertsLink: HTMLAnchorElement;

// Before each test, set up a fresh DOM environment
beforeEach(() => {
    // Clear the entire document body
    document.body.innerHTML = `
        <div id="current-weather-display"></div>
        <div id="forecast-display"></div>
        <div id="alerts-display"></div>
        <div id="error-message" class="hidden"></div>
        <div id="city-name-display"><span id="location-name"></span><a id="active-alerts-link" class="hidden"></a></div>
        <input type="text" id="city-input">
        <button id="search-button"></button>
        <button id="current-location-button"></button>
        <div id="unit-toggle"></div>
        <div id="loading-overlay" class="hidden"></div>
    `;
    // Re-get references to ensure they point to the new elements
    currentWeatherDisplay = document.getElementById('current-weather-display') as HTMLDivElement;
    forecastDisplay = document.getElementById('forecast-display') as HTMLDivElement;
    alertsDisplay = document.getElementById('alerts-display') as HTMLDivElement;
    cityInput = document.getElementById('city-input') as HTMLInputElement;
    searchButton = document.getElementById('search-button') as HTMLButtonElement;
    unitToggle = document.getElementById('unit-toggle') as HTMLDivElement;
    currentLocationButton = document.getElementById('current-location-button') as HTMLButtonElement;
    loadingOverlay = document.getElementById('loading-overlay') as HTMLDivElement;
    errorMessageDisplay = document.getElementById('error-message') as HTMLDivElement;
    cityDisplayName = document.getElementById('city-name-display') as HTMLDivElement;
    locationNameSpan = document.getElementById('location-name') as HTMLSpanElement;
    activeAlertsLink = document.getElementById('active-alerts-link') as HTMLAnchorElement;

    // Initialize the UI after setting up the DOM
    initializeUI();
});

describe('displayCurrentWeather', () => {
    it('should display current weather information correctly', () => {
        // Mock data for current weather
        const mockCurrent: CurrentWeatherData = {
            dt: 1678886400, // A valid Unix timestamp
            sunrise: 1678860000,
            sunset: 1678900000,
            temp: 25.5,
            feels_like: 24.0,
            pressure: 1012,
            humidity: 70,
            dew_point: 19.5,
            uvi: 5.0,
            clouds: 40,
            visibility: 10000,
            wind_speed: 4.5,
            wind_deg: 200,
            weather: [{ id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
        };

        // Call the function under test
        displayCurrentWeather(currentWeatherDisplay, mockCurrent, 'imperial');

        // Assertions
        expect(currentWeatherDisplay.innerHTML).toContain('Temperature: 26°F'); // Rounded and imperial
        expect(currentWeatherDisplay.innerHTML).toContain('Condition: Scattered clouds'); // Capitalized first letter
        expect(currentWeatherDisplay.innerHTML).toContain('Humidity: 70%');
        expect(currentWeatherDisplay.innerHTML).toContain('Wind Speed: 4.5 mph');
        expect(currentWeatherDisplay.innerHTML).toContain('UV Index: 5');
        expect(currentWeatherDisplay.innerHTML).toContain('Sunrise: 02:00 AM');
        expect(currentWeatherDisplay.innerHTML).toContain('Sunset: 01:06 PM');
    });

    it('should handle different temperature units correctly', () => {
        const mockCurrent: CurrentWeatherData = {
            dt: 1678886400, sunrise: 1678860000, sunset: 1678900000, temp: 25.5, feels_like: 24.0, pressure: 0, humidity: 0, dew_point: 0, uvi: 0, clouds: 0, visibility: 0, wind_speed: 0, wind_deg: 0,
            weather: [{ id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
        };
        displayCurrentWeather(currentWeatherDisplay, mockCurrent, 'metric');
        expect(currentWeatherDisplay.innerHTML).toContain('Temperature: 26°C');
    });
});

describe('displayForecast', () => {
    it('should display 5 forecast cards', () => {
        const mockDaily: DailyForecastData[] = Array.from({ length: 8 }, (_, i) => ({ // 8 days including today
            dt: 1678886400 + (i * 86400), // Increment by one day
            sunrise: 0, sunset: 0, moonrise: 0, moonset: 0, moon_phase: 0,
            temp: { day: 20 + i, min: 10 + i, max: 30 + i, night: 0, eve: 0, morn: 0 },
            feels_like: { day: 0, night: 0, eve: 0, morn: 0 },
            pressure: 0, humidity: 0, dew_point: 0, wind_speed: 0, wind_deg: 0, wind_gust: 0,
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
            clouds: 0, pop: 0.5, uvi: 0 // 50% chance of precipitation
        }));

        displayForecast(forecastDisplay, mockDaily, 'imperial');

        // We expect 5 cards for the forecast (daily.slice(1, 6))
        expect(forecastDisplay.querySelectorAll('.forecast-card').length).toBe(5);
        expect(forecastDisplay.innerHTML).toContain('High: 31°F'); // Check content of one card (imperial default)
        expect(forecastDisplay.innerHTML).toContain('Precipitation: 50%');
        expect(forecastDisplay.innerHTML).not.toContain('High: 20°F'); // Today's high should not be in forecast
    });

    it('should display "No forecast data available" if no forecast data', () => {
        displayForecast(forecastDisplay, [], 'imperial');
        expect(forecastDisplay.innerHTML).toContain('No forecast data available');
    });
});

describe('displayAlerts', () => {
    // Mock the activeAlertsLink element
    let activeAlertsLink: HTMLAnchorElement;
    let alertsDisplay: HTMLDivElement;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="alerts-display"></div>
            <div id="city-name-display">
                <a id="active-alerts-link" class="hidden"></a>
            </div>
        `;
        alertsDisplay = document.getElementById('alerts-display') as HTMLDivElement;
        activeAlertsLink = document.getElementById('active-alerts-link') as HTMLAnchorElement;
    });

    it('should display active alerts correctly and show the link', () => {
        const mockAlerts: WeatherAlert[] = [
            {
                sender_name: 'NWS',
                event: 'Severe Thunderstorm Warning',
                start: 1678886400,
                end: 1678890000,
                description: 'A severe thunderstorm warning is in effect.',
                tags: []
            }
        ];

        displayAlerts(alertsDisplay, activeAlertsLink, mockAlerts);

        expect(alertsDisplay.innerHTML).toContain('<h3>Active Alerts:</h3>');
        expect(alertsDisplay.innerHTML).toContain('Severe Thunderstorm Warning');
        expect(alertsDisplay.querySelectorAll('.alert-item').length).toBe(1);
        expect(activeAlertsLink.classList).not.toContain('hidden');
    });

    it('should display "No active weather alerts" and hide the link if no alerts', () => {
        displayAlerts(alertsDisplay, activeAlertsLink, []);
        expect(alertsDisplay.innerHTML).toContain('No active weather alerts');
        expect(activeAlertsLink.classList).toContain('hidden');
    });

    it('should display "No active weather alerts" and hide the link if alerts array is undefined', () => {
        displayAlerts(alertsDisplay, activeAlertsLink, undefined);
        expect(alertsDisplay.innerHTML).toContain('No active weather alerts');
        expect(activeAlertsLink.classList).toContain('hidden');
    });
});