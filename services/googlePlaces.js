// services/googlePlaces.js
import Constants from 'expo-constants';

const GOOGLE_MAPS_API_KEY = Constants?.expoConfig?.extra?.googleMapsApiKey || '';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export async function fetchNearbyMuseums({ latitude, longitude, radius = 3000, pageToken }) {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('Missing Google Maps API key. Configure expo.extra.googleMapsApiKey in app.json');
  }

  const params = new URLSearchParams({
    location: `${latitude},${longitude}`,
    radius: String(radius),
    type: 'museum',
    key: GOOGLE_MAPS_API_KEY,
  });

  if (pageToken) params.set('pagetoken', pageToken);

  const url = `${BASE_URL}/nearbysearch/json?${params.toString()}`;
  const res = await fetch(url);
  const json = await res.json();

  if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
    const message = json.error_message || json.status || 'Erro desconhecido na Places API';
    throw new Error(message);
  }

  return json; // { results, next_page_token, status }
}

export function getPlacePhotoUrl(photoReference, maxWidth = 400) {
  if (!photoReference) return null;
  const params = new URLSearchParams({ photoreference: photoReference, maxwidth: String(maxWidth), key: GOOGLE_MAPS_API_KEY });
  return `${BASE_URL}/photo?${params.toString()}`;
}

export function adaptPlacesToMuseums(results = []) {
  return results.map((place) => {
    const photoRef = place.photos?.[0]?.photo_reference;
    return {
      id: place.place_id,
      title: place.name,
      subtitle: place.vicinity || place.formatted_address || 'Museum',
      description: place.types?.slice(0, 3).join(', ') || 'Museum',
      rating: place.rating || 4.5,
      distance: place.user_ratings_total ? `${place.user_ratings_total} reviews` : '',
      image: photoRef ? { uri: getPlacePhotoUrl(photoRef, 600) } : undefined,
    };
  });
}

export default {
  fetchNearbyMuseums,
  getPlacePhotoUrl,
  adaptPlacesToMuseums,
};


