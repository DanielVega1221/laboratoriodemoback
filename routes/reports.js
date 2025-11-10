const express = require('express');
const router = express.Router();
const ReportMetadata = require('../models/ReportMetadata');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// POST /api/reports/generate
router.post('/generate', async (req, res) => {
  try {
    const { orderId } = req.body;

    const metadata = new ReportMetadata({
      orderId,
      reportPdfUrl: `report-${orderId}.pdf`, // Demo: path simple
      generatedBy: req.user.id
    });
    
    await metadata.save();
    res.status(201).json(metadata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reports?orderId=
router.get('/', async (req, res) => {
  try {
    const { orderId } = req.query;
    const query = orderId ? { orderId } : {};
    
    const reports = await ReportMetadata.find(query)
      .populate('orderId')
      .sort({ generatedAt: -1 });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
