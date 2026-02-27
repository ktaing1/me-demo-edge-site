async function fetchNav() {
  const resp = await fetch('/nav');
  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc;
}

export default async function decorate(block) {
  const navDoc = await fetchNav();

  // AEM renders nav doc sections as <div> blocks
  // Typically: first section = brand, second = nav links, third = utility links
  const sections = [...navDoc.querySelectorAll('main > div')];

  const brandSection = sections[0];
  const linksSection = sections[1];
  const utilitySection = sections[2];

  // Extract brand HTML
  const brandHTML = brandSection ? brandSection.innerHTML : '<a href="/">THE DEMO</a>';

  // Build nav links from the links section
  // Links section contains a <ul> with nav items
  let navLinksHTML = '';
  if (linksSection) {
    const ul = linksSection.querySelector('ul');
    if (ul) {
      const items = [...ul.querySelectorAll(':scope > li')];
      navLinksHTML = items.map(li => {
        const nestedUl = li.querySelector('ul');
        const topLink = li.querySelector(':scope > a') || li.firstChild;
        const topText = topLink?.textContent?.trim() || li.textContent.trim();
        const topHref = topLink?.href || '#';

        if (nestedUl) {
          // Has dropdown
          const dropItems = [...nestedUl.querySelectorAll('li')].map(sub => {
            const a = sub.querySelector('a');
            return a ? `<li><a href="${a.href}">${a.textContent.trim()}</a></li>` : '';
          }).join('');
          return `
            <li class="nav-drop">
              <button type="button">${topText} <span class="nav-arrow">&#8964;</span></button>
              <ul class="nav-dropdown">${dropItems}</ul>
            </li>
          `;
        }

        return `<li><a href="${topHref}">${topText}</a></li>`;
      }).join('');
    }
  }

  // Build utility links from utility section
  let utilityLinksHTML = '';
  let searchHTML = '<a href="#" class="nav-search">&#128269; Search</a>';
  if (utilitySection) {
    const links = [...utilitySection.querySelectorAll('a')];
    utilityLinksHTML = links.map((a, i) => {
      const divider = i < links.length - 1 ? '<span class="nav-divider">|</span>' : '';
      return `<a href="${a.href}">${a.textContent.trim()}</a>${divider}`;
    }).join('');
  }

  block.innerHTML = `
    <nav id="nav" aria-expanded="false">
      <div class="nav-utility-bar">
        <div class="nav-utility-links">${utilityLinksHTML}</div>
        ${searchHTML}
      </div>
      <div class="nav-main-bar">
        <div class="nav-brand">${brandHTML}</div>
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

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      nav.querySelectorAll('.nav-drop').forEach((d) => d.classList.remove('open'));
    }
  });

  // Hamburger toggle
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
