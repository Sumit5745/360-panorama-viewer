"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Maximize, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Compass,
  Map,
  X,
  Loader2,
  Headset,
  Smartphone
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import dynamic from 'next/dynamic';

// Prevent SSR for Pannellum-related code
declare global {
  interface Window {
    pannellum: {
      viewer: (containerId: string, config: any) => any;
    };
  }
}

// Sample panorama data with reliable demo images
const panoramas = [
  {
    id: 1,
    title: "Mountain View",
    demoUrl: "https://raw.githubusercontent.com/mpetroff/pannellum/master/examples/examplepano.jpg",
    thumbnail: "/thumbnails/mountain.jpg",
    hotspots: [
      { id: 1, title: "Mountain Peak", position: { yaw: 5, pitch: -5 } },
      { id: 2, title: "Valley", position: { yaw: 150, pitch: -8 } },
      { id: 3, title: "Forest", position: { yaw: 270, pitch: -10 } },
    ],
  },
  {
    id: 2,
    title: "Beach Panorama",
    demoUrl: "https://raw.githubusercontent.com/mpetroff/pannellum/master/examples/examplepano2.jpg",
    thumbnail: "/thumbnails/beach.jpg",
    hotspots: [
      { id: 1, title: "Ocean View", position: { yaw: 120, pitch: -5 } },
      { id: 2, title: "Palm Trees", position: { yaw: 200, pitch: 0 } },
    ],
  },
];

interface NavigationArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

const NavigationArrow = ({ direction, onClick }: NavigationArrowProps) => {
  return (
    <motion.div
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-10",
        direction === 'left' ? "left-4" : "right-4"
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        variant="secondary"
        size="lg"
        className="bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full w-12 h-12"
        onClick={onClick}
      >
        {direction === 'left' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </Button>
    </motion.div>
  );
};

interface HotspotPosition {
  yaw: number;
  pitch: number;
}

interface Hotspot {
  id: number;
  title: string;
  position: HotspotPosition;
}

interface Panorama {
  id: number;
  title: string;
  demoUrl: string;
  thumbnail: string;
  hotspots: Hotspot[];
}

interface PanoramaViewerProps {
  imageUrl: string;
  title?: string;
  hotspots?: Array<{
    pitch: number;
    yaw: number;
    text: string;
    type?: string;
  }>;
}

export function PanoramaViewer({ imageUrl, title, hotspots = [] }: PanoramaViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [viewer, setViewer] = useState<any>(null);
  const [isVRMode, setIsVRMode] = useState(false);
  const [isARMode, setIsARMode] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCompass, setShowCompass] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(-2);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    return () => {
      if (viewer?.destroy) {
        viewer.destroy();
      }
    };
  }, [viewer]);

  useEffect(() => {
    if (!hasMounted) return;

    const loadPannellum = async () => {
      try {
        // Load Pannellum script
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
        script.async = true;
        document.head.appendChild(script);

        // Load Pannellum CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
        document.head.appendChild(link);

        script.onload = () => {
          initViewer();
        };
      } catch (err) {
        setError('Failed to load panorama viewer');
        setIsLoading(false);
      }
    };

    loadPannellum();
  }, [hasMounted, imageUrl]);

  const initViewer = () => {
    if (!viewerRef.current || !imageUrl) return;

    try {
      const containerId = `pannellum-${Date.now()}`;
      viewerRef.current.id = containerId;

      const viewerInstance = window.pannellum.viewer(containerId, {
        type: 'equirectangular',
        panorama: imageUrl,
        autoLoad: true,
        hotSpots: hotspots,
        title: title,
        preview: imageUrl,
        showControls: true,
        compass: showCompass,
        autoRotate: rotationSpeed,
        onLoad: () => {
          setIsLoading(false);
          setLoadingProgress(100);
        },
        onProgress: (progress: number) => {
          setLoadingProgress(Math.round(progress * 100));
        },
        onError: (err: string) => {
          setError(err);
          setIsLoading(false);
        }
      });

      setViewer(viewerInstance);
    } catch (err) {
      setError('Failed to initialize panorama viewer');
      setIsLoading(false);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!viewer) return;
    
    const currentHfov = viewer.getHfov();
    const newHfov = direction === 'in' ? 
      Math.max(currentHfov - 10, 30) : // Minimum zoom (maximum magnification)
      Math.min(currentHfov + 10, 120); // Maximum zoom (minimum magnification)
    
    viewer.setHfov(newHfov);
  };

  const handleRotationSpeedChange = (value: number[]) => {
    const speed = value[0];
    setRotationSpeed(speed);
    if (viewer) {
      viewer.setAutoRotate(speed);
    }
  };

  const toggleFullscreen = () => {
    if (!viewerRef.current) return;

    if (!isFullscreen) {
      if (viewerRef.current.requestFullscreen) {
        viewerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioMuted(!isAudioMuted);
  };

  const toggleVR = () => {
    if (!viewer) return;
    setIsVRMode(!isVRMode);
    if (!isVRMode) {
      if ('xr' in navigator) {
        viewer.startVR?.();
      } else {
        alert('WebXR not supported in your browser');
      }
    } else {
      viewer.stopVR?.();
    }
  };

  const toggleAR = () => {
    if (!viewer) return;
    setIsARMode(!isARMode);
    if (!isARMode) {
      if ('xr' in navigator) {
        viewer.startAR?.();
      } else {
        alert('WebXR not supported in your browser');
      }
    } else {
      viewer.stopAR?.();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (error) {
    return (
      <Card className="p-4 text-center text-red-500">
        <p>Error: {error}</p>
        <p className="text-sm mt-2">Please make sure a valid panorama image URL is provided.</p>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden" ref={viewerRef}>
      {/* Title Bar */}
      {title && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg"
        >
          <h2 className="text-white text-lg font-semibold">{title}</h2>
        </motion.div>
      )}

      {/* Controls Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/30 backdrop-blur-sm p-2 rounded-lg"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleZoom('in')}
          className="text-white hover:bg-white/20"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleZoom('out')}
          className="text-white hover:bg-white/20"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </Button>
        <div className="h-6 w-px bg-white/20" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowCompass(!showCompass)}
          className={cn("text-white hover:bg-white/20", showCompass && "bg-white/20")}
          title="Toggle Compass"
        >
          <Compass size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowMiniMap(!showMiniMap)}
          className={cn("text-white hover:bg-white/20", showMiniMap && "bg-white/20")}
          title="Toggle Mini Map"
        >
          <Map size={20} />
        </Button>
        <div className="h-6 w-px bg-white/20" />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleVR}
          className={cn("text-white hover:bg-white/20", isVRMode && "bg-white/20")}
          title="VR Mode"
        >
          <Headset size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAR}
          className={cn("text-white hover:bg-white/20", isARMode && "bg-white/20")}
          title="AR Mode"
        >
          <Smartphone size={20} />
        </Button>
        <div className="h-6 w-px bg-white/20" />
        <div className="flex items-center gap-2 px-2">
          <RotateCcw size={16} className="text-white" />
          <Slider
            value={[rotationSpeed]}
            min={-5}
            max={5}
            step={1}
            className="w-24"
            onValueChange={handleRotationSpeedChange}
          />
        </div>
        <div className="h-6 w-px bg-white/20" />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAudio}
          className="text-white hover:bg-white/20"
        >
          {isAudioMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="text-white hover:bg-white/20"
          title="Toggle Fullscreen"
        >
          <Maximize size={20} />
        </Button>
      </motion.div>

      {/* Loading Progress */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          <p className="text-white font-medium">{loadingProgress}% Loading...</p>
        </div>
      )}
    </div>
  );
}
