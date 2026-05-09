import { test, expect } from '@playwright/test';
import { executeCommand, startBlock, verifySuccess, selectLesson } from './helpers';

test.describe('Block 1: Expectation', () => {
  test.beforeEach(async ({ page }) => {
    await startBlock(page, 'Block 1: Expectation');
  });

  // ─── Lesson 1: pwd ────────────────────────────────────────────────────────
  test("Lesson 1: The 'pwd' Command — negative then positive", async ({ page }) => {
    await selectLesson(page, "The 'pwd' Command");

    // Negative: wrong command should not trigger success
    await executeCommand(page, 'ls');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: pwd output must be '/'
    await executeCommand(page, 'pwd');
    await verifySuccess(page);
  });

  // ─── Lesson 2: ls ─────────────────────────────────────────────────────────
  test("Lesson 2: The 'ls' Command — negative then positive", async ({ page }) => {
    await selectLesson(page, "The 'ls' Command");

    // Negative: a command that is not 'ls'
    await executeCommand(page, 'echo hello');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: last input must end with '> ls'
    await executeCommand(page, 'ls');
    await verifySuccess(page);
  });

  // ─── Lesson 3: cd ─────────────────────────────────────────────────────────
  test("Lesson 3: The 'cd' Command — negative then positive", async ({ page }) => {
    await selectLesson(page, "The 'cd' Command");

    // Negative: non-existent directory
    await executeCommand(page, 'cd non-existent');
    await expect(page.locator('text=cd: no such directory: non-existent')).toBeVisible();
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: currentPath must become '/cyber-nexus'
    await executeCommand(page, 'cd cyber-nexus');
    await verifySuccess(page);
  });

  // ─── Lesson 4: mkdir ──────────────────────────────────────────────────────
  test("Lesson 4: The 'mkdir' Command — negative then positive", async ({ page }) => {
    await selectLesson(page, "The 'mkdir' Command");

    // Setup: navigate into cyber-nexus (VFS starts at '/')
    await executeCommand(page, 'cd cyber-nexus');

    // Negative: 'ls' does not create a directory
    await executeCommand(page, 'ls');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: vfs['/cyber-nexus/logs'].type === 'dir'
    await executeCommand(page, 'mkdir logs');
    await verifySuccess(page);
  });

  // ─── Lesson 5: touch ──────────────────────────────────────────────────────
  test("Lesson 5: The 'touch' Command — positive", async ({ page }) => {
    await selectLesson(page, "The 'touch' Command");

    // Setup: create the logs directory first (not in initial B1 VFS)
    await executeCommand(page, 'cd cyber-nexus');
    await executeCommand(page, 'mkdir logs');

    // Task 1: navigate into logs (currentPath === '/cyber-nexus/logs')
    await executeCommand(page, 'cd logs');

    // Negative: wrong file name should not satisfy validation
    await executeCommand(page, 'touch wrong-file.txt');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Task 2: create the required file
    await executeCommand(page, 'touch session.log');
    await verifySuccess(page);
  });

  // ─── Lesson 6: rm ─────────────────────────────────────────────────────────
  test("Lesson 6: The 'rm' Command — positive", async ({ page }) => {
    await selectLesson(page, "The 'rm' Command");

    // Setup: create directory structure and the file to remove
    await executeCommand(page, 'cd cyber-nexus');
    await executeCommand(page, 'mkdir logs');
    await executeCommand(page, 'cd logs');
    await executeCommand(page, 'touch session.log');

    // Negative: a different rm does not satisfy the exact validator
    await executeCommand(page, 'rm wrong-file.txt');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Positive: vfs['/cyber-nexus/logs/session.log'] === undefined AND last input includes 'rm session.log'
    await executeCommand(page, 'touch session.log'); // recreate
    await executeCommand(page, 'rm session.log');
    await verifySuccess(page);
  });

  // ─── Lesson 7: cp ─────────────────────────────────────────────────────────
  test("Lesson 7: The 'cp' Command — positive", async ({ page }) => {
    await selectLesson(page, "The 'cp' Command");

    // Task 1: navigate to root (currentPath === '/')
    await executeCommand(page, 'cd /');

    // Negative: cp with wrong args doesn't create the required file
    await executeCommand(page, 'cp README.md tmp.md');
    await expect(
      page.locator('button').filter({ hasText: /Proceed to Next Node/ })
    ).not.toBeVisible();

    // Task 2: copy to the required destination (vfs['/README-backup.md'].type === 'file')
    await executeCommand(page, 'cp README.md README-backup.md');
    await verifySuccess(page);
  });

  // ─── Lesson 8: mv ─────────────────────────────────────────────────────────
  test("Lesson 8: The 'mv' Command — positive", async ({ page }) => {
    await selectLesson(page, "The 'mv' Command");

    // Setup: create README-backup.md at root
    await executeCommand(page, 'cd /');
    await executeCommand(page, 'cp README.md README-backup.md');

    // Positive: vfs['/README-old.md'].type === 'file' AND vfs['/README-backup.md'] === undefined
    await executeCommand(page, 'mv README-backup.md README-old.md');
    await verifySuccess(page);
  });
});
