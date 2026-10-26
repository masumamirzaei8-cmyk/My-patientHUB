@echo off
echo ============================================
echo   MyPatientHUB - Healthcare Dashboard
echo ============================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Check Node.js version
echo [INFO] Node.js version:
node --version
echo.

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    echo Please install Node.js (includes npm) from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] Installing dependencies...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERROR] Failed to install dependencies!
        echo Please check your internet connection and try again.
        pause
        exit /b 1
    )
    echo.
    echo [SUCCESS] Dependencies installed successfully!
    echo.
)

echo [INFO] Starting MyPatientHUB development server...
echo [INFO] The application will open at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server.
echo ============================================
echo.

:: Start the dev server
call npm run dev

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to start the development server!
    echo Please try running 'npm install' first.
    pause
    exit /b 1
)

pause
