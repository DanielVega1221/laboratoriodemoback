const mongoose = require('mongoose');

const studySchema = new mongoose.Schema({
  protocolCode: String,
  protocolId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProtocolTemplate' },
  displayName: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studies: [studySchema],
  obraSocial: String,
  authNumber: String,
  authorized: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['pending', 'in-process', 'completed'], 
    default: 'pending' 
  },
  sampleTaken: { type: Boolean, default: false },
  scheduledAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
