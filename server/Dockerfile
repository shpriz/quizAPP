FROM node:18

WORKDIR /usr/src/app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y \
    python3 \
    make \
    g++ \
    sqlite3 \
    build-essential

# Set environment variables for better-sqlite3 build
ENV CFLAGS="-std=c++17"
ENV CXXFLAGS="-std=c++17"

# Install nodemon globally
RUN npm install -g nodemon

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Expose port
EXPOSE 3002

# Start app
CMD ["npm", "run", "dev"]
