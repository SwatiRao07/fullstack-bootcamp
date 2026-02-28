import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { TaskManager } from './TaskManager';
import { Priority, Task } from './types';
import { TaskCollection } from './collection';
import { FileStorage } from './storage';
import { TaskSyncManager } from './sync';
import path from 'path';

export class TaskCLI {
  private program: Command;
  private syncManager: TaskSyncManager;

  constructor(private manager: TaskManager) {
    this.program = new Command();
    const storagePath = path.join(process.cwd(), 'data');
    const storage = new FileStorage<TaskCollection>(storagePath);
    this.syncManager = new TaskSyncManager(storage);
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .name('task')
      .description('Task Management CLI')
      .version('1.0.0');

    this.program
      .command('add <title>')
      .description('Add a new task')
      .option('-p, --priority <priority>', 'Task priority (low, medium, high)', 'medium')
      .action(async (title, options) => {
        try {
          const task = this.manager.add({ title, priority: options.priority as Priority });
          console.log(chalk.green(`Task added: [${task.id}] ${task.title} (${task.priority})`));
          await this.saveWork();
        } catch (error: any) {
          console.error(chalk.red(`Error: ${error.message}`));
        }
      });

    this.program
      .command('list')
      .description('List all tasks')
      .option('-s, --status <status>', 'Filter by status (completed, pending)')
      .option('-p, --priority <priority>', 'Filter by priority (low, medium, high)')
      .action((options) => {
        const tasks = this.manager.export().tasks;
        let filtered = tasks;
        if (options.status) {
          filtered = filtered.filter(t => t.completed === (options.status === 'completed'));
        }
        if (options.priority) {
          filtered = filtered.filter(t => t.priority === options.priority);
        }
        
        if (filtered.length === 0) {
          console.log(chalk.yellow('No tasks found.'));
          return;
        }

        filtered.forEach(t => {
          const status = t.completed ? chalk.green('✓') : chalk.yellow('○');
          const priority = chalk.blue(`[${t.priority}]`);
          console.log(`${status} ${priority} ${chalk.white(t.title)} (ID: ${t.id})`);
        });
      });

    this.program
      .command('complete <id>')
      .description('Mark a task as completed')
      .action(async (id) => {
        try {
          this.manager.update(id, { completed: true });
          console.log(chalk.green(`Task marked as completed: ${id}`));
          await this.saveWork();
        } catch (error: any) {
          console.error(chalk.red(`Error: ${error.message}`));
        }
      });

    this.program
      .command('delete <id>')
      .description('Delete a task')
      .action(async (id) => {
        if (this.manager.delete(id)) {
          console.log(chalk.red(`Task deleted: ${id}`));
          await this.saveWork();
        } else {
          console.error(chalk.red(`Task not found: ${id}`));
        }
      });

    this.program
      .command('stats')
      .description('Show task statistics')
      .action(() => {
        const stats = this.manager.getStats();
        console.log(chalk.bold('Task Statistics:'));
        console.log(`Total: ${stats.byStatus.completed + stats.byStatus.pending}`);
        console.log(`Completed: ${chalk.green(stats.byStatus.completed)}`);
        console.log(`Pending: ${chalk.yellow(stats.byStatus.pending)}`);
        console.log(chalk.cyan('By Priority:'));
        Object.entries(stats.byPriority).forEach(([p, count]) => {
          console.log(` - ${p}: ${count}`);
        });
      });

    this.program
      .command('interactive')
      .description('Launch interactive mode')
      .action(async () => {
        await this.interactive();
      });
  }

  private async saveWork(): Promise<void> {
    const data = this.manager.export();
    await this.syncManager.save(data);
  }

  private async interactive(): Promise<void> {
    console.log(chalk.cyan('Interactive mode... (Press Ctrl+C to exit)'));
    while (true) {
      const { action } = await (inquirer as any).prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            'List Tasks',
            'Add Task',
            'Mark Task Completed',
            'Delete Task',
            'Show Stats',
            'Exit'
          ]
        }
      ]);

      if (action === 'Exit') break;

      switch (action) {
        case 'List Tasks':
          this.program.parse(['node', 'task', 'list']);
          break;
        case 'Add Task':
          const { title, priority } = await (inquirer as any).prompt([
            { type: 'input', name: 'title', message: 'Task title:' },
            { 
              type: 'list', 
              name: 'priority', 
              message: 'Priority:',
              choices: ['low', 'medium', 'high'],
              default: 'medium'
            }
          ]);
          this.manager.add({ title, priority });
          await this.saveWork();
          break;
        case 'Mark Task Completed':
          const tasks = this.manager.export().tasks.filter(t => !t.completed);
          if (tasks.length === 0) {
            console.log(chalk.yellow('No pending tasks.'));
          } else {
            const { id } = await (inquirer as any).prompt([
              {
                type: 'list',
                name: 'id',
                message: 'Select task to complete:',
                choices: tasks.map(t => ({ name: t.title, value: t.id }))
              }
            ]);
            this.manager.update(id, { completed: true });
            await this.saveWork();
          }
          break;
        case 'Delete Task':
            const allTasks = this.manager.export().tasks;
            if (allTasks.length === 0) {
              console.log(chalk.yellow('No tasks to delete.'));
            } else {
              const { id } = await (inquirer as any).prompt([
                {
                  type: 'list',
                  name: 'id',
                  message: 'Select task to delete:',
                  choices: allTasks.map(t => ({ name: t.title, value: t.id }))
                }
              ]);
              this.manager.delete(id);
              await this.saveWork();
            }
            break;
        case 'Show Stats':
            this.program.parse(['node', 'task', 'stats']);
            break;
      }
      console.log('\n');
    }
  }

  async run(args: string[]): Promise<void> {
    const data = await this.syncManager.load();
    if (data) {
      this.manager = new TaskManager(data.tasks);
    }
    this.program.parse(args);
  }
}
