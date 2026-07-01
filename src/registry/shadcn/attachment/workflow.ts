import { FileDrop } from '@foldkit/ui'
import { Array, Match as M, Option, Schema as S } from 'effect'
import { Command, File } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from './index'

// MODEL

export const Model = S.Struct({
  fileDrop: FileDrop.Model,
  files: S.Array(File.File),
})
export type Model = typeof Model.Type

// MESSAGE

export const GotFileDropMessage = m('GotFileDropMessage', {
  message: FileDrop.Message,
})

export const Message = S.Union([GotFileDropMessage])
export type Message = typeof Message.Type

// INIT

export const init = (): Model => ({
  fileDrop: FileDrop.init({ id: 'attachment-file-drop' }),
  files: [],
})

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const fileSizeLabel = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const fileExtension = (name: string): string =>
  Array.match(name.split('.'), {
    onEmpty: () => 'FILE',
    onNonEmpty: segments => {
      const maybeExtension = segments.at(-1)

      return maybeExtension === undefined
        ? 'FILE'
        : maybeExtension.toUpperCase()
    },
  })

const fileMeta = (file: File.File): string => {
  const mimeType = File.mimeType(file)
  const size = fileSizeLabel(File.size(file))

  return mimeType === '' ? size : `${mimeType} · ${size}`
}

const attachmentRow = (file: File.File): Html => {
  const h = html<Message>()

  return Attachment<Message>({
    className: 'w-full',
    toView: attributes =>
      h.div(
        [...attributes.attachment],
        [
          AttachmentMedia<Message>({
            toView: mediaAttributes =>
              h.div(
                [...mediaAttributes.media],
                [
                  h.span(
                    [h.Class('text-[10px] font-semibold tracking-[0.2em]')],
                    [fileExtension(File.name(file))],
                  ),
                ],
              ),
          }),
          AttachmentContent<Message>({
            toView: contentAttributes =>
              h.div(
                [...contentAttributes.content],
                [
                  AttachmentTitle<Message>({
                    toView: titleAttributes =>
                      h.span([...titleAttributes.title], [File.name(file)]),
                  }),
                  AttachmentDescription<Message>({
                    toView: descriptionAttributes =>
                      h.span(
                        [...descriptionAttributes.description],
                        [fileMeta(file)],
                      ),
                  }),
                ],
              ),
          }),
        ],
      ),
  })
}

export const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      GotFileDropMessage: ({ message: dropMessage }) => {
        const [nextFileDrop, commands, maybeOutMessage] = FileDrop.update(
          model.fileDrop,
          dropMessage,
        )

        const nextFiles = Option.match(maybeOutMessage, {
          onNone: () => model.files,
          onSome: M.type<FileDrop.OutMessage>().pipe(
            M.tagsExhaustive({
              ReceivedFiles: ({ files }) => [...model.files, ...files],
              RejectedNonFiles: () => model.files,
            }),
          ),
        })

        return [
          evo(model, {
            fileDrop: () => nextFileDrop,
            files: () => nextFiles,
          }),
          Command.mapMessages(commands, fileDropMessage =>
            GotFileDropMessage({ message: fileDropMessage }),
          ),
        ]
      },
    }),
  )

// VIEW

const fileDropZoneClassName =
  'flex cursor-pointer flex-col gap-2 rounded-xl border-2 border-dashed border-border bg-card px-4 py-5 text-sm transition-colors hover:border-foreground/30 hover:bg-muted/40 data-[drag-over]:border-foreground/50 data-[drag-over]:bg-muted/60'

export const view = (model: Model): Html => {
  const h = html<Message>()

  return h.div(
    [h.Class('flex w-full max-w-xl flex-col gap-4')],
    [
      h.submodel({
        slotId: model.fileDrop.id,
        model: model.fileDrop,
        view: FileDrop.view,
        viewInputs: {
          multiple: true,
          accept: ['application/pdf', '.doc', '.docx'],
          toView: attributes =>
            h.label(
              [...attributes.root, h.Class(fileDropZoneClassName)],
              [
                h.span(
                  [h.Class('font-medium')],
                  ['Drop files or click to attach'],
                ),
                h.span(
                  [h.Class('text-xs text-muted-foreground')],
                  ['PDF, DOC, or DOCX'],
                ),
                h.input(attributes.input),
              ],
            ),
        },
        toParentMessage: message => GotFileDropMessage({ message }),
      }),
      Array.match(model.files, {
        onEmpty: () =>
          h.p(
            [h.Class('text-sm text-muted-foreground')],
            [
              'Accepted files will appear here after they are dropped or chosen.',
            ],
          ),
        onNonEmpty: files =>
          AttachmentGroup<Message>({
            className: 'w-full',
            children: files.map(attachmentRow),
          }),
      }),
    ],
  )
}

export const AttachmentWorkflowDemo = (): Html => view(init())
