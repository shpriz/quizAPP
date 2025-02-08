# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Production stage
FROM node:18-alpine

WORKDIR /app

# Create app directory and set permissions
RUN mkdir -p /app/data && chown -R node:node /app

# Switch to non-root user
USER node

# Copy from builder stage
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/server.js ./

# Create volume for persistent data
VOLUME ["/app/data"]

# Expose port 3002
EXPOSE 3002

# Set production environment
ENV NODE_ENV=production \
    PORT=3002

CMD ["node", "server.js"]
