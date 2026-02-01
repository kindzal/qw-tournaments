// src/contexts/TournamentContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTournamentBySlug, fetchAllTournaments } from '../services/masterApi';

const TournamentContext = createContext();

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within TournamentProvider');
  }
  return context;
};

export const TournamentProvider = ({ children }) => {
  const { slug } = useParams();
  const [currentTournament, setCurrentTournament] = useState(null);
  const [allTournaments, setAllTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tournaments for dropdown (cached)
  useEffect(() => {
    const loadAllTournaments = async () => {
      try {
        const tournaments = await fetchAllTournaments();
        // Filter out Hidden and Cancelled for dropdown
        const filtered = tournaments.filter(
          t => t.status !== 'Hidden' && t.status !== 'Cancelled'
        );
        setAllTournaments(filtered);
      } catch (err) {
        console.error('Failed to load tournaments list:', err);
      }
    };
    
    loadAllTournaments();
  }, []);

  // Fetch current tournament when slug changes
  useEffect(() => {
    if (!slug) {
      setCurrentTournament(null);
      return;
    }

    const loadTournament = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if we already have it in cache
        const cached = allTournaments.find(t => t.slug === slug);
        
        if (cached) {
          setCurrentTournament(cached);
        } else {
          // Fetch from API
          const tournament = await fetchTournamentBySlug(slug);
          setCurrentTournament(tournament);
        }
      } catch (err) {
        setError(err.message);
        setCurrentTournament(null);
      } finally {
        setLoading(false);
      }
    };

    loadTournament();
  }, [slug, allTournaments]);

  const value = {
    currentTournament,
    allTournaments,
    loading,
    error,
    baseApiUrl: currentTournament?.baseApiUrl,
  };

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
};
