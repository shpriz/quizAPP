FROM node:22-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

EXPOSE 5173

# Run in development mode with host flag
CMD ["npm", "run", "dev", "--", "--host", "--port", "5173"]