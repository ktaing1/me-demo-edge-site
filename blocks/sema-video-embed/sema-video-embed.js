// sema-video-embed: video thumbnail + text panel layout
// Word doc cols: | Video URL | Thumbnail Image | Title | Body | Duration |

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;
  const cells = [...rows[0].querySelectorAll(':scope > div')];

  const videoUrl = cells[0]?.querySelector('a')?.href || cells[0]?.textContent?.trim() || '';
  const thumbnail = cells[1]?.querySelector('img') || null;
  const titleText = cells[2]?.innerHTML || '';
  const bodyText = cells[3]?.innerHTML || '';
  const duration = cells[4]?.textContent?.trim() || '';

  const isReverse = block.classList.contains('reverse');
  block.textContent = '';

  const wrap = document.createElement('div');
  wrap.className = `sema-video-embed${isReverse ? ' sema-video-embed-reverse' : ''}`;

  // Video player side
  const playerSide = document.createElement('div');
  playerSide.className = 'sema-video-embed-player';

  const thumb = document.createElement('div');
  thumb.className = 'sema-video-embed-thumb';

  if (thumbnail) {
    const img = thumbnail.cloneNode(true);
    img.setAttribute('loading', 'lazy');
    thumb.appendChild(img);
  }

  // Play button overlay
  const playBtn = document.createElement('button');
  playBtn.className = 'sema-video-embed-play';
  playBtn.setAttribute('aria-label', 'Play video');
  playBtn.innerHTML = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="rgba(255,255,255,0.85)"/>
    <polygon points="24,16 52,32 24,48" fill="#003087"/>
  </svg>`;

  if (duration) {
    const dur = document.createElement('span');
    dur.className = 'sema-video-embed-duration';
    dur.textContent = `(${duration})`;
    thumb.appendChild(dur);
  }

  thumb.appendChild(playBtn);
  playerSide.appendChild(thumb);

  // On click, swap thumbnail for iframe
  playBtn.addEventListener('click', () => {
    if (!videoUrl) return;
    const iframe = document.createElement('iframe');
    iframe.src = videoUrl;
    iframe.allow = 'autoplay; fullscreen';
    iframe.allowFullscreen = true;
    iframe.className = 'sema-video-embed-iframe';
    playerSide.replaceChildren(iframe);
  });

  // Text side
  const textSide = document.createElement('div');
  textSide.className = 'sema-video-embed-content';
  if (titleText) {
    const title = document.createElement('div');
    title.className = 'sema-video-embed-title';
    title.innerHTML = titleText;
    textSide.appendChild(title);
  }
  if (bodyText) {
    const body = document.createElement('div');
    body.className = 'sema-video-embed-body';
    body.innerHTML = bodyText;
    textSide.appendChild(body);
  }

  if (isReverse) {
    wrap.appendChild(textSide);
    wrap.appendChild(playerSide);
  } else {
    wrap.appendChild(playerSide);
    wrap.appendChild(textSide);
  }

  block.appendChild(wrap);
}
