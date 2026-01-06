## Phase 14: Deployment (GitHub Pages / Netlify / Vercel)

This is the final step to make your project live for everyone to see\! You'll need a GitHub account for this.

### Step 30: Set up Git and GitHub Repository

1.  **Initialize Git in your project:**
    ```bash
    git init
    ```
2.  **Create a `.gitignore` file** (to avoid committing unnecessary files):
    ```
    # Node modules
    /node_modules

    # Parcel build output
    /dist
    .parcel-cache/
    .env # If you ever use environment variables for API keys

    # TypeScript cache
    .tsbuildinfo
    ```
3.  **Make your first commit:**
    ```bash
    git add .
    git commit -m "Initial commit of weather dashboard project"
    ```
4.  **Create a new repository on GitHub:** Go to [https://github.com/new](https://github.com/new), give it a name (e.g., `weather-dashboard`), and leave it public. Do NOT initialize it with a README.
5.  **Link your local repository to GitHub and push:** GitHub will provide commands like:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/weather-dashboard.git
    git branch -M main
    git push -u origin main
    ```
    (Replace `YOUR_USERNAME` with your GitHub username).

### Step 31: Choose a Deployment Service

You have excellent options for deploying static sites for free. I recommend **Netlify** or **Vercel** over GitHub Pages for projects built with bundlers like Parcel, as they offer better continuous deployment and automatic setup.

#### Option A: Deploy with Netlify (Recommended)

1.  **Sign up for Netlify:** Go to [https://app.netlify.com/signup](https://app.netlify.com/signup) and sign up using your GitHub account.
2.  **Create a new site from Git:**
      * In your Netlify dashboard, click "Add new site" -\> "Import an existing project" -\> "Deploy with GitHub".
      * Authorize Netlify to access your GitHub repositories.
      * Select your `weather-dashboard` repository.
3.  **Configure deploy settings:**
      * **Owner:** Your GitHub username/organization.
      * **Branch to deploy:** `main` (or whatever your primary branch is).
      * **Build command:** `parcel build src/main.ts` (This tells Netlify how to compile your project).
      * **Publish directory:** `dist` (This is where Parcel puts your final bundled files).
      * Click "Deploy site".
4.  **Monitor Deployment:** Netlify will automatically build and deploy your site. You'll get a unique URL (e.g., `https://random-name-12345.netlify.app`). Netlify automatically sets up Continuous Deployment, so every time you push changes to your `main` branch on GitHub, Netlify will rebuild and update your live site\!
5.  **Optional: Change Site Name:** In Netlify settings for your site, you can change the generated URL to something more memorable.

#### Option B: Deploy with Vercel (Also Recommended)

1.  **Sign up for Vercel:** Go to [https://vercel.com/signup](https://vercel.com/signup) and sign up using your GitHub account.
2.  **Import Project:**
      * From your Vercel dashboard, click "Add New..." -\> "Project".
      * Select "Import Git Repository" and choose your `weather-dashboard` repository from GitHub.
3.  **Configure Project:**
      * **Root Directory:** Usually defaults correctly, but ensure it's the root of your project.
      * **Framework Preset:** Vercel might auto-detect "Parcel" or "Other." If "Other," no problem.
      * **Build Command:** `parcel build src/main.ts`
      * **Output Directory:** `dist`
      * Click "Deploy".
4.  **Monitor Deployment:** Vercel will build and deploy your site, providing a unique URL. Similar to Netlify, it provides Continuous Deployment.
