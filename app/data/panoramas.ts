import { Camera, Map, Info, Compass, Globe, ArrowRight } from "lucide-react";

export const categories = [
  {
    id: "ar",
    title: "AR Experience",
    description: "View panoramas in augmented reality",
    icon: Camera,
  },
  {
    id: "location",
    title: "Location Based",
    description: "Explore panoramas based on your location",
    icon: Map,
  },
  {
    id: "info",
    title: "Information",
    description: "Learn about the locations you visit",
    icon: Info,
  },
];

export const features = [
  {
    title: "360° Views",
    description: "Explore stunning panoramic views in every direction",
    icon: Globe,
  },
  {
    title: "AR Navigation",
    description: "Use your device's camera to navigate through locations",
    icon: Camera,
  },
  {
    title: "Interactive Hotspots",
    description: "Click on points of interest to learn more",
    icon: Map,
  },
  {
    title: "Location Tracking",
    description: "Find nearby panoramas based on your location",
    icon: Compass,
  },
  {
    title: "Detailed Information",
    description: "Learn about the history and significance of each location",
    icon: Info,
  },
  {
    title: "Easy Navigation",
    description: "Intuitive controls for smooth exploration",
    icon: ArrowRight,
  },
];

export interface Hotspot {
  id: string;
  pitch: number;
  yaw: number;
  type: "info" | "scene" | "custom";
  text: string;
  sceneId?: string;
  imageUrl?: string;
}

export interface Scene {
  id: string;
  title: string;
  imageUrl: string;
  thumbnail?: string;
  hotspots?: Hotspot[];
  arImageUrl?: string;
  vrImageUrl?: string;
}

export interface Panorama {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnail?: string;
  category: string;
  latitude?: number;
  longitude?: number;
  hotspots: Hotspot[];
  scenes?: Scene[];
}

export const panoramas: Panorama[] = [
  {
    id: "mountain-peak",
    title: "Mountain Peak",
    description: "Experience the breathtaking view from the mountain peak",
    imageUrl: "https://images.unsplash.com/photo-1506906731076-74ed55d96f8a?auto=format&fit=crop&w=4096&q=100",
    thumbnail: "https://images.unsplash.com/photo-1506906731076-74ed55d96f8a?auto=format&fit=crop&w=400&q=80",
    category: "ar",
    latitude: 40.7128,
    longitude: -74.006,
    hotspots: [
      {
        id: "peak-info",
        pitch: 0,
        yaw: 0,
        type: "info",
        text: "Welcome to the Mountain Peak! This location offers stunning 360° views of the surrounding landscape.",
      },
      {
        id: "north-view",
        pitch: 0,
        yaw: 0,
        type: "scene",
        text: "View to the North",
        sceneId: "north-view",
      },
      {
        id: "south-view",
        pitch: 0,
        yaw: 180,
        type: "scene",
        text: "View to the South",
        sceneId: "south-view",
      },
    ],
    scenes: [
      {
        id: "north-view",
        title: "North View",
        imageUrl: "https://images.unsplash.com/photo-1506906731076-74ed55d96f8a?auto=format&fit=crop&w=4096&q=100",
        thumbnail: "https://images.unsplash.com/photo-1506906731076-74ed55d96f8a?auto=format&fit=crop&w=400&q=80",
        arImageUrl: "https://images.unsplash.com/photo-1506906731076-74ed55d96f8a?auto=format&fit=crop&w=2048&q=100",
        vrImageUrl: "https://images.unsplash.com/photo-1506906731076-74ed55d96f8a?auto=format&fit=crop&w=4096&q=100",
        hotspots: [
          {
            id: "back-to-main",
            pitch: 0,
            yaw: 180,
            type: "scene",
            text: "Back to Main View",
            sceneId: "mountain-peak",
          },
        ],
      },
      {
        id: "south-view",
        title: "South View",
        imageUrl: "https://images.unsplash.com/photo-1506906731076-74ed55d96f8a?auto=format&fit=crop&w=4096&q=100",
        thumbnail: "https://images.unsplash.com/photo-1506906731076-74ed55d96f8a?auto=format&fit=crop&w=400&q=80",
        arImageUrl: "https://images.unsplash.com/photo-1506906731076-74ed55d96f8a?auto=format&fit=crop&w=2048&q=100",
        vrImageUrl: "https://images.unsplash.com/photo-1506906731076-74ed55d96f8a?auto=format&fit=crop&w=4096&q=100",
        hotspots: [
          {
            id: "back-to-main",
            pitch: 0,
            yaw: 0,
            type: "scene",
            text: "Back to Main View",
            sceneId: "mountain-peak",
          },
        ],
      },
    ],
  },
  {
    id: "beach-sunset",
    title: "Beach Sunset",
    description: "Watch the beautiful sunset over the ocean",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=4096&q=100",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    category: "location",
    latitude: 25.7617,
    longitude: -80.1918,
    hotspots: [
      {
        id: "beach-info",
        pitch: 0,
        yaw: 0,
        type: "info",
        text: "Welcome to the Beach! Enjoy the stunning sunset views and peaceful ocean waves.",
      },
      {
        id: "palm-trees",
        pitch: -10,
        yaw: 45,
        type: "info",
        text: "Beautiful palm trees swaying in the breeze",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "ocean-view",
        pitch: -5,
        yaw: 180,
        type: "info",
        text: "Crystal clear waters of the ocean",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
      },
    ],
    scenes: [
      {
        id: "beach-scene",
        title: "Beach Scene",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=4096&q=100",
        thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
        arImageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2048&q=100",
        vrImageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=4096&q=100",
      }
    ]
  },
  {
    id: "city-skyline",
    title: "City Skyline",
    description: "Explore the vibrant city skyline",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=4096&q=100",
    thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=400&q=80",
    category: "info",
    latitude: 40.7128,
    longitude: -74.006,
    hotspots: [
      {
        id: "city-info",
        pitch: 0,
        yaw: 0,
        type: "info",
        text: "Welcome to the City! Take in the stunning architecture and urban landscape.",
      },
      {
        id: "landmark-1",
        pitch: -10,
        yaw: 45,
        type: "info",
        text: "Historic landmark with rich history",
        imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "landmark-2",
        pitch: -5,
        yaw: 180,
        type: "info",
        text: "Modern architectural marvel",
        imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=400&q=80",
      },
    ],
    scenes: [
      {
        id: "city-scene",
        title: "City Scene",
        imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=4096&q=100",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=400&q=80",
        arImageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2048&q=100",
        vrImageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=4096&q=100",
      }
    ]
  },
  {
    id: "forest-path",
    title: "Forest Path",
    description: "Walk through a serene forest path",
    imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=4096&q=100",
    thumbnail: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=400&q=80",
    category: "location",
    latitude: 45.5155,
    longitude: -122.6789,
    hotspots: [
      {
        id: "forest-info",
        pitch: 0,
        yaw: 0,
        type: "info",
        text: "Welcome to the Forest Path! Experience the tranquility of nature.",
      },
      {
        id: "trees",
        pitch: -10,
        yaw: 45,
        type: "info",
        text: "Ancient trees creating a natural canopy",
        imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "path",
        pitch: -5,
        yaw: 180,
        type: "info",
        text: "Winding path through the forest",
        imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=400&q=80",
      },
    ],
    scenes: [
      {
        id: "forest-scene",
        title: "Forest Scene",
        imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=4096&q=100",
        thumbnail: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=400&q=80",
        arImageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=2048&q=100",
        vrImageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=4096&q=100",
      }
    ]
  },
  {
    id: "desert-dunes",
    title: "Desert Dunes",
    description: "Explore the vast desert landscape",
    imageUrl: "https://images.unsplash.com/photo-1509316787929-025f5b846b35?auto=format&fit=crop&w=4096&q=100",
    thumbnail: "https://images.unsplash.com/photo-1509316787929-025f5b846b35?auto=format&fit=crop&w=400&q=80",
    category: "ar",
    latitude: 24.7136,
    longitude: 46.6753,
    hotspots: [
      {
        id: "desert-info",
        pitch: 0,
        yaw: 0,
        type: "info",
        text: "Welcome to the Desert Dunes! Experience the beauty of the desert landscape.",
      },
      {
        id: "dunes",
        pitch: -10,
        yaw: 45,
        type: "info",
        text: "Majestic sand dunes stretching to the horizon",
        imageUrl: "https://images.unsplash.com/photo-1509316787929-025f5b846b35?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "sunset",
        pitch: -5,
        yaw: 180,
        type: "info",
        text: "Stunning desert sunset",
        imageUrl: "https://images.unsplash.com/photo-1509316787929-025f5b846b35?auto=format&fit=crop&w=400&q=80",
      },
    ],
    scenes: [
      {
        id: "desert-scene",
        title: "Desert Scene",
        imageUrl: "https://images.unsplash.com/photo-1509316787929-025f5b846b35?auto=format&fit=crop&w=4096&q=100",
        thumbnail: "https://images.unsplash.com/photo-1509316787929-025f5b846b35?auto=format&fit=crop&w=400&q=80",
        arImageUrl: "https://images.unsplash.com/photo-1509316787929-025f5b846b35?auto=format&fit=crop&w=2048&q=100",
        vrImageUrl: "https://images.unsplash.com/photo-1509316787929-025f5b846b35?auto=format&fit=crop&w=4096&q=100",
      }
    ]
  },
  {
    id: "lake-view",
    title: "Lake View",
    description: "Enjoy the peaceful lake scenery",
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=4096&q=100",
    thumbnail: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
    category: "location",
    latitude: 44.428,
    longitude: -110.5885,
    hotspots: [
      {
        id: "lake-info",
        pitch: 0,
        yaw: 0,
        type: "info",
        text: "Welcome to the Lake! Take in the serene waters and surrounding nature.",
      },
      {
        id: "mountains",
        pitch: -10,
        yaw: 45,
        type: "info",
        text: "Snow-capped mountains in the distance",
        imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "reflection",
        pitch: -5,
        yaw: 180,
        type: "info",
        text: "Perfect reflection on the lake's surface",
        imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
      },
    ],
    scenes: [
      {
        id: "lake-scene",
        title: "Lake Scene",
        imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=4096&q=100",
        thumbnail: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
        arImageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2048&q=100",
        vrImageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=4096&q=100",
      }
    ]
  },
];

export const viewModes = [
  {
    id: "standard",
    title: "Standard View",
    icon: "🖥️",
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
