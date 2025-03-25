"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Camera, Compass, MapPin, Info, Loader2, RefreshCw, Minimize, Maximize } from 'lucide-react';
import { AROverlay } from '@/components/ar-overlay';
import { Hotspot, Scene, Panorama } from '@/app/data/panoramas';

// Pannellum type declarations
interface PannellumViewer {
  loadScene: (sceneId: string, pitch?: number, yaw?: number) => void;
  getYaw: () => number;
  lookTo: (yaw: number, pitch: number, duration: number) => void;
  setYaw: (yaw: number) => void;
  destroy: () => void;
  setAutoRotate: (speed: number) => void;
  setCompass: (show: boolean) => void;
}

declare global {
  interface Window {
    pannellum: {
      viewer: (container: HTMLElement, config: any) => PannellumViewer;
    };
  }
}

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
}

interface DeviceOrientationEventWithAlpha extends DeviceOrientationEvent {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
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
  const [error, setError] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState<string | null>(null);
  const [showAR, setShowAR] = useState(false);
  const [showVR, setShowVR] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState<DeviceOrientationEventWithAlpha | null>(null);
  const [viewer, setViewer] = useState<PannellumViewer | null>(null);
  const [calibrationOffset, setCalibrationOffset] = useState<number>(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showCompass, setShowCompass] = useState(true);
  const [isPanoramaLoaded, setIsPanoramaLoaded] = useState(false);

  useEffect(() => {
    const loadPanoramaViewer = async () => {
      try {
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
              compass: showCompass,
              autoLoad: true,
              autoRotate: autoRotate ? -2 : 0,
              compassOffset: initialHeading || 0,
              sceneFadeDuration: 1000,
              default: {
                firstScene: scenes?.[0]?.id || 'default',
                sceneFadeDuration: 1000,
              },
              scenes: scenesConfig,
              onLoad: () => {
                console.log('Panorama loaded successfully');
                setIsPanoramaLoaded(true);
              },
              onError: (err: any) => {
                console.error('Panorama loading error:', err);
                setError('Failed to load panorama. Please try again.');
              },
              onScenechange: (sceneId: string) => {
                console.log('Scene changed to:', sceneId);
                setCurrentScene(sceneId);
              }
            };

            // Initialize viewer
            const newViewer = window.pannellum.viewer(viewerRef.current, viewerConfig);
            setViewer(newViewer);

            // Handle device orientation
            if (typeof window !== "undefined") {
              const DeviceOrientationEventWithPermission = DeviceOrientationEvent as unknown as DeviceOrientationEventiOS;
              const requestPermission = DeviceOrientationEventWithPermission.requestPermission;
              
              if (requestPermission) {
                const handlePermission = async () => {
                  try {
                    const permission = await requestPermission();
                    if (permission === "granted") {
                      window.addEventListener("deviceorientation", handleOrientation);
                    }
                  } catch (error) {
                    console.error("Error requesting device orientation permission:", error);
                  }
                };
                handlePermission();
              } else {
                window.addEventListener("deviceorientation", handleOrientation);
              }
            }
          }
        };
        document.body.appendChild(script);

        return () => {
          if (viewerRef.current) {
            viewerRef.current.innerHTML = '';
          }
          document.body.removeChild(script);
          document.head.removeChild(link);
          window.removeEventListener('deviceorientation', handleOrientation);
        };
      } catch (err) {
        console.error('Viewer initialization error:', err);
        setError('Failed to initialize panorama viewer. Please try again.');
      }
    };

    loadPanoramaViewer();
  }, [imageUrl, title, hotspots, scenes, initialHeading, showCompass, autoRotate]);

  const handleOrientation = (event: DeviceOrientationEventWithAlpha) => {
    setDeviceOrientation(event);
    if (viewer && !isCalibrating && event.alpha !== null) {
      const heading = event.alpha;
      const calibratedHeading = (heading + calibrationOffset) % 360;
      viewer.setYaw(calibratedHeading);
    }
  };

  const handleSceneChange = (sceneId: string) => {
    if (viewer) {
      try {
        viewer.loadScene(sceneId, 0, 0);
        setCurrentScene(sceneId);
      } catch (err) {
        console.error('Error changing scene:', err);
        setError('Failed to change scene. Please try again.');
      }
    }
  };

  const handleMove = (yaw: number, pitch: number) => {
    if (viewer) {
      viewer.lookTo(yaw, pitch, 1000);
    }
  };

  const toggleAR = () => {
    setShowAR(!showAR);
    setShowVR(false);
  };

  const toggleVR = () => {
    setShowVR(!showVR);
    setShowAR(false);
  };

  const toggleThumbnails = () => {
    setShowThumbnails(!showThumbnails);
  };

  const handleCalibrate = () => {
    const alpha = deviceOrientation?.alpha;
    if (alpha !== null && alpha !== undefined) {
      setCalibrationOffset((360 - alpha) % 360);
      setIsCalibrating(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
    if (viewer) {
      viewer.setAutoRotate(autoRotate ? 0 : -2);
    }
  };

  const toggleCompass = () => {
    setShowCompass(!showCompass);
    if (viewer) {
      viewer.setCompass(!showCompass);
    }
  };

  const handleMouseEnter = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    if (!isFullscreen) {
      setShowControls(false);
    }
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
    <div 
      className="relative w-full h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={viewerRef} 
        className="w-full h-[500px]"
      />

      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => handleMove(viewer?.getYaw() || 0, 0)}
            className="bg-primary/90 hover:bg-primary"
          >
            ←
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => handleMove(viewer?.getYaw() || 0, 90)}
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
            onClick={toggleVR}
            className={`${showVR ? 'bg-primary' : 'bg-primary/90 hover:bg-primary'}`}
          >
            <MapPin className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleThumbnails}
            className={`${showThumbnails ? 'bg-primary' : 'bg-primary/90 hover:bg-primary'}`}
          >
            <Compass className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleAutoRotate}
            className={`${autoRotate ? 'bg-primary' : 'bg-primary/90 hover:bg-primary'}`}
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleCompass}
            className={`${showCompass ? 'bg-primary' : 'bg-primary/90 hover:bg-primary'}`}
          >
            <Compass className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleFullscreen}
            className="bg-primary/90 hover:bg-primary"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </Button>
        </div>
      )}

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
                    target.src = scene.imageUrl;
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

      {/* AR/VR Overlay */}
      {(showAR || showVR) && (
        <AROverlay
          latitude={initialLatitude}
          longitude={initialLongitude}
          heading={deviceOrientation?.alpha || initialHeading || 0}
          mode={showAR ? 'ar' : 'vr'}
          onClose={() => {
            setShowAR(false);
            setShowVR(false);
          }}
        />
      )}
    </div>
  );
}
