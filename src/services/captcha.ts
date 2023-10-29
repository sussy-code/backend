import { conf } from '@/config';
import { StatusError } from '@/services/error';

export async function isValidCaptcha(token: string): Promise<boolean> {
  if (!conf.captcha.secret)
    throw new Error('isValidCaptcha() is called but no secret set');
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: JSON.stringify({
      secret: conf.captcha.secret,
      response: token,
    }),
    headers: {
      'content-type': 'application/json',
    },
  });
  const json = await res.json();
  return !!json.success;
}

export async function assertCaptcha(token?: string) {
  // early return if captchas arent enabled
  if (!conf.captcha.enabled) return;
  if (!token) throw new StatusError('captcha token is required', 400);

  const isValid = await isValidCaptcha(token);
  if (!isValid) throw new StatusError('captcha token is invalid', 400);
}
