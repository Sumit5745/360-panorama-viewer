"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Camera, Map, Info } from 'lucide-react';
import { categories, features, panoramas } from './data/panoramas';
import dynamic from 'next/dynamic';

// Import PanoramaViewer with dynamic import to prevent SSR issues
const PanoramaViewer = dynamic(() => import('@/components/panorama-viewer').then(mod => mod.PanoramaViewer), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-card/50 rounded-lg flex items-center justify-center">
      <div className="loading-spinner" />
    </div>
  ),
});

export default function HomePage() {
  const [currentPanorama] = useState(panoramas[0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
              Immersive 360° Experiences
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore stunning panoramic views with our advanced viewer featuring AR/VR support.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Exploring
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Learn More
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg overflow-hidden shadow-2xl"
          >
            <PanoramaViewer imageUrl={currentPanorama.imageUrl} title={currentPanorama.title} />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
          Experience the Future of Virtual Tours
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full bg-card hover:bg-card/90 transition-colors border-primary/10 hover:border-primary">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
          Featured Panoramas
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {panoramas.slice(0, 3).map((panorama, index) => (
            <motion.div
              key={panorama.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Card className="overflow-hidden bg-card hover:bg-card/90 transition-all border-primary/10 hover:border-primary">
                <div className="aspect-video relative">
                  <img
                    src={panorama.thumbnailUrl || panorama.imageUrl}
                    alt={panorama.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" className="bg-primary/90 hover:bg-primary">
                      View Panorama
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{panorama.title}</h3>
                  <p className="text-sm text-muted-foreground">{panorama.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
