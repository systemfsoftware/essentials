import * as Socket from '@effect/platform/Socket'
import * as neon from '@neondatabase/serverless'
import type { DrizzleConfig } from 'drizzle-orm'
import { drizzle, type NeonDatabase } from 'drizzle-orm/neon-serverless'
import { Config as C, Context, Effect } from 'effect'

export namespace Adapter {
  export type TSchema = Record<string, unknown>

  export type DB<T extends TSchema = Record<string, never>> = NeonDatabase<T>
  export type Options<T extends TSchema = Record<string, never>> = DrizzleConfig<T>
  export type Pool = neon.Pool
  export type WebSocketConstructor = Socket.WebSocketConstructor

  export type Adapter<T extends TSchema = Record<string, never>> = Effect.Effect<
    {
      pool: Pool
      db: DB<T>
    },
    never,
    Socket.WebSocketConstructor | AdapterConfig
  >

  export type Config = Readonly<{
    DATABASE_URL: C.Config<string>
  }>
}

/**
 * @public
 */
export function Adapter<T extends Adapter.TSchema = Record<string, never>>(
  options?: Adapter.Options<T>,
): Adapter.Adapter<T> {
  return Effect.gen(function*() {
    const config = yield* AdapterConfig
    const connectionString = config.DATABASE_POOL_URL
    const webSocketConstructor = yield* Socket.WebSocketConstructor

    yield* Effect.sync(() => {
      neon.neonConfig.webSocketConstructor = class {
        constructor(url: string) {
          return webSocketConstructor(url)
        }
      }
    })

    const pool = yield* Effect.sync(() => new neon.Pool({ connectionString }))
    const db = yield* Effect.sync(() => drizzle(pool, options))

    return { pool, db }
  })
}

export class AdapterConfig extends Context.Tag('AdapterConfig')<AdapterConfig, {
  readonly DATABASE_POOL_URL: string
}>() {}
