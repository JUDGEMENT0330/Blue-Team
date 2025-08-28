from playwright.sync_api import sync_playwright, expect, Page

def run_verification(page: Page):
    base_url = "http://localhost:5173"

    # Register
    page.goto(f"{base_url}/register")
    page.get_by_label("Username").fill("admin")
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Register").click()

    # Wait for success message and take screenshot
    success_message = page.locator("text=Admin user created successfully!")
    expect(success_message).to_be_visible(timeout=15000)
    page.screenshot(path="jules-scratch/verification/register_success.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_verification(page)
        browser.close()
