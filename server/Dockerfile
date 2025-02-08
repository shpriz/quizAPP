FROM node:20-bullseye

WORKDIR /app

# Устанавливаем зависимости для сборки
RUN apt-get update && apt-get install -y python3 python3-pip make g++ && rm -rf /var/lib/apt/lists/*

# Копируем package файлы
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --omit=dev --cache /tmp/npm-cache && rm -rf /tmp/npm-cache

# Копируем все файлы
COPY . .

# Создаем директории и задаем права
RUN mkdir -p /app/data /app/logs && chown -R node:node /app

# Переключаемся на пользователя node
USER node

# Открываем порты
EXPOSE 3002

CMD ["node", "server.js"]
