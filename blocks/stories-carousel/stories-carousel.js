export default function decorate(block) {
  // Gather all rows from the block — each row is one patient card
  const rows = [...block.querySelectorAll(':scope > div')];

  // Build slides array from authored content
  const slides = rows.map((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    // Expected column order in the Word doc:
    // | Image | Quote | Attribution | CTA Label | CTA Link |
    const img = cells[0]?.querySelector('img') || null;
    const quote = cells[1]?.textContent?.trim() || '';
    const attribution = cells[2]?.textContent?.trim() || '';
    const ctaLabel = cells[3]?.textContent?.trim() || '';
    const ctaHref = cells[4]?.querySelector('a')?.href || cells[4]?.textContent?.trim() || '#';

    return { img, quote, attribution, ctaLabel, ctaHref };
  });

  // Clear existing block content
  block.textContent = '';

  // Build wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'stories-carousel-wrapper';

  // Prev button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'stories-carousel-nav stories-carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '&#8249;';

  // Track
  const track = document.createElement('div');
  track.className = 'stories-carousel-track';

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'stories-carousel-nav stories-carousel-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '&#8250;';

  // Build slide cards
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

    // Quote
    const quoteEl = document.createElement('p');
    quoteEl.className = 'stories-carousel-quote';
    quoteEl.textContent = data.quote;

    // Attribution
    const attrEl = document.createElement('p');
    attrEl.className = 'stories-carousel-attribution';
    attrEl.textContent = `— ${data.attribution}`;

    // CTA
    const cta = document.createElement('a');
    cta.className = 'stories-carousel-cta';
    cta.href = data.ctaHref;
    cta.innerHTML = `${data.ctaLabel} <span class="stories-carousel-cta-icon">&#10140;</span>`;

    // Colored bottom bar
    const bar = document.createElement('div');
    bar.className = 'stories-carousel-bar';

    card.appendChild(imgWrap);
    card.appendChild(quoteEl);
    card.appendChild(attrEl);
    card.appendChild(cta);
    card.appendChild(bar);
    track.appendChild(card);
  });

  wrapper.appendChild(prevBtn);
  wrapper.appendChild(track);
  wrapper.appendChild(nextBtn);
  block.appendChild(wrapper);

  // --- Carousel logic ---
  const VISIBLE = 3; // cards visible at once
  let current = 0;   // index of the left-most visible card

  function getCardWidth() {
    const card = track.querySelector('.stories-carousel-card');
    if (!card) return 0;
    const style = getComputedStyle(card);
    return card.offsetWidth + parseFloat(style.marginRight || 0);
  }

  function updateActive() {
    const cards = track.querySelectorAll('.stories-carousel-card');
    cards.forEach((card, i) => {
      card.classList.toggle('is-center', i === current + 1);
      card.classList.toggle('is-side', i === current || i === current + 2);
    });
  }

  function goTo(index) {
    const maxIndex = slides.length - VISIBLE;
    current = Math.max(0, Math.min(index, maxIndex));
    const offset = current * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;
    updateActive();
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIndex;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Init
  goTo(0);

  // Re-align on resize
  window.addEventListener('resize', () => goTo(current));
}
