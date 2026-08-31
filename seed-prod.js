const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Your PRODUCTION Atlas connection string
const MONGO_URI = 'mongodb+srv://sraunaksingh23_db_user:YOUR_ACTUAL_PASSWORD@cluster0.qtrirk1.mongodb.net/siras-ccl?retryWrites=true&w=majority&appName=Cluster0';

// Replace YOUR_ACTUAL_PASSWORD with your real password above ☝️

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
});

const User = mongoose.model('User', userSchema);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to Atlas');
    
    await User.deleteMany({});
    console.log('🗑️ Cleared old users');
    
    const h1 = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin', email: 'admin@ccl.co.in', password: h1, role: 'admin' });
    
    const h2 = await bcrypt.hash('safety123', 10);
    await User.create({ name: 'Safety Officer', email: 'safety@ccl.co.in', password: h2, role: 'safety-officer' });
    
    const h3 = await bcrypt.hash('manager123', 10);
    await User.create({ name: 'Mine Manager', email: 'manager@ccl.co.in', password: h3, role: 'mine-manager' });
    
    const h4 = await bcrypt.hash('reporter123', 10);
    await User.create({ name: 'Reporter', email: 'reporter@ccl.co.in', password: h4, role: 'reporter' });
    
    console.log('✅ 4 users seeded to production!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seed();