import { test, expect } from '@playwright/test';
import { executeCommand, startBlock, verifySuccess, selectLesson } from './helpers';

/**
 * B5 initial VFS:
 *   / → README.md, src, logs, mcp_config.json
 *   /src → app.py
 *   /logs → error.log
 *
 * All commands are intercepted by the B5 interceptor in vfsStore.
 */
test.describe('Block 5: Tomorrow\'s Dust', () => {
  test.beforeEach(async ({ page }) => {
    await startBlock(page, 'Block 5: Tomorrow\'s Dust');
  });

  // ─── Lesson 5.1: The MCP Server ───────────────────────────────────────────
  test('Lesson 5.1: The MCP Server — positive', async ({ page }) => {
    await selectLesson(page, 'The MCP Server');

    // Positive: '/mcp connect sqlite://db.sqlite' interceptor returns 'CONNECTED'
    await executeCommand(page, '/mcp connect sqlite://db.sqlite');
    await verifySuccess(page);
  });

  // ─── Lesson 5.2: Autonomous Mode ──────────────────────────────────────────
  test('Lesson 5.2: Autonomous Mode — positive', async ({ page }) => {
    await selectLesson(page, 'Autonomous Mode');

    // Positive: 'gemini --autonomous "..."' interceptor returns 'AUTONOMOUS_LOOP'
    await executeCommand(page, 'gemini --autonomous "Fix any errors in logs/error.log"');
    await verifySuccess(page);
  });

  // ─── Lesson 5.3: Mastery of State ──────────────────────────────────────────
  test('Lesson 5.3: Mastery of State — positive', async ({ page }) => {
    await selectLesson(page, 'Mastery of State');

    // Positive: 'sts-reset' returns 'SYSTEM RESET COMPLETE'
    await executeCommand(page, 'sts-reset');
    await verifySuccess(page);
  });
});
