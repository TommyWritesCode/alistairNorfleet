/* ============================================================
   ALISTAIR NORFLEET — LANDING PAGE (landing.js)
   Greeting, art scroll, bibliography, essay peek
   ============================================================ */

/* ── Greeting ────────────────────────────────────────────────── */
async function initGreeting() {
  const el = document.getElementById('greetingText');
  if (!el) return;

  try {
    const text = await fetchText('data/greetings.txt');
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const chosen = lines[Math.floor(Math.random() * lines.length)];

    el.classList.add('fade');
    await new Promise(r => setTimeout(r, 300));
    el.textContent = `"${chosen}"`;
    el.classList.remove('fade');
  } catch {
    el.textContent = '"Philosophy begins in wonder."';
    el.classList.remove('fade');
  }
}

/* ── Art Scroll (left column) ────────────────────────────────── */
async function initArtScroll() {
  const container = document.getElementById('artScrollInner');
  if (!container) return;

  let artData = [];
  try {
    artData = await fetchJSON('data/art.json');
  } catch {
    // fallback: create color blocks
    artData = Array.from({ length: 6 }, (_, i) => ({
      id: `art-${i}`,
      title: `Artwork ${i + 1}`,
      placeholder: `hsl(${210 + i * 15}, 40%, ${10 + i * 3}%)`,
    }));
  }

  // Duplicate for seamless loop
  const items = [...artData, ...artData];

  container.innerHTML = items.map(art => `
    <div class="art-scroll-item" title="${art.title}">
      <img
        class="art-thumb"
        src="${art.image || ''}"
        alt="${art.title}"
        loading="lazy"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"
      >
      <div class="art-scroll-placeholder" style="display:none; background:${art.placeholder}"></div>
    </div>
  `).join('');

  // Kick off scroll animation duration based on item count
  container.style.animationDuration = `${items.length * 4}s`;
}

/* ── Bibliography (right column) ─────────────────────────────── */
async function initBibliography() {
  const container = document.getElementById('bibliographyList');
  if (!container) return;

  let essays = [];
  try {
    essays = await fetchJSON('data/essays.json');
  } catch {
    container.innerHTML = `<p style="color:var(--text-muted);font-size:0.8rem">Essays loading…</p>`;
    return;
  }

  // Group by year (descending)
  const byYear = {};
  essays.forEach(e => {
    if (!byYear[e.year]) byYear[e.year] = [];
    byYear[e.year].push(e);
  });

  const years = Object.keys(byYear).sort((a, b) => b - a);

  container.innerHTML = years.map(year => `
    <div class="biblio-year-group">
      <div class="biblio-year">${year}</div>
      ${byYear[year].map(essay => `
        <a class="biblio-entry"
           href="projects.html?essay=${essay.id}"
           title="${essay.title}">
          ${essay.title}
        </a>
      `).join('')}
    </div>
  `).join('');
}

/* ── Essay Peek (center column bottom) ───────────────────────── */
async function initEssayPeek() {
  const titleEl = document.getElementById('peekTitle');
  const metaEl  = document.getElementById('peekMeta');
  const bodyEl  = document.getElementById('peekBody');
  const wrapEl  = document.querySelector('.essay-peek-wrap');
  if (!titleEl || !wrapEl) return;

  let essays = [];
  try {
    essays = await fetchJSON('data/essays.json');
  } catch { return; }

  if (!essays.length) return;
  const latest = essays[0];

  titleEl.textContent = latest.title;
  metaEl.textContent  = `${formatDate(latest.date)} — Alistair Norfleet`;
  bodyEl.textContent  = latest.preview?.slice(0, 280) + '…';

  wrapEl.addEventListener('click', () => {
    window.location.href = `projects.html?essay=${latest.id}`;
  });
  wrapEl.style.cursor = 'pointer';
}

/* ── Boot ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initGreeting();
  initArtScroll();
  initBibliography();
  initEssayPeek();
});
