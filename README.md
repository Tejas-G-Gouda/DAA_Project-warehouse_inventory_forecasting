# 🚀 InvenForecast - AI-Powered Inventory Forecasting System

A modern, ultra-premium web application for intelligent warehouse inventory management, real-time search, and predictive analytics using advanced algorithms.

## ✨ Features

### 🏠 **Homepage**
- Stunning hero section with animated neon elements
- Feature highlights with glassmorphism cards
- Call-to-action sections for quick navigation
- Premium, modern design with smooth animations

### 📊 **Dashboard**
- **Real-time Stats Cards**: Total items, shortage alerts, forecast accuracy
- **Fast Search Panel**: Binary search-powered item lookup with suggestions
- **Forecast Trends**: Dynamic line charts with 7/30/90 day views
- **Shortage Heatmap**: Visual risk assessment with color-coded warnings
- **Items Table**: Quick overview of inventory status
- **Sidebar Navigation**: Organized menu with active states

### 📁 **Upload Page**
- Drag-and-drop file upload with visual feedback
- Support for CSV, XLSX, and JSON formats
- File preview with data validation
- Progress tracking and success animations
- Best practices tips section

### 🧠 **Algorithms Showcase**
- Binary Search Tree visualization
- AVL Tree self-balancing demonstration
- Sorting algorithms (Merge Sort/Quick Sort)
- Dynamic Programming for forecasting
- Algorithm comparison table with complexities

## 🎨 Design System

### Color Palette
- **Background**: `#0a0f1f` (Deep navy)
- **Neon Blue**: `#3ab8ff`
- **Neon Purple**: `#a855f7`
- **Neon Teal**: `#14b8a6`
- **Text Primary**: `#e0e7ff`
- **Text Secondary**: `#a5b4fc`

### Typography
- **Headlines**: Poppins (700)
- **Body**: Inter (400-600)
- **Monospace**: Space Grotesk (500-700)

### Visual Effects
- Glassmorphism cards with backdrop blur
- Neon glow effects
- Smooth transitions (0.3s cubic-bezier)
- Parallax scrolling
- Particle effects on interactions

## 🔧 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js 3.9.1
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Inter, Poppins, Space Grotesk)
- **Animations**: Custom CSS keyframes + JavaScript

## 📁 Project Structure

```
inventory-forecast-system/
├── index.html              # Homepage
├── dashboard.html          # Main dashboard
├── upload.html             # File upload page
├── algorithms.html         # Algorithm showcase
├── css/
│   ├── styles.css         # Main stylesheet (1000+ lines)
│   └── animations.css     # Animation definitions
├── js/
│   ├── main.js            # Global utilities & navigation
│   ├── dashboard.js       # Dashboard functionality
│   ├── charts.js          # Chart.js configurations
│   └── upload.js          # File upload handling
└── assets/                # Images, icons (if needed)
```

## 🚀 Quick Start

### Method 1: Direct Browser (Simple)
1. Clone or download the project
2. Open `index.html` in your web browser
3. Navigate through the application

### Method 2: Local Server (Recommended)

**Using Python 3:**
```bash
cd inventory-forecast-system
python -m http.server 8000
# Visit http://localhost:8000
```

**Using Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Using Node.js (http-server):**
```bash
npm install -g http-server
cd inventory-forecast-system
http-server -p 8000
```

**Using PowerShell:**
```powershell
# Navigate to project folder
cd "inventory-forecast-system"

# Using Python
python -m http.server 8000

# Then visit: http://localhost:8000
```

## 📋 Pages Overview

### 1. **Home Page** (`index.html`)
- Hero section with animated visuals
- Feature cards highlighting key capabilities
- CTA buttons for quick access
- Responsive layout

### 2. **Dashboard** (`dashboard.html`)
- Sidebar navigation menu
- Real-time statistics
- Search functionality with suggestions
- Interactive charts and heatmaps
- Responsive two-column layout

### 3. **Upload** (`upload.html`)
- Drag-and-drop zone
- File preview
- Progress indicator
- Success confirmation
- Upload tips section

### 4. **Algorithms** (`algorithms.html`)
- Algorithm visualizations
- Complexity comparisons
- Interactive SVG diagrams
- Technical specifications

## 🎯 Key Features Implemented

### Search Functionality
- Real-time item search
- Autocomplete suggestions
- Result filtering
- Display of item details

### Chart Visualizations
- Forecast trend line chart
- Shortage heatmap bar chart
- Category distribution (optional)
- Interactive controls

### File Upload
- Drag-and-drop support
- File type validation
- Size validation (50MB limit)
- CSV/JSON/XLSX parsing
- Preview display

### Animations
- Page transitions
- Hover effects
- Loading animations
- Particle effects
- Smooth scrolling

## 💻 Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔐 Security Notes

This is a frontend-only application. For production use:
- Implement proper backend authentication
- Add HTTPS/SSL
- Validate file uploads server-side
- Implement proper data encryption
- Add CORS headers if needed

## 📊 Sample Data

The application includes sample data:
- 10 sample inventory items
- Realistic stock levels
- Status categories (optimal, warning, critical)
- Category classifications

## 🎨 Customization

### Change Colors
Edit `:root` variables in `css/styles.css`:
```css
--neon-blue: #3ab8ff;
--neon-purple: #a855f7;
--neon-teal: #14b8a6;
```

### Modify Chart Colors
Edit Chart.js datasets in `js/charts.js`:
```javascript
borderColor: '#14b8a6',
backgroundColor: 'rgba(20, 184, 166, 0.1)'
```

### Adjust Animations
Modify animation duration and easing in `css/animations.css`:
```css
animation: fade-in 0.6s ease-out;
```

## 🐛 Troubleshooting

### Charts not showing?
- Ensure Chart.js is loaded from CDN
- Check browser console for errors
- Verify canvas elements exist

### File upload not working?
- Check file size (max 50MB)
- Verify file format (CSV, XLSX, JSON)
- Check browser console for errors

### Styling issues?
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check CSS file paths

## 📝 File Sizes

- `index.html`: ~8KB
- `dashboard.html`: ~12KB
- `upload.html`: ~10KB
- `algorithms.html`: ~15KB
- `css/styles.css`: ~30KB
- `css/animations.css`: ~18KB
- `js/main.js`: ~8KB
- `js/dashboard.js`: ~12KB
- `js/charts.js`: ~20KB
- `js/upload.js`: ~15KB

**Total**: ~148KB (without dependencies)

## 🚀 Performance

- Lazy loading for charts
- Debounced search input
- Optimized animations (using GPU acceleration)
- Minimal DOM manipulation
- Efficient CSS selectors

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 1024px, 768px
- Touch-friendly buttons
- Hamburger menu on mobile
- Flexible grid layouts

## 🎓 Learning Resources

This project demonstrates:
- Modern CSS techniques (Grid, Flexbox, Custom Properties)
- Chart.js implementation
- Event handling and DOM manipulation
- API-like data structures
- Responsive design
- Animation principles

## 📄 License

This project is provided as-is for educational and commercial use.

## 🤝 Contributing

Feel free to fork and customize this template for your needs!

## 📞 Support

For issues or questions:
1. Check the browser console for errors
2. Review the troubleshooting section
3. Ensure all files are in correct locations
4. Verify file paths are correct

---

**Built with ❤️ using modern web technologies**

Version 1.0.0 - December 2025
