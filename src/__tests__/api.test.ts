import { fetchWeatherData, fetchLocationFromQuery, fetchCitySuggestions, fetchReverseGeocoding } from '../utils/api';

// Mock the global fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('API Utility Functions', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    describe('fetchWeatherData', () => {
        it('should fetch weather data successfully', async () => {
            const mockResponse = { current: { temp: 20 } };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const data = await fetchWeatherData(10, 20, 'metric');
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('lat=10'));
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('lon=20'));
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('units=metric'));
            expect(data).toEqual(mockResponse);
        });

        it('should throw an error if fetch fails', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
            });

            await expect(fetchWeatherData(10, 20, 'metric')).rejects.toThrow('HTTP error! status: 500');
        });
    });

    describe('fetchLocationFromQuery', () => {
        it('should fetch location from city name', async () => {
            const mockResponse = [{ lat: 10, lon: 20, name: 'Test City', country: 'TC' }];
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const data = await fetchLocationFromQuery('Test City');
            expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('q=Test City&limit=1'));
            expect(data).toEqual({ lat: 10, lon: 20, name: 'Test City', country: 'TC', state: undefined });
        });

        it('should fetch location from zip code', async () => {
             // Mock zip response
            const mockZipResponse = { lat: 10, lon: 20, name: 'Zip City', country: 'US' };
            // Mock reverse geocoding response (for state)
            const mockReverseResponse = [{ name: 'Zip City', state: 'State', country: 'US' }];

            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockZipResponse,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockReverseResponse,
                });

            const data = await fetchLocationFromQuery('12345');
            expect(mockFetch).toHaveBeenNthCalledWith(1, expect.stringContaining('zip=12345,US'));
            expect(mockFetch).toHaveBeenNthCalledWith(2, expect.stringContaining('type=reverse'));
            expect(data).toEqual({ lat: 10, lon: 20, name: 'Zip City', country: 'US', state: 'State' });
        });
    });

    describe('fetchCitySuggestions', () => {
        it('should return empty array for short query', async () => {
            const data = await fetchCitySuggestions('ab');
            expect(data).toEqual([]);
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('should fetch suggestions', async () => {
            const mockResponse = [{ name: 'City', lat: 1, lon: 2, country: 'C' }];
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const data = await fetchCitySuggestions('City');
            expect(data).toHaveLength(1);
            expect(data[0].name).toBe('City');
        });
    });
});
