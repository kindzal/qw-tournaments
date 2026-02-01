// src/pages/TournamentPage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TournamentInfo from '../components/TournamentInfo';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import WikiExport from '../components/WikiExport';
import { useTournament } from '../contexts/TournamentContext';
import { fetchStandings, fetchPlayers, fetchGroupGames, fetchPlayoffGames, fetchTeams, fetchScheduleConfig } from '../services/api';

function TournamentPage() {
  const [activeTab, setActiveTab] = useState('standings');
  const { currentTournament, loading: tournamentLoading, error: tournamentError, baseApiUrl } = useTournament();
  
  const [data, setData] = useState({
    standings: null,
    players: null,
    groupGames: null,
    playoffGames: null,
    teams: null,
    scheduleConfig: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tournament data when baseApiUrl is available
  useEffect(() => {
    if (!baseApiUrl) return;

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [standings, players, groupGames, playoffGames, teams, scheduleConfig] = await Promise.all([
          fetchStandings(baseApiUrl),
          fetchPlayers(baseApiUrl),
          fetchGroupGames(baseApiUrl),
          fetchPlayoffGames(baseApiUrl),
          fetchTeams(baseApiUrl),
          fetchScheduleConfig(baseApiUrl)
        ]);

        setData({
          standings,
          players,
          groupGames,
          playoffGames,
          teams,
          scheduleConfig
        });
      } catch (err) {
        setError(err.message || 'Failed to load tournament data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [baseApiUrl]);

  const refetch = () => {
    if (baseApiUrl) {
      // Trigger re-fetch by updating a dependency
      window.location.reload();
    }
  };

  if (tournamentLoading) {
    return <LoadingSpinner message="Loading tournament..." />;
  }

  if (tournamentError) {
    return <ErrorMessage error={tournamentError} onRetry={() => window.location.reload()} />;
  }

  if (!currentTournament) {
    return <ErrorMessage error="Tournament not found" onRetry={() => window.location.href = '/'} />;
  }

  if (loading) {
    return <LoadingSpinner message="Loading tournament data..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  if (!data.standings && !data.players && !data.groupGames) {
    return <ErrorMessage error="No tournament data available" onRetry={refetch} />;
  }

  if (loading) {
    return <LoadingSpinner message="Loading tournament data..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  if (!data) {
    return <ErrorMessage error="No data available" onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onRefresh={refetch} />
      
      <main className="container mx-auto px-4 py-8">
        <TournamentInfo />
        
        <div className="mt-8">
          {activeTab === 'standings' && (
            <StandingsView data={data.standings} />
          )}
          
          {activeTab === 'players' && (
            <PlayersView data={data.players} />
          )}
          
          {activeTab === 'schedule' && (
            <ScheduleView 
              groupGames={data.groupGames}
              playoffGames={data.playoffGames}
              scheduleConfig={data.scheduleConfig}
            />
          )}
          
          {activeTab === 'teams' && (
            <TeamsView data={data.teams} />
          )}
          
          {activeTab === 'wiki' && (
            <WikiExport 
              standings={data.standings}
              groupGames={data.groupGames}
              playoffGames={data.playoffGames}
              teams={data.teams}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// Standings View Component
const StandingsView = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-400">No standings data available</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-700 border-b border-gray-600">
        <h2 className="text-2xl font-bold">Standings</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Games</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Maps</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Diff</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {data.map((team, index) => (
              <tr key={index} className="hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{team['#']}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{team.Team}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{team.Games}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{team.Maps}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  team.Diff.startsWith('+') ? 'text-green-400' : 
                  team.Diff.startsWith('-') ? 'text-red-400' : 'text-gray-300'
                }`}>
                  {team.Diff}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Players View Component
const PlayersView = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-400">No player data available</div>;
  }

  // Helper function to safely format numbers
  const formatNumber = (value, decimals = 0) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? 'N/A' : num.toFixed(decimals);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? 'N/A' : `${(num * 100).toFixed(0)}%`;
  };

  const formatInteger = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const num = typeof value === 'string' ? parseInt(value) : value;
    return isNaN(num) ? 'N/A' : num.toLocaleString();
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-700 border-b border-gray-600">
        <h2 className="text-2xl font-bold">Player Statistics</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Player</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Maps</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Avg Frags</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Win Rate</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Avg Eff</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Avg Dmg</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {data.map((player, index) => (
              <tr key={index} className="hover:bg-gray-700 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm">{player.Rank || 'N/A'}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{player.Player || 'Unknown'}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">{formatInteger(player['Maps Played'])}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">{formatInteger(player['Avg Frags'])}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {formatPercentage(player['Win Rate'])}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {formatNumber(player['Avg Eff'], 2)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {formatInteger(player['Avg Dmg'])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Schedule View Component
const ScheduleView = ({ groupGames, playoffGames, scheduleConfig }) => {
  const [viewMode, setViewMode] = useState('group'); // 'group' or 'playoff'

  const games = viewMode === 'group' ? groupGames : playoffGames;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Schedule</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('group')}
            className={`px-4 py-2 rounded ${
              viewMode === 'group' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Group Stage
          </button>
          <button
            onClick={() => setViewMode('playoff')}
            className={`px-4 py-2 rounded ${
              viewMode === 'playoff' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Playoffs
          </button>
        </div>
      </div>

      {games && games.length > 0 ? (
        <div className="space-y-4">
          {games.map((game, index) => (
            <GameCard key={index} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          No {viewMode} games available
        </div>
      )}
    </div>
  );
};

// Game Card Component
const GameCard = ({ game }) => {
  const isPlayed = game.played === 1;
  const hasWinner = game.mapsWonA !== '' && game.mapsWonB !== '';

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-400">Round {game.round}</span>
        {game.date && (
          <span className="text-sm text-gray-400">
            {new Date(game.date).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 text-right">
          <div className="text-lg font-bold">{game.teamA}</div>
        </div>
        
        <div className="mx-8 text-center">
          {hasWinner ? (
            <div className="text-2xl font-bold">
              <span className={game.mapsWonA > game.mapsWonB ? 'text-green-400' : 'text-gray-400'}>
                {game.mapsWonA}
              </span>
              <span className="mx-2 text-gray-500">-</span>
              <span className={game.mapsWonB > game.mapsWonA ? 'text-green-400' : 'text-gray-400'}>
                {game.mapsWonB}
              </span>
            </div>
          ) : (
            <div className="text-gray-500">vs</div>
          )}
        </div>

        <div className="flex-1">
          <div className="text-lg font-bold">{game.teamB}</div>
        </div>
      </div>

      {isPlayed && game.maps && game.maps.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="text-sm text-gray-400 font-medium">Maps:</div>
          {game.maps.map((map, idx) => (
            <div key={idx} className="flex justify-between items-center bg-gray-700 rounded px-4 py-2">
              <span className="font-medium">{map.mapName}</span>
              <span className="text-sm">
                <span className={map.teamAFrags > map.teamBFrags ? 'text-green-400 font-bold' : ''}>
                  {map.teamAFrags}
                </span>
                <span className="mx-2 text-gray-500">-</span>
                <span className={map.teamBFrags > map.teamAFrags ? 'text-green-400 font-bold' : ''}>
                  {map.teamBFrags}
                </span>
              </span>
              {map.gameUrl && (
                <a 
                  href={map.gameUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm ml-4"
                >
                  View Game
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Teams View Component
const TeamsView = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-400">No team data available</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-700 border-b border-gray-600">
        <h2 className="text-2xl font-bold">Teams</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {data.map((team, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{team['Team Name']}</span>
            </div>
            <div className="text-sm text-gray-400 mb-2">
              Tag: <span className="text-gray-300">{team['Team Tag']}</span>
            </div>
            <div className="text-sm text-gray-400">
              Players: <span className="text-gray-300">{team.Players}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentPage;
