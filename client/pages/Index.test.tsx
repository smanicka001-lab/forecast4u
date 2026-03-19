import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Index from "./Index";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

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
      weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
      clouds: { all: 0 },
      wind: { speed: 5, deg: 180 },
      pop: 0,
    },
  ],
  city: {
    name: "Beverly Hills",
    country: "US",
    state: "California",
  },
};

function mockSuccessfulFetch() {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockForecastResponse,
  });
}

describe("Index Component", () => {
  beforeEach(() => {
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

      expect(toggleButton).toHaveTextContent("Dark");
      await userEvent.click(toggleButton);
      expect(toggleButton).toHaveTextContent("Light");
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
      await userEvent.click(screen.getByRole("button", { name: /get forecast/i }));
      await waitFor(() => {
        expect(screen.getByText("Please enter a valid 5-digit zip code")).toBeInTheDocument();
      });
    });

    it("should show error for invalid zip code (less than 5 digits)", async () => {
      render(<Index />);
      await userEvent.type(screen.getByLabelText("Enter ZIP Code"), "123");
      await userEvent.click(screen.getByRole("button", { name: /get forecast/i }));
      await waitFor(() => {
        expect(screen.getByText("Please enter a valid 5-digit zip code")).toBeInTheDocument();
      });
    });

    it("should show error for non-numeric zip code", async () => {
      render(<Index />);
      await userEvent.type(screen.getByLabelText("Enter ZIP Code"), "abcde");
      await userEvent.click(screen.getByRole("button", { name: /get forecast/i }));
      await waitFor(() => {
        expect(screen.getByText("Please enter a valid 5-digit zip code")).toBeInTheDocument();
      });
    });

    it("should accept valid 5-digit zip code without errors", async () => {
      render(<Index />);
      await userEvent.type(screen.getByLabelText("Enter ZIP Code"), "90210");
      expect(screen.getByLabelText("Enter ZIP Code")).toHaveValue("90210");
      expect(screen.queryByText("Please enter a valid 5-digit zip code")).not.toBeInTheDocument();
    });
  });

  describe("Weather Forecast Fetching", () => {
    it("should call the server proxy endpoint with the zip code", async () => {
      mockSuccessfulFetch();
      render(<Index />);
      await userEvent.type(screen.getByLabelText("Enter ZIP Code"), "90210");
      await userEvent.click(screen.getByRole("button", { name: /get forecast/i }));
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/weather/forecast?zip=90210");
      });
    });

    it("should fetch and display weather forecast", async () => {
      mockSuccessfulFetch();
      render(<Index />);
      await userEvent.type(screen.getByLabelText("Enter ZIP Code"), "90210");
      await userEvent.click(screen.getByRole("button", { name: /get forecast/i }));

      await waitFor(() => {
        expect(screen.getByText("Beverly Hills, California")).toBeInTheDocument();
      });
      expect(screen.getByText("5-Day Forecast (Times in EDT)")).toBeInTheDocument();
      expect(screen.getByText("75°F")).toBeInTheDocument();
      expect(screen.getByText("clear sky")).toBeInTheDocument();
    });

    it("should handle server API errors gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Invalid zip code or location not found." }),
      });
      render(<Index />);
      await userEvent.type(screen.getByLabelText("Enter ZIP Code"), "00000");
      await userEvent.click(screen.getByRole("button", { name: /get forecast/i }));
      await waitFor(() => {
        expect(
          screen.getByText("Invalid zip code or location not found.")
        ).toBeInTheDocument();
      });
    });

    it("should handle network errors gracefully", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));
      render(<Index />);
      await userEvent.type(screen.getByLabelText("Enter ZIP Code"), "90210");
      await userEvent.click(screen.getByRole("button", { name: /get forecast/i }));
      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });
    });
  });

  describe("Refresh Functionality", () => {
    it("should display refresh button after forecast is loaded", async () => {
      mockSuccessfulFetch();
      render(<Index />);
      await userEvent.type(screen.getByLabelText("Enter ZIP Code"), "90210");
      await userEvent.click(screen.getByRole("button", { name: /get forecast/i }));
      await waitFor(() => {
        expect(screen.getByText("Beverly Hills, California")).toBeInTheDocument();
      });
      expect(screen.getByRole("button", { name: /refresh/i })).toBeInTheDocument();
    });

    it("should display last updated timestamp after forecast is loaded", async () => {
      mockSuccessfulFetch();
      render(<Index />);
      await userEvent.type(screen.getByLabelText("Enter ZIP Code"), "90210");
      await userEvent.click(screen.getByRole("button", { name: /get forecast/i }));
      await waitFor(() => {
        expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
      });
    });

    it("should refetch data when refresh button is clicked", async () => {
      mockSuccessfulFetch();
      mockSuccessfulFetch();
      render(<Index />);
      await userEvent.type(screen.getByLabelText("Enter ZIP Code"), "90210");
      await userEvent.click(screen.getByRole("button", { name: /get forecast/i }));
      await waitFor(() => {
        expect(screen.getByText("Beverly Hills, California")).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole("button", { name: /refresh/i }));

      // 1 initial fetch + 1 refresh fetch = 2 total
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Forecast Display", () => {
    it("should display weather details correctly", async () => {
      mockSuccessfulFetch();
      render(<Index />);
      await userEvent.type(screen.getByLabelText("Enter ZIP Code"), "90210");
      await userEvent.click(screen.getByRole("button", { name: /get forecast/i }));
      await waitFor(() => {
        expect(screen.getByText("75°F")).toBeInTheDocument();
        expect(screen.getByText("73°F")).toBeInTheDocument();
        expect(screen.getByText("50%")).toBeInTheDocument();
        expect(screen.getByText("5 mph")).toBeInTheDocument();
      });
    });
  });
});
