// Simulated REST Backend Service & AI ML Inference Layer for UAV Aero Piston Engines
// Structured to mirror a Python FastAPI + XGBoost/Scikit-learn deployment

export const DEFAULT_TELEMETRY = {
  healthScore: 86,
  status: 'Healthy', // Healthy | Warning | Critical
  rpm: 4520,
  temperature: 82, // °C
  oilPressure: 3.8, // bar
  vibration: 0.42, // g
  fuelConsumption: 10.2, // L/h
  engineLoad: 68, // %
  exhaustTemp: 620, // °C
  operatingHours: 1250, // h
  predictedFault: 'Overheating',
  faultProbability: 87, // %
  rulHours: 42, // hours
  maintenanceStatus: 'Recommended',
  priority: 'High'
};

// AI Model Inference calculation based on physical parameters
export function runEngineAIInference(metrics) {
  const { temperature, vibration, oilPressure, fuelConsumption, rpm, engineLoad } = metrics;
  
  // Anomaly deltas against standard UAV baseline parameters
  const baseTemp = 72;
  const baseVib = 0.25;
  const baseOil = 4.2;
  const baseFuel = 9.2;

  const tempDelta = ((temperature - baseTemp) / baseTemp) * 100;
  const vibDelta = ((vibration - baseVib) / baseVib) * 100;
  const oilDelta = ((baseOil - oilPressure) / baseOil) * 100;
  const fuelDelta = ((fuelConsumption - baseFuel) / baseFuel) * 100;

  // Calculate composite health score (100 is optimal)
  let penalty = 0;
  if (temperature > 75) penalty += (temperature - 75) * 1.4;
  if (vibration > 0.3) penalty += (vibration - 0.3) * 60;
  if (oilPressure < 3.8) penalty += (3.8 - oilPressure) * 35;
  if (fuelConsumption > 10) penalty += (fuelConsumption - 10) * 5;

  let healthScore = Math.max(15, Math.min(99, Math.round(100 - penalty)));

  // Status classification
  let status = 'Healthy';
  if (healthScore < 60 || temperature > 92 || vibration > 0.75 || oilPressure < 2.9) {
    status = 'Critical';
  } else if (healthScore < 82 || temperature > 84 || vibration > 0.5 || oilPressure < 3.4) {
    status = 'Warning';
  }

  // Predicted Fault & Probability
  let predictedFault = 'Normal Operation';
  let faultProbability = Math.round(100 - healthScore);
  
  if (temperature > 85 && vibration > 0.45) {
    predictedFault = 'Piston Overheating & Cylinder Scuffing';
    faultProbability = Math.min(96, Math.max(82, Math.round(tempDelta * 1.8)));
  } else if (vibration > 0.6) {
    predictedFault = 'Crankshaft Bearing Degradation';
    faultProbability = Math.min(95, Math.max(78, Math.round(vibDelta * 1.5)));
  } else if (oilPressure < 3.2) {
    predictedFault = 'Oil Pump Pressure Loss';
    faultProbability = Math.min(92, Math.max(75, Math.round(oilDelta * 2.1)));
  } else if (temperature > 80) {
    predictedFault = 'Engine Overheating';
    faultProbability = Math.min(90, Math.max(70, Math.round(tempDelta * 1.6)));
  }

  // RUL (Remaining Useful Life in hours)
  const rulHours = Math.max(4, Math.round((healthScore / 100) * 52));

  // Explainability breakdown factors
  const contributingFactors = [
    { name: 'Coolant & Exhaust Temperature', change: `+${Math.max(0, Math.round(tempDelta))}%`, impact: 'High', status: temperature > 84 ? 'Abnormal' : 'Normal' },
    { name: 'Crankcase Mechanical Vibration', change: `+${Math.max(0, Math.round(vibDelta))}%`, impact: 'High', status: vibration > 0.45 ? 'Abnormal' : 'Normal' },
    { name: 'Engine Lubrication Oil Pressure', change: `-${Math.max(0, Math.round(oilDelta))}%`, impact: 'Medium', status: oilPressure < 3.6 ? 'Warning' : 'Normal' },
    { name: 'Fuel Consumption Rate', change: `+${Math.max(0, Math.round(fuelDelta))}%`, impact: 'Low', status: fuelConsumption > 10.5 ? 'Elevated' : 'Normal' },
  ];

  return {
    healthScore,
    status,
    predictedFault,
    faultProbability,
    rulHours,
    contributingFactors,
    confidenceScores: {
      faultPrediction: faultProbability,
      healthClassification: Math.min(98, healthScore + 8),
      rulRegression: Math.min(94, Math.max(80, 100 - Math.abs(healthScore - 80)))
    }
  };
}

// Generate historical trend dataset for analytics (7D, 30D, 3M, 6M, 1Y)
export function getAnalyticsTrends(timeframe = '30D') {
  const pointsCount = timeframe === '7D' ? 7 : timeframe === '30D' ? 15 : 30;
  const labels = [];
  const healthData = [];
  const tempData = [];
  const vibrationData = [];
  const rpmData = [];
  const oilData = [];
  const fuelData = [];
  const rulData = [];

  const now = new Date();

  for (let i = pointsCount - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * (timeframe === '7D' ? 1 : timeframe === '30D' ? 2 : 5) * 24 * 3600 * 1000);
    labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    
    // Simulate gradual wear curve with noise
    const progress = (pointsCount - i) / pointsCount;
    const health = Math.round(98 - progress * 15 + (Math.random() * 4 - 2));
    const temp = Math.round(72 + progress * 12 + (Math.random() * 3 - 1.5));
    const vib = Number((0.22 + progress * 0.2 + (Math.random() * 0.05 - 0.025)).toFixed(2));
    const rpm = Math.round(4480 + Math.random() * 80 - 40);
    const oil = Number((4.1 - progress * 0.4 + (Math.random() * 0.1 - 0.05)).toFixed(1));
    const fuel = Number((9.4 + progress * 0.9 + (Math.random() * 0.2 - 0.1)).toFixed(1));
    const rul = Math.max(8, Math.round((health / 100) * 52));

    healthData.push(health);
    tempData.push(temp);
    vibrationData.push(vib);
    rpmData.push(rpm);
    oilData.push(oil);
    fuelData.push(fuel);
    rulData.push(rul);
  }

  return {
    labels,
    healthData,
    tempData,
    vibrationData,
    rpmData,
    oilData,
    fuelData,
    rulData
  };
}

// Generate What-If Simulation predictions
export function runScenarioSimulation(scenario, overrideValues) {
  let temp = 82;
  let load = 68;
  let rpm = 4520;
  let durationHours = 5;

  if (scenario === 'High Temperature') {
    temp = 94;
    load = 75;
    rpm = 4700;
  } else if (scenario === 'High Load') {
    temp = 89;
    load = 92;
    rpm = 5100;
  } else if (scenario === 'High Altitude') {
    temp = 86;
    load = 84;
    rpm = 4850;
  }

  // Override with user slider values if passed
  if (overrideValues) {
    if (overrideValues.temperature !== undefined) temp = overrideValues.temperature;
    if (overrideValues.load !== undefined) load = overrideValues.load;
    if (overrideValues.rpm !== undefined) rpm = overrideValues.rpm;
    if (overrideValues.duration !== undefined) durationHours = overrideValues.duration;
  }

  const vib = Number((0.35 + (temp - 70) * 0.008 + (load - 50) * 0.004).toFixed(2));
  const oil = Number((4.0 - (temp - 70) * 0.02).toFixed(1));
  const fuel = Number((9.5 + (load - 50) * 0.08).toFixed(1));

  const simulatedAI = runEngineAIInference({
    temperature: temp,
    vibration: vib,
    oilPressure: oil,
    fuelConsumption: fuel,
    rpm,
    engineLoad: load
  });

  // Calculate degradation timeline over selected duration
  const timeline = [];
  for (let h = 0; h <= durationHours; h++) {
    const factor = h / durationHours;
    const baseH = 86;
    const simH = Math.max(10, Math.round(simulatedAI.healthScore - factor * 14));
    timeline.push({
      hour: `+${h}h`,
      normalHealth: Math.max(70, Math.round(baseH - h * 0.6)),
      simulatedHealth: simH
    });
  }

  return {
    scenario,
    predictedTemp: temp,
    predictedLoad: load,
    predictedRpm: rpm,
    predictedHealth: simulatedAI.healthScore,
    predictedRul: simulatedAI.rulHours,
    predictedFault: simulatedAI.predictedFault,
    riskLevel: simulatedAI.healthScore < 60 ? 'Critical' : simulatedAI.healthScore < 80 ? 'High' : 'Moderate',
    timeline
  };
}
