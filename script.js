// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const header = document.getElementById('header');
const quoteModal = document.getElementById('quoteModal');
const closeModal = document.querySelector('.close');
const quoteForm = document.getElementById('quoteForm');
const modalQuoteForm = document.getElementById('modalQuoteForm');

// Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = '#FFFFFF';
        header.style.backdropFilter = 'none';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Modal functionality
function openModal() {
    quoteModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModalFunc() {
    quoteModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Open modal when clicking "Get Quote" buttons
document.querySelectorAll('[href="#quote"], .cta-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
});

// Close modal
closeModal.addEventListener('click', closeModalFunc);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === quoteModal) {
        closeModalFunc();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quoteModal.style.display === 'block') {
        closeModalFunc();
    }
});

// Form handling
function handleFormSubmit(form, isModal = false) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!data.name || !data.phone) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you! We will contact you soon.', 'success');
        
        // Reset form
        form.reset();
        
        // Close modal if it's the modal form
        if (isModal) {
            closeModalFunc();
        }
        
        // Log form data (in real implementation, this would be sent to server)
        console.log('Form submitted:', data);
    });
}

// Handle both forms
if (quoteForm) {
    handleFormSubmit(quoteForm);
}

if (modalQuoteForm) {
    handleFormSubmit(modalQuoteForm, true);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#10B981' : type === 'error' ? '#DC2626' : '#1B365D'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            .notification-close:hover {
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.trust-item, .product-category, .feature-item, .service-card, .contact-item');
    animateElements.forEach(el => observer.observe(el));
});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when about section is visible
const aboutSection = document.querySelector('.about-section');
if (aboutSection) {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    aboutObserver.observe(aboutSection);
}

// Product category hover effects
document.querySelectorAll('.product-category').forEach(category => {
    category.addEventListener('mouseenter', () => {
        const items = category.querySelectorAll('.product-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateX(10px)';
            }, index * 100);
        });
    });
    
    category.addEventListener('mouseleave', () => {
        const items = category.querySelectorAll('.product-item');
        items.forEach(item => {
            item.style.transform = 'translateX(0)';
        });
    });
});

// Gallery image functionality
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('.gallery-img');
        const title = item.querySelector('.gallery-overlay h3').textContent;
        const description = item.querySelector('.gallery-overlay p').textContent;
        
        // Create modal for image view
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal-content">
                <span class="image-modal-close">&times;</span>
                <img src="${img.src}" alt="${img.alt}" class="image-modal-img">
                <div class="image-modal-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
            </div>
        `;
        
        // Add modal styles
        if (!document.querySelector('#image-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'image-modal-styles';
            style.textContent = `
                .image-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.9);
                    z-index: 3000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                .image-modal-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                    background-color: white;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .image-modal-close {
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    font-size: 2rem;
                    color: white;
                    cursor: pointer;
                    z-index: 3001;
                    background-color: rgba(0, 0, 0, 0.5);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .image-modal-img {
                    width: 100%;
                    height: auto;
                    max-height: 70vh;
                    object-fit: contain;
                }
                .image-modal-info {
                    padding: 2rem;
                    background-color: white;
                }
                .image-modal-info h3 {
                    color: var(--deep-steel-blue);
                    margin-bottom: 1rem;
                }
                .image-modal-info p {
                    color: var(--charcoal-gray);
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.image-modal-close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = 'auto';
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close with Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.body.style.overflow = 'auto';
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    });
});

// WhatsApp integration
function openWhatsApp() {
    const phone = '917602270988';
    const message = 'Hi! I would like to get a quote for construction materials.';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Add WhatsApp click tracking
document.querySelector('.whatsapp-float a').addEventListener('click', () => {
    // Track WhatsApp clicks (in real implementation, this would send to analytics)
    console.log('WhatsApp clicked');
});

// Lazy loading for images (if any are added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Handle image loading - SIMPLIFIED for better mobile display
function handleImageLoading() {
    const images = document.querySelectorAll('.hero-img, .about-img, .gallery-img');
    
    images.forEach(img => {
        // Set images to visible immediately
        img.style.opacity = '1';
        img.classList.add('loaded');
        
        // Add error handling
        img.addEventListener('error', () => {
            img.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'image-fallback';
            fallback.innerHTML = `
                <i class="fas fa-image"></i>
                <p>Image not available</p>
            `;
            fallback.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 200px;
                background-color: var(--light-gray);
                color: var(--charcoal-gray);
                border-radius: 8px;
            `;
            img.parentNode.insertBefore(fallback, img);
        });
    });
}

// Initialize image loading
document.addEventListener('DOMContentLoaded', handleImageLoading);

// Mobile-specific gallery enhancements
function enhanceMobileGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        // Add touch feedback for mobile
        item.addEventListener('touchstart', () => {
            item.style.transform = 'scale(0.98)';
        });
        
        item.addEventListener('touchend', () => {
            item.style.transform = '';
        });
        
        // Prevent default touch behavior that might interfere
        item.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    });
}

// Enhanced mobile navigation
function enhanceMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Add haptic feedback for mobile (if supported)
    if ('vibrate' in navigator) {
        navToggle.addEventListener('click', () => {
            navigator.vibrate(50);
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Prevent body scroll when menu is open
    navMenu.addEventListener('touchmove', (e) => {
        if (navMenu.classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Optimize images for mobile display
function optimizeImagesForMobile() {
    const images = document.querySelectorAll('.gallery-img, .hero-img, .about-img');
    
    images.forEach(img => {
        // Ensure images are visible on mobile
        img.style.opacity = '1';
        img.style.display = 'block';
        
        // Add loading="lazy" for better performance
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Ensure proper sizing
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.objectFit = 'cover';
        
        // Add error handling
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'image-fallback';
            fallback.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px; background-color: #f8f9fa; color: #374151; border-radius: 8px;">
                    <i class="fas fa-image" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                    <p style="margin: 0; font-size: 0.9rem;">Image not available</p>
                </div>
            `;
            this.parentNode.insertBefore(fallback, this);
        });
    });
}

// Mobile-specific form enhancements
function enhanceMobileForms() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Prevent zoom on iOS for inputs
        if (input.type !== 'file') {
            input.style.fontSize = '16px';
        }
        
        // Add better focus states for mobile
        input.addEventListener('focus', () => {
            input.style.borderColor = 'var(--accent-red)';
            input.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
        });
        
        input.addEventListener('blur', () => {
            input.style.borderColor = 'var(--aluminum-silver)';
            input.style.boxShadow = 'none';
        });
    });
}

// Initialize mobile enhancements
document.addEventListener('DOMContentLoaded', () => {
    enhanceMobileGallery();
    enhanceMobileNavigation();
    optimizeImagesForMobile();
    enhanceMobileForms();
    handleImageLoading();
});

// Form validation enhancement
function enhanceFormValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
        
        // Real-time validation for phone numbers
        if (input.type === 'tel') {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                const phoneRegex = /^[0-9+\-\s()]*$/;
                
                if (value && !phoneRegex.test(value)) {
                    input.style.borderColor = '#DC2626';
                } else {
                    input.style.borderColor = '#E8E8E8';
                }
            });
        }
        
        // Real-time validation for email
        if (input.type === 'email') {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (value && !emailRegex.test(value)) {
                    input.style.borderColor = '#DC2626';
                } else {
                    input.style.borderColor = '#E8E8E8';
                }
            });
        }
    });
}

// Initialize form validation
document.addEventListener('DOMContentLoaded', enhanceFormValidation);

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Any scroll-based functionality can go here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for potential external use
window.KunduIronSteel = {
    openModal,
    closeModal: closeModalFunc,
    showNotification,
    openWhatsApp
}; 