// sema-promo: alternating image + text promo block
// Variants: default (image-left), "reverse" (image-right)
// Word doc col order: | Image | Text | CTA Link |
// Add "reverse" to block name in doc for image-right layout

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;
  const cells = [...rows[0].querySelectorAll(':scope > div')];

  const isReverse = block.classList.contains('reverse');
  block.textContent = '';

  const promo = document.createElement('div');
  promo.className = `sema-promo${isReverse ? ' sema-promo-reverse' : ''}`;

  // Image side
  const imgSide = document.createElement('div');
  imgSide.className = 'sema-promo-image';
  if (cells[0]) {
    const img = cells[0].querySelector('img');
    if (img) {
      img.setAttribute('loading', 'lazy');
      imgSide.appendChild(img.cloneNode(true));
    }
    const caption = cells[0].querySelector('p:last-child');
    if (caption && caption.textContent.toLowerCase().includes('actor')) {
      const cap = document.createElement('p');
      cap.className = 'sema-promo-caption';
      cap.textContent = caption.textContent.trim();
      imgSide.appendChild(cap);
    }
  }

  // Text side
  const textSide = document.createElement('div');
  textSide.className = 'sema-promo-content';
  if (cells[1]) textSide.innerHTML = cells[1].innerHTML;

  // Optional CTA URL override in col 3
  if (cells[2]) {
    const ctaHref = cells[2].querySelector('a')?.href || cells[2].textContent.trim();
    const ctaBtn = textSide.querySelector('a');
    if (ctaBtn && ctaHref) ctaBtn.href = ctaHref;
  }

  if (isReverse) {
    promo.appendChild(textSide);
    promo.appendChild(imgSide);
  } else {
    promo.appendChild(imgSide);
    promo.appendChild(textSide);
  }

  block.appendChild(promo);
}
