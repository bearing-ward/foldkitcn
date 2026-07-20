import { chromium } from '@playwright/test'
import tailwindcss from '@tailwindcss/vite'
import type { ViteDevServer } from 'vite'
import { createServer } from 'vite'

import { shadcnOriginCaseMetadata } from '../../origin/shadcn/case-metadata'
import type { OriginFixtureSnapshot } from '../../origin/shadcn/snapshot'
import type { ShadcnFoldkitFixtureApi } from './fixture-api'

import path from 'node:path'

declare global {
  interface Window {
    __SHADCN_FOLDKIT_FIXTURE__: ShadcnFoldkitFixtureApi
  }
}

const transparentPixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
  'base64',
)
const parityRandomSeed = 123_456_789
const parityRandomMultiplier = 1_664_525
const parityRandomIncrement = 1_013_904_223
const parityRandomModulus = 4_294_967_296

export interface CaptureShadcnFoldkitSnapshotsOptions {
  readonly grep?: string
}

const repoRoot = process.cwd()
const fixtureRoot = path.join(repoRoot, 'tests/parity/fixtures/foldkit/shadcn')

export const createFixtureServer = async (): Promise<ViteDevServer> => {
  const server = await createServer({
    root: fixtureRoot,
    configFile: false,
    cacheDir: path.join(repoRoot, 'node_modules/.vite-shadcn-foldkit-fixture'),
    logLevel: 'silent',
    appType: 'spa',
    plugins: [tailwindcss()],
    optimizeDeps: {
      force: true,
    },
    server: {
      host: '127.0.0.1',
      port: 0,
      strictPort: false,
      fs: {
        allow: [repoRoot],
      },
    },
  })

  await server.listen()

  return server
}

export const serverUrl = (server: ViteDevServer): string => {
  const address = server.httpServer?.address()

  if (typeof address === 'object' && address !== null) {
    return `http://127.0.0.1:${address.port}`
  }

  const resolvedUrl = server.resolvedUrls?.local.at(0)

  if (resolvedUrl === undefined) {
    throw new Error('Unable to determine shadcn Foldkit fixture server URL.')
  }

  return resolvedUrl
}

const matchingCases = (grep: string | undefined) => {
  const normalizedGrep = grep?.toLowerCase()
  const foldkitCases =
    normalizedGrep === undefined
      ? shadcnOriginCaseMetadata
      : shadcnOriginCaseMetadata.filter(foldkitCase =>
          foldkitCase.id.toLowerCase().includes(normalizedGrep),
        )

  if (foldkitCases.length === 0) {
    throw new Error(
      `No shadcn Foldkit fixture cases matched: ${grep ?? '<none>'}`,
    )
  }

  return foldkitCases
}

export const captureShadcnFoldkitSnapshots = async (
  options: CaptureShadcnFoldkitSnapshotsOptions = {},
): Promise<ReadonlyArray<OriginFixtureSnapshot>> => {
  const foldkitCases = matchingCases(options.grep)
  const server = await createFixtureServer()
  const browser = await chromium.launch()

  try {
    const page = await browser.newPage({
      viewport: { width: 800, height: 400 },
    })
    await page.addInitScript(
      ({ increment, modulus, multiplier, seed }) => {
        let state = Math.trunc(seed) % modulus
        Math.random = () => {
          state = (multiplier * state + increment) % modulus
          return state / modulus
        }
      },
      {
        increment: parityRandomIncrement,
        modulus: parityRandomModulus,
        multiplier: parityRandomMultiplier,
        seed: parityRandomSeed,
      },
    )
    const pageErrors: Array<string> = []
    page.on('pageerror', error => {
      pageErrors.push(error.message)
    })
    page.on('console', message => {
      if (message.type() === 'error') {
        pageErrors.push(message.text())
      }
    })
    await page.route('https://images.unsplash.com/**', route =>
      route.fulfill({
        body: transparentPixelPng,
        contentType: 'image/png',
      }),
    )
    const baseUrl = serverUrl(server)

    return await foldkitCases.reduce(async (pendingSnapshots, foldkitCase) => {
      const snapshots = await pendingSnapshots
      const url = new URL(baseUrl)
      url.searchParams.set('case', foldkitCase.id)

      await page.goto(url.toString(), { waitUntil: 'networkidle' })
      try {
        await page.waitForSelector('[data-foldkit-fixture-root] > *', {
          state: 'attached',
          timeout: 5000,
        })
      } catch (error: unknown) {
        const bodyText = await page.locator('body').textContent()
        const message = error instanceof Error ? error.message : String(error)

        throw new Error(
          [
            `shadcn Foldkit fixture did not render case ${foldkitCase.id}`,
            message,
            `pageErrors=${pageErrors.join(' | ')}`,
            `body=${bodyText ?? ''}`,
          ].join('\n'),
          { cause: error },
        )
      }
      const snapshot = await page.evaluate(() =>
        window.__SHADCN_FOLDKIT_FIXTURE__.captureSnapshot(),
      )

      return [...snapshots, snapshot]
    }, Promise.resolve<ReadonlyArray<OriginFixtureSnapshot>>([]))
  } finally {
    await browser.close()
    await server.close()
  }
}
