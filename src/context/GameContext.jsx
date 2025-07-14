import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getLeaderboard, createOrUpdatePlayer, recordGameResult } from '../utils/supabaseService';
import supabase from '../lib/supabase';

const GameContext = createContext();

const initialState = {
  currentPlayer: null,
  gameHistory: [],
  leaderboard: [],
  currentDifficulty: 'medium',
  isLoading: false,
  error: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_PLAYER':
      return { ...state, currentPlayer: action.payload, isLoading: false };
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload, isLoading: false };
    case 'ADD_GAME_RESULT':
      const newHistory = [...state.gameHistory, action.payload];
      return { ...state, gameHistory: newHistory };
    case 'SET_DIFFICULTY':
      return { ...state, currentDifficulty: action.payload };
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load initial data from localStorage (for fallback)
  useEffect(() => {
    const savedData = localStorage.getItem('ticTacToeData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
    
    // Fetch leaderboard from Supabase
    fetchLeaderboard();
  }, []);

  // Save data to localStorage as backup
  useEffect(() => {
    localStorage.setItem('ticTacToeData', JSON.stringify(state));
  }, [state]);

  // Fetch leaderboard data from Supabase
  const fetchLeaderboard = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const leaderboardData = await getLeaderboard();
      dispatch({ type: 'SET_LEADERBOARD', payload: leaderboardData });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load leaderboard' });
    }
  };

  // Register player
  const registerPlayer = async (name) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      console.log('Registering player:', name);
      const player = await createOrUpdatePlayer(name);
      
      if (player) {
        console.log('Player registered successfully:', player);
        dispatch({ type: 'SET_PLAYER', payload: player });
        return true;
      } else {
        console.error('Failed to register player - no player returned');
        dispatch({ type: 'SET_ERROR', payload: 'Failed to register player' });
        return false;
      }
    } catch (error) {
      console.error('Error registering player:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to register player: ' + error.message });
      return false;
    }
  };

  // Record game result
  const saveGameResult = async (playerName, result, difficulty) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const success = await recordGameResult(playerName, result, difficulty);
      if (success) {
        dispatch({
          type: 'ADD_GAME_RESULT',
          payload: {
            playerName,
            result,
            difficulty,
            timestamp: new Date().toISOString()
          }
        });
        // Refresh leaderboard
        fetchLeaderboard();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving game result:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save game result' });
      return false;
    }
  };

  // Provider value with enhanced functionality
  const value = {
    state,
    dispatch,
    registerPlayer,
    saveGameResult,
    refreshLeaderboard: fetchLeaderboard
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}