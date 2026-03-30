export default function decorate(block) {
  // cells[0]=empty  cells[1]=text content  cells[2]=hero image
  // NOTE: block itself already has class "sema-hero" — build directly into it,
  // do NOT create a nested .sema-hero div (would cause double grid nesting)
  const cells = [...block.querySelectorAll(':scope > div > div')];
  block.textContent = '';

  // LEFT: text content
  const content = document.createElement('div');
  content.className = 'sema-hero-content';
  if (cells[1]) {
    content.innerHTML = cells[1].innerHTML;
    [...content.querySelectorAll('a')].forEach((a) => {
      if (!a.classList.length) a.classList.add('button');
    });
  }

  // RIGHT: image
  const imgWrap = document.createElement('div');
  imgWrap.className = 'sema-hero-image';
  if (cells[2]) {
    const img = cells[2].querySelector('img');
    if (img) {
      img.setAttribute('loading', 'eager');
      imgWrap.appendChild(img.cloneNode(true));
    }
    const cap = [...cells[2].querySelectorAll('p')]
      .find((p) => p.textContent.toLowerCase().includes('actor'));
    if (cap) {
      const caption = document.createElement('p');
      caption.className = 'sema-hero-caption';
      caption.textContent = cap.textContent.trim();
      imgWrap.appendChild(caption);
    }
  }

  // Append directly to block — block already has class sema-hero
  block.appendChild(content);
  block.appendChild(imgWrap);
}
