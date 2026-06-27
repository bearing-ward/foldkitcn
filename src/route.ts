import { Schema as S, pipe } from 'effect'
import {
  literal,
  mapTo,
  oneOf,
  parseUrlWithFallback,
  r,
  root,
  slash,
  string,
} from 'foldkit/route'

export const HomeRoute = r('Home')
export const DocsRoute = r('Docs')
export const ComponentsIndexRoute = r('ComponentsIndex')
export const ComponentsNamespaceRoute = r('ComponentsNamespace', {
  namespace: S.String,
})
export const ComponentDetailRoute = r('ComponentDetail', {
  namespace: S.String,
  slug: S.String,
})
export const RegistryRoute = r('Registry')
export const RegistrySchemaRoute = r('RegistrySchema')
export const RegistryLifecycleRoute = r('RegistryLifecycle')
export const RoadmapRoute = r('Roadmap')
export const NotFoundRoute = r('NotFound', { path: S.String })

export const AppRoute = S.Union([
  HomeRoute,
  DocsRoute,
  ComponentsIndexRoute,
  ComponentsNamespaceRoute,
  ComponentDetailRoute,
  RegistryRoute,
  RegistrySchemaRoute,
  RegistryLifecycleRoute,
  RoadmapRoute,
  NotFoundRoute,
])
export type AppRoute = typeof AppRoute.Type

export const homeRouter = pipe(root, mapTo(HomeRoute))
export const docsRouter = pipe(literal('docs'), mapTo(DocsRoute))
export const componentsIndexRouter = pipe(
  literal('components'),
  mapTo(ComponentsIndexRoute),
)
export const componentsNamespaceRouter = pipe(
  literal('components'),
  slash(string('namespace')),
  mapTo(ComponentsNamespaceRoute),
)
export const componentDetailRouter = pipe(
  literal('components'),
  slash(string('namespace')),
  slash(string('slug')),
  mapTo(ComponentDetailRoute),
)
export const registryRouter = pipe(literal('registry'), mapTo(RegistryRoute))
export const registrySchemaRouter = pipe(
  literal('registry'),
  slash(literal('schema')),
  mapTo(RegistrySchemaRoute),
)
export const registryLifecycleRouter = pipe(
  literal('registry'),
  slash(literal('lifecycle')),
  mapTo(RegistryLifecycleRoute),
)
export const roadmapRouter = pipe(literal('roadmap'), mapTo(RoadmapRoute))

export const routeParser = oneOf(
  componentDetailRouter,
  componentsNamespaceRouter,
  componentsIndexRouter,
  registrySchemaRouter,
  registryLifecycleRouter,
  registryRouter,
  roadmapRouter,
  docsRouter,
  homeRouter,
)

export const urlToAppRoute = parseUrlWithFallback(routeParser, NotFoundRoute)
