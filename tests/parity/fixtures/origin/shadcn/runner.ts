import { chromium } from '@playwright/test'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin, ViteDevServer } from 'vite'
import { createServer } from 'vite'

import { shadcnOriginCaseMetadata } from './case-metadata'
import type { OriginFixtureSnapshot } from './snapshot'

import { existsSync } from 'node:fs'
import path from 'node:path'

const transparentPixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
  'base64',
)
const parityRandomSeed = 123_456_789
const parityRandomMultiplier = 1_664_525
const parityRandomIncrement = 1_013_904_223
const parityRandomModulus = 4_294_967_296

export interface CaptureShadcnOriginSnapshotsOptions {
  readonly grep?: string | ReadonlyArray<string>
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
const popoverShimModuleId = '\0foldkitcn-shadcn-origin-popover-shim'
const selectShimModuleId = '\0foldkitcn-shadcn-origin-select-shim'
const sliderShimModuleId = '\0foldkitcn-shadcn-origin-slider-shim'
const resizablePanelsShimModuleId =
  '\0foldkitcn-shadcn-origin-resizable-panels-shim'
const carouselShimModuleId = '\0foldkitcn-shadcn-origin-carousel-shim'
const nextImageShimModuleId = '\0foldkitcn-shadcn-origin-next-image-shim'
const nextLinkShimModuleId = '\0foldkitcn-shadcn-origin-next-link-shim'
const nextThemesShimModuleId = '\0foldkitcn-shadcn-origin-next-themes-shim'
const floatingUiReactDomShimModuleId =
  '\0foldkitcn-shadcn-origin-floating-ui-react-dom-shim'
const cvaShimModuleId = '\0foldkitcn-shadcn-origin-cva-shim'
const reselectShimModuleId = '\0foldkitcn-shadcn-origin-reselect-shim'
const useSyncExternalStoreShimModuleId =
  '\0foldkitcn-shadcn-origin-use-sync-external-store-shim'
const useSyncExternalStoreWithSelectorShimModuleId =
  '\0foldkitcn-shadcn-origin-use-sync-external-store-with-selector-shim'
const sonnerShimModuleId = '\0foldkitcn-shadcn-origin-sonner-shim'
const dropdownMenuShimModuleId = '\0foldkitcn-shadcn-origin-dropdown-menu-shim'
const commandDialogShimModuleId =
  '\0foldkitcn-shadcn-origin-command-dialog-shim'
const cmdkShimModuleId = '\0foldkitcn-shadcn-origin-cmdk-shim'
const markdownShimModuleId = '\0foldkitcn-shadcn-origin-markdown-shim'

const virtualModuleAliases = new Map([
  ['cmdk', cmdkShimModuleId],
  ['next/image', nextImageShimModuleId],
  ['next/link', nextLinkShimModuleId],
  ['next-themes', nextThemesShimModuleId],
  ['sonner', sonnerShimModuleId],
  ['react-resizable-panels', resizablePanelsShimModuleId],
  ['@/styles/base-nova/ui/dialog', commandDialogShimModuleId],
  ['@/styles/base-nova/ui-rtl/dialog', commandDialogShimModuleId],
  ['@/styles/base-nova/ui/dropdown-menu', dropdownMenuShimModuleId],
  ['@/styles/base-nova/ui-rtl/dropdown-menu', dropdownMenuShimModuleId],
  ['@/styles/base-nova/ui/carousel', carouselShimModuleId],
  ['@/styles/base-nova/ui-rtl/carousel', carouselShimModuleId],
  ['@floating-ui/react-dom', floatingUiReactDomShimModuleId],
  ['class-variance-authority', cvaShimModuleId],
  ['reselect', reselectShimModuleId],
  ['use-sync-external-store/shim', useSyncExternalStoreShimModuleId],
  [
    'use-sync-external-store/shim/with-selector',
    useSyncExternalStoreWithSelectorShimModuleId,
  ],
  ['@/styles/base-nova/ui/popover', popoverShimModuleId],
  ['@/styles/base-nova/ui-rtl/popover', popoverShimModuleId],
  ['@/styles/base-nova/ui/select', selectShimModuleId],
  ['@/styles/base-nova/ui/slider', sliderShimModuleId],
  ['@/styles/base-nova/ui/tooltip', tooltipShimModuleId],
  ['@/styles/base-nova/ui-rtl/tooltip', tooltipShimModuleId],
  ['@/components/markdown', markdownShimModuleId],
])

const sourcePathAliases = new Map([
  [
    '@base-ui/react/merge-props',
    'repos/base-ui/packages/react/src/merge-props/index.ts',
  ],
  [
    '@base-ui/react/use-render',
    'repos/base-ui/packages/react/src/use-render/index.ts',
  ],
  [
    '@base-ui/react/direction-provider',
    'repos/base-ui/packages/react/src/direction-provider/index.ts',
  ],
  ['@/hooks/use-mobile', 'repos/ui/apps/v4/hooks/use-mobile.ts'],
  [
    '@/styles/base-nova/ui/collapsible',
    'repos/ui/apps/v4/styles/base-nova/ui/collapsible.tsx',
  ],
  [
    '@/styles/base-nova/ui-rtl/collapsible',
    'repos/ui/apps/v4/styles/base-nova/ui-rtl/collapsible.tsx',
  ],
  [
    '@/styles/base-nova/ui/direction',
    'repos/ui/apps/v4/styles/base-nova/ui/direction.tsx',
  ],
  [
    '@/styles/base-nova/ui-rtl/direction',
    'repos/ui/apps/v4/styles/base-nova/ui-rtl/direction.tsx',
  ],
  [
    '@/styles/base-nova/ui/sheet',
    'repos/ui/apps/v4/styles/base-nova/ui/sheet.tsx',
  ],
  [
    '@/styles/base-nova/ui-rtl/sheet',
    'repos/ui/apps/v4/styles/base-nova/ui-rtl/sheet.tsx',
  ],
  [
    '@/styles/base-nova/ui/sidebar',
    'repos/ui/apps/v4/styles/base-nova/ui/sidebar.tsx',
  ],
  [
    '@/styles/base-nova/ui-rtl/sidebar',
    'repos/ui/apps/v4/styles/base-nova/ui-rtl/sidebar.tsx',
  ],
  ['@base-ui/react/button', 'repos/base-ui/packages/react/src/button/index.ts'],
  ['@base-ui/react/dialog', 'repos/base-ui/packages/react/src/dialog/index.ts'],
  [
    '@base-ui/react/popover',
    'repos/base-ui/packages/react/src/popover/index.ts',
  ],
  [
    '@base-ui/react/collapsible',
    'repos/base-ui/packages/react/src/collapsible/index.ts',
  ],
  [
    '@base-ui/react/floating-ui-react',
    'repos/base-ui/packages/react/src/floating-ui-react/index.ts',
  ],
  ['@base-ui/react/toggle', 'repos/base-ui/packages/react/src/toggle/index.ts'],
  [
    '@base-ui/react/toggle-group',
    'repos/base-ui/packages/react/src/toggle-group/index.ts',
  ],
  ['@base-ui/react/input', 'repos/base-ui/packages/react/src/input/index.ts'],
  [
    '@base-ui/react/separator',
    'repos/base-ui/packages/react/src/separator/index.ts',
  ],
  [
    '@base-ui/react/progress',
    'repos/base-ui/packages/react/src/progress/index.ts',
  ],
  [
    '@base-ui/react/scroll-area',
    'repos/base-ui/packages/react/src/scroll-area/index.ts',
  ],
  ['@base-ui/react/switch', 'repos/base-ui/packages/react/src/switch/index.ts'],
  ['@base-ui/react/select', 'repos/base-ui/packages/react/src/select/index.ts'],
  ['@base-ui/react/avatar', 'repos/base-ui/packages/react/src/avatar/index.ts'],
  [
    '@base-ui/react/tooltip',
    'repos/base-ui/packages/react/src/tooltip/index.ts',
  ],
  [
    '#formatErrorMessage',
    'repos/base-ui/packages/utils/src/formatErrorMessage.ts',
  ],
])

const sourcePathAlias = (source: string): string | null => {
  const sourcePath = sourcePathAliases.get(source)

  if (sourcePath !== undefined) {
    return repoPath(sourcePath)
  }

  if (source.startsWith('@base-ui/utils/')) {
    return baseUiUtilsPath(source)
  }

  return null
}

const staticShimSources = new Map([
  [
    nextImageShimModuleId,
    `
        import * as React from 'react'

        export default function Image({ fill, priority, ...props }) {
          return React.createElement('img', props)
        }
      `,
  ],
  [
    nextLinkShimModuleId,
    `
        import * as React from 'react'

        export default function Link({ href, children, ...props }) {
          return React.createElement('a', { ...props, href }, children)
        }
      `,
  ],
  [
    nextThemesShimModuleId,
    `
        import * as React from 'react'

        export function ThemeProvider({ children }) {
          return React.createElement(React.Fragment, null, children)
        }

        export function useTheme() {
          return {
            theme: 'system',
            setTheme: () => {},
          }
        }
        `,
  ],
])

const staticShimSource = (id: string): string | null =>
  staticShimSources.get(id) ?? null

const originAliasPlugin = (): Plugin => ({
  name: 'foldkitcn-shadcn-origin-aliases',
  enforce: 'pre',
  resolveId(source) {
    return virtualModuleAliases.get(source) ?? sourcePathAlias(source)
  },
  load(id) {
    const maybeStaticShim = staticShimSource(id)

    if (maybeStaticShim !== null) {
      return maybeStaticShim
    }

    if (id === markdownShimModuleId) {
      return `
        import * as React from 'react'

        const inlineNodes = text =>
          text.split(/(\\*\\*[^*]+\\*\\*|\`[^\`]+\`)/g).filter(Boolean).map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return React.createElement('strong', { key: index }, part.slice(2, -2))
            }

            if (part.startsWith('\`') && part.endsWith('\`')) {
              return React.createElement('code', { key: index }, part.slice(1, -1))
            }

            return part
          })

        export function Markdown({ children }) {
          const text = String(children ?? '').trim()
          const lines = text.split('\\n').map(line => line.trim()).filter(Boolean)
          const listItems = lines.filter(line => /^\\d+\\.\\s/u.test(line))
          const intro = lines.filter(line => !/^\\d+\\.\\s/u.test(line))

          return React.createElement(
            'div',
            { className: 'space-y-4' },
            ...intro.map((line, index) => React.createElement('p', { key: 'p-' + index }, inlineNodes(line))),
            ...(listItems.length === 0
              ? []
              : [
                  React.createElement(
                    'ol',
                    { key: 'ol', className: 'list-decimal space-y-1 pl-5' },
                    ...listItems.map((line, index) =>
                      React.createElement('li', { key: index }, inlineNodes(line.replace(/^\\d+\\.\\s/u, ''))),
                    ),
                  ),
                ]),
          )
        }
      `
    }

    if (id === floatingUiReactDomShimModuleId) {
      return `
        const platformValue = {
          getClippingRect: state => state?.rects?.reference ?? state?.rects?.floating,
          convertOffsetParentRelativeRectToViewportRelativeRect: state =>
            state?.rects?.reference ?? state?.rects?.floating,
          getOffsetParent: element => element?.parentNode ?? null,
          getDimensions: element => ({
            width: element?.offsetWidth ?? 0,
            height: element?.offsetHeight ?? 0,
          }),
          getClientRects: element => element?.getClientRects?.() ?? [],
          getWindow: element => element?.ownerDocument?.defaultView ?? window,
          getDocumentElement: element => element?.ownerDocument?.documentElement ?? null,
          getInnerBoundingClientRect: element => element?.getBoundingClientRect?.() ?? { x: 0, y: 0, width: 0, height: 0 },
          getVisualOffsets: () => ({ x: 0, y: 0 }),
          getRectRelativeToOffsetParent: ({ rect }) => rect ?? { x: 0, y: 0, width: 0, height: 0 },
          isElement: value => value !== null && value !== undefined,
          getViewportRect: element => ({
            x: 0,
            y: 0,
            width: element?.ownerDocument?.documentElement?.clientWidth ?? 0,
            height: element?.ownerDocument?.documentElement?.clientHeight ?? 0,
          }),
        }

        const middlewareRecord = (name, options = {}) => ({
          name,
          options,
          fn: () => ({ data: {} }),
        })

        export const arrow = options => middlewareRecord('arrow', options)
        export const autoPlacement = options =>
          middlewareRecord('autoPlacement', options)
        export const flip = options => middlewareRecord('flip', options)
        export const hide = options => middlewareRecord('hide', options)
        export const inline = options => middlewareRecord('inline', options)
        export const limitShift = options => middlewareRecord('limitShift', options)
        export const offset = options => middlewareRecord('offset', options)
        export const shift = options => middlewareRecord('shift', options)
        export const size = options => middlewareRecord('size', options)

        export const computePosition = async () => ({
          x: 0,
          y: 0,
          placement: 'bottom',
          strategy: 'absolute',
          middlewareData: {},
          rects: {
            reference: { x: 0, y: 0, width: 0, height: 0 },
            floating: { x: 0, y: 0, width: 0, height: 0 },
          },
        })

        export const autoUpdate = (_reference, _floating, update) => {
          const scheduleId = setTimeout(update, 0)
          return () => clearTimeout(scheduleId)
        }

        export const getOverflowAncestors = () => []
        export const platform = platformValue

        export const detectOverflow = (_state, _options = {}) => ({})

        export const useFloating = () => ({
          x: 0,
          y: 0,
          strategy: 'absolute',
          placement: 'bottom',
          middlewareData: {},
          refs: {
            reference: { current: null },
            floating: { current: null },
            domReference: { current: null },
            setReference: () => {},
            setFloating: () => {},
            setPositionReference: () => {},
          },
          elements: {
            reference: null,
            floating: null,
            domReference: null,
          },
          data: {},
          update: () => Promise.resolve(),
        })
      `
    }

    if (id === cvaShimModuleId) {
      return `
        export const cva = (base, config = {}) => (options = {}) => {
          const variants = config.variants ?? {}
          const defaultVariants = config.defaultVariants ?? {}
          const classes = [base]

          for (const key of Object.keys(variants)) {
            const value = options[key] ?? defaultVariants[key]
            if (value !== undefined) {
              const variantMap = variants[key]
              const className = variantMap[value]
              if (className !== undefined) {
                classes.push(className)
              }
            }
          }

          return classes.filter(Boolean).join(' ')
        }
      `
    }

    if (id === reselectShimModuleId) {
      return `
        const identityMemoize = next => (arg1, ...rest) => next(arg1, ...rest)

        export const lruMemoize = identityMemoize

        export const createSelectorCreator = () => {
          return (...selectors) => {
            const deps = selectors.slice(0, -1)
            const combiner = selectors.at(-1)
            return function selector(state) {
              const selected = deps.map(selectorValue => selectorValue(state))
              return combiner(state, ...selected)
            }
          }
        }

        const defaultCreator = createSelectorCreator()
        export const createSelector = (...selectors) =>
          defaultCreator(...selectors)
      `
    }

    if (id === useSyncExternalStoreShimModuleId) {
      return `
        import * as React from 'react'

        export const useSyncExternalStore = React.useSyncExternalStore
      `
    }

    if (id === useSyncExternalStoreWithSelectorShimModuleId) {
      return `
        import { useSyncExternalStore } from 'use-sync-external-store/shim'

        export const useSyncExternalStoreWithSelector = (
          subscribe,
          getSnapshot,
          getServerSnapshot,
          selector,
        ) =>
          useSyncExternalStore(
            subscribe,
            () => selector(getSnapshot()),
            () => selector(getServerSnapshot()),
          )
      `
    }

    if (id === sonnerShimModuleId) {
      return `
        import * as React from 'react'

        const createToast = () => ({
          dismiss: () => {},
        })

        export const toast = Object.assign(
          (message, options) => createToast(message, options),
          {
            success: (message, options) => createToast(message, options),
            info: (message, options) => createToast(message, options),
            warning: (message, options) => createToast(message, options),
            error: (message, options) => createToast(message, options),
            promise: (promise, options) => createToast(promise, options),
          },
        )

        export function Toaster(props) {
          return React.createElement('div', {
            ...props,
            'data-sonner-toaster': '',
          })
        }
      `
    }

    if (id === cmdkShimModuleId) {
      return `
        import * as React from 'react'

        function Root({ children, ...props }) {
          return React.createElement('div', props, children)
        }

        function Input(props) {
          return React.createElement('input', props)
        }

        function List({ children, ...props }) {
          return React.createElement('div', props, children)
        }

        function Empty({ children, ...props }) {
          return React.createElement('div', props, children)
        }

        function Group({ heading, children, ...props }) {
          return React.createElement(
            'div',
            props,
            heading === undefined
              ? null
              : React.createElement(
                  'div',
                  { 'cmdk-group-heading': '' },
                  heading,
                ),
            children,
          )
        }

        function Separator(props) {
          return React.createElement('div', props)
        }

        function Item({ children, disabled, value, ...props }) {
          return React.createElement(
            'div',
            {
              ...props,
              role: 'option',
              'data-disabled': disabled === true ? 'true' : undefined,
              'data-value': value,
            },
            children,
          )
        }

        function Command(props) {
          return Root(props)
        }

        Command.Input = Input
        Command.List = List
        Command.Empty = Empty
        Command.Group = Group
        Command.Separator = Separator
        Command.Item = Item

        export { Command }
      `
    }

    if (id === commandDialogShimModuleId) {
      return `
        import * as React from 'react'

        const DialogOpenContext = React.createContext(false)

        export function Dialog({ open = false, children }) {
          return React.createElement(
            DialogOpenContext.Provider,
            { value: open },
            children,
          )
        }

        export function DialogContent({ children, className, showCloseButton: _showCloseButton, ...props }) {
          return React.createElement(DialogOpenContext.Consumer, null, open =>
            open
              ? React.createElement('div', { ...props, 'data-slot': 'dialog-content', className }, children)
              : null,
          )
        }

        export function DialogDescription({ children, className, ...props }) {
          return React.createElement('p', { ...props, 'data-slot': 'dialog-description', className }, children)
        }

        export function DialogHeader({ children, className, ...props }) {
          return React.createElement('div', { ...props, 'data-slot': 'dialog-header', className }, children)
        }

        export function DialogTitle({ children, className, ...props }) {
          return React.createElement('h2', { ...props, 'data-slot': 'dialog-title', className }, children)
        }
      `
    }

    if (id === sliderShimModuleId) {
      return `
        export function Slider() {
          return null
        }
      `
    }

    if (id === resizablePanelsShimModuleId) {
      return `
        import * as React from 'react'

        const OrientationContext = React.createContext('horizontal')

        const panelSize = child => {
          if (!React.isValidElement(child)) {
            return undefined
          }

          return child.props.defaultSize
        }

        const numericSize = size => {
          if (typeof size === 'number') {
            return size
          }

          if (typeof size === 'string') {
            return Number.parseFloat(size)
          }

          return undefined
        }

        const handleAttributes = (children, index) => {
          const previousSize = numericSize(panelSize(children[index - 1]))

          return previousSize === undefined
            ? {}
            : {
                'aria-valuemin': 10,
                'aria-valuemax': 90,
                'aria-valuenow': previousSize,
              }
        }

        const enhancedChildren = children =>
          React.Children.toArray(children).map((child, index, allChildren) => {
            if (!React.isValidElement(child)) {
              return child
            }

            if (child.type === Panel) {
              return child
            }

            return React.cloneElement(child, handleAttributes(allChildren, index))
          })

        const sizeStyle = defaultSize =>
          numericSize(defaultSize) === undefined
            ? undefined
            : { flex: numericSize(defaultSize) + ' 1 0px', overflow: 'hidden' }

        export function Group({ children, orientation = 'horizontal', ...props }) {
          return React.createElement(
            OrientationContext.Provider,
            { value: orientation },
            React.createElement('div', { ...props, role: 'group', 'aria-orientation': orientation }, enhancedChildren(children)),
          )
        }

        export function Panel({ children, defaultSize, ...props }) {
          return React.createElement(
            'div',
            { ...props, style: { ...sizeStyle(defaultSize), ...props.style } },
            children,
          )
        }

        export function Separator({ children, ...props }) {
          return React.createElement(OrientationContext.Consumer, null, orientation =>
            React.createElement(
              'div',
              {
                ...props,
                role: 'separator',
                tabIndex: 0,
                'aria-orientation': orientation === 'vertical' ? 'horizontal' : 'vertical',
              },
              children,
            ),
          )
        }
      `
    }

    if (id === carouselShimModuleId) {
      return `
        import * as React from 'react'

        import { cn } from '@/lib/utils'
        import { Button } from '@/styles/base-nova/ui/button'

        const CarouselContext = React.createContext({
          orientation: 'horizontal',
          dir: undefined,
          canScrollPrev: false,
          canScrollNext: true,
        })

        function isRtl(dir) {
          return dir === 'rtl'
        }

        function ChevronIcon({ kind, dir }) {
          const d = kind === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'
          const className = isRtl(dir) ? 'rtl:rotate-180' : 'cn-rtl-flip'

          return React.createElement(
            'svg',
            {
              xmlns: 'http://www.w3.org/2000/svg',
              width: '24',
              height: '24',
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '2',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              className,
              'aria-hidden': 'true',
            },
            React.createElement('path', { d }),
          )
        }

        export function Carousel({
          orientation = 'horizontal',
          opts: _opts,
          setApi: _setApi,
          plugins: _plugins,
          className,
          children,
          dir,
          ...props
        }) {
          return React.createElement(
            CarouselContext.Provider,
            {
              value: {
                orientation,
                dir,
                canScrollPrev: false,
                canScrollNext: true,
              },
            },
            React.createElement(
              'div',
              {
                ...props,
                dir,
                className: cn('relative', className),
                role: 'region',
                'aria-roledescription': 'carousel',
                'data-slot': 'carousel',
              },
              children,
            ),
          )
        }

        export function CarouselContent({ className, ...props }) {
          const { orientation, dir } = React.useContext(CarouselContext)
          const spacingClassName =
            orientation === 'horizontal'
              ? isRtl(dir)
                ? '-ms-4'
                : '-ml-4'
              : '-mt-4 flex-col'

          return React.createElement(
            'div',
            {
              className: 'overflow-hidden',
              'data-slot': 'carousel-content',
            },
            React.createElement('div', {
              ...props,
              className: cn('flex', spacingClassName, className),
            }),
          )
        }

        export function CarouselItem({ className, ...props }) {
          const { orientation, dir } = React.useContext(CarouselContext)
          const spacingClassName =
            orientation === 'horizontal'
              ? isRtl(dir)
                ? 'ps-4'
                : 'pl-4'
              : 'pt-4'

          return React.createElement('div', {
            ...props,
            role: 'group',
            'aria-roledescription': 'slide',
            'data-slot': 'carousel-item',
            className: cn(
              'min-w-0 shrink-0 grow-0 basis-full',
              spacingClassName,
              className,
            ),
          })
        }

        export function CarouselPrevious({ className, variant = 'outline', size = 'icon-sm', ...props }) {
          const { orientation, dir, canScrollPrev } = React.useContext(CarouselContext)
          const placementClassName =
            orientation === 'horizontal'
              ? isRtl(dir)
                ? 'inset-y-0 -start-12 my-auto'
                : 'inset-y-0 -left-12 my-auto'
              : isRtl(dir)
                ? 'start-1/2 -top-12 -translate-x-1/2 rotate-90 rtl:translate-x-1/2'
                : '-top-12 left-1/2 -translate-x-1/2 rotate-90'

          return React.createElement(
            Button,
            {
              ...props,
              'data-slot': 'carousel-previous',
              variant,
              size,
              className: cn('absolute touch-manipulation rounded-full', placementClassName, className),
              disabled: !canScrollPrev,
            },
            React.createElement(ChevronIcon, { kind: 'left', dir }),
            React.createElement('span', { className: 'sr-only' }, 'Previous slide'),
          )
        }

        export function CarouselNext({ className, variant = 'outline', size = 'icon-sm', ...props }) {
          const { orientation, dir, canScrollNext } = React.useContext(CarouselContext)
          const placementClassName =
            orientation === 'horizontal'
              ? isRtl(dir)
                ? 'inset-y-0 -end-12 my-auto'
                : 'inset-y-0 -right-12 my-auto'
              : isRtl(dir)
                ? 'start-1/2 -bottom-12 -translate-x-1/2 rotate-90 rtl:translate-x-1/2'
                : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90'

          return React.createElement(
            Button,
            {
              ...props,
              'data-slot': 'carousel-next',
              variant,
              size,
              className: cn('absolute touch-manipulation rounded-full', placementClassName, className),
              disabled: !canScrollNext,
            },
            React.createElement(ChevronIcon, { kind: 'right', dir }),
            React.createElement('span', { className: 'sr-only' }, 'Next slide'),
          )
        }

        export function useCarousel() {
          return React.useContext(CarouselContext)
        }
      `
    }

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

    if (id === popoverShimModuleId) {
      return `
        import * as React from 'react'

        export function Popover({ children }) {
          return React.createElement(React.Fragment, null, children)
        }

        export function PopoverTrigger({ render, children, ...props }) {
          if (React.isValidElement(render)) {
            return React.cloneElement(render, {
              ...props,
              'data-slot': 'popover-trigger',
              'aria-haspopup': 'dialog',
              'aria-expanded': false,
            }, children)
          }

          return React.createElement(
            'button',
            {
              ...props,
              'data-slot': 'popover-trigger',
              'aria-haspopup': 'dialog',
              'aria-expanded': false,
            },
            children,
          )
        }

        export function PopoverContent() {
          return null
        }

        export function PopoverDescription() {
          return null
        }

        export function PopoverHeader() {
          return null
        }

        export function PopoverTitle() {
          return null
        }
      `
    }

    if (id === selectShimModuleId) {
      return `
        import * as React from 'react'

        const triggerClassName = "flex h-8 w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm whitespace-nowrap shadow-none transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4"

        export function Select({ children }) {
          return React.createElement(React.Fragment, null, children)
        }

        export function SelectTrigger({ children, className, ...props }) {
          return React.createElement(
            'button',
            {
              ...props,
              type: 'button',
              'data-slot': 'select-trigger',
              'aria-haspopup': 'listbox',
              'aria-expanded': false,
              className: [triggerClassName, className].filter(Boolean).join(' '),
            },
            React.createElement('span', { 'data-slot': 'select-value' }, children),
            React.createElement(
              'svg',
              {
                xmlns: 'http://www.w3.org/2000/svg',
                width: '24',
                height: '24',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                className: 'lucide lucide-chevron-down-icon',
                'aria-hidden': 'true',
                'data-slot': 'select-icon',
              },
              React.createElement('path', { d: 'm6 9 6 6 6-6' }),
            ),
          )
        }

        export function SelectContent() {
          return null
        }

        export function SelectGroup({ children }) {
          return React.createElement(React.Fragment, null, children)
        }

        export function SelectItem() {
          return null
        }

        export function SelectValue({ children, placeholder }) {
          return React.createElement('span', { 'data-slot': 'select-value' }, children ?? placeholder ?? '')
        }

        export function SelectLabel({ children, ...props }) {
          return React.createElement('div', { ...props, 'data-slot': 'select-label' }, children)
        }

        export function SelectSeparator(props) {
          return React.createElement('div', { ...props, 'data-slot': 'select-separator', role: 'separator' })
        }
      `
    }

    if (id === dropdownMenuShimModuleId) {
      return `
        import * as React from 'react'

        const cx = (...classes) => classes.filter(Boolean).join(' ')

        export function DropdownMenu({ children }) {
          return React.createElement(React.Fragment, null, children)
        }

        export function DropdownMenuTrigger({ render, children, ...props }) {
          if (React.isValidElement(render)) {
            return React.cloneElement(render, {
              ...props,
              'aria-haspopup': 'menu',
              'aria-expanded': false,
            }, children)
          }

          return React.createElement(
            'button',
            {
              ...props,
              'data-slot': 'dropdown-menu-trigger',
              'aria-haspopup': 'menu',
              'aria-expanded': false,
            },
            children,
          )
        }

        export function DropdownMenuContent() {
          return null
        }

        export function DropdownMenuGroup({ children, ...props }) {
          return React.createElement('div', { ...props, 'data-slot': 'dropdown-menu-group' }, children)
        }

        export function DropdownMenuItem({ children, variant, ...props }) {
          return React.createElement(
            'div',
            {
              ...props,
              'data-slot': 'dropdown-menu-item',
              'data-variant': variant,
              role: 'menuitem',
              className: variant === 'destructive' ? 'text-destructive' : undefined,
            },
            children,
          )
        }

        export function DropdownMenuLabel({ children, ...props }) {
          return React.createElement('div', { ...props, 'data-slot': 'dropdown-menu-label' }, children)
        }

        export function DropdownMenuSeparator(props) {
          return React.createElement('div', { ...props, 'data-slot': 'dropdown-menu-separator', role: 'separator' })
        }

        export function DropdownMenuShortcut({ children, ...props }) {
          return React.createElement('span', { ...props, 'data-slot': 'dropdown-menu-shortcut' }, children)
        }

        export function DropdownMenuRadioGroup({ children, ...props }) {
          return React.createElement('div', { ...props, 'data-slot': 'dropdown-menu-radio-group', role: 'group' }, children)
        }

        export function DropdownMenuRadioItem({ children, value, ...props }) {
          return React.createElement(
            'div',
            {
              ...props,
              'data-slot': 'dropdown-menu-radio-item',
              role: 'menuitemradio',
              'data-value': value,
              'aria-checked': false,
            },
            children,
          )
        }

        export function DropdownMenuSub({ children }) {
          return React.createElement(React.Fragment, null, children)
        }

        export function DropdownMenuSubContent() {
          return null
        }

        export function DropdownMenuSubTrigger({ children, ...props }) {
          return React.createElement('div', { ...props, 'data-slot': 'dropdown-menu-sub-trigger', role: 'menuitem' }, children)
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
          find: '@/styles/base-nova/ui/aspect-ratio',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/aspect-ratio.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/avatar',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/avatar.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/alert',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/alert.tsx',
          ),
        },
        {
          find: '@/styles/base-rhea/ui/bubble',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-rhea/ui/bubble.tsx',
          ),
        },
        {
          find: '@/styles/base-rhea/ui/avatar',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-rhea/ui/avatar.tsx',
          ),
        },
        {
          find: '@/styles/base-rhea/ui/attachment',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-rhea/ui/attachment.tsx',
          ),
        },
        {
          find: '@/styles/base-rhea/ui/button',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-rhea/ui/button.tsx',
          ),
        },
        {
          find: '@/styles/base-rhea/ui/dialog',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-rhea/ui/dialog.tsx',
          ),
        },
        {
          find: '@/styles/base-rhea/ui/spinner',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-rhea/ui/spinner.tsx',
          ),
        },
        {
          find: '@/styles/base-rhea/ui/marker',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-rhea/ui/marker.tsx',
          ),
        },
        {
          find: '@/styles/base-rhea/ui/message',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-rhea/ui/message.tsx',
          ),
        },
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
          find: '@/styles/base-nova/ui/command',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/command.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/input-group',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/input-group.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/empty',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/empty.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/card',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/card.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/item',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/item.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/breadcrumb',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/breadcrumb.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/toggle',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/toggle.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/toggle-group',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/toggle-group.tsx',
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
          find: '@/styles/base-nova/ui/native-select',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/native-select.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/pagination',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/pagination.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/resizable',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/resizable.tsx',
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
          find: '@/styles/base-nova/ui/scroll-area',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/scroll-area.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/progress',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/progress.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/switch',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/switch.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/table',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/table.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/field',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/field.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui/label',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/label.tsx',
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
          find: '@/styles/base-nova/ui-rtl/alert',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/alert.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/aspect-ratio',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/aspect-ratio.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/avatar',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/avatar.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/button',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui/button.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/button-group',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/button-group.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/command',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/command.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/card',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/card.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/item',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/item.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/breadcrumb',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/breadcrumb.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/input',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/input.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/input-group',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/input-group.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/empty',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/empty.tsx',
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
          find: '@/styles/base-nova/ui-rtl/native-select',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/native-select.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/pagination',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/pagination.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/resizable',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/resizable.tsx',
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
          find: '@/styles/base-nova/ui-rtl/scroll-area',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/scroll-area.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/progress',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/progress.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/switch',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/switch.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/table',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/table.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/field',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/field.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/label',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/label.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/skeleton',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/skeleton.tsx',
          ),
        },
        {
          find: '@/styles/base-nova/ui-rtl/textarea',
          replacement: repoPath(
            'repos/ui/apps/v4/styles/base-nova/ui-rtl/textarea.tsx',
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

const normalizedGreps = (
  grep: CaptureShadcnOriginSnapshotsOptions['grep'],
): ReadonlyArray<string> | undefined =>
  typeof grep === 'string'
    ? [grep.toLowerCase()]
    : grep?.map(value => value.toLowerCase())

const grepLabel = (grep: CaptureShadcnOriginSnapshotsOptions['grep']): string =>
  typeof grep === 'string' ? grep : (grep?.join(', ') ?? '<none>')

const matchingCases = (grep: CaptureShadcnOriginSnapshotsOptions['grep']) => {
  const grepValues = normalizedGreps(grep)
  const originCases =
    grepValues === undefined
      ? shadcnOriginCaseMetadata
      : shadcnOriginCaseMetadata.filter(originCase =>
          grepValues.some(value => originCase.id.toLowerCase().includes(value)),
        )

  if (originCases.length === 0) {
    throw new Error(
      `No shadcn origin fixture cases matched: ${grepLabel(grep)}`,
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
    page.on('requestfailed', request => {
      pageErrors.push(
        `requestfailed ${request.url()} ${request.failure()?.errorText ?? ''}`,
      )
    })
    await page.route('https://github.com/*.png', route =>
      route.fulfill({
        body: transparentPixelPng,
        contentType: 'image/png',
      }),
    )
    await page.route('https://images.unsplash.com/**', route =>
      route.fulfill({
        body: transparentPixelPng,
        contentType: 'image/png',
      }),
    )
    await page.route('https://avatar.vercel.sh/**', route =>
      route.fulfill({
        body: transparentPixelPng,
        contentType: 'image/png',
      }),
    )
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
        if (originCase.id.startsWith('avatar-')) {
          await page.waitForSelector('[data-slot="avatar-image"]', {
            timeout: 5000,
          })
          await page.waitForFunction(
            () =>
              document.querySelector(
                '[data-origin-fixture-root] [data-starting-style]',
              ) === null,
            undefined,
            { timeout: 5000 },
          )
        }
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
