import 'dotenv/config';
import { fetchJson } from './clients/baseClient';
import { fetchWithRetry } from './clients/retryClient';
import { withAuth, withApiKey } from './auth/helpers';
import { oauthClient } from './auth/oauth';
import { withRequestId } from './resilience/observability';
import { globalCircuitBreaker } from './resilience/circuitBreaker';
import { withIdempotency } from './utils/idempotency';
import { logger } from './utils/logger';

const PUBLIC_API = 'https://httpbin.org/get';

async function main() {
  logger.info('Integration Drills Demo');

  logger.info('--- Drill 1: fetchJson with timeout ---');
  try {
    const data = await fetchJson<{ url: string }>(PUBLIC_API);
    logger.info({ url: data.url }, 'Drill 1 OK');
  } catch (err: any) {
    logger.error({ err: err.message }, 'Drill 1 error');
  }

  logger.info('--- Drill 2: fetchWithRetry ---');
  try {
    const data = await fetchWithRetry<{ url: string }>(PUBLIC_API, {}, { maxRetries: 2 });
    logger.info({ url: data.url }, 'Drill 2 OK');
  } catch (err: any) {
    logger.error({ err: err.message }, 'Drill 2 error');
  }

  logger.info('--- Drill 3: Authentication ---');
  const token = await oauthClient.getToken();
  logger.info({ token: token.slice(0, 30) + '...' }, 'OAuth2 token acquired');

  const authedOptions = withAuth(withRequestId(), token);
  try {
    const data = await fetchJson<{ headers: Record<string, string> }>(PUBLIC_API, authedOptions);
    logger.info(
      { authorization: data.headers['Authorization']?.slice(0, 20) + '...' },
      'Drill 3 OK'
    );
  } catch (err: any) {
    logger.error({ err: err.message }, 'Drill 3 error');
  }

  logger.info('--- Drill 4: Circuit Breaker ---');
  logger.info({ state: globalCircuitBreaker.getState() }, 'CB state before');
  try {
    const result = await globalCircuitBreaker.execute(() => fetchJson<{ url: string }>(PUBLIC_API));
    logger.info({ url: result.url }, 'Drill 4 OK');
  } catch (err: any) {
    logger.error({ err: err.message }, 'Drill 4 CB error');
  }

  logger.info('--- Drill 6: POST with Idempotency Key ---');
  const postOptions = withIdempotency({
    method: 'POST',
    body: JSON.stringify({ amount: 100 }),
  });
  const idempKey = (postOptions.headers as Headers).get('idempotency-key');
  logger.info({ idempotencyKey: idempKey }, 'Drill 6 POST idempotency key');

  logger.info('Demo complete.');
}

main().catch((err) => {
  logger.error(err, 'Unhandled error');
  process.exit(1);
});
