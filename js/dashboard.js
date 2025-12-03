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
const defaultItems = [
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

// Items will be loaded from localStorage if available, otherwise use defaults
function loadItems() {
    try {
        const raw = localStorage.getItem('itemsList');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {
        console.warn('Failed to load items from localStorage', e);
    }
    // clone defaultItems to avoid accidental mutation of the constant
    const clone = JSON.parse(JSON.stringify(defaultItems));
    localStorage.setItem('itemsList', JSON.stringify(clone));
    return clone;
}

function saveItems(list) {
    localStorage.setItem('itemsList', JSON.stringify(list));
}

let items = loadItems();

// Utility: refresh UI elements that depend on items
function refreshAllItemViews() {
    populateItemsTable();
    populateDropdowns();
    displaySearchResults(items.slice(0, 3));
    // notify charts to refresh if needed
    updateCharts(7);
}

// Helpers for inline form errors
function showFormError(containerId, message) {
    const el = document.getElementById(containerId);
    if (!el) {
        alert(message);
        return;
    }
    el.textContent = message;
    el.classList.add('active');
}

function clearFormError(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.textContent = '';
    el.classList.remove('active');
}

function markInputError(el, flag) {
    if (!el) return;
    if (flag) el.classList.add('input-error'); else el.classList.remove('input-error');
}

// Populate purchase/restock dropdowns
function populateDropdowns() {
    const optionHtml = items.map(it => `<option value="${it.id}">${it.name} (${it.id}) — ${it.stock} units</option>`).join('');

    const purchaseSelect = document.getElementById('purchaseItemSelect');
    const restockSelect = document.getElementById('restockItemSelect');
    if (purchaseSelect) purchaseSelect.innerHTML = optionHtml;
    if (restockSelect) restockSelect.innerHTML = optionHtml;

    // Update any other selects across the site that use the shared class
    const otherSelects = document.querySelectorAll('select.item-select');
    otherSelects.forEach(s => s.innerHTML = optionHtml);
}

// Handle purchase action
function handlePurchase(e) {
    e && e.preventDefault();
    const customerInput = document.getElementById('purchaseCustomer');
    const itemSelect = document.getElementById('purchaseItemSelect');
    const qtyInput = document.getElementById('purchaseQty');

    // clear previous errors
    clearFormError('purchaseError');
    markInputError(customerInput, false);
    markInputError(qtyInput, false);

    if (!customerInput || !itemSelect || !qtyInput) return;

    const customer = customerInput.value.trim();
    if (!customer) {
        showFormError('purchaseError', 'Customer name is required.');
        markInputError(customerInput, true);
        return;
    }

    const itemId = itemSelect.value;
    const qty = parseInt(qtyInput.value, 10);
    if (!itemId || isNaN(qty) || qty <= 0) {
        showFormError('purchaseError', 'Please enter a valid purchase quantity (> 0).');
        markInputError(qtyInput, true);
        return;
    }

    const idx = items.findIndex(it => it.id === itemId);
    if (idx === -1) {
        showFormError('purchaseError', 'Selected item not found.');
        return;
    }

    if (qty > items[idx].stock) {
        showFormError('purchaseError', 'Not enough stock.');
        markInputError(qtyInput, true);
        return;
    }

    // Perform purchase
    items[idx].stock -= qty;
    // update status based on minStock
    items[idx].status = items[idx].stock <= items[idx].minStock ? (items[idx].stock === 0 ? 'critical' : 'warning') : 'optimal';

    saveItems(items);
    refreshAllItemViews();

    // success
    alert('Purchase recorded successfully.');
    // clear form
    qtyInput.value = '';
    customerInput.value = '';
    clearFormError('purchaseError');
}

// Handle restock action
function handleRestock(e) {
    e && e.preventDefault();
    const itemSelect = document.getElementById('restockItemSelect');
    const qtyInput = document.getElementById('restockQty');

    // clear previous errors
    clearFormError('restockError');
    markInputError(qtyInput, false);

    if (!itemSelect || !qtyInput) return;

    const itemId = itemSelect.value;
    const qty = parseInt(qtyInput.value, 10);
    if (!itemId || isNaN(qty) || qty <= 0) {
        showFormError('restockError', 'Please enter a valid restock quantity (> 0).');
        markInputError(qtyInput, true);
        return;
    }

    const idx = items.findIndex(it => it.id === itemId);
    if (idx === -1) {
        showFormError('restockError', 'Selected item not found.');
        return;
    }

    items[idx].stock += qty;
    items[idx].status = items[idx].stock <= items[idx].minStock ? 'warning' : 'optimal';

    saveItems(items);
    refreshAllItemViews();

    alert('Item restocked successfully.');
    qtyInput.value = '';
    clearFormError('restockError');
}

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
    const suggestions = items.filter(item =>
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
    const found = items.find(item => item.id === id);
    if (found) searchInput.value = found.name;
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

// Populate items table from current items list
function populateItemsTable() {
    const itemsTableBody = document.getElementById('itemsTableBody');
    if (!itemsTableBody) return;
    itemsTableBody.innerHTML = items.slice(0, 10).map(item =>
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

// initial populate when script loads
populateItemsTable();
populateDropdowns();

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
    displaySearchResults(items.slice(0, 3));
    // wire up purchase/restock form buttons if present
    const purchaseForm = document.getElementById('purchaseForm');
    if (purchaseForm) purchaseForm.addEventListener('submit', handlePurchase);
    const restockForm = document.getElementById('restockForm');
    if (restockForm) restockForm.addEventListener('submit', handleRestock);
});
