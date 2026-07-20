import { Array, DateTime, Option, Schema as S } from 'effect'

import type { ComponentDocsArtifact } from '../src/registry/schema'
import type { ParitySlot } from '../tests/parity/slots'

export const PublicParityProfile = S.Union([
  S.Literal('anchored-layer'),
  S.Literal('modal-layer'),
  S.Literal('selection-form'),
  S.Literal('data-time-layout'),
  S.Literal('static-composition'),
])
export type PublicParityProfile = typeof PublicParityProfile.Type

export const PublicParityException = S.Struct({
  reason: S.String,
  owner: S.String,
  reviewDate: S.String,
})
export type PublicParityException = typeof PublicParityException.Type

export const PublicParityContract = S.Struct({
  itemId: S.String,
  routePath: S.String,
  exampleId: S.OptionFromNullOr(S.String),
  title: S.String,
  profile: PublicParityProfile,
  evidenceMode: S.Union([
    S.Literal('source-backed'),
    S.Literal('docs-example-only'),
  ]),
  originPaths: S.Array(S.String),
  livePreview: S.OptionFromNullOr(S.Boolean),
  paritySlotStatus: S.Union([
    S.Literal('missing'),
    S.Literal('planned'),
    S.Literal('ready'),
  ]),
  requiredViewports: S.Array(
    S.Union([S.Literal('desktop'), S.Literal('mobile-390')]),
  ),
  requiredRecipes: S.Array(S.String),
  exception: S.OptionFromNullOr(PublicParityException),
})
export type PublicParityContract = typeof PublicParityContract.Type
export const PublicParityContracts = S.Array(PublicParityContract)

const anchoredLayers = new Set([
  'autocomplete',
  'combobox',
  'context-menu',
  'date-picker',
  'dropdown-menu',
  'hover-card',
  'menu',
  'menubar',
  'navigation-menu',
  'popover',
  'preview-card',
  'select',
  'tooltip',
])
const modalLayers = new Set([
  'alert-dialog',
  'command',
  'dialog',
  'drawer',
  'sheet',
])
const selectionForms = new Set([
  'accordion',
  'calendar',
  'checkbox',
  'checkbox-group',
  'collapsible',
  'field',
  'fieldset',
  'form',
  'input',
  'input-group',
  'input-otp',
  'label',
  'native-select',
  'number-field',
  'otp-field',
  'radio',
  'radio-group',
  'slider',
  'switch',
  'tabs',
  'textarea',
  'toggle',
  'toggle-group',
])
const dataTimeLayouts = new Set([
  'attachment',
  'calendar',
  'carousel',
  'data-table',
  'date-picker',
  'pagination',
  'resizable',
  'scroll-area',
  'sidebar',
  'sonner',
  'table',
  'toast',
])

const paritySlotExceptions = new Map<string, PublicParityException>([
  [
    'shadcn/typography',
    {
      reason:
        'The origin surface is docs-only and has no installable component fixture.',
      owner: 'plans/134-formalize-typography-docs-only-parity.md',
      reviewDate: '2026-10-09',
    },
  ],
])
const exceptionFor = (itemId: string): Option.Option<PublicParityException> => {
  const paritySlotException = paritySlotExceptions.get(itemId)

  if (paritySlotException !== undefined) {
    return Option.some(paritySlotException)
  }
  return Option.none()
}

const componentName = (itemId: string): string => itemId.split('/').at(-1) ?? ''

export const profileForItem = (itemId: string): PublicParityProfile => {
  const name = componentName(itemId)

  if (anchoredLayers.has(name)) {
    return 'anchored-layer'
  }
  if (modalLayers.has(name)) {
    return 'modal-layer'
  }
  if (selectionForms.has(name)) {
    return 'selection-form'
  }
  if (dataTimeLayouts.has(name)) {
    return 'data-time-layout'
  }

  return 'static-composition'
}

const recipesForProfile = (
  profile: PublicParityProfile,
): ReadonlyArray<string> => {
  if (profile === 'anchored-layer') {
    return ['open-close', 'edge-collision', 'keyboard-dismissal']
  }
  if (profile === 'modal-layer') {
    return ['open-close', 'focus-restoration', 'escape-outside-policy']
  }
  if (profile === 'selection-form') {
    return ['pointer-transition', 'keyboard-transition', 'disabled-state']
  }
  if (profile === 'data-time-layout') {
    return ['primary-interaction', 'empty-or-boundary-state', 'mobile-overflow']
  }

  return ['semantic-region']
}

const originPathsFor = (
  artifact: ComponentDocsArtifact,
): ReadonlyArray<string> =>
  artifact.originProvenance.flatMap(origin => [
    ...origin.sourcePaths,
    ...origin.examplePaths,
    ...origin.docsPaths,
  ])

export const createPublicParityContracts = (
  artifacts: ReadonlyArray<ComponentDocsArtifact>,
  slots: ReadonlyArray<ParitySlot>,
  hasLiveExampleViewFor: (
    example: ComponentDocsArtifact['examples'][number],
  ) => boolean,
): ReadonlyArray<PublicParityContract> => {
  const slotStatuses = new Map<string, ParitySlot['status']>(
    slots.map(slot => [slot.itemId, slot.status]),
  )

  return artifacts
    .filter(
      artifact =>
        artifact.itemId.startsWith('base-ui/') ||
        artifact.itemId.startsWith('shadcn/'),
    )
    .flatMap(artifact => {
      const profile = profileForItem(artifact.itemId)
      const originPaths = originPathsFor(artifact)
      const sourceBacked = artifact.originProvenance.some(origin =>
        Array.isReadonlyArrayNonEmpty(origin.sourcePaths),
      )

      const examples = artifact.examples.map(example =>
        S.decodeUnknownSync(PublicParityContract)({
          itemId: artifact.itemId,
          routePath: artifact.routePath,
          exampleId: Option.some(example.id),
          title: example.title,
          profile,
          evidenceMode: sourceBacked ? 'source-backed' : 'docs-example-only',
          originPaths,
          livePreview: Option.some(hasLiveExampleViewFor(example)),
          paritySlotStatus: slotStatuses.get(artifact.itemId) ?? 'missing',
          requiredViewports: ['desktop', 'mobile-390'],
          requiredRecipes: recipesForProfile(profile),
          exception: exceptionFor(artifact.itemId),
        }),
      )

      return Array.isReadonlyArrayNonEmpty(examples)
        ? examples
        : [
            S.decodeUnknownSync(PublicParityContract)({
              itemId: artifact.itemId,
              routePath: artifact.routePath,
              exampleId: Option.none(),
              title: artifact.title,
              profile,
              evidenceMode: sourceBacked
                ? 'source-backed'
                : 'docs-example-only',
              originPaths,
              livePreview: Option.none(),
              paritySlotStatus: slotStatuses.get(artifact.itemId) ?? 'missing',
              requiredViewports: ['desktop', 'mobile-390'],
              requiredRecipes: recipesForProfile(profile),
              exception: exceptionFor(artifact.itemId),
            }),
          ]
    })
}

const isExpired = (reviewDate: string, nowMillis: number): boolean =>
  DateTime.makeUnsafe(reviewDate).epochMilliseconds < nowMillis

const contractLabel = (contract: PublicParityContract): string =>
  Option.getOrElse(contract.exampleId, () => contract.itemId)

export const validatePublicParityContracts = (
  contracts: ReadonlyArray<PublicParityContract>,
  nowMillis: number,
): ReadonlyArray<PublicParityContract> =>
  contracts.map(contract => {
    if (!contract.profile) {
      throw new Error(
        `${contractLabel(contract)} is missing a contract profile`,
      )
    }
    if (
      Option.isSome(contract.livePreview) &&
      !contract.livePreview.value &&
      Option.isNone(contract.exception)
    ) {
      throw new Error(
        `${contractLabel(contract)} is missing a live preview renderer`,
      )
    }
    if (
      !Array.isReadonlyArrayNonEmpty(contract.originPaths) &&
      Option.isNone(contract.exception)
    ) {
      throw new Error(`${contractLabel(contract)} is missing origin evidence`)
    }
    if (
      contract.paritySlotStatus !== 'ready' &&
      Option.isNone(contract.exception)
    ) {
      throw new Error(
        `${contractLabel(contract)} is missing a ready parity slot`,
      )
    }
    if (!contract.requiredViewports.includes('mobile-390')) {
      throw new Error(
        `${contractLabel(contract)} is missing required viewport: mobile-390`,
      )
    }
    const missingRecipe = recipesForProfile(contract.profile).find(
      recipe => !contract.requiredRecipes.includes(recipe),
    )

    if (missingRecipe !== undefined) {
      throw new Error(
        `${contractLabel(contract)} is missing required recipe: ${missingRecipe}`,
      )
    }
    if (
      Option.isSome(contract.exception) &&
      isExpired(contract.exception.value.reviewDate, nowMillis)
    ) {
      throw new Error(`${contractLabel(contract)} has an expired exception`)
    }

    return contract
  })

export const publicParitySummary = (
  contracts: ReadonlyArray<PublicParityContract>,
) => ({
  routeCount: new Set(contracts.map(contract => contract.itemId)).size,
  contractCount: contracts.length,
  exampleCount: contracts.filter(contract => Option.isSome(contract.exampleId))
    .length,
  sourceBackedCount: contracts.filter(
    contract => contract.evidenceMode === 'source-backed',
  ).length,
  docsExampleOnlyCount: contracts.filter(
    contract => contract.evidenceMode === 'docs-example-only',
  ).length,
  missingSlotCount: contracts.filter(
    contract => contract.paritySlotStatus === 'missing',
  ).length,
  exceptionCount: contracts.filter(contract =>
    Option.isSome(contract.exception),
  ).length,
})
