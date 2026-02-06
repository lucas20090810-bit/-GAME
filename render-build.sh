#!/usr/bin/env bash
# Render Build Script

echo "📦 Installing root dependencies..."
npm install

echo "📦 Installing server dependencies..."
cd server && npm install

echo "✅ Build complete!"
