import { Roles } from '@/services/access';

export function assertHasRole(_role: Roles) {
  throw new Error('requires role');
}
