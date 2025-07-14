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

## Tech Stack

*   **Frontend:** TypeScript, HTML, CSS
*   **Bundler:** Parcel
*   **Testing:** Jest

## Setup and Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/njf2125/weather-dashboard-gemini.git
    cd weather-dashboard-gemini
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Obtain an OpenWeatherMap API Key:**
    *   Go to [OpenWeatherMap](https://openweathermap.org/api) and sign up for a free account.
    *   Generate an API key.

4.  **Update API Key in `src/main.ts`:**
    Open `src/main.ts` and replace `'YOUR_API_KEY_HERE'` with your actual OpenWeatherMap API key:
    ```typescript
    const API_KEY = '63f740ae509cf372418696e2940a01f2'; // <<< REPLACE THIS WITH YOUR ACTUAL API KEY
    ```

5.  **Start the development server:**
    ```bash
    npm start
    ```
    This will open the application in your browser, usually at `http://localhost:1234`.

## Running Tests

To run the unit and integration tests for the application:

```bash
npm test
```

## Project Structure

```
.
├── public/
│   └── index.html
│   └── style.css
├── src/
│   ├── interfaces.ts
│   ├── main.ts
│   └── __tests__/
│       ├── api.test.ts
│       └── display.test.ts
├── package.json
├── package-lock.json
├── jest.config.js
└── tsconfig.json
```