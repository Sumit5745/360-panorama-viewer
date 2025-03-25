import { Camera, Compass, Map, VrHeadset, Smartphone, Volume2 } from 'lucide-react';

export interface HotspotPosition {
  pitch: number;
  yaw: number;
}

export interface Hotspot extends HotspotPosition {
  text: string;
  type?: 'info' | 'scene' | 'link';
  sceneId?: string;
  link?: string;
}

export interface Panorama {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
  hotspots?: Hotspot[];
  latitude?: number;
  longitude?: number;
  initialView?: {
    pitch: number;
    yaw: number;
    hfov: number;
  };
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: any;
}

export const categories: Category[] = [
  {
    id: 'nature',
    title: 'Nature',
    description: 'Explore breathtaking natural landscapes',
    icon: Compass,
  },
  {
    id: 'architecture',
    title: 'Architecture',
    description: 'Discover amazing architectural wonders',
    icon: Camera,
  },
  {
    id: 'cities',
    title: 'Cities',
    description: 'Experience vibrant city panoramas',
    icon: Map,
  },
];

export const panoramas: Panorama[] = [
  {
    id: 'mountain-vista',
    title: 'Mountain Vista',
    description: 'A stunning view of snow-capped mountains and valleys',
    imageUrl: 'https://pannellum.org/images/cerro-toco-0.jpg',
    thumbnailUrl: 'https://pannellum.org/images/cerro-toco-0-thumb.jpg',
    category: 'nature',
    hotspots: [
      {
        pitch: -0.6,
        yaw: 37.1,
        text: 'Peak Summit',
        type: 'info',
      },
      {
        pitch: -1.1,
        yaw: 67.2,
        text: 'Valley View',
        type: 'info',
      },
    ],
    latitude: -22.908333,
    longitude: -67.775,
    initialView: {
      pitch: -0.9,
      yaw: 12.0,
      hfov: 90,
    },
  },
  {
    id: 'ancient-temple',
    title: 'Ancient Temple',
    description: 'An ancient temple with intricate architecture',
    imageUrl: 'https://pannellum.org/images/alma.jpg',
    thumbnailUrl: 'https://pannellum.org/images/alma-thumb.jpg',
    category: 'architecture',
    hotspots: [
      {
        pitch: -0.6,
        yaw: 37.1,
        text: 'Main Entrance',
        type: 'info',
      },
      {
        pitch: -1.1,
        yaw: 67.2,
        text: 'Virtual Tour',
        type: 'link',
        link: '/tour/temple',
      },
    ],
    initialView: {
      pitch: 0,
      yaw: 180,
      hfov: 100,
    },
  },
  {
    id: 'city-square',
    title: 'City Square',
    description: 'A bustling city square with historic buildings',
    imageUrl: 'https://pannellum.org/images/bma-1.jpg',
    thumbnailUrl: 'https://pannellum.org/images/bma-1-thumb.jpg',
    category: 'cities',
    hotspots: [
      {
        pitch: 0,
        yaw: 0,
        text: 'City Hall',
        type: 'info',
      },
    ],
    initialView: {
      pitch: -5,
      yaw: 0,
      hfov: 100,
    },
  },
];

export const features = [
  {
    title: 'VR Mode',
    description: 'Experience panoramas in virtual reality with VR headset support',
    icon: VrHeadset,
  },
  {
    title: 'AR View',
    description: 'Augmented reality view using your device\'s sensors',
    icon: Smartphone,
  },
  {
    title: 'Motion Controls',
    description: 'Navigate using device motion and orientation',
    icon: Compass,
  },
  {
    title: 'Virtual Tours',
    description: 'Take guided tours through connected panoramas',
    icon: Map,
  },
  {
    title: '3D Sound',
    description: 'Immersive spatial audio experience',
    icon: Volume2,
  },
  {
    title: 'Live Weather',
    description: 'Real-time weather integration for outdoor scenes',
    icon: Camera,
  },
];

export const viewModes = [
  {
    id: "standard",
    title: "Standard View",
    icon: "🖥️",
  },
  {
    id: "vr",
    title: "VR Mode",
    icon: "🥽",
  },
  {
    id: "ar",
    title: "AR View",
    icon: "📱",
  },
  {
    id: "guided",
    title: "Guided Tour",
    icon: "🎯",
  },
];
