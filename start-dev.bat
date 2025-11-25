@echo off
echo ============================================
echo Biblock Entry - Development Environment Setup
echo ============================================

cd /d %~dp0

echo.
echo Starting development environment...
echo.

echo [1/3] Starting Hardhat node with FHEVM support...
start "Hardhat Node" cmd /k "npx hardhat node --fhevm"

echo [2/3] Waiting for Hardhat node to initialize...
timeout /t 5 /nobreak > nul

echo [3/3] Starting frontend development server...
cd frontend
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo ============================================
echo Development environment started!
echo.
echo - Hardhat Node (FHEVM): http://127.0.0.1:8545
echo - Frontend: http://localhost:3000 (or check console for actual port)
echo.
echo Press any key to exit this window...
echo Note: Other windows will continue running.
echo ============================================
pause > nul
