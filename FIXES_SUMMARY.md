# Bug Fixes & Improvements Summary

## Files to Update

### 1. TournamentPage_UPDATED.jsx
**Location:** Replace GameCard component (lines ~310-380) in `src/pages/TournamentPage.jsx`

**Fixes:**
- ✅ **Schedule page score alignment** - Numbers now properly centered
- ✅ **Unplayed game distinction** - Different background color (bg-gray-750/50 with border) for games not yet played

**Changes:**
- Added `min-w-[100px]` and flex centering for score display
- Added `flex items-center justify-center` for map scores
- Changed background to `bg-gray-750/50 border-2 border-gray-600/50` when `!isPlayed`

---

### 2. TournamentInfo.jsx
**Location:** Replace entire file at `src/components/TournamentInfo.jsx`

**Fixes:**
- ✅ **Removed static "QuakeWorld League 2026" text** - Saves space
- ✅ **Added Type display** - Shows 🌐 Online or 👥 Offline
- ✅ **Added Dates display** - Shows start and end dates
- ✅ **Added Maps display** - Shows map pool as badges
- ✅ **Added Discord link** - Clickable with Discord icon
- ✅ **Added other Links** - All links from API displayed as buttons
- ✅ **Kept Organizers** - Still shows organizers

---

### 3. Header.jsx
**Location:** Replace entire file at `src/components/Header.jsx`

**Fixes:**
- ✅ **Logo only links to home** - Removed Link wrapper from title text
- Only the QW logo square is clickable, not the tournament name

**Changes:**
```jsx
// Before: Whole div was wrapped in Link
<Link to="/" className="flex items-center gap-3">
  <div>Logo</div>
  <div>Text</div>
</Link>

// After: Only logo wrapped in Link
<Link to="/" className="...">Logo</Link>
<div>Text (not clickable)</div>
```

---

### 4. HomePage.jsx
**Location:** Replace entire file at `src/pages/HomePage.jsx`

**Fixes:**
- ✅ **Active/Completed filter buttons**
  - Active: Shows Sign-up, Active, Upcoming
  - Completed: Shows Completed, Cancelled
- ✅ **Non-clickable tournaments without baseApiUrl**
  - Checks if `baseApiUrl` exists and is not empty
  - Grays out row (`opacity-60 cursor-not-allowed`)
  - Doesn't wrap in Link if no baseApiUrl

**New Features:**
```jsx
// Filter buttons
<button onClick={() => setActiveFilter('active')}>Active</button>
<button onClick={() => setActiveFilter('completed')}>Completed</button>

// Conditional linking
{hasBaseApiUrl ? (
  <Link to={`/${tournament.slug}`}><Row /></Link>
) : (
  <Row /> // Not clickable
)}
```

---

### 5. nginx.conf
**Location:** Create new file in project root: `nginx.conf`

**Fixes:**
- ✅ **404 error on direct slug access** (e.g., `/qml7`)
- Configures nginx to serve `index.html` for all routes (SPA routing)

**Key Configuration:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

This tells nginx:
1. Try to serve the file if it exists (`$uri`)
2. Try to serve as directory (`$uri/`)
3. Fall back to `index.html` (for React Router routes)

---

### 6. Dockerfile
**Location:** Replace your existing Dockerfile

**Fixes:**
- ✅ **Includes nginx.conf** to fix routing
- Copies custom nginx configuration before serving

**Changes:**
```dockerfile
# Added this line:
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

---

## Quick Update Instructions

1. **Update TournamentPage.jsx**
   - Find the `GameCard` component (~line 310)
   - Replace it with the version from `TournamentPage_UPDATED.jsx`

2. **Replace TournamentInfo.jsx**
   - Replace entire file with new version

3. **Replace Header.jsx**
   - Replace entire file with new version

4. **Replace HomePage.jsx**
   - Replace entire file with new version

5. **Add nginx.conf**
   - Create `nginx.conf` in project root
   - Copy content from provided file

6. **Update Dockerfile**
   - Replace entire Dockerfile
   - Or just add the COPY line for nginx.conf

7. **Rebuild and deploy**
   ```bash
   docker build -t qw-app .
   docker run -p 80:80 qw-app
   ```

---

## Testing Checklist

### Schedule Page
- [ ] Scores are centered in game cards
- [ ] Unplayed games have different background (lighter/bordered)
- [ ] Map scores align properly

### Tournament Info
- [ ] Static title removed
- [ ] Type shows with emoji (🌐 or 👥)
- [ ] Dates display correctly
- [ ] Maps show as badges
- [ ] Discord link clickable
- [ ] Other links show and are clickable

### Header
- [ ] Only logo links to home
- [ ] Tournament name is NOT clickable
- [ ] Clicking name does nothing
- [ ] Clicking logo goes to /

### HomePage
- [ ] Active button shows Sign-up, Active, Upcoming
- [ ] Completed button shows Completed, Cancelled
- [ ] Tournaments without baseApiUrl are grayed out
- [ ] Tournaments without baseApiUrl are NOT clickable
- [ ] Tournaments with baseApiUrl navigate correctly

### Nginx/Routing
- [ ] Direct access to `/qml7` works (no 404)
- [ ] Direct access to any slug works
- [ ] Home page still loads
- [ ] Navigation still works
- [ ] Refresh on tournament page works

---

## Why These Changes?

### 1. Schedule Alignment
**Problem:** Scores weren't centered due to flex container issues
**Solution:** Added explicit centering and min-width

### 2. Unplayed Games
**Problem:** No visual distinction between played and unplayed
**Solution:** Different background color with border

### 3. Tournament Info
**Problem:** Too much static text, missing key data
**Solution:** Removed static title, added Type, Dates, Maps, Discord, Links

### 4. Header Link
**Problem:** Entire header was clickable (annoying UX)
**Solution:** Only logo is clickable now

### 5. HomePage Filters
**Problem:** All tournaments mixed together
**Solution:** Separate Active and Completed tabs

### 6. Non-clickable Tournaments
**Problem:** Clicking tournament without data caused errors
**Solution:** Gray out and don't link if no baseApiUrl

### 7. Nginx 404
**Problem:** Direct URL access (e.g., `/qml7`) returned 404
**Solution:** Configure nginx to always serve index.html for SPA routing

---

## Deployment Notes

When deploying to Railway/Jenkins:

1. Make sure `nginx.conf` is in your project root
2. Dockerfile must copy it: `COPY nginx.conf /etc/nginx/conf.d/default.conf`
3. Build command: `docker build -t yourapp .`
4. The nginx config will fix all routing issues

**Test locally:**
```bash
docker build -t qw-test .
docker run -p 8080:80 qw-test
# Visit http://localhost:8080/qml7 - should work!
```

---

All fixes implemented! 🎉
