export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const slides = rows.map((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const img = cells[0]?.querySelector('img') || null;
    const quote = cells[1]?.textContent?.trim() || '';
    const attribution = cells[2]?.textContent?.trim() || '';
    const ctaLabel = cells[3]?.textContent?.trim() || '';
    const ctaHref = cells[4]?.querySelector('a')?.href || cells[4]?.textContent?.trim() || '#';
    return { img, quote, attribution, ctaLabel, ctaHref };
  });

  const total = slides.length;
  block.textContent = '';

  // Force white background on block + AEM section parent
  block.style.background = '#fff';
  const aemSection = block.closest('.section');
  if (aemSection) {
    aemSection.style.background = '#fff';
    aemSection.style.backgroundColor = '#fff';
  }

  // ── Build a card DOM element ──────────────────────────────
  function buildCard(data, realIndex) {
    const card = document.createElement('div');
    card.className = 'stories-carousel-card';
    card.setAttribute('data-real-index', realIndex);

    const imgWrap = document.createElement('div');
    imgWrap.className = 'stories-carousel-image';
    if (data.img) {
      const clonedImg = data.img.cloneNode(true);
      clonedImg.setAttribute('loading', 'lazy');
      imgWrap.appendChild(clonedImg);
    }

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

    const ctaBtn = document.createElement('button');
    ctaBtn.type = 'button';
    ctaBtn.className = 'stories-carousel-cta';
    ctaBtn.setAttribute('role', 'link');
    ctaBtn.setAttribute('aria-label', data.ctaLabel);
    ctaBtn.addEventListener('click', () => { window.location.href = data.ctaHref; });

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

    const bar = document.createElement('div');
    bar.className = 'stories-carousel-bar';

    card.appendChild(imgWrap);
    card.appendChild(content);
    card.appendChild(ctaBtn);
    card.appendChild(bar);
    return card;
  }

  // ── DOM structure ─────────────────────────────────────────
  const wrapper = document.createElement('div');
  wrapper.className = 'stories-carousel-section';

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

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'stories-carousel-nav stories-carousel-next';
  nextBtn.setAttribute('aria-label', 'Next stories');
  nextBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>`;

  // ── Clone-based infinite loop setup ──────────────────────
  // Layout: [clones of last N slides] [real slides] [clones of first N slides]
  // N = max visible count (3). We'll prepend 3 clones of the end and
  // append 3 clones of the start so wrapping always feels seamless.
  const CLONE_COUNT = 3;

  // Prepend clones of the LAST N real slides
  for (let i = total - CLONE_COUNT; i < total; i++) {
    track.appendChild(buildCard(slides[i], i));
  }

  // Append all real slides
  slides.forEach((data, i) => track.appendChild(buildCard(data, i)));

  // Append clones of the FIRST N real slides
  for (let i = 0; i < CLONE_COUNT; i++) {
    track.appendChild(buildCard(slides[i], i));
  }

  // The real slides start at track position CLONE_COUNT
  // current is always the real-slide index (0 … total-1)
  // trackIndex = current + CLONE_COUNT
  let current = 0; // real slide index

  // ── Pagination dots ───────────────────────────────────────
  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'stories-carousel-dots';
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'stories-carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
    return dot;
  });

  trackWrap.appendChild(track);
  wrapper.appendChild(prevBtn);
  wrapper.appendChild(trackWrap);
  wrapper.appendChild(nextBtn);
  block.appendChild(wrapper);
  block.appendChild(dotsWrap);

  // ── Helpers ───────────────────────────────────────────────
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

  function updateDots() {
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
  }

  function updateCardStates() {
    const visible = getVisibleCount();
    const trackIndex = current + CLONE_COUNT;
    const allCards = [...track.querySelectorAll('.stories-carousel-card')];
    allCards.forEach((card, i) => {
      card.classList.remove('is-center', 'is-side');
      if (visible === 3) {
        if (i === trackIndex) card.classList.add('is-side');
        if (i === trackIndex + 1) card.classList.add('is-center');
        if (i === trackIndex + 2) card.classList.add('is-side');
      }
    });
  }

  // Move track to position for a given real slide index, with animation toggle
  function setTrackPosition(animated) {
    const trackIndex = current + CLONE_COUNT;
    const offset = trackIndex * getCardWidth();
    if (!animated) {
      track.style.transition = 'none';
    } else {
      track.style.transition = '';
    }
    track.style.transform = `translateX(-${offset}px)`;
  }

  let isBusy = false;

  function goTo(realIndex, animated = true) {
    if (isBusy) return;
    current = ((realIndex % total) + total) % total; // safe modulo
    setTrackPosition(animated);
    updateCardStates();
    updateDots();
  }

  // After a transition ends, silently snap if we've landed on a clone
  track.addEventListener('transitionend', () => {
    isBusy = false;
    const visible = getVisibleCount();
    const trackIndex = current + CLONE_COUNT;
    const totalCards = total + CLONE_COUNT * 2;

    // If we're in the leading clone zone (went backwards past real start)
    if (trackIndex < CLONE_COUNT) {
      current = total - visible; // jump to the real end
      setTrackPosition(false);   // no animation
      updateCardStates();
      updateDots();
    }
    // If we're in the trailing clone zone (went forwards past real end)
    else if (trackIndex >= total + CLONE_COUNT) {
      current = 0;             // jump to real start
      setTrackPosition(false);
      updateCardStates();
      updateDots();
    }

    // Force reflow so the no-animation snap takes effect before re-enabling transitions
    // eslint-disable-next-line no-unused-expressions
    track.offsetHeight;
    track.style.transition = '';
  });

  prevBtn.addEventListener('click', () => {
    if (isBusy) return;
    isBusy = true;
    goTo(current - 1);
  });

  nextBtn.addEventListener('click', () => {
    if (isBusy) return;
    isBusy = true;
    goTo(current + 1);
  });

  // ── Touch / swipe ─────────────────────────────────────────
  let touchStartX = 0;
  let touchStartY = 0;
  let isDragging = false;

  trackWrap.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  trackWrap.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) e.preventDefault();
  }, { passive: false });

  trackWrap.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      isBusy = true;
      goTo(dx < 0 ? current + 1 : current - 1);
    }
  }, { passive: true });

  // ── Resize ────────────────────────────────────────────────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setTrackPosition(false);
      updateCardStates();
    }, 100);
  });

  // ── Init ──────────────────────────────────────────────────
  goTo(0, false);
}
