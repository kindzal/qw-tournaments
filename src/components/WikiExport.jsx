// src/components/WikiExport.jsx
import React, { useState } from 'react';

const WikiExport = ({ standings, groupGames, playoffGames, teams }) => {
  const [wikiText, setWikiText] = useState('');
  const [exportType, setExportType] = useState('standings');
  const [copied, setCopied] = useState(false);

  // Convert API standings to wiki format
  const generateStandingsWiki = () => {
    if (!standings || standings.length === 0) {
      return '<!-- No standings data available -->';
    }

    let wiki = '=== Group Stage Standings ===\n\n';
    wiki += '{| class="wikitable" style="text-align:center;"\n';
    wiki += '|-\n';
    wiki += '! # !! Team !! Games !! Maps !! Diff\n';

    standings.forEach((team) => {
      const position = team['#'];
      const teamName = team.Team;
      const games = team.Games;
      const maps = team.Maps;
      const diff = team.Diff;

      // Highlight top positions
      let rowStyle = '';
      if (position === 1) {
        rowStyle = ' style="background:#d4edda;"';
      } else if (position === 2) {
        rowStyle = ' style="background:#e8f4ea;"';
      }

      wiki += `|-${rowStyle}\n`;
      wiki += `| '''${position}''' || ${teamName} || ${games} || ${maps} || ${diff}\n`;
    });

    wiki += '|}\n';
    return wiki;
  };

  // Convert API group games to wiki format
  const generateGroupGamesWiki = () => {
    if (!groupGames || groupGames.length === 0) {
      return '<!-- No group games data available -->';
    }

    let wiki = '=== Group Stage Matches ===\n\n';

    // Group by round
    const rounds = {};
    groupGames.forEach((game) => {
      if (!rounds[game.round]) {
        rounds[game.round] = [];
      }
      rounds[game.round].push(game);
    });

    Object.keys(rounds).sort((a, b) => parseInt(a) - parseInt(b)).forEach((round) => {
      wiki += `==== Round ${round} ====\n\n`;
      wiki += '{| class="wikitable" style="text-align:center;"\n';
      wiki += '|-\n';
      wiki += '! Team A !! Score !! Team B !! Date\n';

      rounds[round].forEach((game) => {
        const score = game.played ? `${game.mapsWonA} - ${game.mapsWonB}` : 'Not played';
        const date = game.date ? new Date(game.date).toLocaleDateString() : 'TBD';

        wiki += '|-\n';
        wiki += `| ${game.teamA} || ${score} || ${game.teamB} || ${date}\n`;
      });

      wiki += '|}\n\n';
    });

    return wiki;
  };

  // Convert API playoff games to wiki format
  const generatePlayoffGamesWiki = () => {
    if (!playoffGames || playoffGames.length === 0) {
      return '<!-- No playoff games data available -->';
    }

    let wiki = '=== Playoffs ===\n\n';

    // Group by round
    const rounds = {};
    playoffGames.forEach((game) => {
      if (!rounds[game.round]) {
        rounds[game.round] = [];
      }
      rounds[game.round].push(game);
    });

    // Order: Quarterfinals, Semifinals, Bronze, Final
    const roundOrder = ['Quarterfinals', 'Semifinals', 'Bronze', 'Final'];
    
    roundOrder.forEach((roundName) => {
      if (rounds[roundName]) {
        wiki += `==== ${roundName} ====\n\n`;
        wiki += '{| class="wikitable" style="text-align:center;"\n';
        wiki += '|-\n';
        wiki += '! Team A !! Score !! Team B !! Date\n';

        rounds[roundName].forEach((game) => {
          const score = game.played ? `${game.mapsWonA} - ${game.mapsWonB}` : 'TBD';
          const date = game.date ? new Date(game.date).toLocaleDateString() : 'TBD';

          // Skip if both teams are empty (bye)
          if (game.teamA === '-' || game.teamB === '-') {
            return;
          }

          wiki += '|-\n';
          wiki += `| ${game.teamA} || ${score} || ${game.teamB} || ${date}\n`;
        });

        wiki += '|}\n\n';
      }
    });

    return wiki;
  };

  // Convert API teams to wiki format
  const generateTeamsWiki = () => {
    if (!teams || teams.length === 0) {
      return '<!-- No teams data available -->';
    }

    let wiki = '=== Teams ===\n\n';
    wiki += '{| class="wikitable"\n';
    wiki += '|-\n';
    wiki += '! Team !! Tag !! Players\n';

    teams.forEach((team) => {
      wiki += '|-\n';
      wiki += `| ${team['Team Name']} || ${team['Team Tag']} || ${team.Players}\n`;
    });

    wiki += '|}\n';
    return wiki;
  };

  // Generate detailed match results with maps
  const generateDetailedMatchesWiki = () => {
    if (!groupGames || groupGames.length === 0) {
      return '<!-- No match data available -->';
    }

    let wiki = '=== Detailed Match Results ===\n\n';

    groupGames.forEach((game) => {
      if (!game.played || !game.maps || game.maps.length === 0) {
        return;
      }

      wiki += `==== ${game.teamA} vs ${game.teamB} (Round ${game.round}) ====\n\n`;
      wiki += `'''Final Score:''' ${game.mapsWonA} - ${game.mapsWonB}\n\n`;
      wiki += '{| class="wikitable"\n';
      wiki += '|-\n';
      wiki += '! Map !! ' + game.teamA + ' !! ' + game.teamB + '\n';

      game.maps.forEach((map) => {
        const winner = map.teamAFrags > map.teamBFrags ? game.teamA : game.teamB;
        wiki += '|-\n';
        wiki += `| ${map.mapName} || ${map.teamAFrags} || ${map.teamBFrags}\n`;
      });

      wiki += '|}\n\n';
    });

    return wiki;
  };

  // Generate complete tournament wiki
  const generateCompleteWiki = () => {
    let wiki = '== QuakeWorld Tournament ==\n\n';
    wiki += generateStandingsWiki();
    wiki += '\n';
    wiki += generateGroupGamesWiki();
    wiki += '\n';
    wiki += generatePlayoffGamesWiki();
    wiki += '\n';
    wiki += generateTeamsWiki();
    return wiki;
  };

  const handleGenerate = () => {
    let generated = '';
    
    switch (exportType) {
      case 'standings':
        generated = generateStandingsWiki();
        break;
      case 'groupGames':
        generated = generateGroupGamesWiki();
        break;
      case 'playoffGames':
        generated = generatePlayoffGamesWiki();
        break;
      case 'teams':
        generated = generateTeamsWiki();
        break;
      case 'detailedMatches':
        generated = generateDetailedMatchesWiki();
        break;
      case 'complete':
        generated = generateCompleteWiki();
        break;
      default:
        generated = '';
    }
    
    setWikiText(generated);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(wikiText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([wikiText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tournament-${exportType}-wiki.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Wiki Export</h2>
        <p className="text-gray-400 text-sm">
          Generate MediaWiki markup for tournament data
        </p>
      </div>

      {/* Export Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Export Type
        </label>
        <select
          value={exportType}
          onChange={(e) => setExportType(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="standings">Standings Table</option>
          <option value="groupGames">Group Stage Matches</option>
          <option value="playoffGames">Playoff Matches</option>
          <option value="teams">Teams & Rosters</option>
          <option value="detailedMatches">Detailed Match Results (with maps)</option>
          <option value="complete">Complete Tournament Page</option>
        </select>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded transition-colors mb-4"
      >
        Generate Wiki Markup
      </button>

      {/* Output Area */}
      {wikiText && (
        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className={`flex-1 ${
                copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
              } text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2`}
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy to Clipboard
                </>
              )}
            </button>
            
            <button
              onClick={handleDownload}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download as .txt
            </button>
          </div>

          {/* Wiki Output */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Generated Wiki Markup ({wikiText.split('\n').length} lines)
            </label>
            <textarea
              value={wikiText}
              readOnly
              rows={20}
              className="w-full bg-gray-900 border border-gray-700 text-green-400 font-mono text-sm rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
            />
          </div>

          {/* Usage Instructions */}
          <div className="bg-gray-700 rounded p-4 border border-gray-600">
            <h3 className="text-sm font-medium text-white mb-2">Usage Instructions:</h3>
            <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
              <li>Copy the generated wiki markup above</li>
              <li>Go to your MediaWiki or Liquipedia page editor</li>
              <li>Paste the markup into the source editor</li>
              <li>Preview and adjust as needed</li>
              <li>Save the page</li>
            </ol>
            <p className="text-xs text-gray-400 mt-3">
              Note: The markup uses MediaWiki syntax and Liquipedia templates like {'{'}Team{'}'}. 
              Make sure your wiki supports these templates.
            </p>
          </div>
        </div>
      )}

      {/* Data Status */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Available Data:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className={`p-2 rounded ${standings && standings.length > 0 ? 'bg-green-900/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
            ✓ Standings: {standings?.length || 0} teams
          </div>
          <div className={`p-2 rounded ${groupGames && groupGames.length > 0 ? 'bg-green-900/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
            ✓ Group Games: {groupGames?.length || 0} matches
          </div>
          <div className={`p-2 rounded ${playoffGames && playoffGames.length > 0 ? 'bg-green-900/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
            ✓ Playoff Games: {playoffGames?.length || 0} matches
          </div>
          <div className={`p-2 rounded ${teams && teams.length > 0 ? 'bg-green-900/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
            ✓ Teams: {teams?.length || 0} teams
          </div>
        </div>
      </div>
    </div>
  );
};

export default WikiExport;
