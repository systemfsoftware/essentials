# @systemfsoftware/aws

## 0.1.1

### Patch Changes

- fa2d7aa: chore: add api extractor

## 0.1.0

### Minor Changes

- 38462d7: BREAKING CHANGE: Restructure exports and remove files

  - Changed export style in `cloudfront/mod.ts`:
    - From: `export * from './cache-policy.js'`
    - To: `export * as CachePolicy from './cache-policy.js'`
    - Same change for `origin-request.js`
  - Modified main module exports in `mod.ts`:
    - Removed exports from `sdk.js` and `types.js`
    - Now only exports Cloudfront as a namespace
  - Deleted `sdk.ts` file, removing the `aws` object export
  - Deleted `types.ts` file, removing `Cloudfront` and `AWS` type definitions

  These changes significantly alter the package's API and will require updates in dependent code. Users will need to update their import statements and potentially restructure their use of the AWS package.

### Patch Changes

- chore: update deps

## 0.0.2

### Patch Changes

- 7c840b7: feat: add all cache policies and origin requests

## 0.0.1

### Patch Changes

- chore: setup package
