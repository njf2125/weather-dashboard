import React, { useState, useEffect, useRef } from 'react';
import { LocationData } from '../interfaces';
import { fetchCitySuggestions } from '../utils/api';
import UnitToggle from './UnitToggle';

interface SearchSectionProps {
    onSearch: (city: string) => void;
    onUseLocation: () => void;
    unit: 'metric' | 'imperial';
    onToggleUnit: (unit: 'metric' | 'imperial') => void;
    favorites: LocationData[];
    onSelectFavorite: (location: LocationData) => void;
    onRemoveFavorite: (location: LocationData) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
    onSearch,
    onUseLocation,
    unit,
    onToggleUnit,
    favorites,
    onSelectFavorite,
    onRemoveFavorite
}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<LocationData[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
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
            setInputValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSelectSuggestion = (suggestion: LocationData) => {
        const query = suggestion.state 
            ? `${suggestion.name}, ${suggestion.state}` 
            : `${suggestion.name}, ${suggestion.country}`;
            
        onSearch(query); // Ideally we'd pass the lat/lon directly to avoid re-fetching, but current api uses query for main search flow in this component context or we can adapt props. 
        // Actually, onSelectFavorite takes a LocationData, maybe onSearch should be overloaded or we have a specific onSelectLocation prop.
        // For now, adhering to the prop interface, we'll just search by string to be safe or update App to handle object selection.
        // Let's call onSearch with the name, but nicer would be to pass the object.
        // But since `useWeather` has `searchCity(query)`, we stick to string for now or update `App` to handle `getWeather(lat, lon)`.
        // Let's stick to string for `onSearch` to keep it simple, or `App` can perform `getWeather` if we had `onSelectLocation`.
        // I will assume `onSearch` takes a string.
        setInputValue('');
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
                    onFocus={() => {
                        if (inputValue.length === 0 && favorites.length > 0) {
                            // Show favorites if input is empty? 
                            // Original app showed favorites when clicking empty input.
                            // We can reuse the suggestions dropdown for favorites.
                        }
                    }}
                />
                {(showSuggestions && suggestions.length > 0) && (
                    <div id="city-suggestions">
                        {suggestions.map((suggestion, index) => (
                            <div 
                                key={index} 
                                className="suggestion-item"
                                onClick={() => handleSelectSuggestion(suggestion)}
                            >
                                {suggestion.name}
                                {suggestion.state ? `, ${suggestion.state}` : ''}
                                {suggestion.country ? `, ${suggestion.country}` : ''}
                            </div>
                        ))}
                    </div>
                )}
                 {/* Show favorites if input is empty and focused? Implementation choice. 
                    Let's simpler: List favorites separately if needed, or just rely on the suggestions.
                    The original app showed favorites in the dropdown. 
                    Let's implement that: if inputValue is empty, show favorites.
                 */}
                 {(inputValue.length === 0 && favorites.length > 0 && document.activeElement === document.getElementById('city-input')) && (
                     <div id="city-suggestions">
                         {favorites.map((fav, index) => (
                             <div key={index} className="favorite-item" onClick={() => onSelectFavorite(fav)}>
                                 <span>{fav.name}</span>
                                 <span 
                                    className="remove-favorite" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveFavorite(fav);
                                    }}
                                 >x</span>
                             </div>
                         ))}
                     </div>
                 )}
            </div>
            <button id="search-button" onClick={handleSearch}>Search</button>
            <button id="current-location-button" onClick={onUseLocation}>Use My Location</button>
            <UnitToggle unit={unit} onToggle={onToggleUnit} />
        </section>
    );
};

export default SearchSection;
