
    <nav id="nav">
      <!-- Top utility bar -->
      <div class="nav-utility-bar">
        <div class="nav-utility-links">
          <a href="#">Important Safety Information</a>
          <span class="nav-divider">|</span>
          <a href="#">Prescribing Information</a>
          <span class="nav-divider">|</span>
          <a href="#">Medication Guide</a>
          <span class="nav-divider">|</span>
          <a href="#">En Español</a>
          <span class="nav-divider">|</span>
          <a href="#">Health Care Professionals Site</a>
        </div>
        <a href="#" class="nav-search">&#128269; Search</a>
      </div>

      <!-- Main nav bar -->
      <div class="nav-main-bar">
        <!-- Logo / Brand -->
        <div class="nav-brand">
          <a href="/">
            <span class="nav-brand-eyebrow">ONCE-WEEKLY</span>
            <span class="nav-brand-name">THE DEMO</span>
            <span class="nav-brand-sub">edge delivery services</span>
          </a>
        </div>

        <!-- Main nav links with dropdowns -->
        <div class="nav-sections">
          <ul>
            <li class="nav-drop">
              <button>Why The Demo? <span class="nav-arrow">&#8964;</span></button>
              <ul class="nav-dropdown">
                <li><a href="#features">Features</a></li>
                <li><a href="#why-edge-delivery">About Edge Delivery</a></li>
                <li><a href="#">Performance</a></li>
              </ul>
            </li>
            <li class="nav-drop">
              <button>How It Works <span class="nav-arrow">&#8964;</span></button>
              <ul class="nav-dropdown">
                <li><a href="#">Setup Guide</a></li>
                <li><a href="#">Google Drive Integration</a></li>
                <li><a href="#">GitHub Deployment</a></li>
              </ul>
            </li>
            <li class="nav-drop">
              <button>Resources <span class="nav-arrow">&#8964;</span></button>
              <ul class="nav-dropdown">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Block Library</a></li>
                <li><a href="#">Community</a></li>
              </ul>
            </li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Videos &amp; Demos</a></li>
          </ul>
        </div>

        <!-- Hamburger -->
        <div class="nav-hamburger">
          <button type="button" aria-label="Open navigation">
            <span class="nav-hamburger-icon"></span>
          </button>
        </div>
      </div>
    </nav>
  `;

  const nav = block.querySelector('#nav');

  // Dropdown toggle
  nav.querySelectorAll('.nav-drop > button').forEach(btn => {
    btn.addEventListener('click', () => {
      const li = btn.parentElement;
      const isOpen = li.classList.contains('open');
      nav.querySelectorAll('.nav-drop').forEach(d => d.classList.remove('open'));
      if (!isOpen) li.classList.add('open');
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      nav.querySelectorAll('.nav-drop').forEach(d => d.classList.remove('open'));
    }
  });

  // Hamburger toggle
  const hamburger = nav.querySelector('.nav-hamburger button');
  const navSections = nav.querySelector('.nav-sections');
  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });

