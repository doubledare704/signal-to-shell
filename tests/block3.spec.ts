import { test, expect } from '@playwright/test';
import { executeCommand, startBlock, verifySuccess, selectLesson } from './helpers';

/**
 * B3 initial VFS:
 *   / → main.py, STS.md, logs
 *   /main.py  → "print('Signal Active')"
 *   /STS.md   → "# STS Brain\nPersona: Senior Architect\nConstraint: No external dependencies."
 *   /logs/debug.log → "Error: State mismatch at line 42"
 *
 * Lesson 3.1 uses a special logicChain interceptor in the VFS store.
 * The validator checks: currentLogicStepIdx >= 2 && agentStatus === 'SUCCESS'
 * Required commands in order: 'ls', 'cat main.py', 'cat STS.md'
 */
test.describe('Block 3: Mind Mischief', () => {
  test.beforeEach(async ({ page }) => {
    await startBlock(page, 'Block 3: Mind Mischief');
  });

  // ─── Lesson 3.1: The ReAct Loop ───────────────────────────────────────────
  test('Lesson 3.1: The ReAct Loop — positive (logic chain)', async ({ page }) => {
    await selectLesson(page, 'The ReAct Loop');

    // Step 1: feed the agent 'ls' (required_command for step 1)
    await executeCommand(page, 'ls');
    // Wait for agent to process and advance to next step
    await page.waitForTimeout(2000);

    // Step 2: feed 'cat main.py' (required_command for step 2)
    await executeCommand(page, 'cat main.py');
    await page.waitForTimeout(2000);

    // Step 3: feed 'cat STS.md' (required_command for step 3 — completes the chain)
    await executeCommand(page, 'cat STS.md');

    // currentLogicStepIdx >= 2 && agentStatus === 'SUCCESS'
    await verifySuccess(page);
  });

  test('Lesson 3.1: The ReAct Loop — negative (wrong command breaks chain)', async ({ page }) => {
    await selectLesson(page, 'The ReAct Loop');

    // Wrong first command — interceptor pushes SIGNAL_ERROR and returns early
    await executeCommand(page, 'pwd');
    await expect(page.locator('text=SIGNAL_ERROR')).toBeVisible({ timeout: 5000 });
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();
  });

  // ─── Lesson 3.2: The State Architect ──────────────────────────────────────
  test('Lesson 3.2: The State Architect — negative then positive', async ({ page }) => {
    await selectLesson(page, 'The State Architect');

    // Negative: appending a non-matching section
    await executeCommand(page, 'echo "# Notes\\nSome text" >> STS.md');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: file must include '# Constraints' AND 'Always use recursive logic'
    await executeCommand(page, 'echo "# Constraints\\nAlways use recursive logic for file scanning" >> STS.md');
    await verifySuccess(page);
  });

  // ─── Lesson 3.3: Signal Saturation ───────────────────────────────────────
  test('Lesson 3.3: Signal Saturation — negative then positive', async ({ page }) => {
    await selectLesson(page, 'Signal Saturation');

    // Negative: appending to the file (content not empty)
    await executeCommand(page, 'echo "not empty" >> logs/debug.log');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: overwrite (>) with empty string — file.content === ''
    await executeCommand(page, 'echo "" > logs/debug.log');
    await verifySuccess(page);
  });

  // ─── Lesson 3.4: The Reflection Protocol ─────────────────────────────────
  test('Lesson 3.4: The Reflection Protocol — negative then positive', async ({ page }) => {
    await selectLesson(page, 'The Reflection Protocol');

    // Negative: cat does not satisfy the grep validator
    await executeCommand(page, 'cat main.py');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: last input must include 'grep' AND 'main.py'
    await executeCommand(page, 'grep print main.py');
    await verifySuccess(page);
  });

  // ─── Lesson 3.5: Few-Shot Architectures ──────────────────────────────────
  test('Lesson 3.5: Few-Shot Architectures — negative then positive', async ({ page }) => {
    await selectLesson(page, 'Few-Shot Architectures');

    // Negative: section exists but missing required content
    await executeCommand(page, 'echo "# Patterns\\nRandom text" >> STS.md');
    await expect(
      page.locator('button').filter({ hasText: /Continue to Next Phase/ })
    ).not.toBeVisible();

    // Positive: must include '# Patterns' AND 'Perfect API Endpoint'
    await executeCommand(page, 'echo "# Patterns\\nPerfect API Endpoint" >> STS.md');
    await verifySuccess(page);
  });
});
