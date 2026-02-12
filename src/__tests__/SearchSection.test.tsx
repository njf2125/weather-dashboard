import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchSection from "../components/SearchSection";
import * as api from "../utils/api";

// Mock the API function
jest.mock("../utils/api");

describe("SearchSection", () => {
    const mockOnSearch = jest.fn();
    const mockOnUseLocation = jest.fn();
    const mockOnToggleUnit = jest.fn();
    const mockOnSelectLocation = jest.fn();
    const mockOnRemoveFavorite = jest.fn();

    const defaultProps = {
        onSearch: mockOnSearch,
        onUseLocation: mockOnUseLocation,
        unit: "imperial" as const,
        onToggleUnit: mockOnToggleUnit,
        favorites: [],
        onSelectLocation: mockOnSelectLocation,
        onRemoveFavorite: mockOnRemoveFavorite,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders input and buttons", () => {
        render(<SearchSection {...defaultProps} />);
        expect(
            screen.getByPlaceholderText("Enter city name"),
        ).toBeInTheDocument();
        expect(screen.getByText("Search")).toBeInTheDocument();
        expect(screen.getByText("Use My Location")).toBeInTheDocument();
    });

    it("calls onSearch when search button is clicked", () => {
        render(<SearchSection {...defaultProps} />);
        const input = screen.getByPlaceholderText("Enter city name");
        fireEvent.change(input, { target: { value: "London" } });
        fireEvent.click(screen.getByText("Search"));
        expect(mockOnSearch).toHaveBeenCalledWith("London");
    });

    it("calls onSearch when Enter key is pressed", () => {
        render(<SearchSection {...defaultProps} />);
        const input = screen.getByPlaceholderText("Enter city name");
        fireEvent.change(input, { target: { value: "Paris" } });
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
        expect(mockOnSearch).toHaveBeenCalledWith("Paris");
    });

    it("calls onUseLocation when button is clicked", () => {
        render(<SearchSection {...defaultProps} />);
        fireEvent.click(screen.getByText("Use My Location"));
        expect(mockOnUseLocation).toHaveBeenCalled();
    });

    it("displays suggestions when typing", async () => {
        const mockSuggestions = [
            { name: "London", lat: 51, lon: 0, country: "GB" },
        ];
        (api.fetchCitySuggestions as jest.Mock).mockResolvedValue(
            mockSuggestions,
        );

        render(<SearchSection {...defaultProps} />);
        const input = screen.getByPlaceholderText("Enter city name");

        fireEvent.change(input, { target: { value: "Lon" } });

        await waitFor(() => {
            expect(screen.getByText("London, GB")).toBeInTheDocument();
        });
    });
});
