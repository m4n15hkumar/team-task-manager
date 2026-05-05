const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  // UPGRADE: Asana-style status tracking
  statusTracking: {
    type: String,
    enum: ['On track', 'At risk', 'Off track'],
    default: 'On track'
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
