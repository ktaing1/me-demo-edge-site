function updateDots(block, index) {
  block.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function navigate(block, direction) {
  const slides = block.querySelectorAll('.carousel-slide');
  const activeSlide = block.querySelector('.carousel-slide.active');
  let index = [...slides].indexOf(activeSlide);
  index = (index + direction + slides.length) % slides.length;
  activeSlide.classList.remove('active');
  slides[index].classList.add('active');
  updateDots(block, index);
}

function startAutoplay(block) {
  return setInterval(() => navigate(block, 1), 5000);
}

export default function decorate(block) {
  // Get all rows except the first header row
  const rows = [...block.querySelectorAll(':scope > div')];
  block.innerHTML = '';

  const track = document.createElement('div');
  track.classList.add('carousel-track');

  rows.forEach((row, i) => {
    const slide = document.createElement('div');
    slide.classList.add('carousel-slide');
    if (i === 0) slide.classList.add('active');

    // Get cells
    const cells = [...row.querySelectorAll(':scope > div')];
    const textCell = cells[0];
    const imageCell = cells[1];

    // Background image
    const picture = imageCell && imageCell.querySelector('picture, img');
    if (picture) {
      const bg = document.createElement('div');
      bg.classList.add('carousel-slide-bg');
      bg.append(picture);
      slide.append(bg);
    }

    // Text content
    if (textCell) {
      const content = document.createElement('div');
      content.classList.add('carousel-slide-content');
      content.innerHTML = textCell.innerHTML;
      slide.append(content);
    }

    track.append(slide);
  });

  block.append(track);

  // Only add controls if more than 1 slide
  const slides = block.querySelectorAll('.carousel-slide');
  if (slides.length > 1) {
    // Prev button
    const prev = document.createElement('button');
    prev.classList.add('carousel-btn', 'carousel-btn-prev');
    prev.innerHTML = '&#8592;';
    prev.addEventListener('click', () => navigate(block, -1));
    block.append(prev);

    // Next button
    const next = document.createElement('button');
    next.classList.add('carousel-btn', 'carousel-btn-next');
    next.innerHTML = '&#8594;';
    next.addEventListener('click', () => navigate(block, 1));
    block.append(next);

    // Dots
    const dots = document.createElement('div');
    dots.classList.add('carousel-dots');
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        block.querySelector('.carousel-slide.active').classList.remove('active');
        slides[i].classList.add('active');
        updateDots(block, i);
      });
      dots.append(dot);
    });
    block.append(dots);

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
}
