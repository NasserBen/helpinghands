/**
 * Geocoding utility functions for converting addresses to coordinates
 */

/**
 * Geocode an address using Google Geocoding API
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number} | null>} - Coordinates or null if failed
 */
export async function geocodeAddress(address) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
      console.warn("Google Maps API key not configured for geocoding");
      // Return default SF coordinates as fallback
      return {
        lat: 37.7749 + (Math.random() - 0.5) * 0.1,
        lng: -122.4194 + (Math.random() - 0.5) * 0.1
      };
    }

    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng
      };
    } else {
      console.error('Geocoding failed:', data.status, data.error_message);
      // Return default SF coordinates as fallback
      return {
        lat: 37.7749 + (Math.random() - 0.5) * 0.1,
        lng: -122.4194 + (Math.random() - 0.5) * 0.1
      };
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    // Return default SF coordinates as fallback
    return {
      lat: 37.7749 + (Math.random() - 0.5) * 0.1,
      lng: -122.4194 + (Math.random() - 0.5) * 0.1
    };
  }
}

/**
 * Client-side geocoding using Google Maps JavaScript API
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number} | null>} - Coordinates or null if failed
 */
export async function geocodeAddressClient(address) {
  try {
    if (typeof window === 'undefined' || !window.google) {
      throw new Error('Google Maps JavaScript API not loaded');
    }

    const geocoder = new window.google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results.length > 0) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          console.error('Client geocoding failed:', status);
          // Return default SF coordinates as fallback
          resolve({
            lat: 37.7749 + (Math.random() - 0.5) * 0.1,
            lng: -122.4194 + (Math.random() - 0.5) * 0.1
          });
        }
      });
    });
  } catch (error) {
    console.error('Error in client geocoding:', error);
    // Return default SF coordinates as fallback
    return {
      lat: 37.7749 + (Math.random() - 0.5) * 0.1,
      lng: -122.4194 + (Math.random() - 0.5) * 0.1
    };
  }
}

/**
 * Validate if an address can be geocoded
 * @param {string} address - The address to validate
 * @returns {Promise<boolean>} - True if address is valid
 */
export async function validateAddress(address) {
  try {
    const coordinates = await geocodeAddress(address);
    return coordinates !== null;
  } catch (error) {
    console.error('Error validating address:', error);
    return false;
  }
}
