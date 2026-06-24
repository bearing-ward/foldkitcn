export interface ShadcnOriginCaseMetadata {
  readonly id: string
  readonly title: string
  readonly originFilePath: string
}

export const shadcnOriginCaseMetadata: ReadonlyArray<ShadcnOriginCaseMetadata> =
  [
    {
      id: 'button-default',
      title: 'Button default',
      originFilePath: 'repos/ui/apps/v4/examples/base/button-default.tsx',
    },
    {
      id: 'button-render',
      title: 'Button render',
      originFilePath: 'repos/ui/apps/v4/examples/base/button-render.tsx',
    },
  ]
