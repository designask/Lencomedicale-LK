// ===== Mobile Navigation Toggle =====
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks) navLinks.classList.remove('active');
        if (mobileToggle) mobileToggle.classList.remove('active');
    });
});

// ===== Header Scroll Effect =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.step-card, .feature-card, .visual-card, .exam-card, .contact-info-card, .specialty-tag'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.5s ease ${index * 0.08}s`;
        observer.observe(el);
    });
});

// ===== Smooth Scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// ===== Contact Form Handler =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        let isValid = true;
        const requiredFields = this.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'var(--error)';
            } else {
                field.style.borderColor = 'var(--border-color)';
            }
        });
        
        if (isValid) {
            // Show success message
            const submitBtn = this.querySelector('.form-submit .btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = 'var(--success)';
            submitBtn.style.borderColor = 'var(--success)';
            
            // Reset after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.style.borderColor = '';
                this.reset();
            }, 3000);
        }
    });
}

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const text = counter.textContent;
        const match = text.match(/(\d[\d,]*)/);
        if (!match) return;
        
        const number = parseInt(match[1].replace(/,/g, ''));
        const suffix = text.replace(match[1], '').trim();
        const prefix = text.indexOf(match[1]) > 0 ? text.substring(0, text.indexOf(match[1])) : '';
        
        if (isNaN(number)) return;
        
        let current = 0;
        const increment = number / 40;
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                counter.textContent = text;
                clearInterval(timer);
            } else {
                const formatted = Math.floor(current).toLocaleString();
                counter.textContent = prefix + formatted + suffix;
            }
        }, 30);
    });
}

// Run counter animation when stats are visible
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}
