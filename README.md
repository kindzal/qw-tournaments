# QuakeWorld Tournament Admin - Complete API Version

A complete, production-ready React application for QuakeWorld tournament administration with API-based data fetching.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure API endpoint (already set to default)
# Edit .env if you need a different endpoint
# VITE_API_BASE_URL=https://qw-app.short.gy/OVc4m4

# 3. Run development server
npm run dev

# 4. Build for production
npm run build
```

Visit: `http://localhost:5173`

## ✨ Features

- **Real-time Data**: Fetches live tournament data from API endpoints
- **Standings View**: Team rankings with games, maps, and differentials
- **Player Statistics**: Comprehensive player stats (frags, win rates, efficiency, etc.)
- **Schedule Management**: View group stage and playoff games with detailed results
- **Team Rosters**: Complete team information with player lineups
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages with retry functionality
- **Manual Refresh**: Update data on demand
- **Responsive Design**: Mobile-friendly interface

## 📁 Project Structure

```
qwiki-app-final/
├── src/
│   ├── services/
│   │   └── api.js                   # API service layer
│   ├── hooks/
│   │   └── useTournamentData.js     # Data fetching hooks
│   ├── components/
│   │   ├── Header.jsx               # Navigation header
│   │   ├── TournamentInfo.jsx       # Tournament info
│   │   ├── LoadingSpinner.jsx       # Loading state
│   │   └── ErrorMessage.jsx         # Error handling
│   ├── App.jsx                      # Main application
│   └── main.jsx                     # Entry point
├── .env                             # Environment config
├── package.json                     # Dependencies
└── README.md                        # This file
```

## 🔌 API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `?endpoint=standings` | Team standings |
| `?endpoint=players` | Player statistics |
| `?endpoint=groupGames` | Group stage matches |
| `?endpoint=playoffGames` | Playoff matches |
| `?endpoint=teams` | Team rosters |
| `?endpoint=scheduleConfig` | Schedule configuration |

## 🎉 Ready to Use!

This is a complete, working application:

1. Run `npm install`
2. Run `npm run dev`
3. Open `http://localhost:5173`

Everything works out of the box! 🚀
