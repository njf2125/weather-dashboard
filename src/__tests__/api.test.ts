// src/__tests__/api.test.ts
import { initializeUI, UIElements } from '../main';
import { OpenWeatherOneCallResponse } from '../interfaces';

// Mock the global fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Declare variables for DOM elements globally, but assign them in initializeUI
let cityInput: HTMLInputElement;
let searchButton: HTMLButtonElement;
let currentWeatherDisplay: HTMLDivElement;
let forecastDisplay: HTMLDivElement;
let alertsDisplay: HTMLDivElement;
let cityDisplayName: HTMLDivElement;
let locationNameSpan: HTMLSpanElement;
let activeAlertsLink: HTMLAnchorElement;
let unitToggle: HTMLDivElement;
let currentLocationButton: HTMLButtonElement;
let loadingOverlay: HTMLDivElement;
let errorMessageDisplay: HTMLDivElement;
let citySuggestions: HTMLDivElement;
let favoriteStar: HTMLSpanElement;

// Define mock responses
const mockGeocodingResponse = [
    {
        lat: 34.2257,
        lon: -77.9447,
        name: 'Wilmington',
        country: 'US',
        state: 'North Carolina',
    },
];

const mockWeatherResponse: OpenWeatherOneCallResponse = {
    lat: 34.2257,
    lon: -77.9447,
    timezone: 'America/New_York',
    timezone_offset: -14400,
    current: {
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
        wind_speed: 4.5,
        wind_deg: 200,
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
    },
    daily: Array.from({ length: 8 }, (_, i) => ({
        dt: 1678886400 + (i * 86400),
        sunrise: 0, sunset: 0, moonrise: 0, moonset: 0, moon_phase: 0,
        temp: { day: 20 + i, min: 10 + i, max: 30 + i, night: 0, eve: 0, morn: 0 },
        feels_like: { day: 0, night: 0, eve: 0, morn: 0 },
        pressure: 0, humidity: 0, dew_point: 0, wind_speed: 0, wind_deg: 0, wind_gust: 0,
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        clouds: 0, pop: 0.5, uvi: 0
    })),
    alerts: [{
        sender_name: 'NWS',
        event: 'Test Alert',
        start: 1678886000,
        end: 1678890000,
        description: 'This is a test alert description.',
        tags: []
    }],
};

describe('Weather Dashboard Public API', () => {
    let uiElements: UIElements;

    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
        localStorageMock.clear();

        document.body.innerHTML = `
            <div id="current-weather-display"></div>
            <div id="forecast-display"></div>
            <div id="alerts-display"></div>
            <div id="error-message"></div>
            <div id="city-name-display"><span id="location-name"></span><a id="active-alerts-link"></a></div>
            <input type="text" id="city-input">
            <button id="search-button"></button>
            <button id="current-location-button"></button>
            <div id="unit-toggle"></div>
            <div id="loading-overlay" class="hidden"></div>
            <div id="city-suggestions"></div>
            <span id="favorite-star"></span>
        `;

        cityInput = document.getElementById('city-input') as HTMLInputElement;
        searchButton = document.getElementById('search-button') as HTMLButtonElement;
        currentWeatherDisplay = document.getElementById('current-weather-display') as HTMLDivElement;
        forecastDisplay = document.getElementById('forecast-display') as HTMLDivElement;
        alertsDisplay = document.getElementById('alerts-display') as HTMLDivElement;
        cityDisplayName = document.getElementById('city-name-display') as HTMLDivElement;
        locationNameSpan = document.getElementById('location-name') as HTMLSpanElement;
        activeAlertsLink = document.getElementById('active-alerts-link') as HTMLAnchorElement;
        unitToggle = document.getElementById('unit-toggle') as HTMLDivElement;
        currentLocationButton = document.getElementById('current-location-button') as HTMLButtonElement;
        loadingOverlay = document.getElementById('loading-overlay') as HTMLDivElement;
        errorMessageDisplay = document.getElementById('error-message') as HTMLDivElement;
        citySuggestions = document.getElementById('city-suggestions') as HTMLDivElement;
        favoriteStar = document.getElementById('favorite-star') as HTMLSpanElement;

        uiElements = initializeUI();
    });

    it('should pass a basic test', () => {
        expect(true).toBe(true);
    });
});
