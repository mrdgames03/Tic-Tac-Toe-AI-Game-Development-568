import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiArrowLeft, FiCheck, FiLoader } = FiIcons;

function PlayerRegistration() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { state, registerPlayer } = useGame();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    if (name.trim().length > 20) {
      setError('Name must be less than 20 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const success = await registerPlayer(name.trim());
      
      if (success) {
        navigate('/game');
      } else {
        setError(state.error || 'Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex p-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mb-4">
            <SafeIcon icon={FiUser} className="text-3xl text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Player Registration</h2>
          <p className="text-gray-300">Enter your name to start playing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Player Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
              maxLength={20}
              disabled={isSubmitting}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </div>

          {state.currentPlayer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
            >
              <p className="text-green-400 text-sm">
                Current player: <span className="font-medium">{state.currentPlayer.name}</span>
              </p>
            </motion.div>
          )}

          <div className="flex space-x-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              disabled={isSubmitting}
            >
              <SafeIcon icon={FiArrowLeft} className="text-sm" />
              <span>Back</span>
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : (
                <SafeIcon icon={FiCheck} className="text-sm" />
              )}
              <span>{isSubmitting ? 'Registering...' : 'Register'}</span>
            </motion.button>
          </div>
        </form>

        {/* Debug info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-800 rounded text-xs text-gray-400">
            <p>Debug: Loading = {state.isLoading ? 'true' : 'false'}</p>
            <p>Debug: Error = {state.error || 'none'}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default PlayerRegistration;