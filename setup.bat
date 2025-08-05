@echo off
echo 🚀 Setting up LearnETF - AI-Powered ETF ^& Stock Education Platform
echo ================================================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

REM Backend setup
echo.
echo 🔧 Setting up Backend...
cd server

REM Create virtual environment
echo Creating Python virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy env.example .env
    echo ⚠️  Please edit server\.env and add your OpenAI API key
)

echo ✅ Backend setup complete!

REM Frontend setup
echo.
echo 🎨 Setting up Frontend...
cd ..\client

REM Install Node.js dependencies
echo Installing Node.js dependencies...
npm install

echo ✅ Frontend setup complete!

REM Final instructions
echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Edit server\.env and add your OpenAI API key
echo 2. Start the backend: cd server ^& venv\Scripts\activate ^& python app.py
echo 3. Start the frontend: cd client ^& npm start
echo 4. Open http://localhost:3000 in your browser
echo.
echo 🔗 Backend API: http://localhost:5000
echo 🔗 Frontend: http://localhost:3000
echo.
echo Happy coding! 🚀
pause 