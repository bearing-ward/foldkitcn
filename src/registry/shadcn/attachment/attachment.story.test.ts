import { FileDrop } from '@foldkit/ui'
import { File, Story } from 'foldkit'
import { describe, expect, test } from 'vitest'

import * as AttachmentWorkflow from './workflow'

const withInitial = Story.with(AttachmentWorkflow.init())

describe('shadcn/attachment workflow', () => {
  test('stores received files from the FileDrop submodel', () => {
    const resume = new globalThis.File(['resume-bytes'], 'resume.pdf', {
      type: 'application/pdf',
    })

    Story.story(
      AttachmentWorkflow.update,
      withInitial,
      Story.message(
        AttachmentWorkflow.GotFileDropMessage({
          message: FileDrop.DroppedFiles({ files: [resume] }),
        }),
      ),
      Story.model(model => {
        const [maybeFile] = model.files

        expect(model.files).toHaveLength(1)
        expect(maybeFile).toBeDefined()
        if (maybeFile === undefined) {
          throw new Error('Expected the dropped file to be stored.')
        }
        expect(File.name(maybeFile)).toBe('resume.pdf')
        expect(model.fileDrop.isDragOver).toBeFalsy()
      }),
    )
  })

  test('ignores rejected non-file drops', () => {
    Story.story(
      AttachmentWorkflow.update,
      withInitial,
      Story.message(
        AttachmentWorkflow.GotFileDropMessage({
          message: FileDrop.DroppedNonFiles(),
        }),
      ),
      Story.model(model => {
        expect(model.files).toHaveLength(0)
        expect(model.fileDrop.isDragOver).toBeFalsy()
      }),
    )
  })
})
