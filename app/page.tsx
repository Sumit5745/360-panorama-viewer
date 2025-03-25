"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Camera, Map, Info, Loader2, X } from 'lucide-react';
import { categories, features, panoramas } from './data/panoramas';
import dynamic from 'next/dynamic';
import { HeroModel } from '@/components/hero-model';
import Image from 'next/image';

// Import PanoramaViewer with dynamic import to prevent SSR issues
const PanoramaViewer = dynamic(() => import('@/components/panorama-viewer').then(mod => mod.PanoramaViewer), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-card/50 rounded-lg flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  ),
});

export default function HomePage() {
  const [currentPanorama] = useState(panoramas[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPanorama, setSelectedPanorama] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePanoramaClick = (panoramaId: string) => {
    setSelectedPanorama(panoramaId);
  };

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
              <Link href="/gallery">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Start Exploring
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg overflow-hidden shadow-2xl"
          >
            <HeroModel />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
          Experience the Future of Virtual Tours
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={`feature-${feature.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-card hover:bg-card/90 transition-colors border-primary/10 hover:border-primary">
                  {Icon && <Icon className="w-12 h-12 text-primary mb-4" />}
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
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
              className="group cursor-pointer"
              onClick={() => handlePanoramaClick(panorama.id)}
            >
              <Card className="overflow-hidden bg-card hover:bg-card/90 transition-all border-primary/10 hover:border-primary">
                <div className="aspect-video relative">
                  <Image
                    src={panorama.thumbnail || panorama.imageUrl}
                    alt={panorama.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 2}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = panorama.imageUrl;
                    }}
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

      {/* Panorama Viewer Modal */}
      {selectedPanorama && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="w-full max-w-7xl h-[90vh] relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
              onClick={() => setSelectedPanorama(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            <PanoramaViewer
              imageUrl={panoramas.find(p => p.id === selectedPanorama)?.imageUrl || ''}
              title={panoramas.find(p => p.id === selectedPanorama)?.title || ''}
              hotspots={panoramas.find(p => p.id === selectedPanorama)?.hotspots || []}
            />
          </div>
        </div>
      )}
    </div>
  );
}
