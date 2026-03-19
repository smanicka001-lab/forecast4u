# Forecast4U

A 5-day weather forecast app that displays 3-hour interval forecasts by US ZIP code. Built with React, TypeScript, and the OpenWeatherMap API.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [pnpm](https://pnpm.io/) (install with `npm install -g pnpm`)
- An [OpenWeatherMap API key](https://openweathermap.org/appid) (free tier available)

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <repo-folder>
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root of the project and add your OpenWeatherMap API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:8080`.

## Available Commands

| Command           | Description                          |
|-------------------|--------------------------------------|
| `pnpm dev`        | Start development server             |
| `pnpm build`      | Build for production                 |
| `pnpm start`      | Start production server              |
| `pnpm test`       | Run unit tests                       |
| `pnpm typecheck`  | Run TypeScript type checking         |

## Project Structure

```
client/           # React frontend
├── pages/        # Route components (Index.tsx = home)
├── components/   # Reusable UI components
└── hooks/        # Custom React hooks

server/           # Express API backend
└── routes/       # API route handlers

shared/           # Types shared between client and server
```

## Deployment

This app is configured for deployment on Netlify. Ensure the `VITE_OPENWEATHER_API_KEY` environment variable is set in your Netlify project settings before deploying.
