import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { Spinner } from '../spinner'
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from './index'

type FileEntry = Readonly<{
  name: string
  meta: string
  src?: string
  alt?: string
  icon?: () => Html
}>

const icon = (
  className: string,
  paths: ReadonlyArray<string>,
  attributes: ReadonlyArray<Attribute<never>> = [],
): Html => {
  const h = html<never>()

  return h.svg(
    [
      h.Xmlns('http://www.w3.org/2000/svg'),
      h.Width('24'),
      h.Height('24'),
      h.ViewBox('0 0 24 24'),
      h.Fill('none'),
      h.Stroke('currentColor'),
      h.StrokeWidth('2'),
      h.StrokeLinecap('round'),
      h.StrokeLinejoin('round'),
      h.AriaHidden(true),
      h.Class(className),
      ...attributes,
    ],
    paths.map(path => h.path([h.D(path)], [])),
  )
}

const fileCodeIcon = (): Html =>
  icon('lucide lucide-file-code', [
    'M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z',
    'M14 2v5h5',
    'M10 13 8 15l2 2',
    'M14 13l2 2-2 2',
  ])

const fileTextIcon = (): Html =>
  icon('lucide lucide-file-text', [
    'M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z',
    'M14 2v5h5',
    'M9 13h6',
    'M9 17h6',
    'M9 9h2',
  ])

const tableIcon = (): Html =>
  icon('lucide lucide-table', [
    'M3 5h18',
    'M3 12h18',
    'M3 19h18',
    'M7 3v18',
    'M17 3v18',
  ])

const xIcon = (): Html => icon('lucide lucide-x', ['M18 6 6 18', 'M6 6 18 18'])

const copyIcon = (): Html =>
  icon('lucide lucide-copy', ['M9 9h10v10H9z', 'M5 15V5a2 2 0 0 1 2-2h10'])

const fileSearchIcon = (): Html =>
  icon('lucide lucide-file-search', [
    'M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z',
    'M14 2v5h5',
    'm11.5 14.5 2.5 2.5',
    'M10.5 14a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  ])

const clockIcon = (): Html =>
  icon('lucide lucide-clock-3', [
    'M12 6v6l4 2',
    'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  ])

const fileWarningIcon = (): Html =>
  icon('lucide lucide-file-warning', [
    'M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z',
    'M14 2v5h5',
    'M12 10v4',
    'M12 17h.01',
  ])

const refreshIcon = (): Html =>
  icon('lucide lucide-refresh-cw', [
    'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16',
    'M3 21v-5h5',
    'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8',
    'M16 8h5V3',
  ])

const checkIcon = (): Html => icon('lucide lucide-check', ['M20 6 9 17l-5-5'])

const spinnerIcon = (): Html => Spinner()

const withoutSlotAttributes = <Message>(
  attributes: ReadonlyArray<Attribute<Message>>,
): ReadonlyArray<Attribute<Message>> =>
  attributes.filter(
    attribute => attribute._tag !== 'DataAttribute' || attribute.key !== 'slot',
  )

const imageEntries: ReadonlyArray<FileEntry> = [
  {
    name: 'workspace.png',
    meta: 'PNG · 820 KB',
    src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80',
    alt: 'Workspace',
  },
  {
    name: 'desk-reference.jpg',
    meta: 'JPG · 1.1 MB',
    src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80',
    alt: 'Desk',
  },
  {
    name: 'office-reference.jpg',
    meta: 'JPG · 940 KB',
    src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80',
    alt: 'Office',
  },
]

const groupEntries: ReadonlyArray<FileEntry> = [
  {
    name: 'briefing-notes.pdf',
    meta: 'PDF · 1.4 MB',
    icon: fileTextIcon,
  },
  {
    name: 'workspace.png',
    meta: 'PNG · 820 KB',
    src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80',
  },
  {
    name: 'customers.csv',
    meta: 'CSV · 18 KB',
    icon: tableIcon,
  },
  {
    name: 'renderer.tsx',
    meta: 'TSX · 12 KB',
    icon: fileCodeIcon,
  },
]

const attachmentCard = (
  entry: FileEntry,
  config: Readonly<{
    orientation?: 'horizontal' | 'vertical'
    size?: 'default' | 'sm' | 'xs'
    state?: 'idle' | 'uploading' | 'processing' | 'error' | 'done'
    className?: string
    actions?: ReadonlyArray<Html>
    trigger?: Html
  }> = {},
): Html => {
  const h = html<never>()

  return Attachment<never>({
    orientation: config.orientation,
    size: config.size,
    state: config.state,
    className: config.className,
    toView: attributes =>
      h.div(
        [...attributes.attachment],
        [
          entry.src
            ? AttachmentMedia<never>({
                variant: 'image',
                toView: mediaAttributes =>
                  h.div(
                    [...mediaAttributes.media],
                    [
                      h.img([
                        h.Src(entry.src ?? '#'),
                        h.Alt(entry.alt ?? entry.name),
                      ]),
                    ],
                  ),
              })
            : AttachmentMedia<never>({
                toView: mediaAttributes =>
                  h.div(
                    [...mediaAttributes.media],
                    [entry.icon === undefined ? fileCodeIcon() : entry.icon()],
                  ),
              }),
          AttachmentContent<never>({
            toView: contentAttributes =>
              h.div(
                [...contentAttributes.content],
                [
                  AttachmentTitle<never>({
                    toView: titleAttributes =>
                      h.span([...titleAttributes.title], [entry.name]),
                  }),
                  ...(entry.meta.length === 0
                    ? []
                    : [
                        AttachmentDescription<never>({
                          toView: descriptionAttributes =>
                            h.span(
                              [...descriptionAttributes.description],
                              [entry.meta],
                            ),
                        }),
                      ]),
                ],
              ),
          }),
          ...(config.actions ?? []),
          ...(config.trigger === undefined ? [] : [config.trigger]),
        ],
      ),
  })
}

export const AttachmentDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('mx-auto flex w-full max-w-sm flex-col gap-3 py-12')],
    [
      AttachmentGroup<never>({
        children: imageEntries.map(entry =>
          attachmentCard(entry, {
            orientation: 'vertical',
          }),
        ),
      }),
      attachmentCard(
        {
          name: 'sales-dashboard.pdf',
          meta: 'Uploading · 64%',
          icon: spinnerIcon,
        },
        {
          state: 'uploading',
          className: 'w-full',
          actions: [
            AttachmentActions<never>({
              toView: actionsAttributes =>
                h.div(
                  [...actionsAttributes.actions],
                  [
                    AttachmentAction<never>({
                      attributes: [h.AriaLabel('Cancel upload')],
                      children: [xIcon()],
                    }),
                  ],
                ),
            }),
          ],
        },
      ),
      attachmentCard(
        {
          name: 'message-renderer.tsx',
          meta: 'TypeScript · 12 KB',
          icon: fileCodeIcon,
        },
        {
          className: 'w-full',
          actions: [
            AttachmentActions<never>({
              toView: actionsAttributes =>
                h.div(
                  [...actionsAttributes.actions],
                  [
                    AttachmentAction<never>({
                      attributes: [h.AriaLabel('Remove message-renderer.tsx')],
                      children: [xIcon()],
                    }),
                  ],
                ),
            }),
          ],
        },
      ),
    ],
  )
}

export const AttachmentGroupDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('mx-auto w-full max-w-sm py-12')],
    [
      AttachmentGroup<never>({
        className: 'w-full',
        children: groupEntries.map(entry =>
          attachmentCard(entry, {
            className: 'w-64',
            actions: [
              AttachmentActions<never>({
                toView: actionsAttributes =>
                  h.div(
                    [...actionsAttributes.actions],
                    [
                      AttachmentAction<never>({
                        attributes: [h.AriaLabel(`Remove ${entry.name}`)],
                        children: [xIcon()],
                      }),
                    ],
                  ),
              }),
            ],
          }),
        ),
      }),
    ],
  )
}

export const AttachmentImage = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('mx-auto w-full max-w-sm py-12')],
    [
      AttachmentGroup<never>({
        className: 'w-full',
        children: imageEntries.map(entry =>
          attachmentCard(entry, {
            orientation: 'vertical',
            actions: [
              AttachmentActions<never>({
                toView: actionsAttributes =>
                  h.div(
                    [...actionsAttributes.actions],
                    [
                      AttachmentAction<never>({
                        attributes: [h.AriaLabel(`Remove ${entry.name}`)],
                        children: [xIcon()],
                      }),
                    ],
                  ),
              }),
            ],
            trigger: AttachmentTrigger<never>({
              attributes: [h.AriaLabel(`Open ${entry.name}`)],
              toView: triggerAttributes =>
                h.a(
                  [
                    ...triggerAttributes.trigger,
                    h.Href(entry.src ?? '#'),
                    h.Target('_blank'),
                    h.Rel('noreferrer'),
                  ],
                  [],
                ),
            }),
          }),
        ),
      }),
    ],
  )
}

export const AttachmentSizes = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('mx-auto flex w-full max-w-sm flex-col gap-3 py-12')],
    [
      attachmentCard(
        {
          name: 'Default attachment',
          meta: 'PDF · 2.4 MB',
          icon: fileTextIcon,
        },
        { className: 'w-full' },
      ),
      attachmentCard(
        {
          name: 'Small attachment',
          meta: 'PDF · 2.4 MB',
          icon: fileTextIcon,
        },
        { size: 'sm', className: 'w-full' },
      ),
      attachmentCard(
        {
          name: 'Extra small attachment',
          meta: '',
          icon: fileTextIcon,
        },
        { size: 'xs', className: 'w-full' },
      ),
    ],
  )
}

export const AttachmentStates = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('mx-auto flex w-full max-w-sm flex-col gap-2 py-12')],
    [
      attachmentCard(
        {
          name: 'selected-file.pdf',
          meta: 'Ready to upload',
          icon: clockIcon,
        },
        {
          state: 'idle',
          className: 'w-full',
          actions: [
            AttachmentActions<never>({
              toView: actionsAttributes =>
                h.div(
                  [...actionsAttributes.actions],
                  [
                    AttachmentAction<never>({
                      attributes: [h.AriaLabel('Remove selected-file.pdf')],
                      children: [xIcon()],
                    }),
                  ],
                ),
            }),
          ],
        },
      ),
      attachmentCard(
        {
          name: 'design-system.zip',
          meta: 'Uploading · 64%',
          icon: spinnerIcon,
        },
        {
          state: 'uploading',
          className: 'w-full',
          actions: [
            AttachmentActions<never>({
              toView: actionsAttributes =>
                h.div(
                  [...actionsAttributes.actions],
                  [
                    AttachmentAction<never>({
                      attributes: [h.AriaLabel('Cancel upload')],
                      children: [xIcon()],
                    }),
                  ],
                ),
            }),
          ],
        },
      ),
      attachmentCard(
        {
          name: 'market-research.pdf',
          meta: 'Processing document',
          icon: fileTextIcon,
        },
        {
          state: 'processing',
          className: 'w-full',
          actions: [
            AttachmentActions<never>({
              toView: actionsAttributes =>
                h.div(
                  [...actionsAttributes.actions],
                  [
                    AttachmentAction<never>({
                      attributes: [h.AriaLabel('Remove market-research.pdf')],
                      children: [xIcon()],
                    }),
                  ],
                ),
            }),
          ],
        },
      ),
      attachmentCard(
        {
          name: 'financial-model.xlsx',
          meta: 'Upload failed. Try again.',
          icon: fileWarningIcon,
        },
        {
          state: 'error',
          className: 'w-full',
          actions: [
            AttachmentActions<never>({
              toView: actionsAttributes =>
                h.div(
                  [...actionsAttributes.actions],
                  [
                    AttachmentAction<never>({
                      attributes: [h.AriaLabel('Retry upload')],
                      children: [refreshIcon()],
                    }),
                    AttachmentAction<never>({
                      attributes: [h.AriaLabel('Remove financial-model.xlsx')],
                      children: [xIcon()],
                    }),
                  ],
                ),
            }),
          ],
        },
      ),
      attachmentCard(
        {
          name: 'uploaded-report.pdf',
          meta: 'Uploaded · 1.8 MB',
          icon: checkIcon,
        },
        {
          state: 'done',
          className: 'w-full',
          actions: [
            AttachmentActions<never>({
              toView: actionsAttributes =>
                h.div(
                  [...actionsAttributes.actions],
                  [
                    AttachmentAction<never>({
                      attributes: [h.AriaLabel('Remove uploaded-report.pdf')],
                      children: [xIcon()],
                    }),
                  ],
                ),
            }),
          ],
        },
      ),
    ],
  )
}

export const AttachmentTriggerDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('mx-auto w-full max-w-sm py-12')],
    [
      attachmentCard(
        {
          name: 'research-summary.pdf',
          meta: 'Open preview dialog',
          icon: fileSearchIcon,
        },
        {
          className: 'w-full',
          actions: [
            AttachmentActions<never>({
              toView: actionsAttributes =>
                h.div(
                  [...actionsAttributes.actions],
                  [
                    AttachmentAction<never>({
                      attributes: [h.AriaLabel('Copy link')],
                      children: [copyIcon()],
                    }),
                    AttachmentAction<never>({
                      attributes: [h.AriaLabel('Remove research-summary.pdf')],
                      children: [xIcon()],
                    }),
                  ],
                ),
            }),
          ],
          trigger: AttachmentTrigger<never>({
            attributes: [h.AriaLabel('Preview research-summary.pdf')],
            toView: triggerAttributes =>
              h.button(
                [
                  ...withoutSlotAttributes(triggerAttributes.trigger),
                  h.AriaExpanded(false),
                  h.AriaHasPopup('dialog'),
                  h.DataAttribute('base-ui-click-trigger', ''),
                  h.DataAttribute('slot', 'dialog-trigger'),
                  h.Tabindex(0),
                  h.Type('button'),
                ],
                [],
              ),
          }),
        },
      ),
    ],
  )
}
