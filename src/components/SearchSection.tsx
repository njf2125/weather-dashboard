import React, { useState, useEffect, useRef } from "react";
import { LocationData } from "../interfaces";
import { fetchCitySuggestions } from "../utils/api";
import UnitToggle from "./UnitToggle";

interface SearchSectionProps {
    onSearch: (city: string) => void;
    onUseLocation: () => void;
    unit: "metric" | "imperial";
    onToggleUnit: (unit: "metric" | "imperial") => void;
    favorites: LocationData[];
    onSelectLocation: (location: LocationData) => void;
    onRemoveFavorite: (location: LocationData) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
    onSearch,
    onUseLocation,
    unit,
    onToggleUnit,
    favorites,
    onSelectLocation,
    onRemoveFavorite,
}) => {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<LocationData[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (inputValue.length > 2) {
                const results = await fetchCitySuggestions(inputValue);
                setSuggestions(results);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [inputValue]);

    const handleSearch = () => {
        if (inputValue.trim()) {
            onSearch(inputValue);
            setShowSuggestions(false);
            setInputValue("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleSelectSuggestion = (suggestion: LocationData) => {
        onSelectLocation(suggestion);
        setInputValue("");
        setShowSuggestions(false);
    };

    return (
        <section id="search-section" ref={wrapperRef}>
            <div className="search-container">
                <input
                    type="text"
                    id="city-input"
                    placeholder="Enter city name"
                    autoComplete="off"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                />
                {showSuggestions && suggestions.length > 0 && (
                    <div id="city-suggestions">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="suggestion-item"
                                onClick={() =>
                                    handleSelectSuggestion(suggestion)
                                }
                            >
                                {suggestion.name}
                                {suggestion.state
                                    ? `, ${suggestion.state}`
                                    : ""}
                                {suggestion.country
                                    ? `, ${suggestion.country}`
                                    : ""}
                            </div>
                        ))}
                    </div>
                )}
                {inputValue.length === 0 &&
                    favorites.length > 0 &&
                    isFocused && (
                        <div id="city-suggestions">
                            {favorites.map((fav, index) => (
                                <div
                                    key={index}
                                    className="favorite-item"
                                    onClick={() => onSelectLocation(fav)}
                                >
                                    <span>{fav.name}</span>
                                    <span
                                        className="remove-favorite"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveFavorite(fav);
                                        }}
                                    >
                                        x
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
            </div>
            <button id="search-button" onClick={handleSearch}>
                Search
            </button>
            <button id="current-location-button" onClick={onUseLocation}>
                Use My Location
            </button>
            <UnitToggle unit={unit} onToggle={onToggleUnit} />
        </section>
    );
};

export default SearchSection;
