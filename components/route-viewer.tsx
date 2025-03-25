import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RouteViewerProps {
  latitude?: number;
  longitude?: number;
  onClose?: () => void;
}

export function RouteViewer({ latitude, longitude, onClose }: RouteViewerProps) {
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

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude]);

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/30">
        <h3 className="text-white font-semibold">Route View</h3>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div 
          ref={mapRef} 
          className="absolute inset-0"
        />
        {(!latitude || !longitude) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">No location data available</p>
          </div>
        )}
      </div>
    </div>
  );
} 