export default async function decorate(block) {
  block.innerHTML = `
    <nav id="nav">
      <div class="nav-brand">
        <a href="/">THE DEMO</a>
      </div>
      <div class="nav-sections">
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#why-edge-delivery">About</a></li>
          <li><a href="#features">Get Started</a></li>
        </ul>
      </div>
      <div class="nav-hamburger">
        <button type="button" aria-label="Open navigation">
          <span class="nav-hamburger-icon"></span>
        </button>
      </div>
    </nav>
  `;

  const nav = block.querySelector('#nav');
  const navSections = block.querySelector('.nav-sections');
  const hamburger = block.querySelector('.nav-hamburger button');

  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    hamburger.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  });
}
