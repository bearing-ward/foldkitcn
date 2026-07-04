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
import type { Url } from 'foldkit/url'

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

const normalizeBasePath = (basePath: string): string => {
  if (basePath === '/') {
    return '/'
  }

  if (!basePath.startsWith('/') || !basePath.endsWith('/')) {
    throw new Error(`Invalid deployment base path: ${basePath}`)
  }

  return basePath
}

const deploymentBasePath = normalizeBasePath(import.meta.env.BASE_URL ?? '/')

const prefixDeploymentBase = (
  pathname: string,
  basePath: string = deploymentBasePath,
): string => {
  const normalizedBasePath = normalizeBasePath(basePath)

  if (normalizedBasePath === '/') {
    return pathname
  }

  if (pathname === normalizedBasePath.slice(0, -1)) {
    return normalizedBasePath
  }

  if (!pathname.startsWith('/')) {
    return `${normalizedBasePath.slice(0, -1)}/${pathname}`
  }

  if (pathname.startsWith(normalizedBasePath)) {
    return pathname
  }

  return `${normalizedBasePath.slice(0, -1)}${pathname}`
}

export const stripDeploymentBaseFromPathname = (
  pathname: string,
  basePath: string = deploymentBasePath,
): string => {
  const normalizedBasePath = normalizeBasePath(basePath)

  if (normalizedBasePath === '/') {
    return pathname
  }

  const basePathWithoutTrailingSlash = normalizedBasePath.slice(0, -1)

  if (pathname === basePathWithoutTrailingSlash) {
    return '/'
  }

  if (!pathname.startsWith(normalizedBasePath)) {
    return pathname
  }

  const normalizedPathname = pathname.slice(basePathWithoutTrailingSlash.length)

  return normalizedPathname.length === 0 ? '/' : normalizedPathname
}

export const normalizeUrlForRouting = (
  url: Url,
  basePath: string = deploymentBasePath,
): Url => ({
  ...url,
  pathname: stripDeploymentBaseFromPathname(url.pathname, basePath),
})

const homeRouteParser = pipe(root, mapTo(HomeRoute))
const docsRouteParser = pipe(literal('docs'), mapTo(DocsRoute))
const componentsIndexRouteParser = pipe(
  literal('components'),
  mapTo(ComponentsIndexRoute),
)
const componentsNamespaceRouteParser = pipe(
  literal('components'),
  slash(string('namespace')),
  mapTo(ComponentsNamespaceRoute),
)
const componentDetailRouteParser = pipe(
  literal('components'),
  slash(string('namespace')),
  slash(string('slug')),
  mapTo(ComponentDetailRoute),
)
const registryRouteParser = pipe(literal('registry'), mapTo(RegistryRoute))
const registrySchemaRouteParser = pipe(
  literal('registry'),
  slash(literal('schema')),
  mapTo(RegistrySchemaRoute),
)
const registryLifecycleRouteParser = pipe(
  literal('registry'),
  slash(literal('lifecycle')),
  mapTo(RegistryLifecycleRoute),
)
const roadmapRouteParser = pipe(literal('roadmap'), mapTo(RoadmapRoute))

export const homeRouter = (
  route: Parameters<typeof homeRouteParser>[0],
  basePath?: string,
) => prefixDeploymentBase(homeRouteParser(route), basePath)

export const docsRouter = (
  route: Parameters<typeof docsRouteParser>[0],
  basePath?: string,
) => prefixDeploymentBase(docsRouteParser(route), basePath)

export const componentsIndexRouter = (
  route: Parameters<typeof componentsIndexRouteParser>[0],
  basePath?: string,
) => prefixDeploymentBase(componentsIndexRouteParser(route), basePath)

export const componentsNamespaceRouter = (
  route: Parameters<typeof componentsNamespaceRouteParser>[0],
  basePath?: string,
) => prefixDeploymentBase(componentsNamespaceRouteParser(route), basePath)

export const componentDetailRouter = (
  route: Parameters<typeof componentDetailRouteParser>[0],
  basePath?: string,
) => prefixDeploymentBase(componentDetailRouteParser(route), basePath)

export const registryRouter = (
  route: Parameters<typeof registryRouteParser>[0],
  basePath?: string,
) => prefixDeploymentBase(registryRouteParser(route), basePath)

export const registrySchemaRouter = (
  route: Parameters<typeof registrySchemaRouteParser>[0],
  basePath?: string,
) => prefixDeploymentBase(registrySchemaRouteParser(route), basePath)

export const registryLifecycleRouter = (
  route: Parameters<typeof registryLifecycleRouteParser>[0],
  basePath?: string,
) => prefixDeploymentBase(registryLifecycleRouteParser(route), basePath)

export const roadmapRouter = (
  route: Parameters<typeof roadmapRouteParser>[0],
  basePath?: string,
) => prefixDeploymentBase(roadmapRouteParser(route), basePath)

export const routeParser = oneOf(
  componentDetailRouteParser,
  componentsNamespaceRouteParser,
  componentsIndexRouteParser,
  registrySchemaRouteParser,
  registryLifecycleRouteParser,
  registryRouteParser,
  roadmapRouteParser,
  docsRouteParser,
  homeRouteParser,
)

export const urlToAppRoute = (url: Url, basePath?: string) =>
  parseUrlWithFallback(
    routeParser,
    NotFoundRoute,
  )(normalizeUrlForRouting(url, basePath))
