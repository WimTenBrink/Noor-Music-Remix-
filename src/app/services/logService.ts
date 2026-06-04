import { LogEntry } from '../../types';

class LogService {
  private logs: LogEntry[] = [];
  private listeners: ((logs: LogEntry[]) => void)[] = [];

  subscribe(listener: (logs: LogEntry[]) => void) {
    this.listeners.push(listener);
    listener([...this.logs]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l([...this.logs]));
  }

  log(level: 'info' | 'warn' | 'error', title: string, details: string) {
    const entry: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      level,
      title,
      details,
    };
    this.logs.unshift(entry);
    this.notify();
  }

  clear() {
    this.logs = [];
    this.notify();
  }

  getLogs() {
    return this.logs;
  }
}

export const logService = new LogService();
