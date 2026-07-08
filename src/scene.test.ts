import { Array, HashSet, Option, pipe } from 'effect'
import { Scene } from 'foldkit'
import { describe, expect, test } from 'vitest'

import { docsData, publicComponents } from './data'
import {
  ComponentDetailRoute,
  CompleteLiveExampleToastWait,
  CompletedRemoveLiveExampleToast,
  CompletedTimeoutLiveExampleToast,
  CopySnippet,
  DocsSidebar,
  GotLiveExampleDataTableMessage,
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
  RemoveLiveExampleToast,
  RoadmapRoute,
  SearchPagefind,
  SelectedLiveExampleTabsValue,
  SelectedLiveExampleMenuRadioValue,
  SelectedLiveExampleMenuValue,
  SelectedLiveExampleComboboxValue,
  SelectedLiveExampleSelectValue,
  SucceededCopySnippet,
  TimeoutLiveExampleToast,
  UpdatedLiveExampleCheckboxCheckedState,
  UpdatedLiveExampleComboboxInputValue,
  UpdatedLiveExampleMenuChecked,
  UpdatedLiveExampleMenuOpen,
  UpdatedLiveExampleOverlayOpen,
  UpdatedLiveExampleOtpValue,
  UpdatedLiveExampleSelectOpen,
  UpdatedLiveExampleSliderValues,
  update,
  view,
} from './main'
import type { Model } from './main'
import {
  ClickedDataTableRowCheckbox,
  ClickedDataTableSelectAll,
  SelectedDataTablePageSize,
} from './registry/shadcn/data-table/examples'
import { DrawerDemo, DrawerWithSides } from './registry/shadcn/drawer/examples'
import { SheetDemo, SheetSide } from './registry/shadcn/sheet/examples'

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

const comboboxPopupExampleId = 'shadcn/combobox-popup'
const comboboxCustomExampleId = 'shadcn/combobox-custom'
const dataTableDemoExampleId = 'shadcn/data-table-demo'
const paginationIconsOnlyExampleId = 'shadcn/pagination-icons-only'
const inputOtpDemoExampleId = 'shadcn/input-otp-demo'
const sliderDemoExampleId = 'shadcn/slider-demo'
const sliderRangeExampleId = 'shadcn/slider-range'
const sliderVerticalExampleId = 'shadcn/slider-vertical'

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
  docsSidebar: DocsSidebar({ isOpen: false }),
  copiedSnippets: HashSet.empty(),
  liveExampleInputValues: {},
  liveExampleOtpValues: {},
  liveExampleSliderValues: {},
  maybeLiveExampleSliderDrag: Option.none(),
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
  liveExampleCalendarVisibleMonths: {},
  liveExampleCarouselSelectedIndexes: {},
  liveExampleResizableStates: {},
  liveExampleCommandDialogOpenValues: {},
  liveExampleOverlayOpenValues: {},
  liveExampleDataTableStates: {},
  liveExampleMenuOpenValues: {},
  liveExampleMenuOpenSubmenuValues: {},
  liveExampleMenuContextPoints: {},
  liveExampleMenuHighlightedValues: {},
  liveExampleMenuValues: {},
  liveExampleMenuCheckedValues: {},
  liveExampleMenuRadioValues: {},
  liveExampleDatePickerStates: {},
  liveExampleToastStates: {},
  liveExampleSidebarOpenValues: {},
  liveExampleSidebarPanelOpenValues: {},
  liveExampleSidebarSelectedValues: {},
  docsPreviewCodeOpenValues: {},
  docsInstallTabValues: {},
  searchQuery: '',
  pagefindSearch: IdlePagefindSearch(),
})

const resolveStaleToastTimeout = (
  exampleId: string,
  toastId: string,
  durationMillis: number,
  updateKey = 0,
) =>
  Scene.Command.resolve(
    TimeoutLiveExampleToast({ exampleId, toastId, updateKey, durationMillis }),
    CompletedTimeoutLiveExampleToast({ exampleId, toastId, updateKey: -1 }),
  )

const resolveToastRemoval = (exampleId: string, toastId: string) =>
  Scene.Command.resolve(
    RemoveLiveExampleToast({ exampleId, toastId }),
    CompletedRemoveLiveExampleToast({ exampleId, toastId }),
  )

const liveExampleControlStateKey = (
  exampleId: string,
  controlId: string,
): string => `${exampleId}#${controlId}`

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
      Scene.expect(Scene.selector('[data-slot="card"]')).toExist(),
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

  test('Carousel live previews disable previous at their first slide', () => {
    const preview = Scene.label('CarouselDemo live preview')

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'carousel' }),
        ),
      ),
      Scene.expect(
        Scene.within(preview, Scene.role('button', { name: 'Previous slide' })),
      ).toBeDisabled(),
      Scene.expect(
        Scene.within(preview, Scene.selector('[data-slot="carousel"]')),
      ).toHaveAttr('data-selected-index', '0'),
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
            '[data-slot="dropdown-menu-content"][data-side="right"]',
          ),
        ),
      ).toExist(),
    )
  })

  test('SidebarFooter live preview opens and dismisses the footer menu', () => {
    const preview = Scene.label('SidebarFooter live preview')

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'sidebar' }),
        ),
      ),
      Scene.click(
        Scene.within(preview, Scene.role('button', { name: /Username/ })),
      ),
      Scene.expect(Scene.within(preview, Scene.text('Account'))).toExist(),
      Scene.expect(
        Scene.within(
          preview,
          Scene.selector(
            '[data-slot="dropdown-menu-content"][data-side="top"]',
          ),
        ),
      ).toExist(),
      Scene.click(Scene.within(preview, Scene.text('Account'))),
      Scene.expect(Scene.within(preview, Scene.text('Billing'))).not.toExist(),
    )
  })

  test('sidebar static family examples are interactive when live-ready', () => {
    const groupPreview = Scene.label('SidebarGroupCollapsible live preview')
    const menuPreview = Scene.label('SidebarMenuCollapsible live preview')
    const actionPreview = Scene.label('SidebarMenuAction live preview')
    const subPreview = Scene.label('SidebarMenuSub live preview')

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'sidebar' }),
        ),
      ),
      Scene.expect(Scene.within(groupPreview, Scene.text('Support'))).toExist(),
      Scene.click(
        Scene.within(groupPreview, Scene.role('button', { name: /Help/ })),
      ),
      Scene.expect(
        Scene.within(groupPreview, Scene.text('Support')),
      ).not.toExist(),
      Scene.expect(
        Scene.within(menuPreview, Scene.text('Installation')),
      ).toExist(),
      Scene.click(
        Scene.within(
          menuPreview,
          Scene.role('button', { name: /Getting Started/ }),
        ),
      ),
      Scene.expect(
        Scene.within(menuPreview, Scene.text('Installation')),
      ).not.toExist(),
      Scene.click(
        Scene.within(
          actionPreview,
          Scene.role('button', { name: 'More Design Engineering' }),
        ),
      ),
      Scene.expect(
        Scene.within(actionPreview, Scene.text('View Project')),
      ).toExist(),
      Scene.click(Scene.within(actionPreview, Scene.text('Share Project'))),
      Scene.expect(
        Scene.within(actionPreview, Scene.text('Archive Project')),
      ).not.toExist(),
      Scene.expect(
        Scene.within(
          subPreview,
          Scene.selector('[data-slot="sidebar-menu-sub"]'),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(subPreview, Scene.text('Installation')),
      ).toExist(),
    )
  })

  test('Drawer live previews open their configured side surfaces', () => {
    const demoPreview = Scene.label('DrawerDemo live preview')
    const sidesPreview = Scene.label('DrawerWithSides live preview')

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'drawer' }),
        ),
      ),
      Scene.click(
        Scene.within(
          demoPreview,
          Scene.role('button', { name: 'Open Drawer' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          demoPreview,
          Scene.selector('[data-slot="drawer-content"]'),
        ),
      ).toHaveAttr('data-vaul-drawer-direction', 'bottom'),
      Scene.click(
        Scene.within(sidesPreview, Scene.role('button', { name: 'top' })),
      ),
      Scene.expect(
        Scene.within(
          sidesPreview,
          Scene.selector(
            '[data-slot="drawer-content"][data-vaul-drawer-direction="top"]',
          ),
        ),
      ).toExist(),
      Scene.click(
        Scene.within(sidesPreview, Scene.role('button', { name: 'bottom' })),
      ),
      Scene.expect(
        Scene.within(
          sidesPreview,
          Scene.selector(
            '[data-slot="drawer-content"][data-vaul-drawer-direction="bottom"]',
          ),
        ),
      ).toExist(),
    )
  })

  test('Sheet live previews open their configured side surfaces', () => {
    const demoPreview = Scene.label('SheetDemo live preview')
    const sidesPreview = Scene.label('SheetSide live preview')

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'sheet' }),
        ),
      ),
      Scene.click(
        Scene.within(demoPreview, Scene.role('button', { name: 'Open' })),
      ),
      Scene.expect(
        Scene.within(
          demoPreview,
          Scene.selector('[data-slot="sheet-content"]'),
        ),
      ).toHaveAttr('data-side', 'right'),
      Scene.click(
        Scene.within(sidesPreview, Scene.role('button', { name: 'top' })),
      ),
      Scene.expect(
        Scene.within(
          sidesPreview,
          Scene.selector('[data-slot="sheet-content"][data-side="top"]'),
        ),
      ).toExist(),
      Scene.click(
        Scene.within(sidesPreview, Scene.role('button', { name: 'bottom' })),
      ),
      Scene.expect(
        Scene.within(
          sidesPreview,
          Scene.selector('[data-slot="sheet-content"][data-side="bottom"]'),
        ),
      ).toExist(),
    )
  })

  test('Bubble live previews expand, toast, tooltip, and popover from Foldkit state', () => {
    const collapsiblePreview = Scene.label('BubbleCollapsibleDemo live preview')
    const linkPreview = Scene.label('BubbleLinkButtonDemo live preview')
    const tooltipPreview = Scene.label('BubbleTooltipDemo live preview')
    const popoverPreview = Scene.label('BubblePopoverDemo live preview')

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'bubble' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          collapsiblePreview,
          Scene.text('The menu needs the hover and focus tokens split', {
            exact: false,
          }),
        ),
      ).not.toExist(),
      Scene.click(
        Scene.within(
          collapsiblePreview,
          Scene.role('button', { name: 'Show more' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          collapsiblePreview,
          Scene.text('The menu needs the hover and focus tokens split', {
            exact: false,
          }),
        ),
      ).toExist(),
      Scene.click(
        Scene.within(
          collapsiblePreview,
          Scene.role('button', { name: 'Show less' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          collapsiblePreview,
          Scene.text('The menu needs the hover and focus tokens split', {
            exact: false,
          }),
        ),
      ).not.toExist(),
      Scene.click(
        Scene.within(
          linkPreview,
          Scene.role('button', { name: 'I forgot my password' }),
        ),
      ),
      Scene.expect(
        Scene.within(linkPreview, Scene.text('Reply selected')),
      ).toExist(),
      Scene.expect(
        Scene.within(linkPreview, Scene.text('I forgot my password')),
      ).toExist(),
      resolveStaleToastTimeout('shadcn/bubble-link-button', 'toast-1', 5000),
      Scene.focus(
        Scene.within(
          tooltipPreview,
          Scene.role('button', { name: 'Read on Jan 5, 2026 at 4:32 PM' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          tooltipPreview,
          Scene.selector('[data-slot="tooltip-content"]'),
        ),
      ).toExist(),
      Scene.click(
        Scene.within(
          popoverPreview,
          Scene.role('button', { name: 'Show error details' }),
        ),
      ),
      Scene.expect(
        Scene.within(popoverPreview, Scene.text('Command failed')),
      ).toExist(),
      Scene.expect(
        Scene.within(
          popoverPreview,
          Scene.selector('[data-slot="popover-content"]'),
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

  test('the docs sidebar keeps search and component navigation together', () => {
    Scene.scene(
      { update, view },
      Scene.with(modelWithRoute(ComponentsIndexRoute({}))),
      Scene.expect(Scene.selector('.docs-sidebar')).toExist(),
      Scene.expect(
        Scene.selector('.docs-sidebar-section.docs-sidebar-search'),
      ).toExist(),
      Scene.expect(
        Scene.selector('.docs-sidebar-section.docs-sidebar-components'),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('.docs-sidebar-section.docs-sidebar-search'),
          Scene.label('Search documentation'),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('.docs-sidebar-section.docs-sidebar-components'),
          Scene.role('heading', { name: 'Components' }),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('.docs-sidebar-section.docs-sidebar-components'),
          Scene.role('navigation', { name: 'Component navigation' }),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('.docs-sidebar-section.docs-sidebar-components'),
          Scene.role('link', { name: 'All components' }),
        ),
      ).toHaveAttr('aria-current', 'page'),
      Scene.expect(
        Scene.within(
          Scene.selector('#main-content'),
          Scene.role('link', { name: 'All components' }),
        ),
      ).not.toExist(),
    )
  })

  test('the docs sidebar exposes a manual collapsed-state toggle', () => {
    Scene.scene(
      { update, view },
      Scene.with(modelWithRoute(ComponentsIndexRoute({}))),
      Scene.expect(
        Scene.role('button', { name: 'Browse components' }),
      ).toHaveAttr('aria-expanded', 'false'),
      Scene.expect(Scene.selector('.docs-sidebar')).toHaveAttr(
        'data-state',
        'collapsed',
      ),
      Scene.click(Scene.role('button', { name: 'Browse components' })),
      Scene.expect(
        Scene.role('button', { name: 'Hide components' }),
      ).toHaveAttr('aria-expanded', 'true'),
      Scene.expect(Scene.selector('.docs-sidebar')).toHaveAttr(
        'data-state',
        'open',
      ),
    )
  })

  test.each([
    HomeRoute({}),
    DocsRoute({}),
    ComponentsIndexRoute({}),
    RegistryRoute({}),
    RoadmapRoute({}),
    NotFoundRoute({ path: '/missing' }),
  ])('the docs TOC stays off %s routes', route => {
    Scene.scene(
      { update, view },
      Scene.with(modelWithRoute(route)),
      Scene.expect(Scene.selector('.docs-toc')).not.toExist(),
      Scene.expect(Scene.text('On this page')).not.toExist(),
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

  test('Button detail renders install tabs and shared usage code panels', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'button' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          Scene.selector('#installation'),
          Scene.role('button', { name: 'CLI' }),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('#installation'),
          Scene.role('button', { name: 'Manual' }),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('#installation'),
          Scene.role('button', { name: 'CLI' }),
        ),
      ).toHaveAttr('data-slot', 'button'),
      Scene.expect(
        Scene.within(
          Scene.selector('#installation'),
          Scene.role('button', { name: 'Manual' }),
        ),
      ).toHaveAttr('data-slot', 'button'),
      Scene.expect(
        Scene.within(
          Scene.selector('#installation'),
          Scene.role('button', { name: 'CLI' }),
        ),
      ).toHaveAttr('aria-pressed', 'true'),
      Scene.expect(
        Scene.within(
          Scene.selector('#installation'),
          Scene.text('bunx foldkitcn add shadcn/button'),
        ),
      ).toExist(),
      Scene.click(
        Scene.within(
          Scene.selector('#installation'),
          Scene.role('button', { name: 'Manual' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          Scene.selector('#installation'),
          Scene.text('src/registry/shadcn/button/index.ts'),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('#installation'),
          Scene.text('export const Button', { exact: false }),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('#installation'),
          Scene.role('button', {
            name: 'Copy Button manual source src/registry/shadcn/button/index.ts',
          }),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('#installation'),
          Scene.role('button', {
            name: 'Copy Button manual source src/registry/shadcn/button/index.ts',
          }),
        ),
      ).toHaveAttr('data-slot', 'button'),
      Scene.expect(
        Scene.within(
          Scene.selector('#usage'),
          Scene.selector('[data-slot="docs-code-panel"]'),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('#usage'),
          Scene.role('button', { name: 'Copy Button import snippet' }),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.selector('#usage'),
          Scene.role('button', { name: 'Copy Button import snippet' }),
        ),
      ).toHaveAttr('data-slot', 'button'),
    )
  })

  test('Typography detail renders docs-only guidance without install snippets', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'typography' }),
        ),
      ),
      Scene.expect(Scene.role('heading', { name: 'Typography' })).toExist(),
      Scene.expect(
        Scene.text('does not ship default typography styles', {
          exact: false,
        }),
      ).toExist(),
      Scene.expect(
        Scene.text('has no installable component', { exact: false }),
      ).toExist(),
      Scene.expect(
        Scene.text('bunx foldkitcn add shadcn/typography'),
      ).not.toExist(),
      Scene.expect(Scene.role('button', { name: 'Manual' })).not.toExist(),
      Scene.expect(
        Scene.text(
          "import { Typography } from '@/components/foldkitcn/shadcn/typography'",
        ),
      ).not.toExist(),
      Scene.expect(Scene.role('heading', { name: 'TypographyDemo' })).toExist(),
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

  test('Button detail renders examples in preview cards with collapsed source', () => {
    const defaultCard = Scene.selector('#shadcn-button-default')

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'button' }),
        ),
      ),
      Scene.expect(
        Scene.within(defaultCard, Scene.selector('[data-slot="docs-preview"]')),
      ).toExist(),
      Scene.expect(
        Scene.within(
          defaultCard,
          Scene.selector('[data-slot="docs-code-preview"]'),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          defaultCard,
          Scene.role('button', { name: 'View ButtonDefault code' }),
        ),
      ).toExist(),
      Scene.expect(
        Scene.selector('[data-docs-slot="docs-preview-card"]'),
      ).toExist(),
      Scene.expect(
        Scene.within(
          defaultCard,
          Scene.text("['Button']", {
            exact: false,
          }),
        ),
      ).not.toExist(),
      Scene.click(
        Scene.within(
          defaultCard,
          Scene.role('button', { name: 'View ButtonDefault code' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          defaultCard,
          Scene.selector('[data-slot="docs-code-full"]'),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          defaultCard,
          Scene.text('export const ButtonDefault = (): Html => {', {
            exact: false,
          }),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          defaultCard,
          Scene.role('button', { name: 'Copy ButtonDefault example snippet' }),
        ),
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
      resolveStaleToastTimeout('base-ui/toast-anchored-toasts', 'copied', 1500),
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
      resolveStaleToastTimeout(
        'base-ui/toast-custom-position',
        'toast-1',
        5000,
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
      resolveStaleToastTimeout(
        'base-ui/toast-custom-position',
        'toast-2',
        5000,
      ),
      Scene.click(
        Scene.within(
          customPositionPreview,
          Scene.role('button', { name: 'Dismiss' }),
        ),
      ),
      Scene.expect(
        Scene.within(customPositionPreview, Scene.text('Toast 2 created')),
      ).not.toExist(),
      resolveToastRemoval('base-ui/toast-custom-position', 'toast-2'),
      Scene.click(
        Scene.within(
          undoPreview,
          Scene.role('button', { name: 'Perform action' }),
        ),
      ),
      resolveStaleToastTimeout('base-ui/toast-undo-action', 'undo-1', 10_000),
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
      resolveStaleToastTimeout('base-ui/toast-undo-action', 'undo-2', 10_000),
      Scene.click(
        Scene.within(undoPreview, Scene.role('button', { name: 'Undo' })),
      ),
      Scene.expect(
        Scene.within(undoPreview, Scene.text('Action undone')),
      ).toExist(),
      Scene.expect(
        Scene.within(undoPreview, Scene.text('You can undo this action.')),
      ).toExist(),
      resolveToastRemoval('base-ui/toast-undo-action', 'undo-2'),
      resolveStaleToastTimeout(
        'base-ui/toast-undo-action',
        'action-undone',
        5000,
      ),
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
      resolveStaleToastTimeout('base-ui/toast-promise', 'toast-1', 5000, 1),
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
      resolveStaleToastTimeout('base-ui/toast-promise', 'toast-2', 5000, 1),
      Scene.click(
        Scene.within(waitingPreview, Scene.role('button', { name: 'Dismiss' })),
      ),
      resolveToastRemoval('base-ui/toast-promise', 'toast-2'),
      Scene.click(
        Scene.within(waitingPreview, Scene.role('button', { name: 'Dismiss' })),
      ),
      resolveToastRemoval('base-ui/toast-promise', 'toast-1'),
      Scene.expect(
        Scene.within(waitingPreview, Scene.text('Result received')),
      ).not.toExist(),
      Scene.click(
        Scene.within(
          customPreview,
          Scene.role('button', { name: 'Create custom toast' }),
        ),
      ),
      resolveStaleToastTimeout('base-ui/toast-custom', 'toast-1', 5000),
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
      resolveStaleToastTimeout('base-ui/toast-custom', 'toast-2', 5000),
      Scene.click(
        Scene.within(customPreview, Scene.role('button', { name: 'Dismiss' })),
      ),
      Scene.expect(
        Scene.within(customPreview, Scene.text('Toast with custom data 2')),
      ).not.toExist(),
      resolveToastRemoval('base-ui/toast-custom', 'toast-2'),
      Scene.click(
        Scene.within(
          deduplicatedPreview,
          Scene.role('button', { name: 'Save draft' }),
        ),
      ),
      resolveStaleToastTimeout(
        'base-ui/toast-deduplicated-toast',
        'save-status',
        5000,
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
      resolveStaleToastTimeout(
        'base-ui/toast-deduplicated-toast',
        'save-status',
        5000,
        1,
      ),
      Scene.click(
        Scene.within(
          deduplicatedPreview,
          Scene.role('button', { name: 'Dismiss' }),
        ),
      ),
      Scene.expect(
        Scene.within(deduplicatedPreview, Scene.text('Draft saved')),
      ).not.toExist(),
      resolveToastRemoval('base-ui/toast-deduplicated-toast', 'save-status'),
      Scene.click(
        Scene.within(
          varyingHeightsPreview,
          Scene.role('button', { name: 'Create varying height toast' }),
        ),
      ),
      resolveStaleToastTimeout(
        'base-ui/toast-varying-heights',
        'toast-1',
        5000,
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
      resolveStaleToastTimeout(
        'base-ui/toast-varying-heights',
        'toast-2',
        5000,
      ),
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
      resolveToastRemoval('base-ui/toast-varying-heights', 'toast-2'),
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

  test('root update records overlay and menu state for live examples', () => {
    const initial = modelWithRoute(ComponentsIndexRoute({}))

    const [afterOverlay] = update(
      initial,
      UpdatedLiveExampleOverlayOpen({
        exampleId: 'shadcn/dialog-demo',
        overlayId: 'dialog-demo',
        open: true,
      }),
    )
    const [afterSubmenuOpen] = update(
      afterOverlay,
      UpdatedLiveExampleMenuOpen({
        exampleId: 'shadcn/dropdown-menu-submenu',
        menuId: 'dropdown-menu-submenu',
        open: true,
        parentValue: 'invite',
      }),
    )
    const [afterSubmenuNestedOpen] = update(
      afterSubmenuOpen,
      UpdatedLiveExampleMenuOpen({
        exampleId: 'shadcn/dropdown-menu-submenu',
        menuId: 'dropdown-menu-submenu',
        open: true,
        parentValue: 'more-options',
      }),
    )
    const [afterOtherMenuOpen] = update(
      afterSubmenuNestedOpen,
      UpdatedLiveExampleMenuOpen({
        exampleId: 'shadcn/context-menu-basic',
        menuId: 'context-menu-basic',
        open: true,
      }),
    )
    const [afterDropdownChecked] = update(
      afterOtherMenuOpen,
      UpdatedLiveExampleMenuChecked({
        exampleId: 'shadcn/dropdown-menu-checkboxes',
        menuId: 'dropdown-menu-checkboxes',
        itemValue: 'panel',
        checked: true,
      }),
    )
    const [afterDropdownRadio] = update(
      afterDropdownChecked,
      SelectedLiveExampleMenuRadioValue({
        exampleId: 'shadcn/dropdown-menu-radio-group',
        menuId: 'dropdown-menu-radio-group',
        groupValue: 'panel-position',
        value: 'bottom',
      }),
    )
    expect(
      (afterDropdownRadio.liveExampleMenuRadioValues ?? {})[
        liveExampleControlStateKey(
          'shadcn/dropdown-menu-radio-group',
          'dropdown-menu-radio-group#radio#panel-position',
        )
      ],
    ).toBe('bottom')
    const [afterMenubarActive] = update(
      afterDropdownRadio,
      SelectedLiveExampleMenuValue({
        exampleId: 'shadcn/menubar-demo',
        menuId: 'menubar-demo',
        value: 'edit',
      }),
    )
    const [afterNavigationActive] = update(
      afterMenubarActive,
      SelectedLiveExampleMenuValue({
        exampleId: 'shadcn/navigation-menu-demo',
        menuId: 'navigation-menu-demo',
        value: 'components',
      }),
    )

    expect(
      afterNavigationActive.liveExampleOverlayOpenValues[
        liveExampleControlStateKey('shadcn/dialog-demo', 'dialog-demo')
      ],
    ).toBe(true)
    expect(
      afterNavigationActive.liveExampleMenuOpenSubmenuValues[
        liveExampleControlStateKey(
          'shadcn/dropdown-menu-submenu',
          'dropdown-menu-submenu',
        )
      ] ?? [],
    ).toStrictEqual([])
    expect(
      afterNavigationActive.liveExampleMenuOpenValues[
        liveExampleControlStateKey(
          'shadcn/context-menu-basic',
          'context-menu-basic',
        )
      ],
    ).toBe(true)
    expect(
      afterNavigationActive.liveExampleMenuOpenValues[
        liveExampleControlStateKey(
          'shadcn/dropdown-menu-submenu',
          'dropdown-menu-submenu',
        )
      ] ?? false,
    ).toBe(false)
    expect(
      (afterNavigationActive.liveExampleMenuRadioValues ?? {})[
        liveExampleControlStateKey(
          'shadcn/dropdown-menu-radio-group',
          'dropdown-menu-radio-group#radio#panel-position',
        )
      ],
    ).toBe('bottom')
    expect(
      afterNavigationActive.liveExampleMenuCheckedValues[
        liveExampleControlStateKey(
          'shadcn/dropdown-menu-checkboxes',
          'dropdown-menu-checkboxes#checked#panel',
        )
      ],
    ).toBe(true)
    expect(
      afterNavigationActive.liveExampleMenuRadioValues[
        liveExampleControlStateKey(
          'shadcn/dropdown-menu-radio-group',
          'dropdown-menu-radio-group#radio#panel-position',
        )
      ],
    ).toBe('bottom')
    expect(
      afterNavigationActive.liveExampleMenuValues[
        liveExampleControlStateKey('shadcn/menubar-demo', 'menubar-demo')
      ],
    ).toBe('edit')
    expect(
      afterNavigationActive.liveExampleMenuValues[
        liveExampleControlStateKey(
          'shadcn/navigation-menu-demo',
          'navigation-menu-demo',
        )
      ],
    ).toBe('components')
  })

  test('root update records live preview otp, checkbox table, and collapsible tab state', () => {
    const initial = modelWithRoute(ComponentsIndexRoute({}))

    const [afterOtp] = update(
      initial,
      UpdatedLiveExampleOtpValue({
        exampleId: 'shadcn/input-otp-demo',
        value: '654321',
        isComplete: true,
      }),
    )
    const [afterSelectAll] = update(
      afterOtp,
      UpdatedLiveExampleCheckboxCheckedState({
        exampleId: 'shadcn/checkbox-table',
        controlId: 'select-all-checkbox',
        checkedState: 'checked',
      }),
    )
    const [afterRowUnchecked] = update(
      afterSelectAll,
      UpdatedLiveExampleCheckboxCheckedState({
        exampleId: 'shadcn/checkbox-table',
        controlId: 'row-2-checkbox',
        checkedState: 'unchecked',
      }),
    )
    const [afterTabs] = update(
      afterRowUnchecked,
      SelectedLiveExampleTabsValue({
        exampleId: 'shadcn/collapsible-file-tree',
        tabsId: 'collapsible-file-tree-tabs',
        value: 'outline',
      }),
    )

    expect(afterTabs.liveExampleOtpValues['shadcn/input-otp-demo']).toBe(
      '654321',
    )
    expect(
      afterTabs.liveExampleCheckboxCheckedStates[
        liveExampleControlStateKey('shadcn/checkbox-table', 'row-1-checkbox')
      ],
    ).toBe('checked')
    expect(
      afterTabs.liveExampleCheckboxCheckedStates[
        liveExampleControlStateKey('shadcn/checkbox-table', 'row-3-checkbox')
      ],
    ).toBe('checked')
    expect(
      afterTabs.liveExampleCheckboxCheckedStates[
        liveExampleControlStateKey('shadcn/checkbox-table', 'row-2-checkbox')
      ],
    ).toBe('unchecked')
    expect(
      afterTabs.liveExampleTabsValues[
        liveExampleControlStateKey(
          'shadcn/collapsible-file-tree',
          'collapsible-file-tree-tabs',
        )
      ],
    ).toBe('outline')
  })

  test('root update keeps combobox selection, clear, and custom-item state aligned', () => {
    const initial = modelWithRoute(ComponentsIndexRoute({}))

    const [afterTyping] = update(
      initial,
      UpdatedLiveExampleComboboxInputValue({
        exampleId: comboboxPopupExampleId,
        value: 'chi',
      }),
    )
    const [afterClear] = update(
      afterTyping,
      SelectedLiveExampleComboboxValue({
        exampleId: comboboxPopupExampleId,
        value: undefined,
        values: [],
      }),
    )
    const [afterCustomItem] = update(
      afterClear,
      SelectedLiveExampleComboboxValue({
        exampleId: comboboxCustomExampleId,
        value: 'argentina',
        values: ['argentina'],
      }),
    )

    expect(
      afterTyping.liveExampleComboboxInputValues[comboboxPopupExampleId],
    ).toBe('chi')
    expect(
      afterTyping.liveExampleComboboxOpenValues[comboboxPopupExampleId],
    ).toBe(true)
    expect(
      afterClear.liveExampleComboboxValues[comboboxPopupExampleId],
    ).toBeUndefined()
    expect(
      afterClear.liveExampleComboboxInputValues[comboboxPopupExampleId],
    ).toBe('')
    expect(
      afterClear.liveExampleComboboxOpenValues[comboboxPopupExampleId],
    ).toBe(false)
    expect(
      afterCustomItem.liveExampleComboboxValues[comboboxCustomExampleId],
    ).toBe('argentina')
    expect(
      afterCustomItem.liveExampleComboboxMultipleValues[
        comboboxCustomExampleId
      ],
    ).toStrictEqual(['argentina'])
    expect(
      afterCustomItem.liveExampleComboboxInputValues[comboboxCustomExampleId],
    ).toBe('')
    expect(
      afterCustomItem.liveExampleComboboxOpenValues[comboboxCustomExampleId],
    ).toBe(false)
  })

  test('root update keeps data table page size and row selection aggregates aligned', () => {
    const initial = modelWithRoute(ComponentsIndexRoute({}))
    const pageRowIds = ['m5gr84i9', '3u1reuv4', 'derv1ws0', '5kma53ae']

    const [afterPageSize] = update(
      initial,
      GotLiveExampleDataTableMessage({
        exampleId: dataTableDemoExampleId,
        message: SelectedDataTablePageSize({ pageSize: 4 }),
      }),
    )
    const [afterSelectAll] = update(
      afterPageSize,
      GotLiveExampleDataTableMessage({
        exampleId: dataTableDemoExampleId,
        message: ClickedDataTableSelectAll({ rowIds: pageRowIds }),
      }),
    )
    const [afterRowUnchecked] = update(
      afterSelectAll,
      GotLiveExampleDataTableMessage({
        exampleId: dataTableDemoExampleId,
        message: ClickedDataTableRowCheckbox({ rowId: '3u1reuv4' }),
      }),
    )

    expect(
      afterPageSize.liveExampleDataTableStates?.[dataTableDemoExampleId],
    ).toMatchObject({
      pageIndex: 0,
      pageSize: 4,
    })
    expect(
      Object.values(
        afterSelectAll.liveExampleDataTableStates?.[dataTableDemoExampleId]
          ?.selectedRowIds ?? {},
      ).filter(isSelected => isSelected === true),
    ).toHaveLength(4)
    expect(
      Object.values(
        afterRowUnchecked.liveExampleDataTableStates?.[dataTableDemoExampleId]
          ?.selectedRowIds ?? {},
      ).filter(isSelected => isSelected === true),
    ).toHaveLength(3)
  })

  test('root update keeps one live example menu root open at a time', () => {
    const initial = modelWithRoute(ComponentsIndexRoute({}))

    const [afterTableOpen] = update(
      initial,
      UpdatedLiveExampleMenuOpen({
        exampleId: 'shadcn/table-actions',
        menuId: 'table-actions-wireless-mouse',
        open: true,
      }),
    )
    const [afterSidebarOpen] = update(
      afterTableOpen,
      UpdatedLiveExampleMenuOpen({
        exampleId: 'shadcn/sidebar-menu-action',
        menuId: 'menu-action:Design Engineering',
        open: true,
      }),
    )

    expect(
      afterSidebarOpen.liveExampleMenuOpenValues[
        liveExampleControlStateKey(
          'shadcn/table-actions',
          'table-actions-wireless-mouse',
        )
      ],
    ).toBe(false)
    expect(
      afterSidebarOpen.liveExampleMenuOpenValues[
        liveExampleControlStateKey(
          'shadcn/sidebar-menu-action',
          'menu-action:Design Engineering',
        )
      ],
    ).toBe(true)
    expect(
      afterSidebarOpen.liveExampleMenuOpenValues[
        liveExampleControlStateKey(
          'shadcn/table-actions',
          'menu-action:Design Engineering',
        )
      ],
    ).toBeUndefined()
  })

  test('root update keeps pagination rows-per-page select value aligned', () => {
    const initial = modelWithRoute(ComponentsIndexRoute({}))

    const [afterOpen] = update(
      initial,
      UpdatedLiveExampleSelectOpen({
        exampleId: paginationIconsOnlyExampleId,
        open: true,
      }),
    )
    const [afterSelect] = update(
      afterOpen,
      SelectedLiveExampleSelectValue({
        exampleId: paginationIconsOnlyExampleId,
        value: '10',
      }),
    )

    expect(
      afterOpen.liveExampleSelectOpenValues[paginationIconsOnlyExampleId],
    ).toBe(true)
    expect(
      afterSelect.liveExampleSelectValues[paginationIconsOnlyExampleId],
    ).toBe('10')
    expect(
      afterSelect.liveExampleSelectOpenValues[paginationIconsOnlyExampleId],
    ).toBe(false)
  })

  test('root update keeps otp and slider live example values aligned', () => {
    const initial = modelWithRoute(ComponentsIndexRoute({}))

    const [afterOtpInsert] = update(
      initial,
      UpdatedLiveExampleOtpValue({
        exampleId: inputOtpDemoExampleId,
        value: '123456',
        isComplete: true,
      }),
    )
    const [afterOtpDelete] = update(
      afterOtpInsert,
      UpdatedLiveExampleOtpValue({
        exampleId: inputOtpDemoExampleId,
        value: '12345',
        isComplete: false,
      }),
    )
    const [afterOtpResume] = update(
      afterOtpDelete,
      UpdatedLiveExampleOtpValue({
        exampleId: inputOtpDemoExampleId,
        value: '123456',
        isComplete: true,
      }),
    )
    const [afterSliderDemo] = update(
      afterOtpResume,
      UpdatedLiveExampleSliderValues({
        exampleId: sliderDemoExampleId,
        sliderId: 'slider-demo-live',
        values: [76],
      }),
    )
    const [afterSliderRange] = update(
      afterSliderDemo,
      UpdatedLiveExampleSliderValues({
        exampleId: sliderRangeExampleId,
        sliderId: 'slider-range-live',
        values: [30, 55],
      }),
    )
    const [afterSliderVertical] = update(
      afterSliderRange,
      UpdatedLiveExampleSliderValues({
        exampleId: sliderVerticalExampleId,
        sliderId: 'slider-vertical-live',
        values: [51],
      }),
    )

    expect(afterOtpInsert.liveExampleOtpValues[inputOtpDemoExampleId]).toBe(
      '123456',
    )
    expect(afterOtpDelete.liveExampleOtpValues[inputOtpDemoExampleId]).toBe(
      '12345',
    )
    expect(afterOtpResume.liveExampleOtpValues[inputOtpDemoExampleId]).toBe(
      '123456',
    )
    expect(
      afterSliderDemo.liveExampleSliderValues[
        liveExampleControlStateKey(sliderDemoExampleId, 'slider-demo-live')
      ],
    ).toStrictEqual([76])
    expect(
      afterSliderRange.liveExampleSliderValues[
        liveExampleControlStateKey(sliderRangeExampleId, 'slider-range-live')
      ],
    ).toStrictEqual([30, 55])
    expect(
      afterSliderVertical.liveExampleSliderValues[
        liveExampleControlStateKey(
          sliderVerticalExampleId,
          'slider-vertical-live',
        )
      ],
    ).toStrictEqual([51])
  })

  test('ProgressControlled live preview renders a progressbar and slider', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'progress' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          Scene.label('ProgressControlled live preview'),
          Scene.role('slider'),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.label('ProgressControlled live preview'),
          Scene.role('progressbar'),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.label('ProgressControlled live preview'),
          Scene.text('50%'),
        ),
      ).toExist(),
    )
  })

  test('form and selection live previews render repaired descriptions and tabs content', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'checkbox' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          Scene.label('CheckboxDescription live preview'),
          Scene.text(
            'By clicking this checkbox, you agree to the terms and conditions.',
          ),
        ),
      ).toExist(),
      Scene.expect(
        Scene.within(
          Scene.label('CheckboxInTable live preview'),
          Scene.role('checkbox'),
        ),
      ).toExist(),
    )

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'field' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          Scene.label('FieldCheckbox live preview'),
          Scene.text('External disks'),
        ),
      ).toExist(),
    )

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'switch' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          Scene.label('SwitchDescription live preview'),
          Scene.text(
            'Focus is shared across devices, and turns off when you leave the app.',
          ),
        ),
      ).toExist(),
    )

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'collapsible' }),
        ),
      ),
      Scene.click(
        Scene.within(
          Scene.label('CollapsibleFileTree live preview'),
          Scene.role('button', { name: 'Outline' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          Scene.label('CollapsibleFileTree live preview'),
          Scene.text('Project structure'),
        ),
      ).toExist(),
    )

    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'tabs' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          Scene.label('TabsIcons live preview'),
          Scene.selector('[data-icon=\"preview\"]'),
        ),
      ).toExist(),
      Scene.click(
        Scene.within(
          Scene.label('TabsIcons live preview'),
          Scene.role('tab', { name: 'Code' }),
        ),
      ),
      Scene.expect(
        Scene.within(
          Scene.label('TabsIcons live preview'),
          Scene.text('Installable example code'),
        ),
      ).toExist(),
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
      Scene.expect(Scene.text('62 of 63')).toExist(),
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
      ).not.toExist(),
      Scene.expect(Scene.text('shadcn/date-picker')).not.toExist(),
      Scene.expect(
        Scene.text('plans/artifacts', { exact: false }),
      ).not.toExist(),
      Scene.expect(Scene.selector('[data-slot="card"]')).toExist(),
    )
  })

  test('shadcn toast route now falls through to Not Found', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'toast' }),
        ),
      ),
      Scene.expect(Scene.role('heading', { name: 'Page Not Found' })).toExist(),
      Scene.expect(
        Scene.text('The path "/components/shadcn/toast"', { exact: false }),
      ).toExist(),
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
