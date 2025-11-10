const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  protocolId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProtocolTemplate', required: true },
  values: { type: mongoose.Schema.Types.Mixed, required: true }, // key-value pairs
  comments: String,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
