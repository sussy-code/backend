export const status = {
  failed: 'failed',
  notfound: 'notfound',
  success: 'success',
} as const;
export type Status = keyof typeof status;
