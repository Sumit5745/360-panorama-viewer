import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MiniMapProps {
  latitude?: number;
  longitude?: number;
  heading?: number;
}

export function MiniMap({ latitude, longitude, heading }: MiniMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([latitude, longitude], 15);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Add marker
      markerRef.current = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
    }

    // Update map view and marker position
    mapInstanceRef.current.setView([latitude, longitude], 15);
    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
    }

    // Update marker rotation if heading is provided
    if (heading !== undefined && markerRef.current) {
      const markerElement = markerRef.current.getElement();
      if (markerElement) {
        markerElement.style.transform = `rotate(${heading}deg)`;
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, heading]);

  return (
    <div 
      ref={mapRef} 
      className="absolute bottom-4 right-4 w-48 h-48 rounded-lg overflow-hidden shadow-lg border-2 border-white"
    />
  );
} 