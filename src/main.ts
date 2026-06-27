import {
  Array,
  Effect,
  HashSet,
  Match as M,
  Option,
  Schema as S,
  pipe,
} from 'effect'
import type { Runtime } from 'foldkit'
import { Command } from 'foldkit'
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
} from './data'
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

export const Model = S.Struct({
  route: AppRoute,
  data: DocsData,
  mobileNavigation: MobileNavigation,
  copiedSnippets: S.HashSet(S.String),
})
export type Model = typeof Model.Type

// MESSAGE

export const CompletedNavigateInternal = m('CompletedNavigateInternal')
export const CompletedLoadExternal = m('CompletedLoadExternal')
export const ClickedLink = m('ClickedLink', { request: UrlRequest })
export const ChangedUrl = m('ChangedUrl', { url: Url })
export const ClickedToggleMobileNavigation = m('ClickedToggleMobileNavigation')
export const ClickedCopySnippet = m('ClickedCopySnippet', { text: S.String })
export const SucceededCopySnippet = m('SucceededCopySnippet', {
  text: S.String,
})
export const FailedCopySnippet = m('FailedCopySnippet')
export const HidCopiedIndicator = m('HidCopiedIndicator', { text: S.String })

export const Message = S.Union([
  CompletedNavigateInternal,
  CompletedLoadExternal,
  ClickedLink,
  ChangedUrl,
  ClickedToggleMobileNavigation,
  ClickedCopySnippet,
  SucceededCopySnippet,
  FailedCopySnippet,
  HidCopiedIndicator,
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
  },
  [],
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

export const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      CompletedNavigateInternal: () => [model, []],
      CompletedLoadExternal: () => [model, []],
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
        [],
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
    }),
  )

// VIEW

const navLinks = [
  { label: 'Home', href: homeRouter({}) },
  { label: 'Docs', href: docsRouter({}) },
  { label: 'Components', href: componentsIndexRouter({}) },
  { label: 'Registry', href: registryRouter({}) },
  { label: 'Roadmap', href: roadmapRouter({}) },
]

const pageLinks = [
  { label: 'Registry Schema', href: registrySchemaRouter({}) },
  { label: 'Registry Lifecycle', href: registryLifecycleRouter({}) },
]

const navLinkView = (label: string, href: string): Html => {
  const h = html<Message>()

  return h.a([h.Class('docs-nav-link'), h.Href(href)], [label])
}

const headerView = (model: Model): Html => {
  const h = html<Message>()

  return h.header(
    [h.Class('site-header')],
    [
      h.a([h.Class('brand-link'), h.Href(homeRouter({}))], [
        h.span([h.Class('brand-mark'), h.AriaHidden(true)], ['F']),
        h.span([h.Class('brand-wordmark')], ['Foldkit']),
        h.span([h.Class('brand-cn')], ['CN']),
      ]),
      h.nav([h.Class('desktop-nav'), h.AriaLabel('Primary')], [
        ...navLinks.map(link => navLinkView(link.label, link.href)),
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

  return h.keyed('nav')(
    model.mobileNavigation.isOpen ? 'mobile-open' : 'mobile-closed',
    [
      h.Class(
        model.mobileNavigation.isOpen
          ? 'mobile-nav mobile-nav-open'
          : 'mobile-nav',
      ),
      h.AriaLabel('Mobile'),
    ],
    navLinks.map(link => navLinkView(link.label, link.href)),
  )
}

const sidebarView = (groups: ReadonlyArray<NamespaceGroup>): Html => {
  const h = html<Message>()

  return h.aside(
    [h.Class('docs-sidebar')],
    [
      h.nav([h.AriaLabel('Component navigation')], [
        h.a([h.Class('sidebar-root-link'), h.Href(componentsIndexRouter({}))], [
          'All components',
        ]),
        ...groups.map(group =>
          h.section([h.Class('sidebar-group')], [
            h.h2([h.Class('sidebar-heading')], [group.label]),
            h.ul(
              [h.Class('sidebar-list')],
              group.components.map(component =>
                h.keyed('li')(
                  component.entry.item.id,
                  [],
                  [
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

const tableOfContentsView = (): Html => {
  const h = html<Message>()

  return h.aside([h.Class('docs-toc'), h.AriaLabel('On this page')], [
    h.p([h.Class('toc-heading')], ['On this page']),
    h.a([h.Href('#overview')], ['Overview']),
    h.a([h.Href('#installation')], ['Installation']),
    h.a([h.Href('#usage')], ['Usage']),
    h.a([h.Href('#examples')], ['Examples']),
    h.a([h.Href('#api')], ['API']),
    h.a([h.Href('#accessibility')], ['Accessibility']),
    h.a([h.Href('#quality')], ['Quality']),
    h.a([h.Href('#source')], ['Source']),
    h.a([h.Href('#foldkit-differences')], ['Foldkit Differences']),
  ])
}

const shellView = (model: Model, content: Html): Html => {
  const h = html<Message>()
  const groups = namespaceGroups(model.data)

  return h.div([h.Class('app-shell')], [
    headerView(model),
    mobileNavigationView(model),
    h.div([h.Class('docs-layout')], [
      sidebarView(groups),
      h.main([h.Id('main-content'), h.Class('docs-main')], [
        h.keyed('div')(model.route._tag, [h.Class('route-frame')], [content]),
      ]),
      tableOfContentsView(),
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
    h.p([h.Class('eyebrow')], [eyebrow]),
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

const statusText = (value: string): string => value.replaceAll('-', ' ')

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
    h.pre([h.Class('code-block')], [h.code([], [text])]),
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

const examplePreviewStatusView = (status: string): Html => {
  const h = html<Message>()

  return h.span([h.Class(`status-badge status-${status}`)], [
    statusText(status),
  ])
}

const examplesSectionView = (
  component: PublicComponent,
  copiedSnippets: HashSet.HashSet<string>,
): Html => {
  const h = html<Message>()

  return h.section([h.Id('examples'), h.Class('content-section')], [
    h.h2([], ['Examples']),
    Option.match(component.maybeDocsArtifact, {
      onNone: () => h.p([], ['Example metadata is not loaded.']),
      onSome: artifact =>
        h.div(
          [h.Class('example-list')],
          artifact.examples.map(example =>
            h.article([h.Class('example-card')], [
              h.div([h.Class('example-card-header')], [
                h.div([], [
                  h.h3([], [example.title]),
                  h.p([], [example.description]),
                ]),
                examplePreviewStatusView(example.previewStatus),
              ]),
              snippetBlockView(
                example.snippet,
                `Copy ${example.title} example snippet`,
                copiedSnippets,
              ),
            ]),
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
          h.h2([], ['Overview']),
          h.p([], [component.entry.item.description]),
          dependenciesPanelView(component),
        ]),
        installationSectionView(component, model.copiedSnippets),
        usageSectionView(component, model.copiedSnippets),
        examplesSectionView(component, model.copiedSnippets),
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

const roadmapPageView = (): Html => {
  const h = html<Message>()

  return h.article([], [
    pageHeaderView(
      'Roadmap',
      'Roadmap',
      'Planned, blocked, private, and docs-readiness work belongs here instead of public component navigation.',
    ),
    h.section([h.Id('status'), h.Class('content-section')], [
      h.h2([], ['Next data pass']),
      h.p([], [
        'Later plans can drive this page from generated progress data without changing the docs shell route contract.',
      ]),
    ]),
  ])
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
      Roadmap: () => roadmapPageView(),
      NotFound: route => notFoundPageView(route),
    }),
  )

const routeTitle = (route: AppRoute): string =>
  M.value(route).pipe(
    M.withReturnType<string>(),
    M.tagsExhaustive({
      Home: () => 'Foldkit CN',
      Docs: () => 'Documentation overview | Foldkit CN',
      ComponentsIndex: () => 'Components | Foldkit CN',
      ComponentsNamespace: ({ namespace }) => `${namespace} | Foldkit CN`,
      ComponentDetail: ({ namespace, slug }) =>
        `${namespace}/${slug} | Foldkit CN`,
      Registry: () => 'Registry | Foldkit CN',
      RegistrySchema: () => 'Registry Schema | Foldkit CN',
      RegistryLifecycle: () => 'Registry Lifecycle | Foldkit CN',
      Roadmap: () => 'Roadmap | Foldkit CN',
      NotFound: () => 'Page Not Found | Foldkit CN',
    }),
  )

export const view = (model: Model): Document => ({
  title: routeTitle(model.route),
  body: shellView(model, routeContentView(model)),
})
