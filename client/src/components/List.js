import React, { useState } from 'react';
import Card from './Card';

const List = ({ list, cards, onDragStart, onDrop, onAddCard, onDeleteCard }) => {
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleAdd = () => {
    if (!newCardTitle.trim()) return;
    onAddCard(list._id, newCardTitle);
    setNewCardTitle('');
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, list._id)}
      className="bg-gray-200 rounded-lg p-3 w-72 flex-shrink-0"
    >
      <h3 className="font-semibold mb-3">{list.title}</h3>

      <div>
        {cards.map((card) => (
          <Card key={card._id} card={card} onDragStart={onDragStart} onDelete={onDeleteCard} />
        ))}
      </div>

      <div className="flex gap-1 mt-2">
        <input
          className="flex-1 border p-1 rounded text-sm"
          placeholder="+ Add card"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
      </div>
    </div>
  );
};

export default List;
