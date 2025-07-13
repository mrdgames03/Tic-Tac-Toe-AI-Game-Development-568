import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrophy, FiArrowLeft, FiUser, FiTarget, FiAward, FiRefreshCw } = FiIcons;

function Leaderboard() {
  const navigate = useNavigate();
  const { state, refreshLeaderboard } = useGame();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh leaderboard when component mounts
  useEffect(() => {
    refreshLeaderboard();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshLeaderboard();
    setIsRefreshing(false);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getWinRate = (wins, gamesPlayed) => {
    return gamesPlayed > 0 ? ((wins / gamesPlayed) * 100).toFixed(1) : '0.0';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
              <SafeIcon icon={FiTrophy} className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
              <p className="text-gray-300">Top players ranked by score</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              disabled={isRefreshing}
            >
              <SafeIcon 
                icon={FiRefreshCw}
                className={`text-white text-xl ${isRefreshing ? 'animate-spin' : ''}`} 
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="text-white text-xl" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {state.isLoading && !isRefreshing && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-12 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg">Loading leaderboard data...</p>
        </div>
      )}

      {/* Leaderboard Content */}
      {!state.isLoading && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          {state.leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <SafeIcon icon={FiUser} className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No players yet</h3>
              <p className="text-gray-300 mb-6">Be the first to play and claim the top spot!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/game')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all"
              >
                Start Playing
              </motion.button>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {/* Table Header */}
              <div className="p-4 bg-white/5">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-300">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-3">Player</div>
                  <div className="col-span-2">Score</div>
                  <div className="col-span-2">Win Rate</div>
                  <div className="col-span-1">Wins</div>
                  <div className="col-span-1">Losses</div>
                  <div className="col-span-1">Draws</div>
                  <div className="col-span-1">Games</div>
                </div>
              </div>

              {/* Players */}
              {state.leaderboard.map((player, index) => (
                <motion.div
                  key={player.id || player.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    p-4 hover:bg-white/5 transition-colors
                    ${state.currentPlayer?.name === player.name ? 'bg-purple-500/20 border-l-4 border-purple-400' : ''}
                  `}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Rank */}
                    <div className="col-span-1">
                      <span className="text-lg font-bold text-white">
                        {getRankIcon(index + 1)}
                      </span>
                    </div>

                    {/* Player Name */}
                    <div className="col-span-3">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiUser} className="text-gray-400" />
                        <span className="font-medium text-white">
                          {player.name}
                          {state.currentPlayer?.name === player.name && (
                            <span className="ml-2 text-xs text-purple-400">(You)</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiAward} className="text-yellow-400 text-sm" />
                        <span className="font-bold text-yellow-400">{player.total_score || 0}</span>
                      </div>
                    </div>

                    {/* Win Rate */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiTarget} className="text-green-400 text-sm" />
                        <span className="text-green-400 font-medium">
                          {getWinRate(player.wins || 0, player.games_played || 0)}%
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="col-span-1 text-green-400 font-medium">{player.wins || 0}</div>
                    <div className="col-span-1 text-red-400 font-medium">{player.losses || 0}</div>
                    <div className="col-span-1 text-yellow-400 font-medium">{player.draws || 0}</div>
                    <div className="col-span-1 text-gray-300 font-medium">{player.games_played || 0}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Scoring Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-lg font-bold text-white mb-3">Scoring System</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-green-400 font-bold text-lg">Win</div>
            <div className="text-gray-300">3 points × difficulty</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-yellow-400 font-bold text-lg">Draw</div>
            <div className="text-gray-300">1 point × difficulty</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-red-400 font-bold text-lg">Loss</div>
            <div className="text-gray-300">0 points</div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          Difficulty multipliers: Easy (1x), Medium (2x), Hard (3x)
        </p>
      </motion.div>
    </motion.div>
  );
}

export default Leaderboard;