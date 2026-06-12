/**
 * Lencomedicale LK - Main JavaScript
 * Handles navigation, form submissions, animations, and localStorage data management
 */

// ===== Mobile Navigation =====
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    // Close on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
}

// ===== Header Scroll Effect =====
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// ===== Scroll Animations =====
const observerOpts = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOpts);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card, .step, .form-card, .contact-info-card').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`;
        observer.observe(el);
    });
});

// ===== Data Storage Helpers =====
const DB = {
    get(key) {
        try { return JSON.parse(localStorage.getItem(key)) || []; }
        catch { return []; }
    },
    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    add(key, entry) {
        const data = this.get(key);
        entry.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        entry.submittedAt = new Date().toISOString();
        entry.status = 'new';
        entry.notes = '';
        data.unshift(entry);
        this.set(key, data);
        return entry;
    }
};

// ===== CV Submission Form =====
const cvForm = document.getElementById('cvSubmissionForm');
if (cvForm) {
    cvForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all required checkboxes
        const checkboxes = this.querySelectorAll('input[type="checkbox"][required]');
        let allChecked = true;
        checkboxes.forEach(cb => {
            if (!cb.checked) { allChecked = false; cb.parentElement.style.color = 'var(--error)'; }
            else { cb.parentElement.style.color = ''; }
        });
        if (!allChecked) { alert('Please agree to all consent checkboxes before submitting.'); return; }

        // Collect form data
        const formData = new FormData(this);
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (key === 'cvFile' || key === 'coverLetter' || key === 'certificates') {
                // Store file name only (actual file storage would require backend)
                if (value && value.name) data[key] = value.name;
            } else {
                data[key] = value;
            }
        }

        // Save to localStorage
        DB.add('doctor_submissions', data);

        // Show success
        document.getElementById('cvFormCard').style.display = 'none';
        document.getElementById('cvSuccess').classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Medical Centre Inquiry Form =====
const centreForm = document.getElementById('centreInquiryForm');
if (centreForm) {
    centreForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        DB.add('centre_enquiries', data);

        document.getElementById('centreFormCard').style.display = 'none';
        document.getElementById('centreSuccess').classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        DB.add('contact_messages', data);

        document.getElementById('contactFormCard').style.display = 'none';
        document.getElementById('contactSuccess').classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
