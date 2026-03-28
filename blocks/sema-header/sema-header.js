export default function decorate(block) {
  // Grab all cells from the first row
  // Expected doc structure (4 columns):
  // | sema-header | [logo img] | descriptor text | Patient Safety | Our Medicines |
  const cells = [...block.querySelectorAll(':scope > div > div')];

  block.textContent = '';

  const inner = document.createElement('div');
  inner.className = 'sema-header-inner';

  // ── LEFT: logo + divider + descriptor ──────────────────
  const logoArea = document.createElement('div');
  logoArea.className = 'sema-header-logo-area';

  // Col 0 = logo image
  const logoWrap = document.createElement('div');
  logoWrap.className = 'sema-header-logo';
  const img = cells[0]?.querySelector('img');
  if (img) {
    img.setAttribute('loading', 'eager');
    img.alt = img.alt || 'Novo Nordisk';
    logoWrap.appendChild(img.cloneNode(true));
  }

  // Vertical divider
  const divEl = document.createElement('div');
  divEl.className = 'sema-header-divider';

  // Col 1 = descriptor text (line per paragraph)
  const descEl = document.createElement('div');
  descEl.className = 'sema-header-descriptor';
  if (cells[1]) {
    const lines = cells[1].innerText.split('\n').map((l) => l.trim()).filter(Boolean);
    lines.forEach((line) => {
      const p = document.createElement('p');
      p.textContent = line;
      descEl.appendChild(p);
    });
  }

  logoArea.appendChild(logoWrap);
  logoArea.appendChild(divEl);
  logoArea.appendChild(descEl);

  // ── RIGHT: nav links ────────────────────────────────────
  // Col 2 = nav — pipe-separated text or anchor tags
  const nav = document.createElement('nav');
  nav.className = 'sema-header-nav';
  nav.setAttribute('aria-label', 'Primary navigation');

  if (cells[2]) {
    const anchors = [...cells[2].querySelectorAll('a')];
    if (anchors.length) {
      anchors.forEach((a) => {
        const link = document.createElement('a');
        link.href = a.href || '#';
        link.textContent = a.textContent.trim();
        nav.appendChild(link);
      });
    } else {
      // plain text e.g. "Patient Safety | Our Medicines"
      cells[2].innerText.split('|').map((s) => s.trim()).filter(Boolean).forEach((label) => {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = label;
        nav.appendChild(link);
      });
    }
  }

  inner.appendChild(logoArea);
  inner.appendChild(nav);
  block.appendChild(inner);
}
