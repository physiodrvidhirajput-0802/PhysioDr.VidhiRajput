/* =========================================
   DR. VIDHI RAJPUT – PHYSIOTHERAPY WEBSITE
   Main Script v2.0
   ========================================= */

'use strict';

/* ============================================================
   LOADER
   ============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
    }
    // Trigger hero section animations
    document.querySelectorAll('.hero .animate-fade-left, .hero .animate-fade-right').forEach(el => {
      el.classList.add('in-view');
    });
    // Start hero counters after load
    startCounters();
  }, 2400);
});

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
}, { passive: true });

/* ============================================================
   STICKY NAVBAR
   ============================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

/* ============================================================
   HAMBURGER MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navbar && !navbar.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

// Observe all animated elements
const revealSelectors = [
  '.reveal-up', '.reveal-left', '.reveal-right',
  '.why-card', '.service-card', '.cert-badge',
  '.online-card', '.testi-card', '.gallery-grid',
  '.faq-list', '.about-specialities'
];
document.querySelectorAll(revealSelectors.join(', ')).forEach(el => {
  revealObserver.observe(el);
});

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Easing: ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(update);
}

function startCounters() {
  document.querySelectorAll('.counter').forEach(counter => {
    animateCounter(counter);
  });
}

/* ============================================================
   BUTTON RIPPLE EFFECT
   ============================================================ */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.ripple');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  Object.assign(ripple.style, {
    width: size + 'px',
    height: size + 'px',
    left: x + 'px',
    top: y + 'px'
  });
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
});

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all open items
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });

    // Open clicked item if it was closed
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ============================================================
   TESTIMONIALS SLIDER
   ============================================================ */
const testiTrack = document.getElementById('testiTrack');
const testiPrev  = document.getElementById('testiPrev');
const testiNext  = document.getElementById('testiNext');
const testiDots  = document.getElementById('testiDots');

let testiIndex    = 0;
let cardsPerView  = 3;
let totalCards    = 0;
let autoSlideTimer;

function getCardsPerView() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 960) return 2;
  return 3;
}

function buildDots() {
  if (!testiDots) return;
  testiDots.innerHTML = '';
  const totalDots = Math.ceil(totalCards / cardsPerView);
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetAutoSlide();
    });
    testiDots.appendChild(dot);
  }
}

function updateDots() {
  if (!testiDots) return;
  testiDots.querySelectorAll('.testi-dot').forEach((d, i) => {
    d.classList.toggle('active', i === testiIndex);
  });
}

function goToSlide(idx) {
  if (!testiTrack) return;
  const maxIndex = Math.max(0, Math.ceil(totalCards / cardsPerView) - 1);
  testiIndex = Math.max(0, Math.min(idx, maxIndex));

  const firstCard = testiTrack.querySelector('.testi-card');
  if (!firstCard) return;

  const cardWidth = firstCard.offsetWidth;
  const gap = 24;
  const offset = testiIndex * (cardWidth + gap) * cardsPerView;
  testiTrack.style.transform = `translateX(-${offset}px)`;
  updateDots();
}

function initSlider() {
  if (!testiTrack) return;
  cardsPerView  = getCardsPerView();
  totalCards    = testiTrack.querySelectorAll('.testi-card').length;
  testiIndex    = 0;
  testiTrack.style.transform = 'translateX(0)';
  buildDots();
  updateDots();
}

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  autoSlideTimer = setInterval(() => {
    const maxIndex = Math.max(0, Math.ceil(totalCards / cardsPerView) - 1);
    goToSlide(testiIndex >= maxIndex ? 0 : testiIndex + 1);
  }, 5500);
}

if (testiPrev) testiPrev.addEventListener('click', () => { goToSlide(testiIndex - 1); resetAutoSlide(); });
if (testiNext) testiNext.addEventListener('click', () => { goToSlide(testiIndex + 1); resetAutoSlide(); });

// Touch / swipe support
let touchStartX = 0;
if (testiTrack) {
  testiTrack.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  testiTrack.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) {
      goToSlide(diff > 0 ? testiIndex + 1 : testiIndex - 1);
      resetAutoSlide();
    }
  }, { passive: true });
}

window.addEventListener('resize', () => {
  initSlider();
  resetAutoSlide();
}, { passive: true });

initSlider();
resetAutoSlide();

/* ============================================================
   WHATSAPP APPOINTMENT BOOKING
   ============================================================ */
const bookBtn = document.getElementById('bookBtn');
if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const name        = document.getElementById('fullName')?.value.trim() || '';
    const phone       = document.getElementById('phone')?.value.trim() || '';
    const age         = document.getElementById('age')?.value.trim() || 'Not specified';
    const gender      = document.getElementById('gender')?.value || 'Not specified';
    const email       = document.getElementById('email')?.value.trim() || 'Not specified';
    const date        = document.getElementById('apptDate')?.value || 'Not specified';
    const time        = document.getElementById('apptTime')?.value || 'Not specified';
    const service     = document.getElementById('service')?.value || 'Not specified';
    const problem     = document.getElementById('problem')?.value.trim() || 'Not specified';
    const consultType = document.querySelector('input[name="consultType"]:checked')?.value || 'Home Visit';

    if (!name) {
      alert('Please enter your full name.');
      document.getElementById('fullName')?.focus();
      return;
    }
    if (!phone) {
      alert('Please enter your phone number.');
      document.getElementById('phone')?.focus();
      return;
    }

   const msg = [
  'Hello Dr. Vidhi Rajput,',
  '',
  'I would like to book an appointment.',
  '',
  `Name: ${name}`,
  `Phone: ${phone}`,
  `Age: ${age}`,
  `Gender: ${gender}`,
  `Email: ${email}`,
  `Service: ${service}`,
  `Consultation: ${consultType}`,
  `Preferred Date: ${date}`,
  `Preferred Time: ${time}`,
  `Problem: ${problem || '—'}`,
  '',
  'Please contact me. Thank you!'
].join('\n');

    const url = 'https://wa.me/919322719138?text=' + encodeURIComponent(msg);
    window.open(url, '_blank');
  });
}

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }
}, { passive: true });

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = (navbar ? navbar.offsetHeight : 80) + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   ACTIVE NAV LINK HIGHLIGHT
   ============================================================ */
const sections    = document.querySelectorAll('section[id]');
const navAnchors  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, {
  threshold: 0.35,
  rootMargin: '-80px 0px -40% 0px'
});

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   PARALLAX HERO ORB — subtle mouse tracking
   ============================================================ */
let parallaxRafId;
window.addEventListener('mousemove', (e) => {
  if (parallaxRafId) return;
  parallaxRafId = requestAnimationFrame(() => {
    const orb1 = document.querySelector('.orb1');
    const orb2 = document.querySelector('.orb2');
    const orb3 = document.querySelector('.orb3');
    if (orb1 || orb2 || orb3) {
      const x = (e.clientX / window.innerWidth - 0.5) * 28;
      const y = (e.clientY / window.innerHeight - 0.5) * 28;
      if (orb1) orb1.style.transform = `translate(${x}px, ${y}px)`;
      if (orb2) orb2.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`;
      if (orb3) orb3.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
    }
    parallaxRafId = null;
  });
}, { passive: true });

/* ============================================================
   GALLERY IMAGE FADE-IN ON LOAD
   ============================================================ */
document.querySelectorAll('.gallery-item img').forEach(img => {
  img.style.opacity = img.complete ? '1' : '0';
  img.style.transition = 'opacity 0.5s ease';
  img.addEventListener('load', () => { img.style.opacity = '1'; });
});

/* ============================================================
   LAZY LOADING FALLBACK (for browsers without native support)
   ============================================================ */
if (!('loading' in HTMLImageElement.prototype)) {
  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          delete img.dataset.src;
        }
        imgObserver.unobserve(img);
      }
    });
  });
  lazyImgs.forEach(img => imgObserver.observe(img));
}

/* ============================================================
   CONSOLE SIGNATURE
   ============================================================ */
console.log(
  '%c✅ Dr. Vidhi Rajput Physio Website v2.0 Loaded',
  'color:#009E9A; font-weight:bold; font-size:14px; padding:4px 0;'
);