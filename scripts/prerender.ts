import { Console, Effect, Schema as S } from 'effect'
import { chromium } from 'playwright'
import type { Browser } from 'playwright'

import docsIndexJson from '../registry/docs/index.json'
import registryIndexJson from '../registry/index.json'
import { ComponentDocsIndex, RegistryIndex } from '../src/registry/schema'
import type {
  RegistryIndexEntry,
  RegistryNamespace,
} from '../src/registry/schema'

import { spawn } from 'node:child_process'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

const DIST_DIR = 'dist'
const ROOT_PLACEHOLDER = '<div id="root"></div>'
const PREVIEW_HOST = '127.0.0.1'
const PREVIEW_PORT = 4174
const PREVIEW_BASE_URL = `http://${PREVIEW_HOST}:${PREVIEW_PORT}`
const SERVER_READY_ATTEMPTS = 80
const SERVER_READY_DELAY_MS = 250
const titlePattern = /<title>.*?<\/title>/su
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

type RouteSection = 'home' | 'docs' | 'components' | 'registry' | 'roadmap'
type RouteMetadata = Readonly<{
  title: string
  description: string
  section: RouteSection
}>
type RouteInventoryEntry = Readonly<{
  path: string
  outputPath: string
  metadata: RouteMetadata
}>

const pageTitle = (title: string): string =>
  title === 'Foldkit CN' ? title : `${title} | Foldkit CN`

const routeToOutputPath = (urlPath: string): string =>
  urlPath === '/' ? 'index.html' : `${urlPath.slice(1)}/index.html`

const routeEntry = (
  urlPath: string,
  metadata: RouteMetadata,
): RouteInventoryEntry => ({
  path: urlPath,
  outputPath: routeToOutputPath(urlPath),
  metadata,
})

const canRenderPublicComponent = (entry: RegistryIndexEntry): boolean =>
  entry.item.kind === 'component' &&
  (entry.item.lifecycle.availability === 'installable' ||
    entry.item.lifecycle.availability === 'preview')

const publicComponentEntries = (): ReadonlyArray<RegistryIndexEntry> => {
  const registry = S.decodeUnknownSync(RegistryIndex)(registryIndexJson)
  const docsIndex = S.decodeUnknownSync(ComponentDocsIndex)(docsIndexJson)
  const documentedItemIds = new Set(docsIndex.routes.map(route => route.itemId))

  return registry.items.filter(
    entry =>
      canRenderPublicComponent(entry) && documentedItemIds.has(entry.item.id),
  )
}

const namespaceEntry = (namespace: RegistryNamespace): RouteInventoryEntry =>
  routeEntry(`/components/${namespace}`, {
    title: pageTitle(`${namespaceLabels[namespace]} components`),
    description:
      'Public component rows for this registry namespace, generated from registry docs artifacts.',
    section: 'components',
  })

const componentEntry = (entry: RegistryIndexEntry): RouteInventoryEntry =>
  routeEntry(`/components/${entry.item.id}`, {
    title: pageTitle(entry.item.name),
    description: entry.item.description,
    section: 'components',
  })

const routeInventory = (): ReadonlyArray<RouteInventoryEntry> => {
  const components = publicComponentEntries()
  const namespaces = namespaceOrder.filter(namespace =>
    components.some(component => component.item.namespace === namespace),
  )

  return [
    routeEntry('/', {
      title: 'Foldkit CN',
      description:
        'Foldkit-native documentation for installable component registry artifacts.',
      section: 'home',
    }),
    routeEntry('/docs', {
      title: pageTitle('Documentation overview'),
      description:
        'Generated registry data, authored guidance, and stable component docs entry points.',
      section: 'docs',
    }),
    routeEntry('/components', {
      title: pageTitle('Components'),
      description:
        'Installable and preview components from the generated registry and docs indexes.',
      section: 'components',
    }),
    ...namespaces.map(namespaceEntry),
    ...components.map(componentEntry),
    routeEntry('/registry', {
      title: pageTitle('Registry'),
      description:
        'Generated registry files are the website boundary for component docs and install metadata.',
      section: 'registry',
    }),
    routeEntry('/registry/schema', {
      title: pageTitle('Registry Schema'),
      description:
        'Schema-backed registry artifacts define what the docs shell can trust.',
      section: 'registry',
    }),
    routeEntry('/registry/lifecycle', {
      title: pageTitle('Registry Lifecycle'),
      description:
        'Lifecycle data explains what can be installed, previewed, documented, or deferred.',
      section: 'registry',
    }),
    routeEntry('/roadmap', {
      title: pageTitle('Roadmap'),
      description:
        'Component availability, next candidates, and blocked work from the structured progress report.',
      section: 'roadmap',
    }),
  ]
}

const waitForPreviewServerAttempt = async (
  attemptsRemaining: number,
): Promise<void> => {
  if (attemptsRemaining <= 0) {
    throw new Error('Timed out waiting for Vite preview.')
  }

  let isReady = false

  try {
    const response = await fetch(PREVIEW_BASE_URL)
    isReady = response.ok
  } catch {
    isReady = false
  }

  if (isReady) {
    return
  }

  await sleep(SERVER_READY_DELAY_MS)
  return waitForPreviewServerAttempt(attemptsRemaining - 1)
}

const startPreviewServer = (): ChildProcessWithoutNullStreams =>
  spawn(
    'bun',
    [
      'run',
      'preview',
      '--',
      '--host',
      PREVIEW_HOST,
      '--port',
      String(PREVIEW_PORT),
      '--strictPort',
    ],
    { stdio: 'pipe' },
  )

const routeTopLevelDirectory = (entry: RouteInventoryEntry): string =>
  entry.path.split('/')[1] ?? ''

const prerenderTopLevelDirectories = (
  routes: ReadonlyArray<RouteInventoryEntry>,
): ReadonlyArray<string> => [
  ...new Set(
    routes
      .map(routeTopLevelDirectory)
      .filter(directory => directory.length > 0),
  ),
]

const clearPrerenderedRoutes = (
  routes: ReadonlyArray<RouteInventoryEntry>,
): Effect.Effect<void, unknown> =>
  Effect.tryPromise({
    try: async () => {
      await Promise.all(
        prerenderTopLevelDirectories(routes).map(directory =>
          rm(path.resolve(DIST_DIR, directory), {
            recursive: true,
            force: true,
          }),
        ),
      )
    },
    catch: error => error,
  })

const readBaseHtml = Effect.tryPromise({
  try: () => readFile(path.resolve(DIST_DIR, 'index.html'), 'utf-8'),
  catch: error => error,
})

const escapedTitleText = (title: string): string =>
  title
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const injectRenderedHtml = (
  baseHtml: string,
  renderedHtml: string,
  title: string,
): string =>
  baseHtml
    .replace(ROOT_PLACEHOLDER, `<div id="root">${renderedHtml}</div>`)
    .replace(titlePattern, `<title>${escapedTitleText(title)}</title>`)

const waitForPreviewServer = Effect.tryPromise({
  try: () => waitForPreviewServerAttempt(SERVER_READY_ATTEMPTS),
  catch: error => error,
})

const previewServerResource = Effect.acquireRelease(
  Effect.sync(startPreviewServer).pipe(Effect.tap(() => waitForPreviewServer)),
  child =>
    Effect.sync(() => {
      child.kill()
    }),
)

const browserResource = Effect.acquireRelease(
  Effect.tryPromise({
    try: () => chromium.launch(),
    catch: error => error,
  }),
  browser => Effect.promise(() => browser.close()),
)

const captureRouteHtml = (
  browser: Browser,
  entry: RouteInventoryEntry,
): Effect.Effect<string, unknown> =>
  Effect.acquireUseRelease(
    Effect.tryPromise({
      try: () => browser.newPage(),
      catch: error => error,
    }),
    page =>
      Effect.gen(function* captureRouteHtmlProgram() {
        yield* Effect.tryPromise({
          try: () => page.goto(PREVIEW_BASE_URL),
          catch: error => error,
        })
        yield* Effect.tryPromise({
          try: () =>
            page.evaluate(urlPath => {
              window.history.replaceState(null, '', urlPath)
              window.dispatchEvent(new CustomEvent('foldkit:urlchange'))
            }, entry.path),
          catch: error => error,
        })
        yield* Effect.tryPromise({
          try: () =>
            page.waitForFunction(
              expectedTitle =>
                document.title === expectedTitle &&
                document.querySelector('#main-content h1') !== null,
              entry.metadata.title,
            ),
          catch: error => error,
        })

        return yield* Effect.tryPromise({
          try: () =>
            page.evaluate(
              () => document.body.firstElementChild?.outerHTML ?? '',
            ),
          catch: error => error,
        })
      }),
    page => Effect.promise(() => page.close()),
  )

const writeRouteHtml = (
  outputPath: string,
  html: string,
): Effect.Effect<void, unknown> =>
  Effect.tryPromise({
    try: async () => {
      const absolutePath = path.resolve(DIST_DIR, outputPath)

      await mkdir(path.dirname(absolutePath), { recursive: true })
      await writeFile(absolutePath, html)
    },
    catch: error => error,
  })

const prerenderRoute =
  (browser: Browser, baseHtml: string) => (entry: RouteInventoryEntry) =>
    Effect.gen(function* prerenderRouteProgram() {
      const renderedHtml = yield* captureRouteHtml(browser, entry)
      const html = injectRenderedHtml(
        baseHtml,
        renderedHtml,
        entry.metadata.title,
      )
      yield* writeRouteHtml(entry.outputPath, html)
      yield* Console.log(`  ✓ ${entry.path}`)
    })

const program = Effect.scoped(
  Effect.gen(function* prerenderProgram() {
    const routes = routeInventory()

    yield* Console.log(`Prerendering ${routes.length} routes...`)
    const baseHtml = yield* readBaseHtml
    yield* clearPrerenderedRoutes(routes)
    yield* previewServerResource
    const browser = yield* browserResource
    yield* Effect.forEach(prerenderRoute(browser, baseHtml), {
      concurrency: 4,
    })(routes)
    yield* Console.log(`Prerendered ${routes.length} routes.`)
  }),
)

try {
  await Effect.runPromise(program)
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)

  process.stderr.write(`${message}\n`)
  process.exitCode = 1
}
