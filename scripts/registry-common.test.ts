import { describe, expect, test } from 'vitest'

import type { RegistryIndex } from '../src/registry/schema'
import {
  registryIndexIsCurrent,
  selectRegistryGeneratedAt,
} from './registry-common'

const emptyIndex = (generatedAt: string): RegistryIndex => ({
  schemaVersion: 1,
  generatedAt,
  sourceRoot: 'registry-src',
  items: [],
})

describe('registry build helpers', () => {
  test('preserves generatedAt when registry index content is unchanged', () => {
    const previousIndex = emptyIndex('2026-06-24T18:00:00.000Z')
    const nextIndex = emptyIndex('2026-06-24T19:00:00.000Z')

    expect(
      selectRegistryGeneratedAt(nextIndex, {
        previousIndex,
        generatedAt: '2026-06-24T20:00:00.000Z',
      }),
    ).toBe('2026-06-24T18:00:00.000Z')
  })

  test('uses a fresh generatedAt value when registry index content changes', () => {
    const previousIndex = emptyIndex('2026-06-24T18:00:00.000Z')
    const nextIndex: RegistryIndex = {
      ...emptyIndex('2026-06-24T19:00:00.000Z'),
      sourceRoot: 'registry-src-next',
    }

    expect(
      selectRegistryGeneratedAt(nextIndex, {
        previousIndex,
        generatedAt: '2026-06-24T20:00:00.000Z',
      }),
    ).toBe('2026-06-24T20:00:00.000Z')
  })

  test('treats unchanged registry index content as current', () => {
    const previousIndex = emptyIndex('2026-06-24T18:00:00.000Z')
    const nextIndex = emptyIndex('2026-06-24T18:00:00.000Z')

    expect(registryIndexIsCurrent(previousIndex, nextIndex)).toBeTruthy()
  })

  test('treats changed registry index content as stale', () => {
    const previousIndex = emptyIndex('2026-06-24T18:00:00.000Z')
    const nextIndex: RegistryIndex = {
      ...emptyIndex('2026-06-24T18:00:00.000Z'),
      sourceRoot: 'registry-src-next',
    }

    expect(registryIndexIsCurrent(previousIndex, nextIndex)).toBeFalsy()
  })

  test('treats changed generatedAt alone as current after timestamp preservation', () => {
    const previousIndex = emptyIndex('2026-06-24T18:00:00.000Z')
    const nextIndex = emptyIndex('2026-06-24T19:00:00.000Z')
    const nextIndexWithPreservedGeneratedAt = {
      ...nextIndex,
      generatedAt: selectRegistryGeneratedAt(nextIndex, {
        previousIndex,
        generatedAt: nextIndex.generatedAt,
      }),
    }

    expect(
      registryIndexIsCurrent(previousIndex, nextIndexWithPreservedGeneratedAt),
    ).toBeTruthy()
  })
})
