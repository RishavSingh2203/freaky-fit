// This is a simple script to generate PWA icons
// In a real application, you should use proper icon generation tools or design your own icons

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_DIR = path.resolve(__dirname, '../public/pwa-icons');

// Create directory if it doesn't exist
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Create simple placeholder SVG icons
const icons = [
  { 
    size: 192,
    filename: 'icon-192x192.png' 
  },
  { 
    size: 512,
    filename: 'icon-512x512.png' 
  },
  { 
    size: 512,
    filename: 'icon-maskable-512x512.png' 
  },
  { 
    size: 180,
    filename: 'apple-touch-icon.png' 
  }
];

// Create a simple SVG icon
function createPlaceholderIcon(size, outputPath) {
  const svgContent = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#4F46E5"/>
    <text x="50%" y="50%" font-family="Arial" font-size="${size/4}" fill="white" text-anchor="middle" dominant-baseline="middle">FF</text>
  </svg>`;
  
  fs.writeFileSync(outputPath, svgContent);
  console.log(`Created: ${outputPath}`);
}

// Create all icons
function createAllIcons() {
  try {
    for (const icon of icons) {
      const outputPath = path.join(ICONS_DIR, icon.filename.replace('.png', '.svg'));
      createPlaceholderIcon(icon.size, outputPath);
    }
    console.log('All icons created successfully!');
  } catch (error) {
    console.error('Error creating icons:', error);
  }
}

createAllIcons(); 