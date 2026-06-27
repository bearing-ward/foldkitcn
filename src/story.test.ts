import { Option } from 'effect'
import { Story } from 'foldkit'
import { fromString } from 'foldkit/url'
import { describe, expect, test } from 'vitest'

import { docsData } from './data'
import {
  ChangedUrl,
  ComponentDetailRoute,
  ComponentsIndexRoute,
  ComponentsNamespaceRoute,
  DocsRoute,
  HomeRoute,
  MobileNavigation,
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
  update,
  urlToAppRoute,
} from './main'
import type { Model } from './main'

const model: Model = {
  route: HomeRoute({}),
  data: docsData,
  mobileNavigation: MobileNavigation({ isOpen: false }),
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
  })
})
