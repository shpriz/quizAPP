@echo off
echo Starting Production Servers...

:: Check if we're in the right directory
if not exist "package.json" (
    echo Error: Please run this script from the quizz-stomat-app directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

:: Check if node_modules exists, if not run npm install
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

if not exist "server\node_modules" (
    echo Installing backend dependencies...
    cd server
    call npm install
    cd ..
)

:: Build frontend for production
echo Building frontend for production...
call npm run build

:: Start Backend Server
echo Starting backend server...
start cmd /k "cd server && set NODE_ENV=production && npm start"

:: Wait 2 seconds for backend to start
timeout /t 2 /nobreak > nul

:: Start Frontend Server
echo Starting frontend server...
start cmd /k "set NODE_ENV=production && npm run start"

echo.
echo Production servers are starting...
echo Backend will be available at http://localhost:3002
echo Frontend will be available at http://localhost:80
echo.
echo To stop the servers, close both command windows or press Ctrl+C in each window.
pause
