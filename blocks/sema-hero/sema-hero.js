export default function decorate(block) {
  // cells[0]=empty  cells[1]=text content  cells[2]=hero image
  // Layout: image is full-bleed background, text overlays the left side
  const cells = [...block.querySelectorAll(':scope > div > div')];
  block.textContent = '';

  // Set background image from cells[2]
  if (cells[2]) {
    const img = cells[2].querySelector('img');
    if (img) {
      const src = img.src || img.getAttribute('src');
      if (src) block.style.backgroundImage = `url('${src}')`;
    }
  }

  // Text content overlaid on left
  const content = document.createElement('div');
  content.className = 'sema-hero-content';
  if (cells[1]) {
    content.innerHTML = cells[1].innerHTML;
    [...content.querySelectorAll('a')].forEach((a) => {
      if (!a.classList.length) a.classList.add('button');
    });
  }

  // Actor portrayal caption (bottom right)
  if (cells[2]) {
    const cap = [...cells[2].querySelectorAll('p')]
      .find((p) => p.textContent.toLowerCase().includes('actor'));
    if (cap) {
      const caption = document.createElement('p');
      caption.className = 'sema-hero-caption';
      caption.textContent = cap.textContent.trim();
      block.appendChild(caption);
    }
  }

  block.appendChild(content);
}
