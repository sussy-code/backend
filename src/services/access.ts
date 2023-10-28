export const roles = {
  ADMIN: 'ADMIN', // has access to admin endpoints
} as const;

export type Roles = (typeof roles)[keyof typeof roles];
