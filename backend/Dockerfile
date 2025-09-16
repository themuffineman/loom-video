# Base image
FROM node:18-slim

# Install FFmpeg + Playwright deps
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install root dependencies
RUN npm install

# Install Playwright & deps
RUN npx playwright install && \
    npx playwright install-deps

# Copy the rest of the repo
COPY . .

# Install dependencies for your "video" subproject
WORKDIR /app/video
RUN npm install
WORKDIR /app

# Expose Railway port
EXPOSE 3000

# Start the main project
CMD ["npm", "start"]
