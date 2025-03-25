import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Compass,
  Map,
  Globe,
  Navigation,
  Route
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapControlsProps {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onZoom: (direction: 'in' | 'out') => void;
  onRotate: (angle: number) => void;
  onCompassToggle: () => void;
  onMapToggle: () => void;
  onRouteToggle: () => void;
  showCompass: boolean;
  showMap: boolean;
  showRoutes: boolean;
  className?: string;
}

export function MapControls({
  onMove,
  onZoom,
  onRotate,
  onCompassToggle,
  onMapToggle,
  onRouteToggle,
  showCompass,
  showMap,
  showRoutes,
  className
}: MapControlsProps) {
  const [rotation, setRotation] = useState(0);

  const handleRotate = (direction: 'cw' | 'ccw') => {
    const angle = direction === 'cw' ? 45 : -45;
    setRotation(prev => prev + angle);
    onRotate(angle);
  };

  return (
    <div className={cn("fixed bottom-8 right-8 flex flex-col gap-4", className)}>
      {/* Navigation Controls */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background/80 backdrop-blur-sm rounded-lg p-2 shadow-lg"
      >
        <div className="grid grid-cols-3 gap-1">
          <div />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMove('up')}
            className="hover:bg-accent"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <div />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMove('left')}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-move hover:bg-accent"
          >
            <Navigation className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMove('right')}
            className="hover:bg-accent"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMove('down')}
            className="hover:bg-accent"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <div />
        </div>
      </motion.div>

      {/* Zoom and Rotation Controls */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background/80 backdrop-blur-sm rounded-lg p-2 shadow-lg flex flex-col gap-2"
      >
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onZoom('in')}
            className="hover:bg-accent"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onZoom('out')}
            className="hover:bg-accent"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRotate('ccw')}
            className="hover:bg-accent"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRotate('cw')}
            className="hover:bg-accent"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Map Tools */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background/80 backdrop-blur-sm rounded-lg p-2 shadow-lg flex gap-2"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onCompassToggle}
          className={cn("hover:bg-accent", showCompass && "bg-accent/50")}
        >
          <Compass className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onMapToggle}
          className={cn("hover:bg-accent", showMap && "bg-accent/50")}
        >
          <Map className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRouteToggle}
          className={cn("hover:bg-accent", showRoutes && "bg-accent/50")}
        >
          <Route className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
} 