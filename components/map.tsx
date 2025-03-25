"use client";

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Panorama } from '@/app/data/panoramas';

interface MapProps {
  locations: Panorama[];
  selectedLocation: number | null;
  onLocationSelect: (id: number) => void;
}

export default function Map({ locations, selectedLocation, onLocationSelect }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<{ [key: number]: L.Marker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([20, 0], 1.5);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Set map loaded state
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
        map.current?.flyTo(
          [location.latitude, location.longitude],
          15,
          {
            duration: 2,
            easeLinearity: 0.25
          }
        );
      });

      const marker = L.marker([location.latitude, location.longitude], {
        icon: L.divIcon({
          html: el.innerHTML,
          className: 'custom-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      }).addTo(map.current);

      markers.current[location.id] = marker;
    });
  }, [locations, mapLoaded, selectedLocation, onLocationSelect]);

  // Fly to selected location
  useEffect(() => {
    if (!mapLoaded || !map.current || !selectedLocation) return;

    const location = locations.find(l => l.id === selectedLocation);
    if (!location?.latitude || !location?.longitude) return;

    map.current.flyTo(
      [location.latitude, location.longitude],
      15,
      {
        duration: 2,
        easeLinearity: 0.25
      }
    );
  }, [selectedLocation, locations, mapLoaded]);

  return (
    <div ref={mapContainer} className="w-full h-full">
      <style jsx global>{`
        .leaflet-control-attribution {
          display: none !important;
        }
        .custom-marker {
          background: none;
          border: none;
        }
      `}</style>
    </div>
  );
} 