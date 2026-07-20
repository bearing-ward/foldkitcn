import type { OriginFixtureSnapshot } from '../../origin/shadcn/snapshot'

export interface ShadcnFoldkitFixtureApi {
  readonly selectedCase: Readonly<{
    id: string
    originFilePath: string
    title: string
  }>
  readonly captureSnapshot: () => OriginFixtureSnapshot
}
