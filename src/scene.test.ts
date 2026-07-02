import { Array, HashSet, Option, pipe } from 'effect'
import { Scene } from 'foldkit'
import { describe, expect, test } from 'vitest'

import { docsData, publicComponents } from './data'
import {
  ComponentDetailRoute,
  CompleteLiveExampleToastWait,
  CopySnippet,
  ComponentsIndexRoute,
  ComponentsNamespaceRoute,
  DocsRoute,
  HidCopiedIndicator,
  HideCopiedIndicator,
  HomeRoute,
  IdlePagefindSearch,
  MobileNavigation,
  NotFoundRoute,
  ReceivedPagefindSearchResults,
  RegistryLifecycleRoute,
  RegistryRoute,
  RegistrySchemaRoute,
  RoadmapRoute,
  SearchPagefind,
  SucceededCopySnippet,
  update,
  view,
} from './main'
import type { Model } from './main'

const carouselLiveExampleInteractions = [
  ['CarouselDemo', 'translate3d(-100%, 0, 0)'],
  [
    'CarouselSize',
    'translate3d(calc(var(--carousel-slide-step, 100%) * -1), 0, 0)',
  ],
  [
    'CarouselMultiple',
    'translate3d(calc(var(--carousel-slide-step, 100%) * -1), 0, 0)',
  ],
  [
    'CarouselSpacing',
    'translate3d(calc(var(--carousel-slide-step, 100%) * -1), 0, 0)',
  ],
  [
    'CarouselOrientation',
    'translate3d(0, calc(var(--carousel-slide-step, 100%) * -1), 0)',
  ],
  ['CarouselApi', 'translate3d(-100%, 0, 0)'],
  ['CarouselRtl', 'translate3d(100%, 0, 0)'],
] as const

const resizableLiveExampleInteractions = [
  ['ResizableDemo', 'ArrowRight', 'flex: 60 1 0px; overflow: hidden;'],
  ['ResizableHandleDemo', 'ArrowRight', 'flex: 35 1 0px; overflow: hidden;'],
  ['ResizableVertical', 'ArrowDown', 'flex: 35 1 0px; overflow: hidden;'],
  ['ResizableRtl', 'ArrowRight', 'flex: 40 1 0px; overflow: hidden;'],
] as const

const sidebarLiveExampleTitles = [
  'SidebarControlled',
  'SidebarDemo',
  'SidebarFooter',
  'SidebarGroupAction',
  'SidebarGroupCollapsible',
  'SidebarHeader',
  'SidebarMenuAction',
  'SidebarMenuBadge',
  'SidebarMenuCollapsible',
  'SidebarMenuSub',
  'SidebarMenu',
  'SidebarRsc',
  'SidebarRtl',
] as const

const sidebarToggleLiveExampleTitles = [
  'SidebarControlled',
  'SidebarDemo',
  'SidebarFooter',
  'SidebarHeader',
  'SidebarRtl',
] as const

const modelWithRoute = (route: Model['route']): Model => ({
  route,
  data: docsData,
  mobileNavigation: MobileNavigation({ isOpen: false }),
  copiedSnippets: HashSet.empty(),
  liveExampleInputValues: {},
  liveExampleOtpValues: {},
  liveExampleSliderValues: {},
  liveExampleSelectOpenValues: {},
  liveExampleSelectValues: {},
  liveExampleComboboxOpenValues: {},
  liveExampleComboboxInputValues: {},
  liveExampleComboboxValues: {},
  liveExampleComboboxMultipleValues: {},
  liveExampleRadioGroupValues: {},
  liveExampleCheckboxCheckedStates: {},
  liveExampleSwitchCheckedValues: {},
  liveExampleAccordionValues: {},
  liveExampleCollapsibleOpenValues: {},
  liveExampleTabsValues: {},
  liveExampleTogglePressedValues: {},
  liveExampleToggleGroupValues: {},
  liveExampleCalendarSelectedDates: {},
  liveExampleCarouselSelectedIndexes: {},
  liveExampleResizableStates: {},
  liveExampleCommandDialogOpenValues: {},
  liveExampleOverlayOpenValues: {},
  liveExampleMenuOpenValues: {},
  liveExampleMenuOpenSubmenuValues: {},
  liveExampleMenuContextPoints: {},
  liveExampleMenuValues: {},
  liveExampleToastStates: {},
  liveExampleSidebarOpenValues: {},
  liveExampleSidebarPanelOpenValues: {},
  liveExampleSidebarSelectedValues: {},
  searchQuery: '',
  pagefindSearch: IdlePagefindSearch(),
})

const documentedCarouselLiveExampleTitles = (): ReadonlyArray<string> => {
  const component = pipe(
    publicComponents(docsData),
    Array.findFirst(
      publicComponent => publicComponent.entry.item.id === 'shadcn/carousel',
    ),
    Option.getOrThrowWith(
      () => new Error('Missing public shadcn/carousel component docs.'),
    ),
  )
  const artifact = Option.getOrThrowWith(
    component.maybeDocsArtifact,
    () => new Error('Missing shadcn/carousel docs artifact.'),
  )

  return pipe(
    artifact.examples,
    Array.filter(example => example.previewStatus === 'live-ready'),
    Array.map(example => example.title),
  )
}

const documentedResizableLiveExampleTitles = (): ReadonlyArray<string> => {
  const component = pipe(
    publicComponents(docsData),
    Array.findFirst(
      publicComponent => publicComponent.entry.item.id === 'shadcn/resizable',
    ),
    Option.getOrThrowWith(
      () => new Error('Missing public shadcn/resizable component docs.'),
    ),
  )
  const artifact = Option.getOrThrowWith(
    component.maybeDocsArtifact,
    () => new Error('Missing shadcn/resizable docs artifact.'),
  )

  return pipe(
    artifact.examples,
    Array.filter(example => example.previewStatus === 'live-ready'),
    Array.map(example => example.title),
  )
}

const documentedSidebarLiveExampleTitles = (): ReadonlyArray<string> => {
  const component = pipe(
    publicComponents(docsData),
    Array.findFirst(
      publicComponent => publicComponent.entry.item.id === 'shadcn/sidebar',
    ),
    Option.getOrThrowWith(
      () => new Error('Missing public shadcn/sidebar component docs.'),
    ),
  )
  const artifact = Option.getOrThrowWith(
    component.maybeDocsArtifact,
    () => new Error('Missing shadcn/sidebar docs artifact.'),
  )

  return pipe(
    artifact.examples,
    Array.filter(example => example.previewStatus === 'live-ready'),
    Array.map(example => example.title),
  )
}

describe(view, () => {
  test('the shell renders primary navigation and component namespace groups', () => {
    Scene.scene(
      { update, view },
      Scene.with(modelWithRoute(ComponentsIndexRoute({}))),
      Scene.expect(Scene.role('navigation', { name: 'Primary' })).toExist(),
      Scene.expect(Scene.role('link', { name: 'Components' })).toExist(),
      Scene.expect(Scene.role('link', { name: 'Registry' })).toExist(),
      Scene.expect(Scene.role('link', { name: 'Roadmap' })).toExist(),
      Scene.expect(
        Scene.role('navigation', { name: 'Component navigation' }),
      ).toExist(),
      Scene.expect(Scene.role('heading', { name: 'Base UI' })).toExist(),
      Scene.expect(Scene.role('heading', { name: 'shadcn' })).toExist(),
      Scene.expect(
        Scene.role('link', { name: 'Button (base-ui/button)' }),
      ).toHaveAttr('href', '/components/base-ui/button'),
      Scene.expect(
        Scene.role('link', { name: 'Button (shadcn/button)' }),
      ).toHaveAttr('href', '/components/shadcn/button'),
    )
  })

  test('the shell marks the active top nav and component route', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'button' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          Scene.role('navigation', { name: 'Primary' }),
          Scene.role('link', { name: 'Components' }),
        ),
      ).toHaveAttr('aria-current', 'page'),
      Scene.expect(
        Scene.role('link', { name: 'Button (shadcn/button)' }),
      ).toHaveAttr('aria-current', 'page'),
    )
  })

  test('interaction validation covers every documented Carousel live example', () => {
    expect(
      carouselLiveExampleInteractions.map(([title]) => title),
    ).toStrictEqual(documentedCarouselLiveExampleTitles())
  })

  test.each(carouselLiveExampleInteractions)(
    '%s live preview advances when its next control is clicked',
    (exampleTitle, expectedTransform) => {
      const preview = Scene.label(`${exampleTitle} live preview`)

      Scene.scene(
        { update, view },
        Scene.with(
          modelWithRoute(
            ComponentDetailRoute({ namespace: 'shadcn', slug: 'carousel' }),
          ),
        ),
        Scene.click(
          Scene.within(preview, Scene.role('button', { name: 'Next slide' })),
        ),
        Scene.expect(
          Scene.within(
            preview,
            Scene.selector('[data-slot="carousel-content"] div'),
          ),
        ).toHaveStyle('transform', expectedTransform),
      )
    },
  )

  test('CarouselApi live preview updates its selected slide status text', () => {
    const preview = Scene.label('CarouselApi live preview')

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'carousel' }),
        ),
      ),
      Scene.click(
        Scene.within(preview, Scene.role('button', { name: 'Next slide' })),
      ),
      Scene.expect(Scene.within(preview, Scene.text('Slide 2 of 5'))).toExist(),
    )
  })

  test('Carousel live previews wrap backward from their first slide', () => {
    const preview = Scene.label('CarouselDemo live preview')

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'carousel' }),
        ),
      ),
      Scene.click(
        Scene.within(preview, Scene.role('button', { name: 'Previous slide' })),
      ),
      Scene.expect(
        Scene.within(
          preview,
          Scene.selector('[data-slot="carousel-content"] div'),
        ),
      ).toHaveStyle('transform', 'translate3d(-400%, 0, 0)'),
    )
  })

  test('interaction validation covers every documented Resizable live example', () => {
    expect(
      resizableLiveExampleInteractions.map(([title]) => title),
    ).toStrictEqual(documentedResizableLiveExampleTitles())
  })

  test('live preview validation covers every documented Sidebar example', () => {
    expect([...sidebarLiveExampleTitles]).toStrictEqual(
      documentedSidebarLiveExampleTitles(),
    )
  })

  test.each(sidebarLiveExampleTitles)(
    '%s docs example renders a live sidebar preview',
    exampleTitle => {
      const preview = Scene.label(`${exampleTitle} live preview`)

      Scene.scene(
        { update, view },
        Scene.with(
          modelWithRoute(
            ComponentDetailRoute({ namespace: 'shadcn', slug: 'sidebar' }),
          ),
        ),
        Scene.expect(preview).toExist(),
        Scene.expect(
          Scene.within(
            preview,
            Scene.selector('[data-slot="sidebar-wrapper"]'),
          ),
        ).toExist(),
      )
    },
  )

  test.each(sidebarToggleLiveExampleTitles)(
    '%s live preview toggles open state',
    exampleTitle => {
      const preview = Scene.label(`${exampleTitle} live preview`)
      const toggle =
        exampleTitle === 'SidebarControlled'
          ? Scene.role('button', { name: 'Close Sidebar' })
          : Scene.selector('[data-slot="sidebar-trigger"]')

      Scene.scene(
        { update, view },
        Scene.with(
          modelWithRoute(
            ComponentDetailRoute({ namespace: 'shadcn', slug: 'sidebar' }),
          ),
        ),
        Scene.expect(
          Scene.within(preview, Scene.selector('[data-slot="sidebar"]')),
        ).toHaveAttr('data-state', 'expanded'),
        Scene.click(Scene.within(preview, toggle)),
        Scene.expect(
          Scene.within(preview, Scene.selector('[data-slot="sidebar"]')),
        ).toHaveAttr('data-state', 'collapsed'),
      )
    },
  )

  test('SidebarControlled live preview switches its button label', () => {
    const preview = Scene.label('SidebarControlled live preview')

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'sidebar' }),
        ),
      ),
      Scene.click(
        Scene.within(preview, Scene.role('button', { name: 'Close Sidebar' })),
      ),
      Scene.expect(
        Scene.within(preview, Scene.role('button', { name: 'Open Sidebar' })),
      ).toExist(),
    )
  })

  test('SidebarDemo live preview collapses nested navigation groups', () => {
    const preview = Scene.label('SidebarDemo live preview')

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'sidebar' }),
        ),
      ),
      Scene.expect(Scene.within(preview, Scene.text('History'))).toExist(),
      Scene.click(
        Scene.within(preview, Scene.role('button', { name: /Playground/ })),
      ),
      Scene.expect(Scene.within(preview, Scene.text('History'))).not.toExist(),
    )
  })

  test('SidebarDemo live preview opens the team switcher and selects a team', () => {
    const preview = Scene.label('SidebarDemo live preview')

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'sidebar' }),
        ),
      ),
      Scene.click(
        Scene.within(preview, Scene.role('button', { name: /Acme Inc/ })),
      ),
      Scene.expect(Scene.within(preview, Scene.text('Acme Corp.'))).toExist(),
      Scene.click(Scene.within(preview, Scene.text('Acme Corp.'))),
      Scene.expect(Scene.within(preview, Scene.text('Startup'))).toExist(),
    )
  })

  test('SidebarDemo live preview opens project and user menus', () => {
    const preview = Scene.label('SidebarDemo live preview')

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'sidebar' }),
        ),
      ),
      Scene.click(
        Scene.within(
          preview,
          Scene.role('button', { name: 'More Design Engineering' }),
        ),
      ),
      Scene.expect(Scene.within(preview, Scene.text('View Project'))).toExist(),
      Scene.click(
        Scene.within(preview, Scene.role('button', { name: /shadcn/ })),
      ),
      Scene.expect(
        Scene.within(preview, Scene.text('Upgrade to Pro')),
      ).toExist(),
      Scene.expect(
        Scene.within(
          preview,
          Scene.selector(
            '[data-slot="dropdown-menu-content"][data-side="top"]',
          ),
        ),
      ).toExist(),
    )
  })

  test.each(resizableLiveExampleInteractions)(
    '%s live preview resizes when its separator receives keyboard input',
    (exampleTitle, key, expectedStyle) => {
      const preview = Scene.label(`${exampleTitle} live preview`)

      Scene.scene(
        { update, view },
        Scene.with(
          modelWithRoute(
            ComponentDetailRoute({ namespace: 'shadcn', slug: 'resizable' }),
          ),
        ),
        Scene.keydown(Scene.within(preview, Scene.role('separator')), key),
        Scene.expect(
          Scene.within(
            preview,
            Scene.selector('[data-slot="resizable-panel"]'),
          ),
        ).toHaveAttr('style', expectedStyle),
      )
    },
  )

  test('ResizableDemo live preview resizes root and nested groups independently', () => {
    const preview = Scene.label('ResizableDemo live preview')
    const nestedGroup = Scene.within(
      preview,
      Scene.selector(
        '[data-slot="resizable-panel-group"][aria-orientation="vertical"]',
      ),
    )

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'resizable' }),
        ),
      ),
      Scene.keydown(
        Scene.within(preview, Scene.role('separator')),
        'ArrowRight',
      ),
      Scene.expect(
        Scene.within(preview, Scene.selector('[data-slot="resizable-panel"]')),
      ).toHaveAttr('style', 'flex: 60 1 0px; overflow: hidden;'),
      Scene.keydown(
        Scene.within(nestedGroup, Scene.role('separator')),
        'ArrowDown',
      ),
      Scene.expect(
        Scene.within(
          nestedGroup,
          Scene.selector('[data-slot="resizable-panel"]'),
        ),
      ).toHaveAttr('style', 'flex: 35 1 0px; overflow: hidden;'),
    )
  })

  test('ResizableVertical live preview resizes along the vertical axis', () => {
    const preview = Scene.label('ResizableVertical live preview')

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'resizable' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          preview,
          Scene.selector('[data-slot="resizable-panel-group"]'),
        ),
      ).toHaveAttr('aria-orientation', 'vertical'),
      Scene.expect(Scene.within(preview, Scene.role('separator'))).toHaveAttr(
        'aria-orientation',
        'horizontal',
      ),
      Scene.expect(
        Scene.within(
          preview,
          Scene.selector('[data-slot="resizable-handle"] div'),
        ),
      ).toExist(),
      Scene.keydown(
        Scene.within(preview, Scene.role('separator')),
        'ArrowDown',
      ),
      Scene.expect(
        Scene.within(preview, Scene.selector('[data-slot="resizable-panel"]')),
      ).toHaveAttr('style', 'flex: 35 1 0px; overflow: hidden;'),
    )
  })

  test('ResizableRtl live preview resizes root and nested groups in their directions', () => {
    const preview = Scene.label('ResizableRtl live preview')
    const rootGroup = Scene.within(
      preview,
      Scene.selector('[data-slot="resizable-panel-group"]'),
    )
    const nestedGroup = Scene.within(
      preview,
      Scene.selector(
        '[data-slot="resizable-panel-group"][aria-orientation="vertical"]',
      ),
    )

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'resizable' }),
        ),
      ),
      Scene.expect(rootGroup).toHaveAttr('dir', 'rtl'),
      Scene.keydown(
        Scene.within(preview, Scene.role('separator')),
        'ArrowRight',
      ),
      Scene.expect(
        Scene.within(
          rootGroup,
          Scene.selector('[data-slot="resizable-panel"]'),
        ),
      ).toHaveAttr('style', 'flex: 40 1 0px; overflow: hidden;'),
      Scene.keydown(
        Scene.within(nestedGroup, Scene.role('separator')),
        'ArrowDown',
      ),
      Scene.expect(
        Scene.within(
          nestedGroup,
          Scene.selector('[data-slot="resizable-panel"]'),
        ),
      ).toHaveAttr('style', 'flex: 35 1 0px; overflow: hidden;'),
    )
  })

  test('documentation search filters public generated records and clears', () => {
    Scene.scene(
      { update, view },
      Scene.with(modelWithRoute(ComponentsIndexRoute({}))),
      Scene.type(Scene.label('Search documentation'), 'button'),
      Scene.Command.resolve(
        SearchPagefind({ query: 'button' }),
        ReceivedPagefindSearchResults({ query: 'button', results: [] }),
      ),
      Scene.expect(Scene.label('Search documentation')).toHaveValue('button'),
      Scene.expect(
        Scene.within(
          Scene.selector('.search-results'),
          Scene.text('base-ui/button'),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('.search-results'),
          Scene.text('shadcn/button'),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('.search-results'),
          Scene.text('local/example-preview'),
        ),
      ).not.toExist(),
      Scene.click(Scene.role('button', { name: 'Clear component search' })),
      Scene.expect(Scene.label('Search documentation')).toHaveValue(''),
      Scene.expect(Scene.selector('.search-results')).not.toExist(),
    )
  })

  test('Home renders its page heading', () => {
    Scene.scene(
      { update, view },
      Scene.with(modelWithRoute(HomeRoute({}))),
      Scene.expect(Scene.role('heading', { name: 'Foldkit CN' })).toExist(),
    )
  })

  test('Docs renders its page heading', () => {
    Scene.scene(
      { update, view },
      Scene.with(modelWithRoute(DocsRoute({}))),
      Scene.expect(
        Scene.role('heading', { name: 'Documentation overview' }),
      ).toExist(),
    )
  })

  test('Components renders its page heading and filters private rows out', () => {
    Scene.scene(
      { update, view },
      Scene.with(modelWithRoute(ComponentsIndexRoute({}))),
      Scene.expect(Scene.role('heading', { name: 'Components' })).toExist(),
      Scene.expect(Scene.text('Example Preview')).not.toExist(),
    )
  })

  test('Component namespace renders its page heading', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(ComponentsNamespaceRoute({ namespace: 'base-ui' })),
      ),
      Scene.expect(
        Scene.role('heading', { name: 'Base UI components' }),
      ).toExist(),
    )
  })

  test('Component detail renders the shadcn Button docs sections', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'button' }),
        ),
      ),
      Scene.expect(Scene.role('heading', { name: 'Button' })).toExist(),
      Scene.expect(Scene.selector('#overview')).toExist(),
      Scene.expect(Scene.role('heading', { name: 'Installation' })).toExist(),
      Scene.expect(Scene.role('heading', { name: 'Usage' })).toExist(),
      Scene.expect(Scene.role('heading', { name: 'Examples' })).toExist(),
      Scene.expect(Scene.role('heading', { name: 'API' })).toExist(),
      Scene.expect(Scene.role('heading', { name: 'Accessibility' })).toExist(),
      Scene.expect(Scene.role('heading', { name: 'Quality' })).toExist(),
      Scene.expect(Scene.role('heading', { name: 'Source' })).toExist(),
      Scene.expect(
        Scene.role('heading', { name: 'Foldkit Differences' }),
      ).toExist(),
    )
  })

  test('Component detail renders Button relationships and quality data', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'button' }),
        ),
      ),
      Scene.expect(Scene.role('heading', { name: 'Composes' })).toExist(),
      Scene.expect(Scene.text('base-ui/button')).toExist(),
      Scene.expect(Scene.text('utils/cn')).toExist(),
      Scene.expect(Scene.text('installable')).toExist(),
      Scene.expect(Scene.text('implemented')).toExist(),
      Scene.expect(Scene.text('accepted')).toExist(),
      Scene.expect(Scene.text('current')).toExist(),
      Scene.expect(Scene.text('registry/docs/shadcn/button.json')).toExist(),
      Scene.expect(
        Scene.text(
          'Icon examples use local inline SVGs instead of origin icon packages.',
          { exact: false },
        ),
      ).toExist(),
    )
  })

  test('Button detail renders install and import snippets from the public contract', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'button' }),
        ),
      ),
      Scene.expect(Scene.text('bunx foldkitcn add shadcn/button')).toExist(),
      Scene.expect(
        Scene.text(
          "import { Button } from '@/components/foldkitcn/shadcn/button'",
        ),
      ).toExist(),
      Scene.expect(
        Scene.text('src/components/foldkitcn/shadcn/button.ts'),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('#usage'),
          Scene.text('src/registry/shadcn/button', { exact: false }),
        ),
      ).not.toExist(),
    )
  })

  test('Button detail renders live example previews and snippets', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'button' }),
        ),
      ),
      Scene.expect(Scene.role('heading', { name: 'ButtonDefault' })).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('.live-example-preview'),
          Scene.role('button', { name: 'Button' }),
        ),
      ).toExist(),
      Scene.expect(
        Scene.text('export const ButtonDefault = (): Html => {', {
          exact: false,
        }),
      ).toExist(),
      Scene.expect(Scene.text('live ready')).toExist(),
      Scene.expect(
        Scene.role('button', { name: 'Copy ButtonDefault example snippet' }),
      ).toExist(),
    )
  })

  test('Toast live examples start inactive and open from their trigger', () => {
    const anchoredPreview = Scene.label('Anchored toasts live preview')

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'base-ui', slug: 'toast' }),
        ),
      ),
      Scene.expect(
        Scene.role('heading', { name: 'Anchored toasts' }),
      ).toExist(),
      Scene.expect(
        Scene.role('heading', { name: 'Custom position' }),
      ).toExist(),
      Scene.expect(Scene.role('heading', { name: 'Undo action' })).toExist(),
      Scene.expect(
        Scene.role('heading', { name: 'Waiting for result' }),
      ).toExist(),
      Scene.expect(Scene.role('heading', { name: 'Custom' })).toExist(),
      Scene.expect(
        Scene.role('heading', { name: 'Deduplicated toast' }),
      ).toExist(),
      Scene.expect(
        Scene.role('heading', { name: 'Varying heights' }),
      ).toExist(),
      Scene.expect(
        Scene.within(
          anchoredPreview,
          Scene.role('button', { name: 'Copy to clipboard' }),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          anchoredPreview,
          Scene.role('button', { name: 'Stacked toast' }),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(anchoredPreview, Scene.text('Copied')),
      ).not.toExist(),
      Scene.click(
        Scene.within(
          anchoredPreview,
          Scene.role('button', { name: 'Copy to clipboard' }),
        ),
      ),
      Scene.expect(
        Scene.within(anchoredPreview, Scene.text('Copied')),
      ).toExist(),
    )
  })

  test('Toast live examples handle repeats, actions, results, and dismissals', () => {
    const customPositionPreview = Scene.label('Custom position live preview')
    const undoPreview = Scene.label('Undo action live preview')
    const waitingPreview = Scene.label('Waiting for result live preview')
    const customPreview = Scene.label('Custom live preview')
    const deduplicatedPreview = Scene.label('Deduplicated toast live preview')
    const varyingHeightsPreview = Scene.label('Varying heights live preview')

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'base-ui', slug: 'toast' }),
        ),
      ),
      Scene.click(
        Scene.within(
          customPositionPreview,
          Scene.role('button', { name: 'Create toast' }),
        ),
      ),
      Scene.click(
        Scene.within(
          customPositionPreview,
          Scene.role('button', { name: 'Create toast' }),
        ),
      ),
      Scene.expect(
        Scene.within(customPositionPreview, Scene.text('Toast 1 created')),
      ).toExist(),
      Scene.expect(
        Scene.within(customPositionPreview, Scene.text('Toast 2 created')),
      ).toExist(),
      Scene.expect(
        Scene.within(
          customPositionPreview,
          Scene.role('dialog', { name: 'Toast 2 created' }),
        ),
      ).toHaveAttr('data-stacking-strategy', 'foldkit-push'),
      Scene.expect(
        Scene.within(
          customPositionPreview,
          Scene.role('region', { name: 'Notifications' }),
        ),
      ).toHaveAttr('data-position', 'top-center'),
      Scene.click(
        Scene.within(
          customPositionPreview,
          Scene.role('button', { name: 'Dismiss' }),
        ),
      ),
      Scene.expect(
        Scene.within(customPositionPreview, Scene.text('Toast 2 created')),
      ).not.toExist(),
      Scene.click(
        Scene.within(
          undoPreview,
          Scene.role('button', { name: 'Perform action' }),
        ),
      ),
      Scene.click(
        Scene.within(
          undoPreview,
          Scene.role('button', { name: 'Perform action' }),
        ),
      ),
      Scene.expect(
        Scene.within(undoPreview, Scene.text('Action 1 performed')),
      ).toExist(),
      Scene.expect(
        Scene.within(undoPreview, Scene.text('Action 2 performed')),
      ).toExist(),
      Scene.click(
        Scene.within(undoPreview, Scene.role('button', { name: 'Undo' })),
      ),
      Scene.expect(
        Scene.within(undoPreview, Scene.text('Action undone')),
      ).toExist(),
      Scene.expect(
        Scene.within(undoPreview, Scene.text('You can undo this action.')),
      ).toExist(),
      Scene.click(
        Scene.within(
          waitingPreview,
          Scene.role('button', { name: 'Run effect' }),
        ),
      ),
      Scene.expect(
        Scene.within(waitingPreview, Scene.text('Waiting for result...')),
      ).toExist(),
      Scene.Command.resolve(
        CompleteLiveExampleToastWait({
          exampleId: 'base-ui/toast-promise',
          toastId: 'toast-1',
        }),
        {
          _tag: 'CompletedLiveExampleToastWait',
          exampleId: 'base-ui/toast-promise',
          toastId: 'toast-1',
        },
      ),
      Scene.expect(
        Scene.within(waitingPreview, Scene.text('Result received')),
      ).toExist(),
      Scene.click(
        Scene.within(
          waitingPreview,
          Scene.role('button', { name: 'Run effect' }),
        ),
      ),
      Scene.expect(
        Scene.within(waitingPreview, Scene.text('Waiting for result...')),
      ).toExist(),
      Scene.Command.resolve(
        CompleteLiveExampleToastWait({
          exampleId: 'base-ui/toast-promise',
          toastId: 'toast-2',
        }),
        {
          _tag: 'CompletedLiveExampleToastWait',
          exampleId: 'base-ui/toast-promise',
          toastId: 'toast-2',
        },
      ),
      Scene.click(
        Scene.within(waitingPreview, Scene.role('button', { name: 'Dismiss' })),
      ),
      Scene.click(
        Scene.within(waitingPreview, Scene.role('button', { name: 'Dismiss' })),
      ),
      Scene.expect(
        Scene.within(waitingPreview, Scene.text('Result received')),
      ).not.toExist(),
      Scene.click(
        Scene.within(
          customPreview,
          Scene.role('button', { name: 'Create custom toast' }),
        ),
      ),
      Scene.click(
        Scene.within(
          customPreview,
          Scene.role('button', { name: 'Create custom toast' }),
        ),
      ),
      Scene.expect(
        Scene.within(customPreview, Scene.text('Toast with custom data 1')),
      ).toExist(),
      Scene.expect(
        Scene.within(customPreview, Scene.text('Toast with custom data 2')),
      ).toExist(),
      Scene.click(
        Scene.within(customPreview, Scene.role('button', { name: 'Dismiss' })),
      ),
      Scene.expect(
        Scene.within(customPreview, Scene.text('Toast with custom data 2')),
      ).not.toExist(),
      Scene.click(
        Scene.within(
          deduplicatedPreview,
          Scene.role('button', { name: 'Save draft' }),
        ),
      ),
      Scene.click(
        Scene.within(
          deduplicatedPreview,
          Scene.role('button', { name: 'Save draft' }),
        ),
      ),
      Scene.expect(
        Scene.within(deduplicatedPreview, Scene.text('Pulse replayed 1 time')),
      ).toExist(),
      Scene.click(
        Scene.within(
          deduplicatedPreview,
          Scene.role('button', { name: 'Dismiss' }),
        ),
      ),
      Scene.expect(
        Scene.within(deduplicatedPreview, Scene.text('Draft saved')),
      ).not.toExist(),
      Scene.click(
        Scene.within(
          varyingHeightsPreview,
          Scene.role('button', { name: 'Create varying height toast' }),
        ),
      ),
      Scene.click(
        Scene.within(
          varyingHeightsPreview,
          Scene.role('button', { name: 'Create varying height toast' }),
        ),
      ),
      Scene.expect(
        Scene.within(varyingHeightsPreview, Scene.text('Short message.')),
      ).toExist(),
      Scene.expect(
        Scene.within(
          varyingHeightsPreview,
          Scene.text('A bit longer message that spans two lines.'),
        ),
      ).toExist(),
      Scene.click(
        Scene.within(
          varyingHeightsPreview,
          Scene.role('button', { name: 'Dismiss' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          varyingHeightsPreview,
          Scene.text('A bit longer message that spans two lines.'),
        ),
      ).not.toExist(),
    )
  })

  test('Component detail table of contents links to individual examples', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'button' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          Scene.selector('.docs-toc'),
          Scene.selector('a[href="#shadcn-button-demo"]'),
        ),
      ).toHaveText('ButtonDemo'),
      Scene.expect(Scene.selector('#shadcn-button-demo')).toExist(),
    )
  })

  test('Item detail renders actual live examples from generated docs', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'item' }),
        ),
      ),
      Scene.expect(Scene.role('heading', { name: 'Item' })).toExist(),
      Scene.expect(Scene.text('Example metadata is not loaded.')).not.toExist(),
      Scene.expect(Scene.role('heading', { name: 'ItemDemo' })).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('.live-example-preview'),
          Scene.role('button', { name: 'Action' }),
        ),
      ).toExist(),
      Scene.expect(Scene.role('heading', { name: 'ItemAvatar' })).toExist(),
      Scene.expect(Scene.role('button', { name: 'Invite' })).toExist(),
      Scene.expect(
        Scene.text('export const ItemDemo = (): Html => {', {
          exact: false,
        }),
      ).toExist(),
      Scene.expect(Scene.text('live ready')).toExist(),
    )
  })

  test('Button Group detail renders actual live examples from generated docs', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'button-group' }),
        ),
      ),
      Scene.expect(Scene.role('heading', { name: 'Button Group' })).toExist(),
      Scene.expect(Scene.text('Example metadata is not loaded.')).not.toExist(),
      Scene.expect(
        Scene.role('heading', { name: 'ButtonGroupDemo' }),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('.live-example-preview'),
          Scene.role('button', { name: 'Archive' }),
        ),
      ).toExist(),
      Scene.expect(Scene.role('button', { name: 'Follow' })).toExist(),
      Scene.expect(
        Scene.text('export const ButtonGroupDemo = (): Html =>', {
          exact: false,
        }),
      ).toExist(),
      Scene.expect(Scene.text('live ready')).toExist(),
    )
  })

  test('Base UI Button detail renders live example previews and snippets', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'base-ui', slug: 'button' }),
        ),
      ),
      Scene.expect(Scene.role('heading', { name: 'ButtonDemo' })).toExist(),
      Scene.expect(Scene.role('heading', { name: 'ButtonDisabled' })).toExist(),
      Scene.expect(
        Scene.role('heading', { name: 'ButtonNonNative' }),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('.live-example-preview'),
          Scene.role('button', { name: 'Button' }),
        ),
      ).toExist(),
      Scene.expect(
        Scene.text('export const ButtonDemo = (): Html => {', {
          exact: false,
        }),
      ).toExist(),
      Scene.expect(Scene.text('live ready')).toExist(),
      Scene.expect(Scene.text('Example metadata is not loaded.')).not.toExist(),
    )
  })

  test('Base UI Input detail renders usable live example previews and snippets', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'base-ui', slug: 'input' }),
        ),
      ),
      Scene.expect(Scene.role('heading', { name: 'InputDemo' })).toExist(),
      Scene.expect(Scene.role('heading', { name: 'InputDisabled' })).toExist(),
      Scene.expect(Scene.selector('#base-ui-input-demo-name')).toHaveValue(''),
      Scene.type(Scene.selector('#base-ui-input-demo-name'), 'Ada'),
      Scene.expect(Scene.selector('#base-ui-input-demo-name')).toHaveValue(
        'Ada',
      ),
      Scene.expect(
        Scene.selector('#base-ui-input-disabled-disabled-name'),
      ).toHaveAttr('disabled', 'true'),
      Scene.expect(
        Scene.text('export const InputDemo = <Message = never>', {
          exact: false,
        }),
      ).toExist(),
      Scene.expect(Scene.text('live ready')).toExist(),
      Scene.expect(Scene.text('Example metadata is not loaded.')).not.toExist(),
    )
  })

  test('Radio Group detail renders live example previews and snippets', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'radio-group' }),
        ),
      ),
      Scene.expect(Scene.role('heading', { name: 'RadioGroupDemo' })).toExist(),
      Scene.expect(
        Scene.role('heading', { name: 'RadioGroupDescription' }),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('.live-example-preview'),
          Scene.role('radio', { name: 'Comfortable' }),
        ),
      ).toExist(),
      Scene.expect(
        Scene.text('export const RadioGroupDemo = <Message = never>', {
          exact: false,
        }),
      ).toExist(),
      Scene.expect(Scene.text('live ready')).toExist(),
      Scene.expect(Scene.text('Example metadata is not loaded.')).not.toExist(),
    )
  })

  test('Radio Group live examples update selected options', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'radio-group' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          Scene.selector('.live-example-preview'),
          Scene.role('radio', { name: 'Default' }),
        ),
      ).toHaveAttr('aria-checked', 'false'),
      Scene.click(
        Scene.within(
          Scene.selector('.live-example-preview'),
          Scene.role('radio', { name: 'Default' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          Scene.selector('.live-example-preview'),
          Scene.role('radio', { name: 'Default' }),
        ),
      ).toHaveAttr('aria-checked', 'true'),
      Scene.expect(
        Scene.within(
          Scene.selector('.live-example-preview'),
          Scene.role('radio', { name: 'Comfortable' }),
        ),
      ).toHaveAttr('aria-checked', 'false'),
    )
  })

  test('Calendar live examples update selected dates', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'calendar' }),
        ),
      ),
      ...[
        'shadcn-calendar-demo',
        'shadcn-calendar-basic',
        'shadcn-calendar-booked-dates',
        'shadcn-calendar-rtl',
      ].flatMap(exampleId => [
        Scene.expect(
          Scene.within(
            Scene.selector(`#${exampleId}`),
            Scene.selector('[data-day="2025-01-09"]'),
          ),
        ).toHaveAttr('data-selected-single', 'false'),
        Scene.click(
          Scene.within(
            Scene.selector(`#${exampleId}`),
            Scene.selector('[data-day="2025-01-09"]'),
          ),
        ),
        Scene.expect(
          Scene.within(
            Scene.selector(`#${exampleId}`),
            Scene.selector('[data-day="2025-01-09"]'),
          ),
        ).toHaveAttr('data-selected-single', 'true'),
      ]),
    )
  })

  test('Command live examples open their menu dialogs', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'command' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          Scene.selector('#shadcn-command-basic'),
          Scene.role('option', { name: 'Calendar' }),
        ),
      ).not.toExist(),
      Scene.click(
        Scene.within(
          Scene.selector('#shadcn-command-basic'),
          Scene.role('button', { name: 'Open Menu' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          Scene.selector('#shadcn-command-basic-dialog'),
          Scene.role('option', { name: 'Calendar' }),
        ),
      ).toExist(),
    )
  })

  test('Private component detail explains availability without an install command', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({
            namespace: 'local',
            slug: 'example-preview',
          }),
        ),
      ),
      Scene.expect(
        Scene.role('heading', { name: 'Example preview' }),
      ).toExist(),
      Scene.expect(
        Scene.text('This component is private.', { exact: false }),
      ).toExist(),
      Scene.expect(
        Scene.text('bunx foldkitcn add local/example-preview'),
      ).not.toExist(),
    )
  })

  test('Copy controls are accessible and announce copied status', () => {
    const text = 'bunx foldkitcn add shadcn/button'

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'button' }),
        ),
      ),
      Scene.expect(
        Scene.role('button', { name: 'Copy Button install command' }),
      ).toExist(),
      Scene.expect(
        Scene.role('button', { name: 'Copy Button import snippet' }),
      ).toExist(),
      Scene.click(
        Scene.role('button', { name: 'Copy Button install command' }),
      ),
      Scene.Command.expectExact(CopySnippet({ text })),
      Scene.Command.resolve(
        CopySnippet({ text }),
        SucceededCopySnippet({ text }),
      ),
      Scene.expect(Scene.role('status')).toContainText('Copied to clipboard'),
      Scene.Command.expectExact(HideCopiedIndicator({ text })),
      Scene.Command.resolve(
        HideCopiedIndicator({ text }),
        HidCopiedIndicator({ text }),
      ),
    )
  })

  test('Registry renders its page heading', () => {
    Scene.scene(
      { update, view },
      Scene.with(modelWithRoute(RegistryRoute({}))),
      Scene.expect(Scene.role('heading', { name: 'Registry' })).toExist(),
    )
  })

  test('Registry Schema renders its page heading', () => {
    Scene.scene(
      { update, view },
      Scene.with(modelWithRoute(RegistrySchemaRoute({}))),
      Scene.expect(
        Scene.role('heading', { name: 'Registry Schema' }),
      ).toExist(),
    )
  })

  test('Registry Lifecycle renders its page heading', () => {
    Scene.scene(
      { update, view },
      Scene.with(modelWithRoute(RegistryLifecycleRoute({}))),
      Scene.expect(
        Scene.role('heading', { name: 'Registry Lifecycle' }),
      ).toExist(),
    )
  })

  test('Roadmap renders structured counts, candidates, and blockers', () => {
    Scene.scene(
      { update, view },
      Scene.with(modelWithRoute(RoadmapRoute({}))),
      Scene.expect(Scene.role('heading', { name: 'Roadmap' })).toExist(),
      Scene.expect(Scene.text('38 of 38')).toExist(),
      Scene.expect(Scene.text('54 of 64')).toExist(),
      Scene.expect(
        Scene.role('heading', { name: 'Next candidates' }),
      ).toExist(),
      Scene.expect(
        Scene.role('heading', { name: 'Blocked categories' }),
      ).toExist(),
      Scene.expect(
        Scene.role('heading', { name: 'Foundation-gated rows' }),
      ).toExist(),
      Scene.expect(Scene.text('shadcn/chart')).toExist(),
      Scene.expect(
        Scene.role('heading', { name: 'Docs/example-only rows' }),
      ).toExist(),
      Scene.expect(Scene.text('shadcn/data-table')).toExist(),
      Scene.expect(
        Scene.text('plans/artifacts', { exact: false }),
      ).not.toExist(),
    )
  })

  test('Not Found renders its page heading and path', () => {
    Scene.scene(
      { update, view },
      Scene.with(modelWithRoute(NotFoundRoute({ path: '/oops' }))),
      Scene.expect(Scene.role('heading', { name: 'Page Not Found' })).toExist(),
      Scene.expect(Scene.text('The path "/oops"', { exact: false })).toExist(),
    )
  })
})
