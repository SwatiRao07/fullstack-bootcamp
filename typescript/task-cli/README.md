# Task Management CLI

A comprehensive CLI tool for managing tasks, built as part of the TypeScript curriculum. This project demonstrates core TypeScript concepts, from basic types to advanced generics, async operations, and a modular architecture.

## Features

- **Progressive Growth**: Evolved through 10 sections of structured TypeScript learning.
- **Task Management**: Create, list, mark as complete, delete, and view stats for tasks.
- **Persistent Storage**: Automatic saving to a local JSON file (`data/tasks.json`).
- **Advanced Querying**: Filter tasks by status, priority, title content, and date ranges.
- **Interactive Mode**: A user-friendly, prompt-based interface using `inquirer`.
- **Plugin System**: Modular architecture allowing for command and hook-based extensions.
- **Robustness**: Custom error handling and a multi-level logging system.
- **Aesthetic CLI**: Rich formatting and colors using `chalk`.

## Installation

1. **Navigate to the project directory**:
   ```bash
   cd typescript/task-cli
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Build the project**:
   ```bash
   pnpm run build
   ```

## Usage

You can run the CLI using `pnpm task [command]`. Note: unlike npm, pnpm doesn't require `--` to pass flags to your script.

### Basic Operations

- **Add a Task**:
  ```bash
  pnpm task add "Clean the office" --priority high
  ```

- **List All Tasks**:
  ```bash
  pnpm task list
  ```

- **Filter Tasks**:
  ```bash
  pnpm task list --status pending --priority medium
  ```

- **Complete a Task**:
  ```bash
  pnpm task complete <task-id>
  ```

- **Delete a Task**:
  ```bash
  pnpm task delete <task-id>
  ```

### Advanced Features

- **Global Stats**:
  ```bash
  pnpm task stats
  ```

- **Interactive Mode**:
  ```bash
  pnpm task interactive
  ```

## Architecture

The project is structured into logical modules to maintain a clean separation of concerns:

- `src/types.ts`: Core data models and status types.
- `src/TaskManager.ts`: Business logic and event system.
- `src/storage.ts`: Generic file-based I/O.
- `src/query.ts`: Type-safe filtering and sorting.
- `src/cli.ts`: User interface and command routing.
- `src/plugins/`: Extension point for new features.
- `src/logger.ts` & `src/errors.ts`: Production polish and error handling.


