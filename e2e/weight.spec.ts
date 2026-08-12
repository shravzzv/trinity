import { expect, test } from '@playwright/test'

test.describe('Weight', () => {
  test('user can add a weight entry', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: /Track your fasts/i }),
    ).toBeVisible()
    await page
      .getByRole('link', { name: /get started/i })
      .first()
      .click()

    await expect(page).toHaveURL(/\/home/)

    // Open the add-weight dialog.
    await page.getByRole('button', { name: /add weight/i }).click()

    await expect(
      page.getByRole('heading', { name: /^add weight$/i }),
    ).toBeVisible()

    // Enter the weight.
    const weightInput = page.getByRole('spinbutton', {
      name: /^weight$/i,
    })

    await weightInput.fill('61.5')

    // Save the entry.
    await page.getByRole('button', { name: /^save$/i }).click()

    // Verify that the new weight appears in the UI.
    await expect(page.getByText('61.5 kg').first()).toBeVisible()

    // Verify that it persists after a reload.
    await page.reload()

    await expect(page.getByText('61.5 kg').first()).toBeVisible()
  })
})
