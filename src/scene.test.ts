import { Scene } from 'foldkit'
import { describe, test } from 'vitest'

import { docsData } from './data'
import {
  ComponentDetailRoute,
  ComponentsIndexRoute,
  ComponentsNamespaceRoute,
  DocsRoute,
  HomeRoute,
  MobileNavigation,
  NotFoundRoute,
  RegistryLifecycleRoute,
  RegistryRoute,
  RegistrySchemaRoute,
  RoadmapRoute,
  update,
  view,
} from './main'
import type { Model } from './main'

const modelWithRoute = (route: Model['route']): Model => ({
  route,
  data: docsData,
  mobileNavigation: MobileNavigation({ isOpen: false }),
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
