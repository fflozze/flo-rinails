/* ========================================
   FLO RINAILS - JavaScript Principal
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initFormValidation();
    initHeaderParticles();
    initTabs();
    initScrollToTop();
    initSearch();
});

/* ========================================
   Navigation & Menu Burger
   ======================================== */

function initNavigation() {
    const burgerBtn = document.getElementById('burgerBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const body = document.body;
    
    // Toggle menu function
    function toggleMenu() {
        const isOpen = sidebar.classList.contains('open');
        
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    function openMenu() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        burgerBtn.classList.add('active');
        body.classList.add('menu-open');
        
        // Animate sidebar links
        const links = sidebar.querySelectorAll('.sidebar-link');
        links.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                link.style.transition = 'all 0.3s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateX(0)';
            }, 100 + (index * 50));
        });
    }
    
    function closeMenu() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        burgerBtn.classList.remove('active');
        body.classList.remove('menu-open');
    }
    
    // Event listeners
    burgerBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeMenu();
        }
    });
    
    // Close menu on link click (for mobile)
    const sidebarLinks = sidebar.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                setTimeout(closeMenu, 150);
            }
        });
    });
}

/* ========================================
   Scroll Effects
   ======================================== */

function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        const scrollY = window.scrollY;
        
        // Add/remove scrolled class
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/* ========================================
   Scroll Animations (Intersection Observer)
   ======================================== */

function initAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        return;
    }
    
    const animatedElements = document.querySelectorAll('.service-card, .prestation-card, .info-card, .about-content, .section-header');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const speed = 0.3;
            
            if (scrollY < window.innerHeight) {
                heroVisual.style.transform = `translateY(${scrollY * speed}px)`;
            }
        });
    }
}

/* ========================================
   Form Validation
   ======================================== */

function initFormValidation() {
    const form = document.querySelector('.contact-form form');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        // Validation
        const formData = new FormData(form);
        let isValid = true;
        
        // Check required fields
        form.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showFieldError(field, 'Ce champ est requis');
            } else {
                clearFieldError(field);
            }
        });
        
        // Email validation
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                isValid = false;
                showFieldError(emailField, 'Veuillez entrer une adresse email valide');
            }
        }
        
        // Phone validation
        const phoneField = form.querySelector('input[type="tel"]');
        if (phoneField && phoneField.value) {
            const phoneRegex = /^[\d\s+()-]{10,}$/;
            if (!phoneRegex.test(phoneField.value)) {
                isValid = false;
                showFieldError(phoneField, 'Veuillez entrer un numéro de téléphone valide');
            }
        }
        
        if (!isValid) return;
        
        // Show loading state
        submitBtn.innerHTML = '<span>Envoi en cours...</span>';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual submission)
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Message envoyé !</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #8BC34A)';
            
            // Reset form
            form.reset();
            
            // Reset button after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
    
    // Real-time validation on blur
    form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', () => {
            if (field.hasAttribute('required') && !field.value.trim()) {
                showFieldError(field, 'Ce champ est requis');
            } else {
                clearFieldError(field);
            }
        });
        
        field.addEventListener('input', () => {
            clearFieldError(field);
        });
    });
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#e74c3c';
    
    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    error.style.cssText = 'display: block; color: #e74c3c; font-size: 0.8rem; margin-top: 0.25rem;';
    
    field.parentNode.appendChild(error);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

/* ========================================
   Utility Functions
   ======================================== */

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ========================================
   Page Transitions (Optional Enhancement)
   ======================================== */

// Add subtle page transition effect
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});

// Handle back/forward navigation (bfcache) - reload page to fix blank screen on GitHub Pages
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page was loaded from bfcache (back/forward button)
        // Force reload to ensure proper rendering
        window.location.reload();
    }
});

// Handle internal link clicks for smooth transitions
document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto"]):not([href^="tel"])').forEach(link => {
    if (link.hostname === window.location.hostname) {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Don't transition for same page
            if (href === window.location.pathname) {
                return;
            }
            
            e.preventDefault();
            
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    }
});

/* ========================================
   Header Particles Animation - Bulles dégradées
   ======================================== */

function initHeaderParticles() {
    const container = document.querySelector('.header-particles');
    if (!container) return;
    
    // Remove existing particles
    container.innerHTML = '';
    
    const particleCount = 12;
    const particles = [];
    
    // Tailles variées pour les bulles (en px)
    const sizes = [12, 16, 20, 24, 28, 32, 18, 22, 14, 26, 15, 30];
    
    // Create particles (bulles dégradées)
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        container.appendChild(particle);
        
        const size = sizes[i % sizes.length];
        const opacity = 0.4 + Math.random() * 0.5; // Opacité variée
        
        particles.push({
            el: particle,
            x: Math.random() * 95 + 2.5,
            y: Math.random() * 95 + 2.5,
            vx: (Math.random() - 0.5) * 0.06,
            vy: (Math.random() - 0.5) * 0.06,
            size: size
        });
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.opacity = opacity;
    }
    
    // Animation loop
    function animate() {
        particles.forEach(p => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges with margin
            if (p.x <= 2 || p.x >= 98) {
                p.vx *= -1;
                p.x = Math.max(2, Math.min(98, p.x));
            }
            if (p.y <= 2 || p.y >= 98) {
                p.vy *= -1;
                p.y = Math.max(2, Math.min(98, p.y));
            }
            
            // Random direction change (subtle)
            if (Math.random() < 0.002) {
                p.vx += (Math.random() - 0.5) * 0.03;
                p.vy += (Math.random() - 0.5) * 0.03;
                
                // Limit speed
                const maxSpeed = 0.08;
                p.vx = Math.max(-maxSpeed, Math.min(maxSpeed, p.vx));
                p.vy = Math.max(-maxSpeed, Math.min(maxSpeed, p.vy));
            }
            
            // Apply position
            p.el.style.left = p.x + '%';
            p.el.style.top = p.y + '%';
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* ========================================
   Tabs Navigation
   ======================================== */

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabsNavigation = document.querySelector('.tabs-navigation');
    
    if (tabBtns.length === 0) return;
    
    // Créer un wrapper groupe pour les boutons tabs
    if (tabsNavigation && !document.querySelector('.tabs-group')) {
        const tabsGroup = document.createElement('div');
        tabsGroup.className = 'tabs-group';
        
        // Déplacer les boutons dans le wrapper
        tabBtns.forEach(btn => {
            tabsGroup.appendChild(btn);
        });
        
        tabsNavigation.appendChild(tabsGroup);
    }
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const targetContent = document.getElementById(`tab-${tabId}`);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Re-trigger animations for cards in the new tab
                const cards = targetContent.querySelectorAll('.prestation-card');
                cards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50 + (index * 30));
                });
            }
        });
    });
}

/* ========================================
   Bouton Retour en Haut
   ======================================== */

function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (!scrollToTopBtn) return;
    
    // Show/hide button based on scroll position
    function toggleScrollButton() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }
    
    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Listen for scroll events
    window.addEventListener('scroll', throttle(toggleScrollButton, 100));
    
    // Initial check
    toggleScrollButton();
}

/* ========================================
   Barre de Recherche
   ======================================== */

function initSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput) return;
    
    // Base de données des prestations et catégories
    const searchData = {
        categories: [
            // Catégories Ongles - Mains
            { name: 'Pose de Gel', page: 'prestations-ongles.html', tab: 'mains', type: 'category', icon: 'nails' },
            { name: 'Extensions', page: 'prestations-ongles.html', tab: 'mains', type: 'category', icon: 'nails' },
            { name: 'Vernis Semi-Permanent', page: 'prestations-ongles.html', tab: 'mains', type: 'category', icon: 'nails' },
            { name: 'Semi-Permanent Doux', page: 'prestations-ongles.html', tab: 'mains', type: 'category', icon: 'nails' },
            { name: 'Vernis Classique', page: 'prestations-ongles.html', tab: 'mains', type: 'category', icon: 'nails' },
            { name: 'Soins & Dépose', page: 'prestations-ongles.html', tab: 'mains', type: 'category', icon: 'nails' },
            { name: 'Suppléments & Options', page: 'prestations-ongles.html', tab: 'mains', type: 'category', icon: 'nails' },
            // Catégories Cils
            { name: 'Extensions de Cils', page: 'prestations-cils.html', type: 'category', icon: 'lashes' },
            { name: 'Rehaussement de Cils', page: 'prestations-cils.html', type: 'category', icon: 'lashes' },
            // Pages principales
            { name: 'Prestations Ongles', page: 'prestations-ongles.html', type: 'page', icon: 'nails' },
            { name: 'Prestations Cils', page: 'prestations-cils.html', type: 'page', icon: 'lashes' },
            { name: 'Prestations Sourcils', page: 'prestations-sourcils.html', type: 'page', icon: 'brows' },
        ],
        prestations: [
            // Ongles - Pose de Gel (Mains)
            { name: 'Pose Gel Couleur', price: '40€', page: 'prestations-ongles.html', tab: 'mains', category: 'Pose de Gel', icon: 'nails' },
            { name: 'Pose Gel French Classique', price: '45€', page: 'prestations-ongles.html', tab: 'mains', category: 'Pose de Gel', icon: 'nails' },
            { name: 'Pose Gel French Babyboomer', price: '50€', page: 'prestations-ongles.html', tab: 'mains', category: 'Pose de Gel', icon: 'nails' },
            { name: 'Remplissage Couleur', price: '50€', page: 'prestations-ongles.html', tab: 'mains', category: 'Pose de Gel', icon: 'nails' },
            { name: 'Remplissage French Classique', price: '55€', page: 'prestations-ongles.html', tab: 'mains', category: 'Pose de Gel', icon: 'nails' },
            { name: 'Remplissage Babyboomer', price: '60€', page: 'prestations-ongles.html', tab: 'mains', category: 'Pose de Gel', icon: 'nails' },
            // Ongles - Extensions
            { name: 'Extensions Chablons', price: '+30€', page: 'prestations-ongles.html', tab: 'mains', category: 'Extensions', icon: 'nails' },
            { name: 'Extensions Capsules Américaines', price: '+25€', page: 'prestations-ongles.html', tab: 'mains', category: 'Extensions', icon: 'nails' },
            { name: 'Extensions Ongles Rongés / Acrygel', price: '+30€', page: 'prestations-ongles.html', tab: 'mains', category: 'Extensions', icon: 'nails' },
            // Ongles - Vernis Semi-Permanent
            { name: 'Pose Couleur Semi-Permanent', price: '30€', page: 'prestations-ongles.html', tab: 'mains', category: 'Vernis Semi-Permanent', icon: 'nails' },
            { name: 'Pose French Classique Semi-Permanent', price: '35€', page: 'prestations-ongles.html', tab: 'mains', category: 'Vernis Semi-Permanent', icon: 'nails' },
            { name: 'Pose French Babyboomer Semi-Permanent', price: '40€', page: 'prestations-ongles.html', tab: 'mains', category: 'Vernis Semi-Permanent', icon: 'nails' },
            { name: 'Dépose/Pose Couleur Semi-Permanent', price: '40€', page: 'prestations-ongles.html', tab: 'mains', category: 'Vernis Semi-Permanent', icon: 'nails' },
            { name: 'Dépose/Pose French Classique Semi-Permanent', price: '45€', page: 'prestations-ongles.html', tab: 'mains', category: 'Vernis Semi-Permanent', icon: 'nails' },
            { name: 'Dépose/Pose Babyboomer Semi-Permanent', price: '50€', page: 'prestations-ongles.html', tab: 'mains', category: 'Vernis Semi-Permanent', icon: 'nails' },
            // Ongles - Semi-Permanent Doux
            { name: 'Pose Couleur Semi-Permanent Doux', price: '20€', page: 'prestations-ongles.html', tab: 'mains', category: 'Semi-Permanent Doux', icon: 'nails' },
            { name: 'Pose French Classique Semi-Permanent Doux', price: '25€', page: 'prestations-ongles.html', tab: 'mains', category: 'Semi-Permanent Doux', icon: 'nails' },
            { name: 'Dépose/Pose Couleur Semi-Permanent Doux', price: '25€', page: 'prestations-ongles.html', tab: 'mains', category: 'Semi-Permanent Doux', icon: 'nails' },
            { name: 'Dépose/Pose French Classique Semi-Permanent Doux', price: '30€', page: 'prestations-ongles.html', tab: 'mains', category: 'Semi-Permanent Doux', icon: 'nails' },
            // Ongles - Vernis Classique
            { name: 'Pose Couleur Vernis Classique', price: '20€', page: 'prestations-ongles.html', tab: 'mains', category: 'Vernis Classique', icon: 'nails' },
            { name: 'Pose French Classique Vernis', price: '25€', page: 'prestations-ongles.html', tab: 'mains', category: 'Vernis Classique', icon: 'nails' },
            { name: 'Dépose/Pose Couleur Vernis Classique', price: '25€', page: 'prestations-ongles.html', tab: 'mains', category: 'Vernis Classique', icon: 'nails' },
            { name: 'Dépose/Pose French Classique Vernis', price: '30€', page: 'prestations-ongles.html', tab: 'mains', category: 'Vernis Classique', icon: 'nails' },
            // Ongles - Soins
            { name: 'Mise en Beauté Simple', price: '10€', page: 'prestations-ongles.html', tab: 'mains', category: 'Soins & Dépose', icon: 'nails' },
            { name: 'Spa des Mains', price: '35€', page: 'prestations-ongles.html', tab: 'mains', category: 'Soins & Dépose', icon: 'nails' },
            { name: 'Dépose Gel + Remise en Beauté', price: '25€', page: 'prestations-ongles.html', tab: 'mains', category: 'Soins & Dépose', icon: 'nails' },
            { name: 'Dépose Semi-Permanent + Remise en Beauté', price: '25€', page: 'prestations-ongles.html', tab: 'mains', category: 'Soins & Dépose', icon: 'nails' },
            { name: 'Dépose Semi-Permanent Doux + Remise en Beauté', price: '15€', page: 'prestations-ongles.html', tab: 'mains', category: 'Soins & Dépose', icon: 'nails' },
            // Ongles - Suppléments
            { name: 'Décos (simple ou élaboré)', price: '0,50€ à 2€', page: 'prestations-ongles.html', tab: 'mains', category: 'Suppléments', icon: 'nails' },
            { name: 'Nail Art', price: '0,50€ à 2€', page: 'prestations-ongles.html', tab: 'mains', category: 'Suppléments', icon: 'nails' },
            { name: 'Forfait Mains + Pieds', price: '-5€', page: 'prestations-ongles.html', tab: 'mains', category: 'Suppléments', icon: 'nails' },
            // Ongles - Pieds
            { name: 'Spa des Pieds', price: '45€', page: 'prestations-ongles.html', tab: 'pieds', category: 'Soins & Dépose', icon: 'nails' },
            { name: 'Option Peeling Pieds', price: '+25€', page: 'prestations-ongles.html', tab: 'pieds', category: 'Soins & Dépose', icon: 'nails' },
            // Cils - Extensions
            { name: 'Pose Complète Cil à Cil', price: '85€', page: 'prestations-cils.html', category: 'Extensions de Cils', icon: 'lashes' },
            { name: 'Remplissage Cil à Cil', price: '45€', page: 'prestations-cils.html', category: 'Extensions de Cils', icon: 'lashes' },
            { name: 'Pose Complète Mixte', price: '95€', page: 'prestations-cils.html', category: 'Extensions de Cils', icon: 'lashes' },
            { name: 'Remplissage Mixte', price: '55€', page: 'prestations-cils.html', category: 'Extensions de Cils', icon: 'lashes' },
            { name: 'Supplément Cils Fantaisie', price: '+5€', page: 'prestations-cils.html', category: 'Extensions de Cils', icon: 'lashes' },
            { name: 'Dépose Cils Seule', price: '25€', page: 'prestations-cils.html', category: 'Extensions de Cils', icon: 'lashes' },
            // Cils - Rehaussement
            { name: 'Rehaussement des Cils Naturels', price: '60€', page: 'prestations-cils.html', category: 'Rehaussement de Cils', icon: 'lashes' },
            { name: 'Rehaussement + Teinture', price: '68€', page: 'prestations-cils.html', category: 'Rehaussement de Cils', icon: 'lashes' },
            { name: 'Rehaussement + Mascara Semi-Permanent', price: '90€', page: 'prestations-cils.html', category: 'Rehaussement de Cils', icon: 'lashes' },
            { name: 'Mascara Semi-Permanent', price: '50€', page: 'prestations-cils.html', category: 'Rehaussement de Cils', icon: 'lashes' },
            { name: 'Teinture de Cils', price: '15€', page: 'prestations-cils.html', category: 'Rehaussement de Cils', icon: 'lashes' },
            { name: 'Soin Kératine Cils Rehaussés', price: '20€', page: 'prestations-cils.html', category: 'Rehaussement de Cils', icon: 'lashes' },
        ]
    };
    
    let selectedIndex = -1;
    let currentResults = [];
    
    // Toggle recherche sur mobile
    if (searchToggle) {
        searchToggle.addEventListener('click', () => {
            searchBox.classList.add('active');
            setTimeout(() => searchInput.focus(), 100);
        });
    }
    
    // Fermer la recherche
    if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
    }
    
    // Fermer en cliquant à l'extérieur (mobile)
    searchBox.addEventListener('click', (e) => {
        if (e.target === searchBox) {
            closeSearch();
        }
    });
    
    function closeSearch() {
        searchBox.classList.remove('active');
        searchResults.classList.remove('active');
        searchInput.value = '';
        selectedIndex = -1;
    }
    
    // Recherche en temps réel
    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length < 2) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }
        
        performSearch(query);
    }, 150));
    
    // Navigation clavier
    searchInput.addEventListener('keydown', (e) => {
        const items = searchResults.querySelectorAll('.search-result-item');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (searchResults.classList.contains('active') && items.length > 0) {
                    selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                    updateSelection(items);
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (searchResults.classList.contains('active') && items.length > 0) {
                    selectedIndex = Math.max(selectedIndex - 1, 0);
                    updateSelection(items);
                }
                break;
            case 'Enter':
                e.preventDefault();
                e.stopPropagation();
                if (currentResults.length > 0) {
                    const indexToUse = selectedIndex >= 0 ? selectedIndex : 0;
                    navigateToResult(currentResults[indexToUse]);
                }
                break;
            case 'Escape':
                closeSearch();
                break;
        }
    });
    
    // Focus sur la recherche avec Ctrl+K ou /
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !isInputFocused())) {
            e.preventDefault();
            if (window.innerWidth <= 768) {
                searchBox.classList.add('active');
            }
            searchInput.focus();
        }
        
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            closeSearch();
            searchInput.blur();
        }
    });
    
    // Fermer la recherche en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
        const searchContainer = document.getElementById('searchContainer');
        
        // Vérifier si le clic est en dehors du conteneur de recherche
        if (searchContainer && !searchContainer.contains(e.target)) {
            // Fermer les résultats si actifs
            if (searchResults.classList.contains('active')) {
                searchResults.classList.remove('active');
            }
            // Fermer la searchBox mobile si active
            if (searchBox.classList.contains('active')) {
                closeSearch();
            }
        }
    });
    
    function isInputFocused() {
        const el = document.activeElement;
        return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
    }
    
    function performSearch(query) {
        currentResults = [];
        
        // Normaliser la requête
        const normalizedQuery = normalizeText(query);
        
        // Rechercher dans les catégories
        const categoryResults = searchData.categories.filter(item => 
            normalizeText(item.name).includes(normalizedQuery)
        ).slice(0, 3);
        
        // Rechercher dans les prestations
        const prestationResults = searchData.prestations.filter(item => 
            normalizeText(item.name).includes(normalizedQuery) ||
            normalizeText(item.category || '').includes(normalizedQuery)
        ).slice(0, 8);
        
        currentResults = [...categoryResults, ...prestationResults];
        selectedIndex = -1;
        
        renderResults(categoryResults, prestationResults, query);
    }
    
    function normalizeText(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
            .replace(/[^a-z0-9\s]/g, ''); // Garde seulement lettres/chiffres/espaces
    }
    
    function renderResults(categories, prestations, query) {
        if (categories.length === 0 && prestations.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <svg class="search-no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <p class="search-no-results-text">Aucun résultat pour "${escapeHtml(query)}"</p>
                    <p class="search-no-results-hint">Essayez : gel, french, cils, rehaussement...</p>
                </div>
            `;
            searchResults.classList.add('active');
            return;
        }
        
        let html = '';
        
        // Catégories
        if (categories.length > 0) {
            html += `
                <div class="search-group">
                    <div class="search-group-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
                        </svg>
                        Catégories
                    </div>
                    ${categories.map(item => renderResultItem(item, query, 'category')).join('')}
                </div>
            `;
        }
        
        // Prestations
        if (prestations.length > 0) {
            html += `
                <div class="search-group">
                    <div class="search-group-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        Prestations
                    </div>
                    ${prestations.map(item => renderResultItem(item, query, 'prestation')).join('')}
                </div>
            `;
        }
        
        searchResults.innerHTML = html;
        searchResults.classList.add('active');
        
        // Ajouter les event listeners
        searchResults.querySelectorAll('.search-result-item').forEach((el, index) => {
            el.addEventListener('click', () => {
                navigateToResult(currentResults[index]);
            });
        });
    }
    
    function renderResultItem(item, query, type) {
        const iconSvg = getIconSvg(item.icon);
        const highlightedName = highlightMatch(item.name, query);
        const meta = type === 'prestation' ? item.category : (item.tab ? `Ongles - ${item.tab === 'mains' ? 'Mains' : 'Pieds'}` : 'Page');
        
        return `
            <div class="search-result-item" data-page="${item.page}" data-tab="${item.tab || ''}">
                <div class="search-result-icon">
                    ${iconSvg}
                </div>
                <div class="search-result-content">
                    <div class="search-result-title">${highlightedName}</div>
                    <div class="search-result-meta">${meta}</div>
                </div>
                ${item.price ? `<div class="search-result-price">${item.price}</div>` : ''}
                <svg class="search-result-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </div>
        `;
    }
    
    function getIconSvg(type) {
        switch (type) {
            case 'nails':
                return `<img src="assets/doigts_seul.svg" alt="Ongles">`;
            case 'lashes':
                return `<img src="assets/oeil_seul.svg" alt="Cils">`;
            case 'brows':
                return `<img src="assets/sourcil_seul.svg" alt="Sourcils">`;
            default:
                return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/></svg>`;
        }
    }
    
    function highlightMatch(text, query) {
        const normalizedText = normalizeText(text);
        const normalizedQuery = normalizeText(query);
        const index = normalizedText.indexOf(normalizedQuery);
        
        if (index === -1) return escapeHtml(text);
        
        // Trouver la position dans le texte original
        let originalIndex = 0;
        let normalizedIndex = 0;
        
        while (normalizedIndex < index && originalIndex < text.length) {
            const char = text[originalIndex];
            const normalizedChar = normalizeText(char);
            if (normalizedChar.length > 0) {
                normalizedIndex += normalizedChar.length;
            }
            originalIndex++;
        }
        
        const matchStart = originalIndex;
        let matchLength = 0;
        let queryIndex = 0;
        
        while (queryIndex < query.length && (matchStart + matchLength) < text.length) {
            const char = text[matchStart + matchLength];
            const normalizedChar = normalizeText(char);
            if (normalizedChar.length > 0) {
                queryIndex += normalizedChar.length;
            }
            matchLength++;
        }
        
        const before = escapeHtml(text.substring(0, matchStart));
        const match = escapeHtml(text.substring(matchStart, matchStart + matchLength));
        const after = escapeHtml(text.substring(matchStart + matchLength));
        
        return `${before}<mark>${match}</mark>${after}`;
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function updateSelection(items) {
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === selectedIndex);
        });
        
        if (items[selectedIndex]) {
            items[selectedIndex].scrollIntoView({ block: 'nearest' });
        }
    }
    
    function navigateToResult(item) {
        // Déterminer la catégorie cible (pour les catégories, c'est item.name, pour les prestations c'est item.category)
        const targetCategory = item.type === 'category' ? item.name : item.category;
        
        // Stocker les infos de navigation dans sessionStorage
        if (item.tab) {
            sessionStorage.setItem('searchTab', item.tab);
        }
        if (targetCategory) {
            sessionStorage.setItem('searchCategory', targetCategory);
        }
        
        // Fermer la recherche
        closeSearch();
        
        // Vérifier si on est déjà sur la bonne page
        const currentPath = window.location.pathname;
        const isOnTargetPage = currentPath.endsWith(item.page) || 
                              currentPath.endsWith(item.page.replace('.html', '')) ||
                              currentPath.endsWith('/' + item.page) ||
                              (currentPath === '/' && item.page === 'index.html');
        
        if (isOnTargetPage) {
            // On est sur la bonne page, activer tab et scroller
            if (item.tab) {
                const tabBtn = document.querySelector(`[data-tab="${item.tab}"]`);
                if (tabBtn) tabBtn.click();
            }
            
            if (targetCategory) {
                scrollToCategory(targetCategory);
            }
        } else {
            // Naviguer vers la page
            window.location.href = item.page;
        }
    }
    
    function scrollToCategory(categoryName) {
        setTimeout(() => {
            const categories = document.querySelectorAll('.category-title');
            const normalizedTarget = normalizeText(categoryName).trim();
            
            for (const cat of categories) {
                const normalizedCatText = normalizeText(cat.textContent).trim();
                
                // Correspondance exacte ou le texte de la catégorie commence par le nom recherché
                if (normalizedCatText === normalizedTarget || 
                    normalizedCatText.startsWith(normalizedTarget + ' ') ||
                    normalizedTarget.startsWith(normalizedCatText)) {
                    
                    // Offset pour la navbar sticky
                    const navbarHeight = 80;
                    const tabsHeight = document.querySelector('.tabs-section')?.offsetHeight || 0;
                    const offset = navbarHeight + tabsHeight + 20;
                    
                    const elementPosition = cat.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    break;
                }
            }
        }, 400);
    }
    
    // Vérifier si on doit activer un tab et/ou scroller vers une catégorie au chargement
    const savedTab = sessionStorage.getItem('searchTab');
    const savedCategory = sessionStorage.getItem('searchCategory');
    
    if (savedTab || savedCategory) {
        setTimeout(() => {
            // Activer le tab si nécessaire
            if (savedTab) {
                const tabBtn = document.querySelector(`[data-tab="${savedTab}"]`);
                if (tabBtn) tabBtn.click();
                sessionStorage.removeItem('searchTab');
            }
            
            // Scroller vers la catégorie après un petit délai pour laisser le tab s'activer
            if (savedCategory) {
                setTimeout(() => {
                    scrollToCategory(savedCategory);
                    sessionStorage.removeItem('searchCategory');
                }, 200);
            }
        }, 150);
    }
}

