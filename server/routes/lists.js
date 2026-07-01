const express = require('express');
const List = require('../models/List');
const protect = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/lists
router.post('/', protect, async (req, res) => {
  try {
    const { title, board, position } = req.body;
    const list = await List.create({ title, board, position });

    const io = req.app.get('io');
    io.to(board).emit('list:created', list);

    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/lists/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const list = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });

    const io = req.app.get('io');
    io.to(String(list.board)).emit('list:updated', list);

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/lists/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const list = await List.findByIdAndDelete(req.params.id);

    const io = req.app.get('io');
    io.to(String(list.board)).emit('list:deleted', list._id);

    res.json({ message: 'List deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
