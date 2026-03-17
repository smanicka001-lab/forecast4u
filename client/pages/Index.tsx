import { useState } from "react";
import { TextInput, Button, Loading, Tile } from "@carbon/react";
import { Cloud } from "@carbon/icons-react";

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
  };
}

export default function Index() {
  const [zipCode, setZipCode] = useState("");
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode},us&appid=${apiKey}&units=imperial`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data. Please check the zip code.");
      }

      const data: ForecastResponse = await response.json();
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Cloud size={40} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Forecast4U</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Get your 5-day weather forecast in 3-hour increments
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
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
              <h2 className="text-2xl font-semibold text-gray-900">
                {forecast.city.name}, {forecast.city.country}
              </h2>
              <p className="text-gray-600">5-Day Forecast</p>
            </div>

            <div className="space-y-6">
              {Object.entries(groupByDay(forecast.list)).map(
                ([date, dayForecasts]) => (
                  <div key={date} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-blue-600 text-white px-6 py-3">
                      <h3 className="text-xl font-semibold">
                        {formatDate(dayForecasts[0].dt_txt)}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                      {dayForecasts.map((item) => (
                        <Tile key={item.dt} className="p-4 bg-white">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">
                                {formatTime(item.dt_txt)}
                              </span>
                              <img
                                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                                alt={item.weather[0].description}
                                className="w-12 h-12"
                              />
                            </div>
                            <div className="text-3xl font-bold text-gray-900">
                              {Math.round(item.main.temp)}°F
                            </div>
                            <div className="text-sm text-gray-600 capitalize">
                              {item.weather[0].description}
                            </div>
                            <div className="pt-2 border-t border-gray-200 space-y-1 text-xs text-gray-600">
                              <div className="flex justify-between">
                                <span>Feels like:</span>
                                <span className="font-medium">
                                  {Math.round(item.main.feels_like)}°F
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Humidity:</span>
                                <span className="font-medium">
                                  {item.main.humidity}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Wind:</span>
                                <span className="font-medium">
                                  {Math.round(item.wind.speed)} mph
                                </span>
                              </div>
                            </div>
                          </div>
                        </Tile>
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
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Cloud size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to check the weather?
            </h3>
            <p className="text-gray-600">
              Enter a ZIP code above to get started with your 5-day forecast.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
