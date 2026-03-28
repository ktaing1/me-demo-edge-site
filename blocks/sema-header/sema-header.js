/**
 * sema-header block
 *
 * Word doc table structure (1 row, 3 columns):
 * | sema-header | Col 2 — Logo Image | Col 3 — Descriptor Text | Col 4 — Primary Nav Links |
 *
 * Renders:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  [Logo] │ Official communication about our medicines...  Patient Safety  Our Medicines │
 * └─────────────────────────────────────────────────────────────┘
 * [teal-to-blue gradient bottom border]
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  // AEM EDS puts all authored cells in the first row
  const cells = [...rows[0].querySelectorAll(':scope > div')];

  block.textContent = '';

  const headerEl = document.createElement('div');
  headerEl.className = 'sema-header-inner';

  // ── Left: logo + descriptor ─────────────────────────────
  const logoArea = document.createElement('div');
  logoArea.className = 'sema-header-logo-area';

  const logoWrap = document.createElement('div');
  logoWrap.className = 'sema-header-logo';

  // Col 1 = logo image
  if (cells[0]) {
    const img = cells[0].querySelector('img');
    if (img) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('alt', img.alt || 'Novo Nordisk');
      logoWrap.appendChild(img.cloneNode(true));
    }
  }

  // Vertical divider
  const divider = document.createElement('div');
  divider.className = 'sema-header-divider';

  // Col 2 = descriptor text
  const descriptor = document.createElement('div');
  descriptor.className = 'sema-header-descriptor';
  if (cells[1]) {
    // Convert pipe-separated text or <p> tags into lines
    const text = cells[1].innerText || cells[1].textContent || '';
    text.split('\n').filter(Boolean).forEach((line) => {
      const p = document.createElement('p');
      p.textContent = line.trim();
      descriptor.appendChild(p);
    });
    if (!descriptor.children.length) {
      descriptor.innerHTML = cells[1].innerHTML;
    }
  }

  logoArea.appendChild(logoWrap);
  logoArea.appendChild(divider);
  logoArea.appendChild(descriptor);

  // ── Right: primary nav ─────────────────────────────────
  const nav = document.createElement('nav');
  nav.className = 'sema-header-nav';
  nav.setAttribute('aria-label', 'Primary navigation');

  // Col 3 = nav links (pipe-separated or anchor tags)
  if (cells[2]) {
    const anchors = [...cells[2].querySelectorAll('a')];
    if (anchors.length) {
      anchors.forEach((a) => {
        const link = document.createElement('a');
        link.href = a.href;
        link.textContent = a.textContent.trim();
        nav.appendChild(link);
      });
    } else {
      // Plain text pipe-separated: "Patient Safety | Our Medicines"
      const text = cells[2].textContent.trim();
      text.split('|').map((s) => s.trim()).filter(Boolean).forEach((label) => {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = label;
        nav.appendChild(link);
      });
    }
  }

  headerEl.appendChild(logoArea);
  headerEl.appendChild(nav);
  block.appendChild(headerEl);
}
