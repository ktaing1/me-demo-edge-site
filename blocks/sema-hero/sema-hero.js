export default function decorate(block) {
  // cells[0]=empty  cells[1]=text content  cells[2]=hero image
  // AEM wraps images in <picture> elements — handle both <picture> and <img>
  const cells = [...block.querySelectorAll(':scope > div > div')];
  block.textContent = '';

  // ── LEFT: text content ────────────────────────────────
  const content = document.createElement('div');
  content.className = 'sema-hero-content';
  if (cells[1]) {
    content.innerHTML = cells[1].innerHTML;
    [...content.querySelectorAll('a')].forEach((a) => {
      if (!a.classList.length) a.classList.add('button');
    });
  }

  // ── RIGHT: image as full-bleed background ─────────────
  // Move the picture/img from cells[2] into a wrapper
  // and let CSS position it absolutely behind the text
  const imgWrap = document.createElement('div');
  imgWrap.className = 'sema-hero-image';

  if (cells[2]) {
    // AEM delivers images as <picture><source/><img/></picture>
    const picture = cells[2].querySelector('picture');
    const img = cells[2].querySelector('img');

    if (picture) {
      // Clone the whole picture element — preserves responsive srcset
      const clonedPicture = picture.cloneNode(true);
      const clonedImg = clonedPicture.querySelector('img');
      if (clonedImg) {
        clonedImg.setAttribute('loading', 'eager');
        clonedImg.alt = clonedImg.alt || '';
      }
      imgWrap.appendChild(clonedPicture);
    } else if (img) {
      const clonedImg = img.cloneNode(true);
      clonedImg.setAttribute('loading', 'eager');
      imgWrap.appendChild(clonedImg);
    }

    // Actor portrayal caption
    const cap = [...cells[2].querySelectorAll('p')]
      .find((p) => !p.querySelector('img') && !p.querySelector('picture') && p.textContent.trim());
    if (cap) {
      const caption = document.createElement('p');
      caption.className = 'sema-hero-caption';
      caption.textContent = cap.textContent.trim();
      imgWrap.appendChild(caption);
    }
  }

  // Append image FIRST so it's behind content in stacking order
  block.appendChild(imgWrap);
  block.appendChild(content);
}
