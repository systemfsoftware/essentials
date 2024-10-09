import { Config as C, Effect, Layer, Logger, Option, pipe } from 'effect'

/**
 * @public
 */
export namespace LogLayer {
  export type LogLayer = Layer.Layer<never, never, never>
  export type Config = {
    readonly NODE_ENV: C.Config<Option.Option<string>>
  }
}

/**
 * @public
 */
export const LogLayer: LogLayer.LogLayer = Layer.unwrapEffect(
  Effect.gen(function*() {
    const NODE_ENV = yield* pipe(Config.NODE_ENV, Effect.orDie)

    if (Option.isSome(NODE_ENV) && NODE_ENV.value === 'production') {
      return Layer.suspend(() => Logger.json)
    }

    return Layer.suspend(() => Logger.pretty)
  }),
)

/**
 * @public
 */
export const Config: LogLayer.Config = Object.freeze({
  NODE_ENV: pipe(
    C.string('NODE_ENV'),
    C.option,
  ),
})
