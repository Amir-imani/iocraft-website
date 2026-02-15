/**
 * assets/js/main.js
 * Main entry point for the Landing Page (index.html).
 * Handles: Preloader, Hero Animations, Smooth Scroll.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. PRELOADER LOGIC ---
  const preloader = document.getElementById('preloader');
  
  // Wait for all assets (images, styles) to fully load
  window.addEventListener('load', () => {
    if (preloader) {
      // Add hidden class to trigger CSS opacity transition
      preloader.classList.add('preloader-hidden');

      // Remove from DOM after transition (0.5s) to free memory
      setTimeout(() => {
        preloader.remove();
        // Trigger entrance animations after preloader is gone
        initHeroAnimations();
      }, 500);
    } else {
      // Fallback if no preloader found
      initHeroAnimations();
    }
  });


  // --- 2. SMOOTH SCROLL FOR ANCHOR LINKS ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70; // Height of fixed header
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

});

/**
 * --- 3. HERO SECTION ANIMATIONS (GSAP) ---
 * check if GSAP is loaded before running
 */
function initHeroAnimations() {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded.');
    return;
  }

  // Animate Text Elements
  gsap.from(".hero-text > *", {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.15, // Delay between each element
    ease: "power3.out"
  });

  // Animate Avatar
  gsap.from(".hero-avatar", {
    scale: 0.8,
    opacity: 0,
    duration: 1.2,
    delay: 0.4,
    ease: "elastic.out(1, 0.5)"
  });
}