/**
 * sema-header block — v3
 *
 * Flexible Word doc structure. Supports both:
 *
 * SIMPLE (1 row, 1 col) — everything auto-detected from content:
 * | sema-header |
 * | [logo img]  Official communication text  Patient Safety | Our Medicines |
 *
 * FULL (1 row, 3 cols) — explicit columns:
 * | sema-header | [logo img] | descriptor text | nav links |
 *
 * The JS inspects each cell for images, pipe-separated nav links,
 * and text lines to figure out what goes where.
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const cells = [...rows[0].querySelectorAll(':scope > div')];

  // ── Parse content out of however many cells exist ────────
  let logoImg = null;
  let descriptorLines = [];
  let navLinks = [];

  if (cells.length >= 3) {
    // Full 3-col structure: [logo] | [descriptor] | [nav]
    logoImg = cells[0].querySelector('img');
    descriptorLines = cells[1].innerText.split('\n').map(l => l.trim()).filter(Boolean);
    const navCell = cells[2];
    const anchors = [...navCell.querySelectorAll('a')];
    if (anchors.length) {
      navLinks = anchors.map(a => ({ label: a.textContent.trim(), href: a.href }));
    } else {
      navLinks = navCell.innerText.split('|').map(l => l.trim()).filter(Boolean)
        .map(label => ({ label, href: '#' }));
    }
  } else if (cells.length === 2) {
    // 2-col: [logo] | [descriptor + nav pipe-separated]
    logoImg = cells[0].querySelector('img');
    const text = cells[1].innerText;
    const parts = text.split('|').map(l => l.trim()).filter(Boolean);
    // Heuristic: short parts (≤3 words) are nav links, longer are descriptor
    parts.forEach(part => {
      if (part.split(' ').length <= 3) {
        navLinks.push({ label: part, href: '#' });
      } else {
        descriptorLines.push(part);
      }
    });
    if (!navLinks.length) {
      const anchors = [...cells[1].querySelectorAll('a')];
      navLinks = anchors.map(a => ({ label: a.textContent.trim(), href: a.href }));
    }
  } else {
    // Single cell — scan for image, then split remaining text
    // into descriptor lines vs nav items
    const cell = cells[0] || rows[0];
    logoImg = cell.querySelector('img');

    // Get all text nodes, split on newlines
    const allText = cell.innerText || '';
    const lines = allText.split('\n').map(l => l.trim()).filter(Boolean);

    // Known nav keywords for the sema site
    const navKeywords = ['patient safety', 'our medicines', 'resources', 'faqs'];
    lines.forEach(line => {
      if (navKeywords.some(k => line.toLowerCase().includes(k)) || line.includes('|')) {
        // This line is nav — split on pipes
        line.split('|').map(l => l.trim()).filter(Boolean)
          .forEach(label => navLinks.push({ label, href: '#' }));
      } else {
        descriptorLines.push(line);
      }
    });

    // Also check for anchor tags
    const anchors = [...cell.querySelectorAll('a')];
    if (anchors.length && !navLinks.length) {
      navLinks = anchors.map(a => ({ label: a.textContent.trim(), href: a.href }));
    }
  }

  // ── Build the header ──────────────────────────────────────
  block.textContent = '';

  const inner = document.createElement('div');
  inner.className = 'sema-header-inner';

  // Left: logo + divider + descriptor
  const logoArea = document.createElement('div');
  logoArea.className = 'sema-header-logo-area';

  const logoWrap = document.createElement('div');
  logoWrap.className = 'sema-header-logo';
  if (logoImg) {
    const img = logoImg.cloneNode(true);
    img.setAttribute('loading', 'eager');
    img.alt = img.alt || 'Novo Nordisk';
    logoWrap.appendChild(img);
  }

  const dividerEl = document.createElement('div');
  dividerEl.className = 'sema-header-divider';

  const descEl = document.createElement('div');
  descEl.className = 'sema-header-descriptor';
  descriptorLines.forEach(line => {
    const p = document.createElement('p');
    p.textContent = line;
    descEl.appendChild(p);
  });

  logoArea.appendChild(logoWrap);
  // Only show divider if we have both logo and descriptor
  if (logoImg && descriptorLines.length) logoArea.appendChild(dividerEl);
  logoArea.appendChild(descEl);

  // Right: nav links
  const nav = document.createElement('nav');
  nav.className = 'sema-header-nav';
  nav.setAttribute('aria-label', 'Primary navigation');
  navLinks.forEach(({ label, href }) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    nav.appendChild(a);
  });

  inner.appendChild(logoArea);
  inner.appendChild(nav);
  block.appendChild(inner);
}
