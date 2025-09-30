// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Hero slider
const slides = Array.from(document.querySelectorAll('.hero-slide'));
let current = 0;
let timer = null;

function showSlide(i) {
  slides.forEach((img, idx) => {
    img.style.opacity = idx === i ? '1' : '0';
    img.style.transform = idx === i ? 'scale(1.02)' : 'scale(1)';
  });
}
function next() { current = (current + 1) % slides.length; showSlide(current); }
function prev() { current = (current - 1 + slides.length) % slides.length; showSlide(current); }

const nextBtn = document.getElementById('nextSlide');
const prevBtn = document.getElementById('prevSlide');
if (nextBtn && prevBtn) {
  nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
}
function startAuto() { timer = setInterval(next, 3500); }
function resetAuto() { clearInterval(timer); startAuto(); }
if (slides.length) { showSlide(0); startAuto(); }

// Gallery filters
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('#gallery .card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-filter');
    cards.forEach(card => {
      const isMatch = target === 'all' || card.classList.contains(target);
      card.style.display = isMatch ? '' : 'none';
    });
    filterBtns.forEach(b => b.classList.remove('btn-gold'));
    btn.classList.add('btn-gold');
  });
});

// Lightbox
const openers = document.querySelectorAll('.open-lightbox');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeLightbox = document.getElementById('closeLightbox');
openers.forEach((btn) => {
  btn.addEventListener('click', () => {
    const img = btn.closest('.relative').querySelector('img');
    lightboxImg.src = img.getAttribute('src');
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
  });
});
if (closeLightbox) closeLightbox.addEventListener('click', () => { lightbox.classList.add('hidden'); lightbox.classList.remove('flex'); });
if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) { lightbox.classList.add('hidden'); lightbox.classList.remove('flex'); } });

// Contact form -> POST /api/contact
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const data = new FormData(form);
      const res = await fetch('/api/contact', { method: 'POST', body: data });
      if (!res.ok) throw new Error('Request failed');
      const json = await res.json();
      statusEl.textContent = json.message || 'Thanks! We will contact you soon.';
      form.reset();
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Sorry, something went wrong. Please try again or email ZARSAGOLD@GMAIL.COM';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send';
    }
  });
}

// Cancel button: reset form and clear status
const cancelBtn = document.getElementById('cancelBtn');
if (cancelBtn && form) {
  cancelBtn.addEventListener('click', () => {
    form.reset();
    if (statusEl) statusEl.textContent = '';
  });
}
