import { Config as C, Effect, Layer, Logger as EffectLogger, Option, pipe } from 'effect'

/**
 * @public
 */
export namespace Logger {
  export type Config = {
    readonly NODE_ENV: C.Config<Option.Option<string>>
  }
}

/**
 * @public
 */
export interface Layer extends Layer.Layer<never, never, never> {}

/**
 * @public
 */
export const layer: Layer = Layer.unwrapEffect(
  Effect.gen(function*() {
    const NODE_ENV = yield* pipe(Config.NODE_ENV, Effect.orDie)

    if (Option.isSome(NODE_ENV) && NODE_ENV.value === 'production') {
      return Layer.suspend(() => EffectLogger.json)
    }

    return Layer.suspend(() => EffectLogger.pretty)
  }),
)

/**
 * @public
 */
export const Config: Logger.Config = Object.freeze({
  NODE_ENV: pipe(
    C.string('NODE_ENV'),
    C.option,
  ),
})
