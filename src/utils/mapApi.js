// Utility functions for making API calls with map coordinates
import taxios from "./taxios";

/**
 * Fetch nearby places based on coordinates
 * @param {Object} center - The center coordinates {lat, lng}
 * @param {number} radius - Search radius in meters
 * @param {string} category - Optional category filter
 * @returns {Promise<Object>} API response with nearby places
 */
export const fetchNearbyRegions = async (center, radius = 0.08) => {
    try {
        const params = new URLSearchParams({
            latitude: center.lat.toString(),
            longitude: center.lng.toString(),
            radius: radius.toString(),
        });

        const response = await taxios.get(`/region/search?${params}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching nearby regions:", error);
        throw error;
    }
};

/**
 * Search for places with a query string and location
 * @param {string} query - Search query
 * @param {Object} center - The center coordinates {lat, lng}
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Object>} API response with search results
 */
export const searchPlacesNearLocation = async (
    query,
    center,
    radius = 10000
) => {
    try {
        const params = {
            query: query,
            lat: center.lat.toString(),
            lng: center.lng.toString(),
            radius: radius.toString(),
        };

        const response = await taxios.get("/search/places", {params});
        return response.data;
    } catch (error) {
        console.error("Error searching places:", error);
        throw error;
    }
};

/**
 * Fetch reviews for a specific location
 * @param {Object} center - The center coordinates {lat, lng}
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Object>} API response with reviews
 */
export const fetchNearbyLiveReports = async (center, radius = 0.08) => {
    try {
        const params = new URLSearchParams({
            latitude: center.lat.toString(),
            longitude: center.lng.toString(),
            range: radius.toString(),
        });

        const response = await taxios.get(`/livereport/near?${params}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching live reports:", error);
        throw error;
    }
};

/**
 * Get administrative information for a location (city, district, etc.)
 * @param {Object} center - The center coordinates {lat, lng}
 * @returns {Promise<Object>} API response with location info
 */
export const getLocationInfo = async (center) => {
    try {
        const params = {
            lat: center.lat.toString(),
            lng: center.lng.toString(),
        };

        const response = await taxios.get("/location/info", {params});
        return response.data;
    } catch (error) {
        console.error("Error fetching location info:", error);
        throw error;
    }
};

/**
 * Utility function to calculate distance between two coordinates
 * @param {Object} coord1 - First coordinate {lat, lng}
 * @param {Object} coord2 - Second coordinate {lat, lng}
 * @returns {number} Distance in meters
 */
export const calculateDistance = (coord1, coord2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (coord1.lat * Math.PI) / 180;
    const φ2 = (coord2.lat * Math.PI) / 180;
    const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};
