import { test, expect } from '@playwright/test';
import { executeCommand, startBlock, verifySuccess, selectLesson } from './helpers';

test.describe('Block 7: Apocalypse Dreams', () => {
  test.beforeEach(async ({ page }) => {
    await startBlock(page, 'Block 7: Apocalypse Dreams');
  });

  test('Lesson 7.1: The API Gateway — positive', async ({ page }) => {
    await selectLesson(page, 'The API Gateway');
    await executeCommand(page, 'curl -X POST /signal -d \'{"query":"audit logs"}\'');
    await expect(page.getByText('gemini -p "audit logs"', { exact: false })).toBeVisible();
    await verifySuccess(page);
  });

  test('Lesson 7.2: Streamed Consciousness — positive', async ({ page }) => {
    await selectLesson(page, 'Streamed Consciousness');
    await executeCommand(page, 'curl -N /signal/stream');
    await expect(page.getByText('event: thought', { exact: false })).toBeVisible();
    await verifySuccess(page);
  });

  test('Lesson 7.3: Strict State — positive', async ({ page }) => {
    await selectLesson(page, 'Strict State');
    await executeCommand(page, 'echo "class AgentResponse(BaseModel): action: str reason: str" > app/schemas.py');
    await executeCommand(page, 'curl -X POST /signal/strict -d \'{"mode":"malformed"}\'');
    await expect(page.getByText('422 Unprocessable Entity', { exact: false }).last()).toBeVisible();
    await verifySuccess(page);
  });

  test('Lesson 7.4: Environment Identity — positive', async ({ page }) => {
    await selectLesson(page, 'Environment Identity');
    await executeCommand(page, 'ENV=prod ./scripts/startup.sh');
    await expect(page.getByText('IDENTITY_CONFIRMED: Production Service Agent', { exact: false })).toBeVisible();
    await verifySuccess(page);
  });

  test('Lesson 7.5: The Async Worker — positive', async ({ page }) => {
    await selectLesson(page, 'The Async Worker');
    await executeCommand(page, 'curl -X POST /tasks/self-heal');
    await expect(page.getByText('202 Accepted', { exact: false }).last()).toBeVisible();
    await expect(page.getByText('WORKER_LOG', { exact: false }).last()).toBeVisible();
    await verifySuccess(page);
  });

  test('Lesson 7.6: The Security Perimeter — positive', async ({ page }) => {
    await selectLesson(page, 'The Security Perimeter');
    await executeCommand(page, 'echo "app.add_middleware(CORSMiddleware, allow_origins=[\\"http://localhost:5173\\"])" >> app/main.py');
    await executeCommand(page, 'curl -X OPTIONS /signal -H "Origin: http://localhost:5173"');
    await expect(page.getByText('Access-Control-Allow-Origin: http://localhost:5173', { exact: false })).toBeVisible();
    await verifySuccess(page);
  });

  test('Lesson 7.7: The Locked Nexus — positive', async ({ page }) => {
    await selectLesson(page, 'The Locked Nexus');
    await executeCommand(page, 'echo "API_KEY_HEADER = APIKeyHeader(name=\'X-API-Key\')" >> app/main.py');
    await expect(page.getByText('curl -X POST /signal', { exact: false }).last()).toBeVisible({ timeout: 10000 });
    await executeCommand(page, 'curl -X POST /signal');
    await expect(page.getByText('401 Unauthorized', { exact: false }).last()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("X-API-Key: wrong", { exact: false }).last()).toBeVisible({ timeout: 10000 });
    await executeCommand(page, 'curl -X POST /signal -H \'X-API-Key: wrong\'');
    await expect(page.getByText('403 Forbidden', { exact: false }).last()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('AUTH_ENFORCED', { exact: false })).toBeVisible({ timeout: 10000 });
    await verifySuccess(page);
  });

  test('Lesson 7.8: Containerized Logic — positive', async ({ page }) => {
    await selectLesson(page, 'Containerized Logic');
    await executeCommand(page, 'echo "FROM python:3.12-slim\nRUN npm install -g @google/gemini-cli\nCOPY STS.md /app/STS.md\nUSER 10001" > Dockerfile');
    await executeCommand(page, 'judge Dockerfile');
    await expect(page.getByText('DOCKERFILE_VALID', { exact: false })).toBeVisible();
    await verifySuccess(page);
  });

  test('Lesson 7.9: The Cloud Run Nexus — positive', async ({ page }) => {
    await selectLesson(page, 'The Cloud Run Nexus');
    await executeCommand(page, 'gcloud run deploy nexus-agent --set-secrets GEMINI_API_KEY=gemini-api-key:latest');
    await expect(page.getByText('SERVICE_LIVE', { exact: false })).toBeVisible();
    await verifySuccess(page);
  });

  test('Lesson 7.10: The Apocalypse — positive', async ({ page }) => {
    await selectLesson(page, 'The Apocalypse');
    await executeCommand(page, 'python chaos.py --requests 10');
    await expect(page.getByText('AUTONOMOUS_IN_THE_WILD', { exact: false })).toBeVisible();
    await verifySuccess(page);
  });
});
