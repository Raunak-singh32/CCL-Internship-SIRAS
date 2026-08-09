export const calculateRiskScore = (incident) => {
  let score = 0;
  
  // Severity weight (0-40)
  const severityWeights = { critical: 40, high: 30, medium: 20, low: 10 };
  score += severityWeights[incident.severity] || 10;
  
  // Type weight (0-30)
  const typeWeights = {
    fatality: 30, explosion: 28, collapse: 26, fire: 24,
    serious_injury: 22, machinery_failure: 18, environmental: 16,
    lost_time_injury: 14, first_aid: 10, near_miss: 8,
    property_damage: 6, other: 5
  };
  score += typeWeights[incident.incidentType] || 5;
  
  // Persons involved (0-15)
  score += Math.min((incident.personsInvolved?.length || 0) * 5, 15);
  
  // Equipment damage cost (0-10)
  const totalCost = incident.equipmentInvolved?.reduce((sum, eq) => sum + (eq.estimatedCost || 0), 0) || 0;
  score += Math.min(totalCost / 100000, 10);
  
  // Environmental impact (0-5)
  if (incident.environmentalImpact?.occurred) score += 5;
  
  // Historical frequency factor (simulated - in production, query DB)
  score = Math.min(Math.round(score), 100);
  
  let riskLevel = 'low';
  if (score >= 80) riskLevel = 'extreme';
  else if (score >= 60) riskLevel = 'high';
  else if (score >= 40) riskLevel = 'moderate';
  
  return { score, riskLevel };
};