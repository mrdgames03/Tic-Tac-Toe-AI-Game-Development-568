// Game logic utilities for Tic Tac Toe

export function checkWinner(board) {
  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (const line of winningLines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line, isDraw: false };
    }
  }

  const isDraw = board.every(cell => cell !== null);
  return { winner: null, line: null, isDraw };
}

export function getAIMove(board, difficulty, aiSymbol = 'O') {
  const availableMoves = board.map((cell, index) => cell === null ? index : null)
                            .filter(val => val !== null);

  if (availableMoves.length === 0) return -1;

  switch (difficulty) {
    case 'easy':
      return getRandomMove(availableMoves);
    case 'medium':
      return getMediumMove(board, availableMoves, aiSymbol);
    case 'hard':
      return getHardMove(board, availableMoves, aiSymbol);
    default:
      return getRandomMove(availableMoves);
  }
}

function getRandomMove(availableMoves) {
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function getMediumMove(board, availableMoves, aiSymbol) {
  // 70% chance to play optimally, 30% chance to play randomly
  if (Math.random() < 0.7) {
    const optimalMove = getOptimalMove(board, availableMoves, aiSymbol);
    return optimalMove !== -1 ? optimalMove : getRandomMove(availableMoves);
  }
  return getRandomMove(availableMoves);
}

function getHardMove(board, availableMoves, aiSymbol) {
  const optimalMove = getOptimalMove(board, availableMoves, aiSymbol);
  return optimalMove !== -1 ? optimalMove : getRandomMove(availableMoves);
}

function getOptimalMove(board, availableMoves, aiSymbol) {
  const playerSymbol = aiSymbol === 'X' ? 'O' : 'X';

  // Check if AI can win
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = aiSymbol;
    if (checkWinner(testBoard).winner === aiSymbol) {
      return move;
    }
  }

  // Check if AI needs to block player from winning
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = playerSymbol;
    if (checkWinner(testBoard).winner === playerSymbol) {
      return move;
    }
  }

  // Strategic moves priority
  const strategicMoves = [
    // Center
    4,
    // Corners
    0, 2, 6, 8,
    // Edges
    1, 3, 5, 7
  ];

  for (const move of strategicMoves) {
    if (availableMoves.includes(move)) {
      return move;
    }
  }

  return -1;
}

// Minimax algorithm for unbeatable AI (alternative implementation)
export function minimaxMove(board, aiSymbol = 'O') {
  const availableMoves = board.map((cell, index) => cell === null ? index : null)
                            .filter(val => val !== null);

  let bestScore = -Infinity;
  let bestMove = -1;

  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = aiSymbol;
    const score = minimax(testBoard, 0, false, aiSymbol);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function minimax(board, depth, isMaximizing, aiSymbol) {
  const playerSymbol = aiSymbol === 'X' ? 'O' : 'X';
  const result = checkWinner(board);
  
  if (result.winner === aiSymbol) return 10 - depth;
  if (result.winner === playerSymbol) return depth - 10;
  if (result.isDraw) return 0;

  const availableMoves = board.map((cell, index) => cell === null ? index : null)
                            .filter(val => val !== null);

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of availableMoves) {
      const testBoard = [...board];
      testBoard[move] = aiSymbol;
      const score = minimax(testBoard, depth + 1, false, aiSymbol);
      bestScore = Math.max(score, bestScore);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of availableMoves) {
      const testBoard = [...board];
      testBoard[move] = playerSymbol;
      const score = minimax(testBoard, depth + 1, true, aiSymbol);
      bestScore = Math.min(score, bestScore);
    }
    return bestScore;
  }
}