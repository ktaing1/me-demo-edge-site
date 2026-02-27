async function fetchNav() {
  const resp = await fetch('/nav');
  const html = await resp.text();
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

export default async function decorate(block) {
  const navDoc = await fetchNav();
  const sections = [...navDoc.querySelectorAll('main > div')];

  const brandSection = sections[0];
  const linksSection = sections[1];
  const utilitySection = sections[2];

  // Brand - h1 text + p subtitle
  const brandName = brandSection?.querySelector('h1')?.textContent?.trim() || 'THE DEMO';
  const brandSub = brandSection?.querySelector('p')?.textContent?.trim() || '';

  // Nav links - build from ul with nested uls for dropdowns
  let navLinksHTML = '';
  if (linksSection) {
    const topItems = [...linksSection.querySelectorAll(':scope > ul > li')];
    navLinksHTML = topItems.map(li => {
      const nestedUl = li.querySelector('ul');
      // Get just the top-level text (not nested list text)
      const topText = [...li.childNodes]
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent.trim())
        .join('') || li.firstChild?.textContent?.trim();
      const topLink = li.querySelector(':scope > a');

      if (nestedUl) {
        const dropItems = [...nestedUl.querySelectorAll('li')].map(sub => {
          const a = sub.querySelector('a');
          return a
            ? `<li><a href="${a.getAttribute('href')}">${a.textContent.trim()}</a></li>`
            : `<li><a href="#">${sub.textContent.trim()}</a></li>`;
        }).join('');
        return `
          <li class="nav-drop">
            <button type="button">${topText} <span class="nav-arrow">&#8964;</span></button>
            <ul class="nav-dropdown">${dropItems}</ul>
          </li>`;
      }

      return topLink
        ? `<li><a href="${topLink.getAttribute('href')}">${topText}</a></li>`
        : `<li><a href="#">${topText}</a></li>`;
    }).join('');
  }

  // Utility links
  let utilityLinksHTML = '';
  if (utilitySection) {
    const links = [...utilitySection.querySelectorAll('a')];
    utilityLinksHTML = links.map((a, i) => {
      const divider = i < links.length - 1 ? '<span class="nav-divider">|</span>' : '';
      return `<a href="${a.getAttribute('href')}">${a.textContent.trim()}</a>${divider}`;
    }).join('');
  }

  block.innerHTML = `
    <nav id="nav" aria-expanded="false">
      <div class="nav-utility-bar">
        <div class="nav-utility-links">${utilityLinksHTML}</div>
        <a href="#" class="nav-search">&#128269; Search</a>
      </div>
      <div class="nav-main-bar">
        <div class="nav-brand">
          <a href="/">
            <span class="nav-brand-eyebrow">ONCE-WEEKLY</span>
            <span class="nav-brand-name">${brandName}</span>
            <span class="nav-brand-sub">${brandSub}</span>
          </a>
        </div>
        <div class="nav-sections">
          <ul>${navLinksHTML}</ul>
        </div>
        <div class="nav-hamburger">
          <button type="button" aria-label="Open navigation">
            <span class="nav-hamburger-icon"></span>
          </button>
        </div>
      </div>
    </nav>
  `;

  const nav = block.querySelector('#nav');

  // Dropdown toggles
  nav.querySelectorAll('.nav-drop > button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const li = btn.parentElement;
      const isOpen = li.classList.contains('open');
      nav.querySelectorAll('.nav-drop').forEach((d) => d.classList.remove('open'));
      if (!isOpen) li.classList.add('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      nav.querySelectorAll('.nav-drop').forEach((d) => d.classList.remove('open'));
    }
  });

  // Hamburger
  const hamburger = nav.querySelector('.nav-hamburger button');
  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    hamburger.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    document.body.style.overflow = expanded ? '' : 'hidden';
  });

  // Close menu on link click (mobile)
  nav.querySelectorAll('.nav-sections a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}
