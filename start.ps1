Write-Host "Starting the server..."
Start-Process -NoNewWindow powershell -ArgumentList "cd server; npm start"

Write-Host "Starting the React app..."
Start-Process -NoNewWindow powershell -ArgumentList "npm start"

Write-Host "Both server and client are running!"
Write-Host "Server: http://localhost:3001"
Write-Host "Client: http://localhost:3000"
Write-Host "Press Ctrl+C to stop both processes"

while ($true) {
    Start-Sleep -Seconds 1
}
