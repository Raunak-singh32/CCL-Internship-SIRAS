const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getIncidentTrends,
  getIncidentsByCategory,
  getIncidentsBySeverity,
  getIncidentsByLocation,
  getCorrectiveActionStats,
  getDashboardSummary,
  getRiskHeatmap
} = require('../controllers/analyticsController');

router.use(protect);

// Dashboard data — open to ALL authenticated roles
router.get('/summary', getDashboardSummary);
router.get('/trends', getIncidentTrends);
router.get('/categories', getIncidentsByCategory);
router.get('/severity', getIncidentsBySeverity);

// Deep analytics — admin, safety-officer, mine-manager only
router.use(restrictTo('admin', 'safety-officer', 'mine-manager'));

router.get('/locations', getIncidentsByLocation);
router.get('/corrective-actions', getCorrectiveActionStats);
router.get('/risk-heatmap', getRiskHeatmap);

module.exports = router;