import type * as cloudfront from './cloudfront/mod.js'

export type Cloudfront = typeof cloudfront

export type AWS = {
  readonly cloudfront: Cloudfront
}
