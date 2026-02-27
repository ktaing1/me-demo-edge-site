export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  block.style.cssText = `
    position: relative;
    width: 100vw;
    left: 50%;
    transform: translateX(-50%);
    height: 100vh;
    overflow: hidden;
    background: #080808;
  `;

  rows.forEach((row, i) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const textCell = cells[0];
    const imageCell = cells[1];

    row.style.cssText = `
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      display: flex;
      align-items: center;
      opacity: ${i === 0 ? '1' : '0'};
      transition: opacity 1s ease;
      z-index: ${i === 0 ? '1' : '0'};
    `;

    if (imageCell) {
      imageCell.style.cssText = `
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        z-index: 0;
        overflow: hidden;
      `;
      const picture = imageCell.querySelector('picture');
      if (picture) {
        picture.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%;`;
      }
      const img = imageCell.querySelector('img');
      if (img) {
        img.style.cssText = `width: 100%; height: 100%; object-fit: cover; display: block;`;
        img.removeAttribute('loading');
      }
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: absolute; top: 0; left: 0;
        width: 100%; height: 100%;
        background: linear-gradient(to right, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.4) 60%, transparent 100%);
        z-index: 1;
      `;
      imageCell.append(overlay);
      row.prepend(imageCell);
    }

    if (textCell) {
      textCell.style.cssText = `
        position: relative;
        z-index: 2;
        padding: 0 8vw;
        max-width: 650px;
      `;
      textCell.querySelectorAll('h1,h2,h3').forEach(h => {
        h.style.cssText = `
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.5rem, 3vw, 3rem);
          color: #fff;
          line-height: 1.1;
          margin: 0 0 1rem 0;
        `;
        h.querySelectorAll('em').forEach(em => {
          em.style.cssText = `font-style: normal; color: #ff5000;`;
        });
      });
      textCell.querySelectorAll('p').forEach(p => {
        p.style.cssText = `
          font-family: 'DM Sans', sans-serif;
          font-size: 1.1rem;
          color: rgba(255,255,255,0.75);
          line-height: 1.6;
          margin: 0 0 1.5rem 0;
        `;
      });
      textCell.querySelectorAll('a').forEach(a => {
        a.style.cssText = `
          display: inline-block;
          background: #ff5000;
          color: #fff;
          text-decoration: none;
          padding: 0.8rem 2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        `;
      });
    }
  });

  // Prev / Next buttons
  const prev = document.createElement('button');
  prev.innerHTML = '&#8592;';
  prev.style.cssText = `
    position: absolute; top: 50%; left: 2vw;
    transform: translateY(-50%);
    z-index: 10;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff; font-size: 1.5rem;
    width: 48px; height: 48px;
    cursor: pointer; display: flex;
    align-items: center; justify-content: center;
  `;
  block.append(prev);

  const next = document.createElement('button');
  next.innerHTML = '&#8594;';
  next.style.cssText = `
    position: absolute; top: 50%; right: 2vw;
    transform: translateY(-50%);
    z-index: 10;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff; font-size: 1.5rem;
    width: 48px; height: 48px;
    cursor: pointer; display: flex;
    align-items: center; justify-content: center;
  `;
  block.append(next);

  // Dots
  const dotsContainer = document.createElement('div');
  dotsContainer.style.cssText = `
    position: absolute; bottom: 2rem; left: 50%;
    transform: translateX(-50%);
    z-index: 10; display: flex; gap: 0.6rem;
  `;
  rows.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.style.cssText = `
      width: 8px; height: 8px; border-radius: 50%;
      border: none; padding: 0; cursor: pointer;
      background: ${i === 0 ? '#ff5000' : 'rgba(255,255,255,0.3)'};
      transition: all 0.25s ease;
    `;
    dotsContainer.append(dot);
  });
  block.append(dotsContainer);

  const dots = [...dotsContainer.children];

  function goTo(index) {
    rows.forEach((row, i) => {
      row.style.opacity = i === index ? '1' : '0';
      row.style.zIndex = i === index ? '1' : '0';
      dots[i].style.background = i === index ? '#ff5000' : 'rgba(255,255,255,0.3)';
    });
  }

  let current = 0;

  prev.addEventListener('click', () => {
    current = (current - 1 + rows.length) % rows.length;
    goTo(current);
  });

  next.addEventListener('click', () => {
    current = (current + 1) % rows.length;
    goTo(current);
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      current = i;
      goTo(current);
    });
  });

  let autoplay = setInterval(() => {
    current = (current + 1) % rows.length;
    goTo(current);
  }, 5000);

  block.addEventListener('mouseenter', () => clearInterval(autoplay));
  block.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => {
      current = (current + 1) % rows.length;
      goTo(current);
    }, 5000);
  });

  let startX = 0;
  block.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  block.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      current = (current + (diff > 0 ? 1 : -1) + rows.length) % rows.length;
      goTo(current);
    }
  });
}
