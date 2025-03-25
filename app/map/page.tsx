"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { panoramas } from '../data/panoramas';
import { MapPin, Image as ImageIcon, Info } from 'lucide-react';

// Import map component dynamically to prevent SSR issues
const Map = dynamic(() => import('@/components/map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-4rem)] bg-gray-900 animate-pulse" />
  ),
});

const PanoramaViewer = dynamic(() => import('@/components/panorama-viewer'), {
  ssr: false,
});

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [showViewer, setShowViewer] = useState(false);

  const handleLocationSelect = (id: number) => {
    setSelectedLocation(id);
  };

  const selectedPanorama = selectedLocation !== null 
    ? panoramas.find(p => p.id === selectedLocation)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="relative h-[calc(100vh-4rem)]">
        <Map
          locations={panoramas}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
        />

        {/* Location Info Overlay */}
        <AnimatePresence>
          {selectedPanorama && !showViewer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4"
            >
              <Card className="bg-black/50 backdrop-blur-sm border-gray-800 p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">{selectedPanorama.title}</h2>
                    <p className="text-gray-300">{selectedPanorama.description}</p>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin size={16} />
                      <span>{selectedPanorama.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="text-white border-white/20 hover:bg-white/20"
                      onClick={() => setShowViewer(true)}
                    >
                      <ImageIcon className="mr-2" size={20} />
                      View Panorama
                    </Button>
                    <Button
                      variant="outline"
                      className="text-white border-white/20 hover:bg-white/20"
                    >
                      <Info className="mr-2" size={20} />
                      More Info
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panorama Viewer Modal */}
        <AnimatePresence>
          {showViewer && selectedPanorama && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black"
            >
              <Button
                variant="ghost"
                className="absolute top-4 right-4 z-10 text-white"
                onClick={() => setShowViewer(false)}
              >
                Close
              </Button>
              <PanoramaViewer
                initialPanorama={selectedPanorama}
                onPanoramaChange={(panorama) => setSelectedLocation(panorama.id)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 