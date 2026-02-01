// src/components/ErrorMessage.jsx
import React from 'react';

const ErrorMessage = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg 
            className="w-16 h-16 mx-auto" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Error Loading Data</h2>
        
        <p className="text-gray-400 mb-6">
          {error || 'An unexpected error occurred'}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors"
          >
            Try Again
          </button>
        )}
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Please check:</p>
          <ul className="list-disc list-inside mt-2 text-left">
            <li>Your internet connection</li>
            <li>API endpoint configuration in .env file</li>
            <li>Server availability</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
