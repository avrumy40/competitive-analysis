#!/bin/bash
set -e

echo "Starting optimized build process..."

# Set memory limit for Node.js to work within Render's constraints
export NODE_OPTIONS="--max-old-space-size=480"

echo "Building frontend with Vite (production mode)..."
NODE_ENV=production npx vite build --minify=esbuild

echo "Building backend with esbuild..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --minify

echo "Build completed successfully!"
ls -la dist/