export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment = true;

  log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logOutput = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    
    if (this.isDevelopment) {
      switch (level) {
        case 'debug':
          console.log(logOutput, data || '');
          break;
        case 'info':
          console.info(logOutput, data || '');
          break;
        case 'warn':
          console.warn(logOutput, data || '');
          break;
        case 'error':
          console.error(logOutput, data || '');
          break;
      }
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, error?: any) {
    this.log('error', message, error);
  }

  recordCrash(error: Error, stackTrace?: string) {
    console.error('[CRASH REPORTED]:', error.message, stackTrace);
    // Real production integration hook (e.g., Sentry / Crashlytics)
  }
}

export const logger = new Logger();
