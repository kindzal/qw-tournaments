# QuakeWorld Tournament Hub - Multi-Tournament Version

A React-based tournament administration application that manages **multiple tournaments** with dynamic API integration.

## 🆕 What's New - Multi-Tournament Support

### Key Features
- **📋 Tournament Hub** - Homepage lists all available tournaments
- **🔀 Dynamic Routing** - Each tournament has its own URL (`/slug`)
- **🎯 Tournament Switcher** - Quick dropdown to switch between tournaments
- **🏠 Home Link** - Easy navigation back to tournament list
- **⚡ Smart Caching** - Efficient data loading with context management

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure Master API URL
# Edit .env and set your master API endpoint
VITE_API_BASE_URL=https://your-master-api.com

# 3. Run
npm run dev

# 4. Visit
http://localhost:5173
```

---

## 📊 Architecture Overview

```
HomePage (/)
  ↓
Master API: GET /api/tournaments
  ↓
Tournament List Table
  ↓
User clicks tournament
  ↓
Navigate to /:slug
  ↓
TournamentPage loads
  ↓
Get baseApiUrl from tournament data
  ↓
Fetch tournament data from baseApiUrl
```

---

## 🔌 API Requirements

### Master API Endpoints

Your master API (`VITE_API_BASE_URL`) must provide:

#### 1. Get All Tournaments
```http
GET /api/tournaments

Response: [
  {
    "tourneyId": "QML7",
    "tourneyName": "QuakeWorld Mix League 7",
    "slugName": "QuakeWorld Mix League 7",
    "slug": "QML7",
    "status": "Active",
    "type": "Online",
    "mode": "4on4",
    "startDate": "02/02/2026",
    "endDate": "29/03/2026",
    "organisers": ["Doomie", "Åke Vader"],
    "baseApiUrl": "https://tournament-api.com/qml7"
  },
  ...
]
```

#### 2. Get Single Tournament by Slug
```http
GET /api/tournaments/:slug

Example: GET /api/tournaments/QML7

Response: {
  "tourneyId": "QML7",
  "tourneyName": "QuakeWorld Mix League 7",
  "slug": "QML7",
  "baseApiUrl": "https://tournament-api.com/qml7",
  ...
}
```

### Tournament API Endpoints

Each tournament's `baseApiUrl` must provide:

```http
GET ?endpoint=standings
GET ?endpoint=players
GET ?endpoint=groupGames
GET ?endpoint=playoffGames
GET ?endpoint=teams
GET ?endpoint=scheduleConfig
```

---

## 📁 Project Structure

```
src/
├── App.jsx                       # Router setup
├── contexts/
│   └── TournamentContext.jsx     # Tournament state management
├── pages/
│   ├── HomePage.jsx              # Tournament list
│   └── TournamentPage.jsx        # Individual tournament view
├── services/
│   ├── masterApi.js              # Master API calls
│   └── api.js                    # Tournament data API calls
├── components/
│   ├── Header.jsx                # Navigation with dropdown
│   ├── TournamentInfo.jsx
│   ├── LoadingSpinner.jsx
│   ├── ErrorMessage.jsx
│   └── WikiExport.jsx
└── hooks/
    └── useTournamentData.js
```

---

## 🎨 Tournament List Features

### Status Indicators
- 🟢 **Active** - Tournament in progress
- 🟡 **Upcoming** - Not started yet
- 🟠 **Sign-up** - Registration open
- ⚪ **Completed** - Tournament finished

### Tournament Types
- 🌐 **Online** - Internet-based
- 👥 **Offline** - LAN events

### Filtering
- Hidden and Cancelled tournaments are automatically filtered out
- Only active, upcoming, sign-up, and completed tournaments are shown

---

## 🔧 Configuration

### Environment Variables

**.env**
```env
# Master API URL - returns tournament list
VITE_API_BASE_URL=https://your-master-api.com
```

### Tournament Data Structure

Each tournament object should include:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tourneyId` | string | Yes | Unique tournament ID |
| `tourneyName` | string | Yes | Full tournament name |
| `slugName` | string | Yes | Display name |
| `slug` | string | Yes | URL slug |
| `status` | string | Yes | Active/Upcoming/Sign-up/Completed/Hidden/Cancelled |
| `type` | string | Yes | Online/Offline |
| `mode` | string | Yes | 1on1/2on2/4on4 |
| `startDate` | string | No | Start date |
| `endDate` | string | No | End date |
| `organisers` | array | No | List of organizer names |
| `baseApiUrl` | string | Yes | API endpoint for tournament data |
| `tourneyDescription` | string | No | Tournament description |
| `discord` | string | No | Discord link |
| `links` | array | No | Additional links |
| `maps` | array | No | Map pool |

---

## 🎯 User Flows

### Flow 1: Browse and Select Tournament

```
1. User visits /
2. Sees list of tournaments
3. Clicks "QuakeWorld Mix League 7"
4. Navigates to /QML7
5. Views tournament data
```

### Flow 2: Direct Tournament Link

```
1. User visits /QML7 directly
2. App fetches tournament config from master API
3. Gets baseApiUrl
4. Fetches tournament data
5. Displays tournament page
```

### Flow 3: Switch Between Tournaments

```
1. User on /QML7
2. Clicks "Switch" dropdown in header
3. Selects "QWSL DIV2"
4. Navigates to /QWSLDIV2
5. New tournament data loads
```

---

## 🔄 Data Flow

### HomePage
```javascript
1. Fetch tournaments from master API
2. Filter out Hidden/Cancelled
3. Display in table
4. User clicks → Navigate to /:slug
```

### TournamentPage
```javascript
1. Get slug from URL params
2. Check tournament context cache
3. If not cached: Fetch from master API
4. Get baseApiUrl from tournament object
5. Fetch tournament data from baseApiUrl
6. Display data in tabs
```

---

## 🎨 UI Components

### HomePage
- **Tournament Table** - Sortable list with filters
- **Status Badges** - Color-coded status indicators
- **Type Icons** - Visual tournament type indicators
- **Clickable Rows** - Navigate to tournament

### TournamentPage Header
- **Home Link** - Logo/title links to homepage
- **Tournament Switcher** - Dropdown with all tournaments
- **Tab Navigation** - Standings, Players, Schedule, Teams, Wiki
- **Refresh Button** - Reload tournament data

---

## 💡 Development Tips

### Testing Locally

1. **Mock Master API Response**
   ```javascript
   // In masterApi.js, temporarily return mock data
   export const fetchTournaments = async () => {
     return [/* mock tournament list */];
   };
   ```

2. **Test Direct Links**
   - Visit `http://localhost:5173/QML7` directly
   - Verify tournament loads correctly

3. **Test Navigation**
   - Click between tournaments
   - Check data updates properly

### Adding New Tournaments

Simply add to your master API response:
```json
{
  "slug": "new-tournament-2026",
  "tourneyName": "New Tournament 2026",
  "baseApiUrl": "https://api.example.com/new-2026",
  ...
}
```

No code changes needed! The app automatically picks it up.

---

## 🐛 Troubleshooting

### "Tournament not found"
- Check slug in URL matches tournament slug from API
- Verify master API returns tournament with that slug

### "No data available"
- Check `baseApiUrl` is correct in tournament object
- Verify tournament API endpoints are accessible
- Check browser console for API errors

### Dropdown shows wrong tournaments
- Check status filtering in code
- Verify Hidden/Cancelled tournaments are excluded

### Navigation not working
- Ensure React Router is installed: `npm install react-router-dom`
- Check browser console for routing errors

---

## 📦 Dependencies

### New Dependencies
- `react-router-dom@^6.22.0` - Routing

### Existing Dependencies
- `react@^18.2.0`
- `axios@^1.13.2`
- `tailwindcss@^3.4.0`

---

## 🚀 Deployment

### Build
```bash
npm run build
```

### Environment Variables (Production)
Set `VITE_API_BASE_URL` to your production master API:
```env
VITE_API_BASE_URL=https://api.quakeworld.com
```

### Deployment Platforms

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod --dir=dist
```

**Important:** Configure `_redirects` for client-side routing:
```
/*    /index.html   200
```

---

## 🎯 Feature Comparison

| Feature | Single Tournament | Multi-Tournament |
|---------|------------------|------------------|
| Tournament Selection | ❌ | ✅ HomePage list |
| Dynamic API URLs | ❌ | ✅ Per tournament |
| Direct Links | ❌ | ✅ /slug URLs |
| Tournament Switcher | ❌ | ✅ Dropdown |
| Centralized Management | ❌ | ✅ Master API |

---

## 📝 Example Usage

### Master API Implementation (Node.js/Express)

```javascript
app.get('/api/tournaments', (req, res) => {
  const tournaments = [
    {
      slug: 'QML7',
      tourneyName: 'QuakeWorld Mix League 7',
      baseApiUrl: 'https://script.google.com/...',
      status: 'Active',
      // ... other fields
    },
    // ... more tournaments
  ];
  
  res.json(tournaments);
});

app.get('/api/tournaments/:slug', (req, res) => {
  const tournament = tournaments.find(t => t.slug === req.params.slug);
  if (!tournament) {
    return res.status(404).json({ error: 'Tournament not found' });
  }
  res.json(tournament);
});
```

---

## 🎉 Ready to Use!

1. Set up your master API
2. Configure `.env`
3. Run `npm install`
4. Run `npm run dev`
5. Visit `http://localhost:5173`

Your multi-tournament hub is live! 🚀

---

**Version:** 2.0.0 (Multi-Tournament)
**Last Updated:** February 1, 2026
