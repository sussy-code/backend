import { conf } from '@/config';
import { IncomingHttpHeaders } from 'http';

export type IpReq = {
  ip: string;
  headers: IncomingHttpHeaders;
};

const trustCloudflare = conf.server.trustCloudflare;

function getSingleHeader(
  headers: IncomingHttpHeaders,
  key: string,
): string | undefined {
  const header = headers[key];
  if (Array.isArray(header)) return header[0];
  return header;
}

export function getIp(req: IpReq) {
  const cfIp = getSingleHeader(req.headers, 'cf-connecting-ip');
  if (trustCloudflare && cfIp) {
    return cfIp;
  }

  return req.ip;
}
