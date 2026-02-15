document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. PRELOADER LOGIC
       ========================================= */
    const preloader = document.getElementById('preloader');
    
    const removePreloader = () => {
        if (!preloader || preloader.classList.contains('hidden')) return;
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
            preloader.remove();
        }, 800);
    };

    // اگر صفحه لود شده بود سریع بردار، اگر نه صبر کن
    if (document.readyState === 'complete') {
        setTimeout(removePreloader, 2500);
    } else {
        window.addEventListener('load', () => setTimeout(removePreloader, 2500));
        // Fallback: اگر نت ضعیف بود بعد از 5 ثانیه به زور باز شو
        setTimeout(removePreloader, 5000); 
    }

    /* =========================================
       2. THEME SWITCHER
       ========================================= */
    const themeBtn = document.getElementById('themeToggle');
    const body = document.body;
    const themes = ['', 'theme-blue', 'theme-light'];
    let currentThemeIndex = 0; 

    if(themeBtn){
        themeBtn.addEventListener('click', () => {
            if(themes[currentThemeIndex]) body.classList.remove(themes[currentThemeIndex]);
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            if(themes[currentThemeIndex]) body.classList.add(themes[currentThemeIndex]);
        });
    }

    /* =========================================
       5. BACK TO TOP BUTTON LOGIC
       ========================================= */
    const backToTopBtn = document.getElementById('backToTop');

    if(backToTopBtn) {
        // Show/Hide on Scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // اگر بیشتر از 300 پیکسل اسکرول شد
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // Click to Scroll Top
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // اسکرول نرم
            });
        });
    }
});