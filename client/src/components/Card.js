import React from 'react';

const Card = ({ card, onDragStart, onDelete }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card)}
      className="bg-white p-3 rounded shadow-sm mb-2 cursor-move border hover:shadow"
    >
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium">{card.title}</p>
        <button
          onClick={() => onDelete(card._id)}
          className="text-gray-400 hover:text-red-500 text-xs ml-2"
        >
          ✕
        </button>
      </div>
      {card.dueDate && (
        <p className="text-xs text-gray-500 mt-1">
          Due: {new Date(card.dueDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default Card;
