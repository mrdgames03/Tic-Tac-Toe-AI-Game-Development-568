import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiRotateCcw } = FiIcons;

function CoinFlip({ onFlipComplete, onSkip }) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [playerChoice, setPlayerChoice] = useState(null);

  const flipCoin = (choice) => {
    setPlayerChoice(choice);
    setIsFlipping(true);
    setShowResult(false);
    
    // Simulate coin flip delay
    setTimeout(() => {
      const coinResult = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(coinResult);
      setIsFlipping(false);
      setShowResult(true);
      
      // Determine who starts
      const playerStarts = choice === coinResult;
      
      // Auto-proceed after showing result
      setTimeout(() => {
        onFlipComplete(playerStarts);
      }, 2500);
    }, 2000);
  };

  const resetFlip = () => {
    setResult(null);
    setShowResult(false);
    setPlayerChoice(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="max-w-md w-full bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Coin Flip</h2>
          <p className="text-white/90">Choose heads or tails to see who starts!</p>
        </div>

        <div className="p-6">
          {!playerChoice && !isFlipping && !showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <p className="text-white text-lg mb-6">
                Pick your side - winner goes first!
              </p>
              
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => flipCoin('heads')}
                  className="flex-1 p-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="text-4xl mb-2">👑</div>
                  <div>HEADS</div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => flipCoin('tails')}
                  className="flex-1 p-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="text-4xl mb-2">⚡</div>
                  <div>TAILS</div>
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSkip}
                className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Skip Coin Flip
              </motion.button>
            </motion.div>
          )}

          {/* Coin Animation */}
          <AnimatePresence>
            {isFlipping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ 
                    rotateY: [0, 1800],
                    y: [0, -50, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  className="inline-block text-8xl mb-4"
                >
                  🪙
                </motion.div>
                <p className="text-white text-lg">
                  You chose: <span className="font-bold capitalize text-yellow-400">{playerChoice}</span>
                </p>
                <p className="text-gray-300">Flipping coin...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {showResult && result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  className="text-8xl mb-4"
                >
                  {result === 'heads' ? '👑' : '⚡'}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Result: <span className="capitalize text-yellow-400">{result}</span>!
                  </h3>
                  
                  {playerChoice === result ? (
                    <div className="space-y-2">
                      <p className="text-green-400 text-lg font-medium">🎉 You won the flip!</p>
                      <p className="text-white">You get to go first (X)</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-red-400 text-lg font-medium">😔 AI won the flip!</p>
                      <p className="text-white">AI goes first (you are O)</p>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6"
                >
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resetFlip}
                      className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <SafeIcon icon={FiRotateCcw} className="text-sm" />
                      <span>Flip Again</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onFlipComplete(playerChoice === result)}
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
                    >
                      <SafeIcon icon={FiPlay} className="text-sm" />
                      <span>Start Game</span>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CoinFlip;