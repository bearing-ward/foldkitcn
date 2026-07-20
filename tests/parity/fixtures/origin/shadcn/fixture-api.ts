import type { OriginFixtureSnapshot } from './snapshot'

export interface ShadcnOriginFixtureApi {
  readonly selectedCase: Readonly<{
    id: string
    originFilePath: string
    title: string
  }>
  readonly captureSnapshot: () => OriginFixtureSnapshot
}
