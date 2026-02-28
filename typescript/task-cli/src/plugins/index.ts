import { TaskManager } from '../TaskManager';

export type CommandHandler = (args: string[], manager: TaskManager) => void | Promise<void>;

export interface PluginCommand {
  name: string;
  description: string;
  handler: CommandHandler;
}

export interface PluginHooks {
  onAdd?: (task: any) => void;
  onUpdate?: (task: any) => void;
  onDelete?: (task: any) => void;
}

export interface TaskPlugin {
  name: string;
  version: string;
  commands?: PluginCommand[];
  hooks?: PluginHooks;
}

export class PluginSystem {
  private plugins: Map<string, TaskPlugin> = new Map();

  constructor(private manager: TaskManager) {}

  register(plugin: TaskPlugin): void {
    this.plugins.set(plugin.name, plugin);
    if (plugin.hooks) {
      if (plugin.hooks.onAdd) this.manager.subscribe((event, task) => event === 'added' && plugin.hooks!.onAdd!(task));
      if (plugin.hooks.onUpdate) this.manager.subscribe((event, task) => event === 'updated' && plugin.hooks!.onUpdate!(task));
      if (plugin.hooks.onDelete) this.manager.subscribe((event, task) => event === 'deleted' && plugin.hooks!.onDelete!(task));
    }
  }

  getCommands(): PluginCommand[] {
    const commands: PluginCommand[] = [];
    this.plugins.forEach(plugin => {
      if (plugin.commands) {
        commands.push(...plugin.commands);
      }
    });
    return commands;
  }
}
