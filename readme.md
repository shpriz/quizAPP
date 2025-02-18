# Stomatology Quiz Application

Интерактивное приложение для тестирования студентов-стоматологов.

## Режимы работы

### Development Mode

1. Запуск frontend:
```bash
cd quizz-stomat-app
npm install
npm run dev
```
Фронтенд будет доступен по адресу: http://localhost:5173

2. Запуск backend:
```bash
cd quizz-stomat-app/server
npm install
npm run dev
```
Бэкенд будет доступен по адресу: http://localhost:3002

### Production Mode

В production режиме:
- Frontend использует window.location.origin для определения адреса API
- Backend настроен на работу с CORS для доменов:
  - http://stomtest.nsmu.ru
  - https://stomtest.nsmu.ru

Запуск в production:
```bash
# Frontend
npm run build
npm run preview

# Backend
NODE_ENV=production npm start
```

## Режимы запуска

### Development Mode (Локальная разработка)

1. Запуск Backend:
```bash
cd server
set NODE_ENV=development
npm install
npm run dev
```
Сервер будет доступен на http://localhost:3002

2. Запуск Frontend:
```bash
cd quizz-stomat-app
npm install
npm run dev
```
Фронтенд будет доступен на http://localhost:5173

### Production Mode (Рабочий режим)

1. Запуск Backend:
```bash
cd server
set NODE_ENV=production
npm install
npm start
```
Сервер будет доступен на http://stomtest.nsmu.ru:3002

2. Сборка и запуск Frontend:
```bash
cd quizz-stomat-app
npm install
npm run build
npm run start
```
Фронтенд будет доступен на http://stomtest.nsmu.ru

## Быстрый запуск на Windows

### Использование скриптов

1. Development Mode:
   ```bash
   cd quizz-stomat-app
   .\start-dev.bat
   ```
   Или просто дважды кликните на `start-dev.bat` в папке `quizz-stomat-app`

2. Production Mode:
   ```bash
   cd quizz-stomat-app
   .\start-prod.bat
   ```
   Или просто дважды кликните на `start-prod.bat` в папке `quizz-stomat-app`

### Что делают скрипты
- Проверяют, что вы находитесь в правильной директории
- Устанавливают зависимости, если они еще не установлены
- Запускают backend сервер
- Запускают frontend сервер
- В production режиме дополнительно собирают frontend

### Остановка серверов
- Закройте оба окна командной строки
- Или нажмите Ctrl+C в каждом окне и подтвердите остановку, введя 'Y'

### Примечание
- Скрипты автоматически запустят оба сервера в отдельных окнах
- Backend запускается первым, затем после небольшой паузы запускается Frontend
- Проверьте оба окна на наличие ошибок при запуске






## Automatic Git Pull Setup

To set up automatic Git pulls on your Linux server:

1. Make the script executable:
```bash
chmod +x auto-pull.sh
```

2. Edit the script and set your repository path:
```bash
# Open the script
nano auto-pull.sh

# Change this line to your repository path
REPO_DIR="https://github.com/shpriz/quizAPP.git"
```

3. Set up a cron job to run the script periodically:
```bash
# Open crontab
crontab -e

# Add this line to run every 5 minutes
*/5 * * * * /path/to/auto-pull.sh
```

4. Check the logs:
```bash
# View the log file
tail -f /var/log/auto-pull.log
```

The script will:
- Check for new changes in the repository
- Pull updates if available
- Restart Docker containers if needed
- Log all actions to `/var/log/auto-pull.log`

### Troubleshooting

If you encounter permission issues:
1. Make sure the script has execute permissions
2. Verify the log file permissions:
```bash
sudo touch /var/log/auto-pull.log
sudo chmod 666 /var/log/auto-pull.log
```

3. If using SSH for Git, ensure your SSH keys are properly set up:
```bash
# Generate SSH key if needed
ssh-keygen -t ed25519 -C "shpriz1982@gmail.com"

# Add key to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Display public key to add to GitHub
cat ~/.ssh/id_ed25519.pub
```

## Конфигурация портов

- Frontend (Vite): порт 5173
- Backend (Express): порт 3002

## Конфигурация

### Development Mode
- Frontend: порт 5173
- Backend: порт 3002
- API URL: http://localhost:3002
- CORS: разрешены localhost:5173 и localhost:3000

### Production Mode
- Frontend: порт 80
- Backend: порт 3002
- API URL: http://stomtest.nsmu.ru:3002
- CORS: разрешены домены stomtest.nsmu.ru

## API Endpoints

Все API endpoints доступны через базовый URL:
- Development: http://localhost:3002
- Production: http://stomtest.nsmu.ru:3002

### Доступные endpoints:
- GET /api/questions - получение вопросов
- GET /api/results - получение результатов (требует авторизации)
  - Поддерживает query параметры:
    - format: csv или excel для экспорта
    - from: дата начала периода
    - to: дата конца периода
    - name: фильтр по имени
- POST /api/admin/login - авторизация администратора
- POST /api/admin/reinit-db - реинициализация базы данных

## Безопасность

- Все административные endpoints защищены JWT-авторизацией
- CORS настроен только для разрешенных доменов
- В development режиме разрешены только локальные соединения

## Установка и запуск

### Установка зависимостей
```bash
# Фронтенд
npm install

# Бэкенд
cd server
npm install
cd ..
```

### Запуск в режиме разработки
```bash
# Запуск бэкенда
docker compose -f docker-compose.dev.yml up -d

# Запуск фронтенда
npm run dev
```

### Запуск в production режиме
```bash
docker compose up -d --build
```

### Остановка
```bash
# Режим разработки
docker compose -f docker-compose.dev.yml down

# Production режим
docker compose down
```

### Очистка и пересборка
```bash
docker compose down
docker system prune -a --volumes
docker compose build --no-cache
docker compose up -d
```

## Переключение между режимами

### Development -> Production
```bash
# Сохраните изменения
git add .
git commit -m "Switch to production mode"
git push origin main

# На сервере:
cd quizAPP
git pull
docker compose down
docker system prune -a --volumes  # Очистка кэша
docker compose build --no-cache
docker compose up -d
```

### Production -> Development
```bash
# Сохраните изменения
git add .
git commit -m "Switch to development mode"
git push origin main

# На сервере:
cd quizAPP
git pull
docker compose down
docker system prune -a --volumes  # Очистка кэша
docker compose build --no-cache
docker compose up -d
```

## Доступ к приложению

### Development Mode
- Frontend: http://stomtest.nsmu.ru:5173
- Backend API: http://stomtest.nsmu.ru:3002

### Production Mode
- Frontend: http://stomtest.nsmu.ru
- Backend API: проксируется через nginx по пути /api/

## Особенности режимов

### Development Mode
- Hot-reload для frontend и backend
- Открытые порты для прямого доступа
- Отладочная информация
- Монтирование volumes для live-updates

### Production Mode
- Оптимизированная production сборка
- Nginx для раздачи статики
- Проксирование API через nginx
- Закрытый backend
- Сжатие и кэширование

npm i react-bootstrap react react-bootstrap react-dom react-router react-router-dom @types/node "@types/react @types/react-dom @typescript-eslint/eslint-plugin @vitejs/plugin-react eslint eslint-plugin-react-hooks eslint-plugin-react-refresh typescript

tasklist | findstr node.exe

# Quizz Stomat App Configuration Guide

This guide provides configuration settings for running the application in different environments.

## Configuration Files That Need Updates

1. `.env` (Frontend environment variables)
2. `docker-compose.yml` (Docker services configuration)
3. `nginx.conf` (Nginx server configuration)
4. `vite.config.ts` (Vite development server configuration)

## Environment Configurations

### 1. Local Development (localhost)

**.env:**
```env
VITE_API_URL=http://localhost:3002
VITE_APP_URL=http://localhost:3000
```

**docker-compose.yml:**
```yaml
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:3002
    networks:
      - app-network

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "3002:3002"
    environment:
      - CORS_ORIGIN=http://localhost:3000
    networks:
      - app-network
```

**nginx.conf:**
```nginx
server {
    listen 3000;
    server_name localhost;
    
    location / {
        add_header 'Access-Control-Allow-Origin' 'http://localhost:3000' always;
        # ... other CORS headers
    }

    location /api/ {
        proxy_pass http://backend:3002;
        add_header 'Access-Control-Allow-Origin' 'http://localhost:3000' always;
        # ... other CORS headers
    }
}
```

### 2. IP-Based Access (194.87.69.156)

**.env:**
```env
VITE_API_URL=http://194.87.69.156:3002
VITE_APP_URL=http://194.87.69.156:3000
```

**docker-compose.yml:**
```yaml
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://194.87.69.156:3002
    networks:
      - app-network

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "3002:3002"
    environment:
      - CORS_ORIGIN=http://194.87.69.156:3000
    networks:
      - app-network
```

**nginx.conf:**
```nginx
server {
    listen 3000;
    server_name 194.87.69.156;
    
    location / {
        add_header 'Access-Control-Allow-Origin' 'http://194.87.69.156:3000' always;
        # ... other CORS headers
    }

    location /api/ {
        proxy_pass http://backend:3002;
        add_header 'Access-Control-Allow-Origin' 'http://194.87.69.156:3000' always;
        # ... other CORS headers
    }
}
```

### 3. Domain-Based Access (stomtest.nsmu.ru)

**.env:**
```env
VITE_API_URL=http://stomtest.nsmu.ru:3002
VITE_APP_URL=http://stomtest.nsmu.ru:5173
```

**docker-compose.yml:**
```yaml
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://stomtest.nsmu.ru:3002
    networks:
      - app-network

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "3002:3002"
    environment:
      - CORS_ORIGIN=http://stomtest.nsmu.ru:5173
    networks:
      - app-network
```

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "3000:3000"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      app-network:
        ipv4_address: 172.16.0.2
    hostname: stomtest.nsmu.ru
    environment:
      - VITE_API_URL=${VITE_API_URL:-http://stomtest.nsmu.ru:3002/api}
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://stomtest.nsmu.ru:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "3002:3002"
    volumes:
      - quiz_data:/app/data
      - quiz_logs:/app/logs
    environment:
      - NODE_ENV=production
      - PORT=3002
      - JWT_SECRET=${JWT_SECRET:-your-secret-key}
    networks:
      app-network:
        ipv4_address: 172.16.0.3
    hostname: stomtest.nsmu.ru
    healthcheck:
      test: ["CMD", "curl", "-f", "http://stomtest.nsmu.ru:3002/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  app-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.16.0.0/16
          gateway: 172.16.0.1

volumes:
  quiz_data:
  quiz_logs:
```





**nginx.conf:**
```nginx
server {
    listen 5173;
    server_name stomtest.nsmu.ru;
    
    location / {
        add_header 'Access-Control-Allow-Origin' 'http://stomtest.nsmu.ru:5173' always;
        # ... other CORS headers
    }

    location /api/ {
        proxy_pass http://backend:3002;
        add_header 'Access-Control-Allow-Origin' 'http://stomtest.nsmu.ru:5173' always;
        # ... other CORS headers
    }
}
```

## Additional Configuration Notes

1. **vite.config.ts:**
```typescript
export default defineConfig({
  server: {
    port: process.env.VITE_APP_PORT || 3000,
    host: true,
    cors: {
      origin: process.env.VITE_APP_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }
  }
  // ... other config
})
```

2. **CORS Headers (for all environments):**
```nginx
add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
```

## Switching Between Environments

1. Choose the appropriate configuration block
2. Update all necessary files with the corresponding settings
3. Rebuild and restart the containers:
```bash
docker-compose down
docker-compose up -d --build
```

## Important Notes

- Always ensure your firewall allows traffic on the specified ports
- Update DNS records when using domain-based access
- SSL certificates should be configured for production use
- Keep sensitive information in `.env` files and never commit them to version control