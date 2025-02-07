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

# Install dependencies
COPY package*.json ./
RUN npm install -g nodemon
RUN npm install
RUN npm install exceljs

# Copy app source
COPY . .

# Expose port
EXPOSE 3002

# Start the app
CMD ["nodemon", "server.js"]
