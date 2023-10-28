import { Entity, PrimaryKey, Property, types } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id: string = randomUUID();

  @Property({ type: 'date' })
  createdAt: Date = new Date();

  @Property({ type: 'text' })
  name!: string;

  @Property({ name: 'permissions', type: types.array })
  roles: string[] = [];
}

export interface UserDTO {
  id: string;
  roles: string[];
  createdAt: string;
}

export function formatUser(user: User): UserDTO {
  return {
    id: user.id,
    roles: user.roles,
    createdAt: user.createdAt.toISOString(),
  };
}
