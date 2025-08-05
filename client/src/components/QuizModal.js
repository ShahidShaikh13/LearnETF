import React, { useState } from 'react';
import { X, CheckCircle, XCircle, ArrowRight, BookOpen } from 'lucide-react';

const QuizModal = ({ isOpen, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const mockQuestions = [
    {
      question: "What is an ETF?",
      options: [
        "A type of cryptocurrency",
        "An Exchange-Traded Fund that tracks a basket of assets",
        "A government bond",
        "A savings account"
      ],
      correct: 1,
      explanation: "An ETF (Exchange-Traded Fund) is an investment fund that trades on stock exchanges, similar to stocks. It holds a collection of assets like stocks, bonds, or commodities."
    },
    {
      question: "Which of the following is a benefit of diversification?",
      options: [
        "Guaranteed higher returns",
        "Reduced risk through spreading investments",
        "Lower taxes",
        "Faster trading"
      ],
      correct: 1,
      explanation: "Diversification reduces risk by spreading investments across different assets, sectors, or geographic regions. This helps protect against losses in any single investment."
    },
    {
      question: "What does the Sharpe ratio measure?",
      options: [
        "Total return of an investment",
        "Risk-adjusted return relative to risk-free rate",
        "Market volatility",
        "Dividend yield"
      ],
      correct: 1,
      explanation: "The Sharpe ratio measures an investment's excess return compared to the risk-free rate, divided by the investment's standard deviation (volatility)."
    },
    {
      question: "What is a stop-loss order?",
      options: [
        "An order to buy more shares",
        "An order to sell shares if price falls below a certain level",
        "A dividend payment",
        "A tax deduction"
      ],
      correct: 1,
      explanation: "A stop-loss order automatically sells shares when the price falls below a specified level, helping to limit potential losses."
    },
    {
      question: "Which type of analysis focuses on company financial statements?",
      options: [
        "Technical analysis",
        "Fundamental analysis",
        "Sentiment analysis",
        "Market timing"
      ],
      correct: 1,
      explanation: "Fundamental analysis evaluates a company's financial health by examining its financial statements, earnings, revenue, and other business metrics."
    }
  ];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === mockQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / mockQuestions.length) * 100;
    if (percentage >= 80) return "Excellent! You have a strong understanding of investing concepts.";
    if (percentage >= 60) return "Good job! You have a solid foundation in investing.";
    if (percentage >= 40) return "Not bad! Keep learning to improve your knowledge.";
    return "Keep studying! Review the concepts and try again.";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Practice Quiz
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span>Question {currentQuestion + 1} of {mockQuestions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / mockQuestions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Quiz Content */}
        <div className="p-6">
          {!quizCompleted ? (
            <>
              {/* Question */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {mockQuestions[currentQuestion].question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {mockQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !showResult && handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                        selectedAnswer === index
                          ? showResult
                            ? index === mockQuestions[currentQuestion].correct
                              ? 'border-green-500 bg-green-50 dark:bg-green-900'
                              : 'border-red-500 bg-red-50 dark:bg-red-900'
                            : 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      } ${showResult ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white">{option}</span>
                        {showResult && selectedAnswer === index && (
                          index === mockQuestions[currentQuestion].correct ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )
                        )}
                        {showResult && index === mockQuestions[currentQuestion].correct && selectedAnswer !== index && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Result and Explanation */}
              {showResult && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {selectedAnswer === mockQuestions[currentQuestion].correct ? (
                      <span className="text-green-600 dark:text-green-400">✓ Correct!</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">✗ Incorrect</span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {mockQuestions[currentQuestion].explanation}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                {!showResult ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>{currentQuestion < mockQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Quiz Results */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Quiz Complete!
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                You scored {score} out of {mockQuestions.length}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {getScoreMessage()}
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleRestartQuiz}
                  className="btn-primary"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal; 