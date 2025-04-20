
import { useState, useEffect } from 'react';
import axios from 'axios';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type Address = {
  city: string;
  district: string;
  state: string;
  country: string;
  formatted: string;
};

type GeolocationReturn = {
  coordinates: Coordinates | null;
  address: Address | null;
  loading: boolean;
  error: string | null;
};

const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY; // Ensure this is set in your environment variables
const OPENCAGE_API_URL = import.meta.env.VITE_OPENCAGE_API_URL;

export const useGeolocation = (): GeolocationReturn => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCoordinates(coords);

        try {
          const response = await axios.get(OPENCAGE_API_URL, {
            params: {
              q: `${coords.latitude},${coords.longitude}`,
              key: OPENCAGE_API_KEY,
              language: 'en',
              pretty: 1,
            },
          });

          if (response.data.results && response.data.results.length > 0) {
            const result = response.data.results[0];
            const components = result.components;
            
            // Improved location details with more reliable fields
            setAddress({
              city: components.city || components.town || components.village || components.suburb || '',
              district: components.county || components.district || components.state_district || '',
              state: components.state || components.province || '',
              country: components.country || '',
              formatted: result.formatted || '',
            });
          }
          setLoading(false);
        } catch (err) {
          console.error("Geocoding error:", err);
          setError('Failed to get address information');
          setLoading(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError(`Failed to get location: ${err.message}`);
        setLoading(false);
      }
    );
  }, []);

  return { coordinates, address, loading, error };
};
