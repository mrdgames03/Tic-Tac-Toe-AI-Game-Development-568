import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiUser, FiTrophy, FiSettings } = FiIcons;

function MainMenu() {
  const navigate = useNavigate();
  const { state } = useGame();

  const menuItems = [
    {
      icon: FiPlay,
      title: 'Play Game',
      description: 'Challenge the AI',
      action: () => navigate(state.currentPlayer ? '/game' : '/register'),
      color: 'from-green-400 to-blue-500'
    },
    {
      icon: FiUser,
      title: 'Player Registration',
      description: 'Set your name',
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
      className="max-w-2xl mx-auto"
    >
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

      <div className="grid gap-6">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.title}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={item.action}
            className={`w-full p-6 bg-gradient-to-r ${item.color} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-left group`}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
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
    </motion.div>
  );
}

export default MainMenu;