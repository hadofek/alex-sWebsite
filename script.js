// Background guitar: scroll-driven rotation + drift
const bgGuitar = document.querySelector('.bg-guitar');

if (bgGuitar && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let rafPending = false;

  function updateBgGuitar() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollY / maxScroll, 1);

    // Drift: starts upper-right, drifts to lower-left
    const xDrift = 28 - progress * 56;   // +28vw → -28vw
    const yDrift = -10 + progress * 20;  // -10vh → +10vh

    const rotation = progress * 360;
    const scale = 1 - progress * 0.18;   // slight shrink as it drifts away

    bgGuitar.style.transform =
      `translate(calc(-50% + ${xDrift}vw), calc(-50% + ${yDrift}vh)) rotate(${rotation}deg) scale(${scale})`;
  }

  window.addEventListener('scroll', () => {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        updateBgGuitar();
        rafPending = false;
      });
    }
  }, { passive: true });

  updateBgGuitar(); // set initial position
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navbar.classList.toggle('menu-open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

function closeMenu() {
  navLinks.classList.remove('open');
  navbar.classList.remove('menu-open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open menu');
  document.body.style.overflow = '';
}

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// Autofocus name field when clicking contact links
document.querySelectorAll('a[href="#contact"]').forEach(link => {
  link.addEventListener('click', () => {
    setTimeout(() => document.getElementById('name')?.focus(), 600);
  });
});

// Scroll reveal (IntersectionObserver)
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-up').forEach(el => {
  revealObserver.observe(el);
});

// Contact form submit
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Sent.';
    btn.classList.add('btn-success');

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      btn.classList.remove('btn-success');
      e.target.reset();
    }, 3200);
  }, 800);
});
