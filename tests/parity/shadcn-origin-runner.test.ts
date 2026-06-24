import { describe, expect, test } from 'vitest'

import { captureShadcnOriginSnapshots } from './fixtures/origin/shadcn/runner'
import type { OriginFixtureSnapshot } from './fixtures/origin/shadcn/snapshot'

import { readFileSync } from 'node:fs'

const onlySnapshot = (
  snapshots: ReadonlyArray<OriginFixtureSnapshot>,
): OriginFixtureSnapshot => {
  expect(snapshots).toHaveLength(1)
  const snapshot = snapshots.at(0)

  if (snapshot === undefined) {
    throw new Error('Expected one shadcn origin snapshot.')
  }

  return snapshot
}

const computedStyleValue = (
  snapshot: OriginFixtureSnapshot,
  name: string,
): string => {
  const style = snapshot.computedStyle.find(
    candidate => candidate.name === name,
  )

  if (style === undefined) {
    throw new Error(`Missing computed style value: ${name}`)
  }

  return style.value
}

describe('shadcn origin fixture runner', () => {
  test('captures a browser snapshot from the pinned button-default source', async () => {
    const snapshot = onlySnapshot(
      await captureShadcnOriginSnapshots({ grep: 'button-default' }),
    )

    expect(snapshot.originFilePath).toBe(
      'repos/ui/apps/v4/examples/base/button-default.tsx',
    )
    expect({
      hasColors: snapshot.colors.length > 0,
      hasComputedStyle: snapshot.computedStyle.length > 0,
      hasDimensions: snapshot.dimensions.length > 0,
      hasHeight: snapshot.boundingBox.height > 0,
      hasWidth: snapshot.boundingBox.width > 0,
      height: computedStyleValue(snapshot, 'height'),
      paddingLeft: computedStyleValue(snapshot, 'padding-left'),
      tagName: snapshot.tagName,
      text: snapshot.text,
      renderedDisplay: computedStyleValue(snapshot, 'display'),
    }).toStrictEqual({
      hasColors: true,
      hasComputedStyle: true,
      hasDimensions: true,
      hasHeight: true,
      hasWidth: true,
      height: '32px',
      paddingLeft: '10px',
      tagName: 'button',
      text: 'Button',
      renderedDisplay: 'inline-flex',
    })
    expect(snapshot.classTokens).toStrictEqual(
      expect.arrayContaining(['group/button', 'bg-primary']),
    )
    expect(snapshot.attributes).toStrictEqual(
      expect.arrayContaining([{ name: 'type', value: 'button' }]),
    )
  })

  test('captures the button-render class helper output on a plain anchor', async () => {
    const snapshot = onlySnapshot(
      await captureShadcnOriginSnapshots({ grep: 'button-render' }),
    )

    expect(snapshot.originFilePath).toBe(
      'repos/ui/apps/v4/examples/base/button-render.tsx',
    )
    expect({
      height: computedStyleValue(snapshot, 'height'),
      tagName: snapshot.tagName,
      text: snapshot.text,
      renderedDisplay: computedStyleValue(snapshot, 'display'),
    }).toStrictEqual({
      height: '28px',
      tagName: 'a',
      text: 'Login',
      renderedDisplay: 'inline-flex',
    })
    expect(snapshot.attributes).toStrictEqual(
      expect.arrayContaining([{ name: 'href', value: '#' }]),
    )
    expect(snapshot.classTokens).toStrictEqual(
      expect.arrayContaining([
        'bg-secondary',
        'h-7',
        'text-secondary-foreground',
      ]),
    )
  })

  test('keeps React and origin-only packages out of installable source', () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react',
      '@tabler/icons-react',
      'class-variance-authority',
      'lucide-react',
      'react',
      'react-dom',
    ]
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(readFileSync('registry-src/shadcn/button/item.json', 'utf-8'))
    const installableSourceText = manifest.installableSourcePaths
      .map(filePath => readFileSync(filePath, 'utf-8'))
      .join('\n')

    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSourceText.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
