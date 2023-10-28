import { Session } from '@/db/models/Session';
import { User } from '@/db/models/User';
import { Roles } from '@/services/access';
import { StatusError } from '@/services/error';
import { getSessionAndBump, verifySessionToken } from '@/services/session';
import { EntityManager } from '@mikro-orm/postgresql';
import { FastifyRequest } from 'fastify';

export function makeAuthContext(manager: EntityManager, req: FastifyRequest) {
  let userCache: User | null = null;
  let sessionCache: Session | null = null;
  const em = manager.fork();

  return {
    getSessionId(): string | null {
      const header = req.headers.authorization;
      if (!header) return null;
      const [type, token] = header.split(' ', 2);
      if (type.toLowerCase() !== 'bearer')
        throw new StatusError('Invalid authentication', 400);
      const payload = verifySessionToken(token);
      if (!payload) throw new StatusError('Invalid authentication', 400);
      return payload.sid;
    },
    async getSession() {
      if (sessionCache) return sessionCache;
      const sid = this.getSessionId();
      if (!sid) return null;
      const session = await getSessionAndBump(em, sid);
      if (!session) return null;
      sessionCache = session;
      return session;
    },
    async getUser() {
      if (userCache) return userCache;
      const session = await this.getSession();
      if (!session) return null;
      const user = await em.findOne(User, { id: session.user });
      if (!user) return null;
      userCache = user;
      return user;
    },
    async assert() {
      const user = await this.getUser();
      if (!user) throw new StatusError('Not logged in', 401);
      return user;
    },
    get user() {
      if (!userCache) throw new Error('call assert before getting user');
      return userCache;
    },
    get session() {
      if (!sessionCache) throw new Error('call assert before getting session');
      return sessionCache;
    },
    async assertHasRole(role: Roles) {
      const user = await this.assert();
      const hasRole = user.roles.includes(role);
      if (!hasRole) throw new StatusError('No permissions', 403);
    },
  };
}
