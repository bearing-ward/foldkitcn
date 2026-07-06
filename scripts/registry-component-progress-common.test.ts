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
      imported: 38,
      remaining: 0,
    })
    expect(report.summary.shadcn).toStrictEqual({
      total: 63,
      imported: 62,
      remaining: 1,
    })
    expect(report.summary.shadcnSourceFileCount).toBe(60)
    expect(report.summary.shadcnDocsExampleOnlyCount).toBe(3)
  })

  test('marks current imported items from registry source manifests', () => {
    const importedItemIds = [
      'base-ui/accordion',
      'base-ui/alert-dialog',
      'base-ui/autocomplete',
      'base-ui/avatar',
      'base-ui/button',
      'base-ui/checkbox',
      'base-ui/checkbox-group',
      'base-ui/collapsible',
      'base-ui/combobox',
      'base-ui/context-menu',
      'base-ui/dialog',
      'base-ui/drawer',
      'base-ui/fieldset',
      'base-ui/field',
      'base-ui/form',
      'base-ui/input',
      'base-ui/menu',
      'base-ui/menubar',
      'base-ui/navigation-menu',
      'base-ui/meter',
      'base-ui/number-field',
      'base-ui/otp-field',
      'base-ui/popover',
      'base-ui/preview-card',
      'base-ui/progress',
      'base-ui/radio',
      'base-ui/radio-group',
      'base-ui/scroll-area',
      'base-ui/separator',
      'base-ui/select',
      'base-ui/slider',
      'base-ui/switch',
      'base-ui/tabs',
      'base-ui/tooltip',
      'base-ui/toggle',
      'base-ui/toggle-group',
      'base-ui/toolbar',
      'base-ui/toast',
      'shadcn/alert',
      'shadcn/accordion',
      'shadcn/alert-dialog',
      'shadcn/aspect-ratio',
      'shadcn/avatar',
      'shadcn/badge',
      'shadcn/breadcrumb',
      'shadcn/button',
      'shadcn/button-group',
      'shadcn/calendar',
      'shadcn/date-picker',
      'shadcn/carousel',
      'shadcn/card',
      'shadcn/checkbox',
      'shadcn/collapsible',
      'shadcn/combobox',
      'shadcn/command',
      'shadcn/context-menu',
      'shadcn/dialog',
      'shadcn/direction',
      'shadcn/drawer',
      'shadcn/sheet',
      'shadcn/dropdown-menu',
      'shadcn/menubar',
      'shadcn/navigation-menu',
      'shadcn/hover-card',
      'shadcn/kbd',
      'shadcn/label',
      'shadcn/input',
      'shadcn/input-group',
      'shadcn/spinner',
      'shadcn/input-otp',
      'shadcn/field',
      'shadcn/native-select',
      'shadcn/select',
      'shadcn/popover',
      'shadcn/progress',
      'shadcn/radio-group',
      'shadcn/resizable',
      'shadcn/scroll-area',
      'shadcn/separator',
      'shadcn/slider',
      'shadcn/skeleton',
      'shadcn/switch',
      'shadcn/tabs',
      'shadcn/textarea',
      'shadcn/tooltip',
      'shadcn/toggle',
      'shadcn/toggle-group',
      'shadcn/typography',
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

  test('keeps true held rows blocked and removes placeholder docs rows', () => {
    expect(requireRow('shadcn/data-table').readiness).toBe('imported')
    expect(requireRow('shadcn/date-picker').readiness).toBe('imported')
    expect(requireRow('shadcn/chart').readiness).toBe('blocked')
    expect(rowByItemId.has('shadcn/toast')).toBeFalsy()
    expect(requireRow('shadcn/typography').readiness).toBe('imported')
  })

  test('selects no deterministic next row after non-blocked rows are imported', () => {
    const [nextRow] = selectNextOriginComponentRows(report, 1)

    expect(nextRow).toBeUndefined()
  })

  test('selects no imported or blocked rows for next batches', () => {
    const nextRows = selectNextOriginComponentRows(report, 4)

    expect(nextRows.length).toBeLessThanOrEqual(4)
    expect(nextRows).toHaveLength(0)
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
