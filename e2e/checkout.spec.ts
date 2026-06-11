import { test, expect } from '@playwright/test'

test('checkout flow uses API and navigates to success', async ({ page }) => {
  await page.goto('/products')
  await page.waitForSelector('article')
  await page.locator('button[data-test="add-to-cart"]').first().click()

  // intercept checkout API to avoid real Stripe call
  await page.route('**/api/checkout', route => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ url: '/checkout-success?session_id=mock' }) })
  })

  await page.goto('/cart')
  await page.click('button:has-text("Checkout")')

  await page.waitForURL('**/checkout-success**')
  await expect(page).toHaveURL(/checkout-success/)
})
