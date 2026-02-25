function updateDots(block, index) {
  block.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function navigate(block, direction) {
  const slides = block.querySelectorAll('.carousel-slide');
  let current = [...slides].findIndex(s => s.classList.contains('active'));
  slides[current].classList.remove('active');
  current = (current + direction + slides.length) % slides.length;
  slides[current].classList.add('active');
  updateDots(block, current);
}

function startAutoplay(block) {
  return setInterval(() => navigate(block, 1), 5000);
}

export default function decorate(block) {
  // Each direct child div is a row (one per slide)
  const rows = [...block.querySelectorAll(':scope > div')];

  // Build slides from rows
  const slidesHTML = rows.map((row, i) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const textCell = cells[0];
    const imageCell = cells[1];

function updateDots(block, index) {
  block.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function navigate(block, direction) {
  const slides = block.querySelectorAll('.carousel-slide');
  let current = [...slides].findIndex(s => s.classList.contains('active'));
  slides[current].classList.remove('active');
  current = (current + direction + slides.length) % slides.length;
  slides[current].classList.add('active');
  updateDots(block, current);
}

function startAutoplay(block) {
  return setInterval(() => navigate(block, 1), 5000);
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const slidesHTML = rows.map((row, i) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const textCell = cells[0];
    const imageCell = cells[1];

    // Force eager loading on images
    const picture = imageCell?.querySelector('picture');
    if (picture) {
      picture.querySelectorAll('img').forEach(img => {
        img.setAttribute('loading', 'eager');
        img.removeAttribute('loading');
      });
    }

    const pictureHTML = picture ? picture.outerHTML : '';
    const textHTML = textCell ? textCell.innerHTML : '';

    return `
      <div class="carousel-slide ${i === 0 ? 'active' : ''}">
        <div class="carousel-slide-bg">${pictureHTML}</div>
        <div class="carousel-slide-content">${textHTML}</div>
      </div>
    `;
  }).join('');

  const dotsHTML = rows.map((_, i) => `
    <button class="carousel-dot ${i === 0 ? 'active' : ''}"></button>
  `).join('');

  block.innerHTML = `
    <div class="carousel-track">${slidesHTML}</div>
    <button class="carousel-btn carousel-btn-prev">&#8592;</button>
    <button class="carousel-btn carousel-btn-next">&#8594;</button>
    <div class="carousel-dots">${dotsHTML}</div>
  `;

  // Force all images to load immediately
  block.querySelectorAll('img').forEach(img => {
    img.removeAttribute('loading');
    img.setAttribute('loading', 'eager');
  });

  block.querySelector('.carousel-btn-prev').addEventListener('click', () => navigate(block, -1));
  block.querySelector('.carousel-btn-next').addEventListener('click', () => navigate(block, 1));

  block.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      block.querySelector('.carousel-slide.active').classList.remove('active');
      block.querySelectorAll('.carousel-slide')[i].classList.add('active');
      updateDots(block, i);
    });
  });

  let autoplay = startAutoplay(block);
  block.addEventListener('mouseenter', () => clearInterval(autoplay));
  block.addEventListener('mouseleave', () => { autoplay = startAutoplay(block); });

  let startX = 0;
  block.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  block.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(block, diff > 0 ? 1 : -1);
  });
}
    const pictureHTML = picture ? picture.outerHTML : '';
    const textHTML = textCell ? textCell.innerHTML : '';

    return `
      <div class="carousel-slide ${i === 0 ? 'active' : ''}">
        <div class="carousel-slide-bg">${pictureHTML}</div>
        <div class="carousel-slide-content">${textHTML}</div>
      </div>
    `;
  }).join('');

  // Build dots
  const dotsHTML = rows.map((_, i) => `
    <button class="carousel-dot ${i === 0 ? 'active' : ''}"></button>
  `).join('');

  // Replace block content
  block.innerHTML = `
    <div class="carousel-track">${slidesHTML}</div>
    <button class="carousel-btn carousel-btn-prev">&#8592;</button>
    <button class="carousel-btn carousel-btn-next">&#8594;</button>
    <div class="carousel-dots">${dotsHTML}</div>
  `;

  // Wire up buttons
  block.querySelector('.carousel-btn-prev').addEventListener('click', () => navigate(block, -1));
  block.querySelector('.carousel-btn-next').addEventListener('click', () => navigate(block, 1));

  // Wire up dots
  block.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      block.querySelector('.carousel-slide.active').classList.remove('active');
      block.querySelectorAll('.carousel-slide')[i].classList.add('active');
      updateDots(block, i);
    });
  });

  // Autoplay
  let autoplay = startAutoplay(block);
  block.addEventListener('mouseenter', () => clearInterval(autoplay));
  block.addEventListener('mouseleave', () => { autoplay = startAutoplay(block); });

  // Touch swipe
  let startX = 0;
  block.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  block.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(block, diff > 0 ? 1 : -1);
  });
}
