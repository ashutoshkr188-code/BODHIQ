@echo off
echo Starting backend with virtual environment...
cd /d "%~dp0"
call venv\Scripts\activate.bat
uvicorn app.main:app --reload
