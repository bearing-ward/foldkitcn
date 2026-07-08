import { HashSet, Option } from 'effect'
import { Story } from 'foldkit'
import { fromString } from 'foldkit/url'
import { describe, expect, test } from 'vitest'

import { docsData } from './data'
import {
  ChangedUrl,
  ClickedClearSearch,
  ClickedCopySnippet,
  CompletedScrollToAnchor,
  ComponentDetailRoute,
  ComponentsIndexRoute,
  ComponentsNamespaceRoute,
  CopySnippet,
  DocsSidebar,
  DocsRoute,
  FailedCopySnippet,
  GotLiveExampleBubbleMessage,
  HidCopiedIndicator,
  HideCopiedIndicator,
  HomeRoute,
  IdlePagefindSearch,
  MobileNavigation,
  PressedLiveExampleCommandDialogShortcut,
  ReceivedPagefindSearchResults,
  RegistryLifecycleRoute,
  RegistryRoute,
  RegistrySchemaRoute,
  RoadmapRoute,
  SearchPagefind,
  ScrollToAnchor,
  SucceededCopySnippet,
  SelectedLiveExampleSidebarValue,
  UpdatedSearchQuery,
  UpdatedLiveExampleMenuOpen,
  UpdatedLiveExampleSidebarOpen,
  UpdatedLiveExampleSidebarPanelOpen,
  componentDetailRouter,
  componentsIndexRouter,
  componentsNamespaceRouter,
  docsRouter,
  homeRouter,
  registryLifecycleRouter,
  registryRouter,
  registrySchemaRouter,
  roadmapRouter,
  update,
  urlToAppRoute,
} from './main'
import type { Model } from './main'
import { ClickedBubbleReply } from './registry/shadcn/bubble/examples'
import { routeInventory } from './route-inventory'

const model: Model = {
  route: HomeRoute({}),
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
  liveExampleMenuOpenValues: {},
  liveExampleMenuOpenSubmenuValues: {},
  liveExampleMenuContextPoints: {},
  liveExampleMenuHighlightedValues: {},
  liveExampleMenuValues: {},
  liveExampleMenuCheckedValues: {},
  liveExampleMenuRadioValues: {},
  liveExampleAttachmentWorkflowStates: {},
  liveExampleDatePickerStates: {},
  liveExampleToastStates: {},
  liveExampleSidebarOpenValues: {},
  liveExampleSidebarPanelOpenValues: {},
  liveExampleSidebarSelectedValues: {},
  searchQuery: '',
  pagefindSearch: IdlePagefindSearch(),
}

const urlOrThrow = (raw: string) =>
  Option.getOrThrowWith(
    fromString(raw),
    () => new Error(`Failed to parse url: ${raw}`),
  )

describe('docs routes', () => {
  test('builds the public docs shell paths', () => {
    expect(homeRouter({})).toBe('/')
    expect(docsRouter({})).toBe('/docs')
    expect(componentsIndexRouter({})).toBe('/components')
    expect(componentsNamespaceRouter({ namespace: 'base-ui' })).toBe(
      '/components/base-ui',
    )
    expect(componentDetailRouter({ namespace: 'shadcn', slug: 'button' })).toBe(
      '/components/shadcn/button',
    )
    expect(registryRouter({})).toBe('/registry')
    expect(registrySchemaRouter({})).toBe('/registry/schema')
    expect(registryLifecycleRouter({})).toBe('/registry/lifecycle')
    expect(roadmapRouter({})).toBe('/roadmap')
  })

  test('parses namespace-explicit URLs', () => {
    expect(urlToAppRoute(urlOrThrow('http://localhost/'))).toStrictEqual(
      HomeRoute({}),
    )
    expect(urlToAppRoute(urlOrThrow('http://localhost/docs'))).toStrictEqual(
      DocsRoute({}),
    )
    expect(
      urlToAppRoute(urlOrThrow('http://localhost/components')),
    ).toStrictEqual(ComponentsIndexRoute({}))
    expect(
      urlToAppRoute(urlOrThrow('http://localhost/components/base-ui')),
    ).toStrictEqual(ComponentsNamespaceRoute({ namespace: 'base-ui' }))
    expect(
      urlToAppRoute(urlOrThrow('http://localhost/components/base-ui/button')),
    ).toStrictEqual(
      ComponentDetailRoute({ namespace: 'base-ui', slug: 'button' }),
    )
    expect(
      urlToAppRoute(urlOrThrow('http://localhost/registry')),
    ).toStrictEqual(RegistryRoute({}))
    expect(
      urlToAppRoute(urlOrThrow('http://localhost/registry/schema')),
    ).toStrictEqual(RegistrySchemaRoute({}))
    expect(
      urlToAppRoute(urlOrThrow('http://localhost/registry/lifecycle')),
    ).toStrictEqual(RegistryLifecycleRoute({}))
    expect(urlToAppRoute(urlOrThrow('http://localhost/roadmap'))).toStrictEqual(
      RoadmapRoute({}),
    )
  })

  test('builds prerender route inventory from generated docs data', () => {
    const paths = routeInventory(docsData).map(entry => entry.path)

    expect(paths).toContain('/')
    expect(paths).toContain('/components/base-ui')
    expect(paths).toContain('/components/shadcn/button')
    expect(paths).toContain('/registry/lifecycle')
    expect(paths).toContain('/roadmap')
  })
})

describe(update, () => {
  describe(ChangedUrl, () => {
    test('updates the model route from a URL change', () => {
      Story.story(
        update,
        Story.with(model),
        Story.message(
          ChangedUrl({
            url: urlOrThrow('http://localhost/components/shadcn/button'),
          }),
        ),
        Story.model(nextModel => {
          expect(nextModel.route).toStrictEqual(
            ComponentDetailRoute({ namespace: 'shadcn', slug: 'button' }),
          )
        }),
      )
    })

    test('an unknown path falls through to NotFound', () => {
      Story.story(
        update,
        Story.with(model),
        Story.message(
          ChangedUrl({ url: urlOrThrow('http://localhost/somewhere/else') }),
        ),
        Story.model(nextModel => {
          expect(nextModel.route._tag).toBe('NotFound')
        }),
      )
    })

    test('scrolls to URL hash targets after route changes', () => {
      Story.story(
        update,
        Story.with(model),
        Story.message(
          ChangedUrl({
            url: urlOrThrow(
              'http://localhost/components/shadcn/input-group#quality',
            ),
          }),
        ),
        Story.model(nextModel => {
          expect(nextModel.route).toStrictEqual(
            ComponentDetailRoute({
              namespace: 'shadcn',
              slug: 'input-group',
            }),
          )
        }),
        Story.Command.expectExact(ScrollToAnchor({ hash: 'quality' })),
        Story.Command.resolve(
          ScrollToAnchor({ hash: 'quality' }),
          CompletedScrollToAnchor(),
        ),
      )
    })
  })

  describe(ClickedCopySnippet, () => {
    test('dispatches a copy command for the selected snippet', () => {
      const text = 'bunx foldkitcn add shadcn/button'

      Story.story(
        update,
        Story.with(model),
        Story.message(ClickedCopySnippet({ text })),
        Story.Command.expectExact(CopySnippet({ text })),
        Story.Command.resolve(
          CopySnippet({ text }),
          SucceededCopySnippet({ text }),
        ),
        Story.Command.expectExact(HideCopiedIndicator({ text })),
        Story.Command.resolve(
          HideCopiedIndicator({ text }),
          HidCopiedIndicator({ text }),
        ),
        Story.Command.expectNone(),
      )
    })

    test('stores copied snippets after a successful copy and hides them later', () => {
      const text =
        "import { Button } from '@/components/foldkitcn/shadcn/button'"

      Story.story(
        update,
        Story.with(model),
        Story.message(SucceededCopySnippet({ text })),
        Story.model(nextModel => {
          expect(HashSet.has(nextModel.copiedSnippets, text)).toBe(true)
        }),
        Story.Command.expectExact(HideCopiedIndicator({ text })),
        Story.Command.resolve(
          HideCopiedIndicator({ text }),
          HidCopiedIndicator({ text }),
        ),
        Story.model(nextModel => {
          expect(HashSet.has(nextModel.copiedSnippets, text)).toBe(false)
        }),
        Story.Command.expectNone(),
      )
    })

    test('does not change copied state after a failed copy', () => {
      Story.story(
        update,
        Story.with(model),
        Story.message(FailedCopySnippet()),
        Story.model(nextModel => {
          expect(HashSet.size(nextModel.copiedSnippets)).toBe(0)
        }),
        Story.Command.expectNone(),
      )
    })

    test('does not schedule another hide command for an already copied snippet', () => {
      const text = 'bunx foldkitcn add shadcn/button'
      const copiedModel: Model = {
        ...model,
        copiedSnippets: HashSet.fromIterable([text]),
      }

      Story.story(
        update,
        Story.with(copiedModel),
        Story.message(SucceededCopySnippet({ text })),
        Story.model(nextModel => {
          expect(HashSet.has(nextModel.copiedSnippets, text)).toBe(true)
        }),
        Story.Command.expectNone(),
      )
    })
  })

  describe(PressedLiveExampleCommandDialogShortcut, () => {
    test('toggles the CommandDialogDemo live example', () => {
      Story.story(
        update,
        Story.with(model),
        Story.message(PressedLiveExampleCommandDialogShortcut()),
        Story.model(nextModel => {
          expect(
            nextModel.liveExampleCommandDialogOpenValues[
              'shadcn/command-dialog'
            ],
          ).toBe(true)
        }),
        Story.message(PressedLiveExampleCommandDialogShortcut()),
        Story.model(nextModel => {
          expect(
            nextModel.liveExampleCommandDialogOpenValues[
              'shadcn/command-dialog'
            ],
          ).toBe(false)
        }),
        Story.Command.expectNone(),
      )
    })
  })

  describe(UpdatedSearchQuery, () => {
    test('stores component search input and starts Pagefind search', () => {
      Story.story(
        update,
        Story.with(model),
        Story.message(UpdatedSearchQuery({ value: 'button' })),
        Story.model(nextModel => {
          expect(nextModel.searchQuery).toBe('button')
          expect(nextModel.pagefindSearch._tag).toBe('LoadingPagefindSearch')
        }),
        Story.Command.expectExact(SearchPagefind({ query: 'button' })),
        Story.Command.resolve(
          SearchPagefind({ query: 'button' }),
          ReceivedPagefindSearchResults({
            query: 'button',
            results: [
              {
                url: '/components/shadcn/button',
                title: 'Button',
                excerpt: 'Button component docs',
                section: 'shadcn',
              },
            ],
          }),
        ),
        Story.model(nextModel => {
          expect(nextModel.pagefindSearch._tag).toBe('LoadedPagefindSearch')
        }),
      )
    })

    test('clearing the search input empties the query', () => {
      Story.story(
        update,
        Story.with({ ...model, searchQuery: 'button' }),
        Story.message(UpdatedSearchQuery({ value: '' })),
        Story.model(nextModel => {
          expect(nextModel.searchQuery).toBe('')
          expect(nextModel.pagefindSearch._tag).toBe('IdlePagefindSearch')
        }),
        Story.Command.expectNone(),
      )
    })
  })

  describe(ClickedClearSearch, () => {
    test('clears the stored component search query', () => {
      Story.story(
        update,
        Story.with({ ...model, searchQuery: 'button' }),
        Story.message(ClickedClearSearch()),
        Story.model(nextModel => {
          expect(nextModel.searchQuery).toBe('')
          expect(nextModel.pagefindSearch._tag).toBe('IdlePagefindSearch')
        }),
        Story.Command.expectNone(),
      )
    })
  })

  describe(GotLiveExampleBubbleMessage, () => {
    test('selected bubble replies create distinct local sonner toasts', () => {
      const [afterFirst, firstCommands] = update(
        model,
        GotLiveExampleBubbleMessage({
          exampleId: 'shadcn/bubble-link-button',
          message: ClickedBubbleReply({ reply: 'I forgot my password' }),
        }),
      )
      const [afterSecond, secondCommands] = update(
        afterFirst,
        GotLiveExampleBubbleMessage({
          exampleId: 'shadcn/bubble-link-button',
          message: ClickedBubbleReply({
            reply: 'I need help with my subscription',
          }),
        }),
      )
      const state =
        afterSecond.liveExampleToastStates['shadcn/bubble-link-button']

      expect(state?.toasts).toHaveLength(2)
      expect(state?.toasts[0]?.title).toBe('Reply selected')
      expect(state?.toasts[0]?.description).toBe(
        'I need help with my subscription',
      )
      expect(state?.toasts[1]?.description).toBe('I forgot my password')
      expect(firstCommands).toHaveLength(1)
      expect(firstCommands[0]?.name).toBe('TimeoutLiveExampleToast')
      expect(secondCommands).toHaveLength(1)
      expect(secondCommands[0]?.name).toBe('TimeoutLiveExampleToast')
    })
  })

  describe(UpdatedLiveExampleMenuOpen, () => {
    test('context menu roots lock and unlock page scroll', () => {
      const [afterOpen, openCommands] = update(
        model,
        UpdatedLiveExampleMenuOpen({
          exampleId: 'shadcn/context-menu-demo',
          menuId: 'context-menu-demo',
          open: true,
        }),
      )
      const [_afterDropdownOpen, dropdownCommands] = update(
        afterOpen,
        UpdatedLiveExampleMenuOpen({
          exampleId: 'shadcn/dropdown-menu-basic',
          menuId: 'dropdown-menu-basic',
          open: true,
        }),
      )
      const [_afterClose, closeCommands] = update(
        afterOpen,
        UpdatedLiveExampleMenuOpen({
          exampleId: 'shadcn/context-menu-demo',
          menuId: 'context-menu-demo',
          open: false,
        }),
      )

      expect(openCommands).toHaveLength(1)
      expect(openCommands[0]?.name).toBe('LockLiveExampleContextMenuScroll')
      expect(dropdownCommands).toHaveLength(1)
      expect(dropdownCommands[0]?.name).toBe(
        'UnlockLiveExampleContextMenuScroll',
      )
      expect(closeCommands).toHaveLength(1)
      expect(closeCommands[0]?.name).toBe('UnlockLiveExampleContextMenuScroll')
    })
  })

  describe('sidebar live example state', () => {
    test('stores sidebar collapsed state by example id', () => {
      const [nextModel, commands] = update(
        model,
        UpdatedLiveExampleSidebarOpen({
          exampleId: 'shadcn/sidebar-demo',
          open: false,
        }),
      )

      expect(
        nextModel.liveExampleSidebarOpenValues['shadcn/sidebar-demo'],
      ).toBe(false)
      expect(commands).toStrictEqual([])
    })

    test('stores sidebar collapsible panel state by example and panel id', () => {
      const [nextModel, commands] = update(
        model,
        UpdatedLiveExampleSidebarPanelOpen({
          exampleId: 'shadcn/sidebar-group-collapsible',
          panelId: 'group:help',
          open: false,
        }),
      )

      expect(
        nextModel.liveExampleSidebarPanelOpenValues[
          'shadcn/sidebar-group-collapsible#group:help'
        ],
      ).toBe(false)
      expect(commands).toStrictEqual([])
    })

    test('selecting a sidebar dropdown value closes that dropdown panel', () => {
      const [nextModel, commands] = update(
        {
          ...model,
          liveExampleSidebarPanelOpenValues: {
            'shadcn/sidebar-footer#sidebar-footer-user-menu': true,
          },
        },
        SelectedLiveExampleSidebarValue({
          exampleId: 'shadcn/sidebar-footer',
          panelId: 'sidebar-footer-user-menu',
          value: 'account',
        }),
      )

      expect(
        nextModel.liveExampleSidebarSelectedValues[
          'shadcn/sidebar-footer#sidebar-footer-user-menu'
        ],
      ).toBe('account')
      expect(
        nextModel.liveExampleSidebarPanelOpenValues[
          'shadcn/sidebar-footer#sidebar-footer-user-menu'
        ],
      ).toBe(false)
      expect(commands).toStrictEqual([])
    })
  })
})
