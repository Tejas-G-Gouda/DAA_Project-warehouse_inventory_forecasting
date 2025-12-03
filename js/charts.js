// ===================== CHART INITIALIZATION =====================

let forecastChart = null;
let heatmapChart = null;
let categoryChart = null;

function loadItemsForCharts() {
    try {
        const raw = localStorage.getItem('itemsList');
        if (raw) return JSON.parse(raw);
    } catch (e) {
        console.warn('charts.js: failed to load items from localStorage', e);
    }
    return null;
}

// Generate sample data for 7, 30, and 90 days
function generateForecastData(days) {
    const labels = [];
    const optimalData = [];
    const warningData = [];
    const criticalData = [];
    
    for (let i = 0; i < days; i++) {
        labels.push(`Day ${i + 1}`);
        optimalData.push(Math.floor(Math.random() * 1000) + 500);
        warningData.push(Math.floor(Math.random() * 300) + 100);
        criticalData.push(Math.floor(Math.random() * 100) + 20);
    }
    
    return { labels, optimalData, warningData, criticalData };
}

// Forecast Chart
const forecastCtx = document.getElementById('forecastChart');
if (forecastCtx) {
    let data = generateForecastData(7);
    
    forecastChart = new Chart(forecastCtx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Optimal Stock',
                    data: data.optimalData,
                    borderColor: '#14b8a6',
                    backgroundColor: 'rgba(20, 184, 166, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#14b8a6',
                    pointBorderColor: '#0a0f1f',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7,
                    shadowColor: 'rgba(20, 184, 166, 0.3)',
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 5
                },
                {
                    label: 'Warning Level',
                    data: data.warningData,
                    borderColor: '#fbbf24',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#fbbf24',
                    pointBorderColor: '#0a0f1f',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                },
                {
                    label: 'Critical Level',
                    data: data.criticalData,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#0a0f1f',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#e0e7ff',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12,
                            weight: 600
                        },
                        usePointStyle: true,
                        padding: 20,
                        boxWidth: 8,
                        boxHeight: 8
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(20, 30, 47, 0.95)',
                    titleColor: '#e0e7ff',
                    bodyColor: '#a5b4fc',
                    borderColor: '#3ab8ff',
                    borderWidth: 1,
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    displayColors: true,
                    callbacks: {
                        afterLabel: function(context) {
                            return 'Stock Level: ' + context.parsed.y + ' units';
                        }
                    }
                },
                filler: {
                    propagate: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#a5b4fc',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: '#a5b4fc',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        }
    });
    
    // Update chart when forecast range changes
    document.querySelectorAll('.forecast-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const days = parseInt(this.dataset.days);
            const newData = generateForecastData(days);
            
            forecastChart.data.labels = newData.labels;
            forecastChart.data.datasets[0].data = newData.optimalData;
            forecastChart.data.datasets[1].data = newData.warningData;
            forecastChart.data.datasets[2].data = newData.criticalData;
            forecastChart.update('active');
        });
    });
}

// Expose updateCharts globally so dashboard can call it when items change
window.updateCharts = function(days = 7) {
    // regenerate forecast (still synthetic)
    if (forecastChart) {
        const d = generateForecastData(days);
        forecastChart.data.labels = d.labels;
        forecastChart.data.datasets[0].data = d.optimalData;
        forecastChart.data.datasets[1].data = d.warningData;
        forecastChart.data.datasets[2].data = d.criticalData;
        forecastChart.update();
    }

    // update heatmap based on items
    const items = loadItemsForCharts();
    if (heatmapChart && items) {
        // compute shortage risk per category as percentage of items in category that are warning/critical
        const categories = Array.from(new Set(items.map(i => i.category)));
        const labels = categories;
        const data = categories.map(cat => {
            const subset = items.filter(it => it.category === cat);
            if (subset.length === 0) return 0;
            const atRisk = subset.filter(it => it.status === 'warning' || it.status === 'critical').length;
            return Math.round((atRisk / subset.length) * 100);
        });

        heatmapChart.data.labels = labels;
        heatmapChart.data.datasets[0].data = data;
        heatmapChart.data.datasets[0].backgroundColor = data.map(val => val > 70 ? '#ef4444' : (val > 50 ? '#fbbf24' : '#14b8a6'));
        heatmapChart.data.datasets[0].borderColor = data.map(val => val > 70 ? '#dc2626' : (val > 50 ? '#d97706' : '#0d9488'));
        heatmapChart.update();
    }

    // update category chart
    if (categoryChart && items) {
        const categories = Array.from(new Set(items.map(i => i.category)));
        const counts = categories.map(cat => items.filter(it => it.category === cat).length);
        categoryChart.data.labels = categories;
        categoryChart.data.datasets[0].data = counts;
        categoryChart.update();
    }
}

// Shortage Heatmap Chart (Bar Chart)
const heatmapCtx = document.getElementById('heatmapChart');
if (heatmapCtx) {
    // Initialize with placeholder values; updateCharts() will overwrite using localStorage
    const heatmapLabels = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'];
    const heatmapData = [25, 45, 60, 80, 35];
    
    heatmapChart = new Chart(heatmapCtx, {
        type: 'bar',
        data: {
            labels: heatmapLabels,
            datasets: [{
                label: 'Shortage Risk %',
                data: heatmapData,
                backgroundColor: heatmapData.map(val => {
                    if (val > 70) return '#ef4444'; // Red for critical
                    if (val > 50) return '#fbbf24'; // Yellow for warning
                    return '#14b8a6'; // Teal for optimal
                }),
                borderColor: heatmapData.map(val => {
                    if (val > 70) return '#dc2626';
                    if (val > 50) return '#d97706';
                    return '#0d9488';
                }),
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: heatmapData.map(val => {
                    if (val > 70) return '#dc2626';
                    if (val > 50) return '#d97706';
                    return '#0d9488';
                })
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e7ff',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12,
                            weight: 600
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(20, 30, 47, 0.95)',
                    titleColor: '#e0e7ff',
                    bodyColor: '#a5b4fc',
                    borderColor: '#3ab8ff',
                    borderWidth: 1,
                    padding: 10,
                    callbacks: {
                        afterLabel: function(context) {
                            return 'Risk Level: ' + context.parsed.x + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#a5b4fc',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: '#a5b4fc',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        }
    });
}

// Pie Chart for Dashboard (Optional - for category distribution)
function createCategoryChart() {
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Machinery', 'Components', 'Materials', 'Electronics', 'Miscellaneous'],
                datasets: [{
                    data: [25, 20, 35, 12, 8],
                    backgroundColor: [
                        '#3ab8ff',
                        '#a855f7',
                        '#14b8a6',
                        '#fbbf24',
                        '#ef4444'
                    ],
                    borderColor: '#0a0f1f',
                    borderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#e0e7ff',
                            font: {
                                family: "'Inter', sans-serif",
                                size: 12,
                                weight: 600
                            },
                            padding: 15
                        }
                    }
                }
            }
        });
    }
}

createCategoryChart();

// Run initial chart update from localStorage items if available
window.addEventListener('load', function() {
    // call with default 7 days
    if (typeof window.updateCharts === 'function') window.updateCharts(7);
});

// ===================== CHART ANIMATIONS =====================

// Animate chart elements on scroll
const chartContainers = document.querySelectorAll('.forecast-section, .alerts-section');
chartContainers.forEach(container => {
    container.style.opacity = '0';
    container.style.transform = 'translateY(30px)';
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'all 0.6s ease-out';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(container);
});

console.log('Charts initialized successfully');
