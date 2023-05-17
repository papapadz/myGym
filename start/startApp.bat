@echo off

rem Run 'npm run serve' command in the background
start "" /b npm run serve

rem Wait for a few seconds to ensure the server is started
timeout /t 5 >nul

rem Open the browser to a specific IP address
set "browser=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
set "ipAddress=http://localhost:8080"  REM Replace with your desired IP address

start "" /b "%browser%" "%ipAddress%"

exit