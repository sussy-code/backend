import { FragmentSchema } from '@/config/fragments/types';

export const devFragment: FragmentSchema = {
  server: {
    allowAnySite: true,
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
  meta: {
    name: 'movie-web development',
    description:
      "This backend is only used in development, do not create an account if you this isn't your own instance",
  },
};
