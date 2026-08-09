const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
  updateCorrectiveAction
} = require('../controllers/incidentController');

// Create new incident — admin, safety-officer, reporter only
router.post('/', protect, restrictTo('admin', 'safety-officer', 'reporter'), createIncident);

// Get all incidents — any authenticated user
router.get('/', protect, getAllIncidents);

// Get single incident — any authenticated user
router.get('/:id', protect, getIncidentById);

// Update incident — admin and safety-officer only
router.put('/:id', protect, restrictTo('admin', 'safety-officer'), updateIncident);

// Delete incident — admin and safety-officer only
router.delete('/:id', protect, restrictTo('admin', 'safety-officer'), deleteIncident);

// Update corrective action — admin and safety-officer only
router.patch('/:id/corrective-action', protect, restrictTo('admin', 'safety-officer'), updateCorrectiveAction);

module.exports = router;