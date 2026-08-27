require('./config/db');
const I = require('./models/Incident');
setTimeout(async () => {
  const r = await I.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  console.log(JSON.stringify(r));
  process.exit();
}, 2000);