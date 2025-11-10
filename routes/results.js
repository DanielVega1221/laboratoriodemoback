const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// POST /api/results
router.post('/', async (req, res) => {
  try {
    const result = new Result({
      ...req.body,
      performedBy: req.user.id
    });
    await result.save();

    // Verificar si todos los estudios de la orden tienen resultados
    const order = await Order.findById(result.orderId);
    const allResults = await Result.find({ orderId: result.orderId });
    
    if (allResults.length >= order.studies.length) {
      order.status = 'completed';
      await order.save();
    } else if (order.status === 'pending') {
      order.status = 'in-process';
      await order.save();
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/results?patientId=&orderId=
router.get('/', async (req, res) => {
  try {
    const { patientId, orderId } = req.query;
    let query = {};

    if (patientId) query.patientId = patientId;
    if (orderId) query.orderId = orderId;

    const results = await Result.find(query)
      .populate('protocolId')
      .populate('orderId')
      .sort({ createdAt: -1 });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
