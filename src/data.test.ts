import { Array, Option, pipe } from 'effect'
import { describe, expect, test } from 'vitest'

import { docsData, publicComponents } from './data'
import { liveExampleViewFor } from './live-examples'
import type { LiveExampleContext } from './live-examples'

const liveExampleContext: LiveExampleContext<unknown> = {
  inputValueFor: (_example, defaultValue) => defaultValue,
  inputIdPrefixFor: example => example.id.replaceAll('/', '-'),
  onInputValueChange: () => ({}),
  radioGroupValueFor: (_example, defaultValue) => defaultValue,
  radioGroupIdPrefixFor: example => example.id.replaceAll('/', '-'),
  onRadioGroupValueChange: () => ({}),
  calendarSelectedDateFor: (_example, defaultValue) => defaultValue,
  onCalendarSelectDate: () => ({}),
  carouselSelectedIndexFor: (_example, defaultValue) => defaultValue,
  onCarouselMessage: () => ({}),
  commandDialogIsOpenFor: () => false,
  commandDialogIdFor: example => `${example.id.replaceAll('/', '-')}-dialog`,
  onCommandDialogOpen: () => ({}),
  onCommandDialogOpenChange: () => ({}),
}

const loadedPublicComponents = () => {
  if (docsData._tag === 'FailedDocsData') {
    throw new Error(docsData.message)
  }

  return publicComponents(docsData)
}

const optionText = (value: Option.Option<string>): string =>
  Option.match(value, {
    onNone: () => '<missing>',
    onSome: text => text,
  })

describe('generated docs data', () => {
  test('loads docs artifacts for every complete public component', () => {
    const missingCompleteArtifacts = pipe(
      loadedPublicComponents(),
      Array.filter(
        component =>
          component.entry.item.lifecycle.docsStatus === 'complete' &&
          Option.isNone(component.maybeDocsArtifact),
      ),
      Array.map(component => component.entry.item.id),
    )

    expect(missingCompleteArtifacts).toStrictEqual([])
  })

  test('complete component docs include live examples with registered renderers', () => {
    const completeArtifacts = pipe(
      loadedPublicComponents(),
      Array.filter(
        component => component.entry.item.lifecycle.docsStatus === 'complete',
      ),
      Array.flatMap(component =>
        Option.match(component.maybeDocsArtifact, {
          onNone: () => [],
          onSome: artifact => [artifact],
        }),
      ),
    )
    const completeWithoutLiveExamples = pipe(
      completeArtifacts,
      Array.filter(
        artifact =>
          artifact.examples.length > 0 &&
          !artifact.examples.some(
            example => example.previewStatus === 'live-ready',
          ),
      ),
      Array.map(artifact => artifact.itemId),
    )
    const missingLiveExampleRenderers = pipe(
      completeArtifacts,
      Array.flatMap(artifact =>
        pipe(
          artifact.examples,
          Array.filter(
            example =>
              example.previewStatus === 'live-ready' &&
              Option.isNone(liveExampleViewFor(example, liveExampleContext)),
          ),
          Array.map(
            example =>
              `${artifact.itemId}#${optionText(example.previewExportName)}`,
          ),
        ),
      ),
    )

    expect(completeArtifacts.map(artifact => artifact.itemId)).toContain(
      'shadcn/item',
    )
    expect(completeWithoutLiveExamples).toStrictEqual([])
    expect(missingLiveExampleRenderers).toStrictEqual([])
  })
})
