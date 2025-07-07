import React, { useState, useEffect } from 'react';
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
  
  const navigate = useNavigate();
  const { state, dispatch } = useGame();

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
    
    const aiMove = getAIMove(board, state.currentDifficulty);
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

  const recordGameResult = (result) => {
    dispatch({
      type: 'ADD_GAME_RESULT',
      payload: {
        playerName: state.currentPlayer.name,
        result,
        difficulty: state.currentDifficulty,
        timestamp: new Date().toISOString()
      }
    });
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
  };

  const changeDifficulty = (difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
    setShowDifficultySelector(false);
    resetGame();
  };

  if (!state.currentPlayer) {
    return null;
  }

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
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCoinFlip && (
          <CoinFlip 
            onFlipComplete={handleCoinFlipComplete}
            onSkip={skipCoinFlip}
          />
        )}
        
        {gameStatus !== 'playing' && (
          <GameResult
            status={gameStatus}
            playerSymbol={playerSymbol}
            aiSymbol={aiSymbol}
            onPlayAgain={resetGame}
            onHome={() => navigate('/')}
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