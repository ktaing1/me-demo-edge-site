// sema-accordion: sticky ISI (Important Safety Information) footer
// Pharma standard: always visible at bottom, expand/collapse for full ISI
// Word doc: one row per accordion item | Heading | Body Content |

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  block.textContent = '';

  const isi = document.createElement('div');
  isi.className = 'sema-accordion';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (!cells.length) return;

    const item = document.createElement('div');
    item.className = 'sema-accordion-item';

    // Header / trigger
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'sema-accordion-trigger';
    trigger.setAttribute('aria-expanded', 'false');

    const headingText = document.createElement('span');
    headingText.className = 'sema-accordion-heading';
    headingText.innerHTML = cells[0]?.innerHTML || '';

    const icon = document.createElement('span');
    icon.className = 'sema-accordion-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`;

    trigger.appendChild(headingText);
    trigger.appendChild(icon);

    // Panel
    const panel = document.createElement('div');
    panel.className = 'sema-accordion-panel';
    panel.setAttribute('hidden', '');
    panel.innerHTML = cells[1]?.innerHTML || '';

    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        panel.setAttribute('hidden', '');
      } else {
        panel.removeAttribute('hidden');
      }
      icon.style.transform = expanded ? '' : 'rotate(180deg)';
    });

    item.appendChild(trigger);
    item.appendChild(panel);
    isi.appendChild(item);
  });

  block.appendChild(isi);
}
