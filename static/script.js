// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  // Theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
  
  // Prediction page functionality
  const predictButton = document.getElementById('predict-button');
  const resetButton = document.getElementById('reset-button');
  const predictionResults = document.getElementById('prediction-results');
  
  if (predictButton && resetButton) {
    // Predict button click handler
    predictButton.addEventListener('click', () => {
      // Get all input values
      const spindleSpeed = parseFloat(document.getElementById('spindle-speed').value) || 0;
      const feedRate = parseFloat(document.getElementById('feed-rate').value) || 0;
      const cuttingDepth = parseFloat(document.getElementById('cutting-depth').value) || 0;
      const vibrationLevels = parseFloat(document.getElementById('vibration-levels').value) || 0;
      const motorTemperature = parseFloat(document.getElementById('motor-temperature').value) || 0;
      const lubricationPressure = parseFloat(document.getElementById('lubrication-pressure').value) || 0;
      const ambientTemperature = parseFloat(document.getElementById('ambient-temperature').value) || 0;
      const machineUsageHours = parseFloat(document.getElementById('machine-usage-hours').value) || 0;
      
      // Check if all required fields are filled
      const requiredInputs = [
        'spindle-speed', 'feed-rate', 'cutting-depth', 'vibration-levels', 
        'motor-temperature', 'lubrication-pressure', 'ambient-temperature', 'machine-usage-hours'
      ];
      
      const allFilled = requiredInputs.every(id => document.getElementById(id).value.trim() !== '');
      
      if (!allFilled) {
        alert('Please fill in all fields to get an accurate prediction.');
        return;
      }
      
      // Calculate failure probabilities (simplified model for demonstration)
      // In a real application, this would use a trained machine learning model
      
      // Mechanical failure factors: high vibration, high motor temp, low lubrication, high usage hours
      const mechanicalProbability = calculateProbability([
        normalizeValue(vibrationLevels, 0, 10, 0.7),
        normalizeValue(motorTemperature, 50, 120, 0.8),
        normalizeValue(100 - lubricationPressure, 90, 100, 0.6),
        normalizeValue(machineUsageHours, 1000, 10000, 0.5)
      ]);
      
      // Operational failure factors: extreme spindle speed, high feed rate, deep cutting
      const operationalProbability = calculateProbability([
        normalizeValue(Math.abs(spindleSpeed - 1500), 0, 1000, 0.6),
        normalizeValue(feedRate, 100, 500, 0.7),
        normalizeValue(cuttingDepth, 1, 10, 0.8)
      ]);
      
      // Software failure is random for this demo (would be based on other factors in real system)
      const softwareProbability = Math.random() * 0.3; // Max 30% probability for demo
      
      // Determine the most likely failure type
      const probabilities = [
        { type: 'Mechanical Failure', probability: mechanicalProbability },
        { type: 'Operational Failure', probability: operationalProbability },
        { type: 'Software Failure', probability: softwareProbability }
      ];
      
      probabilities.sort((a, b) => b.probability - a.probability);
      const mostLikelyFailure = probabilities[0];
      
      // Update the UI with the prediction results
      document.getElementById('failure-type').textContent = 
        mostLikelyFailure.probability > 0.3 ? mostLikelyFailure.type : 'No significant failure risk detected';
      
      // Update progress bars
      updateProgressBar('mechanical', mechanicalProbability);
      updateProgressBar('operational', operationalProbability);
      updateProgressBar('software', softwareProbability);
      
      // Show the results section
      predictionResults.classList.remove('hidden');
      
      // Scroll to results
      predictionResults.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Reset button click handler
    resetButton.addEventListener('click', () => {
      // Clear all input fields
      const inputFields = document.querySelectorAll('input[type="number"]');
      inputFields.forEach(input => {
        input.value = '';
      });
      
      // Hide the results section
      predictionResults.classList.add('hidden');
    });
  }
});

// Helper functions for prediction calculations
function normalizeValue(value, min, max, weight = 1) {
  // Normalize a value between 0 and 1 based on min/max range
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return normalized * weight;
}

function calculateProbability(factors) {
  // Calculate weighted average of factors
  if (factors.length === 0) return 0;
  
  const sum = factors.reduce((acc, val) => acc + val, 0);
  return sum / factors.length;
}

function updateProgressBar(id, probability) {
  // Update progress bar width and percentage text
  const percentage = Math.round(probability * 100);
  document.getElementById(`${id}-bar`).style.width = `${percentage}%`;
  document.getElementById(`${id}-percentage`).textContent = `${percentage}%`;
}