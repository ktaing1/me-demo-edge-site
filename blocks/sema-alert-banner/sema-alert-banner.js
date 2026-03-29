export default function decorate(block) {
  // AEM EDS cell layout (row 2):
  // cells[0] = empty | cells[1] = icon + headline | cells[2] = body text
  const cells = [...block.querySelectorAll(':scope > div > div')];

  block.textContent = '';

  const banner = document.createElement('div');
  banner.className = 'sema-alert-banner';

  // ── LEFT: icon + headline ─────────────────────────────
  const left = document.createElement('div');
  left.className = 'sema-alert-banner-left';

  const iconCell = cells[1];
  if (iconCell) {
    const icon = iconCell.querySelector('img');
    if (icon) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'sema-alert-banner-icon';
      iconWrap.appendChild(icon.cloneNode(true));
      left.appendChild(iconWrap);
    }
    // Headline — grab paragraph text, skip empty ones
    const headlineText = [...iconCell.querySelectorAll('p')]
      .map((p) => p.innerText?.trim())
      .filter(Boolean)
      .join('\n') || iconCell.innerText?.trim();

    if (headlineText) {
      const headline = document.createElement('p');
      headline.className = 'sema-alert-banner-headline';
      headline.textContent = headlineText;
      left.appendChild(headline);
    }
  }

  // ── RIGHT: body text ──────────────────────────────────
  const right = document.createElement('div');
  right.className = 'sema-alert-banner-body';

  const bodyCell = cells[2];
  if (bodyCell) {
    right.innerHTML = bodyCell.innerHTML;
    [...right.querySelectorAll('a')].forEach((a) => {
      if (a.getAttribute('href') && a.getAttribute('href') !== '#') {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  banner.appendChild(left);
  banner.appendChild(right);
  block.appendChild(banner);
}
