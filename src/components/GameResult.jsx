import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrophy, FiX, FiMinus, FiPlay, FiHome, FiDatabase } = FiIcons;

function GameResult({ status, playerSymbol, aiSymbol, onPlayAgain, onHome, isSaving = false }) {
  const getResultConfig = () => {
    switch (status) {
      case 'win':
        return {
          icon: FiTrophy,
          title: 'Victory!',
          message: `Congratulations! You (${playerSymbol}) beat the AI (${aiSymbol})!`,
          color: 'from-green-400 to-emerald-500',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30'
        };
      case 'loss':
        return {
          icon: FiX,
          title: 'Defeat',
          message: `The AI (${aiSymbol}) won this time. You were ${playerSymbol}. Try again!`,
          color: 'from-red-400 to-red-500',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30'
        };
      case 'draw':
        return {
          icon: FiMinus,
          title: 'Draw',
          message: `Good game! It's a tie! You (${playerSymbol}) vs AI (${aiSymbol})`,
          color: 'from-yellow-400 to-orange-500',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30'
        };
      default:
        return {
          icon: FiPlay,
          title: 'Game Over',
          message: 'Game finished',
          color: 'from-gray-400 to-gray-500',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/30'
        };
    }
  };

  const config = getResultConfig();

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
        className={`
          max-w-md w-full p-8 rounded-2xl border shadow-2xl
          ${config.bgColor} ${config.borderColor}
          bg-gray-900/90 backdrop-blur-sm
        `}
      >
        <div className="text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
            className={`
              inline-flex p-4 rounded-full mb-6
              bg-gradient-to-r ${config.color}
            `}
          >
            <SafeIcon icon={config.icon} className="text-4xl text-white" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-3"
          >
            {config.title}
          </motion.h2>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-lg mb-8"
          >
            {config.message}
          </motion.p>

          {/* Saving State */}
          {isSaving && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 flex items-center justify-center space-x-2 text-blue-400"
            >
              <SafeIcon icon={FiDatabase} className="text-sm" />
              <span className="text-sm">Saving your result...</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"
              />
            </motion.div>
          )}

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHome}
              disabled={isSaving}
              className={`
                flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg 
                font-medium transition-colors flex items-center justify-center space-x-2
                ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <SafeIcon icon={FiHome} className="text-sm" />
              <span>Home</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlayAgain}
              disabled={isSaving}
              className={`
                flex-1 py-3 px-4 text-white rounded-lg font-medium transition-all
                flex items-center justify-center space-x-2
                bg-gradient-to-r ${config.color} hover:shadow-lg
                ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <SafeIcon icon={FiPlay} className="text-sm" />
              <span>Play Again</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default GameResult;