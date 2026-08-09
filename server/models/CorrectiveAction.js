import mongoose from 'mongoose';

const correctiveActionSchema = new mongoose.Schema({
  incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
  actionId: { type: String, unique: true, required: true },
  
  actionDescription: { type: String, required: true },
  actionType: { 
    type: String, 
    enum: ['immediate', 'short_term', 'long_term', 'preventive'], 
    required: true 
  },
  
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  priority: { type: String, enum: ['urgent', 'high', 'medium', 'low'], default: 'medium' },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed', 'overdue', 'verified'], 
    default: 'pending' 
  },
  
  targetDate: { type: Date, required: true },
  completedDate: Date,
  verificationDate: Date,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  evidence: [{
    filename: String,
    path: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  notes: String,
  cost: Number
}, { timestamps: true });

export default mongoose.model('CorrectiveAction', correctiveActionSchema);