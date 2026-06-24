import { chromium } from '@playwright/test'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin, ViteDevServer } from 'vite'
import { createServer } from 'vite'

import { shadcnOriginCaseMetadata } from './case-metadata'
import type { OriginFixtureSnapshot } from './snapshot'

import { existsSync } from 'node:fs'
import path from 'node:path'

export interface CaptureShadcnOriginSnapshotsOptions {
  readonly grep?: string
}

const repoRoot = process.cwd()
const fixtureRoot = path.join(repoRoot, 'tests/parity/fixtures/origin/shadcn')

const repoPath = (...segments: ReadonlyArray<string>): string =>
  path.join(repoRoot, ...segments)

const baseUiUtilsPath = (specifier: string): string => {
  const subpath = specifier.replace('@base-ui/utils/', '')
  const indexPath = repoPath(
    'repos/base-ui/packages/utils/src',
    subpath,
    'index.ts',
  )
  const tsPath = repoPath('repos/base-ui/packages/utils/src', `${subpath}.ts`)
  const tsxPath = repoPath('repos/base-ui/packages/utils/src', `${subpath}.tsx`)
  const maybePath = [indexPath, tsPath, tsxPath].find(existsSync)

  if (maybePath === undefined) {
    throw new Error(`Unable to resolve Base UI utility import: ${specifier}`)
  }

  return maybePath
}

const originAliasPlugin = (): Plugin => ({
  name: 'foldkitcn-shadcn-origin-aliases',
  enforce: 'pre',
  resolveId(source) {
    if (source === '@base-ui/react/button') {
      return repoPath('repos/base-ui/packages/react/src/button/index.ts')
    }

    if (source === '@base-ui/react/separator') {
      return repoPath('repos/base-ui/packages/react/src/separator/index.ts')
    }

    if (source === '#formatErrorMessage') {
      return repoPath('repos/base-ui/packages/utils/src/formatErrorMessage.ts')
    }

    if (source.startsWith('@base-ui/utils/')) {
      return baseUiUtilsPath(source)
    }

    return null
  },
})

const createFixtureServer = async (): Promise<ViteDevServer> => {
  const server = await createServer({
    root: fixtureRoot,
    configFile: false,
    cacheDir: path.join(repoRoot, 'node_modules/.vite-shadcn-origin-fixture'),
    logLevel: 'silent',
    appType: 'spa',
    plugins: [tailwindcss(), originAliasPlugin()],
    define: {
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.NEXT_PUBLIC_APP_URL': JSON.stringify(''),
    },
    esbuild: {
      jsx: 'automatic',
    },
    optimizeDeps: {
      force: true,
    },
    resolve: {
      alias: [
        {
          find: '@/styles/base-nova/ui/button',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/button.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/spinner',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/spinner.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/separator',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/separator.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/button',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/button.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/spinner',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/spinner.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/separator',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/separator.tsx',
          ),
        },
        {
          find: '@/lib/utils',
          replacement: repoPath('repos/ui/apps/v4/lib/utils.ts'),
        },
        {
          find: '@/components/language-selector',
          replacement: repoPath(
            'tests/parity/fixtures/origin/shadcn/language-selector.tsx',
          ),
        },
      ],
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

const serverUrl = (server: ViteDevServer): string => {
  const address = server.httpServer?.address()

  if (typeof address === 'object' && address !== null) {
    return `http://127.0.0.1:${address.port}`
  }

  const resolvedUrl = server.resolvedUrls?.local.at(0)

  if (resolvedUrl === undefined) {
    throw new Error('Unable to determine shadcn origin fixture server URL.')
  }

  return resolvedUrl
}

const matchingCases = (grep: string | undefined) => {
  const normalizedGrep = grep?.toLowerCase()
  const originCases =
    normalizedGrep === undefined
      ? shadcnOriginCaseMetadata
      : shadcnOriginCaseMetadata.filter(originCase =>
          originCase.id.toLowerCase().includes(normalizedGrep),
        )

  if (originCases.length === 0) {
    throw new Error(
      `No shadcn origin fixture cases matched: ${grep ?? '<none>'}`,
    )
  }

  return originCases
}

export const captureShadcnOriginSnapshots = async (
  options: CaptureShadcnOriginSnapshotsOptions = {},
): Promise<ReadonlyArray<OriginFixtureSnapshot>> => {
  const originCases = matchingCases(options.grep)
  const server = await createFixtureServer()
  const browser = await chromium.launch()

  try {
    const page = await browser.newPage({
      viewport: { width: 800, height: 400 },
    })
    const pageErrors: Array<string> = []
    page.on('pageerror', error => {
      pageErrors.push(error.message)
    })
    page.on('console', message => {
      if (message.type() === 'error') {
        pageErrors.push(message.text())
      }
    })
    const baseUrl = serverUrl(server)

    return await originCases.reduce(async (pendingSnapshots, originCase) => {
      const snapshots = await pendingSnapshots
      const url = new URL(baseUrl)
      url.searchParams.set('case', originCase.id)

      await page.goto(url.toString(), { waitUntil: 'networkidle' })
      try {
        await page.waitForSelector('[data-origin-fixture-root] > *', {
          timeout: 5000,
        })
      } catch (error: unknown) {
        const bodyText = await page.locator('body').textContent()
        const message = error instanceof Error ? error.message : String(error)

        throw new Error(
          [
            `shadcn origin fixture did not render case ${originCase.id}`,
            message,
            `pageErrors=${pageErrors.join(' | ')}`,
            `body=${bodyText ?? ''}`,
          ].join('\n'),
          { cause: error },
        )
      }
      const snapshot = await page.evaluate(() =>
        window.__SHADCN_ORIGIN_FIXTURE__.captureSnapshot(),
      )

      return [...snapshots, snapshot]
    }, Promise.resolve<ReadonlyArray<OriginFixtureSnapshot>>([]))
  } finally {
    await browser.close()
    await server.close()
  }
}
