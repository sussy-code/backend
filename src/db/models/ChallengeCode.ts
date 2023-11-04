import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

// 30 seconds
const CHALLENGE_EXPIRY_MS = 3000000 * 1000;

export type ChallengeFlow = 'registration' | 'login';

export type ChallengeType = 'mnemonic';

@Entity({ tableName: 'challenge_codes' })
export class ChallengeCode {
  @PrimaryKey({ name: 'code', type: 'uuid' })
  code: string = randomUUID();

  @Property({ name: 'flow', type: 'text' })
  flow!: ChallengeFlow;

  @Property({ name: 'auth_type' })
  authType!: ChallengeType;

  @Property({ type: 'date' })
  createdAt: Date = new Date();

  @Property({ type: 'date' })
  expiresAt: Date = new Date(Date.now() + CHALLENGE_EXPIRY_MS);
}

export interface ChallengeCodeDTO {
  code: string;
  flow: string;
  authType: string;
  createdAt: string;
  expiresAt: string;
}

export function formatChallengeCode(
  challenge: ChallengeCode,
): ChallengeCodeDTO {
  return {
    code: challenge.code,
    flow: challenge.flow,
    authType: challenge.authType,
    createdAt: challenge.createdAt.toISOString(),
    expiresAt: challenge.expiresAt.toISOString(),
  };
}
