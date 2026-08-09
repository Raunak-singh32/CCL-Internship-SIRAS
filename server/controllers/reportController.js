const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Incident = require('../models/Incident');
const asyncHandler = require('../utils/asyncHandler');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ==========================================
// 1. EXPORT ALL INCIDENTS TO CSV
// ==========================================
const exportIncidentsCSV = asyncHandler(async (req, res) => {
  const { startDate, endDate, mineLocation, category, severity } = req.query;

  const filter = {};
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  if (mineLocation) filter.mineLocation = mineLocation;
  if (category) filter.category = category;
  if (severity) filter.severity = severity;

  const incidents = await Incident.find(filter).sort({ date: -1 });

  const filename = `incidents-report-${Date.now()}.csv`;
  const filepath = path.join(uploadsDir, filename);

  const csvWriter = createCsvWriter({
    path: filepath,
    header: [
      { id: 'incidentId', title: 'Incident ID' },
      { id: 'title', title: 'Title' },
      { id: 'type', title: 'Type' },
      { id: 'category', title: 'Category' },
      { id: 'severity', title: 'Severity' },
      { id: 'mineLocation', title: 'Mine Location' },
      { id: 'date', title: 'Date' },
      { id: 'status', title: 'Status' },
      { id: 'reportedBy', title: 'Reported By' },
      { id: 'actionStatus', title: 'Action Status' }
    ]
  });

  const records = incidents.map((inc) => ({
    incidentId: inc.incidentId,
    title: inc.title,
    type: inc.type,
    category: inc.category,
    severity: inc.severity,
    mineLocation: inc.mineLocation,
    date: inc.date ? inc.date.toISOString().split('T')[0] : '',
    status: inc.status,
    reportedBy: inc.reportedBy?.name || '',
    actionStatus: inc.correctiveAction?.status || ''
  }));

  await csvWriter.writeRecords(records);

  res.download(filepath, filename, (err) => {
    if (err) console.error('Download error:', err);
    fs.unlink(filepath, () => {});
  });
});

// ==========================================
// 2. EXPORT ALL INCIDENTS TO PDF (BULK)
// ==========================================
const exportIncidentsPDF = asyncHandler(async (req, res) => {
  const incidents = await Incident.find().sort({ date: -1 }).lean();

  const filename = `incidents-report-${Date.now()}.pdf`;
  const filepath = path.join(uploadsDir, filename);

  const doc = new PDFDocument({ margin: 30 });
  const stream = fs.createWriteStream(filepath);
  doc.pipe(stream);

  // Header
  doc.fontSize(20).text('SIRAS-CCL - Incident Report', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.moveDown(1.5);

  // Summary
  doc.fontSize(12).text(`Total Incidents: ${incidents.length}`);
  doc.moveDown(1);

  // Table Header
  const colX = [30, 120, 220, 310, 390, 470];
  const colW = [85, 95, 85, 75, 75, 80];

  function drawTableHeader(yPos) {
    doc.fontSize(9).font('Helvetica-Bold');
    doc.fillColor('#1e3a5f');
    doc.text('Incident ID', colX[0], yPos, { width: colW[0] });
    doc.text('Title', colX[1], yPos, { width: colW[1] });
    doc.text('Category', colX[2], yPos, { width: colW[2] });
    doc.text('Severity', colX[3], yPos, { width: colW[3] });
    doc.text('Status', colX[4], yPos, { width: colW[4] });
    doc.text('Date', colX[5], yPos, { width: colW[5] });
    doc.moveDown(0.6);
    doc.moveTo(30, doc.y).lineTo(570, doc.y).stroke('#1e3a5f');
    doc.moveDown(0.4);
    doc.fillColor('#000').font('Helvetica');
  }

  drawTableHeader(doc.y);

  // Rows
  incidents.forEach((inc) => {
    if (doc.y > 720) {
      doc.addPage();
      drawTableHeader(40);
    }

    const y = doc.y;
    doc.fontSize(8);
    doc.text(inc.incidentId || 'N/A', colX[0], y, { width: colW[0] });
    doc.text(inc.title ? (inc.title.length > 18 ? inc.title.slice(0, 18) + '...' : inc.title) : 'N/A', colX[1], y, { width: colW[1] });
    doc.text(inc.category || 'N/A', colX[2], y, { width: colW[2] });
    doc.text(inc.severity || 'N/A', colX[3], y, { width: colW[3] });
    doc.text(inc.status || 'N/A', colX[4], y, { width: colW[4] });
    doc.text(inc.date ? new Date(inc.date).toISOString().split('T')[0] : 'N/A', colX[5], y, { width: colW[5] });
    doc.moveDown(0.6);
  });

  doc.end();

  stream.on('finish', () => {
    res.download(filepath, filename, (err) => {
      if (err) console.error('Download error:', err);
      fs.unlink(filepath, () => {});
    });
  });
});

// ==========================================
// 3. EXPORT SINGLE INCIDENT TO PDF
// ==========================================
const exportIncidentPDF = asyncHandler(async (req, res) => {
  const incident = await Incident.findById(req.params.id);

  if (!incident) {
    res.status(404);
    throw new Error('Incident not found');
  }

  const filename = `incident-${incident.incidentId}.pdf`;
  const filepath = path.join(uploadsDir, filename);

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filepath);
  doc.pipe(stream);

  // Header
  doc.fontSize(20).text('CCL - Safety Incident Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Incident ID: ${incident.incidentId}`);
  doc.text(`Title: ${incident.title}`);
  doc.text(`Type: ${incident.type ? incident.type.toUpperCase() : 'N/A'}`);
  doc.text(`Category: ${incident.category}`);
  doc.text(`Severity: ${incident.severity ? incident.severity.toUpperCase() : 'N/A'}`);
  doc.text(`Mine Location: ${incident.mineLocation || 'N/A'}`);
  doc.text(`Department: ${incident.department || 'N/A'}`);
  doc.text(`Date: ${incident.date ? incident.date.toISOString().split('T')[0] : 'N/A'}`);
  doc.text(`Time: ${incident.time || 'N/A'}`);
  doc.text(`Status: ${incident.status ? incident.status.toUpperCase() : 'N/A'}`);
  doc.moveDown();

  // Description
  doc.fontSize(14).text('Description');
  doc.fontSize(12).text(incident.description || 'N/A');
  doc.moveDown();

  // Reported By
  doc.fontSize(14).text('Reported By');
  doc.fontSize(12).text(`Name: ${incident.reportedBy?.name || 'N/A'}`);
  doc.text(`Employee ID: ${incident.reportedBy?.employeeId || 'N/A'}`);
  doc.text(`Designation: ${incident.reportedBy?.designation || 'N/A'}`);
  doc.moveDown();

  // Root Cause
  doc.fontSize(14).text('Root Cause Analysis');
  doc.fontSize(12).text(`Immediate Cause: ${incident.immediateCause || 'N/A'}`);
  doc.text(`Root Cause: ${incident.rootCause || 'N/A'}`);
  doc.moveDown();

  // Corrective Action
  doc.fontSize(14).text('Corrective Action');
  doc.fontSize(12).text(`Status: ${incident.correctiveAction?.status ? incident.correctiveAction.status.toUpperCase() : 'N/A'}`);
  doc.text(`Assigned To: ${incident.correctiveAction?.assignedTo || 'N/A'}`);
  doc.text(`Deadline: ${incident.correctiveAction?.deadline ? incident.correctiveAction.deadline.toISOString().split('T')[0] : 'N/A'}`);
  doc.text(`Description: ${incident.correctiveAction?.description || 'N/A'}`);
  doc.moveDown();

  // Footer
  doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });

  doc.end();

  stream.on('finish', () => {
    res.download(filepath, filename, (err) => {
      if (err) console.error('Download error:', err);
      fs.unlink(filepath, () => {});
    });
  });
});

module.exports = {
  exportIncidentsCSV,
  exportIncidentsPDF,
  exportIncidentPDF
};