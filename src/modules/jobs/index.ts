import { sessionExpiryJob } from '@/modules/jobs/list/sessionExpiry';

export async function setupJobs() {
  sessionExpiryJob.start();
}
