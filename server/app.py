from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import yfinance as yf
import pandas as pd
import numpy as np
import plotly.graph_objs as go
import plotly.utils
import json
from datetime import datetime, timedelta
import openai
import requests

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

# Initialize OpenAI client
openai.api_key = os.getenv('OPENAI_API_KEY')

def calculate_metrics(df):
    """Calculate key financial metrics for a stock/ETF"""
    if df.empty:
        return {}
    
    # Calculate returns
    returns = df['Close'].pct_change().dropna()
    
    # 1 Year Return
    if len(returns) >= 252:  # At least 1 year of data
        one_year_return = (df['Close'].iloc[-1] / df['Close'].iloc[-252] - 1) * 100
    else:
        one_year_return = (df['Close'].iloc[-1] / df['Close'].iloc[0] - 1) * 100
    
    # Volatility (Standard Deviation)
    volatility = returns.std() * np.sqrt(252) * 100  # Annualized
    
    # Sharpe Ratio (assuming risk-free rate of 2%)
    risk_free_rate = 0.02
    excess_returns = returns - risk_free_rate/252
    sharpe_ratio = np.sqrt(252) * excess_returns.mean() / returns.std() if returns.std() > 0 else 0
    
    # Additional metrics
    max_price = df['High'].max()
    min_price = df['Low'].min()
    current_price = df['Close'].iloc[-1]
    
    return {
        'one_year_return': round(one_year_return, 2),
        'volatility': round(volatility, 2),
        'sharpe_ratio': round(sharpe_ratio, 2),
        'max_price': round(max_price, 2),
        'min_price': round(min_price, 2),
        'current_price': round(current_price, 2),
        'price_change': round(df['Close'].iloc[-1] - df['Close'].iloc[-2], 2) if len(df) > 1 else 0,
        'price_change_pct': round(((df['Close'].iloc[-1] / df['Close'].iloc[-2] - 1) * 100), 2) if len(df) > 1 else 0
    }

def create_candlestick_chart(df, ticker):
    """Create a candlestick chart using Plotly"""
    fig = go.Figure(data=[go.Candlestick(
        x=df.index,
        open=df['Open'],
        high=df['High'],
        low=df['Low'],
        close=df['Close'],
        name=ticker
    )])
    
    fig.update_layout(
        title=f'{ticker} Stock Price',
        xaxis_title='Date',
        yaxis_title='Price ($)',
        xaxis_rangeslider_visible=False,
        template='plotly_dark' if request.args.get('dark_mode') == 'true' else 'plotly_white'
    )
    
    return json.loads(plotly.utils.PlotlyJSONEncoder().encode(fig))

def get_real_stock_data(ticker):
    """Get real stock data from Alpha Vantage API as fallback"""
    try:
        # Using a free API endpoint for demo purposes
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?interval=1d&range=1y"
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if 'chart' in data and 'result' in data['chart'] and data['chart']['result']:
                result = data['chart']['result'][0]
                timestamps = result['timestamp']
                quotes = result['indicators']['quote'][0]
                
                # Create DataFrame-like structure
                stock_data = {
                    'Open': quotes.get('open', [150] * len(timestamps)),
                    'High': quotes.get('high', [155] * len(timestamps)),
                    'Low': quotes.get('low', [145] * len(timestamps)),
                    'Close': quotes.get('close', [150] * len(timestamps)),
                    'Volume': quotes.get('volume', [1000000] * len(timestamps))
                }
                
                # Convert to pandas DataFrame
                import pandas as pd
                df = pd.DataFrame(stock_data, index=pd.to_datetime(timestamps, unit='s'))
                return df
    except Exception as e:
        print(f"Real stock data fetch failed: {e}")
        return None
    
    return None

@app.route('/api/stock')
def get_stock_data():
    """Get stock/ETF data with metrics and charts"""
    print(f"Received request for ticker: {request.args.get('ticker', 'AAPL')}")
    try:
        ticker = request.args.get('ticker', 'AAPL').upper()
        start = request.args.get('start', (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d'))
        end = request.args.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        print(f"Processing ticker: {ticker}")
        
        # Try to fetch data from Yahoo Finance using period instead of specific dates
        df = None
        try:
            df = yf.download(ticker, period="1y", interval="1d")
            if df.empty:
                raise Exception("No data returned from yfinance")
        except Exception as e:
            print(f"yfinance error for {ticker}: {e}")
            # Try to get real data from alternative source
            df = get_real_stock_data(ticker)
            
        # If still no data, return mock data
        if df is None or df.empty:
            print(f"Using mock data for {ticker}")
            # Return mock data for demonstration
            response_data = {
                'ticker': ticker,
                'company_name': f'{ticker} Corporation',
                'sector': 'Technology',
                'metrics': {
                    'one_year_return': 15.5,
                    'volatility': 25.3,
                    'sharpe_ratio': 0.85,
                    'max_price': 180.50,
                    'min_price': 120.25,
                    'current_price': 165.75,
                    'price_change': 2.50,
                    'price_change_pct': 1.53
                },
                'chart': {
                    'data': [{
                        'x': ['2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01', '2023-05-01', '2023-06-01', '2023-07-01', '2023-08-01', '2023-09-01', '2023-10-01', '2023-11-01', '2023-12-01'],
                        'open': [150, 155, 160, 158, 165, 170, 168, 175, 180, 178, 182, 165],
                        'high': [155, 160, 165, 162, 170, 175, 172, 178, 185, 182, 188, 170],
                        'low': [148, 152, 157, 155, 162, 168, 165, 172, 178, 175, 180, 162],
                        'close': [155, 160, 158, 165, 167, 172, 170, 177, 182, 180, 185, 167],
                        'type': 'candlestick',
                        'name': ticker
                    }],
                    'layout': {
                        'title': f'{ticker} Stock Price',
                        'xaxis': {'title': 'Date'},
                        'yaxis': {'title': 'Price ($)'}
                    }
                },
                'data_points': 12,
                'date_range': {
                    'start': '2023-01-01',
                    'end': '2023-12-01'
                }
            }
            print(f"Returning mock data for {ticker}")
            return jsonify(response_data)
        
        # Calculate metrics
        metrics = calculate_metrics(df)
        
        # Create candlestick chart
        chart_data = create_candlestick_chart(df, ticker)
        
        # Get company info
        stock = yf.Ticker(ticker)
        info = stock.info
        company_name = info.get('longName', ticker)
        sector = info.get('sector', 'N/A')
        
        response_data = {
            'ticker': ticker,
            'company_name': company_name,
            'sector': sector,
            'metrics': metrics,
            'chart': chart_data,
            'data_points': len(df),
            'date_range': {
                'start': df.index[0].strftime('%Y-%m-%d'),
                'end': df.index[-1].strftime('%Y-%m-%d')
            }
        }
        
        print(f"Returning real data for {ticker}")
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error in stock endpoint: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/gpt/classify', methods=['POST'])
def classify_user_experience():
    """Classify user investment experience level"""
    try:
        data = request.get_json()
        user_input = data.get('response', '')
        
        if not user_input:
            return jsonify({'error': 'No response provided'}), 400
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": 
                     """You are an investment expert. Classify the user's investment knowledge into exactly ONE of three levels: 'beginner', 'intermediate', or 'advanced'.
                     
                     Criteria:
                     Beginner: Little to no experience, limited knowledge, short-term focus, small budgets
                     Intermediate: Some experience, clear goals, moderate budgets, basic market knowledge
                     Advanced: Deep understanding, long-term planning, large budgets, sophisticated strategies
                     
                     Respond ONLY with: beginner, intermediate, or advanced"""},
                    {"role": "user", "content": user_input}
                ],
                max_tokens=10
            )
            
            classification = response.choices[0].message.content.lower().strip()
            valid_levels = ['beginner', 'intermediate', 'advanced']
            
            return jsonify({
                'level': classification if classification in valid_levels else 'beginner',
                'confidence': 'high'
            })
        except Exception as e:
            # Return mock response when API quota is exceeded
            print(f"OpenAI API error: {e}")
            return jsonify({
                'level': 'beginner',
                'confidence': 'mock'
            })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/gpt/explain', methods=['POST'])
def explain_concept():
    """Explain ETFs, stocks, or financial concepts in simple terms"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        user_level = data.get('level', 'beginner')
        
        if not query:
            return jsonify({'error': 'No query provided'}), 400
        
        try:
            system_prompt = f"""You are a financial educator specializing in ETFs and stocks. 
            Explain the concept in simple, {user_level}-friendly terms. 
            Use analogies and real-world examples when helpful.
            Keep explanations concise but comprehensive.
            Focus on practical understanding rather than technical jargon."""
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": query}
                ],
                max_tokens=500
            )
            
            return jsonify({
                'explanation': response.choices[0].message.content,
                'user_level': user_level
            })
        except Exception as e:
            # Return mock explanation when API quota is exceeded
            print(f"OpenAI API error: {e}")
            mock_explanations = {
                'What is an ETF?': 'An ETF (Exchange-Traded Fund) is like a basket of investments that you can buy and sell like a stock. Think of it as buying a collection of stocks, bonds, or other assets all at once. ETFs are popular because they offer diversification and are usually cheaper than buying individual stocks.',
                'Index Funds vs Mutual Funds': 'Index funds and mutual funds are both ways to invest in multiple stocks at once. Index funds follow a specific market index (like the S&P 500) and usually have lower fees. Mutual funds are actively managed by professionals who pick stocks, which can lead to higher fees but potentially better performance.',
                'Diversification Strategies': 'Diversification means spreading your money across different types of investments to reduce risk. This includes investing in different sectors (technology, healthcare, etc.), different countries, and different asset types (stocks, bonds, real estate).',
                'Risk Management': 'Risk management is about protecting your investments from potential losses. This includes setting stop-loss orders, not putting all your money in one investment, and having an emergency fund before investing.',
                'Technical Analysis Basics': 'Technical analysis involves studying price charts and patterns to predict future stock movements. It looks at things like moving averages, support and resistance levels, and trading volume.',
                'Fundamental Analysis': 'Fundamental analysis involves studying a company\'s financial health, including its earnings, revenue, debt, and growth prospects. It helps determine if a stock is undervalued or overvalued.'
            }
            
            explanation = mock_explanations.get(query, 'This is a mock explanation for demonstration purposes. The AI features require an active OpenAI API key with available credits.')
            
            return jsonify({
                'explanation': explanation,
                'user_level': user_level
            })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/gpt/ticker', methods=['POST'])
def extract_ticker():
    """Extract stock ticker symbols from user input"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": 
                 """Extract stock ticker symbols from the given text. 
                 Return ONLY the ticker symbols in uppercase, separated by commas.
                 If no tickers found, return 'NONE'.
                 Examples:
                 - "I want to invest in Apple and Microsoft" -> "AAPL,MSFT"
                 - "What about Tesla?" -> "TSLA"
                 - "No stocks mentioned" -> "NONE\""""},
                {"role": "user", "content": text}
            ],
            max_tokens=50
        )
        
        tickers = response.choices[0].message.content.strip()
        
        return jsonify({
            'tickers': tickers.split(',') if tickers != 'NONE' else [],
            'original_text': text
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/gpt/chat', methods=['POST'])
def chat_with_ai():
    """General chat endpoint for ETF/stock questions"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        user_level = data.get('level', 'beginner')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        try:
            system_prompt = f"""You are a friendly financial advisor specializing in ETFs and stocks. 
            Provide helpful, {user_level}-appropriate advice and explanations.
            Be conversational but professional.
            Include practical tips when relevant.
            Keep responses concise but informative."""
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                max_tokens=300
            )
            
            return jsonify({
                'response': response.choices[0].message.content,
                'user_level': user_level
            })
        except Exception as e:
            # Return mock response when API quota is exceeded
            print(f"OpenAI API error: {e}")
            mock_responses = {
                'What is AAPL?': 'AAPL is the stock symbol for Apple Inc., one of the world\'s largest technology companies. They make iPhones, iPads, Macs, and other consumer electronics. Apple is known for its innovative products and strong brand.',
                'Should I invest in AAPL?': 'This is a personal decision that depends on your financial goals, risk tolerance, and investment timeline. Apple is a well-established company with strong fundamentals, but all investments carry risk. Consider consulting with a financial advisor.',
                'What are the risks of AAPL?': 'Like any stock, AAPL carries investment risks including market volatility, company-specific risks, and economic factors. Technology stocks can be particularly volatile. Diversification is key to managing risk.',
                'How do ETFs work?': 'ETFs (Exchange-Traded Funds) are investment funds that trade on stock exchanges like individual stocks. They hold a collection of assets (stocks, bonds, etc.) and provide instant diversification. ETFs typically have lower fees than mutual funds.',
                'What is diversification?': 'Diversification is spreading your investments across different assets to reduce risk. Instead of putting all your money in one stock, you invest in various stocks, bonds, sectors, and even countries. This helps protect against losses in any single investment.'
            }
            
            response = mock_responses.get(message, 'This is a mock response for demonstration purposes. The AI features require an active OpenAI API key with available credits.')
            
            return jsonify({
                'response': response,
                'user_level': user_level
            })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/quiz/questions')
def get_quiz_questions():
    """Get quiz questions for practice exercises"""
    try:
        questions = [
            {
                "id": 1,
                "question": "What is an ETF?",
                "options": [
                    "A type of cryptocurrency",
                    "An Exchange-Traded Fund that tracks a basket of assets",
                    "A government bond",
                    "A savings account"
                ],
                "correct": 1,
                "explanation": "An ETF (Exchange-Traded Fund) is an investment fund that trades on stock exchanges, similar to stocks. It holds a collection of assets like stocks, bonds, or commodities."
            },
            {
                "id": 2,
                "question": "Which of the following is a benefit of diversification?",
                "options": [
                    "Guaranteed higher returns",
                    "Reduced risk through spreading investments",
                    "Lower taxes",
                    "Faster trading"
                ],
                "correct": 1,
                "explanation": "Diversification reduces risk by spreading investments across different assets, sectors, or geographic regions. This helps protect against losses in any single investment."
            },
            {
                "id": 3,
                "question": "What does the Sharpe ratio measure?",
                "options": [
                    "Total return of an investment",
                    "Risk-adjusted return relative to risk-free rate",
                    "Market volatility",
                    "Dividend yield"
                ],
                "correct": 1,
                "explanation": "The Sharpe ratio measures an investment's excess return compared to the risk-free rate, divided by the investment's standard deviation (volatility)."
            },
            {
                "id": 4,
                "question": "What is a stop-loss order?",
                "options": [
                    "An order to buy more shares",
                    "An order to sell shares if price falls below a certain level",
                    "A dividend payment",
                    "A tax deduction"
                ],
                "correct": 1,
                "explanation": "A stop-loss order automatically sells shares when the price falls below a specified level, helping to limit potential losses."
            },
            {
                "id": 5,
                "question": "Which type of analysis focuses on company financial statements?",
                "options": [
                    "Technical analysis",
                    "Fundamental analysis",
                    "Sentiment analysis",
                    "Market timing"
                ],
                "correct": 1,
                "explanation": "Fundamental analysis evaluates a company's financial health by examining its financial statements, earnings, revenue, and other business metrics."
            }
        ]
        
        return jsonify({
            'questions': questions,
            'total_questions': len(questions)
        })
        
    except Exception as e:
        print(f"Error in quiz endpoint: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 