import * as Socket from '@effect/platform/Socket'
import * as neon from '@neondatabase/serverless'
import type { DrizzleConfig } from 'drizzle-orm'
import { drizzle, type NeonDatabase } from 'drizzle-orm/neon-serverless'
import { Config as C, Effect, pipe } from 'effect'
import type { ConfigError } from 'effect/ConfigError'

/**
 * @public
 */
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
    ConfigError,
    Socket.WebSocketConstructor
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
    const connectionString = yield* Config.DATABASE_URL
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

/**
 * @public
 */
export const Config: Adapter.Config = Object.freeze({
  DATABASE_URL: pipe(
    C.nonEmptyString('DATABASE_URL'),
    C.withDescription('Neon database connection string'),
  ),
})
