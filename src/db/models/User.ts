import { Entity, PrimaryKey, Property, types } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

export type UserProfile = {
  colorA: string;
  colorB: string;
  icon: string;
};

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id: string = randomUUID();

  @Property({ name: 'namespace' })
  namespace!: string;

  @Property({ type: 'date' })
  createdAt: Date = new Date();

  @Property({ type: 'text' })
  name!: string;

  @Property({ name: 'permissions', type: types.array })
  roles: string[] = [];

  @Property({
    name: 'profile',
    type: types.json,
  })
  profile!: UserProfile;
}

export interface UserDTO {
  id: string;
  namespace: string;
  name: string;
  roles: string[];
  createdAt: string;
  profile: {
    colorA: string;
    colorB: string;
    icon: string;
  };
}

export function formatUser(user: User): UserDTO {
  return {
    id: user.id,
    namespace: user.namespace,
    name: user.name,
    roles: user.roles,
    createdAt: user.createdAt.toISOString(),
    profile: {
      colorA: user.profile.colorA,
      colorB: user.profile.colorB,
      icon: user.profile.icon,
    },
  };
}
