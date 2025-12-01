// ===================== MAIN NAVIGATION & UTILITIES =====================

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || !document.querySelector(href)) return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Active Link Highlighting
const setActiveLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

setActiveLink();

// Utility Function: Format Numbers
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

// Utility Function: Get Random Item
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Utility Function: Debounce
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

// ===================== ANIMATION OBSERVERS =====================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply observer to elements
document.querySelectorAll('.feature-card, .stat-card, .algorithm-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ===================== PARTICLE EFFECT =====================

function createParticles(x, y) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = 'var(--neon-blue)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 5;
        const velocity = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5
        };
        
        let opacity = 1;
        const animate = () => {
            particle.style.left = (parseFloat(particle.style.left) + velocity.x) + 'px';
            particle.style.top = (parseFloat(particle.style.top) + velocity.y) + 'px';
            opacity -= 0.05;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
}

// ===================== BUTTON INTERACTIONS =====================

document.querySelectorAll('button, .btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (!this.classList.contains('forecast-btn')) {
            createParticles(e.clientX, e.clientY);
        }
    });
});

// ===================== DARK MODE TOGGLE =====================

const darkModeToggle = () => {
    let isDarkMode = localStorage.getItem('darkMode') === 'true' || true;
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
};

darkModeToggle();

// ===================== SCROLL EFFECTS =====================

let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            
            // Navbar shadow effect
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (scrollY > 10) {
                    navbar.style.boxShadow = 'var(--shadow-lg)';
                } else {
                    navbar.style.boxShadow = 'var(--shadow-sm)';
                }
            }
            
            // Parallax effect for hero visual
            const heroVisual = document.querySelector('.hero-visual');
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${scrollY * 0.5}px)`;
            }
            
            ticking = false;
        });
        ticking = true;
    }
});

// ===================== RESPONSIVE MENU CLOSE =====================

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu) {
        navMenu.style.display = 'flex';
    }
});

// ===================== PAGE LOAD ANIMATION =====================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===================== CONSOLE WELCOME MESSAGE =====================

console.log('%c🚀 Welcome to InvenForecast!', 'color: #3ab8ff; font-size: 20px; font-weight: bold;');
console.log('%cAI-Powered Inventory Forecasting System', 'color: #a855f7; font-size: 14px;');
console.log('%cBuilt with ❤️ using modern web technologies', 'color: #14b8a6; font-size: 12px;');
