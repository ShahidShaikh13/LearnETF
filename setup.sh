#!/bin/bash

echo "🚀 Setting up LearnETF - AI-Powered ETF & Stock Education Platform"
echo "================================================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Backend setup
echo ""
echo "🔧 Setting up Backend..."
cd server

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit server/.env and add your OpenAI API key"
fi

echo "✅ Backend setup complete!"

# Frontend setup
echo ""
echo "🎨 Setting up Frontend..."
cd ../client

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete!"

# Final instructions
echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit server/.env and add your OpenAI API key"
echo "2. Start the backend: cd server && source venv/bin/activate && python app.py"
echo "3. Start the frontend: cd client && npm start"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "🔗 Backend API: http://localhost:5000"
echo "🔗 Frontend: http://localhost:3000"
echo ""
echo "Happy coding! 🚀" 