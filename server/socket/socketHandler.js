module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Client joins a room named after the board id
    socket.on('board:join', (boardId) => {
      socket.join(boardId);
    });

    socket.on('board:leave', (boardId) => {
      socket.leave(boardId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
