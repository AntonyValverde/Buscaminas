// src/components/Cell.js
import React from 'react';

const Cell = ({ value, onClick, onContextMenu }) => {
  const getValue = () => {
    if (!value.isRevealed) {
      return value.isFlagged ? "🚩" : null;
    }
    if (value.isMine) {
      return "💣";
    }
    if (value.neighboringMines === 0) {
      return null;
    }
    return value.neighboringMines;
  };

  return (
    <div 
      className={`cell ${value.isRevealed ? "" : "hidden"}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {getValue()}
    </div>
  );
};

export default Cell;
