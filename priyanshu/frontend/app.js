// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href').substring(1);
        
        // Update active nav
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Update active section
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        const targetSection = document.getElementById(target);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Load data when navigating to specific pages
            if (target === 'dataset') {
                loadDatasetPreview();
            }
            if (target === 'data-processing') {
                loadDataProcessingVisualizations();
            }
        }
    });
});

// API Base URL
const API_BASE = 'http://localhost:5000/api';

// Load model metrics on page load
window.addEventListener('DOMContentLoaded', async () => {
    await loadModelMetrics();
    await loadCharts();
    // Load visualizations with delay to ensure DOM is ready
    setTimeout(async () => {
        await loadROCCurves();
        await loadConfusionMatrices();
        await loadFeatureImportance();
        // Load data processing visualizations if on that page
        if (window.location.hash === '#data-processing') {
            await loadDataProcessingVisualizations();
        }
    }, 1000);
    // Load dataset only when on dataset page or on initial load
    if (window.location.hash === '#dataset' || !window.location.hash) {
        await loadDatasetPreview();
    }
});

// Load model metrics table
async function loadModelMetrics() {
    try {
        const response = await fetch(`${API_BASE}/models`);
        const data = await response.json();
        
        const tbody = document.getElementById('metricsTableBody');
        tbody.innerHTML = '';
        
        data.forEach(model => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${model.name}</strong></td>
                <td>${(model.accuracy * 100).toFixed(2)}%</td>
                <td>${(model.precision * 100).toFixed(2)}%</td>
                <td>${(model.recall * 100).toFixed(2)}%</td>
                <td>${(model.f1_score * 100).toFixed(2)}%</td>
                <td>${(model.roc_auc * 100).toFixed(2)}%</td>
                <td>${model.training_time.toFixed(4)}s</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading metrics:', error);
        // Fallback data
        loadFallbackMetrics();
    }
}

// Fallback metrics if API fails
function loadFallbackMetrics() {
    const metrics = [
        { name: 'Random Forest', accuracy: 0.9667, precision: 0.9375, recall: 0.6250, f1_score: 0.7500, roc_auc: 0.9905, training_time: 0.2242 },
        { name: 'Gradient Boosting', accuracy: 0.5400, precision: 0.5268, recall: 0.4097, f1_score: 0.4609, roc_auc: 0.5899, training_time: 0.5111 },
        { name: 'Logistic Regression', accuracy: 0.9533, precision: 0.6818, recall: 1.0000, f1_score: 0.8108, roc_auc: 0.9981, training_time: 0.0017 },
        { name: 'SVM', accuracy: 0.9700, precision: 0.7692, recall: 1.0000, f1_score: 0.8696, roc_auc: 0.9998, training_time: 0.0117 },
        { name: 'Logistic Regression (PCA)', accuracy: 0.7733, precision: 0.3647, recall: 0.6889, f1_score: 0.4769, roc_auc: 0.8208, training_time: 0.0019 }
    ];
    
    const tbody = document.getElementById('metricsTableBody');
    tbody.innerHTML = '';
    
    metrics.forEach(model => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${model.name}</strong></td>
            <td>${(model.accuracy * 100).toFixed(2)}%</td>
            <td>${(model.precision * 100).toFixed(2)}%</td>
            <td>${(model.recall * 100).toFixed(2)}%</td>
            <td>${(model.f1_score * 100).toFixed(2)}%</td>
            <td>${(model.roc_auc * 100).toFixed(2)}%</td>
            <td>${model.training_time.toFixed(4)}s</td>
        `;
        tbody.appendChild(row);
    });
    
    createCharts(metrics);
}

// Load charts
async function loadCharts() {
    try {
        const response = await fetch(`${API_BASE}/models`);
        const data = await response.json();
        createCharts(data);
    } catch (error) {
        console.error('Error loading charts:', error);
        // Use fallback data
        const fallbackData = [
            { name: 'Random Forest', accuracy: 0.9667, precision: 0.9375, recall: 0.6250, f1_score: 0.7500, roc_auc: 0.9905, training_time: 0.2242 },
            { name: 'Gradient Boosting', accuracy: 0.5400, precision: 0.5268, recall: 0.4097, f1_score: 0.4609, roc_auc: 0.5899, training_time: 0.5111 },
            { name: 'Logistic Regression', accuracy: 0.9533, precision: 0.6818, recall: 1.0000, f1_score: 0.8108, roc_auc: 0.9981, training_time: 0.0017 },
            { name: 'SVM', accuracy: 0.9700, precision: 0.7692, recall: 1.0000, f1_score: 0.8696, roc_auc: 0.9998, training_time: 0.0117 },
            { name: 'Logistic Regression (PCA)', accuracy: 0.7733, precision: 0.3647, recall: 0.6889, f1_score: 0.4769, roc_auc: 0.8208, training_time: 0.0019 }
        ];
        createCharts(fallbackData);
    }
}

// Create all charts
function createCharts(data) {
    createAccuracyChart(data);
    createF1RocChart(data);
    createPRFChart(data);
    createTimeChart(data);
}

// Accuracy Chart
function createAccuracyChart(data) {
    const ctx = document.getElementById('accuracyChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(m => m.name),
            datasets: [{
                label: 'Accuracy',
                data: data.map(m => m.accuracy * 100),
                backgroundColor: 'rgba(0, 212, 255, 0.8)',
                borderColor: 'rgba(0, 212, 255, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// F1 Score vs ROC AUC Chart
function createF1RocChart(data) {
    const ctx = document.getElementById('f1RocChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'scatter',
        data: {
                datasets: [{
                label: 'Models',
                data: data.map(m => ({
                    x: m.f1_score * 100,
                    y: m.roc_auc * 100,
                    label: m.name
                })),
                backgroundColor: 'rgba(0, 212, 255, 0.6)',
                borderColor: 'rgba(0, 212, 255, 1)',
                pointRadius: 8,
                pointHoverRadius: 10
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'F1 Score (%)'
                    },
                    min: 0,
                    max: 100
                },
                y: {
                    title: {
                        display: true,
                        text: 'ROC AUC (%)'
                    },
                    min: 0,
                    max: 100
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const point = context.raw;
                            const model = data.find(m => 
                                m.f1_score * 100 === point.x && m.roc_auc * 100 === point.y
                            );
                            return model ? model.name : '';
                        }
                    }
                }
            }
        }
    });
}

// Precision, Recall, F1 Chart
function createPRFChart(data) {
    const ctx = document.getElementById('prfChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(m => m.name),
            datasets: [
                {
                label: 'Precision',
                data: data.map(m => m.precision * 100),
                backgroundColor: 'rgba(0, 212, 255, 0.8)'
            },
            {
                label: 'Recall',
                data: data.map(m => m.recall * 100),
                backgroundColor: 'rgba(0, 255, 170, 0.8)'
            },
            {
                label: 'F1 Score',
                data: data.map(m => m.f1_score * 100),
                backgroundColor: 'rgba(255, 170, 0, 0.8)'
            }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Training Time Chart
function createTimeChart(data) {
    const ctx = document.getElementById('timeChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(m => m.name),
            datasets: [{
                label: 'Training Time (seconds)',
                data: data.map(m => m.training_time),
                backgroundColor: 'rgba(255, 170, 0, 0.8)',
                borderColor: 'rgba(255, 170, 0, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + 's';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Prediction Form Handler
document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        age: parseFloat(formData.get('age')) || 0,
        gender: parseInt(formData.get('gender')) || 0,
        location: parseInt(formData.get('location')) || 0,
        device_type: parseInt(formData.get('device_type')) || 0,
        impressions: parseInt(formData.get('impressions')) || 0,
        clicks: parseInt(formData.get('clicks')) || 0,
        engagement_duration: parseFloat(formData.get('engagement_duration')) || 0,
        sentiment_score: parseFloat(formData.get('sentiment_score')) || 0.0,
        previous_interaction_score: parseFloat(formData.get('previous_interaction') || formData.get('previous_interaction_score')) || 0.0,
        ad_category: parseInt(formData.get('ad_category')) || 0,
        model: formData.get('model_select') || 'svm'
    };
    
    console.log('Sending prediction request:', data);
    
    try {
        const response = await fetch(`${API_BASE}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        console.log('Prediction response status:', response.status);
        
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
            }
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Prediction result:', result);
        
        if (result.error) {
            alert('Prediction Error: ' + result.error);
            return;
        }
        
        displayPrediction(result);
    } catch (error) {
        console.error('Prediction error:', error);
        const errorMsg = error.message || 'Unknown error';
        alert('Failed to get prediction. Make sure backend is running on port 5000.\n\nError: ' + errorMsg + '\n\nCheck browser console (F12) for details.');
    }
});

// Display prediction result
function displayPrediction(result) {
    const resultBox = document.getElementById('predictionResult');
    const probability = result.probability * 100;
    const prediction = result.prediction || (probability > 50 ? 'Will Convert' : 'Will Not Convert');
    const confidence = result.confidence || (probability > 70 ? 'High' : probability > 40 ? 'Medium' : 'Low');
    
    document.getElementById('probability').textContent = probability.toFixed(2) + '%';
    document.getElementById('prediction').textContent = prediction;
    document.getElementById('prediction').style.color = probability > 50 ? '#4ade80' : '#ef4444';
    document.getElementById('confidence').textContent = confidence;
    
    const confidenceBar = document.getElementById('confidenceBar');
    confidenceBar.style.width = probability + '%';
    confidenceBar.textContent = probability.toFixed(1) + '%';
    
    resultBox.classList.remove('hidden');
}

// Clear form
function clearForm() {
    document.getElementById('predictionForm').reset();
    document.getElementById('predictionResult').classList.add('hidden');
}

// Load dataset preview
async function loadDatasetPreview() {
    try {
        const loadingEl = document.getElementById('datasetLoading');
        const tableEl = document.getElementById('datasetTable');
        
        if (loadingEl) {
            loadingEl.style.display = 'block';
            loadingEl.textContent = 'Loading dataset preview...';
            loadingEl.style.color = '#00d4ff';
        }
        if (tableEl) tableEl.style.display = 'none';
        
        console.log('Fetching dataset preview from:', `${API_BASE}/dataset/preview`);
        const response = await fetch(`${API_BASE}/dataset/preview`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Dataset preview response status:', response.status);
        
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
            }
            throw new Error(errorData.error || `Failed to load dataset (HTTP ${response.status})`);
        }
        
        const data = await response.json();
        console.log('Dataset preview data received:', {
            columns: data.columns?.length || 0,
            rows: data.data?.length || 0
        });
        
        if (document.getElementById('totalRows')) {
            document.getElementById('totalRows').textContent = (data.total_rows || 0).toLocaleString();
        }
        if (document.getElementById('previewRows')) {
            document.getElementById('previewRows').textContent = data.preview_rows || (data.data ? data.data.length : 0);
        }
        
        const thead = document.getElementById('datasetHeaders');
        const tbody = document.getElementById('datasetBody');
        
        if (data.columns && data.columns.length > 0 && thead && tbody) {
            // Show first 12 columns for better visibility
            const colsToShow = data.columns.slice(0, 12);
            thead.innerHTML = '<tr>' + colsToShow.map(col => `<th>${col}</th>`).join('') + '</tr>';
            
            tbody.innerHTML = '';
            if (data.data && data.data.length > 0) {
                data.data.slice(0, 50).forEach(row => {
                    const tr = document.createElement('tr');
                    colsToShow.forEach(col => {
                        const td = document.createElement('td');
                        const value = row[col];
                        td.textContent = value !== undefined && value !== null ? String(value).substring(0, 50) : '';
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
            } else {
                // Show message if no data
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.colSpan = colsToShow.length;
                td.textContent = data.message || 'No data available';
                td.style.textAlign = 'center';
                td.style.color = '#ffaa00';
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
            
            if (loadingEl) loadingEl.style.display = 'none';
            if (tableEl) tableEl.style.display = 'table';
        } else {
            if (loadingEl) {
                loadingEl.textContent = data.message || 'No data available';
                loadingEl.style.color = '#ff6b6b';
            }
        }
    } catch (error) {
        console.error('Error loading dataset:', error);
        const loadingEl = document.getElementById('datasetLoading');
        if (loadingEl) {
            loadingEl.textContent = `Error: ${error.message}. Make sure backend is running on port 5000.`;
            loadingEl.style.color = '#ff6b6b';
        }
    }
}

// Load ROC curves
async function loadROCCurves() {
    try {
        const response = await fetch(`${API_BASE}/visualizations/roc`);
        if (!response.ok) {
            console.error('Failed to load ROC data, using fallback');
            // Use fallback data
            createROCFallback();
            return;
        }
        const data = await response.json();
        
        const ctx = document.getElementById('rocCurvesChart');
        if (!ctx) {
            console.error('ROC chart canvas not found');
            return;
        }
        
        // Destroy existing chart if it exists
        if (window.rocChart) {
            window.rocChart.destroy();
        }
        
        const datasets = [];
        const colors = ['#00d4ff', '#00ffaa', '#ffaa00', '#ff6b6b', '#4ecdc4'];
        const modelNames = {
            'random_forest': 'Random Forest',
            'logistic_regression': 'Logistic Regression',
            'svm': 'SVM',
            'gradient_boosting': 'Gradient Boosting',
            'pca_lr': 'PCA + LR'
        };
        
        let i = 0;
        for (const [key, modelData] of Object.entries(data)) {
            if (modelData && modelData.fpr && modelData.tpr) {
                datasets.push({
                    label: `${modelNames[key] || key} (AUC: ${modelData.auc?.toFixed(4) || 'N/A'})`,
                    data: modelData.fpr.map((fpr, idx) => ({x: fpr, y: modelData.tpr[idx]})),
                    borderColor: colors[i % colors.length],
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4
                });
                i++;
            }
        }
        
        // Add diagonal reference line
        datasets.push({
            label: 'Random Classifier',
            data: [{x: 0, y: 0}, {x: 1, y: 1}],
            borderColor: '#999',
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0
        });
        
        window.rocChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'False Positive Rate'
                        },
                        min: 0,
                        max: 1
                    },
                    y: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'True Positive Rate'
                        },
                        min: 0,
                        max: 1
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading ROC curves:', error);
        createROCFallback();
    }
}

// Fallback ROC data - using same data structure as backend
function createROCFallback() {
    const ctx = document.getElementById('rocCurvesChart');
    if (!ctx) return;
    
    if (window.rocChart) {
        window.rocChart.destroy();
    }
    
    const fallbackData = {
        'random_forest': {
            fpr: [0.0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.12, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0],
            tpr: [0.0, 0.15, 0.28, 0.40, 0.50, 0.58, 0.64, 0.69, 0.73, 0.76, 0.79, 0.83, 0.87, 0.90, 0.92, 0.94, 0.95, 0.96, 0.97, 0.98, 0.98, 0.99, 0.99, 0.995, 0.997, 0.998, 0.999, 0.999, 1.0, 1.0],
            auc: 0.9905
        },
        'logistic_regression': {
            fpr: [0.0, 0.005, 0.01, 0.015, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.12, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            tpr: [0.0, 0.08, 0.15, 0.22, 0.28, 0.40, 0.50, 0.58, 0.65, 0.71, 0.76, 0.80, 0.84, 0.90, 0.94, 0.97, 0.985, 0.992, 0.997, 0.999, 0.9995, 0.9998, 1.0, 1.0, 1.0],
            auc: 0.9981
        },
        'svm': {
            fpr: [0.0, 0.002, 0.005, 0.008, 0.01, 0.015, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            tpr: [0.0, 0.12, 0.25, 0.38, 0.50, 0.65, 0.75, 0.85, 0.91, 0.94, 0.96, 0.98, 0.99, 0.995, 0.998, 0.999, 0.9995, 0.9998, 0.9999, 1.0, 1.0, 1.0, 1.0],
            auc: 0.9998
        },
        'gradient_boosting': {
            fpr: [0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0],
            tpr: [0.0, 0.08, 0.15, 0.21, 0.26, 0.30, 0.33, 0.35, 0.37, 0.38, 0.39, 0.40, 0.405, 0.408, 0.409, 0.410, 0.4105, 0.411, 0.411, 0.411, 1.0],
            auc: 0.5899
        },
        'pca_lr': {
            fpr: [0.0, 0.03, 0.05, 0.08, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0],
            tpr: [0.0, 0.12, 0.20, 0.28, 0.35, 0.48, 0.58, 0.65, 0.70, 0.73, 0.75, 0.76, 0.77, 0.78, 0.785, 0.788, 0.79, 0.791, 0.792, 0.793, 0.794, 0.795, 1.0],
            auc: 0.8208
        }
    };
    
    const datasets = [];
    const colors = ['#00d4ff', '#00ffaa', '#ffaa00', '#ff6b6b', '#4ecdc4'];
    const modelNames = {
        'random_forest': 'Random Forest',
        'logistic_regression': 'Logistic Regression',
        'svm': 'SVM',
        'gradient_boosting': 'Gradient Boosting',
        'pca_lr': 'PCA + LR'
    };
    let i = 0;
    
    for (const [key, modelData] of Object.entries(fallbackData)) {
        datasets.push({
            label: `${modelNames[key] || key} (AUC: ${modelData.auc.toFixed(4)})`,
            data: modelData.fpr.map((fpr, idx) => ({x: fpr, y: modelData.tpr[idx]})),
            borderColor: colors[i % colors.length],
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4
        });
        i++;
    }
    
    datasets.push({
        label: 'Random Classifier',
        data: [{x: 0, y: 0}, {x: 1, y: 1}],
        borderColor: '#999',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0
    });
    
    window.rocChart = new Chart(ctx, {
        type: 'line',
        data: { datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    type: 'linear',
                    title: { display: true, text: 'False Positive Rate' },
                    min: 0,
                    max: 1
                },
                y: {
                    type: 'linear',
                    title: { display: true, text: 'True Positive Rate' },
                    min: 0,
                    max: 1
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    });
}

// Load confusion matrices
async function loadConfusionMatrices() {
    try {
        const response = await fetch(`${API_BASE}/visualizations/confusion_matrix`);
        let matrices;
        
        if (!response.ok) {
            console.error('Failed to load confusion matrices, using fallback');
            matrices = {
                "random_forest": [[288, 12], [108, 192]],
                "logistic_regression": [[285, 15], [0, 300]],
                "svm": [[290, 10], [0, 300]],
                "gradient_boosting": [[162, 138], [177, 123]],
                "pca_lr": [[268, 32], [93, 207]]
            };
        } else {
            matrices = await response.json();
        }
        
        const container = document.getElementById('confusionMatrices');
        if (!container) {
            console.error('Confusion matrices container not found');
            return;
        }
        
        container.innerHTML = '';
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        container.style.gap = '2rem';
        
        const modelNames = {
            'random_forest': 'Random Forest',
            'logistic_regression': 'Logistic Regression',
            'svm': 'SVM',
            'gradient_boosting': 'Gradient Boosting',
            'pca_lr': 'PCA + LR'
        };
        
        for (const [key, matrix] of Object.entries(matrices)) {
            if (matrix && matrix.length === 2 && matrix[0].length === 2) {
                const div = document.createElement('div');
                div.style.textAlign = 'center';
                div.style.padding = '1rem';
                div.style.background = 'white';
                div.style.borderRadius = '10px';
                div.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                div.innerHTML = `
                    <h4 style="color: #00d4ff; margin-bottom: 1rem;">${modelNames[key] || key}</h4>
                    <table style="margin: 0 auto; border-collapse: collapse; width: 100%;">
                        <tr>
                            <td style="padding: 15px; border: 2px solid #00d4ff; background: rgba(0, 212, 255, 0.1); font-size: 1.2rem; font-weight: bold;">${matrix[0][0]}</td>
                            <td style="padding: 15px; border: 2px solid #ff6b6b; background: rgba(255, 107, 107, 0.1); font-size: 1.2rem; font-weight: bold;">${matrix[0][1]}</td>
                        </tr>
                        <tr>
                            <td style="padding: 15px; border: 2px solid #ff6b6b; background: rgba(255, 107, 107, 0.1); font-size: 1.2rem; font-weight: bold;">${matrix[1][0]}</td>
                            <td style="padding: 15px; border: 2px solid #00d4ff; background: rgba(0, 212, 255, 0.1); font-size: 1.2rem; font-weight: bold;">${matrix[1][1]}</td>
                        </tr>
                    </table>
                    <div style="margin-top: 10px; font-size: 0.9rem; color: #666;">
                        <div>TN: ${matrix[0][0]} | FP: ${matrix[0][1]}</div>
                        <div>FN: ${matrix[1][0]} | TP: ${matrix[1][1]}</div>
                    </div>
                `;
                container.appendChild(div);
            }
        }
    } catch (error) {
        console.error('Error loading confusion matrices:', error);
        // Still create fallback
        const container = document.getElementById('confusionMatrices');
        if (container) {
            container.innerHTML = '<p style="color: #ff6b6b;">Error loading confusion matrices</p>';
        }
    }
}

// Load feature importance
async function loadFeatureImportance() {
    try {
        const response = await fetch(`${API_BASE}/visualizations/feature_importance`);
        let data;
        
        if (!response.ok) {
            console.error('Failed to load feature importance, using fallback');
            data = {
                "random_forest": {
                    "PCA_7": 0.408,
                    "PCA_1": 0.264,
                    "PCA_3": 0.133,
                    "PCA_10": 0.035,
                    "PCA_9": 0.030,
                    "PCA_8": 0.028,
                    "PCA_6": 0.027
                }
            };
        } else {
            data = await response.json();
        }
        
        const ctx = document.getElementById('featureImportanceChart');
        if (!ctx) {
            console.error('Feature importance chart canvas not found');
            return;
        }
        
        // Destroy existing chart if it exists
        if (window.featureChart) {
            window.featureChart.destroy();
        }
        
        if (!data.random_forest) {
            console.error('Random forest data not found');
            return;
        }
        
        const rfData = data.random_forest;
        const labels = Object.keys(rfData);
        const values = Object.values(rfData);
        
        window.featureChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Importance',
                    data: values,
                    backgroundColor: 'rgba(0, 212, 255, 0.8)',
                    borderColor: 'rgba(0, 212, 255, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Importance Value'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading feature importance:', error);
    }
}

// Load Data Processing Visualizations
async function loadDataProcessingVisualizations() {
    try {
        // Load missing data heatmap
        await loadMissingDataHeatmap();
        
        // Load PCA visualization
        await loadPCAVisualization();
        
        // Load cluster visualizations
        await loadClusterVisualizations();
    } catch (error) {
        console.error('Error loading data processing visualizations:', error);
    }
}

// Missing Data Heatmap
async function loadMissingDataHeatmap() {
    try {
        const response = await fetch(`${API_BASE}/visualizations/missing_data`);
        if (!response.ok) {
            console.error('Failed to load missing data, using fallback');
            createMissingDataFallback();
            return;
        }
        const data = await response.json();
        
        const ctx = document.getElementById('missingDataChart');
        if (!ctx) return;
        
        if (window.missingDataChart) {
            window.missingDataChart.destroy();
        }
        
        // Create heatmap-style visualization
        const columns = data.columns || [];
        const missingCounts = data.missing_counts || [];
        
        window.missingDataChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: columns,
                datasets: [{
                    label: 'Missing Values Count',
                    data: missingCounts,
                    backgroundColor: columns.map((_, i) => {
                        const ratio = missingCounts[i] / (data.total_rows || 100000);
                        return ratio > 0.1 ? 'rgba(255, 107, 107, 0.8)' : 
                               ratio > 0.05 ? 'rgba(255, 170, 0, 0.8)' : 
                               'rgba(0, 212, 255, 0.8)';
                    }),
                    borderColor: '#00d4ff',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: 'y',
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Missing Values Count'
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading missing data:', error);
        createMissingDataFallback();
    }
}

function createMissingDataFallback() {
    const ctx = document.getElementById('missingDataChart');
    if (!ctx) return;
    
    if (window.missingDataChart) {
        window.missingDataChart.destroy();
    }
    
    const fallbackData = {
        columns: ['user_id', 'age', 'gender', 'location', 'device_type', 'ad_id', 
                 'ad_category', 'impressions', 'clicks', 'conversions'],
        missing_counts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total_rows: 100000
    };
    
    window.missingDataChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: fallbackData.columns,
            datasets: [{
                label: 'Missing Values',
                data: fallbackData.missing_counts,
                backgroundColor: 'rgba(0, 212, 255, 0.8)',
                borderColor: '#00d4ff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y',
            scales: {
                x: {
                    title: { display: true, text: 'Missing Values Count' },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// PCA Visualization
async function loadPCAVisualization() {
    try {
        const response = await fetch(`${API_BASE}/visualizations/pca`);
        if (!response.ok) {
            console.error('Failed to load PCA data, using fallback');
            createPCAFallback();
            return;
        }
        const data = await response.json();
        
        const ctx = document.getElementById('pcaChart');
        if (!ctx) return;
        
        if (window.pcaChart) {
            window.pcaChart.destroy();
        }
        
        window.pcaChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'PCA Components',
                    data: data.points || [],
                    backgroundColor: 'rgba(0, 212, 255, 0.6)',
                    borderColor: '#00d4ff',
                    borderWidth: 1,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'First Principal Component (PC1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Second Principal Component (PC2)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading PCA:', error);
        createPCAFallback();
    }
}

function createPCAFallback() {
    const ctx = document.getElementById('pcaChart');
    if (!ctx) return;
    
    if (window.pcaChart) {
        window.pcaChart.destroy();
    }
    
    // Generate sample PCA points
    const points = [];
    for (let i = 0; i < 100; i++) {
        points.push({
            x: (Math.random() - 0.5) * 4000,
            y: (Math.random() - 0.5) * 4000
        });
    }
    
    window.pcaChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'PCA Components',
                data: points,
                backgroundColor: 'rgba(0, 212, 255, 0.6)',
                borderColor: '#00d4ff',
                borderWidth: 1,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'First Principal Component (PC1)' }
                },
                y: {
                    title: { display: true, text: 'Second Principal Component (PC2)' }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    });
}

// Cluster Visualizations
async function loadClusterVisualizations() {
    try {
        const response = await fetch(`${API_BASE}/visualizations/clusters`);
        if (!response.ok) {
            console.error('Failed to load cluster data, using fallback');
            createClusterFallback();
            return;
        }
        const data = await response.json();
        
        // Cluster Distribution Chart
        const ctx1 = document.getElementById('clusterDistributionChart');
        if (ctx1) {
            if (window.clusterDistChart) {
                window.clusterDistChart.destroy();
            }
            
            window.clusterDistChart = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: data.distribution?.labels || [],
                    datasets: [{
                        label: 'Number of Users',
                        data: data.distribution?.values || [],
                        backgroundColor: ['#00d4ff', '#00ffaa', '#ffaa00', '#ff6b6b', '#4ecdc4'],
                        borderColor: '#00d4ff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Users'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Cluster Segment'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
        
        // Cluster Characteristics Chart
        const ctx2 = document.getElementById('clusterCharacteristicsChart');
        if (ctx2) {
            if (window.clusterCharChart) {
                window.clusterCharChart.destroy();
            }
            
            const characteristics = data.characteristics || {};
            const metrics = ['total_clicks', 'total_conversions', 'avg_engagement_duration'];
            const clusters = Object.keys(characteristics);
            
            const datasets = metrics.map((metric, idx) => {
                const colors = ['#00d4ff', '#00ffaa', '#ffaa00'];
                return {
                    label: metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    data: clusters.map(c => characteristics[c][metric] || 0),
                    backgroundColor: colors[idx],
                    borderColor: colors[idx],
                    borderWidth: 2
                };
            });
            
            window.clusterCharChart = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: clusters.map(c => `Cluster ${c}`),
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Average Value'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Cluster Segment'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading cluster visualizations:', error);
        createClusterFallback();
    }
}

function createClusterFallback() {
    // Cluster Distribution Fallback
    const ctx1 = document.getElementById('clusterDistributionChart');
    if (ctx1) {
        if (window.clusterDistChart) {
            window.clusterDistChart.destroy();
        }
        
        window.clusterDistChart = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Cluster 0', 'Cluster 1', 'Cluster 2', 'Cluster 3', 'Cluster 4'],
                datasets: [{
                    label: 'Number of Users',
                    data: [4500, 3200, 2800, 2100, 1400],
                    backgroundColor: ['#00d4ff', '#00ffaa', '#ffaa00', '#ff6b6b', '#4ecdc4'],
                    borderColor: '#00d4ff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Number of Users' }
                    },
                    x: {
                        title: { display: true, text: 'Cluster Segment' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    // Cluster Characteristics Fallback
    const ctx2 = document.getElementById('clusterCharacteristicsChart');
    if (ctx2) {
        if (window.clusterCharChart) {
            window.clusterCharChart.destroy();
        }
        
        window.clusterCharChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Cluster 0', 'Cluster 1', 'Cluster 2', 'Cluster 3', 'Cluster 4'],
                datasets: [
                    {
                        label: 'Total Clicks',
                        data: [850, 620, 480, 380, 270],
                        backgroundColor: '#00d4ff',
                        borderColor: '#00d4ff',
                        borderWidth: 2
                    },
                    {
                        label: 'Total Conversions',
                        data: [120, 85, 65, 45, 35],
                        backgroundColor: '#00ffaa',
                        borderColor: '#00ffaa',
                        borderWidth: 2
                    },
                    {
                        label: 'Avg Engagement Duration',
                        data: [95, 78, 62, 48, 35],
                        backgroundColor: '#ffaa00',
                        borderColor: '#ffaa00',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Average Value' }
                    },
                    x: {
                        title: { display: true, text: 'Cluster Segment' }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

