FROM node:23

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

EXPOSE 5173

# Use vite with host flag
CMD ["npm", "run", "dev", "--", "--host"]
