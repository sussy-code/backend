import { conf } from '@/config';
import { URLSearchParams } from 'url';
import winston from 'winston';
import { consoleFormat } from 'winston-console-format';

const appName = 'mw-backend';

function createWinstonLogger() {
  let loggerObj = winston.createLogger({
    levels: Object.assign(
      { fatal: 0, warn: 4, trace: 7 },
      winston.config.syslog.levels,
    ),
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.ms(),
      winston.format.label({ label: appName }),
      winston.format.simple(),
      winston.format.padLevels(),
      winston.format.errors({ stack: true }),
      consoleFormat({
        showMeta: false,
        inspectOptions: {
          depth: Infinity,
          colors: true,
          maxArrayLength: Infinity,
          breakLength: 120,
          compact: Infinity,
        },
      }),
    ),
    defaultMeta: { svc: appName },
    transports: [new winston.transports.Console()],
  });

  // production logger
  if (conf.logging.format === 'json') {
    loggerObj = winston.createLogger({
      levels: Object.assign(
        { fatal: 0, warn: 4, trace: 7 },
        winston.config.syslog.levels,
      ),
      format: winston.format.combine(
        winston.format.label({ label: appName }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: { svc: appName },
      transports: [new winston.transports.Console()],
    });
  }

  return loggerObj;
}

export function scopedLogger(service: string, meta: object = {}) {
  const logger = createWinstonLogger();
  logger.defaultMeta = {
    ...logger.defaultMeta,
    svc: service,
    ...meta,
  };
  return logger;
}

const ignoredUrls = ['/healthcheck', '/metrics'];

export function makeFastifyLogger(logger: winston.Logger) {
  logger.format = winston.format.combine(
    winston.format((info) => {
      if (typeof info.message === 'object') {
        const { message } = info as any;
        const { res, responseTime } = message || {};
        if (!res) return false;

        const { request, statusCode } = res;
        if (request.method === 'OPTIONS') return false;

        let url = request.url;
        try {
          const pathParts = (request.url as string).split('?', 2);

          if (ignoredUrls.includes(pathParts[0])) return false;

          if (pathParts[1]) {
            const searchParams = new URLSearchParams(pathParts[1]);
            pathParts[1] = searchParams.toString();
          }
          url = pathParts.join('?');
        } catch {
          // ignore error, invalid search params will just log normally
        }

        // create log message
        info.message = `[${statusCode}] ${request.method.toUpperCase()} ${url} - ${responseTime.toFixed(
          2,
        )}ms`;
        return info;
      }
      return info;
    })(),
    logger.format,
  );
  return logger;
}

export const log = createWinstonLogger();
