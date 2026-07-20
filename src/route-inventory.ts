import { Array, Match as M, Option, Schema as S, pipe } from 'effect'

import type { RegistryNamespace } from '#registry/schema'

import { namespaceGroups, namespaceLabel, publicComponents } from './data'
import type { DocsData, PublicComponent } from './data'
import {
  ComponentDetailRoute,
  ComponentsIndexRoute,
  ComponentsNamespaceRoute,
  DocsRoute,
  HomeRoute,
  RegistryLifecycleRoute,
  RegistryRoute,
  RegistrySchemaRoute,
  RoadmapRoute,
  componentDetailRouter,
  componentsIndexRouter,
  componentsNamespaceRouter,
  docsRouter,
  homeRouter,
  registryLifecycleRouter,
  registryRouter,
  registrySchemaRouter,
  roadmapRouter,
} from './route'
import type { AppRoute } from './route'

export const RouteSection = S.Literals([
  'home',
  'docs',
  'components',
  'registry',
  'roadmap',
])
export type RouteSection = typeof RouteSection.Type

export const RouteMetadata = S.Struct({
  title: S.String,
  description: S.String,
  section: RouteSection,
})
export type RouteMetadata = typeof RouteMetadata.Type

const makeRouteMetadata = (metadata: RouteMetadata): RouteMetadata => metadata

export type RouteInventoryEntry = Readonly<{
  route: AppRoute
  path: string
  metadata: RouteMetadata
}>

const pageTitle = (title: string): string =>
  title === 'Foldkit CN' ? title : `${title} | Foldkit CN`

const componentSlug = (component: PublicComponent): string =>
  component.entry.item.id.split('/')[1] ?? ''

const componentRoute = (
  component: PublicComponent,
): typeof ComponentDetailRoute.Type =>
  ComponentDetailRoute({
    namespace: component.entry.item.namespace,
    slug: componentSlug(component),
  })

export const routeToUrlPath = (route: AppRoute): string =>
  M.value(route).pipe(
    M.withReturnType<string>(),
    M.tagsExhaustive({
      Home: () => homeRouter({}),
      Docs: () => docsRouter({}),
      ComponentsIndex: () => componentsIndexRouter({}),
      ComponentsNamespace: ({ namespace }) =>
        componentsNamespaceRouter({ namespace }),
      ComponentDetail: ({ namespace, slug }) =>
        componentDetailRouter({ namespace, slug }),
      Registry: () => registryRouter({}),
      RegistrySchema: () => registrySchemaRouter({}),
      RegistryLifecycle: () => registryLifecycleRouter({}),
      Roadmap: () => roadmapRouter({}),
      NotFound: ({ path }) => path,
    }),
  )

export const routeToOutputPath = (route: AppRoute): string => {
  const urlPath = routeToUrlPath(route)

  return urlPath === '/' ? 'index.html' : `${urlPath.slice(1)}/index.html`
}

const routeEntry = (
  route: AppRoute,
  metadata: RouteMetadata,
): RouteInventoryEntry => ({
  route,
  path: routeToUrlPath(route),
  metadata,
})

const namespaceEntry = (namespace: RegistryNamespace): RouteInventoryEntry =>
  routeEntry(
    ComponentsNamespaceRoute({ namespace }),
    makeRouteMetadata({
      title: pageTitle(`${namespaceLabel(namespace)} components`),
      description:
        'Public component rows for this registry namespace, generated from registry docs artifacts.',
      section: 'components',
    }),
  )

const componentEntry = (component: PublicComponent): RouteInventoryEntry =>
  routeEntry(
    componentRoute(component),
    makeRouteMetadata({
      title: pageTitle(component.entry.item.name),
      description: component.entry.item.description,
      section: 'components',
    }),
  )

const staticStartEntries: ReadonlyArray<RouteInventoryEntry> = [
  routeEntry(
    HomeRoute(),
    makeRouteMetadata({
      title: 'Foldkit CN',
      description:
        'Foldkit-native documentation for installable component registry artifacts.',
      section: 'home',
    }),
  ),
  routeEntry(
    DocsRoute(),
    makeRouteMetadata({
      title: pageTitle('Documentation overview'),
      description:
        'Generated registry data, authored guidance, and stable component docs entry points.',
      section: 'docs',
    }),
  ),
  routeEntry(
    ComponentsIndexRoute(),
    makeRouteMetadata({
      title: pageTitle('Components'),
      description:
        'Installable and preview components from the generated registry and docs indexes.',
      section: 'components',
    }),
  ),
]

const staticEndEntries: ReadonlyArray<RouteInventoryEntry> = [
  routeEntry(
    RegistryRoute(),
    makeRouteMetadata({
      title: pageTitle('Registry'),
      description:
        'Generated registry files are the website boundary for component docs and install metadata.',
      section: 'registry',
    }),
  ),
  routeEntry(
    RegistrySchemaRoute(),
    makeRouteMetadata({
      title: pageTitle('Registry Schema'),
      description:
        'Schema-backed registry artifacts define what the docs shell can trust.',
      section: 'registry',
    }),
  ),
  routeEntry(
    RegistryLifecycleRoute(),
    makeRouteMetadata({
      title: pageTitle('Registry Lifecycle'),
      description:
        'Lifecycle data explains what can be installed, previewed, documented, or deferred.',
      section: 'registry',
    }),
  ),
  routeEntry(
    RoadmapRoute(),
    makeRouteMetadata({
      title: pageTitle('Roadmap'),
      description:
        'Component availability, next candidates, and blocked work from the structured progress report.',
      section: 'roadmap',
    }),
  ),
]

export const routeInventory = (
  data: DocsData,
): ReadonlyArray<RouteInventoryEntry> =>
  pipe(
    staticStartEntries,
    Array.appendAll(
      Array.map(namespaceGroups(data), group =>
        namespaceEntry(group.namespace),
      ),
    ),
    Array.appendAll(Array.map(publicComponents(data), componentEntry)),
    Array.appendAll(staticEndEntries),
  )

export const routeMetadataForRoute = (
  data: DocsData,
  route: AppRoute,
): Option.Option<RouteMetadata> => {
  const path = routeToUrlPath(route)

  return pipe(
    routeInventory(data),
    Array.findFirst(entry => entry.path === path),
    Option.map(entry => entry.metadata),
  )
}

export const fallbackRouteMetadata = (route: AppRoute): RouteMetadata =>
  M.value(route).pipe(
    M.withReturnType<RouteMetadata>(),
    M.tagsExhaustive({
      Home: () =>
        makeRouteMetadata({
          title: 'Foldkit CN',
          description:
            'Foldkit-native documentation for installable component registry artifacts.',
          section: 'home',
        }),
      Docs: () =>
        makeRouteMetadata({
          title: pageTitle('Documentation overview'),
          description: 'Generated registry data and authored guidance.',
          section: 'docs',
        }),
      ComponentsIndex: () =>
        makeRouteMetadata({
          title: pageTitle('Components'),
          description: 'Public component docs generated from registry data.',
          section: 'components',
        }),
      ComponentsNamespace: ({ namespace }) =>
        makeRouteMetadata({
          title: pageTitle(`${namespace} components`),
          description: 'Public component rows for this registry namespace.',
          section: 'components',
        }),
      ComponentDetail: ({ namespace, slug }) =>
        makeRouteMetadata({
          title: pageTitle(`${namespace}/${slug}`),
          description: 'Generated component documentation.',
          section: 'components',
        }),
      Registry: () =>
        makeRouteMetadata({
          title: pageTitle('Registry'),
          description: 'Generated registry files are the website boundary.',
          section: 'registry',
        }),
      RegistrySchema: () =>
        makeRouteMetadata({
          title: pageTitle('Registry Schema'),
          description: 'Schema-backed registry artifacts.',
          section: 'registry',
        }),
      RegistryLifecycle: () =>
        makeRouteMetadata({
          title: pageTitle('Registry Lifecycle'),
          description: 'Registry lifecycle data.',
          section: 'registry',
        }),
      Roadmap: () =>
        makeRouteMetadata({
          title: pageTitle('Roadmap'),
          description: 'Component availability and blocked work.',
          section: 'roadmap',
        }),
      NotFound: () =>
        makeRouteMetadata({
          title: pageTitle('Page Not Found'),
          description: 'The requested path was not found.',
          section: 'docs',
        }),
    }),
  )
