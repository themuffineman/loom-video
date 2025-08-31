import re
from playwright.sync_api import sync_playwright, expect

def test_has_title(page):
    page.goto("https://playwright.dev/")
    expect(page).to_have_title(re.compile("Playwright"))

def test_get_started_link(page):
    page.goto("https://playwright.dev/")
    page.get_by_role("link", name="Get started").click()
    expect(page.get_by_role("heading", name="Installation")).to_be_visible()

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # headless=False to see the browser
        page = browser.new_page()
        test_has_title(page)
        test_get_started_link(page)
        browser.close()
