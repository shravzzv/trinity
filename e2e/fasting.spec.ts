import { expect, test } from '@playwright/test'

test.describe('Fasting', () => {
  test('user can start a fast', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: /Track your fasts/i }),
    ).toBeVisible()

    await page
      .getByRole('link', { name: /get started/i })
      .first()
      .click()
    await expect(page).toHaveURL(/\/home/)

    await page.getByRole('button', { name: /select plan/i }).click()
    await page.getByRole('radio', { name: /23:1/i }).check()
    await page.getByRole('button', { name: /^save$/i }).click()

    await page.getByRole('button', { name: /start fasting/i }).click()

    await expect(page.getByText(/^fasting$/i)).toBeVisible()
    await expect(page.getByText(/23:1/i)).toBeVisible()
    await expect(page.getByRole('progressbar')).toBeVisible()
    await expect(
      page.getByRole('button', { name: /end fasting/i }),
    ).toBeVisible()

    await page.reload()

    await expect(page).toHaveURL(/\/home/)
    await expect(page.getByText(/^fasting$/i)).toBeVisible()
    await expect(page.getByText(/23:1/i)).toBeVisible()
  })

  test('user can end a fast', async ({ page }) => {
    await page.goto('/home')

    await page.getByRole('button', { name: /select plan/i }).click()
    await page.getByRole('radio', { name: /23:1/i }).check()
    await page.getByRole('button', { name: /^save$/i }).click()

    await page.getByRole('button', { name: /start fasting/i }).click()

    await expect(
      page.getByRole('button', { name: /end fasting/i }),
    ).toBeVisible()

    await page.getByRole('button', { name: /end fasting/i }).click()
    // In the confirmation dialog
    await page.getByRole('button', { name: /end fasting/i }).click()

    // Verify that the active fast has ended.
    await expect(
      page.getByRole('button', { name: /end fasting/i }),
    ).not.toBeVisible()

    await expect(page.getByText(/^eating$/i)).toBeVisible()
    await expect(page.getByText(/23:1/i)).toBeVisible()
    await expect(
      page.getByRole('button', { name: /start fasting/i }),
    ).toBeVisible()
  })
})
