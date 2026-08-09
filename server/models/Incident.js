const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    // Basic Info
    incidentId: {
      type: String,
      required: [true, 'Incident ID is required'],
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['accident', 'near-miss', 'hazard', 'violation', 'other'],
      required: [true, 'Incident type is required']
    },

    // Classification
    category: {
      type: String,
      enum: [
        'fall-of-ground',
        'machinery-breakdown',
        'fire',
        'explosion',
        'electrical',
        'transportation',
        'drowning',
        'gas-leak',
        'personal-injury',
        'environmental',
        'other'
      ],
      required: [true, 'Category is required']
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: [true, 'Severity is required']
    },

    // Location & Time
    mineLocation: {
      type: String,
      required: [true, 'Mine location is required'],
      trim: true
    },
    department: {
      type: String,
      trim: true,
      default: 'General'
    },
    date: {
      type: Date,
      required: [true, 'Incident date is required'],
      default: Date.now
    },
    time: {
      type: String,
      trim: true
    },

    // People Involved
    reportedBy: {
      name: { type: String, required: true, trim: true },
      employeeId: { type: String, trim: true },
      designation: { type: String, trim: true },
      contactNumber: { type: String, trim: true }
    },
    personsInvolved: [
      {
        name: { type: String, trim: true },
        employeeId: { type: String, trim: true },
        role: { type: String, trim: true },
        injuryType: { type: String, trim: true },
        severity: {
          type: String,
          enum: ['none', 'minor', 'major', 'fatal'],
          default: 'none'
        }
      }
    ],

    // Root Cause & Description
    immediateCause: {
      type: String,
      trim: true
    },
    rootCause: {
      type: String,
      trim: true
    },

    // Corrective Action
    correctiveAction: {
      description: { type: String, trim: true },
      assignedTo: { type: String, trim: true },
      deadline: { type: Date },
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'overdue'],
        default: 'pending'
      },
      completedDate: { type: Date },
      remarks: { type: String, trim: true }
    },

    // Attachments
    attachments: [
      {
        filename: { type: String, trim: true },
        path: { type: String, trim: true },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],

    // DGMS / Compliance
    dgmsReportable: {
      type: Boolean,
      default: false
    },
    dgmsReference: {
      type: String,
      trim: true
    },

    // Metadata
    status: {
      type: String,
      enum: ['open', 'under-investigation', 'closed', 'reopened'],
      default: 'open'
    },
    reviewedBy: {
      name: { type: String, trim: true },
      designation: { type: String, trim: true },
      reviewDate: { type: Date }
    },

    // Audit fields
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true, // auto-manages createdAt & updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for faster analytics queries
incidentSchema.index({ date: -1, mineLocation: 1, category: 1, severity: 1 });
incidentSchema.index({ 'correctiveAction.status': 1 });

module.exports = mongoose.model('Incident', incidentSchema);