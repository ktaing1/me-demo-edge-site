export default function decorate(block) {
    // AEM EDS table: row 1 = block name, row 2 = content
  // Row 2 cells: [empty] [logo] [descriptor] [nav links]
  const cells = [...block.querySelectorAll(':scope > div > div')];

  block.textContent = '';

  const inner = document.createElement('div');
    inner.className = 'sema-header-inner';

  // ── LEFT: logo + divider + descriptor ──────────────────
  const logoArea = document.createElement('div');
    logoArea.className = 'sema-header-logo-area';

  const logoWrap = document.createElement('div');
    logoWrap.className = 'sema-header-logo';
    // cells[0] is empty (block name col), logo is in cells[1]
  const img = cells[1]?.querySelector('img');
    if (img) {
          img.setAttribute('loading', 'eager');
          img.alt = img.alt || 'Novo Nordisk';
          logoWrap.appendChild(img.cloneNode(true));
    }

  const divEl = document.createElement('div');
    divEl.className = 'sema-header-divider';

  // Descriptor text in cells[2]
  const descEl = document.createElement('div');
    descEl.className = 'sema-header-descriptor';
    if (cells[2]) {
          const lines = cells[2].innerText.split('\n').map((l) => l.trim()).filter(Boolean);
          lines.forEach((line) => {
                  const p = document.createElement('p');
                  p.textContent = line;
                  descEl.appendChild(p);
          });
    }

  logoArea.appendChild(logoWrap);
    logoArea.appendChild(divEl);
    logoArea.appendChild(descEl);

  // ── RIGHT: nav links in cells[3] ───────────────────────
  const nav = document.createElement('nav');
    nav.className = 'sema-header-nav';
    nav.setAttribute('aria-label', 'Primary navigation');

  if (cells[3]) {
        // AEM EDS passes external links as <a> tags — grab them all
      const anchors = [...cells[3].querySelectorAll('a')];
        if (anchors.length) {
                anchors.forEach((a) => {
                          const link = document.createElement('a');
                          // Use the raw href attribute — AEM may rewrite absolute URLs
                                        // so grab the original href before any processing
                                        link.href = a.getAttribute('href') || a.href;
                          link.textContent = a.textContent.trim();
                          // Open external links in new tab
                                        if (link.href.startsWith('http') && !link.href.includes(window.location.hostname)) {
                                                    link.target = '_blank';
                                                    link.rel = 'noopener noreferrer';
                                        }
                          nav.appendChild(link);
                });
        } else {
                // Fallback: plain pipe-separated text
          cells[3].innerText.split('|').map((s) => s.trim()).filter(Boolean).forEach((label) => {
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
