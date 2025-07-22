#!/bin/bash

echo "🚀 Starting KillTheNoise.ai application..."

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "react-scripts" 2>/dev/null
pkill -f "ts-node-dev" 2>/dev/null
pkill -f "concurrently" 2>/dev/null

# Start the server
echo "🔧 Starting backend server on port 5001..."
cd server && npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Start the client
echo "🎨 Starting frontend on port 3001..."
cd ../client && PORT=3001 npm start &
CLIENT_PID=$!

echo ""
echo "✅ KillTheNoise.ai is starting up!"
echo "📊 Backend API: http://localhost:5001"
echo "🎨 Frontend Dashboard: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait 