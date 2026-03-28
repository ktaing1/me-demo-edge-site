export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const slides = rows.map((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const img = cells[0]?.querySelector('img') || null;
    const quote = cells[1]?.textContent?.trim() || '';
    const attribution = cells[2]?.textContent?.trim() || '';
    const ctaLabel = cells[3]?.textContent?.trim() || '';
    const ctaHref = cells[4]?.querySelector('a')?.href || cells[4]?.textContent?.trim() || '#';
    return {
      img, quote, attribution, ctaLabel, ctaHref,
    };
  });

  block.textContent = '';

  const section = document.createElement('div');
  section.className = 'stories-carousel-section';

  // Prev button
  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'stories-carousel-nav stories-carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous stories');
  prevBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>`;

  const trackWrap = document.createElement('div');
  trackWrap.className = 'stories-carousel-track-wrap';

  const track = document.createElement('div');
  track.className = 'stories-carousel-track';

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'stories-carousel-nav stories-carousel-next';
  nextBtn.setAttribute('aria-label', 'Next stories');
  nextBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>`;

  slides.forEach((data, i) => {
    const card = document.createElement('div');
    card.className = 'stories-carousel-card';
    card.setAttribute('data-index', i);

    // Image
    const imgWrap = document.createElement('div');
    imgWrap.className = 'stories-carousel-image';
    if (data.img) {
      const clonedImg = data.img.cloneNode(true);
      clonedImg.setAttribute('loading', 'lazy');
      imgWrap.appendChild(clonedImg);
    }

    // Text content
    const content = document.createElement('div');
    content.className = 'stories-carousel-content';

    const quoteEl = document.createElement('p');
    quoteEl.className = 'stories-carousel-quote';
    quoteEl.textContent = data.quote;

    const attrEl = document.createElement('p');
    attrEl.className = 'stories-carousel-attribution';
    attrEl.textContent = `\u2014 ${data.attribution}`;

    content.appendChild(quoteEl);
    content.appendChild(attrEl);

    // CTA as <button> to avoid AEM global <a> color overrides
    const ctaBtn = document.createElement('button');
    ctaBtn.type = 'button';
    ctaBtn.className = 'stories-carousel-cta';
    ctaBtn.setAttribute('role', 'link');
    ctaBtn.setAttribute('aria-label', data.ctaLabel);
    ctaBtn.addEventListener('click', () => {
      window.location.href = data.ctaHref;
    });

    const ctaLabelEl = document.createElement('span');
    ctaLabelEl.className = 'stories-carousel-cta-label';
    ctaLabelEl.textContent = data.ctaLabel;

    const ctaIcon = document.createElement('span');
    ctaIcon.className = 'stories-carousel-cta-icon';
    ctaIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>`;

    ctaBtn.appendChild(ctaLabelEl);
    ctaBtn.appendChild(ctaIcon);

    // Rainbow bar
    const bar = document.createElement('div');
    bar.className = 'stories-carousel-bar';

    card.appendChild(imgWrap);
    card.appendChild(content);
    card.appendChild(ctaBtn);
    card.appendChild(bar);
    track.appendChild(card);
  });

  trackWrap.appendChild(track);
  section.appendChild(prevBtn);
  section.appendChild(trackWrap);
  section.appendChild(nextBtn);
  block.appendChild(section);

  // ── Carousel logic ────────────────────────────────────────

  let current = 0;

  // Returns how many cards are visible at the current viewport width.
  // Must stay in sync with the CSS breakpoints.
  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 560) return 1;
    if (w <= 860) return 2;
    return 3;
  }

  function getCardWidth() {
    const card = track.querySelector('.stories-carousel-card');
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
  }

  function updateStates() {
    const visible = getVisibleCount();
    [...track.querySelectorAll('.stories-carousel-card')].forEach((card, i) => {
      card.classList.remove('is-center', 'is-side');
      // Mark cards in the visible window
      if (i >= current && i < current + visible) {
        if (visible === 3 && i === current + 1) {
          card.classList.add('is-center');
        } else if (visible === 3) {
          card.classList.add('is-side');
        }
        // For 1 or 2 visible, no center/side treatment needed
      }
    });
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= slides.length - visible;
  }

  function goTo(index) {
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, slides.length - visible);
    current = Math.max(0, Math.min(index, maxIndex));
    track.style.transform = `translateX(-${current * getCardWidth()}px)`;
    updateStates();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // On resize: recalculate position in case breakpoint changed
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Clamp current to new max so we don't get stuck off-screen
      goTo(current);
    }, 100);
  });

  goTo(0);
}
