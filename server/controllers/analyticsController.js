const Incident = require('../models/Incident');
const asyncHandler = require('../utils/asyncHandler');

const getIncidentTrends = asyncHandler(async (req, res) => {
  const trends = await Incident.aggregate([
    { $group: { _id: { year: { $year: "$date" }, month: { $month: "$date" } }, count: { $sum: 1 } } },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 12 }
  ]);
  res.status(200).json({ success: true, count: trends.length, data: trends });
});

const getIncidentsByCategory = asyncHandler(async (req, res) => {
  const categories = await Incident.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  res.status(200).json({ success: true, data: categories });
});

const getIncidentsBySeverity = asyncHandler(async (req, res) => {
  const severity = await Incident.aggregate([
    { $group: { _id: "$severity", count: { $sum: 1 } } }
  ]);
  res.status(200).json({ success: true, data: severity });
});

const getIncidentsByLocation = asyncHandler(async (req, res) => {
  const locations = await Incident.aggregate([
    { $group: { _id: "$mineLocation", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  res.status(200).json({ success: true, data: locations });
});

const getCorrectiveActionStats = asyncHandler(async (req, res) => {
  const stats = await Incident.aggregate([
    { $group: { _id: "$correctiveAction.status", count: { $sum: 1 } } }
  ]);
  res.status(200).json({ success: true, data: stats });
});

const getDashboardSummary = asyncHandler(async (req, res) => {
  const totalIncidents = await Incident.countDocuments();
  const openIncidents = await Incident.countDocuments({ status: 'open' });
  const closedIncidents = await Incident.countDocuments({ status: 'closed' });
  const criticalIncidents = await Incident.countDocuments({ severity: 'critical' });

  const resolved = await Incident.find({
    'correctiveAction.completedDate': { $exists: true },
    'correctiveAction.status': 'completed'
  });

  let avgResolutionDays = 0;
  if (resolved.length > 0) {
    const totalDays = resolved.reduce((sum, inc) => {
      const diff = new Date(inc.correctiveAction.completedDate) - new Date(inc.date);
      return sum + diff / (1000 * 60 * 60 * 24);
    }, 0);
    avgResolutionDays = Math.round(totalDays / resolved.length);
  }

  res.status(200).json({
    success: true,
    data: { totalIncidents, openIncidents, closedIncidents, criticalIncidents, avgResolutionDays }
  });
});

const getRiskHeatmap = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const riskData = await Incident.aggregate([
    { $match: { date: { $gte: sixMonthsAgo } } },
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
        riskScore: { $multiply: ["$incidentCount", { $ifNull: ["$avgSeverity", 1] }] }
      }
    },
    { $sort: { riskScore: -1 } }
  ]);

  res.status(200).json({ success: true, data: riskData });
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