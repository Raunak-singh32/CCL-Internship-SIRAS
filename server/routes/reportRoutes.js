const express = require('express');
const router = express.Router();
const { exportIncidentsCSV, exportIncidentsPDF, exportIncidentPDF } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/export/csv', protect, exportIncidentsCSV);
router.get('/export/pdf', protect, exportIncidentsPDF);
router.get('/export/pdf/:id', protect, exportIncidentPDF);

module.exports = router;