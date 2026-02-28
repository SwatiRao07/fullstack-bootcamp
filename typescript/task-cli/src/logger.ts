export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export class Logger {
  constructor(private level: LogLevel = 'info') {}

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  info(message: string, context?: object): void {
    if (this.shouldLog('info')) {
      console.log(`[INFO] ${new Date().toISOString()}: ${message}`, context || '');
    }
  }

  warn(message: string, context?: object): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, context || '');
    }
  }

  error(error: Error | string, context?: object): void {
    if (this.shouldLog('error')) {
      const message = error instanceof Error ? error.message : error;
      console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, context || '');
    }
  }
}
