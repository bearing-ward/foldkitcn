import { Schema as S } from 'effect'

export const RegistrySchemaVersion = S.Literal(1)
export type RegistrySchemaVersion = typeof RegistrySchemaVersion.Type

export const RegistryNamespace = S.Literals([
  'base-ui',
  'shadcn',
  'utils',
  'themes',
  'blocks',
  'charts',
  'local',
])
export type RegistryNamespace = typeof RegistryNamespace.Type

export const RegistryItemKind = S.Literals([
  'component',
  'utility',
  'theme',
  'block',
  'chart',
  'example',
])
export type RegistryItemKind = typeof RegistryItemKind.Type

export const ImplementationStatus = S.Literals([
  'planned',
  'dossier-ready',
  'implemented',
  'deprecated',
])
export type ImplementationStatus = typeof ImplementationStatus.Type

export const ParityStatus = S.Literals([
  'not-started',
  'partial',
  'accepted',
  'waived',
])
export type ParityStatus = typeof ParityStatus.Type

export const DriftStatus = S.Literals(['current', 'upstream-drift', 'unknown'])
export type DriftStatus = typeof DriftStatus.Type

export const Availability = S.Literals(['private', 'preview', 'installable'])
export type Availability = typeof Availability.Type

export const Lifecycle = S.Struct({
  implementationStatus: ImplementationStatus,
  parityStatus: ParityStatus,
  driftStatus: DriftStatus,
  availability: Availability,
})
export type Lifecycle = typeof Lifecycle.Type

export const DependencyClassification = S.Literals([
  'registry-local',
  'allowed-runtime',
  'dev-or-fixture-only',
  'replace-with-foldkit',
  'reject-or-defer',
])
export type DependencyClassification = typeof DependencyClassification.Type

export const DependencyRecord = S.Struct({
  specifier: S.String,
  classification: DependencyClassification,
  target: S.String,
  reason: S.String,
})
export type DependencyRecord = typeof DependencyRecord.Type

export const DependencyGraph = S.Struct({
  registry: S.Array(DependencyRecord),
  runtime: S.Array(DependencyRecord),
  development: S.Array(DependencyRecord),
})
export type DependencyGraph = typeof DependencyGraph.Type

export const OriginKind = S.Literals([
  'base-ui',
  'shadcn',
  'components.build',
  'local',
  'other',
])
export type OriginKind = typeof OriginKind.Type

export const OriginProvenance = S.Struct({
  originKind: OriginKind,
  originName: S.String,
  docsUrl: S.String,
  sourceUrl: S.String,
  localRepoPath: S.String,
  gitRef: S.String,
  inventoryHash: S.String,
  sourcePaths: S.Array(S.String),
  docsPaths: S.Array(S.String),
  examplePaths: S.Array(S.String),
  testPaths: S.Array(S.String),
})
export type OriginProvenance = typeof OriginProvenance.Type

export const OriginResolution = S.Struct({
  originKind: OriginKind,
  originName: S.String,
  docsUrl: S.String,
  localRepoPath: S.String,
  pinnedRef: S.String,
  sourcePaths: S.Array(S.String),
  docsPaths: S.Array(S.String),
  demoPaths: S.Array(S.String),
  testPaths: S.Array(S.String),
  specPaths: S.Array(S.String),
  apiReferencePaths: S.Array(S.String),
  styleVariantPaths: S.Array(S.String),
  registryDependencyHints: S.Array(S.String),
  runtimeDependencyHints: S.Array(S.String),
  confidence: S.Literals(['high', 'medium', 'low']),
  unresolvedQuestions: S.Array(S.String),
})
export type OriginResolution = typeof OriginResolution.Type

export const ExampleManifest = S.Struct({
  id: S.String,
  title: S.String,
  description: S.String,
  sourcePath: S.String,
  kind: S.Literals(['origin-fixture', 'foldkit-fixture', 'demo', 'docs']),
})
export type ExampleManifest = typeof ExampleManifest.Type

export const ThemeToken = S.Struct({
  name: S.String,
  value: S.String,
  description: S.String,
})
export type ThemeToken = typeof ThemeToken.Type

export const ThemePackManifest = S.Struct({
  id: S.String,
  name: S.String,
  coveredNamespaces: S.Array(RegistryNamespace),
  coveredItems: S.Array(S.String),
  tokens: S.Array(ThemeToken),
})
export type ThemePackManifest = typeof ThemePackManifest.Type

export const ParityContract = S.Struct({
  itemId: S.String,
  originFixturePath: S.String,
  foldkitFixturePath: S.String,
  requiredComparisons: S.Array(
    S.Literals([
      'class-tokens',
      'attributes',
      'dom-structure',
      'computed-style',
      'colors',
      'dimensions',
      'bounding-box',
      'keyboard-behavior',
    ]),
  ),
  acceptedDeviationIds: S.Array(S.String),
})
export type ParityContract = typeof ParityContract.Type

export const DeviationRecord = S.Struct({
  id: S.String,
  summary: S.String,
  required: S.Boolean,
  status: S.Literals(['proposed', 'accepted', 'rejected', 'waived']),
  rationale: S.String,
})
export type DeviationRecord = typeof DeviationRecord.Type

export const RegistryItemManifest = S.Struct({
  schemaVersion: RegistrySchemaVersion,
  id: S.String,
  namespace: RegistryNamespace,
  name: S.String,
  kind: RegistryItemKind,
  description: S.String,
  sourceRoot: S.String,
  installableSourcePaths: S.Array(S.String),
  consumedThemeTokens: S.Array(S.String),
  originProvenance: S.Array(OriginProvenance),
  dependencies: DependencyGraph,
  examples: S.Array(ExampleManifest),
  parity: ParityContract,
  lifecycle: Lifecycle,
  deviations: S.Array(DeviationRecord),
})
export type RegistryItemManifest = typeof RegistryItemManifest.Type

export const BuildArtifactRole = S.Literals([
  'index',
  'manifest',
  'source',
  'style',
  'docs',
  'example',
])
export type BuildArtifactRole = typeof BuildArtifactRole.Type

export const BuildArtifactFile = S.Struct({
  path: S.String,
  sha256: S.String,
  sizeBytes: S.Number,
  role: BuildArtifactRole,
})
export type BuildArtifactFile = typeof BuildArtifactFile.Type

export const BuildArtifactManifest = S.Struct({
  itemId: S.String,
  manifestHash: S.String,
  generatedAt: S.String,
  files: S.Array(BuildArtifactFile),
})
export type BuildArtifactManifest = typeof BuildArtifactManifest.Type

export const RegistryIndexEntry = S.Struct({
  item: RegistryItemManifest,
  manifestHash: S.String,
  artifacts: S.Array(BuildArtifactFile),
})
export type RegistryIndexEntry = typeof RegistryIndexEntry.Type

export const RegistryIndex = S.Struct({
  schemaVersion: RegistrySchemaVersion,
  generatedAt: S.String,
  sourceRoot: S.String,
  items: S.Array(RegistryIndexEntry),
})
export type RegistryIndex = typeof RegistryIndex.Type
