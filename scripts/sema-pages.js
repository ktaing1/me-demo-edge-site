/**
 * sema-page.js
 * Place at /scripts/sema-page.js in your repo.
 *
 * HOW IT WORKS:
 * AEM EDS auto-loads the site's global header and footer blocks
 * on every page. For sema- pages we want:
 *   1. The site's nav/footer HIDDEN (replaced by sema-header / sema-footer blocks)
 *   2. The sema-styles.css reset loaded BEFORE any content renders
 *   3. The --nav-height margin-top on <main> removed
 *
 * TO USE:
 * In your page's Google Doc, add a metadata table:
 *   | Metadata |                    |
 *   | template | sema               |
 *
 * Then in scripts.js, detect the template and import this module:
 *   const template = getMetadata('template');
 *   if (template === 'sema') {
 *     import('/scripts/sema-page.js');
 *   }
 *
 * OR simply import it unconditionally on pages where it's needed.
 */

(function initSemaPage() {
  // 1. Add body class immediately so CSS can hide site nav instantly
  document.body.classList.add('sema-page');

  // 2. Inject the sema-styles.css reset as early as possible
  //    (before AEM's lazy styles load) to prevent flash of orange links / Times font
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/styles/sema-styles.css';
  document.head.insertBefore(link, document.head.firstChild);

  // 3. Remove the site's nav-height margin from <main>
  //    AEM sets: main { margin-top: var(--nav-height) }
  //    We override it inline so it takes effect before CSS loads
  function resetMainOffset() {
    const main = document.querySelector('main');
    if (main) {
      main.style.marginTop = '0';
      main.style.paddingTop = '0';
    }
  }
  resetMainOffset();

  // 4. Hide the site's header and footer blocks
  //    AEM renders header into <header> and footer into <footer>
  //    We hide them as soon as they exist in the DOM
  function hideGlobalChrome() {
    const siteHeader = document.querySelector('header');
    const siteFooter = document.querySelector('footer');

    // Only hide the SITE header/footer — not our sema- ones
    // The sema-header block renders inside .block.sema-header, not in <header>
    if (siteHeader && !siteHeader.closest('.sema-header')) {
      siteHeader.style.display = 'none';
    }
    if (siteFooter && !siteFooter.closest('.sema-footer')) {
      siteFooter.style.display = 'none';
    }
  }

  // Run immediately and also on DOM changes (AEM loads nav async)
  hideGlobalChrome();
  const observer = new MutationObserver(() => {
    hideGlobalChrome();
    resetMainOffset();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Stop observing once page is fully loaded
  window.addEventListener('load', () => observer.disconnect());
})();
