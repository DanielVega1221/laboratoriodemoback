const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/orders?date=&status=
router.get('/', async (req, res) => {
  try {
    const { date, status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.scheduledAt = { $gte: startDate, $lt: endDate };
    }

    const orders = await Order.find(query)
      .populate('patientId')
      .populate('studies.protocolId')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('patientId')
      .populate('studies.protocolId');
    
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      createdBy: req.user.id
    });
    await order.save();
    
    const populated = await Order.findById(order._id)
      .populate('patientId')
      .populate('studies.protocolId');
    
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/orders/:id
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('patientId').populate('studies.protocolId');
    
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
