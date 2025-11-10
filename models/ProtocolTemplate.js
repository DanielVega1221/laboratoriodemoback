const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  unit: { type: String, default: '' },
  type: { type: String, enum: ['number', 'text', 'select'], default: 'text' },
  reference: {
    low: Number,
    high: Number
  },
  options: [String] // Para type='select'
}, { _id: false });

const protocolTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  fields: [fieldSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProtocolTemplate', protocolTemplateSchema);
