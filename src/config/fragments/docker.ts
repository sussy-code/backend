import { FragmentSchema } from '@/config/fragments/types';

export const dockerFragment: FragmentSchema = {
  postgres: {
    connection: 'postgres://postgres:postgres@postgres:5432/postgres',
  },
};
