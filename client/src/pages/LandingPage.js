import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Brain, Shield, Users, ArrowRight, Play, BookOpen } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Real-Time Market Data',
      description: 'Get live stock and ETF data with interactive charts and key metrics like volatility and Sharpe ratio.',
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Our GPT-4 integration provides personalized explanations and investment guidance based on your experience level.',
    },
    {
      icon: Shield,
      title: 'Educational Resources',
      description: 'Learn about ETFs, stocks, and financial concepts through our comprehensive educational modules.',
    },
    {
      icon: Users,
      title: 'Beginner-Friendly',
      description: 'Designed for Gen Z and new investors with simple explanations and interactive learning experiences.',
    },
  ];

  const stats = [
    { number: '100+', label: 'Stocks & ETFs' },
    { number: '24/7', label: 'Market Data' },
    { number: 'AI', label: 'Powered' },
    { number: 'Free', label: 'Forever' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Master Investing with{' '}
              <span className="text-primary-600 dark:text-primary-400">AI-Powered</span> Education
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              LearnETF combines real-time market data with AI-driven insights to help you understand 
              ETFs, stocks, and investment strategies. Perfect for beginners and experienced investors alike.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-3"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/education"
                className="btn-secondary inline-flex items-center space-x-2 text-lg px-8 py-3"
              >
                <BookOpen className="w-5 h-5" />
                <span>Browse Courses</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose LearnETF?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with educational excellence to make 
              investing accessible to everyone.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of learners who are mastering the art of investing with AI-powered guidance.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Play className="w-5 h-5" />
            <span>Get Started Now</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">LearnETF</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering the next generation of investors with AI-powered education.
            </p>
            <div className="text-sm text-gray-500">
              © 2024 LearnETF. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 