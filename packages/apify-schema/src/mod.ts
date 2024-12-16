import { ACTOR_JOB_STATUSES, WEBHOOK_EVENT_TYPE_GROUPS } from '@apify/consts'
import { Schema as S } from 'effect'

/**
 * @public
 */
export const ActorRunStats = S.Struct({
  inputBodyLen: S.Number,
  restartCount: S.Number,
  resurrectCount: S.Number,
  memAvgBytes: S.Number,
  memMaxBytes: S.Number,
  memCurrentBytes: S.Number,
  cpuAvgUsage: S.Number,
  cpuMaxUsage: S.Number,
  cpuCurrentUsage: S.Number,
  netRxBytes: S.Number,
  netTxBytes: S.Number,
  durationMillis: S.Number,
  runTimeSecs: S.Number,
  metamorph: S.Number,
  computeUnits: S.Number,
})

/**
 * @public
 */
export type ActorRunStats = S.Schema.Type<typeof ActorRunStats>

/**
 * @public
 */
export const ActorRunMeta = S.Struct({
  origin: S.String,
  clientIp: S.optionalWith(S.String, { nullable: true }),
  userAgent: S.String,
})

/**
 * @public
 */
export type ActorRunMeta = S.Schema.Type<typeof ActorRunMeta>

/**
 * @public
 */
export const ActorRunResult = S.Struct({
  userId: S.String,
  resource: S.Struct({
    id: S.String,
    meta: ActorRunMeta,
    actId: S.optionalWith(S.String, { nullable: true }),
    status: S.Literal(...Object.values(ACTOR_JOB_STATUSES)),
    buildId: S.String,
    startedAt: S.Date,
    finishedAt: S.Date,
    buildNumber: S.String,
    usageTotalUsd: S.optionalWith(S.Number, { nullable: true }),
    defaultDatasetId: S.String,
    defaultRequestQueueId: S.String,
    defaultKeyValueStoreId: S.String,
  }),
  createdAt: S.Date,
  eventData: S.Struct({
    actorId: S.String,
    actorRunId: S.String,
  }),
  eventType: S.Literal(...Object.values(WEBHOOK_EVENT_TYPE_GROUPS.ACTOR_RUN_TERMINAL)),
})

/**
 * @public
 */
export type ActorRunResult = S.Schema.Type<typeof ActorRunResult>
