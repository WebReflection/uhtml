const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto('http://localhost:7357/test/puppeteer.html');
  const coverage = await page.evaluate(() => window.__coverage__);
  await browser.close();
  require('fs').writeFile('.nyc_output/coverage.json', JSON.stringify(coverage), Object);
})();
