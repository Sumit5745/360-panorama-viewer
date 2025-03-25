"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { categories, panoramas } from '../data/panoramas';
import dynamic from 'next/dynamic';
import { Search, Filter, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PanoramaViewer = dynamic(
  () => import('@/components/panorama-viewer').then((mod) => mod.PanoramaViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading panorama viewer...</div>
      </div>
    ),
  }
);

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPanorama, setSelectedPanorama] = useState<number | null>(null);
  const [filteredPanoramas, setFilteredPanoramas] = useState(panoramas);

  // Get unique categories
  const uniqueCategories = ["all", ...new Set(panoramas.map((p) => p.category))];

  // Filter panoramas based on search and category
  useEffect(() => {
    let filtered = panoramas;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (panorama) =>
          panorama.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          panorama.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((panorama) => panorama.category === selectedCategory);
    }

    setFilteredPanoramas(filtered);
  }, [searchQuery, selectedCategory]);

  const selectedPanoramaData = selectedPanorama 
    ? panoramas.find(p => p.id === selectedPanorama)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-white">Panorama Gallery</h1>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search panoramas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800/50 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 w-full md:w-64"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(searchQuery || selectedCategory !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="bg-transparent border-b border-gray-800 w-full justify-start mb-8">
            <TabsTrigger value="all" className="data-[state=active]:bg-gray-800">
              All
            </TabsTrigger>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-gray-800"
                >
                  <span className="mr-2">
                    {Icon && <Icon className="h-4 w-4" />}
                  </span>
                  {category.title}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPanoramas.map((panorama) => (
              <motion.div
                key={panorama.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 overflow-hidden group">
                  <div className="relative aspect-video">
                    {panorama.thumbnail || panorama.imageUrl ? (
                      <Image
                        src={panorama.thumbnail || panorama.imageUrl}
                        alt={panorama.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = panorama.imageUrl;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800/50 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="secondary"
                        onClick={() => setSelectedPanorama(panorama.id)}
                      >
                        View Panorama
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-white">{panorama.title}</h3>
                      <span className="text-sm text-gray-400">{panorama.date}</span>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2">{panorama.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{panorama.location}</span>
                      <span className="text-sm text-gray-400">
                        {(() => {
                          const category = categories.find(c => c.id === panorama.category);
                          if (category) {
                            const Icon = category.icon;
                            return Icon && <Icon className="h-4 w-4" />;
                          }
                          return null;
                        })()}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Tabs>
      </main>

      {/* Panorama Viewer Modal */}
      <AnimatePresence>
        {selectedPanoramaData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <Button
              variant="ghost"
              className="absolute top-4 right-4 z-10 text-white"
              onClick={() => setSelectedPanorama(null)}
            >
              Close
            </Button>
            <PanoramaViewer
              imageUrl={selectedPanoramaData.imageUrl}
              title={selectedPanoramaData.title}
              hotspots={selectedPanoramaData.hotspots}
              initialLatitude={selectedPanoramaData.latitude}
              initialLongitude={selectedPanoramaData.longitude}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 