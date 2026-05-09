import { test, expect } from '@playwright/test';
import { executeCommand, startBlock, verifySuccess, selectLesson } from './helpers';

/**
 * B2 initial VFS:
 *   / → README.md, src, legacy, MIGRATION.md, system.log
 *   /legacy → user-model.py, api-v1.py
 *   /src/app/routes/api.py  (11 lines)
 *   /system.log  (6 lines: 3× INFO, 3× ERROR_404)
 */
test.describe('Block 2: Let It Happen', () => {
  test.beforeEach(async ({ page }) => {
    await startBlock(page, 'Block 2: Let It Happen');
  });

  // ─── Lesson 2.1: Sensory Input ────────────────────────────────────────────
  test('Lesson 2.1: Sensory Input — negative then positive', async ({ page }) => {
    await selectLesson(page, 'Sensory Input');

    // Negative: ls -R does not include 'api.py' in pipe context + wc -l — fails validator
    await executeCommand(page, 'ls -R /src');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: isPipe && isTarget(api.py) && correctCount(11)
    await executeCommand(page, 'cat /src/app/routes/api.py | wc -l');
    await verifySuccess(page);
  });

  // ─── Lesson 2.2: Structural Integrity ────────────────────────────────────
  test('Lesson 2.2: Structural Integrity — positive', async ({ page }) => {
    await selectLesson(page, 'Structural Integrity');

    // Create target directory structure
    await executeCommand(page, 'mkdir -p /core/models /core/api');

    // Move legacy files to new locations
    await executeCommand(page, 'mv /legacy/user-model.py /core/models/user.py');
    await executeCommand(page, 'mv /legacy/api-v1.py /core/api/v1.py');

    // Validator: hasUser(/core/models/user.py) && hasApi(/core/api/v1.py) && legacyEmpty
    await verifySuccess(page);
  });

  // ─── Lesson 2.3: Noise Reduction ──────────────────────────────────────────
  test('Lesson 2.3: Noise Reduction — negative then positive', async ({ page }) => {
    await selectLesson(page, 'Noise Reduction');

    // Negative: just grep without sort and redirect does not create the file
    await executeCommand(page, 'grep ERROR_404 system.log');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: file /distilled_errors.log must exist with sorted ERROR_404 lines (3 lines)
    await executeCommand(page, 'grep ERROR_404 system.log | sort > distilled_errors.log');
    await verifySuccess(page);
  });

  // ─── Lesson 2.4: Pattern Recognition ─────────────────────────────────────
  test('Lesson 2.4: Pattern Recognition — negative then positive', async ({ page }) => {
    await selectLesson(page, 'Pattern Recognition');

    // Negative: case-sensitive grep will miss 'error' → fewer results, fails output check
    await executeCommand(page, 'grep ERROR system.log');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: grep -i finds all case variants; output must include ERROR_404 ≥ 3 lines
    await executeCommand(page, 'grep -i error system.log');
    await verifySuccess(page);
  });

  // ─── Lesson 2.5: Recursive Audit ─────────────────────────────────────────
  test('Lesson 2.5: Recursive Audit — negative then positive', async ({ page }) => {
    await selectLesson(page, 'Recursive Audit');

    // Negative: non-recursive grep doesn't satisfy the isRecursive check
    await executeCommand(page, 'grep "API v1" /src/app/routes/api.py');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: grep -r checks isRecursive=true && output includes /src/app/routes/api.py
    await executeCommand(page, 'grep -r "API v1" /src');
    await verifySuccess(page);
  });
});
