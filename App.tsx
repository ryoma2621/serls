
import React, { useState, useCallback } from 'react';
import { FeedbackResponse } from './types';
import { analyzeReport } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import FeedbackSection from './components/FeedbackSection';

const App: React.FC = () => {
  const [reportText, setReportText] = useState('');
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!reportText.trim()) {
      setError("日報を入力してください。");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const result = await analyzeReport(reportText);
      setFeedback(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("予期せぬエラーが発生しました。");
      }
    } finally {
      setIsLoading(false);
    }
  }, [reportText]);

  const GoodPointsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.05 14.243L7.4 12.692l1.414-1.414 2.136 2.136 4.242-4.242 1.414 1.414-5.656 5.657z" />
    </svg>
  );

  const ImprovementPointsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            営業日報チェックAI
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            あなたの日報をAIが分析し、営業スキル向上をサポートします。
          </p>
        </header>

        <main className="bg-gray-800/30 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700">
          <div className="flex flex-col space-y-6">
            <label htmlFor="report" className="text-lg font-semibold text-gray-200">
              分析したい日報を入力してください
            </label>
            <textarea
              id="report"
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="ここに営業日報の内容を貼り付けてください..."
              className="w-full h-64 p-4 bg-gray-900 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-300 resize-y"
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading || !reportText.trim()}
              className="w-full sm:w-auto self-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 hover:shadow-blue-500/50 disabled:bg-gray-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:opacity-50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              {isLoading ? '分析中...' : 'チェック開始'}
            </button>
          </div>
        </main>

        <div className="mt-10">
          {isLoading && <LoadingSpinner />}
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-center">
              {error}
            </div>
          )}
          {feedback && (
            <div className="space-y-8 animate-fade-in">
              <FeedbackSection 
                title="良い点" 
                points={feedback.goodPoints} 
                icon={<GoodPointsIcon />}
                colorClass="text-green-400"
              />
              <FeedbackSection 
                title="改善点" 
                points={feedback.improvements}
                icon={<ImprovementPointsIcon />}
                colorClass="text-yellow-400"
              />
            </div>
          )}
        </div>
        
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} 営業日報チェックAI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
