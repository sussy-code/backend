import { FragmentSchema } from '@/config/fragments/types';

export const devFragment: FragmentSchema = {
  server: {
    cors: 'http://localhost:5173',
    trustProxy: true,
  },
  logging: {
    format: 'pretty',
    debug: true,
  },
  postgres: {
    syncSchema: true,
  },
  crypto: {
    sessionSecret: 'aINCithRivERecKENdmANDRaNKenSiNi',
  },
};
