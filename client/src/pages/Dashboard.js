import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Brain, MessageCircle, Send } from 'lucide-react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import StockSearch from '../components/StockSearch';
import MetricsCard from '../components/MetricsCard';
import AIChat from '../components/AIChat';

const Dashboard = () => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLevel, setUserLevel] = useState('beginner');
  const [showChat, setShowChat] = useState(false);

  const fetchStockData = async (ticker) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/stock?ticker=${ticker}`);
      setStockData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  const classifyUserExperience = async (response) => {
    try {
      const result = await axios.post('/api/gpt/classify', { response });
      setUserLevel(result.data.level);
    } catch (err) {
      console.error('Failed to classify user experience:', err);
    }
  };

  useEffect(() => {
    // Load default stock on component mount
    fetchStockData('AAPL');
  }, []);

  const getMetricColor = (value, type) => {
    if (type === 'return' || type === 'sharpe') {
      return value >= 0 ? 'success' : 'danger';
    }
    if (type === 'volatility') {
      return value <= 20 ? 'success' : value <= 30 ? 'warning' : 'danger';
    }
    return 'default';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Investment Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Analyze stocks and ETFs with AI-powered insights
          </p>
        </div>

        {/* Stock Search */}
        <div className="mb-8">
          <StockSearch onSearch={fetchStockData} loading={loading} />
        </div>

        {/* Experience Level Classifier */}
        <div className="mb-8 card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Help us personalize your experience
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Tell us about your investment experience..."
              className="input-field flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  classifyUserExperience(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.target.previousElementSibling;
                if (input.value.trim()) {
                  classifyUserExperience(input.value);
                  input.value = '';
                }
              }}
              className="btn-primary"
            >
              Classify
            </button>
          </div>
          {userLevel && (
            <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900 rounded-lg">
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                Your experience level: <span className="capitalize">{userLevel}</span>
              </span>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Stock Data Display */}
        {stockData && (
          <div className="space-y-8">
            {/* Company Info */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stockData.ticker}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {stockData.company_name} • {stockData.sector}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${stockData.metrics.current_price}
                  </div>
                  <div className={`flex items-center text-sm ${
                    stockData.metrics.price_change_pct >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stockData.metrics.price_change_pct >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {stockData.metrics.price_change_pct}%
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Price Chart
              </h3>
              <div className="h-96">
                <Plot
                  data={stockData.chart.data}
                  layout={{
                    ...stockData.chart.layout,
                    autosize: true,
                    height: 400,
                    margin: { l: 50, r: 50, t: 50, b: 50 },
                  }}
                  config={{ responsive: true }}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard
                title="1Y Return"
                value={`${stockData.metrics.one_year_return}%`}
                color={getMetricColor(stockData.metrics.one_year_return, 'return')}
              />
              <MetricsCard
                title="Volatility"
                value={`${stockData.metrics.volatility}%`}
                color={getMetricColor(stockData.metrics.volatility, 'volatility')}
              />
              <MetricsCard
                title="Sharpe Ratio"
                value={stockData.metrics.sharpe_ratio.toFixed(2)}
                color={getMetricColor(stockData.metrics.sharpe_ratio, 'sharpe')}
              />
              <MetricsCard
                title="Price Range"
                value={`$${stockData.metrics.min_price} - $${stockData.metrics.max_price}`}
                color="default"
              />
            </div>

            {/* AI Chat Toggle */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowChat(!showChat)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Brain className="w-5 h-5" />
                <span>{showChat ? 'Hide' : 'Show'} AI Assistant</span>
              </button>
            </div>

            {/* AI Chat */}
            {showChat && (
              <div className="card p-6">
                <AIChat userLevel={userLevel} ticker={stockData.ticker} />
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="loading-spinner"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading stock data...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 