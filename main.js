// Notification System
function showNotification(message, type = 'info', duration = 5000) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
                <div class="notification-content">
                    <div class="notification-icon">
                        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                    </div>
                    <div class="notification-message">${message}</div>
                    <button class="notification-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

    document.body.appendChild(notification);

    // Auto remove after duration
    const timeout = setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, duration);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// Enhanced Cursor Effects
const cursor = document.getElementById('custom-cursor');
const cursorDot = document.querySelector('.cursor-dot');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Create trail effect
    if (Math.random() > 0.7) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = `${e.clientX - 20}px`;
        trail.style.top = `${e.clientY - 20}px`;
        document.body.appendChild(trail);

        setTimeout(() => {
            trail.remove();
        }, 600);
    }
});

// Smooth cursor animation
function animateCursor() {
    // Main cursor follows with delay
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;

    // Dot follows faster
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;

    cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
    cursorDot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;

    requestAnimationFrame(animateCursor);
}

// Change cursor on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .btn, .skill-item, .project-card, .contact-item');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.mixBlendMode = 'normal';
    });

    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.mixBlendMode = 'difference';
    });
});

// Start cursor animation
animateCursor();

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');

    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('light-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        themeToggle.setAttribute('title', 'Switch to Dark Theme');
        localStorage.setItem('theme', 'light');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        themeToggle.setAttribute('title', 'Switch to Light Theme');
        localStorage.setItem('theme', 'dark');
    }
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.querySelector('i').classList.remove('fa-moon');
    themeToggle.querySelector('i').classList.add('fa-sun');
}

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
    mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
    });
});

// Header scroll effect - only for back to top button
window.addEventListener('scroll', () => {
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Back to top functionality
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form submission handling with Formspree
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Animation for button
    const submitBtn = contactForm.querySelector('button');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
        // Get form data
        const formData = new FormData(contactForm);

        // Send to Formspree
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Success
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.backgroundColor = '#10b981';

            showNotification('Message sent successfully! You will receive a confirmation email shortly.', 'success');

            // Reset form after delay
            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 3000);
        } else {
            // Error from Formspree
            const data = await response.json();
            throw new Error(data.error || 'Failed to send message');
        }
    } catch (error) {
        console.error('Error:', error);

        submitBtn.innerHTML = '<i class="fas fa-times"></i> Failed!';
        submitBtn.style.backgroundColor = '#ef4444';

        showNotification(error.message || 'Failed to send message. Please try again or email me directly.', 'error');

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.disabled = false;
        }, 3000);
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Add specific animations for timeline items
            if (entry.target.classList.contains('timeline-item')) {
                setTimeout(() => {
                    entry.target.style.transitionDelay = '0.3s';
                }, 300);
            }
        }
    });
}, observerOptions);

// Observe all sections and elements that should animate on scroll
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
});

document.querySelectorAll('.project-card').forEach(card => {
    observer.observe(card);
});

// Skill items hover effect enhancement
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    item.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Project card staggered animation
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.2}s`;
});

// Typing effect for hero
const typingText = document.querySelector('.typing-text');
const text = typingText.textContent;
typingText.textContent = '';
let charIndex = 0;

function typeWriter() {
    if (charIndex < text.length) {
        typingText.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 50);
    }
}

// Start typing effect when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        setTimeout(typeWriter, 500);
        heroObserver.disconnect();
    }
});

heroObserver.observe(document.querySelector('.hero'));

// Initialize
if (window.scrollY > 500) {
    document.getElementById('backToTop').classList.add('visible');
}

// Hide custom cursor on mobile
if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    cursorDot.style.display = 'none';
}