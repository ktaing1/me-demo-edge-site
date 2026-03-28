export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;
  const cells = [...rows[0].querySelectorAll(':scope > div')];

  block.textContent = '';

  const banner = document.createElement('div');
  banner.className = 'sema-alert-banner';

  // Left: icon + headline
  const left = document.createElement('div');
  left.className = 'sema-alert-banner-left';
  if (cells[0]) {
    const icon = cells[0].querySelector('img');
    if (icon) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'sema-alert-banner-icon';
      iconWrap.appendChild(icon.cloneNode(true));
      left.appendChild(iconWrap);
    }
    const headline = document.createElement('p');
    headline.className = 'sema-alert-banner-headline';
    headline.textContent = cells[0].textContent.trim();
    left.appendChild(headline);
  }

  // Right: body text
  const right = document.createElement('div');
  right.className = 'sema-alert-banner-body';
  if (cells[1]) right.innerHTML = cells[1].innerHTML;

  banner.appendChild(left);
  banner.appendChild(right);
  block.appendChild(banner);
}
