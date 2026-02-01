// src/components/TournamentInfo.jsx
import React from 'react';

export default function TournamentInfo() {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Tournament Name</h3>
          <p className="text-lg font-bold text-white">QuakeWorld League 2026</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Mode</h3>
          <p className="text-lg font-bold text-white">4on4</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-lg font-bold text-green-400">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
