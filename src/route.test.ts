import { Option } from 'effect'
import { fromString } from 'foldkit/url'
import { describe, expect, test } from 'vitest'

import {
  ComponentDetailRoute,
  HomeRoute,
  NotFoundRoute,
  componentDetailRouter,
  homeRouter,
  stripDeploymentBaseFromPathname,
  urlToAppRoute,
} from './route'

const urlOrThrow = (raw: string) =>
  Option.getOrThrowWith(
    fromString(raw),
    () => new Error(`Failed to parse url: ${raw}`),
  )

describe('route base path helpers', () => {
  test('strips the deployment base from pathnames before parsing', () => {
    expect(stripDeploymentBaseFromPathname('/foldkitcn/', '/foldkitcn/')).toBe(
      '/',
    )
    expect(
      stripDeploymentBaseFromPathname(
        '/foldkitcn/components/shadcn/button',
        '/foldkitcn/',
      ),
    ).toBe('/components/shadcn/button')
    expect(
      stripDeploymentBaseFromPathname(
        '/components/shadcn/button',
        '/foldkitcn/',
      ),
    ).toBe('/components/shadcn/button')
  })

  test('prints routes with the deployment base when requested', () => {
    expect(homeRouter({}, '/foldkitcn/')).toBe('/foldkitcn/')
    expect(
      componentDetailRouter(
        { namespace: 'shadcn', slug: 'button' },
        '/foldkitcn/',
      ),
    ).toBe('/foldkitcn/components/shadcn/button')
  })

  test('parses root and component routes with and without the deployment base', () => {
    expect(urlToAppRoute(urlOrThrow('http://localhost/'))).toStrictEqual(
      HomeRoute(),
    )
    expect(
      urlToAppRoute(urlOrThrow('http://localhost/components/shadcn/button')),
    ).toStrictEqual(
      ComponentDetailRoute({ namespace: 'shadcn', slug: 'button' }),
    )
    expect(
      urlToAppRoute(urlOrThrow('http://localhost/foldkitcn/'), '/foldkitcn/'),
    ).toStrictEqual(HomeRoute())
    expect(
      urlToAppRoute(
        urlOrThrow('http://localhost/foldkitcn/components/shadcn/button'),
        '/foldkitcn/',
      ),
    ).toStrictEqual(
      ComponentDetailRoute({ namespace: 'shadcn', slug: 'button' }),
    )
  })

  test('falls back to NotFound with the stripped pathname under the deployment base', () => {
    expect(
      urlToAppRoute(
        urlOrThrow('http://localhost/foldkitcn/does-not-exist'),
        '/foldkitcn/',
      ),
    ).toStrictEqual(NotFoundRoute({ path: '/does-not-exist' }))
    expect(
      urlToAppRoute(urlOrThrow('http://localhost/does-not-exist')),
    ).toStrictEqual(NotFoundRoute({ path: '/does-not-exist' }))
  })
})
