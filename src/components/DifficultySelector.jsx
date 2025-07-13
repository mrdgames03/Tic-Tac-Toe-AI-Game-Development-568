import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiZap, FiTarget, FiBrain, FiClock } = FiIcons;

function DifficultySelector({ currentDifficulty, onSelect, onClose }) {
  const difficulties = [
    {
      id: 'easy',
      name: 'Easy',
      description: 'AI makes random moves',
      icon: FiZap,
      color: 'from-green-400 to-green-500',
      multiplier: '1x points'
    },
    {
      id: 'medium',
      name: 'Medium',
      description: 'AI plays strategically',
      icon: FiTarget,
      color: 'from-yellow-400 to-orange-500',
      multiplier: '2x points'
    },
    {
      id: 'hard',
      name: 'Hard',
      description: 'AI is unbeatable',
      icon: FiBrain,
      color: 'from-red-400 to-red-500',
      multiplier: '3x points'
    }
  ];

  const gameModes = [
    {
      id: 'timed',
      name: 'Timed Tiles XO',
      description: 'Time-based challenge! 3 seconds per tile',
      icon: FiClock,
      color: 'from-purple-400 to-pink-500',
      multiplier: '4x points'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="max-w-md w-full bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Select Game Mode</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="text-white text-xl" />
          </motion.button>
        </div>

        {/* Difficulty Options */}
        <div className="p-6 space-y-6">
          {/* Classic Mode Section */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Classic Mode</h4>
            <div className="space-y-3">
              {difficulties.map((difficulty, index) => (
                <motion.button
                  key={difficulty.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(difficulty.id)}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all text-left
                    ${currentDifficulty === difficulty.id
                      ? 'border-white/40 bg-white/10'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${difficulty.color}`}>
                      <SafeIcon icon={difficulty.icon} className="text-xl text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-white">{difficulty.name}</h4>
                        <span className="text-sm text-yellow-400 font-medium">
                          {difficulty.multiplier}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{difficulty.description}</p>
                    </div>
                    {currentDifficulty === difficulty.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 bg-green-400 rounded-full"
                      />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Special Modes Section */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Special Modes</h4>
            <div className="space-y-3">
              {gameModes.map((mode, index) => (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (difficulties.length + index) * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(mode.id)}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all text-left
                    ${currentDifficulty === mode.id
                      ? 'border-white/40 bg-white/10'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${mode.color}`}>
                      <SafeIcon icon={mode.icon} className="text-xl text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-white">{mode.name}</h4>
                        <span className="text-sm text-yellow-400 font-medium">
                          {mode.multiplier}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{mode.description}</p>
                    </div>
                    {currentDifficulty === mode.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 bg-green-400 rounded-full"
                      />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DifficultySelector;