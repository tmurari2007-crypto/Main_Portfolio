from playwright.sync_api import sync_playwright
import json

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome_path, headless=True)
    page = browser.new_page(viewport={'width': 1600, 'height': 900})
    page.goto('http://localhost:5173/')
    page.wait_for_timeout(2500)
    page.evaluate('window.scrollTo(0, 16290)')
    page.wait_for_timeout(600)
    
    js_code = """
    () => {
        const email = document.querySelector('a[data-cursor="Write"]');
        if (!email) return 'Email link not found!';
        const inner = email.closest('.sticky');
        const front = email.closest('[style*="opacity"]');
        return {
            emailText: email.innerText,
            emailRect: email.getBoundingClientRect(),
            emailComputedStyle: {
                color: window.getComputedStyle(email).color,
                opacity: window.getComputedStyle(email).opacity,
                display: window.getComputedStyle(email).display,
                visibility: window.getComputedStyle(email).visibility,
                zIndex: window.getComputedStyle(email).zIndex
            },
            innerRect: inner ? inner.getBoundingClientRect() : null,
            frontStyle: front ? front.getAttribute('style') : null
        };
    }
    """
    res = page.evaluate(js_code)
    print('Email debug:', json.dumps(res, indent=2))
    browser.close()
