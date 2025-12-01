// ===================== DASHBOARD FUNCTIONALITY =====================

// Check if user is logged in
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
}

// Sample Data
const sampleItems = [
    { id: 'SKU001', name: 'Industrial Motor', category: 'Machinery', stock: 45, minStock: 10, status: 'optimal' },
    { id: 'SKU002', name: 'Steel Bearing', category: 'Components', stock: 8, minStock: 15, status: 'critical' },
    { id: 'SKU003', name: 'Copper Wire', category: 'Materials', stock: 156, minStock: 50, status: 'optimal' },
    { id: 'SKU004', name: 'Hydraulic Pump', category: 'Machinery', stock: 12, minStock: 10, status: 'warning' },
    { id: 'SKU005', name: 'Rubber Gasket', category: 'Components', stock: 287, minStock: 100, status: 'optimal' },
    { id: 'SKU006', name: 'Aluminum Rod', category: 'Materials', stock: 5, minStock: 25, status: 'critical' },
    { id: 'SKU007', name: 'Electric Motor', category: 'Machinery', stock: 34, minStock: 10, status: 'optimal' },
    { id: 'SKU008', name: 'Circuit Board', category: 'Electronics', stock: 18, minStock: 20, status: 'warning' },
    { id: 'SKU009', name: 'Stainless Steel Plate', category: 'Materials', stock: 92, minStock: 50, status: 'optimal' },
    { id: 'SKU010', name: 'Precision Bearing', category: 'Components', stock: 3, minStock: 5, status: 'critical' }
];

// Search Functionality
const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');
const searchResults = document.getElementById('searchResults');

if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchInput.addEventListener('blur', () => {
        setTimeout(() => searchSuggestions.innerHTML = '', 300);
    });
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    
    if (query.length === 0) {
        searchSuggestions.innerHTML = '';
        searchResults.innerHTML = '';
        return;
    }
    
    // Get suggestions
    const suggestions = sampleItems.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    ).slice(0, 5);
    
    // Display suggestions
    searchSuggestions.innerHTML = suggestions.map(item =>
        `<div class="suggestion-item" onclick="selectSuggestion('${item.id}')">${item.name} (${item.id})</div>`
    ).join('');
    
    // Display full results
    displaySearchResults(suggestions);
}

function selectSuggestion(id) {
    searchInput.value = sampleItems.find(item => item.id === id).name;
    handleSearch({ target: searchInput });
}

function displaySearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No items found</p>';
        return;
    }
    
    searchResults.innerHTML = results.map(item =>
        `<div class="result-item">
            <div>
                <strong>${item.name}</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted);">${item.id} • ${item.category}</p>
            </div>
            <div style="text-align: right;">
                <p><strong>${item.stock}</strong> units</p>
                <span class="status ${item.status}">${item.status.toUpperCase()}</span>
            </div>
        </div>`
    ).join('');
}

// Forecast Controls
const forecastBtns = document.querySelectorAll('.forecast-btn');
forecastBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        forecastBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        updateCharts(parseInt(this.dataset.days));
    });
});

// Utility function (debounce)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Date Picker
const datePicker = document.getElementById('datePicker');
if (datePicker) {
    datePicker.valueAsDate = new Date();
    datePicker.addEventListener('change', () => {
        console.log('Selected date:', datePicker.value);
    });
}

// Stat Card Animation on Hover
const statCards = document.querySelectorAll('.stat-card');
statCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = 'var(--shadow-lg)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'var(--shadow-md)';
    });
});

// Populate sample items table
const itemsTableBody = document.getElementById('itemsTableBody');
if (itemsTableBody) {
    itemsTableBody.innerHTML = sampleItems.slice(0, 5).map(item =>
        `<tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td><span class="status ${item.status}">${item.status.toUpperCase()}</span></td>
            <td>${item.status === 'critical' ? '<button class="btn-small critical-btn">Reorder</button>' : '<button class="btn-small">View</button>'}</td>
        </tr>`
    ).join('');
}

// Function to update charts (called when forecast range changes)
function updateCharts(days) {
    console.log(`Updating charts for ${days} days forecast`);
    // Charts will be updated by charts.js
}

// Sidebar Active State
const sidebarNavItems = document.querySelectorAll('.nav-item');
sidebarNavItems.forEach(item => {
    item.addEventListener('click', function() {
        sidebarNavItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

// Logout Button
const logoutBtn = document.querySelector('.btn-logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'index.html';
        }
    });
}

// Refresh Button
const refreshBtn = document.querySelector('button[title="Refresh"]');
if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
        this.style.animation = 'rotate 1s linear';
        setTimeout(() => {
            this.style.animation = '';
            // Reload data
            displaySearchResults([]);
            updateCharts(7);
        }, 1000);
    });
}

// Settings Button
const settingsBtn = document.querySelector('button[title="Settings"]');
if (settingsBtn) {
    settingsBtn.addEventListener('click', function() {
        alert('Settings panel would open here');
    });
}

// Real-time Clock Update (in Last Updated stat)
function updateLastUpdated() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length > 3) {
        const timeAgo = Math.floor(Math.random() * 2) + 1; // 1-2 hours
        statValues[3].textContent = timeAgo + ' hour' + (timeAgo > 1 ? 's' : '');
    }
}

setInterval(updateLastUpdated, 60000); // Update every minute
updateLastUpdated();

// Initialize Dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard loaded successfully');
    displaySearchResults(sampleItems.slice(0, 3));
});
