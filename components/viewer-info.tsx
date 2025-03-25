"use client"

import { Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ViewerInfoProps {
  title: string
  likes: number
  views: number
  date: string
}

export default function ViewerInfo({ title, likes, views, date }: ViewerInfoProps) {
  return (
    <div className="absolute top-0 right-0 w-72 bg-black/80 text-white h-full z-10 p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <span className="font-bold">360</span>
        </div>
        <div>
          <div className="font-bold">360° Panorama Tours</div>
          <div className="text-xs bg-green-700 px-2 py-0.5 rounded inline-block">PRO</div>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <Button variant="ghost" size="sm" className="text-white">
          <Heart size={18} className="mr-2" />
          Like
        </Button>
        <Button variant="ghost" size="sm" className="text-white">
          <Share2 size={18} className="mr-2" />
          Share
        </Button>
      </div>

      <div className="text-sm mb-2">
        <span className="mr-2">{likes} likes</span>
        <span className="mr-2">{date}</span>
        <span>{views} views</span>
      </div>

      <h1 className="text-xl font-bold mb-4">{title}</h1>

      <div className="text-sm mb-4">
        <div className="font-semibold mb-1">Main Menu</div>
        <div>
          Visit <span className="text-blue-400 hover:underline cursor-pointer">360PanoramaTours.com</span> for more
          immersive virtual tours of entire cities!
        </div>
      </div>

      <div className="mt-auto">
        <div className="text-sm mb-2">0 comments</div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-700"></div>
          <input type="text" placeholder="Add comment..." className="bg-gray-800 rounded px-3 py-1 text-sm w-full" />
        </div>
      </div>
    </div>
  )
}

