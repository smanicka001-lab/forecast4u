import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Index from "./Index";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Index Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    mockFetch.mockClear();
    localStorage.clear();
  });

  describe("Initial Render", () => {
    it("should render the main heading", () => {
      render(<Index />);
      expect(screen.getByText("Forecast4U")).toBeInTheDocument();
    });

    it("should render the subtitle", () => {
      render(<Index />);
      expect(
        screen.getByText("Get your 5-day weather forecast in 3-hour increments")
      ).toBeInTheDocument();
    });

    it("should render the zip code input field", () => {
      render(<Index />);
      expect(screen.getByLabelText("Enter ZIP Code")).toBeInTheDocument();
    });

    it("should render the submit button", () => {
      render(<Index />);
      expect(screen.getByRole("button", { name: /get forecast/i })).toBeInTheDocument();
    });

    it("should render the empty state message", () => {
      render(<Index />);
      expect(screen.getByText("Ready to check the weather?")).toBeInTheDocument();
    });
  });

  describe("Dark Mode Toggle", () => {
    it("should render dark mode toggle button", () => {
      render(<Index />);
      expect(screen.getByRole("button", { name: /toggle dark mode/i })).toBeInTheDocument();
    });

    it("should toggle dark mode when clicked", async () => {
      render(<Index />);
      const toggleButton = screen.getByRole("button", { name: /toggle dark mode/i });
      
      // Initially in light mode
      expect(toggleButton).toHaveTextContent("Dark");
      
      // Click to enable dark mode
      await userEvent.click(toggleButton);
      expect(toggleButton).toHaveTextContent("Light");
      
      // Click again to disable dark mode
      await userEvent.click(toggleButton);
      expect(toggleButton).toHaveTextContent("Dark");
    });

    it("should persist dark mode preference in localStorage", async () => {
      render(<Index />);
      const toggleButton = screen.getByRole("button", { name: /toggle dark mode/i });
      
      await userEvent.click(toggleButton);
      
      expect(localStorage.getItem("darkMode")).toBe("true");
    });

    it("should load dark mode preference from localStorage", () => {
      localStorage.setItem("darkMode", "true");
      render(<Index />);
      
      const toggleButton = screen.getByRole("button", { name: /toggle dark mode/i });
      expect(toggleButton).toHaveTextContent("Light");
    });
  });

  describe("Form Validation", () => {
    it("should show error for empty zip code", async () => {
      render(<Index />);
      const submitButton = screen.getByRole("button", { name: /get forecast/i });
      
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("Please enter a valid 5-digit zip code")).toBeInTheDocument();
      });
    });

    it("should show error for invalid zip code (less than 5 digits)", async () => {
      render(<Index />);
      const input = screen.getByLabelText("Enter ZIP Code");
      const submitButton = screen.getByRole("button", { name: /get forecast/i });
      
      await userEvent.type(input, "123");
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("Please enter a valid 5-digit zip code")).toBeInTheDocument();
      });
    });

    it("should show error for non-numeric zip code", async () => {
      render(<Index />);
      const input = screen.getByLabelText("Enter ZIP Code");
      const submitButton = screen.getByRole("button", { name: /get forecast/i });
      
      await userEvent.type(input, "abcde");
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("Please enter a valid 5-digit zip code")).toBeInTheDocument();
      });
    });

    it("should accept valid 5-digit zip code without errors", async () => {
      render(<Index />);
      const input = screen.getByLabelText("Enter ZIP Code");

      await userEvent.type(input, "90210");

      // Input should accept the value
      expect(input).toHaveValue("90210");

      // Should not show validation error for valid zip code
      expect(screen.queryByText("Please enter a valid 5-digit zip code")).not.toBeInTheDocument();
    });
  });

  describe("Weather Forecast Fetching", () => {
    it("should fetch and display weather forecast", async () => {
      const mockGeoResponse = {
        zip: "90210",
        name: "Beverly Hills",
        lat: 34.0901,
        lon: -118.4065,
        country: "US",
      };

      const mockReverseGeoResponse = [
        {
          name: "Beverly Hills",
          lat: 34.0901,
          lon: -118.4065,
          country: "US",
          state: "California",
        },
      ];

      const mockForecastResponse = {
        list: [
          {
            dt: 1234567890,
            dt_txt: "2024-01-01 12:00:00",
            main: {
              temp: 75,
              feels_like: 73,
              humidity: 50,
              temp_min: 70,
              temp_max: 80,
              pressure: 1013,
            },
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "clear sky",
                icon: "01d",
              },
            ],
            clouds: { all: 0 },
            wind: { speed: 5, deg: 180 },
            pop: 0,
          },
        ],
        city: {
          name: "Beverly Hills",
          country: "US",
        },
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGeoResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockReverseGeoResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        });

      render(<Index />);
      const input = screen.getByLabelText("Enter ZIP Code");
      const submitButton = screen.getByRole("button", { name: /get forecast/i });
      
      await userEvent.type(input, "90210");
      await userEvent.click(submitButton);
      
      // Wait for forecast to be displayed
      await waitFor(() => {
        expect(screen.getByText("Beverly Hills, California")).toBeInTheDocument();
      });

      expect(screen.getByText("5-Day Forecast (Times in EDT)")).toBeInTheDocument();
      expect(screen.getByText("75°F")).toBeInTheDocument();
      expect(screen.getByText("clear sky")).toBeInTheDocument();
    });

    it("should handle API errors gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      render(<Index />);
      const input = screen.getByLabelText("Enter ZIP Code");
      const submitButton = screen.getByRole("button", { name: /get forecast/i });
      
      await userEvent.type(input, "00000");
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(
          screen.getByText("Failed to fetch location data. Please check the zip code.")
        ).toBeInTheDocument();
      });
    });

    it("should make correct API calls with zip code", async () => {
      const mockGeoResponse = {
        zip: "10001",
        name: "New York",
        lat: 40.7128,
        lon: -74.0060,
        country: "US",
      };

      const mockReverseGeoResponse = [
        {
          name: "New York",
          lat: 40.7128,
          lon: -74.0060,
          country: "US",
          state: "New York",
        },
      ];

      const mockForecastResponse = {
        list: [],
        city: { name: "New York", country: "US" },
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGeoResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockReverseGeoResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        });

      render(<Index />);
      const input = screen.getByLabelText("Enter ZIP Code");
      const submitButton = screen.getByRole("button", { name: /get forecast/i });
      
      await userEvent.type(input, "10001");
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining("geo/1.0/zip?zip=10001,US")
        );
      });
    });
  });

  describe("Refresh Functionality", () => {
    it("should display refresh button after forecast is loaded", async () => {
      const mockGeoResponse = {
        zip: "90210",
        name: "Beverly Hills",
        lat: 34.0901,
        lon: -118.4065,
        country: "US",
      };

      const mockReverseGeoResponse = [
        {
          name: "Beverly Hills",
          lat: 34.0901,
          lon: -118.4065,
          country: "US",
          state: "California",
        },
      ];

      const mockForecastResponse = {
        list: [
          {
            dt: 1234567890,
            dt_txt: "2024-01-01 12:00:00",
            main: {
              temp: 75,
              feels_like: 73,
              humidity: 50,
              temp_min: 70,
              temp_max: 80,
              pressure: 1013,
            },
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "clear sky",
                icon: "01d",
              },
            ],
            clouds: { all: 0 },
            wind: { speed: 5, deg: 180 },
            pop: 0,
          },
        ],
        city: {
          name: "Beverly Hills",
          country: "US",
        },
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGeoResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockReverseGeoResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        });

      render(<Index />);
      const input = screen.getByLabelText("Enter ZIP Code");
      const submitButton = screen.getByRole("button", { name: /get forecast/i });

      await userEvent.type(input, "90210");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Beverly Hills, California")).toBeInTheDocument();
      });

      expect(screen.getByRole("button", { name: /refresh/i })).toBeInTheDocument();
    });

    it("should display last updated timestamp after forecast is loaded", async () => {
      const mockGeoResponse = {
        zip: "90210",
        name: "Beverly Hills",
        lat: 34.0901,
        lon: -118.4065,
        country: "US",
      };

      const mockReverseGeoResponse = [
        {
          name: "Beverly Hills",
          lat: 34.0901,
          lon: -118.4065,
          country: "US",
          state: "California",
        },
      ];

      const mockForecastResponse = {
        list: [
          {
            dt: 1234567890,
            dt_txt: "2024-01-01 12:00:00",
            main: {
              temp: 75,
              feels_like: 73,
              humidity: 50,
              temp_min: 70,
              temp_max: 80,
              pressure: 1013,
            },
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "clear sky",
                icon: "01d",
              },
            ],
            clouds: { all: 0 },
            wind: { speed: 5, deg: 180 },
            pop: 0,
          },
        ],
        city: {
          name: "Beverly Hills",
          country: "US",
        },
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGeoResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockReverseGeoResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        });

      render(<Index />);
      const input = screen.getByLabelText("Enter ZIP Code");
      const submitButton = screen.getByRole("button", { name: /get forecast/i });

      await userEvent.type(input, "90210");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
      });
    });

    it("should refetch data when refresh button is clicked", async () => {
      const mockGeoResponse = {
        zip: "90210",
        name: "Beverly Hills",
        lat: 34.0901,
        lon: -118.4065,
        country: "US",
      };

      const mockReverseGeoResponse = [
        {
          name: "Beverly Hills",
          lat: 34.0901,
          lon: -118.4065,
          country: "US",
          state: "California",
        },
      ];

      const mockForecastResponse = {
        list: [
          {
            dt: 1234567890,
            dt_txt: "2024-01-01 12:00:00",
            main: {
              temp: 75,
              feels_like: 73,
              humidity: 50,
              temp_min: 70,
              temp_max: 80,
              pressure: 1013,
            },
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "clear sky",
                icon: "01d",
              },
            ],
            clouds: { all: 0 },
            wind: { speed: 5, deg: 180 },
            pop: 0,
          },
        ],
        city: {
          name: "Beverly Hills",
          country: "US",
        },
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGeoResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockReverseGeoResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGeoResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockReverseGeoResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        });

      render(<Index />);
      const input = screen.getByLabelText("Enter ZIP Code");
      const submitButton = screen.getByRole("button", { name: /get forecast/i });

      await userEvent.type(input, "90210");
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Beverly Hills, California")).toBeInTheDocument();
      });

      const refreshButton = screen.getByRole("button", { name: /refresh/i });
      await userEvent.click(refreshButton);

      // Verify that fetch was called again (6 total: 3 initial + 3 refresh)
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(6);
      });
    });
  });

  describe("Forecast Display", () => {
    it("should display weather details correctly", async () => {
      const mockGeoResponse = {
        zip: "90210",
        name: "Beverly Hills",
        lat: 34.0901,
        lon: -118.4065,
        country: "US",
      };

      const mockReverseGeoResponse = [
        {
          name: "Beverly Hills",
          lat: 34.0901,
          lon: -118.4065,
          country: "US",
          state: "California",
        },
      ];

      const mockForecastResponse = {
        list: [
          {
            dt: 1234567890,
            dt_txt: "2024-01-01 12:00:00",
            main: {
              temp: 75,
              feels_like: 73,
              humidity: 50,
              temp_min: 70,
              temp_max: 80,
              pressure: 1013,
            },
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "clear sky",
                icon: "01d",
              },
            ],
            clouds: { all: 0 },
            wind: { speed: 5, deg: 180 },
            pop: 0,
          },
        ],
        city: {
          name: "Beverly Hills",
          country: "US",
        },
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGeoResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockReverseGeoResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForecastResponse,
        });

      render(<Index />);
      const input = screen.getByLabelText("Enter ZIP Code");
      const submitButton = screen.getByRole("button", { name: /get forecast/i });
      
      await userEvent.type(input, "90210");
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("75°F")).toBeInTheDocument();
        expect(screen.getByText("73°F")).toBeInTheDocument(); // Feels like
        expect(screen.getByText("50%")).toBeInTheDocument(); // Humidity
        expect(screen.getByText("5 mph")).toBeInTheDocument(); // Wind
      });
    });
  });
});
