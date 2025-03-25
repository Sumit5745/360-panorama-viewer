"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from 'components/ui/button'; // Corrected import

interface PanoramaFallbackProps {
  title: string;
  onNavigate: (direction: "next" | "prev") => void;
}

export default function PanoramaFallback({ title, onNavigate }: PanoramaFallbackProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      setRotation((prev) => prev + deltaX * 0.5);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="w-full h-full relative bg-black flex items-center justify-center overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="w-full h-full transition-transform"
        style={{ transform: `perspective(1000px) rotateY(${rotation}deg)` }}
      >
        <Image src="/placeholder.svg?height=2000&width=4000" alt={title} fill className="object-cover" priority />
      </div>

      <div className="absolute top-4 left-4 text-white bg-black/50 px-4 py-2 rounded-lg">{title}</div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full z-10 whitespace-nowrap">
        CLICK & DRAG TO LOOK AROUND
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white border-none hover:bg-black/70 z-10"
        onClick={() => onNavigate("prev")}
      >
        <ChevronLeft size={24} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white border-none hover:bg-black/70 z-10"
        onClick={() => onNavigate("next")}
      >
        <ChevronRight size={24} />
      </Button>
    </div>
  );
}
