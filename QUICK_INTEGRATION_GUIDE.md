# Quick Integration Guide

## 🎯 Goal
Replace your localStorage-based tournament app with the API-based version in under 10 minutes.

## ⚡ Option 1: Full Replacement (Recommended)

### Step 1: Backup Current Code
```bash
# Create a backup branch
git checkout -b localStorage-backup
git commit -am "Backup before API migration"
git checkout main

# Or just copy the folder
cp -r qwiki-app qwiki-app-backup
```

### Step 2: Extract Refactored Files
```bash
# Unzip the refactored app
unzip refactored-qwiki-app.zip

# Copy to your project
cd your-project
cp refactored-app/services src/
cp refactored-app/hooks src/
cp refactored-app/components/*.jsx src/components/
cp refactored-app/App.jsx src/
cp refactored-app/.env* .
cp refactored-app/.gitignore .
```

### Step 3: Configure
```bash
# Edit .env
nano .env
# Set: VITE_API_BASE_URL=https://qw-app.short.gy/OVc4m4
```

### Step 4: Test
```bash
npm install
npm run dev
```

**Done!** Your app now uses API data.

---

## 🔧 Option 2: Gradual Migration

Keep both versions and switch between them.

### Step 1: Add New Files Without Removing Old
```bash
# Add new files alongside existing ones
cp refactored-app/services src/
cp refactored-app/hooks/useTournamentData.js src/hooks/
cp refactored-app/components/LoadingSpinner.jsx src/components/
cp refactored-app/components/ErrorMessage.jsx src/components/

# Add new versions with different names
cp refactored-app/App.jsx src/App_API.jsx
cp refactored-app/components/Header.jsx src/components/Header_API.jsx
cp refactored-app/.env* .
```

### Step 2: Switch Entry Point
In `src/main.jsx`, temporarily switch:
```javascript
// Old version
import App from './App'

// New version (for testing)
import App from './App_API'
```

### Step 3: Test Both Versions
```bash
# Test API version
npm run dev

# Switch back to localStorage if needed
# (just change import in main.jsx)
```

### Step 4: Commit When Ready
```bash
git commit -am "Add API version (gradual migration)"
```

---

## 📦 Option 3: Side-by-Side Comparison

Run both versions simultaneously for testing.

### Run on Different Ports
```bash
# Terminal 1: Old version (port 5173)
cd qwiki-app-old
npm run dev

# Terminal 2: New version (port 5174)
cd qwiki-app-new
npm run dev -- --port 5174
```

Compare both at:
- Old: http://localhost:5173
- New: http://localhost:5174

---

## 🚀 What Gets Replaced

### Files to REPLACE:
```
src/App.jsx                     → Use refactored version
src/components/Header.jsx       → Use simplified version
src/components/TournamentInfo.jsx → Use simplified version
```

### Files to ADD:
```
src/services/api.js             → NEW
src/hooks/useTournamentData.js  → NEW
src/components/LoadingSpinner.jsx → NEW
src/components/ErrorMessage.jsx → NEW
.env                            → NEW
.env.example                    → NEW
```

### Files You Can REMOVE (optional):
```
src/components/DataManager.jsx
src/components/DivisionManager.jsx
src/components/division/* (entire folder)
src/hooks/useLocalStorage.js
... and other old components
```

---

## ✅ Verification Checklist

After integration, verify:

- [ ] App starts without errors: `npm run dev`
- [ ] Loading spinner shows briefly on start
- [ ] Standings tab shows data
- [ ] Players tab shows data  
- [ ] Schedule tab shows games
- [ ] Teams tab shows teams
- [ ] Refresh button works
- [ ] Error handling works (disconnect internet, hit refresh)
- [ ] Console has no errors
- [ ] Environment variable is set: `echo $VITE_API_BASE_URL`

---

## 🐛 Common Issues

### Issue: "VITE_API_BASE_URL is not defined"
**Solution**: 
```bash
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL
```

### Issue: "Module not found: services/api"
**Solution**:
```bash
# Ensure you copied the services folder
cp -r refactored-app/services src/
```

### Issue: "Network Error" or "CORS Error"
**Solution**:
- Check API endpoint is accessible
- Verify CORS is enabled on the API
- Test URL directly in browser

### Issue: Build fails with "unexpected token"
**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

---

## 🔄 Rollback Instructions

If something goes wrong:

### Quick Rollback
```bash
git checkout localStorage-backup
# or
cp -r qwiki-app-backup/* qwiki-app/
npm run dev
```

### Using Switch Script
```bash
./switch-version.sh
# Select option 2 (localStorage version)
```

---

## 📊 Expected Results

After successful integration:

**Before (localStorage)**:
- Data stored in browser
- Manual data entry
- No loading states
- Works offline

**After (API)**:
- Data from API ✅
- Real-time updates ✅
- Loading/error states ✅
- Requires internet ✅

---

## 💡 Pro Tips

1. **Keep Both Versions**: Don't delete old code immediately
2. **Test Thoroughly**: Verify all tabs before deploying
3. **Environment Variables**: Use different .env for dev/prod
4. **Git Commits**: Commit at each step
5. **Documentation**: Keep README_API.md handy

---

## 📞 Need Help?

1. Check browser console for errors
2. Review `README_API.md` for detailed docs
3. Check `MIGRATION_GUIDE.md` for step-by-step
4. Review `REFACTORING_SUMMARY.md` for architecture

---

## ⏱️ Estimated Time

- **Option 1** (Full replacement): 5-10 minutes
- **Option 2** (Gradual): 15-20 minutes  
- **Option 3** (Side-by-side): 10-15 minutes

Choose based on your comfort level and project requirements!

---

**Quick Start Command Chain**:
```bash
unzip refactored-qwiki-app.zip
cp refactored-app/{services,hooks} src/ -r
cp refactored-app/components/*.jsx src/components/
cp refactored-app/App.jsx src/
cp refactored-app/.env.example .env
echo "VITE_API_BASE_URL=https://qw-app.short.gy/OVc4m4" >> .env
npm install
npm run dev
```

**That's it!** 🎉
