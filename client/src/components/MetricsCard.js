import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MetricsCard = ({ title, value, color = 'default' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'success-metric';
      case 'warning':
        return 'warning-metric';
      case 'danger':
        return 'danger-metric';
      default:
        return 'metric-card';
    }
  };

  const getIcon = () => {
    if (title.includes('Return') || title.includes('Sharpe')) {
      const numValue = parseFloat(value.replace('%', '').replace('$', ''));
      if (numValue > 0) return <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />;
      if (numValue < 0) return <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />;
      return <Minus className="w-5 h-5 text-gray-400" />;
    }
    return null;
  };

  return (
    <div className={`${getColorClasses()} transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
          {title}
        </h3>
        {getIcon()}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
    </div>
  );
};

export default MetricsCard; 