import PDFDocument from 'pdfkit';

export const generateIncidentPDF = (incident, res) => {
  const doc = new PDFDocument({ margin: 50 });
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=incident-${incident.incidentId}.pdf`);
  
  doc.pipe(res);
  
  // Header
  doc.fontSize(20).text('CCL - SAFETY INCIDENT REPORT', 50, 50);
  doc.moveDown();
  
  // Incident ID and Status
  doc.fontSize(12).text(`Incident ID: ${incident.incidentId}`, { continued: true })
     .text(`                    Status: ${incident.status.toUpperCase()}`, { align: 'right' });
  doc.moveDown();
  
  // Basic Info
  doc.fontSize(14).text('BASIC INFORMATION', { underline: true });
  doc.fontSize(10)
     .text(`Mine Site: ${incident.mineSite}`)
     .text(`Department: ${incident.department}`)
     .text(`Location: ${incident.location}`)
     .text(`Date & Time: ${new Date(incident.dateTime).toLocaleString()}`)
     .text(`Shift: ${incident.shift}`)
     .text(`Severity: ${incident.severity.toUpperCase()}`)
     .text(`Type: ${incident.incidentType.replace(/_/g, ' ').toUpperCase()}`)
     .text(`Risk Score: ${incident.riskScore}/100 (${incident.riskLevel.toUpperCase()})`);
  doc.moveDown();
  
  // Description
  doc.fontSize(14).text('DESCRIPTION', { underline: true });
  doc.fontSize(10).text(incident.description);
  doc.moveDown();
  
  // Immediate Action
  doc.fontSize(14).text('IMMEDIATE ACTION TAKEN', { underline: true });
  doc.fontSize(10).text(incident.immediateAction);
  doc.moveDown();
  
  // Persons Involved
  if (incident.personsInvolved?.length > 0) {
    doc.fontSize(14).text('PERSONS INVOLVED', { underline: true });
    incident.personsInvolved.forEach((p, i) => {
      doc.fontSize(10).text(`${i + 1}. ${p.name} (${p.designation}) - ${p.injuryType || 'No injury'}`);
    });
    doc.moveDown();
  }
  
  // Footer
  doc.fontSize(8).text(`Generated on: ${new Date().toLocaleString()}`, 50, doc.page.height - 50);
  
  doc.end();
};