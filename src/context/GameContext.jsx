import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

const initialState = {
  currentPlayer: null,
  gameHistory: [],
  leaderboard: [],
  currentDifficulty: 'medium'
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_PLAYER':
      return { ...state, currentPlayer: action.payload };
    
    case 'ADD_GAME_RESULT':
      const newHistory = [...state.gameHistory, action.payload];
      const updatedLeaderboard = updateLeaderboard(state.leaderboard, action.payload);
      return {
        ...state,
        gameHistory: newHistory,
        leaderboard: updatedLeaderboard
      };
    
    case 'SET_DIFFICULTY':
      return { ...state, currentDifficulty: action.payload };
    
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

function updateLeaderboard(leaderboard, gameResult) {
  const existingPlayer = leaderboard.find(p => p.name === gameResult.playerName);
  
  if (existingPlayer) {
    const updated = leaderboard.map(player => {
      if (player.name === gameResult.playerName) {
        return {
          ...player,
          gamesPlayed: player.gamesPlayed + 1,
          wins: player.wins + (gameResult.result === 'win' ? 1 : 0),
          losses: player.losses + (gameResult.result === 'loss' ? 1 : 0),
          draws: player.draws + (gameResult.result === 'draw' ? 1 : 0),
          score: calculateScore(
            player.wins + (gameResult.result === 'win' ? 1 : 0),
            player.losses + (gameResult.result === 'loss' ? 1 : 0),
            player.draws + (gameResult.result === 'draw' ? 1 : 0),
            gameResult.difficulty
          )
        };
      }
      return player;
    });
    return updated.sort((a, b) => b.score - a.score);
  } else {
    const newPlayer = {
      name: gameResult.playerName,
      gamesPlayed: 1,
      wins: gameResult.result === 'win' ? 1 : 0,
      losses: gameResult.result === 'loss' ? 1 : 0,
      draws: gameResult.result === 'draw' ? 1 : 0,
      score: calculateScore(
        gameResult.result === 'win' ? 1 : 0,
        gameResult.result === 'loss' ? 1 : 0,
        gameResult.result === 'draw' ? 1 : 0,
        gameResult.difficulty
      )
    };
    return [...leaderboard, newPlayer].sort((a, b) => b.score - a.score);
  }
}

function calculateScore(wins, losses, draws, difficulty) {
  const difficultyMultiplier = { easy: 1, medium: 2, hard: 3 };
  return (wins * 3 + draws * 1) * difficultyMultiplier[difficulty];
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

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
  }, []);

  useEffect(() => {
    localStorage.setItem('ticTacToeData', JSON.stringify(state));
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
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