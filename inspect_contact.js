import { chromium } from 'playwright';

async function inspect() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2500);

  // Scroll to bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight - window.innerHeight);
  });
  await page.waitForTimeout(600);

  const res = await page.evaluate(() => {
    const el = document.querySelector('a[href*="mailto"]');
    if (!el) return 'Not found';
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    const container = el.closest('section');
    return {
      rect: { top: rect.top, bottom: rect.bottom, left: rect.left, width: rect.width, height: rect.height },
      color: style.color,
      visibility: style.visibility,
      display: style.display,
      containerRect: container ? container.getBoundingClientRect() : null
    };
  });

  console.log('Result:', JSON.stringify(res, null, 2));
  await browser.close();
}

inspect();
