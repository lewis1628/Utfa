# Multi-stage production Dockerfile for VidiLoad Studio
FROM node:22-bullseye-slim

# Install FFmpeg, Python3, curl and download latest yt-dlp
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    curl \
    ca-certificates \
    && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Build application (Vite SPA + Bundled Server)
RUN npm run build

# Expose default application port
EXPOSE 3000

# Start production server
CMD ["node", "dist/server.cjs"]
