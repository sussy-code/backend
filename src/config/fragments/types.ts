import { configSchema } from '@/config/schema';
import { PartialDeep } from 'type-fest';
import { z } from 'zod';

export type FragmentSchema = PartialDeep<z.infer<typeof configSchema>>;
