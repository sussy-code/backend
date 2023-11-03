import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

// 30 seconds
const CHALLENGE_EXPIRY_MS = 3000000 * 1000;

@Entity({ tableName: 'challenge_codes' })
export class ChallengeCode {
  @PrimaryKey({ name: 'code', type: 'uuid' })
  code: string = randomUUID();

  @Property({ name: 'stage', type: 'text' })
  stage!: 'registration' | 'login';

  @Property({ name: 'auth_type' })
  authType!: 'mnemonic';

  @Property({ type: 'date' })
  createdAt: Date = new Date();

  @Property({ type: 'date' })
  expiresAt: Date = new Date(Date.now() + CHALLENGE_EXPIRY_MS);
}

export interface ChallengeCodeDTO {
  code: string;
  stage: string;
  authType: string;
  createdAt: string;
  expiresAt: string;
}

export function formatChallengeCode(
  challenge: ChallengeCode,
): ChallengeCodeDTO {
  return {
    code: challenge.code,
    stage: challenge.stage,
    authType: challenge.authType,
    createdAt: challenge.createdAt.toISOString(),
    expiresAt: challenge.expiresAt.toISOString(),
  };
}
