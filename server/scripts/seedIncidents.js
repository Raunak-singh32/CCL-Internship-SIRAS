require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Incident = require('../models/Incident');

const mines = ['Barka Sayal', 'Kuju', 'Ray-Bachra', 'Piparwar', 'Magadh', 'Amrapali', 'Dhori', 'Kathara'];
const categories = ['fall-of-ground', 'machinery-breakdown', 'fire', 'electrical', 'transportation', 'personal-injury', 'gas-leak', 'environmental'];
const types = ['accident', 'near-miss', 'hazard', 'violation'];
const severities = ['low', 'medium', 'high', 'critical'];
const statuses = ['open', 'under-investigation', 'closed'];
const actionStatuses = ['pending', 'in-progress', 'completed', 'overdue'];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (monthsBack = 6) => {
  const d = new Date();
  d.setMonth(d.getMonth() - Math.floor(Math.random() * monthsBack));
  d.setDate(Math.floor(Math.random() * 28) + 1);
  return d;
};

const dummyIncidents = Array.from({ length: 35 }, (_, i) => {
  const date = randomDate(8);
  const severity = randomItem(severities);
  const actionStatus = randomItem(actionStatuses);
  
  return {
    incidentId: `CCL-2026-${String(i + 1).padStart(4, '0')}`,
    title: [
      'Roof collapse reported in underground gallery',
      'Conveyor belt malfunction during night shift',
      'Minor fire in substation room',
      'Worker slipped on wet floor near shaft',
      'Gas detection alarm triggered',
      'Dumper brake failure on haul road',
      'Electric shock incident during maintenance',
      'Water seepage observed in working panel',
      'Crane overload warning activated',
      'Dust suppression system failure'
    ][i % 10],
    description: 'This is a detailed description of the incident for record and analysis purposes.',
    type: randomItem(types),
    category: randomItem(categories),
    severity,
    mineLocation: randomItem(mines),
    department: randomItem(['Mining', 'Electrical', 'Mechanical', 'Safety', 'Transport']),
    date,
    time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    reportedBy: {
      name: randomItem(['Ramesh Kumar', 'Suresh Singh', 'Amit Yadav', 'Vikash Patel', 'Dinesh Gupta']),
      employeeId: `EMP-${1000 + i}`,
      designation: randomItem(['Mining Sirdar', 'Overman', 'Electrical Supervisor', 'Safety Officer']),
      contactNumber: `98765${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`
    },
    personsInvolved: [
      {
        name: randomItem(['Ramesh Kumar', 'Suresh Singh', 'Amit Yadav']),
        employeeId: `EMP-${2000 + i}`,
        role: 'Worker',
        injuryType: severity === 'critical' ? 'fracture' : severity === 'high' ? 'bruises' : 'none',
        severity: severity === 'critical' ? 'major' : severity === 'high' ? 'minor' : 'none'
      }
    ],
    immediateCause: randomItem(['Equipment failure', 'Human error', 'Environmental condition', 'Procedure violation']),
    rootCause: randomItem(['Lack of maintenance', 'Inadequate training', 'Poor supervision', 'Design flaw']),
    correctiveAction: {
      description: 'Investigate and implement preventive measures.',
      assignedTo: randomItem(['Safety Dept', 'Maintenance Team', 'HR Training']),
      deadline: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000),
      status: actionStatus,
      completedDate: actionStatus === 'completed' ? new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000) : null,
      remarks: actionStatus === 'completed' ? 'Action completed and verified.' : 'Pending review.'
    },
    dgmsReportable: severity === 'critical' || severity === 'high',
    dgmsReference: severity === 'critical' || severity === 'high' ? `DGMS/RAN/${2026}/${i + 100}` : '',
    status: randomItem(statuses),
    reviewedBy: {
      name: 'Senior Safety Officer',
      designation: 'Safety Manager',
      reviewDate: new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000)
    }
  };
});

const seedIncidents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB connected. Seeding incidents...');

    // Clear old dummy data (optional - remove if you want to keep existing)
    await Incident.deleteMany({});
    console.log('Cleared old incidents.');

    await Incident.insertMany(dummyIncidents);
    console.log(`✅ ${dummyIncidents.length} incidents seeded successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Seeder failed:', error.message);
    process.exit(1);
  }
};

seedIncidents();