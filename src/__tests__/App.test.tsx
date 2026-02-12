import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import * as useWeatherHook from "../hooks/useWeather";

// Mock the hook
jest.mock("../hooks/useWeather");

describe("App", () => {
    const mockSearchCity = jest.fn();
    const mockGetUserLocation = jest.fn();
    const mockGetWeather = jest.fn();

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
        (useWeatherHook.useWeather as jest.Mock).mockReturnValue({
            weatherData: null,
            loading: false,
            error: null,
            currentLocation: null,
            searchCity: mockSearchCity,
            getUserLocation: mockGetUserLocation,
            getWeather: mockGetWeather,
            setError: jest.fn(),
        });
    });

    it("renders title", () => {
        render(<App />);
        expect(screen.getByText("Weather Dashboard")).toBeInTheDocument();
    });

    it("shows loading overlay when loading", () => {
        (useWeatherHook.useWeather as jest.Mock).mockReturnValue({
            weatherData: null,
            loading: true,
            error: null,
            currentLocation: null,
            searchCity: mockSearchCity,
            getUserLocation: mockGetUserLocation,
            getWeather: mockGetWeather,
            setError: jest.fn(),
        });

        const { container } = render(<App />);
        // Ensure the loading overlay doesn't have the 'hidden' class or check for spinner presence if visible
        // In our implementation, LoadingOverlay returns null if not loading.
        // So here it should be in the document.
        expect(container.querySelector("#loading-overlay")).toBeInTheDocument();
    });

    it("shows error message when error exists", () => {
        (useWeatherHook.useWeather as jest.Mock).mockReturnValue({
            weatherData: null,
            loading: false,
            error: "Test Error",
            currentLocation: null,
            searchCity: mockSearchCity,
            getUserLocation: mockGetUserLocation,
            getWeather: mockGetWeather,
            setError: jest.fn(),
        });

        render(<App />);
        expect(screen.getByText("Test Error")).toBeInTheDocument();
    });

    it("displays location name when currentLocation is set", () => {
        (useWeatherHook.useWeather as jest.Mock).mockReturnValue({
            weatherData: null,
            loading: false,
            error: null,
            currentLocation: {
                name: "Test City",
                lat: 0,
                lon: 0,
                country: "TC",
            },
            searchCity: mockSearchCity,
            getUserLocation: mockGetUserLocation,
            getWeather: mockGetWeather,
            setError: jest.fn(),
        });

        render(<App />);
        expect(screen.getByText("Test City, TC")).toBeInTheDocument();
    });

    it("calls getUserLocation on mount regardless of stored location", () => {
        render(<App />);
        expect(mockGetUserLocation).toHaveBeenCalled();
    });

    it("shows splash screen initially", () => {
        render(<App />);
        expect(screen.getByText("SkyCast")).toBeInTheDocument();
        expect(
            screen.getByText("Setting up your forecast..."),
        ).toBeInTheDocument();
    });
});
