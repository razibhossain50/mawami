// Production-ready logging utility
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  component?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  private log(level: LogLevel, message: string, data?: any, component?: string) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      component
    };

    // In development, use console
    if (this.isDevelopment) {
      const logMethod = console[level] || console.log;
      logMethod(`[${level.toUpperCase()}] ${component ? `[${component}] ` : ''}${message}`, data || '');
    }

    // In production, send to monitoring service
    if (!this.isDevelopment && level !== 'debug') {
      this.sendToMonitoring(entry);
    }
  }

  private sendToMonitoring(entry: LogEntry) {
    // Implement your monitoring service integration here
    // e.g., Sentry, LogRocket, or custom analytics
  }

  debug(message: string, data?: any, component?: string) {
    this.log('debug', message, data, component);
  }

  info(message: string, data?: any, component?: string) {
    this.log('info', message, data, component);
  }

  warn(message: string, data?: any, component?: string) {
    this.log('warn', message, data, component);
  }

  error(message: string, data?: any, component?: string) {
    this.log('error', message, data, component);
  }
}

export const logger = new Logger();