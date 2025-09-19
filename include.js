// Simple client-side include loader
document.addEventListener('DOMContentLoaded', async () => {
  const containers = document.querySelectorAll('[data-include]');
  for (const el of containers) {
    const file = el.getAttribute('data-include');
    try {
      const res = await fetch(file);
      const html = await res.text();
      el.innerHTML = html;
    } catch (e) {
      el.innerHTML = `<p style="color:red">Failed to load ${file}</p>`;
    }
  }
});

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

// Initialize after includes load (a bit later)
setTimeout(setGalleryCycle, 1000);

// Horizontal gallery drag & auto-scroll
document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.horizontal-gallery');
    if (!gallery) return;
    let isDown = false;
    let startX;
    let scrollLeft;

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
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - gallery.offsetLeft;
        const walk = (x - startX) * 2;
        gallery.scrollLeft = scrollLeft - walk;
    });

    function autoScroll() {
        if(!isDown) {
            gallery.scrollLeft += 1;
            if(gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth) {
                gallery.scrollLeft = 0;
            }
        }
    }
    setInterval(autoScroll, 50);
});

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
