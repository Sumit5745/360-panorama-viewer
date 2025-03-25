"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Smartphone, Headset, Compass, Volume2, VolumeX } from 'lucide-react';
import { viewModes } from '@/app/data/panoramas';

interface ViewControlsProps {
  onModeChange: (mode: string) => void;
  onAudioToggle: () => void;
  isAudioMuted: boolean;
}

export default function ViewControls({ onModeChange, onAudioToggle, isAudioMuted }: ViewControlsProps) {
  const [deviceOrientation, setDeviceOrientation] = useState(false);
  const [vrSupported, setVrSupported] = useState(false);
  const [arSupported, setArSupported] = useState(false);

  useEffect(() => {
    // Check device capabilities
    setDeviceOrientation('DeviceOrientationEvent' in window);
    setVrSupported('xr' in navigator);
    setArSupported('xr' in navigator && 'isSessionSupported' in (navigator as any).xr);
  }, []);

  const handleModeChange = async (mode: string) => {
    if (mode === 'vr' && !vrSupported) {
      alert('VR is not supported on this device');
      return;
    }

    if (mode === 'ar' && !arSupported) {
      alert('AR is not supported on this device');
      return;
    }

    onModeChange(mode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20"
    >
      <Card className="bg-black/50 backdrop-blur-sm border-gray-800 p-2">
        <div className="flex items-center gap-2">
          {viewModes.map((mode) => (
            <Button
              key={mode.id}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => handleModeChange(mode.id)}
              title={mode.title}
            >
              {mode.id === 'vr' && <Headset size={20} />}
              {mode.id === 'ar' && <Smartphone size={20} />}
              {mode.id === 'standard' && <Compass size={20} />}
              {mode.id === 'guided' && <span className="text-xl">{mode.icon}</span>}
            </Button>
          ))}
          <div className="w-px h-6 bg-gray-700" />
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onAudioToggle}
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isAudioMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
} 