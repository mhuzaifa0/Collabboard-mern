const express = require('express');
const Board = require('../models/Board');
const List = require('../models/List');
const Card = require('../models/Card');
const protect = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/boards  (all boards owned by or shared with the user)
router.get('/', protect, async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/boards
router.post('/', protect, async (req, res) => {
  try {
    const { title } = req.body;
    const board = await Board.create({ title, owner: req.user.id, members: [req.user.id] });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/boards/:id  (board + its lists + cards)
router.get('/:id', protect, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const lists = await List.find({ board: board._id }).sort('position');
    const cards = await Card.find({ board: board._id }).sort('position');

    res.json({ board, lists, cards });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/boards/:id/invite  (add a member by email)
router.post('/:id/invite', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const { email } = req.body;
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!board.members.includes(user._id)) {
      board.members.push(user._id);
      await board.save();
    }

    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
