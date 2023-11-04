import { ChallengeCode } from '@/db/models/ChallengeCode';
import { StatusError } from '@/services/error';
import { EntityManager } from '@mikro-orm/core';
import forge from 'node-forge';

export async function assertChallengeCode(
  em: EntityManager,
  code: string,
  publicKey: string,
  signature: string,
  validFlow: ChallengeFlow,
  validType: ChallengeType,
) {
  const now = Date.now();

  const challenge = await em.findOne(ChallengeCode, {
    code,
  });

  if (
    !challenge ||
    challenge.flow !== validFlow ||
    challenge.authType !== validType
  ) {
    throw new StatusError('Challenge Code Invalid', 401);
  }

  if (challenge.expiresAt.getTime() <= now)
    throw new StatusError('Challenge Code Expired', 401);

  const verifiedChallenge = forge.pki.ed25519.verify({
    publicKey: new forge.util.ByteStringBuffer(
      Buffer.from(publicKey, 'base64url'),
    ),
    encoding: 'utf8',
    signature: new forge.util.ByteStringBuffer(
      Buffer.from(signature, 'base64url'),
    ),
    message: code,
  });

  if (!verifiedChallenge)
    throw new StatusError('Challenge Code Signature Invalid', 401);

  em.remove(challenge);
}
