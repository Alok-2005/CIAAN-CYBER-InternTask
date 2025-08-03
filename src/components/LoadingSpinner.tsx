import React from 'react';

interface LoadingSpinnerProps {
  isDarkMode?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isDarkMode = false }) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 to-gray-800'
          : 'bg-gradient-to-br from-slate-50 to-blue-50'
      }`}
    >
      <div className="text-center">
        <div className="relative">
          <div
            className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto ${
              isDarkMode
                ? 'border-blue-700 border-t-blue-300'
                : 'border-blue-200 border-t-blue-600'
            }`}
          ></div>
          <div
            className={`absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-spin animation-delay-150 mx-auto ${
              isDarkMode ? 'border-t-purple-300' : 'border-t-purple-600'
            }`}
          ></div>
        </div>
        <p
          className={`mt-4 font-medium ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;