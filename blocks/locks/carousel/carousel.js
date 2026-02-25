function createSlide(row) {
  const slide = document.createElement('div');
  slide.classList.add('carousel-slide');

  const picture = row.querySelector('picture, img');
  const textEls = [...row.querySelectorAll('p, h1, h2, h3')].filter(el => !el.querySelector('picture, img'));

  if (picture) {
    const bg = document.createElement('div');
    bg.classList.add('carousel-slide-bg');
    bg.append(picture);
    slide.append(bg);
  }

  if (textEls.length) {
    const content = document.createElement('div');
    content.classList.add('carousel-slide-content');
    textEls.forEach(el => content.append(el));
    slide.append(content);
  }

  return slide;
}

function navigate(block, direction) {
  const slides = block.querySelectorAll('.carousel-slide');
  const current = block.querySelector('.carousel-slide.active');
  let index = [...slides].indexOf(current);
  index = (index + direction + slides.length) % slides.length;
  current.classList.remove('active');
  slides[index].classList.add('active');
  updateDots(block, index);
}

function updateDots(block, index) {
  block.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function startAutoplay(block) {
  return setInterval(() => navigate(block, 1), 5000);
}

export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  const track = document.createElement('div');
  track.classList.add('carousel-track');

  rows.forEach((row, i) => {
    const slide = createSlide(row);
    if (i === 0) slide.classList.add('active');
    track.append(slide);
  });

  block.append(track);

  // Prev/Next buttons
  const prev = document.createElement('button');
  prev.classList.add('carousel-btn', 'carousel-btn-prev');
  prev.innerHTML = '&#8592;';
  prev.addEventListener('click', () => navigate(block, -1));

  const next = document.createElement('button');
  next.classList.add('carousel-btn', 'carousel-btn-next');
  next.innerHTML = '&#8594;';
  next.addEventListener('click', () => navigate(block, 1));

  block.append(prev, next);

  // Dots
  const dots = document.createElement('div');
  dots.classList.add('carousel-dots');
  rows.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      block.querySelector('.carousel-slide.active').classList.remove('active');
      block.querySelectorAll('.carousel-slide')[i].classList.add('active');
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
  block.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
  block.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(block, diff > 0 ? 1 : -1);
  });
}
