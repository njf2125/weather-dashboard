This project is a weather dashboard application.

**Tech Stack:**
- TypeScript
- HTML/CSS
- Node.js
- Parcel
- Cloudflare Pages Functions (for secure API proxying)

**Key Features:**
- Displays current weather, 5-day forecast, and weather alerts.
- Unit conversion (Fahrenheit/Celsius).
- Geolocation support to fetch weather for current location.
- Loading states and improved error display.
- Persists last searched location.
- **Favorite Cities:** Add and remove favorite cities for quick access from the search bar.
- **Secure Backend:** Uses Cloudflare Pages Functions to hide the OpenWeatherMap API key.

**Key Files:**
- `index.html`: The main HTML file.
- `style.css`: The main stylesheet.
- `src/main.ts`: The main TypeScript file (frontend logic).
- `functions/api/weather.ts`: The server-side function acting as a proxy.
- `package.json`: The project's dependencies and scripts.

**Commands:**
- `npm install`: Install dependencies.
- `npm start`: Start the frontend development server (Parcel).
- `npx wrangler pages dev --proxy 1234`: Start the full-stack local development environment (Cloudflare emulator).
- `npm run build`: Build the project for deployment.
- `npm test`: Run tests.
