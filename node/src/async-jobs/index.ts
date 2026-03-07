import { logger } from '../integrations/utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

const drill = process.argv[2] || process.env.ACTIVE_DRILL || '01';

logger.info({ drill }, 'Starting Async Job Drill...');

switch (drill) {
  case '01':
    import('./drill-01-basics/app.js');
    break;
  case '02':
    import('./drill-02-workers/app.js');
    break;
  case '03':
  case '04':
    import('./drill-03-redis/app.js');
    break;
  case '05':
    import('./drill-05-scheduling/cron.js').then((m) => m.startWeatherCron());
    break;
  default:
    logger.error({ drill }, 'Unknown drill specified.');
    process.exit(1);
}
