import { challengeCodeJob } from '@/modules/jobs/list/challengeCode';
import { sessionExpiryJob } from '@/modules/jobs/list/sessionExpiry';
import { userDeletionJob } from '@/modules/jobs/list/userDeletion';
import { providerMetricCleanupJob } from '@/modules/jobs/list/providerMetricCleanup';

export async function setupJobs() {
  challengeCodeJob.start();
  sessionExpiryJob.start();
  userDeletionJob.start();
  providerMetricCleanupJob.start();
}
