"use client";

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Panorama } from '@/app/data/panoramas';

// Replace with your Mapbox token
mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';

interface MapProps {
  locations: Panorama[];
  selectedLocation: number | null;
  onLocationSelect: (id: number) => void;
}

export default function Map({ locations, selectedLocation, onLocationSelect }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 20],
      zoom: 1.5,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    // Add markers for each location
    locations.forEach(location => {
      if (!location.latitude || !location.longitude) return;

      const el = document.createElement('div');
      el.className = 'marker';
      el.innerHTML = `
        <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer transform transition-transform hover:scale-110 ${
          selectedLocation === location.id ? 'ring-2 ring-blue-500' : ''
        }">
          <span class="text-lg">📍</span>
        </div>
      `;

      el.addEventListener('click', () => {
        onLocationSelect(location.id);
        
        // Fly to location
        map.current?.flyTo({
          center: [location.longitude, location.latitude],
          zoom: 15,
          duration: 2000,
        });
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current);

      markers.current[location.id] = marker;
    });
  }, [locations, mapLoaded, selectedLocation, onLocationSelect]);

  // Fly to selected location
  useEffect(() => {
    if (!mapLoaded || !map.current || !selectedLocation) return;

    const location = locations.find(l => l.id === selectedLocation);
    if (!location?.latitude || !location?.longitude) return;

    map.current.flyTo({
      center: [location.longitude, location.latitude],
      zoom: 15,
      duration: 2000,
    });
  }, [selectedLocation, locations, mapLoaded]);

  return (
    <div ref={mapContainer} className="w-full h-full">
      <style jsx global>{`
        .mapboxgl-ctrl-logo,
        .mapboxgl-ctrl-bottom-right {
          display: none !important;
        }
      `}</style>
    </div>
  );
} 