from playwright.sync_api import sync_playwright
import json

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={'width': 1600, 'height': 900})
    page.goto('http://localhost:5173/')
    page.wait_for_timeout(2500)

    # Scroll to bottom
    page.evaluate('window.scrollTo(0, document.documentElement.scrollHeight - window.innerHeight)')
    page.wait_for_timeout(600)

    js_code = '''
    () => {
        const el = document.querySelector('a[href*="mailto"]');
        if (!el) return { error: 'Not found' };
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const contactSection = el.closest('section');
        const sRect = contactSection ? contactSection.getBoundingClientRect() : null;
        return {
            email_top: rect.top,
            email_bottom: rect.bottom,
            email_left: rect.left,
            email_height: rect.height,
            email_color: style.color,
            section_top: sRect ? sRect.top : null,
            section_bottom: sRect ? sRect.bottom : null,
            scrollY: window.scrollY
        };
    }
    '''
    res = page.evaluate(js_code)
    print('DOM Inspection:', json.dumps(res, indent=2))
    browser.close()
