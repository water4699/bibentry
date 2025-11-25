@echo off
echo ============================================
echo Deploying AthleteRegistration Contract
echo ============================================

cd /d %~dp0

echo.
echo Starting deployment...
echo.

node scripts/deploy.js

echo.
echo ============================================
echo Deployment completed!
echo ============================================
pause
