# Use the same base image for both stages to ensure binary compatibility
FROM node:22-alpine

# Install build dependencies
RUN apk add --no-cache python3 make g++ gcc git

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies and rebuild better-sqlite3
RUN npm ci --only=production && \
    npm rebuild better-sqlite3 --build-from-source

# Copy application files
COPY . .

# Create app directory and set permissions
RUN mkdir -p /app/data /app/logs && chown -R node:node /app

# Switch to non-root user
USER node

# Create volumes for persistent data and logs
VOLUME ["/app/data", "/app/logs"]

# Expose port 3002
EXPOSE 3002

# Set production environment
ENV NODE_ENV=production \
    PORT=3002

CMD ["node", "server.js"]
