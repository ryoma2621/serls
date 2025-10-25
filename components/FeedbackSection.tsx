import React from 'react';

interface FeedbackSectionProps {
  title: string;
  points: string[];
  // Fix: Changed JSX.Element to React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactNode;
  colorClass: string;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ title, points, icon, colorClass }) => {
  if (points.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border ${colorClass} border-opacity-30`}>
      <div className={`flex items-center p-4 border-b ${colorClass} border-opacity-20`}>
        <div className={`mr-4 text-2xl ${colorClass}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <ul className="p-6 space-y-3 list-none">
        {points.map((point, index) => (
          <li key={index} className="flex items-start">
            <svg className={`w-5 h-5 mr-3 mt-1 flex-shrink-0 ${colorClass}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span className="text-gray-300">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackSection;