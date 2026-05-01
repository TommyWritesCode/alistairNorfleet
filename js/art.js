/* ============================================================
   ALISTAIR NORFLEET — ART GALLERY (art.js)
   Gallery grid, scroll reveal, lightbox, float animations
   ============================================================ */

let artData  = [];
let lightboxIndex = 0;

/* ── Float animation variation ───────────────────────────────── */
const FLOAT_DURATIONS = [5.5, 6.2, 7, 5.8, 6.8, 7.5, 5.2, 6.5];
const FLOAT_DELAYS    = [0, 0.8, 1.6, 2.4, 0.4, 1.2, 2, 0.6];

/* ── Grid size → span config ─────────────────────────────────── */
const SIZE_SPANS = {
  large:    { col: 5, row: 8 },
  standard: { col: 4, row: 6 },
  portrait: { col: 3, row: 8 },
  wide:     { col: 6, row: 5 },
};

/* ── Build art HTML ──────────────────────────────────────────── */
function buildArtItem(art, index) {
  const size = art.size || 'standard';
  const floatDur   = FLOAT_DURATIONS[index % FLOAT_DURATIONS.length];
  const floatDelay = FLOAT_DELAYS[index % FLOAT_DELAYS.length];

  return `
    <article
      class="gallery-item"
      data-size="${size}"
      data-index="${index}"
      style="--float-duration:${floatDur}s; --float-delay:${floatDelay}s"
      role="button"
      tabindex="0"
      aria-label="View: ${art.title}, ${art.year}"
    >
      <img
        class="gallery-item-art"
        src="${art.image || ''}"
        alt="${art.title} — ${art.medium}"
        loading="lazy"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"
      >
      <div
        class="gallery-item-art"
        style="display:none; background:${art.placeholder}; position:absolute; inset:0;"
        aria-hidden="true"
      ></div>
      <div class="gallery-item-overlay" aria-hidden="true">
        <div class="gallery-item-year">${art.year}</div>
        <div class="gallery-item-title">${art.title}</div>
        <div class="gallery-item-meta">${art.medium} · ${art.dimensions}</div>
      </div>
    </article>
  `;
}

/* ── Scroll-reveal for gallery items ─────────────────────────── */
function initGalleryReveal() {
  const items = document.querySelectorAll('.gallery-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.index || 0) * 60;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  items.forEach(item => observer.observe(item));
}

/* ── Lightbox ────────────────────────────────────────────────── */
function openLightbox(index) {
  lightboxIndex = index;
  const art = artData[index];
  if (!art) return;

  const lb = document.getElementById('lightbox');
  if (!lb) return;

  updateLightboxContent(art);
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Focus close button for keyboard accessibility
  lb.querySelector('.lightbox-close')?.focus();
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxNavigate(dir) {
  lightboxIndex = (lightboxIndex + dir + artData.length) % artData.length;
  const art = artData[lightboxIndex];
  updateLightboxContent(art);
}

function updateLightboxContent(art) {
  const titleEl  = document.getElementById('lbTitle');
  const yearEl   = document.getElementById('lbYear');
  const mediumEl = document.getElementById('lbMedium');
  const dimsEl   = document.getElementById('lbDims');
  const descEl   = document.getElementById('lbDesc');
  const imgEl    = document.getElementById('lbImg');
  const phEl     = document.getElementById('lbPlaceholder');

  if (titleEl)  titleEl.textContent  = art.title;
  if (yearEl)   yearEl.textContent   = art.year;
  if (mediumEl) mediumEl.textContent = art.medium;
  if (dimsEl)   dimsEl.textContent   = art.dimensions;
  if (descEl)   descEl.textContent   = art.description;

  if (imgEl && phEl) {
    if (art.image) {
      imgEl.src = art.image;
      imgEl.alt = art.title;
      imgEl.style.display = '';

      imgEl.onerror = () => {
        imgEl.style.display = 'none';
        phEl.style.display = 'block';
        phEl.style.background = art.placeholder;
      };
    } else {
      imgEl.style.display = 'none';
      phEl.style.display = 'block';
      phEl.style.background = art.placeholder;
    }
  }
}

function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  // Close button
  lb.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);

  // Click backdrop to close
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

  // Navigation buttons
  document.getElementById('lbPrev')?.addEventListener('click', () => lightboxNavigate(-1));
  document.getElementById('lbNext')?.addEventListener('click', () => lightboxNavigate(1));

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')    closeLightbox();
    if (e.key === 'ArrowLeft') lightboxNavigate(-1);
    if (e.key === 'ArrowRight')lightboxNavigate(1);
  });
}

/* ── Ambient floating particles ──────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.4 + 0.05,
    };
  }

  resize();
  particles = Array.from({ length: 55 }, makeParticle);
  window.addEventListener('resize', resize, { passive: true });

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -5) { Object.assign(p, makeParticle(), { y: H + 5 }); }
      if (p.x < 0)  p.x = W;
      if (p.x > W)  p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224, 122, 63, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  tick();
}

/* ── Boot ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  // Loading state
  grid.innerHTML = `
    <div style="grid-column:1/-1;display:flex;align-items:center;justify-content:center;
                gap:12px;padding:80px 0;">
      <div class="spinner"></div>
      <span style="color:var(--text-muted);font-size:0.85rem;font-family:Barlow,sans-serif">Loading gallery…</span>
    </div>
  `;

  try {
    artData = await fetchJSON('data/art.json');
  } catch {
    grid.innerHTML = `<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:60px">
      Gallery could not be loaded.
    </p>`;
    return;
  }

  grid.innerHTML = artData.map((art, i) => buildArtItem(art, i)).join('');

  // Wire up click & keyboard for each item
  grid.querySelectorAll('.gallery-item').forEach(item => {
    const open = () => openLightbox(parseInt(item.dataset.index));
    item.addEventListener('click', open);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  initGalleryReveal();
  initLightbox();
  initParticles();
});
