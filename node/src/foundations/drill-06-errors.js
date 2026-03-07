function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }

  return a / b;
}

try {
  const result = divide(10, 0);
  console.log('Result:', result);
} catch (err) {
  console.error('Caught sync error:', err.message);
}

function asyncTask() {
  return new Promise((_, reject) => {
    reject(new Error('Async failure'));
  });
}

asyncTask()
  .then(() => {
    console.log('Success');
  })
  .catch((err) => {
    console.error('Caught async error:', err.message);
  });

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Unexpected error:', err.message);
  console.log('Cleaning up before exit');
  process.exit(1);
});
