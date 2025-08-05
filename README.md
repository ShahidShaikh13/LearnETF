# LearnETF - AI-Powered ETF & Stock Education Platform

A comprehensive full-stack application for learning about ETFs and stocks with AI-powered insights, interactive charts, and personalized educational content.


<img width="1512" height="861" alt="Screenshot 2025-08-05 at 2 53 47 PM" src="https://github.com/user-attachments/assets/728eb472-21d7-477f-b737-31e6387ea392" />


<img width="1512" height="858" alt="Screenshot 2025-08-05 at 2 54 09 PM" src="https://github.com/user-attachments/assets/92ef0ceb-83ab-4ebb-8922-ac1c8c7da28b" />



<img width="1512" height="861" alt="Screenshot 2025-08-05 at 2 54 32 PM" src="https://github.com/user-attachments/assets/0f2acd31-17b9-4ba4-9dab-079c8c835007" />




## 🚀 Key Features

- **Stock & ETF Analysis**: Real-time data with candlestick charts and key metrics
- **AI-Powered Insights**: GPT-4 integration for personalized explanations
- **Interactive Learning**: Educational modules with experience-level tailored content
- **Practice Quizzes**: Test your knowledge with interactive exercises
- **Modern UI**: Responsive design with dark mode support
- **Real-time Charts**: Plotly-powered candlestick charts with metrics

## 🛠️ Tech Stack

### Backend
- **Flask** - Python web framework
- **yfinance** - Stock market data
- **OpenAI GPT-4** - AI-powered features
- **Plotly** - Chart generation
- **SQLite** - Database (can be upgraded to PostgreSQL)

### Frontend
- **React 18** - Modern UI framework
- **TailwindCSS** - Utility-first CSS
- **Axios** - HTTP client
- **React Router** - Navigation
- **Plotly.js** - Interactive charts
- **Lucide React** - Icons

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API key

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd learnetf
```

### 2. Backend Setup
```bash
cd server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env and add your OpenAI API key

# Run the server
python app.py
```

### 3. Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## 📁 Project Structure

```
learnetf/
├── server/                 # Flask backend
│   ├── app.py             # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   └── env.example       # Environment variables template
├── client/                # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── App.js        # Main app component
│   │   └── index.css     # Global styles
│   ├── package.json      # Node dependencies
│   └── tailwind.config.js # TailwindCSS config
└── README.md             # This file
```

## 🔧 API Endpoints

### Stock Analysis
- `GET /api/stock?ticker=AAPL` - Get stock data and metrics
- `GET /api/stock?ticker=SPY&start=2023-01-01&end=2024-01-01` - Historical data

### AI Features
- `POST /api/gpt/classify` - Classify user experience level
- `POST /api/gpt/explain` - Explain financial concepts
- `POST /api/gpt/ticker` - Extract ticker symbols from text
- `POST /api/gpt/chat` - AI chat for investment advice

### Quiz System
- `GET /api/quiz/questions` - Get practice quiz questions

### Health Check
- `GET /api/health` - Server health status

## 🎯 Features in Detail

### 1. **Stock Dashboard**
- Search any stock or ETF ticker
- Real-time price data and charts
- Key financial metrics calculation
- Company information display

### 2. **AI Experience Classification**
- Natural language input about investment experience
- Automatic classification into Beginner/Intermediate/Advanced
- Personalized content based on experience level

### 3. **Interactive Charts**
- Candlestick charts with Plotly
- Responsive design for all devices
- Dark mode support for charts

### 4. **Educational Modules**
- Comprehensive financial literacy content
- AI-powered explanations for each module
- Experience-level tailored explanations
- Interactive learning experience

### 5. **AI Chat Assistant**
- Real-time conversation with GPT-4
- Context-aware responses
- Quick question suggestions
- Investment advice and explanations

### 6. **Practice Quizzes**
- Interactive quiz system
- Multiple choice questions
- Immediate feedback and explanations
- Score tracking and performance analysis

## 🚀 Deployment

### Backend (Render)
1. Connect your repository to Render
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `gunicorn app:app`
4. Add environment variables:
   - `OPENAI_API_KEY`
   - `FLASK_ENV=production`

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Deploy automatically on push to main branch

## 🔒 Environment Variables

Create a `.env` file in the server directory:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True

# Server Configuration
PORT=5001
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4 API
- **Yahoo Finance** for market data
- **Plotly** for interactive charts
- **TailwindCSS** for the beautiful UI framework

## 📞 Support

If you have any questions or need support, please open an issue on the repository.

---

<div align="center">
  <p>Made with ❤️ for the investment community</p>
  <p>Empowering the next generation of investors</p>
</div>
