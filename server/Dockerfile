FROM node:22

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
ENV CFLAGS="-std=c++20"
ENV CXXFLAGS="-std=c++20"

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

EXPOSE 3002

CMD ["npm", "start"]
