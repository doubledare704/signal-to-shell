import { test, expect } from '@playwright/test';
import { executeCommand, startBlock, verifySuccess, selectLesson } from './helpers';

test.describe('Block 5: Tomorrow\'s Dust', () => {
  test.beforeEach(async ({ page }) => {
    await startBlock(page, 'Block 5: Tomorrow\'s Dust');
  });

  test('Lesson 5.1: The Discovery Layer — positive', async ({ page }) => {
    await selectLesson(page, 'The Discovery Layer');
    // Logic Chain: 3 steps
    await executeCommand(page, 'gemini mcp list');
    await page.waitForTimeout(500);
    await executeCommand(page, 'gemini mcp add sqlite');
    await page.waitForTimeout(500);
    await executeCommand(page, 'gemini "List the tables in database.sqlite"');
    await verifySuccess(page);
  });

  test('Lesson 5.2: The Architect\'s Hand — positive', async ({ page }) => {
    await selectLesson(page, 'The Architect\'s Hand');
    await executeCommand(page, 'mkdir .gemini');
    await executeCommand(page, 'echo "system-monitor" > .gemini/settings.json');
    await executeCommand(page, 'gemini "Audit system load"');
    await verifySuccess(page);
  });

  test('Lesson 5.3: The Planning Pattern — positive', async ({ page }) => {
    await selectLesson(page, 'The Planning Pattern');
    await executeCommand(page, 'gemini "Create a PLAN.md for refactoring app.py then wait for my signal."');
    await verifySuccess(page);
  });

  test('Lesson 5.4: The Hive Mind — positive', async ({ page }) => {
    await selectLesson(page, 'The Hive Mind');
    // Logic Chain: 2 steps
    await executeCommand(page, 'gemini "Spawn a sub-agent to audit /logs/crash.log and report the error"');
    await page.waitForTimeout(500);
    await executeCommand(page, 'gemini --yolo "Sub-agent Fixer: Use the Scout\'s report to fix app.py"');
    await verifySuccess(page);
  });

  test('Lesson 5.5: Sensory Overload — positive', async ({ page }) => {
    await selectLesson(page, 'Sensory Overload');
    await executeCommand(page, '/compress');
    await verifySuccess(page);
  });

  test('Lesson 5.6: The Safety Brake — positive', async ({ page }) => {
    await selectLesson(page, 'The Safety Brake');
    await executeCommand(page, 'echo "excludeTools: [\\"terminal\\"]" >> GEMINI.md');
    await verifySuccess(page);
  });

  test('Lesson 5.7: Observability — positive', async ({ page }) => {
    await selectLesson(page, 'Observability');
    await executeCommand(page, '/stats');
    await verifySuccess(page);
  });

  test('Lesson 5.8: The Self-Healing State — positive', async ({ page }) => {
    await selectLesson(page, 'The Self-Healing State');
    // Logic Chain: 3 steps
    await executeCommand(page, 'tail -n 2 logs/system.log');
    await page.waitForTimeout(500);
    await executeCommand(page, 'tail -n 2 logs/system.log | gemini --yolo "Fix the error in server.py based on this log"');
    await page.waitForTimeout(500);
    await executeCommand(page, 'python server.py');
    await verifySuccess(page);
  });

  test('Lesson 5.9: Fleet Management — positive', async ({ page }) => {
    await selectLesson(page, 'Fleet Management');
    await executeCommand(page, 'mkdir -p src/frontend');
    await executeCommand(page, 'mkdir -p src/backend');
    await executeCommand(page, 'echo "React" > src/frontend/GEMINI.md');
    await executeCommand(page, 'echo "Python" > src/backend/GEMINI.md');
    await verifySuccess(page);
  });

  test('Lesson 5.10: The Architect\'s Legacy — positive', async ({ page }) => {
    await selectLesson(page, 'The Architect\'s Legacy');
    // Logic Chain: 3 steps
    await executeCommand(page, 'gemini "Plan the SaaS architecture using @GEMINI.md"');
    await page.waitForTimeout(500);
    await executeCommand(page, 'gemini mcp add cloud-run');
    await page.waitForTimeout(500);
    await executeCommand(page, 'gemini --yolo "Execute the build and deploy to @infra/deploy.sh via cloud-run MCP"');
    await verifySuccess(page);
    
    // Verify Ascension Overlay
    await expect(page.locator('text=Nexus Ascension')).toBeVisible({ timeout: 10000 });
  });
});
