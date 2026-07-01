import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState('');
  const { user, logout } = useAuth();

  const fetchBoards = async () => {
    const { data } = await api.get('/boards');
    setBoards(data);
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const createBoard = async () => {
    if (!title.trim()) return;
    await api.post('/boards', { title });
    setTitle('');
    fetchBoards();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Hi, {user?.name} 👋</h1>
        <button onClick={logout} className="text-sm text-red-500">Logout</button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          className="border p-2 rounded flex-1 max-w-xs"
          placeholder="New board title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={createBoard} className="bg-blue-600 text-white px-4 py-2 rounded">
          + Create Board
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {boards.map((board) => (
          <Link
            key={board._id}
            to={`/board/${board._id}`}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="font-semibold">{board.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
