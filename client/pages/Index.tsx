import { useState, useEffect } from "react";
import { TextInput, Button, Loading, Tile, Toggle } from "@carbon/react";
import { Cloud, Asleep, Light } from "@carbon/icons-react";

interface WeatherData {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  pop: number;
}

interface ForecastResponse {
  list: WeatherData[];
  city: {
    name: string;
    country: string;
    state?: string;
  };
}

interface GeocodingResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export default function Index() {
  const [zipCode, setZipCode] = useState("");
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const fetchWeatherForecast = async () => {
    if (!zipCode || zipCode.length !== 5 || !/^\d{5}$/.test(zipCode)) {
      setError("Please enter a valid 5-digit zip code");
      return;
    }

    setLoading(true);
    setError("");
    setForecast(null);

    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

      // First, get the location details including state from geocoding API
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${apiKey}`
      );

      if (!geoResponse.ok) {
        throw new Error("Failed to fetch location data. Please check the zip code.");
      }

      const geoData: GeocodingResponse = await geoResponse.json();

      // Then get the forecast using coordinates
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${geoData.lat}&lon=${geoData.lon}&appid=${apiKey}&units=imperial`
      );

      if (!forecastResponse.ok) {
        throw new Error("Failed to fetch weather data.");
      }

      const data: ForecastResponse = await forecastResponse.json();

      // Add state information to the forecast data
      data.city.state = geoData.state;

      console.log('First forecast time:', data.list[0]?.dt_txt);
      console.log('Current time:', new Date().toISOString());
      console.log('Location data:', geoData);
      setForecast(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherForecast();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const groupByDay = (forecasts: WeatherData[]) => {
    const grouped: { [key: string]: WeatherData[] } = {};
    
    forecasts.forEach((forecast) => {
      const date = forecast.dt_txt.split(" ")[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(forecast);
    });

    return grouped;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Cloud size={40} className="text-blue-600" />
              <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Forecast4U</h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Light size={20} /> : <Asleep size={20} />}
              <span className="text-sm font-medium">{darkMode ? 'Light' : 'Dark'}</span>
            </button>
          </div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
            Get your 5-day weather forecast in 3-hour increments
          </p>
        </div>

        {/* Search Form */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mb-8`}>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1 max-w-md">
              <TextInput
                id="zipCode"
                labelText="Enter ZIP Code"
                placeholder="e.g., 10001"
                value={zipCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setZipCode(e.target.value)
                }
                invalid={!!error && !loading}
                invalidText={error}
                maxLength={5}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Get Forecast"}
            </Button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loading description="Fetching weather data..." withOverlay={false} />
          </div>
        )}

        {/* Forecast Results */}
        {forecast && !loading && (
          <div>
            <div className="mb-6">
              <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {forecast.city.name}, {forecast.city.state || forecast.city.country}
              </h2>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>5-Day Forecast</p>
            </div>

            <div className="space-y-6">
              {Object.entries(groupByDay(forecast.list)).map(
                ([date, dayForecasts]) => (
                  <div key={date} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
                    <div className={`${darkMode ? 'bg-blue-700' : 'bg-blue-600'} text-white px-6 py-3`}>
                      <h3 className="text-xl font-semibold">
                        {formatDate(dayForecasts[0].dt_txt)}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 p-6">
                      {dayForecasts.map((item) => (
                        <div key={item.dt} className="flex flex-col items-center">
                          <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                            {formatTime(item.dt_txt)}
                          </span>
                          <Tile className="p-0 w-full" style={{ backgroundColor: darkMode ? 'rgb(55, 65, 81)' : 'rgba(255, 255, 255, 1)', padding: '0' }}>
                            <div className={`space-y-2 border ${darkMode ? 'border-gray-600' : 'border-solid'} p-2 min-w-0 relative`}>
                              <img
                                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                                alt={item.weather[0].description}
                                className="w-10 h-10 absolute top-2 right-2"
                              />
                              <div className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                                {Math.round(item.main.temp)}°F
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'} capitalize leading-tight`}>
                                {item.weather[0].description}
                              </div>
                              <div className={`pt-2 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} space-y-1 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                <div className="flex justify-between gap-1">
                                  <span>Feels Like:</span>
                                  <span className="font-medium shrink-0">
                                    {Math.round(item.main.feels_like)}°F
                                  </span>
                                </div>
                                <div className="flex justify-between gap-1">
                                  <span>Humidity:</span>
                                  <span className="font-medium shrink-0">
                                    {item.main.humidity}%
                                  </span>
                                </div>
                                <div className="flex justify-between gap-1">
                                  <span>Wind:</span>
                                  <span className="font-medium shrink-0">
                                    {Math.round(item.wind.speed)} mph
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Tile>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!forecast && !loading && !error && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-12 text-center`}>
            <Cloud size={64} className={`mx-auto mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Ready to check the weather?
            </h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Enter a ZIP code above to get started with your 5-day forecast.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
