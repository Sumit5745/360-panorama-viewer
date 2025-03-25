"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Twitter, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About 360° Viewer</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience immersive panoramic views with our cutting-edge viewer. Built with modern web technologies
            and designed for optimal user experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: "Modern Technology",
              description: "Built with Next.js, TypeScript, and modern web standards",
              icon: "🚀"
            },
            {
              title: "VR Support",
              description: "Full Virtual Reality support for immersive experiences",
              icon: "🥽"
            },
            {
              title: "AR Integration",
              description: "Augmented Reality features for real-world context",
              icon: "📱"
            },
            {
              title: "Interactive Maps",
              description: "Explore locations with our interactive map interface",
              icon: "🗺️"
            },
            {
              title: "High Performance",
              description: "Optimized for smooth performance across all devices",
              icon: "⚡"
            },
            {
              title: "Open Source",
              description: "Free and open source for the community",
              icon: "💻"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Built With</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Next.js", "React", "TypeScript", "Tailwind CSS",
              "Framer Motion", "Mapbox GL", "WebXR", "Three.js"
            ].map((tech) => (
              <Card
                key={tech}
                className="bg-gray-800/50 border-gray-700 p-4 text-center hover:bg-gray-800/70 transition-colors"
              >
                {tech}
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/20">
              <Github className="mr-2" size={20} />
              GitHub
            </Button>
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/20">
              <Twitter className="mr-2" size={20} />
              Twitter
            </Button>
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/20">
              <Mail className="mr-2" size={20} />
              Contact
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 