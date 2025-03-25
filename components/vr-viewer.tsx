import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Headset, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VRViewerProps {
  imageUrl?: string;
}

export function VRViewer({ imageUrl }: VRViewerProps) {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="text-white text-center">
        <h3 className="text-xl font-semibold mb-2">VR Mode</h3>
        <p className="text-sm opacity-80">
          {imageUrl ? "VR experience loaded" : "No panorama loaded"}
        </p>
      </div>
    </div>
  );
} 