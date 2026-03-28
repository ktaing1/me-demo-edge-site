// sema-card-grid: 3-column grid of bordered cards with date, body, download CTA
// Word doc: one row per card | Date | Body Text | PDF URL |
// First row = section heading (single cell spanning full width)

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  block.textContent = '';

  const section = document.createElement('div');
  section.className = 'sema-card-grid-section';

  // Check if first row is a heading (single cell)
  const firstCells = [...rows[0].querySelectorAll(':scope > div')];
  let startRow = 0;
  if (firstCells.length === 1) {
    const heading = document.createElement('h2');
    heading.className = 'sema-card-grid-heading';
    heading.innerHTML = firstCells[0].innerHTML;
    section.appendChild(heading);
    startRow = 1;
  }

  const grid = document.createElement('div');
  grid.className = 'sema-card-grid';

  for (let i = startRow; i < rows.length; i++) {
    const cells = [...rows[i].querySelectorAll(':scope > div')];
    if (!cells.length) continue;

    const card = document.createElement('div');
    card.className = 'sema-card-grid-card';

    // Date
    const date = document.createElement('p');
    date.className = 'sema-card-grid-date';
    date.textContent = cells[0]?.textContent?.trim() || '';
    card.appendChild(date);

    // Body
    const body = document.createElement('div');
    body.className = 'sema-card-grid-body';
    body.innerHTML = cells[1]?.innerHTML || '';
    card.appendChild(body);

    // Download CTA
    const pdfHref = cells[2]?.querySelector('a')?.href || cells[2]?.textContent?.trim() || '#';
    const cta = document.createElement('a');
    cta.className = 'sema-card-grid-cta';
    cta.href = pdfHref;
    cta.setAttribute('target', '_blank');
    cta.setAttribute('rel', 'noopener');
    cta.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg> Download company statement`;
    card.appendChild(cta);

    grid.appendChild(card);
  }

  section.appendChild(grid);
  block.appendChild(section);
}
