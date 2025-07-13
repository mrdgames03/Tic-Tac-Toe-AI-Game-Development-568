import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import DifficultySelector from './DifficultySelector';
import GameCell from './GameCell';
import GameResult from './GameResult';
import CoinFlip from './CoinFlip';
import { checkWinner, getAIMove } from '../utils/gameLogic';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiRotateCcw, FiSettings } = FiIcons;

function GameBoard() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'win', 'loss', 'draw'
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [showCoinFlip, setShowCoinFlip] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState('X'); // X or O
  const [aiSymbol, setAiSymbol] = useState('O'); // O or X
  const [isSavingResult, setIsSavingResult] = useState(false);

  // Global timer states for Timed Tiles mode
  const [globalTimeLeft, setGlobalTimeLeft] = useState(2);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const globalTimerRef = useRef(null);

  const navigate = useNavigate();
  const { state, dispatch, saveGameResult } = useGame();

  useEffect(() => {
    if (!state.currentPlayer) {
      navigate('/register');
      return;
    }
  }, [state.currentPlayer, navigate]);

  useEffect(() => {
    if (!isPlayerTurn && gameStatus === 'playing') {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, gameStatus]);

  // Global timer effect for Timed Tiles mode
  useEffect(() => {
    if (state.currentDifficulty === 'timed' && isPlayerTurn && gameStatus === 'playing' && !showCoinFlip) {
      startGlobalTimer();
    } else {
      stopGlobalTimer();
    }

    return () => stopGlobalTimer();
  }, [isPlayerTurn, gameStatus, state.currentDifficulty, showCoinFlip]);

  const startGlobalTimer = () => {
    setGlobalTimeLeft(2);
    setIsTimerActive(true);
    
    globalTimerRef.current = setInterval(() => {
      setGlobalTimeLeft(prev => {
        if (prev <= 0.1) {
          // Time's up - pass turn to AI
          setIsPlayerTurn(false);
          setIsTimerActive(false);
          return 0;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);
  };

  const stopGlobalTimer = () => {
    if (globalTimerRef.current) {
      clearInterval(globalTimerRef.current);
      globalTimerRef.current = null;
    }
    setIsTimerActive(false);
  };

  const handleCoinFlipComplete = (playerWon) => {
    setShowCoinFlip(false);
    if (playerWon) {
      // Player goes first - player is X, AI is O
      setPlayerSymbol('X');
      setAiSymbol('O');
      setIsPlayerTurn(true);
    } else {
      // AI goes first - AI is X, player is O
      setPlayerSymbol('O');
      setAiSymbol('X');
      setIsPlayerTurn(false);
    }
  };

  const skipCoinFlip = () => {
    setShowCoinFlip(false);
    // Default: player goes first
    setPlayerSymbol('X');
    setAiSymbol('O');
    setIsPlayerTurn(true);
  };

  const makeAIMove = async () => {
    setIsThinking(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const aiMove = getAIMove(board, state.currentDifficulty, aiSymbol);
    if (aiMove !== -1) {
      const newBoard = [...board];
      newBoard[aiMove] = aiSymbol;
      setBoard(newBoard);

      const result = checkWinner(newBoard);
      if (result.winner) {
        setWinner(result.winner);
        setWinningLine(result.line || []);
        setGameStatus(result.winner === aiSymbol ? 'loss' : 'win');
        recordGameResult(result.winner === aiSymbol ? 'loss' : 'win');
      } else if (result.isDraw) {
        setGameStatus('draw');
        recordGameResult('draw');
      } else {
        setIsPlayerTurn(true);
      }
    }
    setIsThinking(false);
  };

  const handleCellClick = (index) => {
    if (board[index] || !isPlayerTurn || gameStatus !== 'playing') return;

    // Stop the global timer when player makes a move
    if (state.currentDifficulty === 'timed') {
      stopGlobalTimer();
    }

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line || []);
      setGameStatus(result.winner === playerSymbol ? 'win' : 'loss');
      recordGameResult(result.winner === playerSymbol ? 'win' : 'loss');
    } else if (result.isDraw) {
      setGameStatus('draw');
      recordGameResult('draw');
    } else {
      setIsPlayerTurn(false);
    }
  };

  const recordGameResult = async (result) => {
    // Update local state first
    dispatch({
      type: 'ADD_GAME_RESULT',
      payload: {
        playerName: state.currentPlayer.name,
        result,
        difficulty: state.currentDifficulty,
        timestamp: new Date().toISOString()
      }
    });

    // Then save to Supabase
    setIsSavingResult(true);
    await saveGameResult(
      state.currentPlayer.name,
      result,
      state.currentDifficulty
    );
    setIsSavingResult(false);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setGameStatus('playing');
    setWinner(null);
    setWinningLine([]);
    setShowCoinFlip(true);
    // Reset to default symbols
    setPlayerSymbol('X');
    setAiSymbol('O');
    setIsPlayerTurn(true);
    setGlobalTimeLeft(2);
    stopGlobalTimer();
  };

  const changeDifficulty = (difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
    setShowDifficultySelector(false);
    resetGame();
  };

  if (!state.currentPlayer) {
    return null;
  }

  const getTimerColor = () => {
    if (globalTimeLeft >= 1.5) return 'bg-green-400';
    if (globalTimeLeft >= 0.8) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {state.currentPlayer.name} vs AI
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span className="capitalize">Difficulty: {state.currentDifficulty}</span>
              <span>You are: <span className="font-bold text-blue-400">{playerSymbol}</span></span>
              <span>AI is: <span className="font-bold text-red-400">{aiSymbol}</span></span>
            </div>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDifficultySelector(true)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiSettings} className="text-white text-xl" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiRotateCcw} className="text-white text-xl" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiHome} className="text-white text-xl" />
            </motion.button>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center">
          {gameStatus === 'playing' && (
            <motion.p
              key={isPlayerTurn ? 'player' : 'ai'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-medium text-white"
            >
              {isPlayerTurn ? (
                `Your turn (${playerSymbol})`
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>AI thinking ({aiSymbol})</span>
                  {isThinking && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  )}
                </span>
              )}
            </motion.p>
          )}
        </div>

        {/* Global Timer for Timed Mode */}
        {state.currentDifficulty === 'timed' && isTimerActive && gameStatus === 'playing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 text-center"
          >
            <div className="relative w-32 h-32 mx-auto">
              {/* Circular Timer Background */}
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-600"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  className={globalTimeLeft >= 1.5 ? 'text-green-400' : globalTimeLeft >= 0.8 ? 'text-yellow-400' : 'text-red-400'}
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={`${(globalTimeLeft / 2) * 100}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  initial={{ strokeDasharray: "100, 100" }}
                  animate={{ strokeDasharray: `${(globalTimeLeft / 2) * 100}, 100` }}
                  transition={{ duration: 0.1 }}
                />
              </svg>
              {/* Timer Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${globalTimeLeft >= 1.5 ? 'text-green-400' : globalTimeLeft >= 0.8 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {globalTimeLeft.toFixed(1)}s
                </span>
              </div>
            </div>
            <p className="text-white text-sm mt-2">Make your move quickly!</p>
          </motion.div>
        )}
      </div>

      {/* Game Board */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {board.map((cell, index) => (
            <GameCell
              key={index}
              value={cell}
              onClick={() => handleCellClick(index)}
              isWinning={winningLine.includes(index)}
              disabled={!isPlayerTurn || gameStatus !== 'playing'}
              isTimed={state.currentDifficulty === 'timed'}
            />
          ))}
        </div>

        {/* Timer Instructions for Timed Mode */}
        {state.currentDifficulty === 'timed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg text-center"
          >
            <p className="text-purple-300">
              <span className="font-bold">Timed Tiles Mode:</span> You have 2 seconds to make your move! 
              If time runs out, your turn is skipped and the AI plays.
            </p>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCoinFlip && (
          <CoinFlip onFlipComplete={handleCoinFlipComplete} onSkip={skipCoinFlip} />
        )}
        {gameStatus !== 'playing' && (
          <GameResult
            status={gameStatus}
            playerSymbol={playerSymbol}
            aiSymbol={aiSymbol}
            onPlayAgain={resetGame}
            onHome={() => navigate('/')}
            isSaving={isSavingResult}
          />
        )}
        {showDifficultySelector && (
          <DifficultySelector
            currentDifficulty={state.currentDifficulty}
            onSelect={changeDifficulty}
            onClose={() => setShowDifficultySelector(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default GameBoard;