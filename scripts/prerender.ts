import { Console, Effect } from 'effect'
import { chromium } from 'playwright'
import type { Browser } from 'playwright'

import { docsData } from '../src/data'
import { routeInventory, routeToOutputPath } from '../src/route-inventory'

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
      yield* writeRouteHtml(routeToOutputPath(entry.route), html)
      yield* Console.log(`  ✓ ${entry.path}`)
    })

type RouteInventoryEntry = ReturnType<typeof routeInventory>[number]

const program = Effect.scoped(
  Effect.gen(function* prerenderProgram() {
    const routes = routeInventory(docsData)

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
