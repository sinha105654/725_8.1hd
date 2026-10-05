const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true
    },

    deadline: {
      type: Date,
      required: true
    },

    effortEstimate: {
      type: Number,
      min: 0
    },

    status: {
      type: String,
      enum: ['pending', 'complete', 'missed'],
      default: 'pending'
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Task', taskSchema);