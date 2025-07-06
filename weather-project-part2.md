Fantastic\! That's a great start. Seeing "Hello from the Weather Dashboard\!" means our setup is working perfectly. Now for the exciting part: actually getting and displaying weather data\!

Here are the next few steps, focusing on fetching data from OpenWeatherMap and displaying the current conditions.

-----

### Phase 6: Fetching Current Weather Data

**Step 8: Define TypeScript Interfaces for API Data**

When working with APIs and TypeScript, it's a best practice to define **interfaces**. These are like blueprints that describe the shape of the data you expect to receive from the API. This helps TypeScript check your code for errors and provides excellent autocompletion in VS Code.

1.  **Create a new file `src/interfaces.ts`:**
    ```typescript
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
    ```

**Step 9: Implement the Weather Fetching Function**

Now, let's write the function that will make the API call.

1.  **Open `src/main.ts`** and add the following code. Remember to **replace `'YOUR_API_KEY'` with your actual OpenWeatherMap API key** you got in Step 3.

    ```typescript
    // src/main.ts
    import { OpenWeatherOneCallResponse, CurrentWeatherData, DailyForecastData, WeatherAlert } from './interfaces';

    console.log("Hello from the Weather Dashboard!");

    const API_KEY = 'YOUR_API_KEY'; // <<< REPLACE THIS WITH YOUR ACTUAL API KEY
    const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';

    // Get references to our HTML elements
    const cityInput = document.getElementById('city-input') as HTMLInputElement;
    const searchButton = document.getElementById('search-button') as HTMLButtonElement;
    const currentWeatherDisplay = document.getElementById('current-weather-display') as HTMLDivElement;
    const forecastDisplay = document.getElementById('forecast-display') as HTMLDivElement;
    const alertsDisplay = document.getElementById('alerts-display') as HTMLDivElement;

    // Function to fetch weather data
    async function getWeatherData(lat: number, lon: number) {
        const url = `${BASE_URL}?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`;
        // Note: units=metric gives Celsius, set to 'imperial' for Fahrenheit

        try {
            const response = await fetch(url);
            if (!response.ok) {
                // If response is not 2xx, throw an error
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: OpenWeatherOneCallResponse = await response.json();
            console.log("Weather data received:", data); // Log the full response to inspect it

            displayCurrentWeather(data.current);
            displayForecast(data.daily);
            displayAlerts(data.alerts);

        } catch (error) {
            console.error("Could not fetch weather data:", error);
            alert(`Failed to fetch weather data: ${error instanceof Error ? error.message : "Unknown error"}`);
            currentWeatherDisplay.innerHTML = '<p>Failed to load current weather.</p>';
            forecastDisplay.innerHTML = '<p>Failed to load forecast.</p>';
            alertsDisplay.innerHTML = '<p>Failed to load alerts.</p>';
        }
    }

    // Function to get Lat/Lon from city name (using OpenWeatherMap's Geocoding API)
    async function getLatLonFromCity(cityName: string): Promise<{ lat: number; lon: number } | null> {
        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
        try {
            const response = await fetch(geoUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.length > 0) {
                console.log("Geocoding data:", data[0]); // Log geocoding data
                return { lat: data[0].lat, lon: data[0].lon };
            } else {
                alert(`City not found: ${cityName}. Please try again.`);
                return null;
            }
        } catch (error) {
            console.error("Error fetching geocoding data:", error);
            alert(`Failed to get coordinates for city: ${error instanceof Error ? error.message : "Unknown error"}`);
            return null;
        }
    }


    // Function to display current weather
    function displayCurrentWeather(current: CurrentWeatherData) {
        // Clear previous content
        currentWeatherDisplay.innerHTML = '';

        const weatherIconUrl = `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
        const date = new Date(current.dt * 1000); // Convert Unix timestamp to Date object

        currentWeatherDisplay.innerHTML = `
            <h3>${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h3>
            <p>Temperature: ${current.temp}°C (Feels like: ${current.feels_like}°C)</p>
            <p>Condition: ${current.weather[0].description} <img src="${weatherIconUrl}" alt="${current.weather[0].description}"></p>
            <p>Humidity: ${current.humidity}%</p>
            <p>Wind Speed: ${current.wind_speed} m/s</p>
            <p>UV Index: ${current.uvi}</p>
        `;
    }

    // Function to display forecast (we'll implement this more fully in the next step)
    function displayForecast(daily: DailyForecastData[]) {
        forecastDisplay.innerHTML = ''; // Clear previous content
        // This will be populated in a later step
        forecastDisplay.innerHTML = '<p>Forecast data will appear here.</p>';
        console.log("Daily Forecast Data (first 7 days):", daily.slice(1, 8)); // Log the daily data
    }

    // Function to display alerts (we'll implement this more fully in the next step)
    function displayAlerts(alerts?: WeatherAlert[]) {
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
        } else {
            alertsDisplay.innerHTML = '<p>No active weather alerts.</p>';
        }
    }


    // Add an event listener to the search button
    searchButton.addEventListener('click', async () => {
        const city = cityInput.value.trim(); // .trim() removes leading/trailing whitespace
        if (city) {
            console.log(`Searching for weather in: ${city}`);
            const coords = await getLatLonFromCity(city);
            if (coords) {
                getWeatherData(coords.lat, coords.lon);
            }
        } else {
            alert('Please enter a city name!');
            currentWeatherDisplay.innerHTML = '';
            forecastDisplay.innerHTML = '';
            alertsDisplay.innerHTML = '';
        }
    });
    ```

    *Make sure you saved both `src/interfaces.ts` and `src/main.ts`\!*

**Step 10: Test Current Weather Fetching and Display**

1.  **Ensure your development server is running:** If you stopped it, run `npm start` (or `yarn start`) in your terminal.
2.  **Open your browser** to `http://localhost:1234`.
3.  **Enter a city name** (e.g., "London", "New York", "Tokyo") into the input field and click "Search".
4.  **Check the console (F12)** for any errors and to see the `Weather data received` log.
5.  **Observe the "Current Conditions" section.** You should see the temperature, description, humidity, and wind speed dynamically updated.

**Important Considerations for the Gemini CLI:**

Since you'll be using the Gemini CLI, it's crucial to format this plan so it can be easily understood and executed. When the plan is finalized, I'll format it as a complete Markdown file, ready for the CLI.

-----

### Check-in Questions:

1.  Were you able to create the `src/interfaces.ts` file and paste the content correctly?
2.  Did you remember to **replace `'YOUR_API_KEY'` in `src/main.ts`** with your actual OpenWeatherMap API key? This is a common point of failure\!
3.  When you ran `npm start` and searched for a city, did you see the current weather details appear on your page?
4.  Did you see any errors in your browser's developer console (F12, then "Console")?

Let me know how this goes\! This is a big step, and getting the API call working is a major milestone. We'll refine the forecast display and styling once this part is solid.