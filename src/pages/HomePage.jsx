// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTournaments } from '../services/masterApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const HomePage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTournaments();
      setTournaments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading tournaments..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={loadTournaments} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded shadow-lg">
                <span className="font-bold text-white text-lg">QW</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">
                  QuakeWorld Tournaments
                </h1>
                <p className="text-xs text-gray-400 -mt-1">Tournament Hub</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Active Tournaments</h2>
          <p className="text-gray-400">Select a tournament to view details</p>
        </div>

        {tournaments.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No tournaments available at the moment
          </div>
        ) : (
          <TournamentTable tournaments={tournaments} />
        )}
      </main>
    </div>
  );
};

// Tournament Table Component
const TournamentTable = ({ tournaments }) => {
  const getStatusIcon = (status) => {
    const icons = {
      'Active': { icon: '●', color: 'text-green-400', bg: 'bg-green-900/20' },
      'Upcoming': { icon: '●', color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
      'Sign-up': { icon: '●', color: 'text-orange-400', bg: 'bg-orange-900/20' },
      'Completed': { icon: '●', color: 'text-gray-400', bg: 'bg-gray-700/20' },
    };
    return icons[status] || icons['Active'];
  };

  const getTypeEmoji = (type) => {
    return type === 'Online' ? '🌐' : '👥';
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'TBC') return 'TBC';
    return dateStr;
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tournament</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Mode</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Dates</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Organizers</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {tournaments.map((tournament, index) => {
              const statusInfo = getStatusIcon(tournament.status);
              
              return (
                <tr 
                  key={tournament.slug || index}
                  className="hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-4">
                    <Link 
                      to={`/${tournament.slug}`}
                      className="block"
                    >
                      <div className="font-medium text-white hover:text-blue-400 transition-colors">
                        {tournament.slugName || tournament.tourneyName}
                      </div>
                      {tournament.tourneyDescription && (
                        <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {tournament.tourneyDescription}
                        </div>
                      )}
                    </Link>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                      <span className="text-lg leading-none">{statusInfo.icon}</span>
                      {tournament.status}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="text-2xl" title={tournament.type}>
                      {getTypeEmoji(tournament.type)}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm font-medium">
                      {tournament.mode}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="text-gray-300">{formatDate(tournament.startDate)}</div>
                    {tournament.endDate && (
                      <div className="text-gray-500 text-xs">to {formatDate(tournament.endDate)}</div>
                    )}
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="text-gray-300">
                      {tournament.organisers && tournament.organisers.length > 0 
                        ? tournament.organisers.join(', ')
                        : 'N/A'
                      }
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomePage;
