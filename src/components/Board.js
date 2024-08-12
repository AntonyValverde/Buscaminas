// src/components/Board.js
import React from 'react';
import Cell from './Cell';

const Board = ({ board, onClick, onContextMenu }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            onClick={() => onClick(rowIndex, colIndex)}
            onContextMenu={(e) => onContextMenu(e, rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default Board;
