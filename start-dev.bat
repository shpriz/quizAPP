@echo off
echo Starting Development Servers...

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

:: Start Backend Server
echo Starting backend server...
start cmd /k "cd server && set PORT=3002 && set NODE_ENV=development && npm run dev"

:: Wait 2 seconds for backend to start
timeout /t 2 /nobreak > nul

:: Start Frontend Server
echo Starting frontend server...
start cmd /k "set NODE_ENV=development && npm run dev -- --port 5173"

echo.
echo Development servers are starting...
echo Backend will be available at http://localhost:3002
echo Frontend will be available at http://localhost:5173
echo.
echo To stop the servers, close both command windows or press Ctrl+C in each window.
pause
