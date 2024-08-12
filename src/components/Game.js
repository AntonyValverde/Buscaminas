// src/components/Game.js
import React, { useState } from 'react';
import Board from './Board';
import Modal from './Modal';

const createEmptyBoard = (rows, cols) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      neighboringMines: 0,
      isRevealed: false,
      isFlagged: false,
    }))
  );
};

const plantMines = (board, mineCount) => {
  let planted = 0;
  while (planted < mineCount) {
    const row = Math.floor(Math.random() * board.length);
    const col = Math.floor(Math.random() * board[0].length);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      planted++;
    }
  }
};

const calculateNeighbors = (board) => {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],         [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col].isMine) continue;
      let mines = 0;
      directions.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[row].length) {
          if (board[newRow][newCol].isMine) {
            mines++;
          }
        }
      });
      board[row][col].neighboringMines = mines;
    }
  }
};

const revealAllMines = (board) => {
  return board.map(row =>
    row.map(cell => ({
      ...cell,
      isRevealed: cell.isMine ? true : cell.isRevealed
    }))
  );
};

const revealCell = (board, x, y) => {
  const cell = board[x][y];
  if (cell.isRevealed || cell.isFlagged) return;
  cell.isRevealed = true;

  if (cell.neighboringMines === 0 && !cell.isMine) {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],         [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
    directions.forEach(([dx, dy]) => {
      const newRow = x + dx;
      const newCol = y + dy;
      if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length) {
        revealCell(board, newRow, newCol);
      }
    });
  }
};

const Game = () => {
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [bombCount, setBombCount] = useState(0);
  const [flagsCount, setFlagsCount] = useState(0);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isFlagMode, setIsFlagMode] = useState(false);

  const initializeBoard = (rows, cols, mines) => {
    let newBoard = createEmptyBoard(rows, cols);
    plantMines(newBoard, mines);
    calculateNeighbors(newBoard);
    setBoard(newBoard);
    setBombCount(mines);
    setFlagsCount(0);
    setGameOver(false);
    setScore(0);
    setShowModal(false);
  };

  const handleClick = (row, col) => {
    if (gameOver) return;

    const newBoard = [...board];
    const cell = newBoard[row][col];

    if (isFlagMode) {
      handleRightClick(null, row, col);
    } else {
      if (cell.isMine) {
        const revealedBoard = revealAllMines(newBoard);
        setBoard(revealedBoard);
        setGameOver(true);
        setShowModal(true);
      } else {
        revealCell(newBoard, row, col);
        setScore(prevScore => prevScore + 1);
        setBoard(newBoard);
      }
    }
  };

  const handleRightClick = (e, row, col) => {
    if (e) e.preventDefault();
    if (gameOver) return;

    const newBoard = [...board];
    const cell = newBoard[row][col];

    if (!cell.isRevealed) {
      if (cell.isFlagged) {
        setFlagsCount(flagsCount - 1);
      } else {
        setFlagsCount(flagsCount + 1);
        if (!cell.isMine) {
          const revealedBoard = revealAllMines(newBoard);
          setBoard(revealedBoard);
          setGameOver(true);
          setShowModal(true);
          return;
        }
      }
      cell.isFlagged = !cell.isFlagged;
      setBoard(newBoard);
    }
  };

  const handleReset = () => {
    initializeBoard(10, 10, 15);
  };

  const toggleFlagMode = () => {
    setIsFlagMode(!isFlagMode);
  };

  return (
    <div>
      <div className="controls">
        <button onClick={handleReset}>Iniciar juego</button>
        <button onClick={toggleFlagMode}>
          {isFlagMode ? "Modo Banderas Activo" : "Modo Banderas Inactivo"}
        </button>
      </div>
      <div className="info">
        <p>🚩 Bombas restantes: {bombCount - flagsCount}</p>
        <p>🔢 Puntuación: {score}</p>
      </div>
      <Board board={board} onClick={handleClick} onContextMenu={handleRightClick} />
      {showModal && (
        <Modal onClose={handleReset} score={score} />
      )}
    </div>
  );
};

export default Game;
