Awesome\! This is going to be a fantastic project to learn the ropes of modern web development. Since this is your first project, we'll break it down into manageable steps. We'll use **OpenWeatherMap's One Call API 3.0** as it provides all the data you need (current, 8-day forecast which covers your 7-day requirement, and alerts) in a single, convenient call.

Here's a step-by-step plan. I'll ask you questions along the way to make sure we're on the right track\!

-----

## Project Plan: Weather Dashboard Application

**Goal:** Build a web application that displays current weather conditions, a 7-day forecast, and active weather alerts for a user-specified location.

**Tools:**

  * **VS Code:** Your code editor.
  * **TypeScript:** The language we'll use for type-safe JavaScript.
  * **HTML/CSS:** For the structure and styling of your web page.
  * **Node.js & npm/yarn:** For managing project dependencies and running development servers.
  * **OpenWeatherMap One Call API 3.0:** Our data source.
  * **Git & GitHub:** For version control and showcasing your project.

-----

### Phase 1: Setup & Basic HTML Structure

**Step 1: Initialize Your Project**

1.  **Create a new directory** for your project. You can do this from your terminal:
    ```bash
    mkdir weather-dashboard
    cd weather-dashboard
    ```
2.  **Initialize a Node.js project:** This will create a `package.json` file to manage your project's dependencies.
    ```bash
    npm init -y
    ```
    *(Alternatively, if you prefer `yarn`: `yarn init -y`)*
3.  **Install TypeScript:**
    ```bash
    npm install typescript --save-dev
    ```
    *(Or `yarn add typescript --dev`)*
4.  **Create a `tsconfig.json` file:** This configures the TypeScript compiler.
    ```bash
    npx tsc --init
    ```
    This command generates a `tsconfig.json` file with many commented-out options. For our initial project, we can keep most of the defaults, but we'll uncomment and adjust a few crucial ones. We'll revisit this when we start writing TypeScript.

**Step 2: Create Basic HTML File**

1.  **Create an `index.html` file** in your project's root directory. This will be the main entry point for your web application.
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weather Dashboard</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <header>
            <h1>Weather Dashboard</h1>
        </header>
        <main>
            <section id="search-section">
                <input type="text" id="city-input" placeholder="Enter city name">
                <button id="search-button">Search</button>
            </section>

            <section id="current-weather">
                <h2>Current Conditions</h2>
                <div id="current-weather-display">
                    </div>
            </section>

            <section id="forecast">
                <h2>7-Day Forecast</h2>
                <div id="forecast-display">
                    </div>
            </section>

            <section id="alerts">
                <h2>Weather Alerts</h2>
                <div id="alerts-display">
                    </div>
            </section>
        </main>

        <script src="dist/bundle.js"></script>
    </body>
    </html>
    ```
2.  **Create a `style.css` file** in your project's root directory. For now, it can be empty, or just add a basic background color to confirm it's linked:
    ```css
    body {
        font-family: sans-serif;
        background-color: #f0f0f0;
        margin: 20px;
    }
    ```
    *(**Note:** We're linking `dist/bundle.js` even though it doesn't exist yet. This is where our compiled TypeScript code will end up.)*

-----

### Phase 2: OpenWeatherMap API Setup

**Step 3: Get Your OpenWeatherMap API Key**

1.  Go to [https://openweathermap.org/](https://openweathermap.org/).
2.  Click on "Sign Up" and create a free account.
3.  Once signed in, navigate to the "API keys" tab in your profile (usually under your username in the top right, then "My API Keys").
4.  Copy your generated API key. It might take a few minutes (up to an hour) for a new key to become active.

**Important Note about API Keys:** For a simple demo project, it's common to hardcode the API key directly into your front-end TypeScript file. However, in a real-world production application, you would *never* do this\! API keys should be kept secure, typically by using a backend server to make API calls or by using environment variables that are loaded securely during the build process. For this learning project, hardcoding will be okay for now, but keep this security principle in mind for future projects\!

-----

### Phase 3: Project Structure for TypeScript

To make our TypeScript development smoother, especially for a single-page application like this, we'll use a **bundler**. A bundler like Webpack or Parcel takes all your JavaScript/TypeScript files, processes them, and combines them into a single file (or a few files) that your `index.html` can easily load. This makes managing modules and dependencies much easier.

Since this is your first project, I recommend **Parcel** because it's known for being zero-configuration and very easy to get started with.

**Step 4: Install Parcel**

1.  In your terminal, within your `weather-dashboard` directory:
    ```bash
    npm install parcel --save-dev
    ```
    *(Or `yarn add parcel --dev`)*

**Step 5: Adjust `package.json` for Parcel**

1.  Open your `package.json` file.
2.  Add a `start` script to the `scripts` section. This will tell Parcel to build and serve your application.
    ```json
    {
      "name": "weather-dashboard",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "start": "parcel index.html",
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "devDependencies": {
        "parcel": "^2.x.x", // Make sure this matches your installed version
        "typescript": "^5.x.x" // Make sure this matches your installed version
      }
    }
    ```
    *(The `^2.x.x` and `^5.x.x` indicate "compatible with version 2" and "compatible with version 5" respectively. Parcel will automatically detect your `index.html` and the `script` tag within it, then process your TypeScript\!)*

-----

### Phase 4: Initial TypeScript Logic

**Step 6: Create Your Main TypeScript File**

1.  Create a new directory called `src` in your project root:
    ```bash
    mkdir src
    ```
2.  Inside the `src` directory, create `main.ts`:
    ```typescript
    // src/main.ts
    console.log("Hello from the Weather Dashboard!");

    // Get references to our HTML elements
    const cityInput = document.getElementById('city-input') as HTMLInputElement;
    const searchButton = document.getElementById('search-button') as HTMLButtonElement;

    // Add an event listener to the search button
    searchButton.addEventListener('click', () => {
        const city = cityInput.value;
        if (city) {
            console.log(`Searching for weather in: ${city}`);
            // Later, we'll call our weather fetching function here
        } else {
            alert('Please enter a city name!');
        }
    });
    ```
3.  **Update `index.html` to point to `src/main.ts`**:
    Change this line:
    ```html
    <script src="dist/bundle.js"></script>
    ```
    To this:
    ```html
    <script type="module" src="src/main.ts"></script>
    ```
    *(Parcel will automatically handle compiling and bundling `src/main.ts` into a format the browser can understand.)*

-----

### Phase 5: Run Your Application\!

**Step 7: Start the Development Server**

1.  In your terminal, from the `weather-dashboard` root directory:

    ```bash
    npm start
    ```

    *(Or `yarn start`)*

    Parcel will now build your project and start a local development server, usually on `http://localhost:1234`. It will also automatically rebuild and refresh your browser whenever you save changes to your files\!

-----

### Check-in Questions:

Before we move on to fetching real weather data, how does this initial plan feel?

1.  Have you been able to successfully create the directories and files?
2.  Are you comfortable with the commands like `npm init` and `npm install`?
3.  Were you able to get an API key from OpenWeatherMap?
4.  Did `npm start` launch your application in the browser, and do you see "Hello from the Weather Dashboard\!" in your browser's developer console (F12, then "Console" tab)?

Let me know, and we'll tackle the exciting part of making API calls next\!
