// Load page sections first, then initialise every interaction that depends on them.
async function loadSections() {
  const containers = [...document.querySelectorAll('[data-include]')];

  await Promise.all(containers.map(async (el) => {
    const file = el.getAttribute('data-include');
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      el.innerHTML = await res.text();
      el.classList.add('loaded');
    } catch (error) {
      console.error(`Failed to load ${file}`, error);
      el.innerHTML = '<p class="include-error">This section could not be loaded.</p>';
    }
  }));

  initLazyLoading();
  initNavigation();
  initBackToTop();
  initTimelineToggle();
  initFooterYear();
  initThemeToggle();
  initStickyHeader();
  initHorizontalScroll('.projects-scroll-container', false);
  initGalleryInteractions();
  setGalleryCycle();
}

document.addEventListener('DOMContentLoaded', loadSections);

function initTimelineToggle() {
  const button = document.querySelector('.timeline-toggle');
  const more = document.getElementById('timeline-more');
  if (!button || !more) return;

  button.addEventListener('click', () => {
    const shouldShow = more.hidden;
    more.hidden = !shouldShow;
    button.setAttribute('aria-expanded', String(shouldShow));
    button.textContent = shouldShow ? 'Hide milestones' : 'Show all milestones';
  });
}

function initFooterYear() {
  const year = document.getElementById('copyright-year');
  if (year) year.textContent = new Date().getFullYear();
}

// ===== Original interactive scripts =====
let currentImageIndex = 0;
function setGalleryCycle() {
  const images = document.querySelectorAll('.gallery img');
  const totalImages = images.length;
  if (totalImages === 0) return;
  function showNextImage() {
      images[currentImageIndex].classList.remove('active');
      currentImageIndex = (currentImageIndex + 1) % totalImages;
      images[currentImageIndex].classList.add('active');
  }
  setInterval(showNextImage, 3000);
}

// ===== Theme Toggle (Dark Mode) =====
function initThemeToggle() {
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    // Update icon immediately
    updateThemeIcon(savedTheme);
    
    // Wait for header to load, then set up toggle button
    setTimeout(() => {
        const themeToggle = document.getElementById('theme-toggle');
        const themeToggleBtn = document.querySelector('.theme-toggle-btn');
        const toggleElement = themeToggle || themeToggleBtn;
        
        if (toggleElement) {
            toggleElement.addEventListener('click', function() {
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme);
                updateAllThemeIcons(newTheme);
            });
        }
    }, 100);
    
    function updateThemeIcon(theme) {
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    }
}

// Initialize theme immediately (before DOMContentLoaded)
(function() {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
})();

// Horizontal gallery drag & auto-scroll (with touch support)
function initGalleryInteractions() {
    const gallery = document.querySelector('.horizontal-gallery');
    if (!gallery) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let startTouchX = 0;

    gallery.addEventListener('mousedown', (e) => {
        isDown = true;
        gallery.classList.add('active');
        startX = e.pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
    });

    gallery.addEventListener('mouseleave', () => {
        isDown = false;
        gallery.classList.remove('active');
    });

    gallery.addEventListener('mouseup', () => {
        isDown = false;
        gallery.classList.remove('active');
    });

    gallery.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - gallery.offsetLeft;
        gallery.scrollLeft = scrollLeft - (x - startX) * 2;
    });

    gallery.addEventListener('touchstart', (e) => {
        isDown = true;
        gallery.classList.add('active');
        startTouchX = e.touches[0].pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
    }, { passive: true });

    gallery.addEventListener('touchend', () => {
        isDown = false;
        gallery.classList.remove('active');
    });

    gallery.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - gallery.offsetLeft;
        gallery.scrollLeft = scrollLeft - (x - startTouchX) * 2;
    }, { passive: false });

    function autoScroll() {
        if (!isDown && window.innerWidth > 768) {
            gallery.scrollLeft += 1;
            if (gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth) {
                gallery.scrollLeft = 0;
            }
        }
    }

    setInterval(autoScroll, 50);
}

// ===== Horizontal Scroll Function (Reusable) =====
function initHorizontalScroll(selector, autoScrollEnabled = false) {
    const container = document.querySelector(selector);
    if (!container) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    let startTouchX;

    // Mouse events
    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('active');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isDown = false;
        container.classList.remove('active');
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
        container.classList.remove('active');
    });

    container.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    container.addEventListener('touchstart', (e) => {
        isDown = true;
        container.classList.add('active');
        startTouchX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    }, { passive: true });

    container.addEventListener('touchend', () => {
        isDown = false;
        container.classList.remove('active');
    });

    container.addEventListener('touchmove', (e) => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startTouchX) * 2;
        container.scrollLeft = scrollLeft - walk;
    }, { passive: false });

    // Auto-scroll (optional, disabled for projects)
    if (autoScrollEnabled && window.innerWidth > 768) {
        function autoScroll() {
            if(!isDown) {
                container.scrollLeft += 1;
                if(container.scrollLeft >= container.scrollWidth - container.clientWidth) {
                    container.scrollLeft = 0;
                }
            }
        }
        setInterval(autoScroll, 50);
    }
}

// Lightbox
function openLightbox(img) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = img.src;
    lightboxCaption && (lightboxCaption.innerHTML = img.alt || '');
    lightbox.style.display = "block";
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.style.display = "none";
}

window.onclick = function(event) {
    const lightbox = document.getElementById('lightbox');
    if (event.target == lightbox) {
        closeLightbox();
    }
}

document.addEventListener('keydown', function(event) {
    const lightbox = document.getElementById('lightbox');
    if (event.key === "Escape" && lightbox && lightbox.style.display === "block") {
        closeLightbox();
    }
});

// ===== Sticky Header =====
function initStickyHeader() {
    const stickyHeader = document.getElementById('stickyHeader');
    const originalNav = document.getElementById('originalNav');
    if (!stickyHeader || !originalNav) return;

    function onScroll() {
        const navBottom = originalNav.getBoundingClientRect().bottom;
        if (navBottom <= 0) {
            stickyHeader.classList.add('visible');
            originalNav.style.visibility = 'hidden';
        } else {
            stickyHeader.classList.remove('visible');
            originalNav.style.visibility = 'visible';
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const stickyToggle = document.getElementById('sticky-theme-toggle');
    if (stickyToggle) {
        stickyToggle.addEventListener('click', function() {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateAllThemeIcons(next);
        });
    }
}

function updateAllThemeIcons(theme) {
    ['theme-icon', 'sticky-theme-icon'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('fa-moon', 'fa-sun');
        el.classList.add(theme === 'dark' ? 'fa-sun' : 'fa-moon');
    });
}


// ===== Navigation Menu =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a, .sticky-nav a');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for sticky nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight active section on scroll
    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call
}

// ===== Back to Top Button =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Lazy Loading for Images =====
function initLazyLoading() {
    // Use native lazy loading if supported, otherwise use Intersection Observer
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.loading = 'lazy';
        });
    } else {
        // Fallback for browsers without native lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Mark all existing images as loaded
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
}
