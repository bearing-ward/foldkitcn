import { DateTime, Option } from 'effect'
import { describe, expect, test } from 'vitest'

import { validatePublicParityContracts } from '../../scripts/public-parity-contracts'
import type { PublicParityContract } from '../../scripts/public-parity-contracts'

const validContract: PublicParityContract = {
  itemId: 'shadcn/popover',
  routePath: '/components/shadcn/popover',
  exampleId: Option.some('shadcn/popover-basic'),
  title: 'PopoverBasic',
  profile: 'anchored-layer',
  evidenceMode: 'source-backed',
  originPaths: ['repos/ui/popover.tsx'],
  livePreview: Option.some(true),
  paritySlotStatus: 'ready',
  requiredViewports: ['desktop', 'mobile-390'],
  requiredRecipes: ['open-close', 'edge-collision', 'keyboard-dismissal'],
  exception: Option.none(),
}
const nowMillis = DateTime.makeUnsafe('2026-07-09').epochMilliseconds

describe('public parity contract validation', () => {
  test('rejects an unprofiled public example', () => {
    const unprofiledContract = { ...validContract, profile: undefined }

    expect(() =>
      // @ts-expect-error The validator must reject malformed external data.
      validatePublicParityContracts([unprofiledContract], nowMillis),
    ).toThrow('missing a contract profile')
  })

  test('rejects a missing live renderer', () => {
    expect(() =>
      validatePublicParityContracts(
        [{ ...validContract, livePreview: Option.some(false) }],
        nowMillis,
      ),
    ).toThrow('missing a live preview renderer')
  })

  test('rejects an anchored contract without its mobile recipe', () => {
    expect(() =>
      validatePublicParityContracts(
        [{ ...validContract, requiredRecipes: ['open-close'] }],
        nowMillis,
      ),
    ).toThrow('missing required recipe: edge-collision')
  })

  test('rejects a missing ready parity slot without an exception', () => {
    expect(() =>
      validatePublicParityContracts(
        [{ ...validContract, paritySlotStatus: 'missing' }],
        nowMillis,
      ),
    ).toThrow('missing a ready parity slot')
  })

  test('rejects an expired exception', () => {
    expect(() =>
      validatePublicParityContracts(
        [
          {
            ...validContract,
            exception: Option.some({
              reason: 'Temporarily unavailable.',
              owner: 'plans/128',
              reviewDate: '2020-01-01',
            }),
          },
        ],
        nowMillis,
      ),
    ).toThrow('has an expired exception')
  })

  test('accepts a complete public contract', () => {
    expect(
      validatePublicParityContracts([validContract], nowMillis),
    ).toStrictEqual([validContract])
  })
})
