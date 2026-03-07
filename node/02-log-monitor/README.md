# logmon - Log Monitoring Tool

A simple CLI utility that monitors log file changes and streams them to the console.

## Features
- **File Watching**: Real-time updates as lines are appended.
- **Filtering**: Filter output by a specific substring (e.g., `ERROR`).
- **Rotation Handling**: Automatically detects when a log file is rotated (renamed) and continues watching the new file at the same path.
- **Graceful Shutdown**: Handles `SIGINT` (Ctrl+C) cleanups.

## Usage
To start monitoring a log:
```bash
node logmon.js <filename> [filter]
```

### Examples
Watch all lines:
```bash
node logmon.js app.log
```

Only show errors:
```bash
node logmon.js app.log ERROR
```

## Testing
To see it in action, run the simulator in one terminal:
```bash
node test_simulator.js
```

And run `logmon` in another:
```bash
node logmon.js app.log ERROR
```

As the simulator appends to `app.log` and rotates it, `logmon` will filter for "ERROR" and keep track across rotations.
