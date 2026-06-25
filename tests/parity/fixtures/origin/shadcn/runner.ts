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

const tooltipShimModuleId = '\0foldkitcn-shadcn-origin-tooltip-shim'
const inputGroupShimModuleId = '\0foldkitcn-shadcn-origin-input-group-shim'

const originAliasPlugin = (): Plugin => ({
  name: 'foldkitcn-shadcn-origin-aliases',
  enforce: 'pre',
  resolveId(source) {
    if (source === '@/styles/base-nova/ui/input-group') {
      return inputGroupShimModuleId
    }

    if (source === '@/styles/base-nova/ui/tooltip') {
      return tooltipShimModuleId
    }

    if (source === '@base-ui/react/merge-props') {
      return repoPath('repos/base-ui/packages/react/src/merge-props/index.ts')
    }

    if (source === '@base-ui/react/use-render') {
      return repoPath('repos/base-ui/packages/react/src/use-render/index.ts')
    }

    if (source === '@base-ui/react/button') {
      return repoPath('repos/base-ui/packages/react/src/button/index.ts')
    }

    if (source === '@base-ui/react/input') {
      return repoPath('repos/base-ui/packages/react/src/input/index.ts')
    }

    if (source === '@base-ui/react/separator') {
      return repoPath('repos/base-ui/packages/react/src/separator/index.ts')
    }

    if (source === '@base-ui/react/tooltip') {
      return repoPath('repos/base-ui/packages/react/src/tooltip/index.ts')
    }

    if (source === '#formatErrorMessage') {
      return repoPath('repos/base-ui/packages/utils/src/formatErrorMessage.ts')
    }

    if (source.startsWith('@base-ui/utils/')) {
      return baseUiUtilsPath(source)
    }

    return null
  },
  load(id) {
    if (id === inputGroupShimModuleId) {
      return `
        import * as React from 'react'

        const inputGroupClassName = 'group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border border-input transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:bg-input/50 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5'
        const addonBaseClassName = "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4"
        const inputClassName = 'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent'

        const cx = (...classes) => classes.filter(Boolean).join(' ')

        export function InputGroup({ children, className, ...props }) {
          return React.createElement(
            'div',
            {
              ...props,
              'data-slot': 'input-group',
              role: 'group',
              className: cx(inputGroupClassName, className),
            },
            children,
          )
        }

        export function InputGroupAddon({ children, className, align = 'inline-start', ...props }) {
          const alignClassName =
            align === 'inline-end'
              ? 'order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]'
              : 'order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]'

          return React.createElement(
            'div',
            {
              ...props,
              role: 'group',
              'data-slot': 'input-group-addon',
              'data-align': align,
              className: cx(addonBaseClassName, alignClassName, className),
            },
            children,
          )
        }

        export function InputGroupInput({ className, ...props }) {
          return React.createElement('input', {
            ...props,
            type: props.type,
            'data-slot': 'input-group-control',
            className: cx(inputClassName, className),
          })
        }

        export function InputGroupButton({ children, ...props }) {
          return React.createElement('button', props, children)
        }

        export function InputGroupText({ children, className, ...props }) {
          return React.createElement('span', { ...props, className }, children)
        }

        export function InputGroupTextarea({ className, ...props }) {
          return React.createElement('textarea', { ...props, className }, null)
        }
      `
    }

    if (id === tooltipShimModuleId) {
      return `
        import * as React from 'react'

        const contentClassName = 'z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'
        const arrowClassName = 'z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5'

        export function TooltipProvider({ children }) {
          return React.createElement(React.Fragment, null, children)
        }

        export function Tooltip({ children }) {
          return React.createElement(React.Fragment, null, children)
        }

        export function TooltipTrigger({ render, children, ...props }) {
          if (React.isValidElement(render)) {
            return React.cloneElement(render, props, children)
          }

          return React.createElement('button', props, children)
        }

        export function TooltipContent({ children, className, ...props }) {
          return React.createElement(
            'div',
            { className: 'isolate z-50' },
            React.createElement(
              'div',
              {
                ...props,
                'data-slot': 'tooltip-content',
                'data-side': 'top',
                className: [contentClassName, className].filter(Boolean).join(' '),
              },
              children,
              React.createElement('div', { className: arrowClassName }),
            ),
          )
        }
      `
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
          find: '@/styles/base-nova/ui/badge',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/badge.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/button',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/button.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/button-group',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/button-group.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/card',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/card.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/input',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/input.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/kbd',
          replacement: repoPath('repos/ui/apps/v4/styles/base-nova/ui/kbd.tsx'),
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
          find: '@/styles/base-nova/ui/skeleton',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/skeleton.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/textarea',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/textarea.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/button',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/button.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/badge',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/badge.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/kbd',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/kbd.tsx',
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
          find: '@/styles/base-nova/ui-rtl/skeleton',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/skeleton.tsx',
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
    page.on('requestfailed', request => {
      pageErrors.push(
        `requestfailed ${request.url()} ${request.failure()?.errorText ?? ''}`,
      )
    })
    const baseUrl = serverUrl(server)

    return await originCases.reduce(async (pendingSnapshots, originCase) => {
      const snapshots = await pendingSnapshots
      const url = new URL(baseUrl)
      url.searchParams.set('case', originCase.id)

      await page.goto(url.toString(), { waitUntil: 'domcontentloaded' })
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
