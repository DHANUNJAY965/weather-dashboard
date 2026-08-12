export interface PhotonFeature {
  properties: {
    osm_key: string;
    name?: string;
    country?: string;
    countrycode?: string;
    state?: string;
  };
  geometry: {
    coordinates: [number, number]; // [lon, lat]
  };
}

export interface PhotonResponse {
  features: PhotonFeature[];
}

export interface CitySuggestion {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}
