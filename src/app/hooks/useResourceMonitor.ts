import { useState, useEffect } from 'react';

export function useResourceMonitor() {
  const [cpu, setCpu] = useState(0);
  const [memory, setMemory] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate resource usage
      setCpu(Math.floor(Math.random() * 15) + 5); // 5-20%
      setMemory(Math.floor(Math.random() * 100) + 400); // 400-500MB
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { cpu, memory };
}
