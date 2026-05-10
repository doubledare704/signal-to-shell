import { test, expect } from '@playwright/test';
import { executeCommand, startBlock, verifySuccess, selectLesson } from './helpers';

test.describe('Block 6: The Less I Know The Better', () => {
  test.beforeEach(async ({ page }) => {
    await startBlock(page, 'Block 6: The Less I Know The Better');
  });

  test('Lesson 6.1: Semantic Math — positive', async ({ page }) => {
    await selectLesson(page, 'Semantic Math');
    await executeCommand(page, 'gemini embed "def finalize_order():"');
    await verifySuccess(page);
  });

  test('Lesson 6.2: The Vector Vault — positive', async ({ page }) => {
    await selectLesson(page, 'The Vector Vault');
    await executeCommand(page, 'gemini mcp call supabase "CREATE EXTENSION vector;"');
    await verifySuccess(page);
  });

  test('Lesson 6.3: Fragmenting the State — positive', async ({ page }) => {
    await selectLesson(page, 'Fragmenting the State');
    await executeCommand(page, 'echo "chunk_size=500\nchunk_overlap=50" > chunker.py');
    await executeCommand(page, 'python chunker.py');
    await verifySuccess(page);
  });

  test('Lesson 6.4: The Retrieval Protocol — positive', async ({ page }) => {
    await selectLesson(page, 'The Retrieval Protocol');
    await executeCommand(page, 'gemini mcp call supabase "SELECT chunk_id FROM vectors ORDER BY embedding <=> embed(\'refunds\') LIMIT 1;"');
    await verifySuccess(page);
  });

  test('Lesson 6.5: Long-Term Memory — positive', async ({ page }) => {
    await selectLesson(page, 'Long-Term Memory');
    await executeCommand(page, 'gemini --session-id "user_oleksii" "Save this session to the vault"');
    await executeCommand(page, 'gemini --session-id "user_oleksii" "What did we talk about yesterday?"');
    await verifySuccess(page);
  });

  test('Lesson 6.6: The Hybrid Decision — positive', async ({ page }) => {
    await selectLesson(page, 'The Hybrid Decision');
    await executeCommand(page, 'echo "{\\"vault_threshold\\": 0.8, \\"prompt_threshold\\": 0.2}" > routing_policy.json');
    await verifySuccess(page);
  });

  test('Lesson 6.7: The Automated Watcher — positive', async ({ page }) => {
    await selectLesson(page, 'The Automated Watcher');
    // Logic Chain: 2 steps
    await executeCommand(page, 'echo "# vector-indexed" >> src/app.py');
    await page.waitForTimeout(500);
    await executeCommand(page, 'gemini mcp call supabase "UPDATE vectors SET embedding = re_embed(app_py) WHERE source = \'src/app.py\';"');
    await verifySuccess(page);
  });

  test('Lesson 6.8: The Semantic Prune — positive', async ({ page }) => {
    await selectLesson(page, 'The Semantic Prune');
    await executeCommand(page, 'gemini mcp call supabase "SELECT chunk_id, version FROM vectors WHERE source = \'api_docs\' ORDER BY version;"');
    await executeCommand(page, 'gemini mcp call supabase "DELETE FROM vectors WHERE source = \'api_docs\' AND version < 3;"');
    await executeCommand(page, 'gemini mcp call supabase "SELECT COUNT(*) FROM vectors WHERE source = \'api_docs\';"');
    await verifySuccess(page);
  });
});
