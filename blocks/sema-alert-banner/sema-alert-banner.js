export default function decorate(block) {
  // AEM EDS cell layout:
  // Row 1: [sema-alert-banner] (block name — ignored)
  // Row 2: [empty] [icon img + headline] [body text]
  //         cells[0]    cells[1]              cells[2]
  const cells = [...block.querySelectorAll(':scope > div > div')];

  block.textContent = '';

  const banner = document.createElement('div');
  banner.className = 'sema-alert-banner';

  // ── LEFT: icon + headline ─────────────────────────────
  const left = document.createElement('div');
  left.className = 'sema-alert-banner-left';

  const iconCell = cells[1];
  if (iconCell) {
    // Icon image
    const icon = iconCell.querySelector('img');
    if (icon) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'sema-alert-banner-icon';
      iconWrap.appendChild(icon.cloneNode(true));
      left.appendChild(iconWrap);
    }

    // Headline text — grab paragraph text nodes, skip image alt
    const paragraphs = [...iconCell.querySelectorAll('p')];
    const headlineText = paragraphs
      .map((p) => p.innerText?.trim() || p.textContent?.trim())
      .filter(Boolean)
      .join('\n');

    if (headlineText) {
      const headline = document.createElement('p');
      headline.className = 'sema-alert-banner-headline';
      headline.textContent = headlineText;
      left.appendChild(headline);
    } else if (!icon) {
      // No image and no paragraphs — use raw text
      const headline = document.createElement('p');
      headline.className = 'sema-alert-banner-headline';
      headline.textContent = iconCell.innerText?.trim() || iconCell.textContent?.trim();
      if (headline.textContent) left.appendChild(headline);
    }
  }

  // ── RIGHT: body text ──────────────────────────────────
  const right = document.createElement('div');
  right.className = 'sema-alert-banner-body';

  const bodyCell = cells[2];
  if (bodyCell) {
    right.innerHTML = bodyCell.innerHTML;
    // External links open in new tab
    [...right.querySelectorAll('a')].forEach((a) => {
      const href = a.getAttribute('href');
      if (href && href !== '#') {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  banner.appendChild(left);
  banner.appendChild(right);
  block.appendChild(banner);
}
