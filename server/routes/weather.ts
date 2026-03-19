import { RequestHandler } from "express";
import { WeatherForecastResponse } from "@shared/api";

const OPENWEATHER_BASE = "https://api.openweathermap.org";

export const handleWeatherForecast: RequestHandler = async (req, res) => {
  const { zip } = req.query;

  if (!zip || typeof zip !== "string" || !/^\d{5}$/.test(zip)) {
    res.status(400).json({ error: "Please provide a valid 5-digit zip code." });
    return;
  }

  const apiKey = process.env.VITE_OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: "Weather API key is not configured." });
    return;
  }

  try {
    // Step 1: ZIP to coordinates
    const zipRes = await fetch(
      `${OPENWEATHER_BASE}/geo/1.0/zip?zip=${zip},US&appid=${apiKey}`
    );
    if (!zipRes.ok) {
      res.status(404).json({ error: "Invalid zip code or location not found." });
      return;
    }
    const zipData = await zipRes.json();

    // Step 2: Reverse geocode for state name
    const reverseRes = await fetch(
      `${OPENWEATHER_BASE}/geo/1.0/reverse?lat=${zipData.lat}&lon=${zipData.lon}&limit=1&appid=${apiKey}`
    );
    if (!reverseRes.ok) {
      res.status(500).json({ error: "Failed to fetch location details." });
      return;
    }
    const [locationData] = await reverseRes.json();

    // Step 3: Fetch 5-day forecast
    const forecastRes = await fetch(
      `${OPENWEATHER_BASE}/data/2.5/forecast?lat=${zipData.lat}&lon=${zipData.lon}&appid=${apiKey}&units=imperial`
    );
    if (!forecastRes.ok) {
      res.status(500).json({ error: "Failed to fetch weather forecast." });
      return;
    }
    const forecastData = await forecastRes.json();

    // Attach state to city info
    forecastData.city.state = locationData?.state;

    const response: WeatherForecastResponse = forecastData;
    res.json(response);
  } catch (err) {
    console.error("Weather fetch error:", err);
    res.status(500).json({ error: "An unexpected error occurred while fetching weather data." });
  }
};
