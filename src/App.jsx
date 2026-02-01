// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TournamentProvider } from './contexts/TournamentContext';
import HomePage from './pages/HomePage';
import TournamentPage from './pages/TournamentPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page - tournament list */}
        <Route path="/" element={<HomePage />} />
        
        {/* Tournament page - wrap with provider */}
        <Route 
          path="/:slug" 
          element={
            <TournamentProvider>
              <TournamentPage />
            </TournamentProvider>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
