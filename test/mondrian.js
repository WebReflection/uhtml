const require = (mame, es = '../esm/index.js') => import(
  /^(?:localhost|[0-9.]+)$/.test(location.hostname) ?
  es : `https://unpkg.com/${mame}?module`
);

Promise.all([
  import('https://unpkg.com/wicked-elements?module'),
  require('uhtml')
]).then(([{define}, {render, html}]) => {

  define('#app .mondrian', {
    connected() { this.render(); },
    render(blocks = this.generateBlocks()) {
      render(this.element, html`${blocks.map(
        ({colSpan, rowSpan, colorIndex}) => html`
        <div class="mondrian__block"
            data-col-span=${colSpan}
            data-row-span=${rowSpan}
            data-color-index=${colorIndex} />`
      )}`);
    },
    generateBlocks() {
      const blocks = [];
      for (let i = 0; i < 10; i++) {
        blocks.push({
          colSpan: Math.floor(Math.random() * 3 + 1),
          rowSpan: Math.floor(Math.random() * 3 + 1),
          colorIndex: Math.floor(Math.random() * 6 + 1),
        });
      }
      return blocks;
    },
    onGenerate() {
      this.render([]);
      setTimeout(() => this.render());
    }
  });

  define('#app .generate-button', {
    onclick() {
      const mondrian = document.querySelector('.mondrian');
      mondrian.dispatchEvent(new Event('generate'));
    }
  });

});
