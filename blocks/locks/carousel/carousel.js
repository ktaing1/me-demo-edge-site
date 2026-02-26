export default function decorate(block) {
  console.log('CAROUSEL LOADED', block);
  
  const rows = [...block.querySelectorAll(':scope > div')];
  console.log('rows found:', rows.length);

  block.style.cssText = `
    position: relative !important;
    width: 100vw;
    left: 50%;
    transform: translateX(-50%);
    height: 100vh;
    overflow: hidden;
    background: #080808;
    display: block;
  `;

  rows.forEach((row, i) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const textCell = cells[0];
    const imageCell = cells[1];

    row.style.cssText = `
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      display: flex;
      align-items: center;
      opacity: ${i === 0 ? '1' : '0'};
      transition: opacity 1s ease;
    `;

    if (imageCell) {
      imageCell.style.cssText = `
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        z-index: 0;
      `;
      const img = imageCell.querySelector('img');
      if (img) {
        img.style.cssText = `
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        `;
        img.removeAttribute('loading');
      }
    }

    if (textCell) {
      textCell.style.cssText = `
        position: relative;
        z-index: 2;
        padding: 0 8vw;
        max-width: 650px;
        color: white;
      `;
    }
  });
}
