const express = require('express');
const router = express.Router();
const ProtocolTemplate = require('../models/ProtocolTemplate');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/protocols
router.get('/', async (req, res) => {
  try {
    const protocols = await ProtocolTemplate.find().sort({ name: 1 });
    res.json(protocols);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/protocols
router.post('/', async (req, res) => {
  try {
    const protocol = new ProtocolTemplate(req.body);
    await protocol.save();
    res.status(201).json(protocol);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Código de protocolo ya existe' });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/protocols/:id
router.put('/:id', async (req, res) => {
  try {
    const protocol = await ProtocolTemplate.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!protocol) {
      return res.status(404).json({ error: 'Protocolo no encontrado' });
    }
    
    res.json(protocol);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/protocols/:id
router.delete('/:id', async (req, res) => {
  try {
    const protocol = await ProtocolTemplate.findByIdAndDelete(req.params.id);
    
    if (!protocol) {
      return res.status(404).json({ error: 'Protocolo no encontrado' });
    }
    
    res.json({ message: 'Protocolo eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
