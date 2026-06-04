import { useState, useEffect } from 'react';
import { LogEntry } from '../../types';
import { logService } from '../services/logService';

export function useLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const unsub = logService.subscribe(newLogs => {
      setLogs(newLogs);
    });
    return unsub;
  }, []);

  return {
    logs,
    log: logService.log.bind(logService),
    clear: logService.clear.bind(logService),
  };
}
