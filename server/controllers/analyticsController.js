const Incident = require('../models/Incident');
const asyncHandler = require('../utils/asyncHandler');

// ==========================================
// 1. INCIDENT TRENDS (Monthly counts)
// ==========================================
const getIncidentTrends = asyncHandler(async (req, res) => {
  const trends = await Incident.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 12 }
  ]);

  res.status(200).json({
    success: true,
    count: trends.length,
    data: trends
  });
});

// ==========================================
// 2. INCIDENTS BY CATEGORY
// ==========================================
const getIncidentsByCategory = asyncHandler(async (req, res) => {
  const categories = await Incident.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: categories
  });
});

// ==========================================
// 3. INCIDENTS BY SEVERITY
// ==========================================
const getIncidentsBySeverity = asyncHandler(async (req, res) => {
  const severity = await Incident.aggregate([
    {
      $group: {
        _id: "$severity",
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: severity
  });
});

// ==========================================
// 4. INCIDENTS BY MINE LOCATION
// ==========================================
const getIncidentsByLocation = asyncHandler(async (req, res) => {
  const locations = await Incident.aggregate([
    {
      $group: {
        _id: "$mineLocation",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: locations
  });
});

// ==========================================
// 5. CORRECTIVE ACTION STATUS STATS
// ==========================================
const getCorrectiveActionStats = asyncHandler(async (req, res) => {
  const stats = await Incident.aggregate([
    {
      $group: {
        _id: "$correctiveAction.status",
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats
  });
});

// ==========================================
// 6. DASHBOARD SUMMARY (KPI Cards data)
// ==========================================
const getDashboardSummary = asyncHandler(async (req, res) => {
  const totalIncidents = await Incident.countDocuments();
  const totalNearMisses = await Incident.countDocuments({ type: 'near-miss' });
  const totalAccidents = await Incident.countDocuments({ type: 'accident' });
  const pendingActions = await Incident.countDocuments({
    "correctiveAction.status": "pending"
  });

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const thisMonthIncidents = await Incident.countDocuments({
    date: { $gte: lastMonth }
  });

  res.status(200).json({
    success: true,
    data: {
      totalIncidents,
      totalNearMisses,
      totalAccidents,
      pendingActions,
      thisMonthIncidents
    }
  });
});

// ==========================================
// 7. RISK HEATMAP (Stretch goal - basic scoring)
// ==========================================
const getRiskHeatmap = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const riskData = await Incident.aggregate([
    {
      $match: {
        date: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: "$mineLocation",
        incidentCount: { $sum: 1 },
        avgSeverity: {
          $avg: {
            $switch: {
              branches: [
                { case: { $eq: ["$severity", "low"] }, then: 1 },
                { case: { $eq: ["$severity", "medium"] }, then: 2 },
                { case: { $eq: ["$severity", "high"] }, then: 3 },
                { case: { $eq: ["$severity", "critical"] }, then: 4 }
              ],
              default: 1
            }
          }
        }
      }
    },
    {
      $project: {
        mineLocation: "$_id",
        incidentCount: 1,
        avgSeverity: { $round: ["$avgSeverity", 2] },
        riskScore: {
          $multiply: [
            "$incidentCount",
            { $ifNull: ["$avgSeverity", 1] }
          ]
        }
      }
    },
    { $sort: { riskScore: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: riskData
  });
});

module.exports = {
  getIncidentTrends,
  getIncidentsByCategory,
  getIncidentsBySeverity,
  getIncidentsByLocation,
  getCorrectiveActionStats,
  getDashboardSummary,
  getRiskHeatmap
};