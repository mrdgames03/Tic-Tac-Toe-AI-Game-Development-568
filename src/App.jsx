import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GameBoard from './components/GameBoard';
import PlayerRegistration from './components/PlayerRegistration';
import Leaderboard from './components/Leaderboard';
import MainMenu from './components/MainMenu';
import { GameProvider } from './context/GameContext';
import './App.css';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Tic Tac Toe AI
              </h1>
              <p className="text-gray-300 text-lg">Challenge the AI and climb the leaderboard!</p>
            </motion.div>

            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<MainMenu />} />
                <Route path="/register" element={<PlayerRegistration />} />
                <Route path="/game" element={<GameBoard />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Routes>
            </AnimatePresence>
          </div>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;