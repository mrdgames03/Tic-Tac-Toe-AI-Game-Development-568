import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiUser, FiTrophy, FiClock, FiZap, FiBrain } = FiIcons;

function MainMenu() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();

  const handlePlayGame = (difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
    navigate(state.currentPlayer ? '/game' : '/register');
  };

  const gameModes = [
    {
      icon: FiClock,
      title: 'Timed Tiles XO',
      description: 'Race against time! 2 seconds per move or turn skipped',
      difficulty: 'timed',
      color: 'from-purple-500 to-pink-500',
      highlight: true,
      points: '4x Points'
    },
    {
      icon: FiZap,
      title: 'Classic Mode - Easy',
      description: 'Play against a basic AI opponent',
      difficulty: 'easy',
      color: 'from-green-400 to-emerald-500',
      points: '1x Points'
    },
    {
      icon: FiPlay,
      title: 'Classic Mode - Medium',
      description: 'Face a more strategic AI',
      difficulty: 'medium',
      color: 'from-blue-400 to-indigo-500',
      points: '2x Points'
    },
    {
      icon: FiBrain,
      title: 'Classic Mode - Hard',
      description: 'Challenge an unbeatable AI',
      difficulty: 'hard',
      color: 'from-red-400 to-red-500',
      points: '3x Points'
    }
  ];

  const menuItems = [
    {
      icon: FiUser,
      title: 'Player Profile',
      description: 'Set or change your name',
      action: () => navigate('/register'),
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: FiTrophy,
      title: 'Leaderboard',
      description: 'View top players',
      action: () => navigate('/leaderboard'),
      color: 'from-yellow-400 to-orange-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Welcome Message */}
      {state.currentPlayer && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
        >
          <p className="text-white text-lg">
            Welcome back, <span className="font-bold text-yellow-400">{state.currentPlayer.name}</span>!
          </p>
        </motion.div>
      )}

      {/* Game Modes Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Game Modes</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {gameModes.map((mode, index) => (
            <motion.button
              key={mode.difficulty}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePlayGame(mode.difficulty)}
              className={`w-full p-6 rounded-xl text-left relative overflow-hidden transition-all duration-300 ${
                mode.highlight
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {/* New Mode Badge */}
              {mode.highlight && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 text-xs font-bold bg-yellow-400 text-purple-900 rounded-full">
                    NEW!
                  </span>
                </div>
              )}
              
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${mode.highlight ? 'bg-white/20' : 'bg-white/10'}`}>
                  <SafeIcon icon={mode.icon} className="text-2xl text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{mode.title}</h3>
                  <p className="text-white/80 text-sm mb-2">{mode.description}</p>
                  <span className="text-xs font-medium px-2 py-1 bg-white/20 rounded-full text-white">
                    {mode.points}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Other Menu Items */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Player Options</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.title}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (gameModes.length + index) * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={item.action}
              className="w-full p-6 bg-white/10 hover:bg-white/20 rounded-xl text-left transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <SafeIcon icon={item.icon} className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-white/80">{item.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default MainMenu;