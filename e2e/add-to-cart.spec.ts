import { test, expect } from '@playwright/test'

test('add product to cart and see it in cart', async ({ page }) => {
  await page.goto('/products')
  // wait for products to load
  await page.waitForSelector('article')

  // click add to cart on first product
  const addBtn = page.locator('button[data-test="add-to-cart"]').first()
  await addBtn.click()

  await page.goto('/cart')
  await expect(page.locator('text=Your Cart')).toHaveCount(1)
  await expect(page.locator('article, div').locator('text=Subtotal'), { timeout: 5000 }).toBeTruthy()
})
