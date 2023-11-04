import { getORM } from '@/modules/mikro';
import { getLimiter } from '@/modules/ratelimits';
import { Limiter } from '@/modules/ratelimits/limiter';
import { makeAuthContext } from '@/services/auth';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  ContextConfigDefault,
  FastifyBaseLogger,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
  RouteGenericInterface,
  RouteHandlerMethod,
} from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ResolveFastifyReplyReturnType } from 'fastify/types/type-provider';

export type RequestContext<
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends
    RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  RawReply extends
    RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  ContextConfig = ContextConfigDefault,
  SchemaCompiler extends FastifySchema = FastifySchema,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
> = {
  req: FastifyRequest<
    RouteGeneric,
    RawServer,
    RawRequest,
    SchemaCompiler,
    ZodTypeProvider,
    ContextConfig,
    Logger
  >;
  res: FastifyReply<
    RawServer,
    RawRequest,
    RawReply,
    RouteGeneric,
    ContextConfig,
    SchemaCompiler,
    ZodTypeProvider
  >;
  body: FastifyRequest<
    RouteGeneric,
    RawServer,
    RawRequest,
    SchemaCompiler,
    ZodTypeProvider,
    ContextConfig,
    Logger
  >['body'];
  params: FastifyRequest<
    RouteGeneric,
    RawServer,
    RawRequest,
    SchemaCompiler,
    ZodTypeProvider,
    ContextConfig,
    Logger
  >['params'];
  query: FastifyRequest<
    RouteGeneric,
    RawServer,
    RawRequest,
    SchemaCompiler,
    ZodTypeProvider,
    ContextConfig,
    Logger
  >['query'];
  em: EntityManager;
  limiter: Limiter | null;
  auth: ReturnType<typeof makeAuthContext>;
};

export function handle<
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends
    RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  RawReply extends
    RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  ContextConfig = ContextConfigDefault,
  SchemaCompiler extends FastifySchema = FastifySchema,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
>(
  handler: (
    ctx: RequestContext<
      RawServer,
      RawRequest,
      RawReply,
      RouteGeneric,
      ContextConfig,
      SchemaCompiler,
      Logger
    >,
  ) => ResolveFastifyReplyReturnType<
    ZodTypeProvider,
    SchemaCompiler,
    RouteGeneric
  >,
): RouteHandlerMethod<
  RawServer,
  RawRequest,
  RawReply,
  RouteGeneric,
  ContextConfig,
  SchemaCompiler,
  ZodTypeProvider,
  Logger
> {
  const reqHandler: any = async (req: any, res: any) => {
    const em = getORM().em.fork();
    res.send(
      await handler({
        req,
        res,
        body: req.body,
        params: req.params,
        query: req.query,
        em,
        auth: makeAuthContext(em, req),
        limiter: getLimiter(),
      }),
    );
  };
  return reqHandler;
}
