import { Page, expect } from '@playwright/test';

/**
 * Types a command into the terminal input and submits it.
 * The terminal input has no id/name; matched by type="text" (password in authMode).
 */
export async function executeCommand(page: Page, command: string) {
  const input = page.locator('input[type="text"]').first();
  // Ensure it's not just visible but also attached and stable
  await input.waitFor({ state: 'visible', timeout: 10000 });
  await input.fill(command);
  await input.press('Enter');
}

/**
 * Clicks "Proceed to Next Node" or "Continue to Next Phase" once it appears.
 * These only render after DecryptText animation completes inside the Sidebar.
 */
export async function nextLesson(page: Page) {
  const btn = page.locator('button').filter({
    hasText: /Proceed to Next Node|Continue to Next Phase/,
  }).first();
  await expect(btn).toBeVisible({ timeout: 10000 });
  await btn.click({ force: true });
}

/**
 * Navigates to '/', clears persisted Zustand state, then enters the given block.
 *
 * Block cards live in Dashboard (the flex-1 right panel inside <main>).
 * Each card is a clickable div whose h3 shows block.title (e.g. "Block 1: Expectation").
 *
 * After clicking, waits for the terminal input to appear (lesson view loaded).
 */
export async function startBlock(page: Page, blockTitle: string) {
  await page.goto('/');

  // Wipe Zustand persistence and set maxLessonIdx to 99 so all lessons are unlocked
  await page.evaluate(() => {
    Object.keys(localStorage).forEach((k) => localStorage.removeItem(k));
    Object.keys(sessionStorage).forEach((k) => sessionStorage.removeItem(k));
    
    // Pre-seed the store with unlocked state
    const lessonState = {
      state: {
        currentLessonIdx: 0,
        maxLessonIdx: 99,
        completedLessonIds: [],
        currentTaskIdx: 0,
        view: 'dashboard',
        currentBlockId: 'B1'
      },
      version: 0
    };
    localStorage.setItem('signal-shell-lesson', JSON.stringify(lessonState));
  });
  
  // Reload to apply the local storage changes
  await page.reload({ waitUntil: 'domcontentloaded' });

  // Wait for the dashboard to be fully rendered (deployment phases header)
  await expect(
    page.locator('h2').filter({ hasText: 'Deployment_Phases' })
  ).toBeVisible({ timeout: 10000 });

  // Small delay to allow dashboard animations to settle
  await page.waitForTimeout(300);

  // Block card: find the h3 with the block title and click its parent or itself
  const blockCard = page.locator('h3').filter({ hasText: blockTitle }).first();
  await expect(blockCard).toBeVisible({ timeout: 10000 });
  
  // Force click because of potential CRT/Scanline overlays
  await blockCard.click({ force: true });

  // Wait until the terminal view is active (input visible)
  await expect(
    page.locator('input[type="text"]').first()
  ).toBeVisible({ timeout: 10000 });
}

/**
 * Asserts that the lesson success buttons are visible.
 * They only appear after the DecryptText animation finishes.
 */
export async function verifySuccess(page: Page) {
  await expect(
    page.locator('button').filter({
      hasText: /Proceed to Next Node|Continue to Next Phase|Finish Mission/,
    }).first()
  ).toBeVisible({ timeout: 10000 });
}

/**
 * Selects a lesson from the sidebar lesson list.
 *
 * The Sidebar renders as: <div class="w-full md:w-1/3 flex flex-col ...">
 * Lesson items display `lesson.title.split(': ')[1] || lesson.title`.
 *
 * @param lessonDisplayTitle - the text as it appears in the sidebar (after the ': ' split)
 */
export async function selectLesson(page: Page, lessonDisplayTitle: string) {
  // The sidebar is the first child div of <main> (w-1/3)
  const sidebar = page.locator('main > div').first();

  const lessonItem = sidebar.getByText(lessonDisplayTitle, { exact: false }).last();
  await expect(lessonItem).toBeVisible({ timeout: 10000 });
  await lessonItem.click({ force: true });

  // Wait until the terminal input is ready
  await expect(
    page.locator('input[type="text"]').first()
  ).toBeVisible({ timeout: 10000 });

  // Allow brief time for any state sync or animations to settle
  await page.waitForTimeout(300);
}
