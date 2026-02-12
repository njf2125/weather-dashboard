import { LocationData, OpenWeatherOneCallResponse } from '../interfaces';

const API_BASE_URL = '/api/weather';

export async function fetchWeatherData(
    lat: number,
    lon: number,
    unit: 'metric' | 'imperial'
): Promise<OpenWeatherOneCallResponse> {
    const url = `${API_BASE_URL}?type=onecall&lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=${unit}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function fetchLocationFromQuery(
    query: string
): Promise<LocationData | null> {
    let url: string;
    const isZip = /^\d{5}$/.test(query);

    if (isZip) {
        url = `${API_BASE_URL}?type=zip&zip=${query},US`;
    } else {
        url = `${API_BASE_URL}?type=direct&q=${query}&limit=1`;
    }

    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 400) throw new Error("Bad request. Please check your input format.");
        if (response.status === 401) throw new Error("Unauthorized. Please check your API key.");
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (isZip) {
        if (data.lat && data.lon) {
            // For zip codes, fetch reverse geocoding to get state
            const reverseUrl = `${API_BASE_URL}?type=reverse&lat=${data.lat}&lon=${data.lon}&limit=1`;
            const reverseResponse = await fetch(reverseUrl);
            let state: string | undefined;
            if (reverseResponse.ok) {
                const reverseData = await reverseResponse.json();
                state = reverseData.length > 0 ? reverseData[0].state : undefined;
            }
            return {
                lat: data.lat,
                lon: data.lon,
                name: data.name,
                state: state,
                country: data.country
            };
        }
        return null;
    } else {
        if (data.length > 0) {
            return {
                lat: data[0].lat,
                lon: data[0].lon,
                name: data[0].name,
                state: data[0].state,
                country: data[0].country
            };
        }
        return null;
    }
}

export async function fetchCitySuggestions(query: string): Promise<LocationData[]> {
    if (query.length < 3) return [];
    const url = `${API_BASE_URL}?type=direct&q=${query}&limit=5`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((item: any) => ({
        name: item.name,
        lat: item.lat,
        lon: item.lon,
        state: item.state,
        country: item.country
    }));
}

export async function fetchReverseGeocoding(lat: number, lon: number): Promise<LocationData | null> {
    const url = `${API_BASE_URL}?type=reverse&lat=${lat}&lon=${lon}&limit=1`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.length > 0) {
        return {
            name: data[0].name,
            lat: lat,
            lon: lon,
            state: data[0].state,
            country: data[0].country
        };
    }
    return null;
}
