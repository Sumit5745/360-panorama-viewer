"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Camera, Compass, MapPin, Info, Loader2 } from 'lucide-react';
import { AROverlay } from '@/components/ar-overlay';
import { Hotspot, Scene, Panorama } from '@/app/data/panoramas';

// Pannellum type declarations
interface PannellumViewer {
  loadScene: (sceneId: string, pitch?: number, yaw?: number) => void;
  getYaw: () => number;
  lookTo: (yaw: number, pitch: number, duration: number) => void;
}

declare global {
  interface Window {
    pannellum: {
      viewer: (container: HTMLElement, config: any) => PannellumViewer;
    };
  }
}

interface PanoramaViewerProps {
  imageUrl: string;
  title: string;
  hotspots: Hotspot[];
  scenes?: Scene[];
  initialLatitude?: number;
  initialLongitude?: number;
  initialHeading?: number;
}

export function PanoramaViewer({
  imageUrl,
  title,
  hotspots,
  scenes,
  initialLatitude,
  initialLongitude,
  initialHeading,
}: PanoramaViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState<string | null>(null);
  const [showAR, setShowAR] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState<{
    alpha: number;
    beta: number;
    gamma: number;
  } | null>(null);
  const [viewer, setViewer] = useState<PannellumViewer | null>(null);

  useEffect(() => {
    const loadPanoramaViewer = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load Pannellum CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
        document.head.appendChild(link);

        // Load Pannellum viewer
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
        script.async = true;
        script.onload = () => {
          if (window.pannellum && viewerRef.current) {
            console.log('Initializing viewer with image:', imageUrl);
            const newViewer = window.pannellum.viewer(viewerRef.current, {
              type: 'equirectangular',
              panorama: imageUrl,
              title: title,
              hotSpots: hotspots.map(hotspot => ({
                pitch: hotspot.pitch,
                yaw: hotspot.yaw,
                type: hotspot.type,
                text: hotspot.text,
                sceneId: hotspot.sceneId,
                imageUrl: hotspot.imageUrl,
              })),
              compass: true,
              autoLoad: true,
              autoRotate: -2,
              compassOffset: initialHeading || 0,
              onLoad: () => {
                console.log('Panorama loaded successfully');
                setIsLoading(false);
              },
              onError: (err: any) => {
                console.error('Panorama loading error:', err);
                setError('Failed to load panorama. Please try again.');
                setIsLoading(false);
              },
            });
            setViewer(newViewer);
          }
        };
        document.body.appendChild(script);

        // Handle device orientation
        if (window.DeviceOrientationEvent) {
          window.addEventListener('deviceorientation', handleOrientation);
        }

        return () => {
          document.body.removeChild(script);
          document.head.removeChild(link);
          window.removeEventListener('deviceorientation', handleOrientation);
        };
      } catch (err) {
        console.error('Viewer initialization error:', err);
        setError('Failed to initialize panorama viewer. Please try again.');
        setIsLoading(false);
      }
    };

    loadPanoramaViewer();
  }, [imageUrl, title, hotspots, initialHeading]);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
      setDeviceOrientation({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      });
    }
  };

  const handleSceneChange = (sceneId: string) => {
    if (viewer) {
      viewer.loadScene(sceneId, 0, 0);
      setCurrentScene(sceneId);
    }
  };

  const handleMove = (direction: 'left' | 'right') => {
    if (viewer) {
      const currentYaw = viewer.getYaw();
      const newYaw = direction === 'left' ? currentYaw - 45 : currentYaw + 45;
      viewer.lookTo(newYaw, 0, 1000);
    }
  };

  const toggleAR = () => {
    setShowAR(!showAR);
  };

  const toggleThumbnails = () => {
    setShowThumbnails(!showThumbnails);
  };

  if (error) {
    return (
      <div className="w-full h-[500px] bg-card/50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Info className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      <div ref={viewerRef} className="w-full h-[500px]" />

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => handleMove('left')}
          className="bg-primary/90 hover:bg-primary"
        >
          ←
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => handleMove('right')}
          className="bg-primary/90 hover:bg-primary"
        >
          →
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleAR}
          className={`${showAR ? 'bg-primary' : 'bg-primary/90 hover:bg-primary'}`}
        >
          <Camera className="w-5 h-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleThumbnails}
          className={`${showThumbnails ? 'bg-primary' : 'bg-primary/90 hover:bg-primary'}`}
        >
          <Compass className="w-5 h-5" />
        </Button>
      </div>

      {/* Scene Thumbnails */}
      {showThumbnails && scenes && (
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
          <div className="flex flex-col gap-2">
            {scenes.map((scene) => (
              <div
                key={scene.id}
                className={`relative w-20 h-20 cursor-pointer rounded-lg overflow-hidden ${
                  currentScene === scene.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleSceneChange(scene.id)}
              >
                <img
                  src={scene.thumbnail || scene.imageUrl}
                  alt={scene.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AR Overlay */}
      {showAR && (
        <AROverlay
          latitude={initialLatitude}
          longitude={initialLongitude}
          heading={deviceOrientation?.alpha || initialHeading || 0}
        />
      )}
    </div>
  );
}
