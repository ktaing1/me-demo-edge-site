export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;
  const cells = [...rows[0].querySelectorAll(':scope > div')];

  block.textContent = '';

  const hero = document.createElement('div');
  hero.className = 'sema-hero';

  // Left: text content
  const left = document.createElement('div');
  left.className = 'sema-hero-content';
  if (cells[0]) left.innerHTML = cells[0].innerHTML;

  // Right: image
  const right = document.createElement('div');
  right.className = 'sema-hero-image';
  if (cells[1]) {
    const img = cells[1].querySelector('img');
    if (img) {
      img.setAttribute('loading', 'eager');
      right.appendChild(img.cloneNode(true));
    }
    // Actor portrayal caption
    const caption = cells[1].querySelector('p:last-child');
    if (caption && caption.textContent.toLowerCase().includes('actor')) {
      const cap = document.createElement('p');
      cap.className = 'sema-hero-caption';
      cap.textContent = caption.textContent.trim();
      right.appendChild(cap);
    }
  }

  hero.appendChild(left);
  hero.appendChild(right);
  block.appendChild(hero);
}
