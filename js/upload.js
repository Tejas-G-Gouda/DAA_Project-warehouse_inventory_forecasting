// ===================== UPLOAD FUNCTIONALITY =====================

const dragDropArea = document.getElementById('dragDropArea');
const fileInput = document.getElementById('fileInput');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const filePreview = document.getElementById('filePreview');
const successMessage = document.getElementById('successMessage');
const uploadBtn = document.getElementById('uploadBtn');
const clearFileBtn = document.getElementById('clearFile');
const uploadAnother = document.getElementById('uploadAnother');

let selectedFile = null;

// Browse Files Button Click
if (dragDropArea) {
    const browseBtn = dragDropArea.querySelector('.btn-primary');
    browseBtn.addEventListener('click', () => fileInput.click());
}

// File Input Change
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });
}

// Drag and Drop Events
if (dragDropArea) {
    dragDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragDropArea.style.borderColor = '#3ab8ff';
        dragDropArea.style.backgroundColor = 'rgba(58, 184, 255, 0.1)';
    });
    
    dragDropArea.addEventListener('dragleave', () => {
        dragDropArea.style.borderColor = 'var(--neon-blue)';
        dragDropArea.style.backgroundColor = 'transparent';
    });
    
    dragDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dragDropArea.style.borderColor = 'var(--neon-blue)';
        dragDropArea.style.backgroundColor = 'transparent';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });
}

// Handle File Selection
function handleFileSelect(file) {
    // Validate file type
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(file.type) && !['csv', 'xlsx', 'xls', 'json'].includes(fileExtension)) {
        showError('Invalid file type. Please upload CSV, XLSX, or JSON files.');
        return;
    }
    
    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
        showError('File size exceeds 50MB limit.');
        return;
    }
    
    selectedFile = file;
    
    // Hide upload zone, show preview
    if (dragDropArea) dragDropArea.parentElement.style.display = 'none';
    filePreview.classList.remove('hidden');
    
    // Display file info
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    
    // Load and display preview
    loadFilePreview(file);
}

// Load File Preview
function loadFilePreview(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const content = e.target.result;
        let rows = [];
        
        if (file.name.endsWith('.csv')) {
            rows = parseCSV(content);
        } else if (file.name.endsWith('.json')) {
            rows = parseJSON(content);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            // For simplicity, show a message for Excel files
            showExcelMessage();
            return;
        }
        
        displayPreview(rows);
    };
    
    reader.readAsText(file);
}

// Parse CSV
function parseCSV(content) {
    const lines = content.split('\n');
    const rows = [];
    
    for (let i = 0; i < Math.min(10, lines.length); i++) {
        if (lines[i].trim()) {
            rows.push(lines[i].split(',').map(cell => cell.trim()));
        }
    }
    
    return rows;
}

// Parse JSON
function parseJSON(content) {
    try {
        const data = JSON.parse(content);
        if (Array.isArray(data)) {
            return data.slice(0, 10).map(obj => Object.values(obj));
        }
        return [];
    } catch (e) {
        showError('Invalid JSON format');
        return [];
    }
}

// Display Preview
function displayPreview(rows) {
    const previewTable = document.querySelector('.preview-table tbody');
    previewTable.innerHTML = '';
    
    rows.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = row.map((cell, i) => 
            `<td>${String(cell).substring(0, 30)}${String(cell).length > 30 ? '...' : ''}</td>`
        ).join('');
        previewTable.appendChild(tr);
    });
}

// Show Excel Message
function showExcelMessage() {
    const previewTable = document.querySelector('.preview-table tbody');
    previewTable.innerHTML = `
        <tr>
            <td colspan="100%" style="text-align: center; padding: 2rem;">
                <p style="color: var(--text-secondary);">📊 Excel file selected</p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Preview will be displayed after upload</p>
            </td>
        </tr>
    `;
}

// Upload Button Click
if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
        simulateUpload();
    });
}

// Simulate Upload Process
function simulateUpload() {
    filePreview.classList.add('hidden');
    uploadProgress.classList.remove('hidden');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                uploadProgress.classList.add('hidden');
                showSuccessMessage();
            }, 500);
        }
        
        updateProgressBar(progress);
    }, 300);
}

// Update Progress Bar
function updateProgressBar(progress) {
    progressFill.style.width = progress + '%';
    progressText.textContent = `Uploading... ${Math.min(100, Math.round(progress))}%`;
}

// Show Success Message
function showSuccessMessage() {
    successMessage.classList.remove('hidden');
    
    // Animate success stats
    document.getElementById('itemsProcessed').textContent = Math.floor(Math.random() * 5000) + 1000;
    document.getElementById('processingTime').textContent = (Math.random() * 5 + 2).toFixed(1) + 's';
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth' });
}

// Clear File
if (clearFileBtn) {
    clearFileBtn.addEventListener('click', resetUpload);
}

// Upload Another
if (uploadAnother) {
    uploadAnother.addEventListener('click', resetUpload);
}

// Reset Upload
function resetUpload() {
    selectedFile = null;
    fileInput.value = '';
    filePreview.classList.add('hidden');
    successMessage.classList.add('hidden');
    if (dragDropArea) dragDropArea.parentElement.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = 'Uploading... 0%';
}

// Format File Size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes, k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Show Error Message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slide-in-right 0.3s ease-out;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slide-in-right 0.3s ease-out reverse';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

// Drag Drop Animation
if (dragDropArea) {
    const uploadIcon = dragDropArea.querySelector('.upload-icon');
    
    dragDropArea.addEventListener('mouseenter', () => {
        uploadIcon.style.transform = 'scale(1.1) rotate(360deg)';
        uploadIcon.style.transition = 'transform 0.6s ease';
    });
    
    dragDropArea.addEventListener('mouseleave', () => {
        uploadIcon.style.transform = 'scale(1) rotate(0deg)';
    });
}

console.log('Upload functionality initialized');
