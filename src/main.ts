import {
  Array,
  Effect,
  HashSet,
  Match as M,
  Option,
  Queue,
  Record as EffectRecord,
  Schema as S,
  Stream,
  String as EffectString,
  pipe,
} from 'effect'
import type { Runtime } from 'foldkit'
import { Command, Dom, Subscription } from 'foldkit'
import type { Document, Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { UrlRequest, load, pushUrl } from 'foldkit/navigation'
import { ts } from 'foldkit/schema'
import { evo } from 'foldkit/struct'
import { Url, toString as urlToString } from 'foldkit/url'

import {
  DocsData,
  FailedDocsData,
  type NamespaceGroup,
  type PublicComponent,
  docsData,
  findRoutedComponent,
  generatedComponentCount,
  LoadedDocsData,
  namespaceGroups,
  publicComponents,
} from './data'
import { liveExampleViewFor } from './live-examples'
import { roadmapSnapshot } from './roadmap'
import type { RoadmapBlockedGroup } from './roadmap'
import type {
  ExampleDocsArtifact,
  OriginComponentProgressReport,
  OriginComponentProgressRow,
} from './registry/schema'
import {
  AppRoute,
  ComponentDetailRoute,
  ComponentsIndexRoute,
  ComponentsNamespaceRoute,
  DocsRoute,
  HomeRoute,
  NotFoundRoute,
  RegistryLifecycleRoute,
  RegistryRoute,
  RegistrySchemaRoute,
  RoadmapRoute,
  componentDetailRouter,
  componentsIndexRouter,
  componentsNamespaceRouter,
  docsRouter,
  homeRouter,
  registryLifecycleRouter,
  registryRouter,
  registrySchemaRouter,
  roadmapRouter,
  urlToAppRoute,
} from './route'
import {
  componentSearchBadges,
  searchPublicComponents,
} from './search/component-search'
import {
  fallbackRouteMetadata,
  routeMetadataForRoute,
} from './route-inventory'

export {
  ComponentDetailRoute,
  ComponentsIndexRoute,
  ComponentsNamespaceRoute,
  DocsRoute,
  HomeRoute,
  NotFoundRoute,
  RegistryLifecycleRoute,
  RegistryRoute,
  RegistrySchemaRoute,
  RoadmapRoute,
  componentDetailRouter,
  componentsIndexRouter,
  componentsNamespaceRouter,
  docsRouter,
  homeRouter,
  registryLifecycleRouter,
  registryRouter,
  registrySchemaRouter,
  roadmapRouter,
  urlToAppRoute,
}

// MODEL

export const MobileNavigation = ts('MobileNavigation', { isOpen: S.Boolean })
type MobileNavigation = typeof MobileNavigation.Type

export const PagefindSearchResult = S.Struct({
  url: S.String,
  title: S.String,
  excerpt: S.String,
  section: S.String,
})
export type PagefindSearchResult = typeof PagefindSearchResult.Type

export const IdlePagefindSearch = ts('IdlePagefindSearch')
export const LoadingPagefindSearch = ts('LoadingPagefindSearch', {
  results: S.Array(PagefindSearchResult),
})
export const LoadedPagefindSearch = ts('LoadedPagefindSearch', {
  results: S.Array(PagefindSearchResult),
})
export const PagefindSearch = S.Union([
  IdlePagefindSearch,
  LoadingPagefindSearch,
  LoadedPagefindSearch,
])
export type PagefindSearch = typeof PagefindSearch.Type

export const Model = S.Struct({
  route: AppRoute,
  data: DocsData,
  mobileNavigation: MobileNavigation,
  copiedSnippets: S.HashSet(S.String),
  liveExampleInputValues: S.Record(S.String, S.String),
  liveExampleRadioGroupValues: S.Record(S.String, S.String),
  liveExampleCalendarSelectedDates: S.Record(S.String, S.String),
  liveExampleCommandDialogOpenValues: S.Record(S.String, S.Boolean),
  searchQuery: S.String,
  pagefindSearch: PagefindSearch,
})
export type Model = typeof Model.Type

const commandDialogDemoExampleId = 'shadcn/command-dialog'

// MESSAGE

export const CompletedNavigateInternal = m('CompletedNavigateInternal')
export const CompletedLoadExternal = m('CompletedLoadExternal')
export const CompletedScrollToAnchor = m('CompletedScrollToAnchor')
export const ClickedLink = m('ClickedLink', { request: UrlRequest })
export const ChangedUrl = m('ChangedUrl', { url: Url })
export const ClickedToggleMobileNavigation = m('ClickedToggleMobileNavigation')
export const ClickedCopySnippet = m('ClickedCopySnippet', { text: S.String })
export const SucceededCopySnippet = m('SucceededCopySnippet', {
  text: S.String,
})
export const FailedCopySnippet = m('FailedCopySnippet')
export const HidCopiedIndicator = m('HidCopiedIndicator', { text: S.String })
export const UpdatedLiveExampleInputValue = m('UpdatedLiveExampleInputValue', {
  exampleId: S.String,
  value: S.String,
})
export const UpdatedLiveExampleRadioGroupValue = m(
  'UpdatedLiveExampleRadioGroupValue',
  {
    exampleId: S.String,
    value: S.String,
  },
)
export const SelectedLiveExampleCalendarDate = m(
  'SelectedLiveExampleCalendarDate',
  {
    exampleId: S.String,
    date: S.String,
  },
)
export const ClickedOpenLiveExampleCommandDialog = m(
  'ClickedOpenLiveExampleCommandDialog',
  {
    exampleId: S.String,
  },
)
export const UpdatedLiveExampleCommandDialogOpen = m(
  'UpdatedLiveExampleCommandDialogOpen',
  {
    exampleId: S.String,
    isOpen: S.Boolean,
  },
)
export const PressedLiveExampleCommandDialogShortcut = m(
  'PressedLiveExampleCommandDialogShortcut',
)
export const UpdatedSearchQuery = m('UpdatedSearchQuery', { value: S.String })
export const ReceivedPagefindSearchResults = m('ReceivedPagefindSearchResults', {
  results: S.Array(PagefindSearchResult),
  query: S.String,
})
export const ClickedClearSearch = m('ClickedClearSearch')

export const Message = S.Union([
  CompletedNavigateInternal,
  CompletedLoadExternal,
  CompletedScrollToAnchor,
  ClickedLink,
  ChangedUrl,
  ClickedToggleMobileNavigation,
  ClickedCopySnippet,
  SucceededCopySnippet,
  FailedCopySnippet,
  HidCopiedIndicator,
  UpdatedLiveExampleInputValue,
  UpdatedLiveExampleRadioGroupValue,
  SelectedLiveExampleCalendarDate,
  ClickedOpenLiveExampleCommandDialog,
  UpdatedLiveExampleCommandDialogOpen,
  PressedLiveExampleCommandDialogShortcut,
  UpdatedSearchQuery,
  ReceivedPagefindSearchResults,
  ClickedClearSearch,
])
export type Message = typeof Message.Type

// INIT

export const init: Runtime.RoutingApplicationInit<Model, Message> = (
  url: Url,
) => [
    {
      route: urlToAppRoute(url),
      data: docsData,
      mobileNavigation: MobileNavigation({ isOpen: false }),
      copiedSnippets: HashSet.empty(),
      liveExampleInputValues: {},
      liveExampleRadioGroupValues: {},
      liveExampleCalendarSelectedDates: {},
      liveExampleCommandDialogOpenValues: {},
      searchQuery: '',
      pagefindSearch: IdlePagefindSearch(),
    },
    commandsForUrlHash(url),
  ]

// UPDATE

const NavigateInternal = Command.define(
  'NavigateInternal',
  { url: S.String },
  CompletedNavigateInternal,
)(({ url }) => pushUrl(url).pipe(Effect.as(CompletedNavigateInternal())))

const LoadExternal = Command.define(
  'LoadExternal',
  { href: S.String },
  CompletedLoadExternal,
)(({ href }) => load(href).pipe(Effect.as(CompletedLoadExternal())))

export const ScrollToAnchor = Command.define(
  'ScrollToAnchor',
  { hash: S.String },
  CompletedScrollToAnchor,
)(({ hash }) =>
  Effect.gen(function* () {
    const target = `#${CSS.escape(hash)}`
    yield* Dom.scrollIntoViewAfterPaint(target, { block: 'start' })
    yield* Dom.focus(target, { preventScroll: true, makeFocusable: true })
  }).pipe(Effect.ignore, Effect.as(CompletedScrollToAnchor())),
)

const commandsForUrlHash = (url: Url): ReadonlyArray<Command.Command<Message>> =>
  Option.match(url.hash, {
    onNone: () => [],
    onSome: hash => [ScrollToAnchor({ hash })],
  })

const MAX_PAGEFIND_RESULTS = 6
const PAGEFIND_PATH = '/pagefind/pagefind.js'

type PagefindResultData = Readonly<{
  url: string
  excerpt: string
  meta?: Readonly<{ title?: string; section?: string }>
}>

type PagefindResult = Readonly<{
  data: () => Promise<PagefindResultData>
}>

type PagefindResponse = Readonly<{
  results: ReadonlyArray<PagefindResult>
}>

type PagefindModule = Readonly<{
  search: (query: string) => Promise<PagefindResponse>
}>

const pagefindSearchResult = (
  result: PagefindSearchResult,
): PagefindSearchResult => result

const importPagefind = (): Promise<PagefindModule> =>
  import(/* @vite-ignore */ PAGEFIND_PATH)

export const SearchPagefind = Command.define(
  'SearchPagefind',
  { query: S.String },
  ReceivedPagefindSearchResults,
)(({ query }) =>
  Effect.gen(function* searchPagefindProgram() {
    const pagefind = yield* Effect.tryPromise({
      try: () => importPagefind(),
      catch: () => new Error('Pagefind is not available.'),
    })

    const response = yield* Effect.tryPromise({
      try: () => pagefind.search(query),
      catch: () => new Error('Pagefind search failed.'),
    })

    const topResults = Array.take(response.results, MAX_PAGEFIND_RESULTS)
    const loadedResults = yield* Effect.tryPromise({
      try: () => Promise.all(topResults.map(result => result.data())),
      catch: () => new Error('Pagefind result loading failed.'),
    })

    const results = Array.map(loadedResults, result =>
      pagefindSearchResult({
        url: result.url,
        title: result.meta?.title ?? 'Untitled',
        excerpt: result.excerpt,
        section: result.meta?.section ?? 'Docs',
      }),
    )

    return ReceivedPagefindSearchResults({ results, query })
  }).pipe(
    Effect.catch(() =>
      Effect.succeed(ReceivedPagefindSearchResults({ results: [], query })),
    ),
  ),
)

export const CopySnippet = Command.define(
  'CopySnippet',
  { text: S.String },
  SucceededCopySnippet,
  FailedCopySnippet,
)(({ text }) =>
  Effect.tryPromise({
    try: () => navigator.clipboard.writeText(text),
    catch: () => new Error('Failed to copy to clipboard'),
  }).pipe(
    Effect.as(SucceededCopySnippet({ text })),
    Effect.catch(() => Effect.succeed(FailedCopySnippet())),
  ),
)

const COPY_INDICATOR_DURATION = '2 seconds'

export const HideCopiedIndicator = Command.define(
  'HideCopiedIndicator',
  { text: S.String },
  HidCopiedIndicator,
)(({ text }) =>
  Effect.sleep(COPY_INDICATOR_DURATION).pipe(
    Effect.as(HidCopiedIndicator({ text })),
  ),
)

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const pagefindResultsFromState = (
  state: PagefindSearch,
): ReadonlyArray<PagefindSearchResult> =>
  M.value(state).pipe(
    M.withReturnType<ReadonlyArray<PagefindSearchResult>>(),
    M.tagsExhaustive({
      IdlePagefindSearch: () => [],
      LoadingPagefindSearch: ({ results }) => results,
      LoadedPagefindSearch: ({ results }) => results,
    }),
  )

export const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      CompletedNavigateInternal: () => [model, []],
      CompletedLoadExternal: () => [model, []],
      CompletedScrollToAnchor: () => [model, []],
      ClickedLink: ({ request }) =>
        M.value(request).pipe(
          withUpdateReturn,
          M.tagsExhaustive({
            Internal: ({ url }) => [
              model,
              [NavigateInternal({ url: urlToString(url) })],
            ],
            External: ({ href }) => [model, [LoadExternal({ href })]],
          }),
        ),
      ChangedUrl: ({ url }) => [
        evo(model, {
          route: () => urlToAppRoute(url),
          mobileNavigation: () => MobileNavigation({ isOpen: false }),
        }),
        commandsForUrlHash(url),
      ],
      ClickedToggleMobileNavigation: () => [
        evo(model, {
          mobileNavigation: ({ isOpen }) =>
            MobileNavigation({ isOpen: !isOpen }),
        }),
        [],
      ],
      ClickedCopySnippet: ({ text }) => [model, [CopySnippet({ text })]],
      SucceededCopySnippet: ({ text }) =>
        HashSet.has(model.copiedSnippets, text)
          ? [model, []]
          : [
            evo(model, {
              copiedSnippets: HashSet.add(text),
            }),
            [HideCopiedIndicator({ text })],
          ],
      FailedCopySnippet: () => [model, []],
      HidCopiedIndicator: ({ text }) => [
        evo(model, {
          copiedSnippets: HashSet.remove(text),
        }),
        [],
      ],
      UpdatedLiveExampleInputValue: ({ exampleId, value }) => [
        evo(model, {
          liveExampleInputValues: EffectRecord.set(exampleId, value),
        }),
        [],
      ],
      UpdatedLiveExampleRadioGroupValue: ({ exampleId, value }) => [
        evo(model, {
          liveExampleRadioGroupValues: EffectRecord.set(exampleId, value),
        }),
        [],
      ],
      SelectedLiveExampleCalendarDate: ({ exampleId, date }) => [
        evo(model, {
          liveExampleCalendarSelectedDates: EffectRecord.set(exampleId, date),
        }),
        [],
      ],
      ClickedOpenLiveExampleCommandDialog: ({ exampleId }) => [
        evo(model, {
          liveExampleCommandDialogOpenValues: EffectRecord.set(exampleId, true),
        }),
        [],
      ],
      UpdatedLiveExampleCommandDialogOpen: ({ exampleId, isOpen }) => [
        evo(model, {
          liveExampleCommandDialogOpenValues: EffectRecord.set(
            exampleId,
            isOpen,
          ),
        }),
        [],
      ],
      PressedLiveExampleCommandDialogShortcut: () => {
        const isOpen = pipe(
          EffectRecord.get(
            model.liveExampleCommandDialogOpenValues,
            commandDialogDemoExampleId,
          ),
          Option.getOrElse(() => false),
        )

        return [
          evo(model, {
            liveExampleCommandDialogOpenValues: EffectRecord.set(
              commandDialogDemoExampleId,
              !isOpen,
            ),
          }),
          [],
        ]
      },
      UpdatedSearchQuery: ({ value }) => {
        if (value === model.searchQuery) {
          return [model, []]
        }

        if (EffectString.isEmpty(EffectString.trim(value))) {
          return [
            evo(model, {
              searchQuery: () => value,
              pagefindSearch: () => IdlePagefindSearch(),
            }),
            [],
          ]
        }

        return [
          evo(model, {
            searchQuery: () => value,
            pagefindSearch: () =>
              LoadingPagefindSearch({
                results: pagefindResultsFromState(model.pagefindSearch),
              }),
          }),
          [SearchPagefind({ query: value })],
        ]
      },
      ReceivedPagefindSearchResults: ({ results, query }) =>
        query === model.searchQuery
          ? [
            evo(model, {
              pagefindSearch: () => LoadedPagefindSearch({ results }),
            }),
            [],
          ]
          : [model, []],
      ClickedClearSearch: () => [
        evo(model, {
          searchQuery: () => '',
          pagefindSearch: () => IdlePagefindSearch(),
        }),
        [],
      ],
    }),
  )

// SUBSCRIPTION

const isCommandComponentRoute = (route: AppRoute): boolean =>
  route._tag === 'ComponentDetail' &&
  route.namespace === 'shadcn' &&
  route.slug === 'command'

const isCommandDialogShortcut = (event: KeyboardEvent): boolean =>
  (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j'

export const subscriptions = Subscription.make<Model, Message>()(entry => ({
  commandDialogShortcut: entry(
    { isCommandComponentRoute: S.Boolean },
    {
      modelToDependencies: model => ({
        isCommandComponentRoute: isCommandComponentRoute(model.route),
      }),
      dependenciesToStream: ({ isCommandComponentRoute }) =>
        Stream.when(
          Stream.callback<Message>(queue =>
            Effect.acquireRelease(
              Effect.sync(() => {
                const handler = (event: KeyboardEvent) => {
                  if (isCommandDialogShortcut(event)) {
                    event.preventDefault()
                    Queue.offerUnsafe(
                      queue,
                      PressedLiveExampleCommandDialogShortcut(),
                    )
                  }
                }
                document.addEventListener('keydown', handler)
                return handler
              }),
              handler =>
                Effect.sync(() =>
                  document.removeEventListener('keydown', handler),
                ),
            ).pipe(Effect.flatMap(() => Effect.never)),
          ),
          Effect.sync(() => isCommandComponentRoute),
        ),
    },
  ),
}))

// VIEW

type PrimaryNavSection =
  | 'home'
  | 'docs'
  | 'components'
  | 'registry'
  | 'roadmap'
  | 'not-found'

const navLinks: ReadonlyArray<
  Readonly<{
    label: string
    href: string
    section: PrimaryNavSection
  }>
> = [
    { label: 'Home', href: homeRouter({}), section: 'home' },
    { label: 'Docs', href: docsRouter({}), section: 'docs' },
    {
      label: 'Components',
      href: componentsIndexRouter({}),
      section: 'components',
    },
    { label: 'Registry', href: registryRouter({}), section: 'registry' },
    { label: 'Roadmap', href: roadmapRouter({}), section: 'roadmap' },
  ]

const primaryNavSection = (route: AppRoute): PrimaryNavSection =>
  M.value(route).pipe(
    M.withReturnType<PrimaryNavSection>(),
    M.tagsExhaustive({
      Home: () => 'home',
      Docs: () => 'docs',
      ComponentsIndex: () => 'components',
      ComponentsNamespace: () => 'components',
      ComponentDetail: () => 'components',
      Registry: () => 'registry',
      RegistrySchema: () => 'registry',
      RegistryLifecycle: () => 'registry',
      Roadmap: () => 'roadmap',
      NotFound: () => 'not-found',
    }),
  )

const statusText = (value: string): string => value.replaceAll('-', ' ')

const statusBadgeView = (value: string): Html => {
  const h = html<Message>()

  return h.span([h.Class(`status-badge status-${value}`)], [
    statusText(value),
  ])
}

const navLinkView = (
  label: string,
  href: string,
  isActive: boolean,
): Html => {
  const h = html<Message>()

  return h.a(
    [
      h.Class(isActive ? 'docs-nav-link active' : 'docs-nav-link'),
      h.Href(href),
      ...(isActive ? [h.AriaCurrent('page')] : []),
    ],
    [label],
  )
}

const headerView = (model: Model): Html => {
  const h = html<Message>()
  const activeSection = primaryNavSection(model.route)

  return h.header(
    [h.Class('site-header'), h.DataAttribute('pagefind-ignore', '')],
    [
      h.a([h.Class('brand-link'), h.Href(homeRouter({}))], [
        h.span([h.Class('brand-mark'), h.AriaHidden(true)], ['F']),
        h.span([h.Class('brand-wordmark')], ['Foldkit']),
        h.span([h.Class('brand-cn')], ['CN']),
      ]),
      h.nav([h.Class('desktop-nav'), h.AriaLabel('Primary')], [
        ...navLinks.map(link =>
          navLinkView(
            link.label,
            link.href,
            link.section === activeSection,
          ),
        ),
      ]),
      h.button(
        [
          h.Type('button'),
          h.Class('mobile-nav-toggle'),
          h.AriaLabel('Toggle navigation'),
          h.AriaExpanded(model.mobileNavigation.isOpen),
          h.OnClick(ClickedToggleMobileNavigation()),
        ],
        ['Menu'],
      ),
    ],
  )
}

const mobileNavigationView = (model: Model): Html => {
  const h = html<Message>()
  const activeSection = primaryNavSection(model.route)

  return h.keyed('nav')(
    model.mobileNavigation.isOpen ? 'mobile-open' : 'mobile-closed',
    [
      h.Class(
        model.mobileNavigation.isOpen
          ? 'mobile-nav mobile-nav-open'
          : 'mobile-nav',
      ),
      h.AriaLabel('Mobile'),
      h.DataAttribute('pagefind-ignore', ''),
    ],
    navLinks.map(link =>
      navLinkView(link.label, link.href, link.section === activeSection),
    ),
  )
}

const componentSlug = (component: PublicComponent): string =>
  component.entry.item.id.split('/')[1] ?? ''

const componentHref = (component: PublicComponent): string =>
  componentDetailRouter({
    namespace: component.entry.item.namespace,
    slug: componentSlug(component),
  })

const isComponentsIndexRoute = (route: AppRoute): boolean =>
  M.value(route).pipe(
    M.withReturnType<boolean>(),
    M.tagsExhaustive({
      Home: () => false,
      Docs: () => false,
      ComponentsIndex: () => true,
      ComponentsNamespace: () => false,
      ComponentDetail: () => false,
      Registry: () => false,
      RegistrySchema: () => false,
      RegistryLifecycle: () => false,
      Roadmap: () => false,
      NotFound: () => false,
    }),
  )

const isComponentNamespaceActive = (
  route: AppRoute,
  namespace: string,
): boolean =>
  M.value(route).pipe(
    M.withReturnType<boolean>(),
    M.tagsExhaustive({
      Home: () => false,
      Docs: () => false,
      ComponentsIndex: () => false,
      ComponentsNamespace: route => route.namespace === namespace,
      ComponentDetail: route => route.namespace === namespace,
      Registry: () => false,
      RegistrySchema: () => false,
      RegistryLifecycle: () => false,
      Roadmap: () => false,
      NotFound: () => false,
    }),
  )

const isComponentLinkActive = (
  route: AppRoute,
  component: PublicComponent,
): boolean =>
  M.value(route).pipe(
    M.withReturnType<boolean>(),
    M.tagsExhaustive({
      Home: () => false,
      Docs: () => false,
      ComponentsIndex: () => false,
      ComponentsNamespace: () => false,
      ComponentDetail: ({ namespace, slug }) =>
        component.entry.item.id === `${namespace}/${slug}`,
      Registry: () => false,
      RegistrySchema: () => false,
      RegistryLifecycle: () => false,
      Roadmap: () => false,
      NotFound: () => false,
    }),
  )

const searchResultView = (component: PublicComponent): Html => {
  const h = html<Message>()

  return h.li([h.Class('search-result')], [
    h.a([h.Href(componentHref(component))], [
      h.span([h.Class('search-result-title')], [component.entry.item.name]),
      h.code([], [component.entry.item.id]),
    ]),
    h.div(
      [h.Class('badge-row')],
      componentSearchBadges(component).map(statusBadgeView),
    ),
  ])
}

const htmlTagPattern = /<[^>]+>/gu

const pagefindExcerptText = (excerpt: string): string =>
  excerpt.replaceAll(htmlTagPattern, '')

const pagefindSearchResultView = (result: PagefindSearchResult): Html => {
  const h = html<Message>()

  return h.li([h.Class('search-result')], [
    h.a([h.Href(result.url)], [
      h.span([h.Class('search-result-title')], [result.title]),
      h.code([], [result.url]),
    ]),
    h.p([h.Class('search-excerpt')], [pagefindExcerptText(result.excerpt)]),
  ])
}

const searchResultsGroupView = (
  label: string,
  results: Html,
): Html => {
  const h = html<Message>()

  return h.section([h.Class('search-results-group')], [
    h.h3([h.Class('search-results-heading')], [label]),
    results,
  ])
}

const componentSearchResultsView = (
  results: ReadonlyArray<PublicComponent>,
): Html => {
  const h = html<Message>()

  return Array.match(results, {
    onEmpty: () => h.empty,
    onNonEmpty: matches =>
      searchResultsGroupView(
        'Components',
        h.ul([h.Class('search-results'), h.AriaLabel('Component search results')], [
          ...matches.map(searchResultView),
        ]),
      ),
  })
}

const pagefindSearchResultsView = (state: PagefindSearch): Html => {
  const h = html<Message>()

  return M.value(state).pipe(
    M.withReturnType<Html>(),
    M.tagsExhaustive({
      IdlePagefindSearch: () => h.empty,
      LoadingPagefindSearch: ({ results }) =>
        Array.match(results, {
          onEmpty: () =>
            h.p([h.Class('search-empty'), h.Role('status')], [
              'Searching documentation...',
            ]),
          onNonEmpty: matches =>
            searchResultsGroupView(
              'Documentation',
              h.ul(
                [
                  h.Class('search-results'),
                  h.AriaLabel('Full-text search results'),
                ],
                [...matches.map(pagefindSearchResultView)],
              ),
            ),
        }),
      LoadedPagefindSearch: ({ results }) =>
        Array.match(results, {
          onEmpty: () => h.empty,
          onNonEmpty: matches =>
            searchResultsGroupView(
              'Documentation',
              h.ul(
                [
                  h.Class('search-results'),
                  h.AriaLabel('Full-text search results'),
                ],
                [...matches.map(pagefindSearchResultView)],
              ),
            ),
        }),
    }),
  )
}

const searchResultsView = (
  query: string,
  componentResults: ReadonlyArray<PublicComponent>,
  pagefindSearch: PagefindSearch,
): Html => {
  const h = html<Message>()
  const fullTextResults = pagefindResultsFromState(pagefindSearch)
  const isLoading = pagefindSearch._tag === 'LoadingPagefindSearch'
  const hasNoComponentResults = Array.match(componentResults, {
    onEmpty: () => true,
    onNonEmpty: () => false,
  })
  const hasNoFullTextResults = Array.match(fullTextResults, {
    onEmpty: () => true,
    onNonEmpty: () => false,
  })

  if (EffectString.isEmpty(EffectString.trim(query))) {
    return h.empty
  }

  if (
    hasNoComponentResults &&
    hasNoFullTextResults &&
    !isLoading
  ) {
    return h.p([h.Class('search-empty'), h.Role('status')], [
      'No public docs match that search.',
    ])
  }

  return h.div([h.Class('search-results-stack')], [
    componentSearchResultsView(componentResults),
    pagefindSearchResultsView(pagefindSearch),
  ])
}

const componentSearchView = (model: Model): Html => {
  const h = html<Message>()
  const results = searchPublicComponents(
    publicComponents(model.data),
    model.searchQuery,
  )
  const isClearDisabled = EffectString.isEmpty(
    EffectString.trim(model.searchQuery),
  )

  return h.div(
    [
      h.Class('component-search'),
      h.Role('search'),
      h.AriaLabel('Documentation search'),
    ],
    [
      h.label([h.For('component-search-input'), h.Class('search-label')], [
        'Search documentation',
      ]),
      h.div([h.Class('search-control')], [
        h.input([
          h.Id('component-search-input'),
          h.Type('search'),
          h.Placeholder('Search components and docs'),
          h.Value(model.searchQuery),
          h.OnInput(value => UpdatedSearchQuery({ value })),
        ]),
        h.button(
          [
            h.Type('button'),
            h.Class('search-clear-button'),
            h.AriaLabel('Clear component search'),
            h.Disabled(isClearDisabled),
            h.OnClick(ClickedClearSearch()),
          ],
          ['Clear'],
        ),
      ]),
      searchResultsView(model.searchQuery, results, model.pagefindSearch),
    ],
  )
}

const sidebarView = (
  model: Model,
  groups: ReadonlyArray<NamespaceGroup>,
): Html => {
  const h = html<Message>()

  return h.aside(
    [h.Class('docs-sidebar'), h.DataAttribute('pagefind-ignore', '')],
    [
      componentSearchView(model),
      h.nav([h.AriaLabel('Component navigation')], [
        h.a(
          [
            h.Class(
              isComponentsIndexRoute(model.route)
                ? 'sidebar-root-link active'
                : 'sidebar-root-link',
            ),
            h.Href(componentsIndexRouter({})),
            ...(isComponentsIndexRoute(model.route)
              ? [h.AriaCurrent('page')]
              : []),
          ],
          ['All components'],
        ),
        ...groups.map(group =>
          h.section([h.Class('sidebar-group')], [
            h.h2([h.Class('sidebar-heading')], [
              h.a(
                [
                  h.Href(
                    componentsNamespaceRouter({ namespace: group.namespace }),
                  ),
                  ...(isComponentNamespaceActive(model.route, group.namespace)
                    ? [h.Class('active')]
                    : []),
                ],
                [group.label],
              ),
            ]),
            h.ul(
              [h.Class('sidebar-list')],
              group.components.map(component =>
                h.keyed('li')(
                  component.entry.item.id,
                  [],
                  [
                    h.a(
                      [
                        h.Href(componentHref(component)),
                        h.AriaLabel(
                          `${component.entry.item.name} (${component.entry.item.id})`,
                        ),
                        ...(isComponentLinkActive(model.route, component)
                          ? [h.Class('active'), h.AriaCurrent('page')]
                          : []),
                      ],
                      [
                        h.span([], [component.entry.item.name]),
                        component.entry.item.lifecycle.availability === 'preview'
                          ? statusBadgeView('preview')
                          : h.empty,
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ]),
        ),
      ]),
    ],
  )
}

const exampleAnchorId = (example: ExampleDocsArtifact): string =>
  example.id.replaceAll(/[^a-z0-9_-]+/giu, '-')

const tableOfContentsComponent = (
  model: Model,
): Option.Option<PublicComponent> =>
  M.value(model.route).pipe(
    M.withReturnType<Option.Option<PublicComponent>>(),
    M.tagsExhaustive({
      Home: () => Option.none(),
      Docs: () => Option.none(),
      ComponentsIndex: () => Option.none(),
      ComponentsNamespace: () => Option.none(),
      ComponentDetail: ({ namespace, slug }) =>
        findRoutedComponent(model.data, namespace, slug),
      Registry: () => Option.none(),
      RegistrySchema: () => Option.none(),
      RegistryLifecycle: () => Option.none(),
      Roadmap: () => Option.none(),
      NotFound: () => Option.none(),
    }),
  )

const tableOfContentsExampleLinksView = (
  maybeComponent: Option.Option<PublicComponent>,
): Html => {
  const h = html<Message>()

  return Option.match(maybeComponent, {
    onNone: () => h.empty,
    onSome: component =>
      Option.match(component.maybeDocsArtifact, {
        onNone: () => h.empty,
        onSome: artifact =>
          Array.isReadonlyArrayEmpty(artifact.examples)
            ? h.empty
            : h.ul(
              [h.Class('toc-example-list')],
              artifact.examples.map(example =>
                h.li([], [
                  h.a([h.Href(`#${exampleAnchorId(example)}`)], [
                    example.title,
                  ]),
                ]),
              ),
            ),
      }),
  })
}

const tableOfContentsView = (model: Model): Html => {
  const h = html<Message>()
  const maybeComponent = tableOfContentsComponent(model)

  return h.aside(
    [
      h.Class('docs-toc'),
      h.AriaLabel('On this page'),
      h.DataAttribute('pagefind-ignore', ''),
    ],
    [
      h.p([h.Class('toc-heading')], ['On this page']),
      h.a([h.Href('#overview')], ['Overview']),
      h.a([h.Href('#installation')], ['Installation']),
      h.a([h.Href('#usage')], ['Usage']),
      h.div([h.Class('toc-group')], [
        h.a([h.Href('#examples')], ['Examples']),
        tableOfContentsExampleLinksView(maybeComponent),
      ]),
      h.a([h.Href('#api')], ['API']),
      h.a([h.Href('#accessibility')], ['Accessibility']),
      h.a([h.Href('#quality')], ['Quality']),
      h.a([h.Href('#source')], ['Source']),
      h.a([h.Href('#foldkit-differences')], ['Foldkit Differences']),
    ],
  )
}

const shellView = (model: Model, content: Html): Html => {
  const h = html<Message>()
  const groups = namespaceGroups(model.data)

  return h.div([h.Class('app-shell')], [
    headerView(model),
    mobileNavigationView(model),
    h.div([h.Class('docs-layout')], [
      sidebarView(model, groups),
      h.main(
        [
          h.Id('main-content'),
          h.Class('docs-main'),
          h.DataAttribute('pagefind-body', ''),
        ],
        [
          h.keyed('div')(
            model.route._tag,
            [h.Class('route-frame')],
            [content],
          ),
        ],
      ),
      tableOfContentsView(model),
    ]),
  ])
}

const dataNoticeView = (data: DocsData): Html => {
  const h = html<Message>()

  return M.value(data).pipe(
    M.withReturnType<Html>(),
    M.tagsExhaustive({
      LoadedDocsData: () =>
        h.p([h.Class('eyebrow')], [
          `${generatedComponentCount(data)} public component docs artifacts generated`,
        ]),
      FailedDocsData: ({ message }) =>
        h.p([h.Class('data-error'), h.Role('status')], [
          `Generated registry artifacts could not be loaded: ${message}`,
        ]),
    }),
  )
}

const pageHeaderView = (
  eyebrow: string,
  title: string,
  summary: string,
): Html => {
  const h = html<Message>()

  return h.header([h.Class('page-header')], [
    h.p(
      [h.Class('eyebrow'), h.DataAttribute('pagefind-meta', 'section')],
      [eyebrow],
    ),
    h.h1([h.Id('overview')], [title]),
    h.p([h.Class('lede')], [summary]),
  ])
}

const homePageView = (model: Model): Html => {
  const h = html<Message>()

  return h.article([], [
    pageHeaderView(
      'Registry documentation',
      'Foldkit CN',
      'A Foldkit-native front door for installable component registry artifacts.',
    ),
    dataNoticeView(model.data),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.h2([], ['What is here now']),
      h.p([], [
        'The shell reads generated registry outputs, separates public components by namespace, and gives Registry and Roadmap pages stable URLs for the next documentation passes.',
      ]),
      h.div([h.Class('action-row')], [
        h.a([h.Class('action-link'), h.Href(componentsIndexRouter({}))], [
          'Browse components',
        ]),
        h.a([h.Class('action-link'), h.Href(registryRouter({}))], [
          'Inspect registry',
        ]),
      ]),
    ]),
  ])
}

const docsPageView = (): Html => {
  const h = html<Message>()

  return h.article([], [
    pageHeaderView(
      'Docs',
      'Documentation overview',
      'The docs site starts with generated registry data, then layers authored guidance onto each artifact.',
    ),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.h2([], ['Start points']),
      h.ul([h.Class('link-list')], [
        h.li([], [
          h.a([h.Href(componentsIndexRouter({}))], ['Components']),
          ' lists installable and preview component rows.',
        ]),
        h.li([], [
          h.a([h.Href(registrySchemaRouter({}))], ['Registry Schema']),
          ' names the generated artifact boundary.',
        ]),
        h.li([], [
          h.a([h.Href(registryLifecycleRouter({}))], ['Registry Lifecycle']),
          ' explains availability, parity, drift, and docs readiness.',
        ]),
      ]),
    ]),
  ])
}

const componentSummaryView = (component: PublicComponent): Html => {
  const h = html<Message>()

  return h.keyed('article')(
    component.entry.item.id,
    [h.Class('component-row')],
    [
      h.div([], [
        h.h3([], [
          h.a(
            [
              h.Href(
                componentDetailRouter({
                  namespace: component.entry.item.namespace,
                  slug: component.entry.item.id.split('/')[1] ?? '',
                }),
              ),
            ],
            [component.entry.item.name],
          ),
        ]),
        h.p([], [component.entry.item.description]),
      ]),
      h.dl([h.Class('meta-list')], [
        h.div([], [
          h.dt([], ['Availability']),
          h.dd([], [component.entry.item.lifecycle.availability]),
        ]),
        h.div([], [
          h.dt([], ['Docs']),
          h.dd([], [component.entry.item.lifecycle.docsStatus]),
        ]),
      ]),
    ],
  )
}

const componentsIndexPageView = (model: Model): Html => {
  const h = html<Message>()
  const groups = namespaceGroups(model.data)

  return h.article([], [
    pageHeaderView(
      'Components',
      'Components',
      'Installable and preview components from the generated registry and docs indexes.',
    ),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.h2([], ['Namespaces']),
      ...groups.map(group =>
        h.section([h.Class('namespace-section')], [
          h.h3([], [
            h.a(
              [
                h.Href(
                  componentsNamespaceRouter({ namespace: group.namespace }),
                ),
              ],
              [group.label],
            ),
          ]),
          ...group.components.map(componentSummaryView),
        ]),
      ),
    ]),
  ])
}

const componentsNamespacePageView = (
  model: Model,
  namespace: string,
): Html => {
  const h = html<Message>()
  const maybeGroup = pipe(
    namespaceGroups(model.data),
    Array.findFirst(group => group.namespace === namespace),
  )

  return Option.match(maybeGroup, {
    onNone: () =>
      notFoundPageView(
        NotFoundRoute({ path: componentsNamespaceRouter({ namespace }) }),
      ),
    onSome: group =>
      h.article([], [
        pageHeaderView(
          'Components',
          `${group.label} components`,
          'Public component rows for this registry namespace.',
        ),
        h.section([h.Id('status'), h.Class('content-section')], [
          h.h2([], ['Generated entries']),
          ...group.components.map(componentSummaryView),
        ]),
      ]),
  })
}

const installCommandFor = (itemId: string): string =>
  `bunx foldkitcn add ${itemId}`

const physicalInstallPathFor = (itemId: string): string =>
  `src/components/foldkitcn/${itemId}.ts`

const aliasImportPathFor = (itemId: string): string =>
  `@/components/foldkitcn/${itemId}`

const importSnippetFor = (component: PublicComponent): string =>
  `import { ${component.entry.item.name} } from '${aliasImportPathFor(
    component.entry.item.id,
  )}'`

const snippetBlockView = (
  text: string,
  ariaLabel: string,
  copiedSnippets: HashSet.HashSet<string>,
): Html => {
  const h = html<Message>()
  const isCopied = HashSet.has(copiedSnippets, text)

  return h.div([h.Class('snippet-block')], [
    h.pre(
      [h.Class('code-block'), h.DataAttribute('pagefind-ignore', '')],
      [h.code([], [text])],
    ),
    h.button(
      [
        h.Type('button'),
        h.Class('copy-button'),
        h.AriaLabel(ariaLabel),
        h.OnClick(ClickedCopySnippet({ text })),
      ],
      [h.span([h.AriaHidden(true)], ['Copy'])],
    ),
    h.span(
      [h.Role('status'), h.AriaLive('polite'), h.Class('sr-only')],
      [isCopied ? 'Copied to clipboard' : ''],
    ),
  ])
}

const dependenciesPanelView = (component: PublicComponent): Html => {
  const h = html<Message>()

  return Option.match(component.maybeDocsArtifact, {
    onNone: () => h.empty,
    onSome: artifact => {
      const registryDependencies =
        artifact.dependencies?.registry ?? component.entry.item.dependencies.registry

      return Array.match(registryDependencies, {
        onEmpty: () => h.empty,
        onNonEmpty: dependencies =>
          h.aside([h.Class('relationship-panel'), h.AriaLabel('Composes')], [
            h.h2([], ['Composes']),
            h.ul(
              [h.Class('compact-list')],
              dependencies.map(dependency =>
                h.li([], [h.code([], [dependency.target])]),
              ),
            ),
          ]),
      })
    },
  })
}

const installationSectionView = (
  component: PublicComponent,
  copiedSnippets: HashSet.HashSet<string>,
): Html => {
  const h = html<Message>()
  const availability = component.entry.item.lifecycle.availability

  return h.section([h.Id('installation'), h.Class('content-section')], [
    h.h2([], ['Installation']),
    M.value(availability).pipe(
      M.withReturnType<Html>(),
      M.when('installable', () =>
        h.div([], [
          h.p([], [
            'Install the component into your app, then import it from the generated local namespace.',
          ]),
          snippetBlockView(
            installCommandFor(component.entry.item.id),
            `Copy ${component.entry.item.name} install command`,
            copiedSnippets,
          ),
        ]),
      ),
      M.when('preview', () =>
        h.p([], [
          'This component is in preview. The public install command is not enabled for this row yet.',
        ]),
      ),
      M.when('private', () =>
        h.p([], [
          'This component is private. It is hidden from public navigation and is not installable from the public docs site.',
        ]),
      ),
      M.orElse(() =>
        h.p([], [
          'This component is tracked as roadmap work. Install instructions will appear after the registry marks it installable.',
        ]),
      ),
    ),
  ])
}

const usageSectionView = (
  component: PublicComponent,
  copiedSnippets: HashSet.HashSet<string>,
): Html => {
  const h = html<Message>()

  return h.section([h.Id('usage'), h.Class('content-section')], [
    h.h2([], ['Usage']),
    Option.match(component.maybeDocsArtifact, {
      onNone: () =>
        h.p([], ['Usage guidance is waiting for the generated docs artifact.']),
      onSome: artifact =>
        h.div([], [
          h.p([], [
            'Import the helper from the generated local namespace and call it from a Foldkit view after binding the Html factory.',
          ]),
          snippetBlockView(
            importSnippetFor(component),
            `Copy ${component.entry.item.name} import snippet`,
            copiedSnippets,
          ),
          h.dl([h.Class('meta-list wide')], [
            h.div([], [
              h.dt([], ['Default physical path']),
              h.dd([], [physicalInstallPathFor(artifact.itemId)]),
            ]),
            h.div([], [
              h.dt([], ['Default alias']),
              h.dd([], [aliasImportPathFor(artifact.itemId)]),
            ]),
          ]),
        ]),
    }),
  ])
}

const examplesSectionView = (
  component: PublicComponent,
  copiedSnippets: HashSet.HashSet<string>,
  liveExampleInputValues: Readonly<Record<string, string>>,
  liveExampleRadioGroupValues: Readonly<Record<string, string>>,
  liveExampleCalendarSelectedDates: Readonly<Record<string, string>>,
  liveExampleCommandDialogOpenValues: Readonly<Record<string, boolean>>,
): Html => {
  const h = html<Message>()
  const liveExampleContext = {
    inputValueFor: (
      example: ExampleDocsArtifact,
      defaultValue: string,
    ): string =>
      pipe(
        EffectRecord.get(liveExampleInputValues, example.id),
        Option.getOrElse(() => defaultValue),
      ),
    inputIdPrefixFor: (example: ExampleDocsArtifact): string =>
      `${example.id.replaceAll(/[^a-z0-9_-]+/giu, '-')}-`,
    onInputValueChange: (
      example: ExampleDocsArtifact,
      change: Readonly<{ value: string }>,
    ): Message =>
      UpdatedLiveExampleInputValue({
        exampleId: example.id,
        value: change.value,
      }),
    radioGroupValueFor: (
      example: ExampleDocsArtifact,
      defaultValue: string,
    ): string =>
      pipe(
        EffectRecord.get(liveExampleRadioGroupValues, example.id),
        Option.getOrElse(() => defaultValue),
      ),
    radioGroupIdPrefixFor: (example: ExampleDocsArtifact): string =>
      `${example.id.replaceAll(/[^a-z0-9_-]+/giu, '-')}-`,
    onRadioGroupValueChange: (
      example: ExampleDocsArtifact,
      change: Readonly<{ value: string }>,
    ): Message =>
      UpdatedLiveExampleRadioGroupValue({
        exampleId: example.id,
        value: change.value,
      }),
    calendarSelectedDateFor: (
      example: ExampleDocsArtifact,
      defaultValue: string | undefined,
    ): string | undefined =>
      pipe(
        EffectRecord.get(liveExampleCalendarSelectedDates, example.id),
        Option.getOrElse(() => defaultValue),
      ),
    onCalendarSelectDate: (
      example: ExampleDocsArtifact,
      change: Readonly<{ date: string }>,
    ): Message =>
      SelectedLiveExampleCalendarDate({
        exampleId: example.id,
        date: change.date,
      }),
    commandDialogIsOpenFor: (example: ExampleDocsArtifact): boolean =>
      pipe(
        EffectRecord.get(liveExampleCommandDialogOpenValues, example.id),
        Option.getOrElse(() => false),
      ),
    commandDialogIdFor: (example: ExampleDocsArtifact): string =>
      `${example.id.replaceAll(/[^a-z0-9_-]+/giu, '-')}-dialog`,
    onCommandDialogOpen: (example: ExampleDocsArtifact): Message =>
      ClickedOpenLiveExampleCommandDialog({ exampleId: example.id }),
    onCommandDialogOpenChange: (
      example: ExampleDocsArtifact,
      change: Readonly<{ open: boolean }>,
    ): Message =>
      UpdatedLiveExampleCommandDialogOpen({
        exampleId: example.id,
        isOpen: change.open,
      }),
  }
  const liveExamplePreviewView = (example: ExampleDocsArtifact): Html =>
    Option.match(liveExampleViewFor(example, liveExampleContext), {
      onNone: () => h.empty,
      onSome: exampleView =>
        h.div(
          [
            h.Class('live-example-preview'),
            h.AriaLabel(`${example.title} live preview`),
          ],
          [exampleView],
        ),
    })

  return h.section([h.Id('examples'), h.Class('content-section')], [
    h.h2([], ['Examples']),
    Option.match(component.maybeDocsArtifact, {
      onNone: () => h.p([], ['Example metadata is not loaded.']),
      onSome: artifact =>
        h.div(
          [h.Class('example-list')],
          artifact.examples.map(example =>
            h.keyed('article')(
              example.id,
              [h.Id(exampleAnchorId(example)), h.Class('example-card')],
              [
                h.div([h.Class('example-card-header')], [
                  h.div([], [
                    h.h3([], [example.title]),
                    h.p([], [example.description]),
                  ]),
                  statusBadgeView(example.previewStatus),
                ]),
                liveExamplePreviewView(example),
                snippetBlockView(
                  example.snippet,
                  `Copy ${example.title} example snippet`,
                  copiedSnippets,
                ),
              ],
            ),
          ),
        ),
    }),
  ])
}

const apiSectionView = (): Html => {
  const h = html<Message>()

  return h.section([h.Id('api'), h.Class('content-section')], [
    h.h2([], ['API']),
    h.p([], [
      'API extraction is pending. The component is currently documented through generated source paths, examples, and registry metadata.',
    ]),
  ])
}

const accessibilitySectionView = (): Html => {
  const h = html<Message>()

  return h.section([h.Id('accessibility'), h.Class('content-section')], [
    h.h2([], ['Accessibility']),
    h.p([], [
      'Use Button for actions, provide clear visible text or an accessible label for icon-only buttons, and keep navigation or side effects in Foldkit messages and commands.',
    ]),
  ])
}

const qualitySectionView = (component: PublicComponent): Html => {
  const h = html<Message>()

  return h.section([h.Id('quality'), h.Class('content-section')], [
    h.h2([], ['Quality']),
    Option.match(component.maybeDocsArtifact, {
      onNone: () =>
        h.p([], ['Quality metadata is waiting for the generated docs artifact.']),
      onSome: artifact =>
        h.div([], [
          h.dl([h.Class('meta-list wide')], [
            h.div([], [
              h.dt([], ['Availability']),
              h.dd([], [statusText(artifact.quality.availability)]),
            ]),
            h.div([], [
              h.dt([], ['Implementation']),
              h.dd([], [statusText(artifact.quality.implementationStatus)]),
            ]),
            h.div([], [
              h.dt([], ['Parity']),
              h.dd([], [statusText(artifact.quality.parityStatus)]),
            ]),
            h.div([], [
              h.dt([], ['Drift']),
              h.dd([], [statusText(artifact.quality.driftStatus)]),
            ]),
            h.div([], [
              h.dt([], ['Origin']),
              h.dd([], [
                Option.match(
                  Array.head(
                    artifact.originProvenance,
                  ),
                  {
                    onNone: () => 'local registry source',
                    onSome: origin => origin.originName,
                  },
                ),
              ]),
            ]),
          ]),
          h.h3([], ['Accepted deviations']),
          h.ul(
            [h.Class('compact-list')],
            artifact.quality.deviations.map(deviation =>
              h.li([], [
                h.strong([], [statusText(deviation.status)]),
                ` - ${deviation.summary}`,
              ]),
            ),
          ),
        ]),
    }),
  ])
}

const sourceSectionView = (component: PublicComponent): Html => {
  const h = html<Message>()

  return h.section([h.Id('source'), h.Class('content-section')], [
    h.h2([], ['Source']),
    Option.match(component.maybeDocsArtifact, {
      onNone: () =>
        h.p([], [`Generated artifact: ${component.docsRoute.docsArtifactPath}`]),
      onSome: artifact =>
        h.div([], [
          h.dl([h.Class('meta-list wide')], [
            h.div([], [
              h.dt([], ['Docs artifact']),
              h.dd([], [component.docsRoute.docsArtifactPath]),
            ]),
            h.div([], [
              h.dt([], ['Sidecar']),
              h.dd(
                [],
                [
                  Option.match(artifact.markdownPath, {
                    onNone: () => 'missing',
                    onSome: path => path,
                  }),
                ],
              ),
            ]),
            h.div([], [
              h.dt([], ['Source root']),
              h.dd([], [artifact.sourceRoot]),
            ]),
          ]),
          h.ul(
            [h.Class('compact-list')],
            artifact.installableSourcePaths.map(sourcePath =>
              h.li([], [h.code([], [sourcePath])]),
            ),
          ),
        ]),
    }),
  ])
}

const foldkitDifferencesSectionView = (component: PublicComponent): Html => {
  const h = html<Message>()

  return h.section(
    [h.Id('foldkit-differences'), h.Class('content-section')],
    [
      h.h2([], ['Foldkit Differences']),
      h.p([], [
        'This item replaces the origin React, CVA, and icon-package assumptions with Foldkit Html, local Base UI behavior, Effect Schema literals, and local inline SVG examples.',
      ]),
      Option.match(component.maybeDocsArtifact, {
        onNone: () => h.empty,
        onSome: artifact => {
          const developmentDependencies =
            artifact.dependencies.development

          return h.ul(
            [h.Class('compact-list')],
            developmentDependencies.map(dependency =>
              h.li([], [
                h.code([], [dependency.specifier]),
                `: ${dependency.reason}`,
              ]),
            ),
          )
        },
      }),
    ],
  )
}

const componentDetailPageView = (
  model: Model,
  namespace: string,
  slug: string,
): Html => {
  const h = html<Message>()
  const maybeComponent = findRoutedComponent(model.data, namespace, slug)

  return Option.match(maybeComponent, {
    onNone: () =>
      notFoundPageView(
        NotFoundRoute({ path: componentDetailRouter({ namespace, slug }) }),
      ),
    onSome: component =>
      h.article([], [
        pageHeaderView(
          component.entry.item.namespace,
          component.entry.item.name,
          component.entry.item.description,
        ),
        h.section([h.Id('overview'), h.Class('content-section')], [
          // h.h2([], ['Overview']),
          // h.p([], [component.entry.item.description]),
          dependenciesPanelView(component),
        ]),
        installationSectionView(component, model.copiedSnippets),
        usageSectionView(component, model.copiedSnippets),
        examplesSectionView(
          component,
          model.copiedSnippets,
          model.liveExampleInputValues,
          model.liveExampleRadioGroupValues,
          model.liveExampleCalendarSelectedDates,
          model.liveExampleCommandDialogOpenValues,
        ),
        apiSectionView(),
        accessibilitySectionView(),
        qualitySectionView(component),
        sourceSectionView(component),
        foldkitDifferencesSectionView(component),
      ]),
  })
}

const registryPageView = (): Html => {
  const h = html<Message>()

  return h.article([], [
    pageHeaderView(
      'Registry',
      'Registry',
      'Generated registry files are the website boundary; registry source stays behind the build step.',
    ),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.h2([], ['Artifacts']),
      h.p([], [
        'The catalog comes from registry/index.json. Component route metadata comes from registry/docs/index.json. The runtime shell does not read registry-src.',
      ]),
      h.ul([h.Class('link-list')], [
        h.li([], [h.a([h.Href(registrySchemaRouter({}))], ['Schema'])]),
        h.li([], [
          h.a([h.Href(registryLifecycleRouter({}))], ['Lifecycle']),
        ]),
      ]),
    ]),
  ])
}

const registrySchemaPageView = (): Html => {
  const h = html<Message>()

  return h.article([], [
    pageHeaderView(
      'Registry',
      'Registry Schema',
      'Schema-backed registry artifacts define what the docs shell can trust.',
    ),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.h2([], ['Current boundary']),
      h.p([], [
        'This page will summarize the RegistryIndex and ComponentDocsIndex contracts. For now it anchors the generated artifact split used by the shell.',
      ]),
    ]),
  ])
}

const registryLifecyclePageView = (): Html => {
  const h = html<Message>()

  return h.article([], [
    pageHeaderView(
      'Registry',
      'Registry Lifecycle',
      'Lifecycle data explains what can be installed, previewed, documented, or deferred.',
    ),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.h2([], ['Axes']),
      h.ul([h.Class('link-list')], [
        h.li([], ['availability: private, preview, installable']),
        h.li([], ['implementationStatus: planned, dossier-ready, implemented']),
        h.li([], ['parityStatus and driftStatus: origin confidence signals']),
        h.li([], ['docsStatus: missing, stub, complete']),
      ]),
    ]),
  ])
}

const roadmapStatView = (
  label: string,
  value: string,
  detail: string,
): Html => {
  const h = html<Message>()

  return h.div([h.Class('roadmap-stat')], [
    h.dt([], [label]),
    h.dd([], [value]),
    h.p([], [detail]),
  ])
}

const roadmapRowView = (row: OriginComponentProgressRow): Html => {
  const h = html<Message>()

  return h.li([h.Class('roadmap-row')], [
    h.div([h.Class('roadmap-row-header')], [
      h.strong([], [row.itemId]),
      statusBadgeView(row.readiness),
    ]),
    h.p([], [
      row.readiness === 'blocked'
        ? `${row.blockers.length} roadmap blocker${row.blockers.length === 1 ? '' : 's'
        } tracked in the progress report.`
        : 'Origin evidence is available; the next step is a focused dossier.',
    ]),
    h.a([h.Class('source-link'), h.Href(row.docsUrl)], ['Origin docs']),
  ])
}

const roadmapBlockedGroupView = (group: RoadmapBlockedGroup): Html => {
  const h = html<Message>()

  return h.article([h.Class('roadmap-group')], [
    h.h3([], [group.label]),
    h.p([], [group.summary]),
    h.ul([h.Class('roadmap-list')], group.rows.map(roadmapRowView)),
  ])
}

const roadmapLoadedPageView = (
  progressReport: OriginComponentProgressReport,
): Html => {
  const h = html<Message>()
  const snapshot = roadmapSnapshot(progressReport)

  return h.article([], [
    pageHeaderView(
      'Roadmap',
      'Roadmap',
      'A product view of component availability, next candidates, and blocked work from the structured progress report.',
    ),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.h2([], ['Available now']),
      h.dl([h.Class('roadmap-stats')], [
        roadmapStatView(
          'Base UI',
          `${snapshot.report.summary.baseUi.imported} of ${snapshot.report.summary.baseUi.total}`,
          `${snapshot.report.summary.baseUi.remaining} remaining origin rows`,
        ),
        roadmapStatView(
          'shadcn',
          `${snapshot.report.summary.shadcn.imported} of ${snapshot.report.summary.shadcn.total}`,
          `${snapshot.report.summary.shadcn.remaining} remaining origin rows`,
        ),
        roadmapStatView(
          'Blocked',
          String(snapshot.report.summary.blockedCount),
          'Rows waiting on product or foundation decisions',
        ),
        roadmapStatView(
          'Ready for dossier',
          String(snapshot.report.summary.readyForDossierCount),
          'Rows with enough source evidence for the next planning pass',
        ),
      ]),
    ]),
    h.section([h.Id('next-candidates'), h.Class('content-section')], [
      h.h2([], ['Next candidates']),
      h.p([], [
        'These rows have enough public source evidence to start the next focused dossier without broad registry rewrites.',
      ]),
      h.ul([h.Class('roadmap-list')], snapshot.nextCandidates.map(roadmapRowView)),
    ]),
    h.section([h.Id('blocked'), h.Class('content-section')], [
      h.h2([], ['Blocked categories']),
      ...snapshot.blockedGroups.map(roadmapBlockedGroupView),
    ]),
    h.section([h.Id('next'), h.Class('content-section')], [
      h.h2([], ['What is next']),
      h.ul(
        [h.Class('link-list')],
        snapshot.nextSteps.map(step => h.li([], [step])),
      ),
    ]),
  ])
}

const roadmapPageView = (model: Model): Html => {
  const h = html<Message>()

  return M.value(model.data).pipe(
    M.withReturnType<Html>(),
    M.tagsExhaustive({
      LoadedDocsData: ({ progressReport }) =>
        roadmapLoadedPageView(progressReport),
      FailedDocsData: ({ message }) =>
        h.article([], [
          pageHeaderView(
            'Roadmap',
            'Roadmap',
            'Progress data could not be loaded from the generated artifacts.',
          ),
          h.p([h.Class('data-error'), h.Role('status')], [message]),
        ]),
    }),
  )
}

const notFoundPageView = (route: typeof NotFoundRoute.Type): Html => {
  const h = html<Message>()

  return h.article([], [
    pageHeaderView(
      'Not Found',
      'Page Not Found',
      `The path "${route.path}" was not found in the Foldkit CN docs shell.`,
    ),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.a([h.Class('action-link'), h.Href(homeRouter({}))], [
        'Back to Foldkit CN',
      ]),
    ]),
  ])
}

const routeContentView = (model: Model): Html =>
  M.value(model.route).pipe(
    M.withReturnType<Html>(),
    M.tagsExhaustive({
      Home: () => homePageView(model),
      Docs: () => docsPageView(),
      ComponentsIndex: () => componentsIndexPageView(model),
      ComponentsNamespace: ({ namespace }) =>
        componentsNamespacePageView(model, namespace),
      ComponentDetail: ({ namespace, slug }) =>
        componentDetailPageView(model, namespace, slug),
      Registry: () => registryPageView(),
      RegistrySchema: () => registrySchemaPageView(),
      RegistryLifecycle: () => registryLifecyclePageView(),
      Roadmap: () => roadmapPageView(model),
      NotFound: route => notFoundPageView(route),
    }),
  )

const routeMetadata = (data: DocsData, route: AppRoute) =>
  pipe(
    routeMetadataForRoute(data, route),
    Option.getOrElse(() => fallbackRouteMetadata(route)),
  )

const routeTitle = (data: DocsData, route: AppRoute): string =>
  routeMetadata(data, route).title

export const view = (model: Model): Document => ({
  title: routeTitle(model.data, model.route),
  body: shellView(model, routeContentView(model)),
})
