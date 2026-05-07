let essays = [];
let currentEssayId = null;

function renderEssay(essay) {
  const docEl   = document.getElementById('essayDocument');
  const iframeEl = document.getElementById('essayFrame');
  if (!docEl) return;

  currentEssayId = essay.id;

  const dlBtn = document.querySelector('.download-btn');
  if (dlBtn) {
    dlBtn.href = essay.pdf;
    dlBtn.download = `${essay.id}.pdf`;
  }

  docEl.classList.add('loading');

  if (iframeEl && essay.pdf) {
    iframeEl.src = essay.pdf;
    iframeEl.style.display = 'block';
    docEl.style.display = 'none';
    iframeEl.onerror = () => {
      iframeEl.style.display = 'none';
      docEl.style.display = 'block';
      showHtmlFallback(docEl, essay);
    };
  } else {
    if (iframeEl) iframeEl.style.display = 'none';
    docEl.style.display = 'block';
    showHtmlFallback(docEl, essay);
  }

  docEl.classList.remove('loading');

  document.querySelectorAll('.sidebar-essay-item').forEach(item => {
    item.classList.toggle('active', item.dataset.id === essay.id);
  });

  document.title = `${essay.title} — Alistair Norfleet`;

  const url = new URL(window.location);
  url.searchParams.set('essay', essay.id);
  history.replaceState(null, '', url);
}

function showHtmlFallback(docEl, essay) {
  setTimeout(() => {
    docEl.innerHTML = `
      <div class="essay-doc-label">Essay</div>
      <h1 class="essay-doc-title">${essay.title}</h1>
      <div class="essay-doc-author">Alistair Norfleet</div>
      <div class="essay-doc-meta">${formatDate(essay.date)}</div>
      <div class="essay-doc-abstract">${essay.description}</div>
      <div class="essay-doc-body">${formatBodyText(essay.preview)}</div>
    `;
  }, 180);
}

function formatBodyText(text) {
  if (!text) return '';
  return text
    .split(/\n\n+/)
    .map(p => `<p>${p.replace(/\n/g, ' ').trim()}</p>`)
    .join('');
}

function renderSidebar(essays, activeId) {
  const sidebar = document.getElementById('essayList');
  if (!sidebar) return;

  sidebar.innerHTML = essays.map(essay => `
    <div class="sidebar-essay-item${essay.id === activeId ? ' active' : ''}"
         data-id="${essay.id}"
         role="button"
         tabindex="0"
         aria-label="Read: ${essay.title}">
      <div class="sidebar-essay-year">${essay.year}</div>
      <div class="sidebar-essay-title">${essay.title}</div>
    </div>
  `).join('');

  sidebar.querySelectorAll('.sidebar-essay-item').forEach(item => {
    const activate = () => {
      const essay = essays.find(e => e.id === item.dataset.id);
      if (essay) renderEssay(essay);
    };
    item.addEventListener('click', activate);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const docEl = document.getElementById('essayDocument');

  if (docEl) {
    docEl.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:200px;gap:12px;">
        <div class="spinner"></div>
        <span style="color:var(--text-muted);font-size:0.85rem;font-family:Barlow,sans-serif">Loading…</span>
      </div>
    `;
  }

  try {
    essays = await fetchJSON('data/essays.json');
  } catch {
    if (docEl) {
      docEl.innerHTML = `<p style="color:var(--text-muted);padding:40px;text-align:center">
        Essays could not be loaded. Please try again.
      </p>`;
    }
    return;
  }

  if (!essays.length) return;

  const params    = new URLSearchParams(window.location.search);
  const requested = params.get('essay');
  const target    = essays.find(e => e.id === requested) || essays[0];

  renderSidebar(essays, target.id);
  renderEssay(target);
});
