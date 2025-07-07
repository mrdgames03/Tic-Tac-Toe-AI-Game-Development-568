import React from 'react';
import { motion } from 'framer-motion';

function GameCell({ value, onClick, isWinning, disabled }) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled || value}
      className={`
        w-20 h-20 rounded-xl border-2 font-bold text-3xl transition-all duration-300
        ${isWinning 
          ? 'border-yellow-400 bg-yellow-400/30 shadow-lg shadow-yellow-400/50' 
          : 'border-white/30 bg-white/10 hover:bg-white/20'
        }
        ${disabled || value ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {value && (
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20 
          }}
          className={`
            ${value === 'X' ? 'text-blue-400' : 'text-red-400'}
            ${isWinning ? 'text-yellow-300' : ''}
          `}
        >
          {value}
        </motion.span>
      )}
    </motion.button>
  );
}

export default GameCell;