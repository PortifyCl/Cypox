const { chromium } = require('playwright');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

const sites = [
  { name: 'unseen', url: 'https://unseen.co' },
  { name: 'zajno', url: 'https://zajno.com' },
  { name: 'noomoagency', url: 'https://noomoagency.com' },
  { name: 'mesh3d', url: 'https://mesh3d.gallery' },
  { name: 'velloventures', url: 'https://velloventures.com' },
  { name: 'ascendmarketing', url: 'https://ascendmarketing.xyz' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const allScreenshots = [];

  for (const site of sites) {
    console.log(`\n=== Processing: ${site.name} (${site.url}) ===`);
    const page = await context.newPage();
    
    try {
      await page.goto(site.url, { waitUntil: 'networkidle', timeout: 60000 });
      console.log(`  Page loaded: ${site.url}`);
      
      // Wait a bit for animations/lazy content
      await page.waitForTimeout(3000);

      // Full page screenshot
      const fullPagePath = path.join(SCREENSHOT_DIR, `${site.name}-fullpage.png`);
      await page.screenshot({ path: fullPagePath, fullPage: true });
      allScreenshots.push(fullPagePath);
      console.log(`  Saved: ${site.name}-fullpage.png`);

      // Scroll down 1000px
      await page.evaluate(() => window.scrollBy(0, 1000));
      await page.waitForTimeout(1500);
      const scroll1Path = path.join(SCREENSHOT_DIR, `${site.name}-scroll1000.png`);
      await page.screenshot({ path: scroll1Path });
      allScreenshots.push(scroll1Path);
      console.log(`  Saved: ${site.name}-scroll1000.png`);

      // Scroll down another 1000px
      await page.evaluate(() => window.scrollBy(0, 1000));
      await page.waitForTimeout(1500);
      const scroll2Path = path.join(SCREENSHOT_DIR, `${site.name}-scroll2000.png`);
      await page.screenshot({ path: scroll2Path });
      allScreenshots.push(scroll2Path);
      console.log(`  Saved: ${site.name}-scroll2000.png`);

    } catch (err) {
      console.error(`  ERROR on ${site.name}: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log(`\n=== DONE: ${allScreenshots.length} screenshots created ===`);
  allScreenshots.forEach(f => console.log(`  ${f}`));
})();
