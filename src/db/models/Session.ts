import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

@Entity({ tableName: 'sessions' })
export class Session {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id: string = randomUUID();

  @Property({ name: 'user', type: 'text' })
  user!: string;

  @Property({ type: 'date' })
  createdAt: Date = new Date();

  @Property({ type: 'date' })
  accessedAt!: Date;

  @Property({ type: 'date' })
  expiresAt!: Date;

  @Property({ type: 'text' })
  device!: string;

  @Property({ type: 'text' })
  userAgent!: string;
}

export interface SessionDTO {
  id: string;
  userId: string;
  createdAt: string;
  accessedAt: string;
  device: string;
  userAgent: string;
}

export function formatSession(session: Session): SessionDTO {
  return {
    id: session.id,
    userId: session.user,
    createdAt: session.createdAt.toISOString(),
    accessedAt: session.accessedAt.toISOString(),
    device: session.device,
    userAgent: session.userAgent,
  };
}
