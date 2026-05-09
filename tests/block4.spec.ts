import { test, expect } from '@playwright/test';
import { executeCommand, startBlock, verifySuccess, selectLesson } from './helpers';

/**
 * B4 initial VFS:
 *   / → README.md, GEMINI.md (empty), src, config
 *   /src → auth.py, main.py
 *   /config/settings.json
 *
 * All "gemini" and REPL commands are intercepted by the B4 interceptor in vfsStore.
 * Sidebar displays title.split(': ')[1] — e.g. "4.1: The Summoning" → "The Summoning"
 */
test.describe('Block 4: The Moment', () => {
  test.beforeEach(async ({ page }) => {
    await startBlock(page, 'Block 4: The Moment');
  });

  // ─── Lesson 4.1: The Summoning ────────────────────────────────────────────
  test('Lesson 4.1: The Summoning — negative then positive', async ({ page }) => {
    await selectLesson(page, 'The Summoning');

    // Negative: plain gemini call without -p summarize doesn't trigger SUMMARY output
    await executeCommand(page, 'gemini "what is this"');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: output must include 'SUMMARY' && history includes 'gemini -p'
    await executeCommand(page, 'cat README.md | gemini -p "summarize this"');
    await verifySuccess(page);
  });

  // ─── Lesson 4.2: Sensory Injection ───────────────────────────────────────
  test('Lesson 4.2: Sensory Injection — negative then positive', async ({ page }) => {
    await selectLesson(page, 'Sensory Injection');

    // Negative: gemini without @ file reference
    await executeCommand(page, 'gemini "explain this"');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: output includes 'AUTH_LOGIC' && history includes '@src/auth.py'
    await executeCommand(page, 'gemini "Explain @src/auth.py"');
    await verifySuccess(page);
  });

  // ─── Lesson 4.3: The Thinking Loop ───────────────────────────────────────
  test('Lesson 4.3: The Thinking Loop — negative then positive', async ({ page }) => {
    await selectLesson(page, 'The Thinking Loop');

    // Negative: regular gemini call doesn't list tools
    await executeCommand(page, 'gemini "list tools"');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: '/tools' interceptor returns output with 'grep' and 'file_write'
    await executeCommand(page, '/tools');
    await verifySuccess(page);
  });

  // ─── Lesson 4.4: The Ghost in the Shell ──────────────────────────────────
  test('Lesson 4.4: The Ghost in the Shell — negative then positive', async ({ page }) => {
    await selectLesson(page, 'The Ghost in the Shell');

    // Negative: plain ls doesn't trigger the VFS_SNAPSHOT output
    await executeCommand(page, 'ls');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: '! ls' interceptor returns 'VFS_SNAPSHOT' && history includes '! ls'
    await executeCommand(page, '! ls');
    await verifySuccess(page);
  });

  // ─── Lesson 4.5: Persistence of Mind ─────────────────────────────────────
  test('Lesson 4.5: Persistence of Mind — negative then positive', async ({ page }) => {
    await selectLesson(page, 'Persistence of Mind');

    // Negative: only saving but not resuming
    await executeCommand(page, '/chat save debug_v1');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: both /chat save AND /chat resume must appear in history
    await executeCommand(page, '/chat resume debug_v1');
    await verifySuccess(page);
  });

  // ─── Lesson 4.6: The Architect's Will ────────────────────────────────────
  test("Lesson 4.6: The Architect's Will — negative then positive", async ({ page }) => {
    await selectLesson(page, "The Architect's Will");

    // Negative: write something without the required content
    await executeCommand(page, 'echo "Always use Bootstrap." > GEMINI.md');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: /GEMINI.md must contain 'Tailwind CSS'
    await executeCommand(page, 'echo "Always use Tailwind CSS." > GEMINI.md');
    await verifySuccess(page);
  });

  // ─── Lesson 4.7: Grounded Reality ────────────────────────────────────────
  test('Lesson 4.7: Grounded Reality — negative then positive', async ({ page }) => {
    await selectLesson(page, 'Grounded Reality');

    // Negative: generic gemini call without Gemini 2.5 query
    await executeCommand(page, 'gemini "What is the weather?"');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: output includes 'SEARCH_RESULTS' && 'Gemini 2.5'
    await executeCommand(page, 'gemini "What are the latest changes in Gemini 2.5?"');
    await verifySuccess(page);
  });

  // ─── Lesson 4.8: The Protocol Layer ──────────────────────────────────────
  test('Lesson 4.8: The Protocol Layer — negative then positive', async ({ page }) => {
    await selectLesson(page, 'The Protocol Layer');

    // Negative: wrong command
    await executeCommand(page, 'gemini "list integrations"');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: '/mcp list' interceptor returns 'Postgres MCP' && 'Slack MCP'
    await executeCommand(page, '/mcp list');
    await verifySuccess(page);
  });

  // ─── Lesson 4.9: The Yolo Threshold ──────────────────────────────────────
  test('Lesson 4.9: The Yolo Threshold — negative then positive', async ({ page }) => {
    await selectLesson(page, 'The Yolo Threshold');

    // Negative: gemini without --yolo flag
    await executeCommand(page, 'gemini "Refactor src/auth.py"');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: output includes 'AUTONOMOUS_EXECUTION' && history includes '--yolo'
    await executeCommand(page, 'gemini --yolo "Refactor src/auth.py"');
    await verifySuccess(page);
  });

  // ─── Lesson 4.10: The Synthesis ───────────────────────────────────────────
  test('Lesson 4.10: The Synthesis — negative then positive', async ({ page }) => {
    await selectLesson(page, 'The Synthesis');

    // Negative: only uses one of the three required elements
    await executeCommand(page, 'gemini "Read @README.md"');
    await expect(
      page.locator('button').filter({ hasText: /Continue to Next Phase|Finish Mission/ })
    ).not.toBeVisible();

    // Positive: combined history must include @README.md, ! git status, --yolo
    await executeCommand(page, '! git status');
    await executeCommand(page, 'gemini "Read @README.md, check ! git status, and refactor in --yolo mode."');
    await verifySuccess(page);
  });
});
