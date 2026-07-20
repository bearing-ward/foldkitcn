/// <reference types="vite/client" />

import { Array, Match as M, Option, Order, Schema as S, pipe } from 'effect'
import { ts } from 'foldkit/schema'

import {
  ComponentDocsArtifact,
  ComponentDocsIndex,
  OriginComponentProgressReport,
  RegistryIndex,
} from '#registry/schema'
import type {
  ComponentDocsArtifact as ComponentDocsArtifactType,
  ComponentDocsRoute,
  OriginComponentProgressReport as OriginComponentProgressReportType,
  RegistryIndexEntry,
  RegistryNamespace,
} from '#registry/schema'

import progressReportJson from '../docs/component-conversion-checklist.json'
import docsIndexJson from '../registry/docs/index.json'
import registryIndexJson from '../registry/index.json'

export const LoadedDocsData = ts('LoadedDocsData', {
  registry: RegistryIndex,
  docsIndex: ComponentDocsIndex,
  docsArtifacts: S.Array(ComponentDocsArtifact),
  progressReport: OriginComponentProgressReport,
})
export const FailedDocsData = ts('FailedDocsData', {
  message: S.String,
})
export const DocsData = S.Union([LoadedDocsData, FailedDocsData])
export type DocsData = typeof DocsData.Type

export type PublicComponent = Readonly<{
  entry: RegistryIndexEntry
  docsRoute: ComponentDocsRoute
  maybeDocsArtifact: Option.Option<ComponentDocsArtifactType>
}>

export type NamespaceGroup = Readonly<{
  namespace: RegistryNamespace
  label: string
  components: ReadonlyArray<PublicComponent>
}>

export type LoadedDocsDataValue = Readonly<{
  registry: typeof RegistryIndex.Type
  docsIndex: typeof ComponentDocsIndex.Type
  docsArtifacts: ReadonlyArray<ComponentDocsArtifactType>
  progressReport: OriginComponentProgressReportType
}>

const docsArtifactModules = import.meta.glob<unknown>(
  '../registry/docs/**/*.json',
  {
    eager: true,
    import: 'default',
  },
)

const docsArtifactModulePathFor = (route: ComponentDocsRoute): string =>
  `../${route.docsArtifactPath}`

const rawDocsArtifactFor = (route: ComponentDocsRoute): unknown => {
  const modulePath = docsArtifactModulePathFor(route)
  const rawArtifact = docsArtifactModules[modulePath]

  if (rawArtifact === undefined) {
    throw new Error(`Generated docs artifact is not importable: ${modulePath}`)
  }

  return rawArtifact
}

const decodeDocsArtifacts = (
  docsIndex: typeof ComponentDocsIndex.Type,
): ReadonlyArray<ComponentDocsArtifactType> =>
  pipe(
    docsIndex.routes,
    Array.map(route =>
      S.decodeUnknownSync(ComponentDocsArtifact)(rawDocsArtifactFor(route)),
    ),
  )

const namespaceLabels: Readonly<Record<RegistryNamespace, string>> = {
  'base-ui': 'Base UI',
  shadcn: 'shadcn',
  utils: 'Utilities',
  themes: 'Themes',
  blocks: 'Blocks',
  charts: 'Charts',
  local: 'Local',
}

const namespaceOrder: ReadonlyArray<RegistryNamespace> = [
  'base-ui',
  'shadcn',
  'utils',
  'themes',
  'blocks',
  'charts',
  'local',
]

const decodeDocsData = (): DocsData => {
  try {
    const docsIndex = S.decodeUnknownSync(ComponentDocsIndex)(docsIndexJson)

    return LoadedDocsData({
      registry: S.decodeUnknownSync(RegistryIndex)(registryIndexJson),
      docsIndex,
      docsArtifacts: decodeDocsArtifacts(docsIndex),
      progressReport: S.decodeUnknownSync(OriginComponentProgressReport)(
        progressReportJson,
      ),
    })
  } catch (error: unknown) {
    return FailedDocsData({
      message:
        error instanceof Error
          ? error.message
          : 'Generated registry artifacts could not be decoded.',
    })
  }
}

export const docsData = decodeDocsData()

export const namespaceLabel = (namespace: RegistryNamespace): string =>
  namespaceLabels[namespace]

const canRenderPublicComponent = (entry: RegistryIndexEntry): boolean =>
  entry.item.kind === 'component' &&
  (entry.item.lifecycle.availability === 'installable' ||
    entry.item.lifecycle.availability === 'preview')

const docsRouteFor = (
  docsIndex: typeof ComponentDocsIndex.Type,
  itemId: string,
): Option.Option<ComponentDocsRoute> =>
  Array.findFirst(docsIndex.routes, route => route.itemId === itemId)

const docsArtifactFor = (
  docsArtifacts: ReadonlyArray<ComponentDocsArtifactType>,
  itemId: string,
): Option.Option<ComponentDocsArtifactType> =>
  pipe(
    docsArtifacts,
    Array.findFirst(artifact => artifact.itemId === itemId),
  )

export const publicComponents = (
  data: DocsData,
): ReadonlyArray<PublicComponent> =>
  M.value(data).pipe(
    M.withReturnType<ReadonlyArray<PublicComponent>>(),
    M.tagsExhaustive({
      FailedDocsData: () => [],
      LoadedDocsData: ({ registry, docsIndex, docsArtifacts }) => {
        const initialComponents: Array<PublicComponent> = []

        return Array.reduce(registry.items, initialComponents, (acc, entry) => {
          if (!canRenderPublicComponent(entry)) {
            return acc
          }

          return Option.match(docsRouteFor(docsIndex, entry.item.id), {
            onNone: () => acc,
            onSome: docsRoute => [
              ...acc,
              {
                entry,
                docsRoute,
                maybeDocsArtifact: docsArtifactFor(
                  docsArtifacts,
                  entry.item.id,
                ),
              },
            ],
          })
        })
      },
    }),
  )

export const namespaceGroups = (
  data: DocsData,
): ReadonlyArray<NamespaceGroup> => {
  const components = publicComponents(data)
  const initialGroups: Array<NamespaceGroup> = []

  return Array.reduce(namespaceOrder, initialGroups, (groups, namespace) => {
    const namespaceComponents = pipe(
      components,
      Array.filter(component => component.entry.item.namespace === namespace),
      Array.sortWith(component => component.entry.item.name, Order.String),
    )

    return Array.match(namespaceComponents, {
      onEmpty: () => groups,
      onNonEmpty: () => [
        ...groups,
        {
          namespace,
          label: namespaceLabel(namespace),
          components: namespaceComponents,
        },
      ],
    })
  })
}

export const findPublicComponent = (
  data: DocsData,
  namespace: string,
  slug: string,
): Option.Option<PublicComponent> =>
  pipe(
    publicComponents(data),
    Array.findFirst(
      component => component.entry.item.id === `${namespace}/${slug}`,
    ),
  )

export const findRoutedComponent = (
  data: DocsData,
  namespace: string,
  slug: string,
): Option.Option<PublicComponent> =>
  M.value(data).pipe(
    M.withReturnType<Option.Option<PublicComponent>>(),
    M.tagsExhaustive({
      FailedDocsData: () => Option.none(),
      LoadedDocsData: ({ registry, docsIndex, docsArtifacts }) => {
        const itemId = `${namespace}/${slug}`

        return Option.flatMap(
          Array.findFirst(registry.items, entry => entry.item.id === itemId),
          entry =>
            Option.map(docsRouteFor(docsIndex, itemId), docsRoute => ({
              entry,
              docsRoute,
              maybeDocsArtifact: docsArtifactFor(docsArtifacts, itemId),
            })),
        )
      },
    }),
  )

export const generatedComponentCount = (data: DocsData): number =>
  publicComponents(data).length
