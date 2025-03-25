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
            
            // Create scenes configuration
            const scenesConfig = scenes?.reduce((acc, scene) => ({
              ...acc,
              [scene.id]: {
                title: scene.title,
                panorama: scene.imageUrl,
                hotSpots: scene.hotspots?.map(hotspot => ({
                  pitch: hotspot.pitch,
                  yaw: hotspot.yaw,
                  type: hotspot.type,
                  text: hotspot.text,
                  sceneId: hotspot.sceneId,
                  imageUrl: hotspot.imageUrl,
                })),
              }
            }), {});

            // Create viewer configuration
            const viewerConfig = {
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
              sceneFadeDuration: 1000,
              default: {
                firstScene: scenes?.[0]?.id || 'default',
                sceneFadeDuration: 1000,
              },
              scenes: scenesConfig,
              onLoad: () => {
                console.log('Panorama loaded successfully');
                setIsLoading(false);
              },
              onError: (err: any) => {
                console.error('Panorama loading error:', err);
                setError('Failed to load panorama. Please try again.');
                setIsLoading(false);
              },
              onScenechange: (sceneId: string) => {
                console.log('Scene changed to:', sceneId);
                setCurrentScene(sceneId);
                setIsLoading(false);
              }
            };

            const newViewer = window.pannellum.viewer(viewerRef.current, viewerConfig);
            setViewer(newViewer);
          }
        };
        document.body.appendChild(script);

        // Handle device orientation
        if (window.DeviceOrientationEvent) {
          window.addEventListener('deviceorientation', handleOrientation);
        }

        return () => {
          if (viewerRef.current) {
            viewerRef.current.innerHTML = '';
          }
          document.body.removeChild(script);
          document.head.removeChild(link);
          window.removeEventListener('deviceorientation', handleOrientation);
          setIsLoading(false);
        };
      } catch (err) {
        console.error('Viewer initialization error:', err);
        setError('Failed to initialize panorama viewer. Please try again.');
        setIsLoading(false);
      }
    };

    loadPanoramaViewer();
  }, [imageUrl, title, hotspots, scenes, initialHeading]);

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
      setIsLoading(true);
      try {
        viewer.loadScene(sceneId, 0, 0);
        setCurrentScene(sceneId);
      } catch (err) {
        console.error('Error changing scene:', err);
        setError('Failed to change scene. Please try again.');
        setIsLoading(false);
      }
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
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-lg max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            {scenes.map((scene) => (
              <div
                key={scene.id}
                className={`relative w-20 h-20 cursor-pointer rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
                  currentScene === scene.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleSceneChange(scene.id)}
              >
                <img
                  src={scene.thumbnail || scene.imageUrl}
                  alt={scene.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = scene.imageUrl; // Fallback to main image if thumbnail fails
                  }}
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <span className="text-white text-xs text-center px-1">{scene.title}</span>
                </div>
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
