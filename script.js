// ========================================
// Educational Games Platform - JavaScript
// Interactive Category Filtering & Animations
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // Mobile Menu Toggle
    // ========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }

    // ========================================
    // Category Filtering System
    // ========================================
    const categoryTabs = document.querySelectorAll('.category-tab');
    const gameCards = document.querySelectorAll('.game-card');

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const selectedCategory = this.getAttribute('data-category');

            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Filter games with smooth animation
            filterGames(selectedCategory);
        });
    });

    function filterGames(category) {
        gameCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');

            if (category === 'all' || cardCategory === category) {
                // Show card with fade-in animation
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                // Hide card with fade-out animation
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    // ========================================
    // Smooth Scroll for Navigation Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // ========================================
    // Intersection Observer for Scroll Animations
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe game cards and benefit cards
    document.querySelectorAll('.game-card, .benefit-card').forEach(card => {
        observer.observe(card);
    });

    // ========================================
    // Form Validation & Submission
    // ========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Display success message (in production, this would send to a backend)
            alert(`🎉 Thank you for your interest, ${formObject.contactName}!\n\nWe'll contact you at ${formObject.email} soon to schedule your free demo.\n\nGet ready to make learning fun at ${formObject.schoolName}! 🚀`);

            // Reset form
            contactForm.reset();

            // Log to console (for demo purposes)
            console.log('Demo Request Submitted:', formObject);
        });

        // Real-time email validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', function () {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (this.value && !emailPattern.test(this.value)) {
                    this.style.border = '2px solid #EF4444';
                } else {
                    this.style.border = 'none';
                }
            });
        }
    }

    // ========================================
    // Game Card Hover Effect Enhancements
    // ========================================
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        });
    });

    // ========================================
    // Add Dynamic Welcome Message
    // ========================================
    console.log('%c🎮 Welcome to PlayLearn Games! 🎓', 'font-size: 20px; color: #8B5CF6; font-weight: bold;');
    console.log('%cWhere learning feels like play!', 'font-size: 14px; color: #F59E0B;');

    // ========================================
    // Initialize Category Display
    // ========================================
    // Set initial opacity for smooth transitions
    gameCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
});
