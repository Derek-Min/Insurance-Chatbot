// Global variables for user data and state
let currentUser = null;
let userRole = null;

// Navigation scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            hideModal(this.id);
        }
    });
});

// FAQ toggle function
function toggleFaq(element) {
    const isActive = element.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        element.classList.add('active');
    }
}

// Form validation
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.required && !value) {
        isValid = false;
        errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    
    // Email validation
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    else if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Update field appearance
    const formGroup = field.closest('.form-group');
    const errorDiv = formGroup.querySelector('.error-message');
    
    if (isValid) {
        formGroup.classList.remove('error');
    } else {
        formGroup.classList.add('error');
        errorDiv.textContent = errorMessage;
    }

    return isValid;
}

// Real-time validation
document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
        if (field.closest('.form-group').classList.contains('error')) {
            validateField(field);
        }
    });
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Validate form
    let isValid = true;
    this.querySelectorAll('input').forEach(field => {
        if (!validateField(field)) isValid = false;
    });
    
    if (isValid) {
        // Simulate login process
        currentUser = {
            email: email,
            role: email.includes('partner') ? 'partner' : 'assistant'
        };
        
        hideModal('loginModal');
        showRoleBasedView(currentUser.role);
        
        // Show success message
        alert(`Welcome back! Logged in as ${currentUser.role}`);
    }
});

// Register form submission
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    // Validate form
    let isValid = true;
    this.querySelectorAll('input, select').forEach(field => {
        if (!validateField(field)) isValid = false;
    });
    
    // Check terms consent
    const termsConsent = formData.get('termsConsent');
    if (!termsConsent) {
        const termsGroup = document.querySelector('input[name="termsConsent"]').closest('.form-group');
        termsGroup.classList.add('error');
        isValid = false;
    }
    
    if (isValid) {
        // Collect user data
        const userData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            country: formData.get('country'),
            nric: formData.get('nric'),
            dateOfBirth: formData.get('dateOfBirth'),
            marketingPreferences: {
                email: formData.get('marketingEmail') === 'on',
                sms: formData.get('marketingSms') === 'on',
                newsletter: formData.get('marketingNewsletter') === 'on'
            },
            role: 'assistant' // Default role
        };
        
        // Store user data
        currentUser = userData;
        
        hideModal('registerModal');
        showRoleBasedView('assistant');
        
        alert('Registration successful! Welcome to Shield AI');
    }
});

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    this.querySelectorAll('input, textarea').forEach(field => {
        if (!validateField(field)) isValid = false;
    });
    
    if (isValid) {
        alert('Message sent successfully! We\'ll get back to you soon.');
        this.reset();
    }
});

// Role-based view function
function showRoleBasedView(role) {
    userRole = role;
    // Here you would typically redirect to a dashboard or show role-specific content
    // For this demo, we'll show the chat interface
    showChat();
}

// Chat functions
function showChat() {
    document.getElementById('chatContainer').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideChat() {
    document.getElementById('chatContainer').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const responses = [
                "I understand you're looking for help. Let me assist you with that.",
                "That's a great question! Here's what I can help you with...",
                "I'm here to help! Could you provide more details about your inquiry?",
                "Thank you for your message. Let me find the best solution for you.",
                "I've processed your request. Here are some options that might help..."
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'bot');
        }, 1000);
    }
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    messageDiv.innerHTML = `
        <div class="message-bubble">
            <p>${text}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Enter key to send message
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Shield AI Application Initialized');
    
    // Move all existing code inside here
    // Global variables for user data and state
    let currentUser = null;
    let userRole = null;
    
    // Navigation scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Modal functions
    function showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(this.id);
            }
        });
    });
    
    // FAQ toggle function
    function toggleFaq(element) {
        const isActive = element.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            element.classList.add('active');
        }
    }
    
    // Form validation
    function validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
    
        // Required field validation
        if (field.required && !value) {
            isValid = false;
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }
        
        // Email validation
        else if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        else if (fieldName === 'phone' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
    
        // Update field appearance
        const formGroup = field.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        
        if (isValid) {
            formGroup.classList.remove('error');
        } else {
            formGroup.classList.add('error');
            errorDiv.textContent = errorMessage;
        }
    
        return isValid;
    }
    
    // Real-time validation
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.closest('.form-group').classList.contains('error')) {
                validateField(field);
            }
        });
    });
    
    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Validate form
        let isValid = true;
        this.querySelectorAll('input').forEach(field => {
            if (!validateField(field)) isValid = false;
        });
        
        if (isValid) {
            // Simulate login process
            currentUser = {
                email: email,
                role: email.includes('partner') ? 'partner' : 'assistant'
            };
            
            hideModal('loginModal');
            showRoleBasedView(currentUser.role);
            
            // Show success message
            alert(`Welcome back! Logged in as ${currentUser.role}`);
        }
    });
    
    // Register form submission
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        // Validate form
        let isValid = true;
        this.querySelectorAll('input, select').forEach(field => {
            if (!validateField(field)) isValid = false;
        });
        
        // Check terms consent
        const termsConsent = formData.get('termsConsent');
        if (!termsConsent) {
            const termsGroup = document.querySelector('input[name="termsConsent"]').closest('.form-group');
            termsGroup.classList.add('error');
            isValid = false;
        }
        
        if (isValid) {
            // Collect user data
            const userData = {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                country: formData.get('country'),
                nric: formData.get('nric'),
                dateOfBirth: formData.get('dateOfBirth'),
                marketingPreferences: {
                    email: formData.get('marketingEmail') === 'on',
                    sms: formData.get('marketingSms') === 'on',
                    newsletter: formData.get('marketingNewsletter') === 'on'
                },
                role: 'assistant' // Default role
            };
            
            // Store user data
            currentUser = userData;
            
            hideModal('registerModal');
            showRoleBasedView('assistant');
            
            alert('Registration successful! Welcome to Shield AI');
        }
    });
    
    // Contact form submission
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        this.querySelectorAll('input, textarea').forEach(field => {
            if (!validateField(field)) isValid = false;
        });
        
        if (isValid) {
            alert('Message sent successfully! We\'ll get back to you soon.');
            this.reset();
        }
    });
    
    // Role-based view function
    function showRoleBasedView(role) {
        userRole = role;
        // Here you would typically redirect to a dashboard or show role-specific content
        // For this demo, we'll show the chat interface
        showChat();
    }
    
    // Chat functions
    function showChat() {
        document.getElementById('chatContainer').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function hideChat() {
        document.getElementById('chatContainer').classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (message) {
            addMessage(message, 'user');
            input.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                const responses = [
                    "I understand you're looking for help. Let me assist you with that.",
                    "That's a great question! Here's what I can help you with...",
                    "I'm here to help! Could you provide more details about your inquiry?",
                    "Thank you for your message. Let me find the best solution for you.",
                    "I've processed your request. Here are some options that might help..."
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, 'bot');
            }, 1000);
        }
    }
    
    function addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <p>${text}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Enter key to send message
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});