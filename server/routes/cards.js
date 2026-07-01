const express = require('express');
const Card = require('../models/Card');
const protect = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/cards
router.post('/', protect, async (req, res) => {
  try {
    const card = await Card.create(req.body);

    const io = req.app.get('io');
    io.to(String(card.board)).emit('card:created', card);

    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/cards/:id  (also used for drag & drop moves)
router.put('/:id', protect, async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });

    const io = req.app.get('io');
    io.to(String(card.board)).emit('card:updated', card);

    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/cards/:id/comments
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    card.comments.push({ user: req.user.id, text: req.body.text });
    await card.save();

    const io = req.app.get('io');
    io.to(String(card.board)).emit('card:updated', card);

    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/cards/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);

    const io = req.app.get('io');
    io.to(String(card.board)).emit('card:deleted', card._id);

    res.json({ message: 'Card deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
