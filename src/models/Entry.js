import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true, min: 0 },
    note: { type: String, default: '' },
    timestamp: { type: Date, required: true }
  },
  { timestamps: true }
);

entrySchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model('Entry', entrySchema);


