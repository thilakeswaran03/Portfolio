// Carousel states
const carouselStates = {
  skills: {
    currentPage: 0,
    get totalPages() {
      return document.querySelectorAll('.carousel-page[data-carousel="skills"]').length;
    }
  },
  projects: {
    currentPage: 0,
    get totalPages() {
      return document.querySelectorAll('.carousel-page[data-carousel="projects"]').length;
    }
  },
  certifications: {
    currentPage: 0,
    get totalPages() {
      return document.querySelectorAll('.carousel-page[data-carousel="certifications"]').length;
    }
  }
};

// Custom Cursor with Trails
const cursor = document.querySelector('.cursor');
const trails = [];

// Create cursor trails
for (let i = 0; i < 8; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    trails.push(trail);
}
let mouseX = 0, mouseY = 0;
let trailX = [], trailY = [];

for (let i = 0; i < trails.length; i++) {
    trailX[i] = 0;
    trailY[i] = 0;
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX - 10 + 'px';
    cursor.style.top = mouseY - 10 + 'px';
});

// Animate cursor trails
function animateTrails() {
    for (let i = 0; i < trails.length; i++) {
        trailX[i] += (mouseX - trailX[i]) * (0.3 - i * 0.03);
        trailY[i] += (mouseY - trailY[i]) * (0.3 - i * 0.03);
        
        trails[i].style.left = trailX[i] - 2 + 'px';
        trails[i].style.top = trailY[i] - 2 + 'px';
        trails[i].style.opacity = (1 - i * 0.12);
    }
    requestAnimationFrame(animateTrails);
}
animateTrails();

// Magnetic cursor effect
document.querySelectorAll('.glass-card, .carousel-button, .download-button, .nav-link, .submit-button, .carousel-dot').forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursor.style.background = 'radial-gradient(circle, #7c3aed 0%, #00d4ff 100%)';
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.background = 'radial-gradient(circle, #00d4ff 0%, #7c3aed 100%)';
    });
});
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
// Carousel navigation functions
function nextCarouselPage(carouselName) {
  const state = carouselStates[carouselName];
  if (state.currentPage < state.totalPages - 1) {
    flipCarouselToPage(carouselName, state.currentPage + 1, 'right');
  }
}

function prevCarouselPage(carouselName) {
  const state = carouselStates[carouselName];
  if (state.currentPage > 0) {
    flipCarouselToPage(carouselName, state.currentPage - 1, 'left');
  }
}

function flipCarouselToPage(carouselName, pageIndex, direction) {
  const state = carouselStates[carouselName];

  if (carouselName === "projects") {
    const pages = document.querySelectorAll(`.carousel-page[data-carousel="${carouselName}"]`);
    const prevPage = document.querySelector(`.carousel-page[data-carousel="${carouselName}"][data-page="${state.currentPage}"]`);
    const nextPage = document.querySelector(`.carousel-page[data-carousel="${carouselName}"][data-page="${pageIndex}"]`);

    if (!prevPage || !nextPage || pageIndex === state.currentPage) return;

    const prevCard = prevPage.querySelector(".project-card");
    const nextCard = nextPage.querySelector(".project-card");

    // Reset all animations
    pages.forEach(p => {
      const card = p.querySelector(".project-card");
      if (card) {
        card.classList.remove("slide-in-left", "slide-in-right", "slide-out-left", "slide-out-right");
      }
      p.classList.remove("active");
      p.style.display = "none";
    });

    // Prepare next page
    nextPage.style.display = "flex";
    nextPage.classList.add("active");

    // Animate transition
    const outClass = direction === 'left' ? "slide-out-right" : "slide-out-left";
    const inClass = direction === 'left' ? "slide-in-left" : "slide-in-right";

    if (prevCard) prevCard.classList.add(outClass);
    if (nextCard) {
      // Force reflow to restart animation
      void nextCard.offsetWidth;
      nextCard.classList.add(inClass);
    }

    // Update dots and state
    document.querySelectorAll(`.carousel-dot[data-carousel="${carouselName}"]`).forEach((dot, index) => {
      dot.classList.toggle("active", index === pageIndex);
    });

    state.currentPage = pageIndex;

    return;
  }

  // Default carousel logic for other carousels
  const allPages = document.querySelectorAll(`.carousel-page[data-carousel="${carouselName}"]`);
  const nextPageEl = document.querySelector(`.carousel-page[data-carousel="${carouselName}"][data-page="${pageIndex}"]`);

  allPages.forEach(page => {
    page.classList.remove("active");
    page.style.display = "none";
  });

  nextPageEl.style.display = "flex";
  setTimeout(() => {
    nextPageEl.classList.add("active");
  }, 20);

  document.querySelectorAll(`.carousel-dot[data-carousel="${carouselName}"]`).forEach((dot, index) => {
    dot.classList.toggle("active", index === pageIndex);
  });

  state.currentPage = pageIndex;
}



// Carousel dot click handlers
document.querySelectorAll('.carousel-dot').forEach(dot => {
    dot.addEventListener('click', () => {
        const carouselName = dot.getAttribute('data-carousel');
        const pageIndex = parseInt(dot.getAttribute('data-page'));
        const state = carouselStates[carouselName];
        
        if (pageIndex !== state.currentPage) {
            flipCarouselToPage(carouselName, pageIndex);
        }
    });
});

// Smooth scroll navigation
document.querySelectorAll('.nav-link').forEach(dot => {
    dot.addEventListener('click', () => {
        const sectionId = dot.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        
        // Update active nav dot
        document.querySelectorAll('.nav-link').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        
        // Smooth scroll to section
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Update active nav dot on scroll
const sections = document.querySelectorAll('.section');
const navDots = document.querySelectorAll('.nav-link');

function updateActiveNavDot() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            navDots.forEach(dot => dot.classList.remove('active'));
            navDots[index].classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavDot);

// Form submission
function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Simulate quantum transmission
    alert(`Quantum signal received from ${data.name}! Your transmission has been processed through the neural network. (Demo mode - no actual signal was sent)`);
    event.target.reset();
}


        // Parallax effect for background
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.bg-animation');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });

        // Add ripple effect to buttons
        document.querySelectorAll('.carousel-button, .download-button, .submit-button').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.3)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                ripple.style.pointerEvents = 'none';
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Keyboard navigation for carousels
        document.addEventListener('keydown', (e) => {
            // Check if we're in a carousel section
            const activeSection = document.querySelector('.section:hover .carousel-container');
            if (activeSection) {
                const carouselName = activeSection.querySelector('.carousel-page').getAttribute('data-carousel');
                
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevCarouselPage(carouselName);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextCarouselPage(carouselName);
                }
            }
        });
        
const carousel = document.getElementById("skillCarousel");
const wrapper = document.querySelector(".skill-carousel-wrapper");
let cards = carousel.querySelectorAll(".skill-card");
const visibleCount = 3;
const cloneCount = visibleCount;

let index = cloneCount;
let cardWidth = cards[0].offsetWidth + 30; // Includes margin

// 1. Clone first & last N cards
for (let i = 0; i < cloneCount; i++) {
  carousel.appendChild(cards[i].cloneNode(true));
  carousel.insertBefore(cards[cards.length - 1 - i].cloneNode(true), carousel.firstChild);
}
cards = carousel.querySelectorAll(".skill-card");

// 2. Get center offset
function getCenterOffset() {
  return (wrapper.offsetWidth / 2) - (cardWidth / 2);
}

// 3. Apply transform with center alignment
function applyTransform() {
  const centerOffset = getCenterOffset(); // already half wrapper - half card
  carousel.style.transform = `translateX(${-index * cardWidth + centerOffset}px)`;
  carousel.style.transition = carousel.style.transition || "transform 0.5s ease-in-out";
}


// 4. Add active bulge class to center card
function updateActiveCard() {
  cards.forEach(card => card.classList.remove("active"));
  const center = index; // Center card is always index + 1
  if (cards[center]) cards[center].classList.add("active");
}

// 5. Shift carousel by step
function shiftCarousel(step) {
  index += step;
  carousel.style.transition = "transform 0.5s ease-in-out";
  applyTransform();
  updateActiveCard();

  setTimeout(() => {
    if (index >= cards.length - cloneCount) {
      index = cloneCount;
      carousel.style.transition = "none";
      applyTransform();
      updateActiveCard();
    } else if (index < cloneCount) {
      index = cards.length - cloneCount * 2;
      carousel.style.transition = "none";
      applyTransform();
      updateActiveCard();
    }
  }, 500);
}

// 6. Auto-slide
let autoSlide = setInterval(() => shiftCarousel(1), 3000);

// 7. Manual button trigger
window.manualShift = function (dir) {
  clearInterval(autoSlide);
  shiftCarousel(dir);
  autoSlide = setInterval(() => shiftCarousel(1), 3000);
};

// 8. On resize, realign center
window.addEventListener("resize", () => {
  carousel.style.transition = "none";
  applyTransform();
  updateActiveCard();
});

// 9. Init
window.addEventListener("load", () => {
  cardWidth = cards[0].offsetWidth + 30;
  applyTransform();
  updateActiveCard();

  // Fix: Apply drop-in to first visible project card
  const initialProject = document.querySelector(`.carousel-page[data-carousel="projects"][data-page="0"] .project-card`);
  if (initialProject) {
    initialProject.classList.add("drop-in");
  }
});

// === Certifications Carousel ===
const certCarousel = document.getElementById("certCarousel");
const certWrapper = document.querySelector(".cert-carousel-wrapper");
let certCards = certCarousel.querySelectorAll(".cert-card");
const visibleCertCount = 3;
const cloneCertCount = visibleCertCount;
let certIndex = cloneCertCount;
let certCardWidth = certCards[0].offsetWidth + 30;
for (let i = 0; i < cloneCertCount; i++) {
  certCarousel.appendChild(certCards[i].cloneNode(true));
  certCarousel.insertBefore(certCards[certCards.length - 1 - i].cloneNode(true), certCarousel.firstChild);
}
certCards = certCarousel.querySelectorAll(".cert-card");
function getCertCenterOffset() {
  return certWrapper.offsetWidth / 2 - certCardWidth / 2;
}
function applyCertTransform() {
  const offset = getCertCenterOffset();
  certCarousel.style.transform = `translateX(${-certIndex * certCardWidth + offset}px)`;
  certCarousel.style.transition = certCarousel.style.transition || "transform 0.5s ease-in-out";
}
function updateActiveCertCard() {
  certCards.forEach(card => card.classList.remove("active"));
  if (certCards[certIndex]) certCards[certIndex].classList.add("active");
}
function shiftCertCarousel(step) {
  certIndex += step;
  certCarousel.style.transition = "transform 0.5s ease-in-out";
  applyCertTransform();
  updateActiveCertCard();
  setTimeout(() => {
    if (certIndex >= certCards.length - cloneCertCount) {
      certIndex = cloneCertCount;
      certCarousel.style.transition = "none";
      applyCertTransform();
      updateActiveCertCard();
    } else if (certIndex < cloneCertCount) {
      certIndex = certCards.length - cloneCertCount * 2;
      certCarousel.style.transition = "none";
      applyCertTransform();
      updateActiveCertCard();
    }
  }, 500);
}
let autoCertSlide = setInterval(() => shiftCertCarousel(1), 3000);
window.manualCertShift = function(dir) {
  clearInterval(autoCertSlide);
  shiftCertCarousel(dir);
  autoCertSlide = setInterval(() => shiftCertCarousel(1), 3000);
};
window.addEventListener("resize", () => {
  certCarousel.style.transition = "none";
  applyCertTransform();
  updateActiveCertCard();
});
window.addEventListener("load", () => {
  certCardWidth = certCards[0].offsetWidth + 30;
  applyCertTransform();
  updateActiveCertCard();
});
