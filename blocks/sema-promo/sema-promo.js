export default function decorate(block) {
  // cells[0]=empty  cells[1]=image  cells[2]=text+CTA
  const isReverse = block.classList.contains('reverse');
  const cells = [...block.querySelectorAll(':scope > div > div')];
  block.textContent = '';
  const promo = document.createElement('div');
  promo.className = 'sema-promo' + (isReverse ? ' sema-promo-reverse' : '');
  const imgSide = document.createElement('div');
  imgSide.className = 'sema-promo-image';
  if (cells[1]) {
    const img = cells[1].querySelector('img');
    if (img) { img.setAttribute('loading', 'lazy'); imgSide.appendChild(img.cloneNode(true)); }
    const cap = [...cells[1].querySelectorAll('p')].find((p) => p.textContent.toLowerCase().includes('actor'));
    if (cap) { const c = document.createElement('p'); c.className = 'sema-promo-caption'; c.textContent = cap.textContent.trim(); imgSide.appendChild(c); }
  }
  const textSide = document.createElement('div');
  textSide.className = 'sema-promo-content';
  if (cells[2]) {
    textSide.innerHTML = cells[2].innerHTML;
    [...textSide.querySelectorAll('a')].forEach((a) => { if (!a.classList.length) a.classList.add('button'); });
  }
  if (isReverse) { promo.appendChild(textSide); promo.appendChild(imgSide); }
  else { promo.appendChild(imgSide); promo.appendChild(textSide); }
  block.appendChild(promo);
}
