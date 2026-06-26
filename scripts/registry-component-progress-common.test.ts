import { Schema as S } from 'effect'
import { describe, expect, test } from 'vitest'

import { OriginComponentProgressReport } from '../src/registry/schema'
import {
  deriveOriginComponentProgress,
  selectNextOriginComponentRows,
} from './registry-component-progress-common'

const report = deriveOriginComponentProgress({
  generatedAt: '2026-06-25T00:00:00.000Z',
})

const rowByItemId = new Map(report.rows.map(row => [row.itemId, row]))

const requireRow = (itemId: string) => {
  const maybeRow = rowByItemId.get(itemId)

  if (maybeRow === undefined) {
    throw new Error(`Missing progress row: ${itemId}`)
  }

  return maybeRow
}

describe('origin component progress', () => {
  test('decodes the derived report with the boundary schema', () => {
    expect(() =>
      S.decodeUnknownSync(OriginComponentProgressReport)(report),
    ).not.toThrow()
  })

  test('summarizes pinned origin and registry surfaces', () => {
    expect(report.summary.baseUi).toStrictEqual({
      total: 38,
      imported: 21,
      remaining: 17,
    })
    expect(report.summary.shadcn).toStrictEqual({
      total: 59,
      imported: 25,
      remaining: 34,
    })
    expect(report.summary.shadcnSourceFileCount).toBe(55)
    expect(report.summary.shadcnDocsExampleOnlyCount).toBe(4)
  })

  test('marks current imported items from registry source manifests', () => {
    const importedItemIds = [
      'base-ui/accordion',
      'base-ui/avatar',
      'base-ui/button',
      'base-ui/checkbox',
      'base-ui/collapsible',
      'base-ui/dialog',
      'base-ui/fieldset',
      'base-ui/field',
      'base-ui/form',
      'base-ui/input',
      'base-ui/meter',
      'base-ui/number-field',
      'base-ui/popover',
      'base-ui/progress',
      'base-ui/radio-group',
      'base-ui/separator',
      'base-ui/slider',
      'base-ui/switch',
      'base-ui/tabs',
      'base-ui/toggle',
      'base-ui/toggle-group',
      'shadcn/alert',
      'shadcn/accordion',
      'shadcn/aspect-ratio',
      'shadcn/avatar',
      'shadcn/badge',
      'shadcn/button',
      'shadcn/checkbox',
      'shadcn/collapsible',
      'shadcn/dialog',
      'shadcn/kbd',
      'shadcn/label',
      'shadcn/input',
      'shadcn/field',
      'shadcn/native-select',
      'shadcn/popover',
      'shadcn/progress',
      'shadcn/radio-group',
      'shadcn/separator',
      'shadcn/slider',
      'shadcn/skeleton',
      'shadcn/switch',
      'shadcn/tabs',
      'shadcn/textarea',
      'shadcn/toggle',
      'shadcn/toggle-group',
    ]

    expect(
      importedItemIds.map(itemId => requireRow(itemId).readiness),
    ).toStrictEqual(importedItemIds.map(() => 'imported'))
  })

  test('excludes stale historical queue rows that are now imported from next selection', () => {
    const nextRows = selectNextOriginComponentRows(report, 20)
    const nextItemIds = nextRows.map(row => row.itemId)

    expect(nextItemIds).not.toContain('base-ui/meter')
    expect(nextItemIds).not.toContain('shadcn/alert')
    expect(nextItemIds).not.toContain('shadcn/native-select')
  })

  test('keeps held rows blocked and visible', () => {
    expect(requireRow('shadcn/data-table').readiness).toBe('blocked')
    expect(requireRow('shadcn/date-picker').readiness).toBe('blocked')
    expect(requireRow('shadcn/toast').readiness).toBe('blocked')
    expect(requireRow('shadcn/typography').readiness).toBe('blocked')
    expect(requireRow('shadcn/chart').readiness).toBe('blocked')
  })

  test('selects a deterministic next row with recommended URLs', () => {
    const [nextRow] = selectNextOriginComponentRows(report, 1)

    expect(nextRow?.itemId).toBe('base-ui/tooltip')
    expect(nextRow?.readiness).toBe('dossier-ready')
    expect(nextRow?.recommendedUrls).toStrictEqual([
      'https://base-ui.com/react/components/tooltip',
      'https://ui.shadcn.com/docs/components/tooltip',
    ])
  })

  test('selects no imported or blocked rows for next batches', () => {
    const nextRows = selectNextOriginComponentRows(report, 4)

    expect(nextRows.length).toBeLessThanOrEqual(4)
    expect(nextRows).not.toHaveLength(0)
    expect(nextRows.every(row => row.readiness !== 'imported')).toBeTruthy()
    expect(nextRows.every(row => row.readiness !== 'blocked')).toBeTruthy()
  })

  test('keeps lifecycle dimensions separate on selected rows', () => {
    const nextRows = selectNextOriginComponentRows(report, 4)

    expect(
      nextRows.every(
        row =>
          typeof row.implementationStatus === 'string' &&
          typeof row.parityStatus === 'string' &&
          typeof row.driftStatus === 'string' &&
          typeof row.availability === 'string' &&
          typeof row.readiness === 'string',
      ),
    ).toBeTruthy()
  })
})
