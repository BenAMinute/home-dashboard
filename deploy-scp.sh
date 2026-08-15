#!/bin/bash

# Quick deployment script to copy built dashboard files to a remote server/LXC via SCP
# Usage: ./deploy-scp.sh <SERVER_IP> [TARGET_DIR]

if [ -z "$1" ]; then
  echo "Usage: ./deploy-scp.sh <SERVER_IP> [TARGET_DIR]"
  echo "Example: ./deploy-scp.sh 192.168.1.50 /usr/share/nginx/html"
  exit 1
fi

SERVER_IP=$1
TARGET_DIR=${2:-"/usr/share/nginx/html"}

echo "📦 Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "🚀 Uploading files to root@${SERVER_IP}:${TARGET_DIR}..."
scp -r dist/* root@${SERVER_IP}:${TARGET_DIR}/

echo "✅ Deployment complete! Open http://${SERVER_IP}"
