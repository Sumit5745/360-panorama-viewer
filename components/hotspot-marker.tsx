"use client"

import { useState } from "react"

interface HotspotMarkerProps {
  title: string
  position: { x: number; y: number }
}

export default function HotspotMarker({ title, position }: HotspotMarkerProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center cursor-pointer">
        <div className="w-2 h-2 bg-black rounded-full"></div>
      </div>

      {isHovered && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/80 text-white px-3 py-1 rounded whitespace-nowrap">
          {title}
        </div>
      )}
    </div>
  )
}

