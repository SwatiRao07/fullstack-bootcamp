import app from "./app.js";
import { logger } from "./middleware/logger.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  logger.info(`Documentation available at http://localhost:${PORT}/docs`);
  logger.info(`Metrics available at http://localhost:${PORT}/metrics`);
});
