/* ============================================================
   ALISTAIR NORFLEET — SHARED UTILITIES (main.js)
   Runs on every page: header, footer, nav, helpers
   ============================================================ */

/* ── Shared data fetcher ─────────────────────────────────────── */
async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load ${path}`);
  return res.json();
}

async function fetchText(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load ${path}`);
  return res.text();
}

/* ── Date helpers ────────────────────────────────────────────── */
function formatDate(isoStr) {
  const d = new Date(isoStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/* ── Header: scroll opacity + mobile menu ────────────────────── */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  // Active page link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage ||
       (currentPage === '' && href === 'index.html') ||
       (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Scroll-driven header opacity
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile hamburger
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  mobileNav.addEventListener('click', e => {
    if (e.target === mobileNav) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ── Intersection Observer: reveal on scroll ─────────────────── */
function initScrollReveal(selector = '[data-reveal]', opts = {}) {
  const items = document.querySelectorAll(selector);
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px', ...opts });

  items.forEach(el => observer.observe(el));
}

/* ── DOM helper ──────────────────────────────────────────────── */
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'style') node.style.cssText = v;
    else if (k.startsWith('data-')) node.setAttribute(k, v);
    else node[k] = v;
  });
  children.flat().forEach(c => {
    if (c == null) return;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
}

/* ── Instagram SVG icon (inline, no external deps) ───────────── */
const INSTAGRAM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
</svg>`;

const EMAIL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
</svg>`;

const RESUME_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
</svg>`;

/* ── Footer injection ────────────────────────────────────────── */
function initFooter() {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;

  footer.innerHTML = `
    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"
       class="footer-link" aria-label="Visit Instagram profile">
      ${INSTAGRAM_SVG}
      <span>Instagram</span>
    </a>
    <div class="footer-divider" aria-hidden="true"></div>
    <a href="mailto:alistairnorfleet@gmail.com" class="footer-link" aria-label="Send an email">
      ${EMAIL_SVG}
      <span>Ask me anything!</span>
    </a>
  `;
}

/* ── Boot ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initFooter();
});
