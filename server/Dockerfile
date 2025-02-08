FROM node:20-bullseye

WORKDIR /app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y \
    python3 \
    make \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy all files
COPY . .

# Create directories and set permissions
RUN mkdir -p /app/data /app/logs && \
    chown -R node:node /app

# Switch to node user
USER node

# Expose ports
EXPOSE 3002

CMD ["node", "server.js"]
