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
   Header Particles Animation
   ======================================== */

function initHeaderParticles() {
    const container = document.querySelector('.header-particles');
    if (!container) return;
    
    // Remove existing particles
    container.innerHTML = '';
    
    const particleCount = 8;
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        container.appendChild(particle);
        
        particles.push({
            el: particle,
            x: Math.random() * 100,
            y: Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.08,
            vy: (Math.random() - 0.5) * 0.08,
            size: 3 + Math.random() * 3
        });
        
        particle.style.width = particles[i].size + 'px';
        particle.style.height = particles[i].size + 'px';
    }
    
    // Animation loop
    function animate() {
        particles.forEach(p => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x <= 0 || p.x >= 100) {
                p.vx *= -1;
                p.x = Math.max(0, Math.min(100, p.x));
            }
            if (p.y <= 0 || p.y >= 100) {
                p.vy *= -1;
                p.y = Math.max(0, Math.min(100, p.y));
            }
            
            // Random direction change
            if (Math.random() < 0.003) {
                p.vx += (Math.random() - 0.5) * 0.05;
                p.vy += (Math.random() - 0.5) * 0.05;
                
                // Limit speed
                const maxSpeed = 0.1;
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

