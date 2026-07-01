import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../api/axios';
import List from '../components/List';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

const Board = () => {
  const { id: boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');
  const socketRef = useRef(null);

  const fetchBoard = async () => {
    const { data } = await api.get(`/boards/${boardId}`);
    setBoard(data.board);
    setLists(data.lists);
    setCards(data.cards);
  };

  useEffect(() => {
    fetchBoard();

    // Connect socket and join this board's room for live updates
    const socket = io(SOCKET_URL);
    socketRef.current = socket;
    socket.emit('board:join', boardId);

    socket.on('card:created', (card) => {
      setCards((prev) => [...prev, card]);
    });
    socket.on('card:updated', (updated) => {
      setCards((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
    });
    socket.on('card:deleted', (cardId) => {
      setCards((prev) => prev.filter((c) => c._id !== cardId));
    });
    socket.on('list:created', (list) => {
      setLists((prev) => [...prev, list]);
    });
    socket.on('list:deleted', (listId) => {
      setLists((prev) => prev.filter((l) => l._id !== listId));
    });

    return () => {
      socket.emit('board:leave', boardId);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  const addList = async () => {
    if (!newListTitle.trim()) return;
    await api.post('/lists', { title: newListTitle, board: boardId, position: lists.length });
    setNewListTitle('');
    // Real-time echo handles the UI update via socket 'list:created'
  };

  const addCard = async (listId, title) => {
    await api.post('/cards', { title, list: listId, board: boardId, position: 0 });
  };

  const deleteCard = async (cardId) => {
    await api.delete(`/cards/${cardId}`);
  };

  // --- Drag & drop handlers (native HTML5 DnD) ---
  const handleDragStart = (e, card) => {
    e.dataTransfer.setData('cardId', card._id);
  };

  const handleDrop = async (e, listId) => {
    const cardId = e.dataTransfer.getData('cardId');
    if (!cardId) return;
    await api.put(`/cards/${cardId}`, { list: listId });
  };

  if (!board) return <p className="p-8">Loading board...</p>;

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="p-4 bg-white shadow flex items-center gap-4">
        <Link to="/dashboard" className="text-blue-600 text-sm">← Back</Link>
        <h1 className="text-xl font-bold">{board.title}</h1>
      </div>

      <div className="p-6 flex gap-4 overflow-x-auto">
        {lists.map((list) => (
          <List
            key={list._id}
            list={list}
            cards={cards.filter((c) => c.list === list._id)}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
          />
        ))}

        <div className="w-72 flex-shrink-0">
          <div className="flex gap-1">
            <input
              className="flex-1 border p-2 rounded text-sm"
              placeholder="+ Add another list"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addList()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
