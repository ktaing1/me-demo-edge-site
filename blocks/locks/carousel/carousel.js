function updateDots(block, index) {
  block.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function navigate(block, direction) {
  const slides = block.querySelectorAll('.carousel-slide');
  let current = [...slides].findIndex(s => s.classList.contains('active'));
  slides[current].classList.remove('active');
  slides[current].style.opacity = '0';
  slides[current].style.zIndex = '0';
  current = (current + direction + slides.length) % slides.length;
  slides[current].classList.add('active');
  slides[current].style.opacity = '1';
  slides[current].style.zIndex = '1';
  updateDots(block, current);
}

function applyStyles(el, styles) {
  Object.assign(el.style, styles);
}

function startAutoplay(block) {
  return setInterval(() => navigate(block, 1), 5000);
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Style the block itself
  applyStyles(block, {
    position: 'relative',
    width: '100vw',
    left: '50%',
    transform: 'translateX(-50%)',
    height: '100vh',
    overflow: 'hidden',
    background: '#080808',
    margin: '0',
    padding: '0',
  });

  // Build slides
  const track = document.createElement('div');
  applyStyles(track, {
    position: 'relative',
    width: '100%',
    height: '100%',
  });

  const slides = rows.map((row, i) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const textCell = cells[0];
    const imageCell = cells[1];

    // Create slide
    const slide = document.createElement('div');
    slide.classList.add('carousel-slide');
    if (i === 0) slide.classList.add('active');
    applyStyles(slide, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      opacity: i === 0 ? '1' : '0',
      zIndex: i === 0 ? '1' : '0',
      transition: 'opacity 1s ease',
      display: 'flex',
      alignItems: 'center',
    });

    // Background image
    const bg = document.createElement('div');
    applyStyles(bg, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '0',
      overflow: 'hidden',
    });

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      applyStyles(picture, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        display: 'block',
      });
      const img = picture.querySelector('img');
      if (img) {
        applyStyles(img, {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        });
        img.removeAttribute('loading');
      }
      bg.append(picture);
    }

    // Overlay
    const overlay = document.createElement('div');
    applyStyles(overlay, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(to right, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.5) 60%, rgba(8,8,8,0.15) 100%)',
      zIndex: '1',
    });
    bg.append(overlay);
    slide.append(bg);

    // Text content
    if (textCell) {
      const content = document.createElement('div');
      applyStyles(content, {
        position: 'relative',
        zIndex: '2',
        padding: '0 8vw',
        maxWidth: '650px',
      });
      content.innerHTML = textCell.innerHTML;

      // Style headings
      content.querySelectorAll('h1, h2, h3').forEach(h => {
        applyStyles(h, {
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(2rem, 5vw, 5rem)',
          lineHeight: '1',
          color: '#ffffff',
          margin: '0 0 1rem 0',
        });
        h.querySelectorAll('em').forEach(em => {
          applyStyles(em, { fontStyle: 'normal', color: '#ff5000' });
        });
      });

      // Style paragraphs
      content.querySelectorAll('p').forEach(p => {
        applyStyles(p, {
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '1.1rem',
          color: 'rgba(255,255,255,0.75)',
          lineHeight: '1.6',
          margin: '0 0 1.5rem 0',
        });
      });

      // Style links as buttons
      content.querySelectorAll('a').forEach(a => {
        applyStyles(a, {
          display: 'inline-block',
          background: '#ff5000',
          color: '#fff',
          textDecoration: 'none',
          padding: '0.8rem 2rem',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.82rem',
          fontWeight: '500',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        });
      });

      slide.append(content);
    }

    track.append(slide);
    return slide;
  });

  block.innerHTML = '';
  block.append(track);

  // Prev button
  const prev = document.createElement('button');
  prev.innerHTML = '&#8592;';
  applyStyles(prev, {
    position: 'absolute',
    top: '50%',
    left: '2vw',
    transform: 'translateY(-50%)',
    zIndex: '10',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    fontSize: '1.5rem',
    width: '48px',
    height: '48px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });
  prev.addEventListener('click', () => navigate(block, -1));
  block.append(prev);

  // Next button
  const next = document.createElement('button');
  next.innerHTML = '&#8594;';
  applyStyles(next, { ...prev.style, left: 'auto', right: '2vw' });
  applyStyles(next, {
    position: 'absolute',
    top: '50%',
    right: '2vw',
    left: 'auto',
    transform: 'translateY(-50%)',
    zIndex: '10',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    fontSize: '1.5rem',
    width: '48px',
    height: '48px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });
  next.addEventListener('click', () => navigate(block, 1));
  block.append(next);

  // Dots
  const dotsContainer = document.createElement('div');
  applyStyles(dotsContainer, {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '10',
    display: 'flex',
    gap: '0.6rem',
  });

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    applyStyles(dot, {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      border: 'none',
      background: i === 0 ? '#ff5000' : 'rgba(255,255,255,0.3)',
      cursor: 'pointer',
      padding: '0',
      transition: 'all 0.25s ease',
    });
    dot.addEventListener('click', () => {
      const allSlides = block.querySelectorAll('.carousel-slide');
      allSlides.forEach(s => {
        s.classList.remove('active');
        s.style.opacity = '0';
        s.style.zIndex = '0';
      });
      allSlides[i].classList.add('active');
      allSlides[i].style.opacity = '1';
      allSlides[i].style.zIndex = '1';
      updateDots(block, i);
    });
    dotsContainer.append(dot);
  });
  block.append(dotsContainer);

  // Autoplay
  let autoplay = startAutoplay(block);
  block.addEventListener('mouseenter', () => clearInterval(autoplay));
  block.addEventListener('mouseleave', () => { autoplay = startAutoplay(block); });

  // Touch
  let startX = 0;
  block.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  block.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(block, diff > 0 ? 1 : -1);
  });
}
