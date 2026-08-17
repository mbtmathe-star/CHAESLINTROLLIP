@echo off
cd /d "%~dp0"
echo.
echo Trollip Legacy Builders preview server
 echo Open: http://localhost:5500/
echo Press Ctrl+C to stop.
python -m http.server 5500
