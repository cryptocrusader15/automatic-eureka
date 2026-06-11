import { test, expect } from '@playwright/test'

test('admin CSV import updates product list', async ({ page }) => {
  await page.goto('/admin')

  const csv = 'title,price,sku,category,image,description\nPlaywright Test Machine,1234,PTM-1,Tests,/images/press.jpg,Imported via E2E'

  const fileInput = page.locator('input[type="file"][accept="text/csv"]')
  await fileInput.setInputFiles({ name: 'products.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) })

  // wait for the admin code to POST and for products to propagate
  await page.waitForTimeout(500)

  await page.goto('/products')
  await expect(page.locator('text=Playwright Test Machine')).toHaveCount(1)
})
