import React, { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';

const StockSearch = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const popularStocks = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
    'SPY', 'QQQ', 'VTI', 'VOO', 'IVV', 'BND', 'GLD', 'SLV'
  ];

  const handleSearch = (ticker) => {
    if (ticker.trim()) {
      onSearch(ticker.trim().toUpperCase());
      setQuery('');
      setSuggestions([]);
    }
  };

  const handleInputChange = (value) => {
    setQuery(value);
    if (value.trim()) {
      const filtered = popularStocks.filter(stock => 
        stock.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  return (
    <div className="relative">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Search Stocks & ETFs
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter ticker symbol (e.g., AAPL, SPY)"
              className="input-field pl-10"
              disabled={loading}
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSearch(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => handleSearch(query)}
            disabled={loading || !query.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {/* Popular Stocks */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Popular stocks & ETFs:
          </p>
          <div className="flex flex-wrap gap-2">
            {popularStocks.slice(0, 8).map((stock) => (
              <button
                key={stock}
                onClick={() => handleSearch(stock)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {stock}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockSearch; 