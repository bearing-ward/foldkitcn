import { HashSet } from 'effect'
import { Scene } from 'foldkit'
import { describe, test } from 'vitest'

import { docsData } from './data'
import {
  ComponentDetailRoute,
  CopySnippet,
  ComponentsIndexRoute,
  ComponentsNamespaceRoute,
  DocsRoute,
  HidCopiedIndicator,
  HideCopiedIndicator,
  HomeRoute,
  MobileNavigation,
  NotFoundRoute,
  RegistryLifecycleRoute,
  RegistryRoute,
  RegistrySchemaRoute,
  RoadmapRoute,
  SucceededCopySnippet,
  update,
  view,
} from './main'
import type { Model } from './main'

const modelWithRoute = (route: Model['route']): Model => ({
  route,
  data: docsData,
  mobileNavigation: MobileNavigation({ isOpen: false }),
  copiedSnippets: HashSet.empty(),
})

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
      Scene.expect(Scene.role('heading', { name: 'Overview' })).toExist(),
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

  test('Button detail renders static example snippets', () => {
    Scene.scene(
      { update, view },
      Scene.with(
        modelWithRoute(
          ComponentDetailRoute({ namespace: 'shadcn', slug: 'button' }),
        ),
      ),
      Scene.expect(Scene.role('heading', { name: 'ButtonDefault' })).toExist(),
      Scene.expect(
        Scene.text('export const ButtonDefault = (): Html => {', {
          exact: false,
        }),
      ).toExist(),
      Scene.expect(Scene.text('static')).toExist(),
      Scene.expect(
        Scene.role('button', { name: 'Copy ButtonDefault example snippet' }),
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

  test('Roadmap renders its page heading', () => {
    Scene.scene(
      { update, view },
      Scene.with(modelWithRoute(RoadmapRoute({}))),
      Scene.expect(Scene.role('heading', { name: 'Roadmap' })).toExist(),
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
