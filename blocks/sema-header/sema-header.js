export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;
  const cells = [...rows[0].querySelectorAll(':scope > div')];

  block.textContent = '';
  const header = document.createElement('header');
  header.className = 'sema-header';

  // Row 1: utility bar (ISI links, audience note)
  const utilityBar = document.createElement('div');
  utilityBar.className = 'sema-header-utility';
  if (cells[1]) utilityBar.innerHTML = cells[1].innerHTML;

  // Row 2: logo + nav
  const navRow = document.createElement('div');
  navRow.className = 'sema-header-nav-row';

  const logoWrap = document.createElement('div');
  logoWrap.className = 'sema-header-logo';
  if (cells[0]) logoWrap.innerHTML = cells[0].innerHTML;

  const nav = document.createElement('nav');
  nav.className = 'sema-header-nav';
  nav.setAttribute('aria-label', 'Primary navigation');
  if (cells[2]) nav.innerHTML = cells[2].innerHTML;

  navRow.appendChild(logoWrap);
  navRow.appendChild(nav);
  header.appendChild(utilityBar);
  header.appendChild(navRow);
  block.appendChild(header);
}
