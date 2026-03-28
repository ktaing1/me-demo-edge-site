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

  block.textContent = '';

  const section = document.createElement('div');
  section.className = 'stories-carousel-section';

  // Prev button — SVG chevron, sits outside the track
  const prevBtn = document.createElement('button');
  prevBtn.className = 'stories-carousel-nav stories-carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous stories');
  prevBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>`;

  const trackWrap = document.createElement('div');
  trackWrap.className = 'stories-carousel-track-wrap';

  const track = document.createElement('div');
  track.className = 'stories-carousel-track';

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'stories-carousel-nav stories-carousel-next';
  nextBtn.setAttribute('aria-label', 'Next stories');
  nextBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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

    // Content area
    const content = document.createElement('div');
    content.className = 'stories-carousel-content';

    const quoteEl = document.createElement('p');
    quoteEl.className = 'stories-carousel-quote';
    quoteEl.textContent = data.quote;

    const attrEl = document.createElement('p');
    attrEl.className = 'stories-carousel-attribution';
    attrEl.textContent = `\u2014 ${data.attribution}`;

    // CTA — full-width, label left, circle chevron right
    const cta = document.createElement('a');
    cta.className = 'stories-carousel-cta';
    cta.href = data.ctaHref;

    const ctaText = document.createElement('span');
    ctaText.className = 'stories-carousel-cta-label';
    ctaText.textContent = data.ctaLabel;

    const ctaIcon = document.createElement('span');
    ctaIcon.className = 'stories-carousel-cta-icon';
    ctaIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>`;

    cta.appendChild(ctaText);
    cta.appendChild(ctaIcon);

    content.appendChild(quoteEl);
    content.appendChild(attrEl);
    content.appendChild(cta);

    // Rainbow bottom bar
    const bar = document.createElement('div');
    bar.className = 'stories-carousel-bar';

    card.appendChild(imgWrap);
    card.appendChild(content);
    card.appendChild(bar);
    track.appendChild(card);
  });

  trackWrap.appendChild(track);
  section.appendChild(prevBtn);
  section.appendChild(trackWrap);
  section.appendChild(nextBtn);
  block.appendChild(section);

  // --- Carousel logic ---
  const VISIBLE = 3;
  let current = 0;

  function getCardWidth() {
    const card = track.querySelector('.stories-carousel-card');
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
  }

  function updateStates() {
    const cards = [...track.querySelectorAll('.stories-carousel-card')];
    cards.forEach((card, i) => {
      card.classList.remove('is-center', 'is-side');
      if (i === current) card.classList.add('is-side');
      if (i === current + 1) card.classList.add('is-center');
      if (i === current + 2) card.classList.add('is-side');
    });
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= slides.length - VISIBLE;
  }

  function goTo(index) {
    const maxIndex = Math.max(0, slides.length - VISIBLE);
    current = Math.max(0, Math.min(index, maxIndex));
    const offset = current * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;
    updateStates();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  goTo(0);
  window.addEventListener('resize', () => goTo(current));
}
