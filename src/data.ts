import { Array, Match as M, Option, Schema as S, pipe } from 'effect'
import { ts } from 'foldkit/schema'

import docsIndexJson from '../registry/docs/index.json'
import registryIndexJson from '../registry/index.json'
import { ComponentDocsIndex, RegistryIndex } from './registry/schema'
import type {
  ComponentDocsRoute,
  RegistryIndexEntry,
  RegistryNamespace,
} from './registry/schema'

export const LoadedDocsData = ts('LoadedDocsData', {
  registry: RegistryIndex,
  docsIndex: ComponentDocsIndex,
})
export const FailedDocsData = ts('FailedDocsData', {
  message: S.String,
})
export const DocsData = S.Union([LoadedDocsData, FailedDocsData])
export type DocsData = typeof DocsData.Type

export type PublicComponent = Readonly<{
  entry: RegistryIndexEntry
  docsRoute: ComponentDocsRoute
}>

export type NamespaceGroup = Readonly<{
  namespace: RegistryNamespace
  label: string
  components: ReadonlyArray<PublicComponent>
}>

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
    return LoadedDocsData({
      registry: S.decodeUnknownSync(RegistryIndex)(registryIndexJson),
      docsIndex: S.decodeUnknownSync(ComponentDocsIndex)(docsIndexJson),
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

export const publicComponents = (
  data: DocsData,
): ReadonlyArray<PublicComponent> =>
  M.value(data).pipe(
    M.withReturnType<ReadonlyArray<PublicComponent>>(),
    M.tagsExhaustive({
      FailedDocsData: () => [],
      LoadedDocsData: ({ registry, docsIndex }) => {
        const initialComponents: Array<PublicComponent> = []

        return Array.reduce(registry.items, initialComponents, (acc, entry) => {
          if (!canRenderPublicComponent(entry)) {
            return acc
          }

          return Option.match(docsRouteFor(docsIndex, entry.item.id), {
            onNone: () => acc,
            onSome: docsRoute => [...acc, { entry, docsRoute }],
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

export const generatedComponentCount = (data: DocsData): number =>
  publicComponents(data).length
