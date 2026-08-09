const Incident = require('../models/Incident');
const asyncHandler = require('../utils/asyncHandler');

// ==========================================
// 1. CREATE NEW INCIDENT
// ==========================================
const createIncident = asyncHandler(async (req, res) => {
  const {
    incidentId,
    title,
    description,
    type,
    category,
    severity,
    mineLocation,
    department,
    date,
    time,
    reportedBy,
    personsInvolved,
    immediateCause,
    rootCause,
    correctiveAction,
    dgmsReportable,
    dgmsReference
  } = req.body;

  // Check for duplicate incident ID
  const existing = await Incident.findOne({ incidentId });
  if (existing) {
    res.status(400);
    throw new Error('Incident ID already exists');
  }

  const incident = await Incident.create({
    incidentId,
    title,
    description,
    type,
    category,
    severity,
    mineLocation,
    department,
    date,
    time,
    reportedBy,
    personsInvolved,
    immediateCause,
    rootCause,
    correctiveAction,
    dgmsReportable,
    dgmsReference
  });

  res.status(201).json({
    success: true,
    message: 'Incident reported successfully',
    data: incident
  });
});

// ==========================================
// 2. GET ALL INCIDENTS (with filters)
// ==========================================
const getAllIncidents = asyncHandler(async (req, res) => {
  const {
    type,
    category,
    severity,
    mineLocation,
    status,
    startDate,
    endDate,
    search,
    page = 1,
    limit = 10
  } = req.query;

  // Build filter object
  const filter = {};

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (severity) filter.severity = severity;
  if (mineLocation) filter.mineLocation = mineLocation;
  if (status) filter.status = status;

  // Date range filter
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  // Text search on title/description
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const incidents = await Incident.find(filter)
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Incident.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: incidents.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: incidents
  });
});

// ==========================================
// 3. GET SINGLE INCIDENT BY ID
// ==========================================
const getIncidentById = asyncHandler(async (req, res) => {
  const incident = await Incident.findById(req.params.id);

  if (!incident) {
    res.status(404);
    throw new Error('Incident not found');
  }

  res.status(200).json({
    success: true,
    data: incident
  });
});

// ==========================================
// 4. UPDATE INCIDENT
// ==========================================
const updateIncident = asyncHandler(async (req, res) => {
  let incident = await Incident.findById(req.params.id);

  if (!incident) {
    res.status(404);
    throw new Error('Incident not found');
  }

  incident = await Incident.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Incident updated successfully',
    data: incident
  });
});

// ==========================================
// 5. DELETE INCIDENT
// ==========================================
const deleteIncident = asyncHandler(async (req, res) => {
  const incident = await Incident.findById(req.params.id);

  if (!incident) {
    res.status(404);
    throw new Error('Incident not found');
  }

  await incident.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Incident deleted successfully'
  });
});

// ==========================================
// 6. UPDATE CORRECTIVE ACTION STATUS
// ==========================================
const updateCorrectiveAction = asyncHandler(async (req, res) => {
  const { status, remarks, completedDate } = req.body;

  const incident = await Incident.findById(req.params.id);

  if (!incident) {
    res.status(404);
    throw new Error('Incident not found');
  }

  if (status) incident.correctiveAction.status = status;
  if (remarks) incident.correctiveAction.remarks = remarks;
  if (completedDate) incident.correctiveAction.completedDate = new Date(completedDate);

  await incident.save();

  res.status(200).json({
    success: true,
    message: 'Corrective action updated',
    data: incident
  });
});

module.exports = {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
  updateCorrectiveAction
};