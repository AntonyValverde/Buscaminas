// src/components/Modal.js
import React from 'react';

const Modal = ({ onClose, score }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Game Over</h2>
        <p>Puntuación final: {score}</p>
        <button onClick={onClose}>Volver a jugar</button>
      </div>
    </div>
  );
};

export default Modal;
