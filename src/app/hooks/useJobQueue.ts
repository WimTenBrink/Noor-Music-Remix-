import { useState, useEffect } from 'react';
import { Job } from '../../types';
import { jobService } from '../services/jobService';

export function useJobQueue() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const unsub = jobService.subscribe(newJobs => {
      setJobs(newJobs);
      setIsPaused(jobService.getIsPaused());
    });
    return unsub;
  }, []);

  return {
    jobs,
    isPaused,
    addJob: jobService.addJob.bind(jobService),
    pause: jobService.pause.bind(jobService),
    resume: jobService.resume.bind(jobService),
    deleteJob: jobService.deleteJob.bind(jobService),
    deleteAll: jobService.deleteAll.bind(jobService),
    clearQueue: jobService.clearQueue.bind(jobService),
    retryJob: jobService.retryJob.bind(jobService),
    retryAll: jobService.retryAll.bind(jobService),
    speedUp: jobService.speedUp.bind(jobService),
  };
}
