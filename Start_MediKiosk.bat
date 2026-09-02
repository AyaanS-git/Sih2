@echo off
title MediKiosk Hospital Terminal
echo ====================================================
echo Starting MediKiosk Platform...
echo ====================================================
echo Opening http://localhost:8000 in your browser...
start http://localhost:8000
python server.py
pause
