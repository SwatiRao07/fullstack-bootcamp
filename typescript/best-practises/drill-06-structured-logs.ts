import pino from "pino";

const logger = pino();

// function 1
function stepOne(operationId: string) {
  logger.info({ operationId }, "stepOne started");
}

// function 2
function stepTwo(operationId: string) {
  logger.info({ operationId }, "stepTwo started");
}

// main flow
function process() {
  const operationId = "op-" + Date.now();

  logger.info({ operationId }, "process started");

  stepOne(operationId);
  stepTwo(operationId);

  logger.info({ operationId }, "process finished");
}

process();