import { Config, Effect, Layer, Logger, Option, pipe } from 'effect'

export const LogLayer: Layer.Layer<never, never, never> = Layer.unwrapEffect(
  Effect.gen(function*() {
     const NODE_ENV = yield* pipe(
      Config.string('NODE_ENV'),
      Config.option,
      Effect.orDie,
    )

    if (Option.isSome(NODE_ENV) && NODE_ENV.value === 'production') {
      return Layer.suspend(() => Logger.json)
    }

    return Layer.suspend(() => Logger.pretty)
  }),
)
