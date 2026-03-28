// sema-footer: site footer with logo, links, legal copy
// Word doc cols: | Logo | Nav Links | Legal Text |

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;
  const cells = [...rows[0].querySelectorAll(':scope > div')];

  block.textContent = '';

  const footer = document.createElement('footer');
  footer.className = 'sema-footer';

  const inner = document.createElement('div');
  inner.className = 'sema-footer-inner';

  // Logo
  const logoWrap = document.createElement('div');
  logoWrap.className = 'sema-footer-logo';
  if (cells[0]) logoWrap.innerHTML = cells[0].innerHTML;

  // Nav links
  const nav = document.createElement('nav');
  nav.className = 'sema-footer-nav';
  nav.setAttribute('aria-label', 'Footer navigation');
  if (cells[1]) nav.innerHTML = cells[1].innerHTML;

  // Legal
  const legal = document.createElement('div');
  legal.className = 'sema-footer-legal';
  if (cells[2]) legal.innerHTML = cells[2].innerHTML;

  inner.appendChild(logoWrap);
  inner.appendChild(nav);
  footer.appendChild(inner);
  footer.appendChild(legal);
  block.appendChild(footer);
}
