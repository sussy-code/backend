import { conf } from '@/config';
import { Session } from '@/db/models/Session';
import { EntityManager } from '@mikro-orm/postgresql';
import { sign, verify } from 'jsonwebtoken';

// 21 days in ms
const SESSION_EXPIRY_MS = 21 * 24 * 60 * 60 * 1000;

export async function getSession(
  em: EntityManager,
  id: string,
): Promise<Session | null> {
  const session = await em.findOne(Session, { id });
  if (!session) return null;

  if (session.expiresAt < new Date()) return null;

  return session;
}

export async function getSessionAndBump(
  em: EntityManager,
  id: string,
): Promise<Session | null> {
  const session = await getSession(em, id);
  if (!session) return null;
  em.assign(session, {
    accessedAt: new Date(),
    expiresAt: new Date(Date.now() + SESSION_EXPIRY_MS),
  });
  await em.persistAndFlush(session);
  return session;
}

export function makeSession(
  user: string,
  device: string,
  userAgent?: string,
): Session {
  if (!userAgent) throw new Error('No useragent provided');

  const session = new Session();
  session.accessedAt = new Date();
  session.createdAt = new Date();
  session.expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS);
  session.userAgent = userAgent;
  session.device = device;
  session.user = user;

  return session;
}

export function makeSessionToken(session: Session): string {
  return sign({ sid: session.id }, conf.crypto.sessionSecret, {
    algorithm: 'HS256',
  });
}

export function verifySessionToken(token: string): { sid: string } | null {
  try {
    const payload = verify(token, conf.crypto.sessionSecret, {
      algorithms: ['HS256'],
    });
    if (typeof payload === 'string') return null;
    return payload as { sid: string };
  } catch {
    return null;
  }
}
