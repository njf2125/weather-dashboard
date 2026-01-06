# Weather Dashboard

A dynamic web application that displays current weather conditions, a 5-day forecast, and weather alerts for a specified location. It supports unit conversion, geolocation, and persists the last searched location.

## Features

*   **Current Weather Display:** Shows temperature (feels like), condition, humidity, wind speed, UV index, sunrise, and sunset times.
*   **5-Day Forecast:** Provides a daily forecast including high/low temperatures, conditions, and precipitation chances.
*   **Weather Alerts:** Displays active weather alerts for the searched location, with a clickable link to jump to the alerts section.
*   **Unit Conversion:** Toggle between Fahrenheit (°F) and Celsius (°C) for temperature readings.
*   **Geolocation Support:** Automatically fetches weather data for the user's current location.
*   **Loading States:** Displays a loading spinner during data fetching.
*   **Error Display:** Shows user-friendly error messages within the UI instead of intrusive `alert()` pop-ups.
*   **Last Search Persistence:** Remembers the last successfully searched location (city name or coordinates) and loads it on page refresh.
*   **Favorite Cities:** Add and remove favorite cities for quick access from the search bar.
*   **Secure Architecture:** Uses Cloudflare Pages Functions to securely proxy API requests, keeping the OpenWeatherMap API key safe.

## Tech Stack

*   **Frontend:** TypeScript, HTML, CSS
*   **Bundler:** Parcel
*   **Backend/Hosting:** Cloudflare Pages Functions
*   **Testing:** Jest

## Setup and Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/njf2125/weather-dashboard.git
    cd weather-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Obtain an OpenWeatherMap API Key:**
    *   Go to [OpenWeatherMap](https://openweathermap.org/api) and sign up for a free account.
    *   Generate an API key.

4.  **Configure Local Secrets:**
    Create a file named `.dev.vars` in the project root to store your API key locally.
    ```bash
    # .dev.vars
    OPENWEATHER_API_KEY=your_actual_api_key_here
    ```

5.  **Start the application:**
    You need to run two commands in separate terminal windows:

    **Terminal 1 (Frontend):**
    ```bash
    npm start
    ```
    (Wait for it to say "Server running at http://localhost:1234")

    **Terminal 2 (Backend Proxy):**
    ```bash
    npx wrangler pages dev --proxy 1234
    ```

6.  **Open the App:**
    Visit `http://localhost:8788` (the URL provided by Wrangler). **Do not** use the port 1234 URL, as it cannot access the backend functions.

## Deployment (Cloudflare Pages)

1.  **Push to GitHub.**
2.  **Create a Cloudflare Pages Project:**
    *   Connect your GitHub repo.
    *   **Framework preset:** None (or Parcel).
    *   **Build command:** `npm run build`
    *   **Output directory:** `dist`
3.  **Environment Variables:**
    *   Add `OPENWEATHER_API_KEY` with your actual key in the project settings.

## Running Tests

To run the unit and integration tests for the application:

```bash
npm test
```

## Project Structure

```
.
├── functions/
│   └── api/
│       └── weather.ts   # Server-side proxy function
├── src/
│   ├── interfaces.ts
│   ├── main.ts
│   └── __tests__/
│       ├── api.test.ts
│       └── display.test.ts
├── index.html
├── style.css
├── package.json
└── tsconfig.json
```