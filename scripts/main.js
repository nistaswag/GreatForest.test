document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initParticles();
    initScrollEvents();
});

function initCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
   
    if (!cursor || !cursorFollower) return;
   
    // Initial styles for dark theme
    cursor.style.position = 'fixed';
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursor.style.backgroundColor = '#bb86fc';
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.transition = 'width 0.2s ease, height 0.2s ease';
    cursor.style.mixBlendMode = 'difference';
   
    cursorFollower.style.position = 'fixed';
    cursorFollower.style.width = '30px';
    cursorFollower.style.height = '30px';
    cursorFollower.style.border = '2px solid #bb86fc';
    cursorFollower.style.borderRadius = '50%';
    cursorFollower.style.pointerEvents = 'none';
    cursorFollower.style.zIndex = '9998';
    cursorFollower.style.transition = 'all 0.1s ease';
    cursorFollower.style.backgroundColor = 'transparent';
   
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
       
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 80);
    });
   
    document.addEventListener('mousedown', () => {
        cursor.style.width = '15px';
        cursor.style.height = '15px';
        cursorFollower.style.width = '40px';
        cursorFollower.style.height = '40px';
    });
   
    document.addEventListener('mouseup', () => {
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        cursorFollower.style.width = '30px';
        cursorFollower.style.height = '30px';
    });
   
    const links = document.querySelectorAll('a, button, .feature-card');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.width = '0px';
            cursor.style.height = '0px';
            cursorFollower.style.width = '50px';
            cursorFollower.style.height = '50px';
            cursorFollower.style.borderColor = '#bb86fc';
            cursorFollower.style.backgroundColor = 'rgba(178, 134, 252, 0.15)';
        });
       
        link.addEventListener('mouseleave', () => {
            cursor.style.width = '10px';
            cursor.style.height = '10px';
            cursorFollower.style.width = '30px';
            cursorFollower.style.height = '30px';
            cursorFollower.style.borderColor = '#bb86fc';
            cursorFollower.style.backgroundColor = 'transparent';
        });
    });
}

function initParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
   
    const particleCount = 30; // Reduced for performance
   
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
   
    const size = Math.random() * 4 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
   
    const xPos = Math.random() * 100;
    const yPos = Math.random() * 100;
    particle.style.left = `${xPos}%`;
    particle.style.top = `${yPos}%`;
   
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 5;
   
    particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    particle.style.opacity = Math.random() * 0.2 + 0.1;
   
    // Dark purple theme
    const hue = Math.random() * 30 + 260; // Purple range
    const lightness = Math.random() * 20 + 30; // Darker lightness 30-50%
    particle.style.backgroundColor = `hsla(${hue}, 80%, ${lightness}%, 0.6)`;
    particle.style.boxShadow = `0 0 ${size * 3}px hsla(${hue}, 80%, ${lightness}%, 0.6)`;
   
    container.appendChild(particle);
}

function initScrollEvents() {
    const featureCards = document.querySelectorAll('.feature-card');
   
    if (featureCards.length) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
       
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
       
        featureCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
       
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
       
        if (targetElement) {
            const headerHeight = 0; // No header
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
           
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

window.addEventListener('load', function() {
    const heroContent = document.querySelector('.hero-content');
    const heroGraphic = document.querySelector('.hero-graphic');
   
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
       
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 200);
    }
   
    if (heroGraphic) {
        heroGraphic.style.opacity = '0';
        heroGraphic.style.transform = 'scale(0.8)';
        heroGraphic.style.transition = 'opacity 1s ease 0.5s, transform 1s ease 0.5s';
       
        setTimeout(() => {
            heroGraphic.style.opacity = '1';
            heroGraphic.style.transform = 'scale(1)';
        }, 500);
    }
});

// Add necessary styles for dark theme
const style = document.createElement('style');
style.textContent = `
    .particle {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
    }
   
    .feature-card.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
   
    @keyframes float {
        0%, 100% { 
            transform: translate(0, 0) rotate(0deg); 
        }
        33% { 
            transform: translate(20px, -15px) rotate(120deg); 
        }
        66% { 
            transform: translate(-10px, 20px) rotate(240deg); 
        }
    }
`;
document.head.appendChild(style);