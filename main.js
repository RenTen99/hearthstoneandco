/* Hearthstone & Co. — Main JS */

// Nav scroll
const nav = document.getElementById('mainNav');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10));

// Mobile nav
function toggleNav() {
  nav && nav.classList.toggle('mobile-open');
}

// Close mobile nav on outside click
document.addEventListener('click', e => {
  if (nav && nav.classList.contains('mobile-open') && !nav.contains(e.target)) {
    nav.classList.remove('mobile-open');
  }
});

// Active nav link
document.addEventListener('DOMContentLoaded', () => {
  const p = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === '/' + p || a.getAttribute('href') === p) a.classList.add('active');
  });
});

// Counter animation
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const raw = el.getAttribute('data-count');
    const num = parseFloat(raw);
    if (isNaN(num)) return;
    const suffix = raw.replace(/[\d.]/g, '');
    const dur = 1600;
    const start = performance.now();
    const tick = t => {
      const p = Math.min((t - start) / dur, 1);
      const val = Math.floor((1 - Math.pow(1 - p, 3)) * num);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = raw;
    };
    requestAnimationFrame(tick);
  });
}

const metricsEl = document.querySelector('.metrics');
if (metricsEl) {
  new IntersectionObserver(([e]) => { if (e.isIntersecting) { animateCounters(); } }, { threshold: .4 }).observe(metricsEl);
}

// Netlify form handler
function bindForm(formId, successId) {
  const form = document.getElementById(formId);
  const suc  = document.getElementById(successId);
  if (!form || !suc) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const orig = btn.textContent;
    btn.textContent = 'Submitting…';
    btn.disabled = true;
    try {
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      });
      if (r.ok) { form.style.display = 'none'; suc.style.display = 'block'; }
      else throw new Error();
    } catch {
      alert('Something went wrong — please try again or contact us directly.');
      btn.textContent = orig;
      btn.disabled = false;
    }
  });
}

// Bind all forms
document.addEventListener('DOMContentLoaded', () => {
  bindForm('staffingForm',  'staffingSuccess');
  bindForm('clinicianForm', 'clinicianSuccess');
  bindForm('contactForm',   'contactSuccess');
});
