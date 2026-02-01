// src/components/Header.jsx
// Replace entire file - Logo only links to home, not the text

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTournament } from '../contexts/TournamentContext';

export default function Header({ activeTab, setActiveTab, onRefresh }) {
  const { currentTournament, allTournaments } = useTournament();
  const [showTournamentDropdown, setShowTournamentDropdown] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { id: 'standings', label: 'Standings' },
    { id: 'players', label: 'Players' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'teams', label: 'Teams' },
    { id: 'wiki', label: 'Wiki Export' }
  ];

  const handleTournamentSelect = (slug) => {
    navigate(`/${slug}`);
    setShowTournamentDropdown(false);
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title - ONLY LOGO LINKS TO HOME */}
          <div className="flex items-center gap-3">
            <Link to="/" className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded shadow-lg hover:opacity-80 transition-opacity">
              <span className="font-bold text-white text-lg">QW</span>
            </Link>
            <div>
              <h1 className="font-bold text-lg text-white">
                {currentTournament ? currentTournament.slugName || currentTournament.tourneyName : 'QuakeWorld'}
              </h1>
              <p className="text-xs text-gray-400 -mt-1">
                {currentTournament ? 'Tournament Admin' : 'Tournament Hub'}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {/* Tournament Selector Dropdown (only show on tournament pages) */}
            {currentTournament && allTournaments.length > 0 && (
              <div className="relative mr-2">
                <button
                  onClick={() => setShowTournamentDropdown(!showTournamentDropdown)}
                  className="px-4 py-2 font-semibold text-sm uppercase transition-all duration-200 rounded text-gray-300 hover:text-white hover:bg-gray-700 flex items-center gap-2"
                  title="Switch tournament"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Switch
                  <svg className={`w-3 h-3 transition-transform ${showTournamentDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 12 12">
                    <path d="M6 8L1 3h10z" />
                  </svg>
                </button>

                {/* Dropdown */}
                {showTournamentDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowTournamentDropdown(false)}
                    />
                    <div className="absolute top-full right-0 mt-1 w-80 bg-gray-800 border border-gray-700 z-50 overflow-hidden rounded shadow-xl max-h-96 overflow-y-auto">
                      <div className="px-3 py-2 border-b border-gray-700 bg-gray-900">
                        <span className="text-xs font-mono text-gray-400">SELECT TOURNAMENT</span>
                      </div>
                      <div className="py-1">
                        {allTournaments.map((tournament) => (
                          <button
                            key={tournament.slug}
                            onClick={() => handleTournamentSelect(tournament.slug)}
                            className={`
                              w-full px-4 py-2.5 text-left text-sm
                              flex items-center justify-between
                              transition-all duration-150
                              ${tournament.slug === currentTournament.slug
                                ? 'bg-blue-900/20 text-blue-400 border-l-2 border-blue-400' 
                                : 'text-white hover:bg-gray-700 hover:text-blue-400 border-l-2 border-transparent'
                              }
                            `}
                          >
                            <span className="flex-1">{tournament.slugName || tournament.tourneyName}</span>
                            <span className="text-xs text-gray-500">{tournament.mode}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Tab Navigation (only show on tournament pages) */}
            {currentTournament && tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 font-semibold text-sm uppercase
                  transition-all duration-200 rounded
                  ${activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
            
            {/* Refresh Button (only show on tournament pages) */}
            {currentTournament && onRefresh && (
              <button
                onClick={onRefresh}
                className="ml-4 p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title="Refresh data"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
