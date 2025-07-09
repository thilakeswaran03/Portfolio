const typingText = document.getElementById('typing-text');
const phrases = ['Full-Stack Developer', 'Problem Solver', 'Machine Learning Enthusiast'];
let i = 0, j = 0, isDeleting = false;

function typeEffect() {
    const text = phrases[i];

    if (isDeleting) {
        j--;
    } else {
        j++;
    }

    typingText.textContent = text.substring(0, j);

    if (!isDeleting && j === text.length) {
        setTimeout(() => {
            isDeleting = true;
            typeEffect();
        }, 1500); // Pause before deleting
        return;
    } else if (isDeleting && j === 0) {
        isDeleting = false;
        i = (i + 1) % phrases.length;
    }

    setTimeout(typeEffect, 100); // constant speed
}

// Start typing
typeEffect();

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');

    if (body.getAttribute('data-theme') === 'dark') {
        body.setAttribute('data-theme', 'light');
        themeToggle.textContent = '☀️';
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '🌙';
    }
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('show');
}

// ScrollSpy for active nav link
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href").substring(1) === entry.target.id) {
                    link.classList.add("active");
                }
            });
        }
    });
}, {
    threshold: 0.6
});

sections.forEach(section => observer.observe(section));