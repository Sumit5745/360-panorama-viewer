"use client";

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { MapPin, Calendar, Info } from 'lucide-react';
import type { Panorama } from '@/app/data/panoramas';

interface PanoramaDetailsProps {
  panorama: Panorama;
  onClose: () => void;
}

export default function PanoramaDetails({ panorama, onClose }: PanoramaDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute bottom-0 left-0 right-0 z-20 p-4 pointer-events-none"
    >
      <Card className="bg-black/50 backdrop-blur-sm border-gray-800 p-6 pointer-events-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">{panorama.title}</h2>
            <p className="text-gray-300">{panorama.description}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={16} />
                <span>{panorama.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar size={16} />
                <span>{panorama.date}</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Info size={16} />
              Points of Interest
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {panorama.hotspots.map((hotspot) => (
                <div
                  key={hotspot.id}
                  className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors"
                >
                  <h4 className="font-medium text-white">{hotspot.title}</h4>
                  {hotspot.description && (
                    <p className="text-sm text-gray-300 mt-1">{hotspot.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-white border-white/20 hover:bg-white/20"
          >
            Close Details
          </Button>
        </div>
      </Card>
    </motion.div>
  );
} 