### Phase 15: Implementing Tests with Jest

Our goal here will be to test some key parts of our application:

  * The API utility functions (`getLatLonFromCity`, `getWeatherData` - or at least their *calls* to `fetch`).
  * The display functions (`displayCurrentWeather`, `displayForecast`, `displayAlerts`) to ensure they render correctly.

#### Step 32: Install Jest and Related Dependencies

1.  **Stop your Parcel development server** (Ctrl+C in your terminal).
2.  **Install Jest and necessary TypeScript transformers:**
    We need `ts-jest` to allow Jest to understand TypeScript files, and `@types/jest` for Jest's type definitions.
    ```bash
    npm install --save-dev jest ts-jest @types/jest
    ```
    *(Or `yarn add --dev jest ts-jest @types/jest`)*

#### Step 33: Configure Jest

1.  **Initialize Jest config:**
    This command will guide you through creating a `jest.config.js` file.

    ```bash
    npx ts-jest config:init
    ```

    During the prompts, choose:

      * `jest-environment-jsdom` (for browser-like environment)
      * `ts-jest` for TypeScript

    This will generate a `jest.config.js` file in your project root.

2.  **Adjust `jest.config.js`:**
    Open the generated `jest.config.js` file and make sure the following properties are set. You might need to uncomment some or adjust paths.

    ```javascript
    /** @type {import('ts-jest').JestConfigWithTsJest} */
    module.exports = {
      preset: 'ts-jest',
      testEnvironment: 'jsdom', // Essential for testing DOM manipulations
      roots: ['<rootDir>/src'], // Jest should look for test files in the 'src' directory
      testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)', // Match test files in __tests__ folders
        '**/?(*.)+(spec|test).+(ts|tsx|js)' // Match .spec.ts or .test.ts files
      ],
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
      },
    };
    ```

#### Step 34: Create a Test Script in `package.json`

1.  **Open `package.json`** and add a `test` script:

    ```json
    {
      "name": "weather-dashboard",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "start": "parcel index.html",
        "test": "jest" // Add this line
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "devDependencies": {
        "parcel": "^2.x.x",
        "typescript": "^5.x.x",
        "jest": "^29.x.x", // Make sure versions match your install
        "ts-jest": "^29.x.x",
        "@types/jest": "^29.x.x"
      }
    }
    ```

#### Step 35: Write Your First Test File

We'll start by testing one of our display functions, as they directly manipulate the DOM and are easier to test without mocking API calls initially.

1.  **Create a `__tests__` directory** inside your `src` folder:

    ```bash
    mkdir src/__tests__
    ```

2.  **Create `src/__tests__/display.test.ts`**: This file will contain our tests.

    ```typescript
    // src/__tests__/display.test.ts
    import { CurrentWeatherData, DailyForecastData, WeatherDescription, WeatherAlert } from '../interfaces';
    // Import the functions you want to test
    import { displayCurrentWeather, displayForecast, displayAlerts } from '../main';

    // Mock the DOM elements
    let currentWeatherDisplay: HTMLElement;
    let forecastDisplay: HTMLElement;
    let alertsDisplay: HTMLElement;

    // Before each test, set up a fresh DOM environment
    beforeEach(() => {
        // Clear the entire document body
        document.body.innerHTML = `
            <div id="current-weather-display"></div>
            <div id="forecast-display"></div>
            <div id="alerts-display"></div>
        `;
        // Re-get references to ensure they point to the new elements
        currentWeatherDisplay = document.getElementById('current-weather-display') as HTMLDivElement;
        forecastDisplay = document.getElementById('forecast-display') as HTMLDivElement;
        alertsDisplay = document.getElementById('alerts-display') as HTMLDivElement;

        // Mock `document.getElementById` for functions that might call it internally,
        // if you want to avoid making them globally accessible.
        // For this simple case, direct export and reference is fine.
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
            displayCurrentWeather(mockCurrent);

            // Assertions
            expect(currentWeatherDisplay.innerHTML).toContain('Temperature: 25.5°C');
            expect(currentWeatherDisplay.innerHTML).toContain('Condition: scattered clouds');
            expect(currentWeatherDisplay.innerHTML).toContain('Humidity: 70%');
            expect(currentWeatherDisplay.innerHTML).toContain('Wind Speed: 4.5 m/s');
            expect(currentWeatherDisplay.innerHTML).toContain('UV Index: 5');
            expect(currentWeatherDisplay.querySelector('img')?.src).toContain('03d@2x.png');
        });

        it('should handle different temperature units correctly', () => {
            // To test units, you'd need to mock or pass the preferredUnits variable
            // Since displayCurrentWeather currently relies on a global `preferredUnits`,
            // we'd have to make it a parameter or mock the module.
            // For now, assume 'metric' is default based on main.ts
            // To properly test this, we'd refactor `preferredUnits` to be passed as an argument
            // to displayCurrentWeather or the main rendering logic.
            // Let's assume for now that the `preferredUnits` variable is accessible or mockable.
            // For a simple test, we confirm the current default behavior.
            const mockCurrent: CurrentWeatherData = {
                dt: 1678886400, sunrise: 0, sunset: 0, temp: 25.5, feels_like: 24.0, pressure: 0, humidity: 0, dew_point: 0, uvi: 0, clouds: 0, visibility: 0, wind_speed: 0, wind_deg: 0,
                weather: [{ id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
            };
            // Temporarily set preferredUnits for the test, then reset it
            const originalPreferredUnits = (window as any).preferredUnits; // Access global if it's not exported
            (window as any).preferredUnits = 'imperial'; // Set to imperial for this test
            displayCurrentWeather(mockCurrent);
            expect(currentWeatherDisplay.innerHTML).toContain('Temperature: 25.5°F'); // Assuming the global variable logic
            (window as any).preferredUnits = originalPreferredUnits; // Reset
        });
    });

    describe('displayForecast', () => {
        it('should display 7 forecast cards', () => {
            const mockDaily: DailyForecastData[] = Array.from({ length: 8 }, (_, i) => ({ // 8 days including today
                dt: 1678886400 + (i * 86400), // Increment by one day
                sunrise: 0, sunset: 0, moonrise: 0, moonset: 0, moon_phase: 0,
                temp: { day: 20 + i, min: 10 + i, max: 30 + i, night: 0, eve: 0, morn: 0 },
                feels_like: { day: 0, night: 0, eve: 0, morn: 0 },
                pressure: 0, humidity: 0, dew_point: 0, wind_speed: 0, wind_deg: 0, wind_gust: 0,
                weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
                clouds: 0, pop: 0, uvi: 0
            }));

            displayForecast(mockDaily);

            // The first element (daily[0]) is today's, so we expect 7 cards for the forecast
            expect(forecastDisplay.querySelectorAll('.forecast-card').length).toBe(7);
            expect(forecastDisplay.innerHTML).toContain('High: 30°C'); // Check content of one card
            expect(forecastDisplay.innerHTML).not.toContain('High: 20°C'); // Today's high should not be in forecast
        });

        it('should display "No forecast data available" if no forecast data', () => {
            displayForecast([]);
            expect(forecastDisplay.innerHTML).toContain('No forecast data available');
        });
    });

    describe('displayAlerts', () => {
        it('should display active alerts correctly', () => {
            const mockAlerts: WeatherAlert[] = [
                {
                    sender_name: 'NWS',
                    event: 'Severe Thunderstorm Warning',
                    start: 1678886400,
                    end: 1678890000,
                    description: 'A severe thunderstorm warning is in effect.',
                    tags: []
                },
                {
                    sender_name: 'Environment Canada',
                    event: 'Heat Advisory',
                    start: 1678895000,
                    end: 1678950000,
                    description: 'High temperatures expected.',
                    tags: []
                }
            ];

            displayAlerts(mockAlerts);

            expect(alertsDisplay.innerHTML).toContain('<h3>Active Alerts:</h3>');
            expect(alertsDisplay.innerHTML).toContain('Severe Thunderstorm Warning');
            expect(alertsDisplay.innerHTML).toContain('High temperatures expected.');
            expect(alertsDisplay.querySelectorAll('.alert-item').length).toBe(2);
        });

        it('should display "No active weather alerts" if no alerts', () => {
            displayAlerts([]);
            expect(alertsDisplay.innerHTML).toContain('No active weather alerts');
        });

        it('should display "No active weather alerts" if alerts array is undefined', () => {
            displayAlerts(undefined);
            expect(alertsDisplay.innerHTML).toContain('No active weather alerts');
        });
    });
    ```

    **Important Note on `preferredUnits` in Test:** The `preferredUnits` variable is currently a global `let` in `main.ts`. For proper unit testing, functions should ideally not rely on global state. A better approach would be to pass `preferredUnits` as a parameter to `displayCurrentWeather` and `displayForecast`. For now, I've added a temporary workaround `(window as any).preferredUnits = 'imperial';` in the test, but keep in mind that refactoring your display functions to accept `units` as an argument would make them more testable and reusable.

#### Step 36: Run Your Tests

1.  In your terminal (make sure your Parcel server is stopped):

    ```bash
    npm test
    ```

    *(Or `yarn test`)*

    You should see Jest run and report on the tests. Hopefully, they all pass\!

-----

### Phase 16: Testing Asynchronous Functions (API Calls)

Testing `getLatLonFromCity` and `getWeatherData` requires a bit more sophistication because they make network requests. We need to **mock** `fetch` (the browser's API for making network requests) so that our tests don't actually hit the internet.

#### Step 37: Mocking `fetch`

1.  **Create a mock file for `fetch`:** Jest has a powerful mocking system. Create `src/__mocks__/node-fetch.ts` (this is a common convention, as `node-fetch` is often used in Node.js, and Jest can sometimes get confused, so explicitly mocking it helps). This will automatically mock `node-fetch` if Jest tries to import it, but we mostly mock global `fetch`.

    For our browser-based `fetch`, we'll typically mock the global `fetch` directly in our test file or a setup file.

2.  **Modify `src/__tests__/display.test.ts` to include `fetch` mocking (or create a new test file)**

    It's often good to separate tests for display logic from tests for API interaction. Let's create a new test file.

    **Create `src/__tests__/api.test.ts`**:

    ```typescript
    // src/__tests__/api.test.ts
    // We need to import the functions we are testing from main.ts
    // We also need to import the interfaces for type checking
    import { getLatLonFromCity, getWeatherData } from '../main';
    import { OpenWeatherOneCallResponse } from '../interfaces';

    // Mock the global fetch function
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

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
            dt: 1678886400, sunrise: 0, sunset: 0, temp: 20.5, feels_like: 19.0, pressure: 0, humidity: 0, dew_point: 0, uvi: 0, clouds: 0, visibility: 0, wind_speed: 0, wind_deg: 0,
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        },
        daily: [], // Simplify for this test, as we're testing the API call, not display
        alerts: [{
            sender_name: 'NWS',
            event: 'Test Alert',
            start: 1678886000,
            end: 1678890000,
            description: 'This is a test alert description.',
            tags: []
        }],
    };

    describe('API Calls', () => {
        // Reset mocks before each test to ensure isolation
        beforeEach(() => {
            mockFetch.mockClear();
            // Clear the innerHTML of the display elements if they are affected by these calls
            // (e.g., if getWeatherData directly manipulates DOM, which it does)
            document.body.innerHTML = `
                <div id="current-weather-display"></div>
                <div id="forecast-display"></div>
                <div id="alerts-display"></div>
            `;
        });

        it('getLatLonFromCity should return coordinates for a valid city', async () => {
            // Configure the mock fetch to return a successful geocoding response
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockGeocodingResponse),
            });

            const city = 'Wilmington';
            const result = await getLatLonFromCity(city);

            // Assert that fetch was called with the correct URL
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining(`q=${city}%2CUS`));
            expect(result).toEqual({ lat: 34.2257, lon: -77.9447 });
        });

        it('getLatLonFromCity should return null if city not found', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([]), // Empty array indicates city not found
            });

            // Mock window.alert as it's called on city not found
            const originalAlert = window.alert;
            window.alert = jest.fn(); // Mock it
            try {
                const result = await getLatLonFromCity('NonExistentCity');
                expect(mockFetch).toHaveBeenCalled(); // Fetch still gets called
                expect(result).toBeNull();
                expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('City "NonExistentCity" not found'));
            } finally {
                window.alert = originalAlert; // Restore original alert
            }
        });

        it('getWeatherData should fetch and process weather data', async () => {
            mockFetch.mockResolvedValueOnce({ // First call for geocoding
                ok: true,
                json: () => Promise.resolve(mockGeocodingResponse),
            }).mockResolvedValueOnce({ // Second call for weather data
                ok: true,
                json: () => Promise.resolve(mockWeatherResponse),
            });

            // Need to mock display functions if we don't want them to actually render
            // Or ensure the DOM is correctly set up as in display.test.ts
            // For now, let's assume they are imported and called internally.

            // This test is more of an integration test for `getLatLonFromCity` -> `getWeatherData`
            // You might want to pass mock display elements directly if you don't want them to be global.
            // For the purpose of this example, let's just ensure the internal calls happen.

            // Since getWeatherData relies on `displayCurrentWeather`, `displayForecast`, `displayAlerts`
            // and they directly manipulate DOM, we need `jsdom` environment.
            // Also, we need to mock these functions if we don't want them to actually run.

            // For simplicity, let's just ensure getWeatherData's `fetch` is called correctly.
            // A truly isolated test for getWeatherData would pass in mocks for display functions.
            // As currently written, `getWeatherData` is tightly coupled to DOM elements and API key.

            // Let's create a simplified test for getWeatherData focusing on fetch call:
            await getWeatherData(mockGeocodingResponse[0].lat, mockGeocodingResponse[0].lon, 'Wilmington');

            // Expect fetch to have been called twice (once for geocoding, once for weather)
            expect(mockFetch).toHaveBeenCalledTimes(2);
            // Expect the second call to be the weather API call
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining(
                `${mockGeocodingResponse[0].lat}&lon=${mockGeocodingResponse[0].lon}&exclude=hourly,minutely`
            ));

            // You could also test if the display functions were called with correct data,
            // but that makes this more of an integration test.
            // For true unit testing, you'd export display functions separately and mock them here.
        });

        it('getWeatherData should handle API errors gracefully', async () => {
             mockFetch.mockResolvedValueOnce({ // geocoding success
                ok: true,
                json: () => Promise.resolve(mockGeocodingResponse),
            }).mockResolvedValueOnce({ // weather API failure
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            });

            const originalAlert = window.alert;
            window.alert = jest.fn(); // Mock window.alert

            try {
                await getWeatherData(mockGeocodingResponse[0].lat, mockGeocodingResponse[0].lon, 'Wilmington');
                expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('HTTP error! status: 500'));
            } finally {
                window.alert = originalAlert;
            }
        });
    });
    ```

      * **Important Setup:** Remember `global.fetch = mockFetch;` at the top of the test file. This intercepts all `fetch` calls.
      * **`mockResolvedValueOnce`:** This Jest method allows you to define what `fetch` will return for sequential calls. The first call will be for geocoding, the second for weather data.
      * **Testing Alerts:** Since `alert()` is a browser function, you need to mock it (`jest.fn()`) to prevent it from actually popping up during tests. Remember to restore it in a `finally` block or `afterEach`.
      * **`jsdom` Environment:** By setting `testEnvironment: 'jsdom'` in `jest.config.js`, Jest simulates a browser environment, allowing you to interact with `document.getElementById` and other DOM APIs.

#### Step 38: Run All Tests

1.  In your terminal:
    ```bash
    npm test
    ```
    This will now run both `display.test.ts` and `api.test.ts`.

-----

