const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: './.env' });

const users = [
  {
    name: 'Safety Officer',
    email: 'safety@ccl.co.in',
    password: 'safety123',
    role: 'safety-officer',
    employeeId: 'EMP-SAF-001',
    department: 'Safety',
    mine: 'All Mines'
  },
  {
    name: 'Mine Manager',
    email: 'manager@ccl.co.in',
    password: 'manager123',
    role: 'mine-manager',
    employeeId: 'EMP-MGR-001',
    department: 'Operations',
    mine: 'Barkagaon Colliery'
  },
  {
    name: 'Field Reporter',
    email: 'reporter@ccl.co.in',
    password: 'reporter123',
    role: 'reporter',
    employeeId: 'EMP-REP-001',
    department: 'Field Operations',
    mine: 'Barkagaon Colliery'
  }
];

const seedUsers = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      console.error('ERROR: MONGO_URI or MONGODB_URI not found in .env');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('MongoDB connected');

    for (const userData of users) {
      // Delete old user if exists (fixes double-hashed passwords)
      await User.deleteOne({ email: userData.email });
      console.log(`Deleted old user (if existed): ${userData.email}`);

      // Create with PLAIN password — User model's pre-save hook will hash it once
      await User.create(userData);

      console.log(`Created user: ${userData.email} (${userData.role})`);
    }

    console.log('All test users seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seedUsers();