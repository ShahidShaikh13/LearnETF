import React, { useState } from 'react';
import { BookOpen, Brain, Play, CheckCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import QuizModal from '../components/QuizModal';

const EducationPage = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLevel, setUserLevel] = useState('beginner');
  const [showQuiz, setShowQuiz] = useState(false);

  const modules = [
    {
      id: 'etf-basics',
      title: 'What is an ETF?',
      description: 'Learn the fundamentals of Exchange-Traded Funds and how they work.',
      difficulty: 'Beginner',
      duration: '5 min',
      topics: ['Definition', 'Types', 'Benefits', 'Risks']
    },
    {
      id: 'index-funds-vs-mutual',
      title: 'Index Funds vs Mutual Funds',
      description: 'Understand the key differences between these popular investment vehicles.',
      difficulty: 'Beginner',
      duration: '7 min',
      topics: ['Structure', 'Fees', 'Performance', 'Taxation']
    },
    {
      id: 'diversification',
      title: 'Diversification Strategies',
      description: 'Learn how to build a well-diversified portfolio to manage risk.',
      difficulty: 'Intermediate',
      duration: '10 min',
      topics: ['Asset Allocation', 'Sector Diversification', 'Geographic Diversification', 'Risk Management']
    },
    {
      id: 'risk-management',
      title: 'Risk Management',
      description: 'Master the art of managing investment risk and protecting your capital.',
      difficulty: 'Intermediate',
      duration: '12 min',
      topics: ['Risk Types', 'Risk Assessment', 'Hedging Strategies', 'Stop Losses']
    },
    {
      id: 'technical-analysis',
      title: 'Technical Analysis Basics',
      description: 'Introduction to chart patterns and technical indicators.',
      difficulty: 'Advanced',
      duration: '15 min',
      topics: ['Chart Patterns', 'Indicators', 'Support/Resistance', 'Trend Analysis']
    },
    {
      id: 'fundamental-analysis',
      title: 'Fundamental Analysis',
      description: 'Learn how to evaluate companies and their intrinsic value.',
      difficulty: 'Advanced',
      duration: '20 min',
      topics: ['Financial Statements', 'Ratios', 'Valuation Methods', 'Industry Analysis']
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getAIExplanation = async (moduleId) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/gpt/explain', {
        query: `Explain ${modules.find(m => m.id === moduleId)?.title} in simple terms`,
        level: userLevel
      });
      setExplanation(response.data.explanation);
    } catch (error) {
      setExplanation('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    getAIExplanation(module.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Financial Education
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Master investing concepts with AI-powered explanations
          </p>
        </div>

        {/* Experience Level Selector */}
        <div className="mb-8 card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Select your experience level for personalized content:
          </h3>
          <div className="flex flex-wrap gap-3">
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setUserLevel(level)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  userLevel === level
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Modules List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Learning Modules
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {modules.map((module) => (
                <div
                  key={module.id}
                  onClick={() => handleModuleClick(module)}
                  className={`card p-6 cursor-pointer hover:shadow-lg transition-all duration-200 ${
                    selectedModule?.id === module.id
                      ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(module.difficulty)}`}>
                      {module.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {module.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ⏱ {module.duration}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Explanation Panel */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Explanation
                </h3>
              </div>

              {selectedModule ? (
                <div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {selectedModule.title}
                    </h4>
                    <div className="space-y-2">
                      {selectedModule.topics.map((topic, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <div className="loading-spinner"></div>
                      <span>Generating explanation...</span>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {explanation || 'Click on a module to get an AI-powered explanation tailored to your experience level.'}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Select a module to get an AI-powered explanation
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Additional Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Video Tutorials
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Watch step-by-step tutorials on investing basics and advanced strategies.
              </p>
            </div>
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI Chat Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Get instant answers to your questions with our AI-powered chat assistant.
              </p>
            </div>
            <div className="card p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Practice Exercises
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Test your knowledge with interactive quizzes and real-world scenarios.
              </p>
              <button
                onClick={() => setShowQuiz(true)}
                className="btn-primary w-full"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Quiz Modal */}
        <QuizModal 
          isOpen={showQuiz} 
          onClose={() => setShowQuiz(false)} 
        />
      </div>
    </div>
  );
};

export default EducationPage; 