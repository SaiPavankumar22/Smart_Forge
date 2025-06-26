document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved theme preference or use the system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    document.body.classList.add('dark-theme');
  }
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  });
  
  // Load type change handler
  const loadType = document.getElementById('load-type');
  const loadValueContainer = document.getElementById('load-value-container');
  
  loadType.addEventListener('change', () => {
    if (loadType.value) {
      loadValueContainer.style.display = 'block';
      document.getElementById('load-value').placeholder = `Enter ${loadType.value} load value`;
    } else {
      loadValueContainer.style.display = 'none';
    }
  });
  
  // Environment type change handler
  const environmentType = document.getElementById('environment');
  const environmentValueContainer = document.getElementById('environment-value-container');
  
  environmentType.addEventListener('change', () => {
    if (environmentType.value) {
      environmentValueContainer.style.display = 'block';
      document.getElementById('environment-value').placeholder = `Enter ${environmentType.options[environmentType.selectedIndex].text} value`;
    } else {
      environmentValueContainer.style.display = 'none';
    }
  });
  
  // Reset button functionality
  const resetBtn = document.getElementById('reset-btn');
  resetBtn.addEventListener('click', () => {
    document.getElementById('uts').value = '';
    document.getElementById('conductivity').value = '';
    document.getElementById('elongation').value = '';
    document.getElementById('hardness').value = '';
    document.getElementById('load-type').value = '';
    document.getElementById('load-value').value = '';
    document.getElementById('environment').value = '';
    document.getElementById('environment-value').value = '';
    loadValueContainer.style.display = 'none';
    environmentValueContainer.style.display = 'none';
    
    document.getElementById('lifespan-result').innerHTML = 
      '<p>Complete the form and click "Estimate Lifespan" to see results</p>';
  });
  
  // Estimate button functionality
  const estimateBtn = document.getElementById('estimate-btn');
  estimateBtn.addEventListener('click', estimateLifespan);
  
  function estimateLifespan() {
    // Get all input values
    const uts = parseFloat(document.getElementById('uts').value);
    const conductivity = parseFloat(document.getElementById('conductivity').value);
    const elongation = parseFloat(document.getElementById('elongation').value);
    const hardness = parseFloat(document.getElementById('hardness').value);
    const loadType = document.getElementById('load-type').value;
    const loadValue = parseFloat(document.getElementById('load-value').value);
    const environment = document.getElementById('environment').value;
    const environmentValue = parseFloat(document.getElementById('environment-value').value);
    
    // Validate inputs
    if (!uts || !conductivity || !elongation || !hardness || !loadType || !loadValue || !environment || !environmentValue) {
      document.getElementById('lifespan-result').innerHTML = 
        '<p class="error-message">Please fill in all fields to estimate lifespan</p>';
      return;
    }
    
    
  }
});
document.getElementById("estimate-btn").addEventListener("click", async function () {
  const inputData = {
      uts: document.getElementById("uts").value,
      conductivity: document.getElementById("conductivity").value,
      elongation: document.getElementById("elongation").value,
      hardness: document.getElementById("hardness").value,
      load_type: document.getElementById("load-type").value,
      environment: document.getElementById("environment").value
  };

  // Send data to Flask backend
  const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputData)
  });

  const result = await response.json();

  // Display the result
  document.getElementById("lifespan-result").innerHTML = result.error
      ? `<p style="color:red;">Error: ${result.error}</p>`
      : `<p>Predicted Lifespan: <strong>${result.lifespan.toFixed(2)}</strong> months</p>`;
});

// Reset button functionality
document.getElementById("reset-btn").addEventListener("click", function () {
  document.getElementById("uts").value = "";
  document.getElementById("conductivity").value = "";
  document.getElementById("elongation").value = "";
  document.getElementById("hardness").value = "";
  document.getElementById("load-type").value = "";
  document.getElementById("environment").value = "";
  document.getElementById("lifespan-result").innerHTML = "<p>Complete the form and click 'Estimate Lifespan' to see results</p>";
});
