import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import {
  Attachment,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from '../attachment'
import { view as Avatar } from '../avatar'
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from '../bubble'
import { Marker, MarkerContent } from '../marker'
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from './index'

type Child = Html | string

type Profile = Readonly<{
  src: string
  alt: string
  fallback: string
}>

const meProfile: Profile = {
  src: 'https://github.com/shadcn.png',
  alt: '@me',
  fallback: 'ME',
}

const registryProfile: Profile = {
  src: 'https://github.com/shadcn.png',
  alt: '@avatar',
  fallback: 'CN',
}

const rabbitProfile: Profile = {
  src: 'https://github.com/evilrabbit.png',
  alt: '@avatar',
  fallback: 'R',
}

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

const copyIcon = (): Html =>
  icon('lucide lucide-copy', ['M9 9h10v10H9z', 'M5 15V5a2 2 0 0 1 2-2h10'])

const thumbsUpIcon = (): Html =>
  icon('lucide lucide-thumbs-up', [
    'M7 10v12',
    'M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z',
  ])

const thumbsDownIcon = (): Html =>
  icon('lucide lucide-thumbs-down', [
    'M17 14V2',
    'M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z',
  ])

const refreshIcon = (): Html =>
  icon('lucide lucide-refresh-cw', [
    'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16',
    'M3 21v-5h5',
    'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8',
    'M16 8h5V3',
  ])

const fileTextIcon = (): Html =>
  icon('lucide lucide-file-text', [
    'M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z',
    'M14 2v5h5',
    'M9 13h6',
    'M9 17h6',
    'M9 9h2',
  ])

const downloadIcon = (): Html =>
  icon('lucide lucide-download', [
    'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
    'M7 10l5 5 5-5',
    'M12 15V3',
  ])

const stack = (children: ReadonlyArray<Html>, gap = 'gap-8'): Html => {
  const h = html<never>()

  return h.div(
    [h.Class(`flex w-full max-w-sm flex-col ${gap} py-12`)],
    children,
  )
}

const avatar = (profile: Profile): Html => {
  const h = html<never>()

  return Avatar<never>({
    imageLoadingStatus: 'error',
    image: {
      src: profile.src,
      alt: profile.alt,
    },
    toView: (attributes, state) =>
      h.span(
        [...attributes.root],
        [
          ...(state.shouldRenderImage ? [h.img([...attributes.image])] : []),
          ...(state.shouldRenderFallback
            ? [h.span([...attributes.fallback], [profile.fallback])]
            : []),
        ],
      ),
  })
}

const iconButton = (
  label: string,
  child: Html,
  size: 'icon' | 'icon-xs' | 'icon-sm' = 'icon',
): Html => {
  const h = html<never>()
  const classNameBySize: Readonly<Record<typeof size, string>> = {
    icon: "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 size-8",
    'icon-sm':
      "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 size-7",
    'icon-xs':
      "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 size-6 [&_svg:not([class*='size-'])]:size-3",
  }
  const className = classNameBySize[size]

  return h.button(
    [
      h.AriaLabel(label),
      h.Class(className),
      h.DataAttribute('slot', 'button'),
      h.Tabindex(0),
      h.Title(label),
      h.Type('button'),
    ],
    [child],
  )
}

const attachmentActionButton = (label: string, child: Html): Html => {
  const h = html<never>()

  return h.button(
    [
      h.AriaLabel(label),
      h.Class(
        "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground size-7",
      ),
      h.DataAttribute('slot', 'attachment-action'),
      h.Tabindex(0),
      h.Title(label),
      h.Type('button'),
    ],
    [child],
  )
}

const bubble = (children: ReadonlyArray<Child>, muted = false): Html =>
  Bubble<never>({
    variant: muted ? 'muted' : 'default',
    children: [BubbleContent<never>({ children })],
  })

export const MessageDemo = (): Html =>
  stack(
    [
      Message<never>({
        align: 'end',
        role: 'user',
        children: [
          MessageAvatar<never>({ children: [avatar(meProfile)] }),
          MessageContent<never>({
            children: [bubble(['Deploying to prod real quick.'])],
          }),
        ],
      }),
      Message<never>({
        children: [
          MessageAvatar<never>({ children: [avatar(rabbitProfile)] }),
          MessageContent<never>({
            children: [bubble(["It's 4:55 PM. On a Friday."], true)],
          }),
        ],
      }),
      Message<never>({
        align: 'end',
        role: 'user',
        children: [
          MessageAvatar<never>({ children: [avatar(meProfile)] }),
          MessageContent<never>({
            children: [
              bubble(["It's a one-line change."]),
              MessageFooter<never>({ children: ['Delivered'] }),
            ],
          }),
        ],
      }),
      Message<never>({
        children: [
          MessageAvatar<never>({ children: [avatar(rabbitProfile)] }),
          MessageContent<never>({
            children: [
              BubbleGroup<never>({
                children: [
                  bubble(["It's always a one-line change 😭."], true),
                  Bubble<never>({
                    variant: 'muted',
                    children: [
                      BubbleContent<never>({
                        children: ['Alright, let me take a look.'],
                      }),
                      BubbleReactions<never>({
                        attributes: [
                          html<never>().AriaLabel('Reactions: thumbs up'),
                        ],
                        children: [html<never>().span([], ['👍'])],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      Marker<never>({
        attributes: [html<never>().Role('status')],
        children: [
          MarkerContent<never>({
            className: 'shimmer',
            children: [
              html<never>().span(
                [html<never>().Class('font-medium')],
                ['Oliver'],
              ),
              ' is typing...',
            ],
          }),
        ],
      }),
    ],
    'gap-6',
  )

export const MessageGroupDemo = (): Html =>
  stack(
    [
      MessageGroup<never>({
        children: [
          Message<never>({
            children: [
              MessageAvatar<never>(),
              MessageContent<never>({
                children: [bubble(['I checked the registry addresses.'], true)],
              }),
            ],
          }),
          Message<never>({
            children: [
              MessageAvatar<never>({ children: [avatar(registryProfile)] }),
              MessageContent<never>({
                children: [
                  bubble(
                    [
                      'The component and example JSON now live under the UI registry.',
                    ],
                    true,
                  ),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
    'gap-6',
  )

export const MessageAvatarDemo = (): Html =>
  stack(
    [
      Message<never>({
        children: [
          MessageAvatar<never>({ children: [avatar(rabbitProfile)] }),
          MessageContent<never>({
            children: [
              bubble(
                ['The build failed during dependency installation.'],
                true,
              ),
            ],
          }),
        ],
      }),
      Message<never>({
        align: 'end',
        role: 'user',
        children: [
          MessageAvatar<never>({ children: [avatar(rabbitProfile)] }),
          MessageContent<never>({
            children: [bubble(['Can you share the exact error?'])],
          }),
        ],
      }),
      Message<never>({
        children: [
          MessageAvatar<never>({ children: [avatar(rabbitProfile)] }),
          MessageContent<never>({
            children: [
              BubbleGroup<never>({
                children: [
                  bubble(["Here's the error from the logs"], true),
                  bubble(
                    [
                      'Something went wrong with the build. The libraries are not installed correctly. Try running the build again.',
                    ],
                    true,
                  ),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
    'gap-6',
  )

export const MessageHeaderFooterDemo = (): Html =>
  stack([
    Message<never>({
      children: [
        MessageContent<never>({
          children: [
            MessageHeader<never>({ children: ['Olivia'] }),
            bubble(['I already checked the logs.'], true),
          ],
        }),
      ],
    }),
    Message<never>({
      align: 'end',
      role: 'user',
      children: [
        MessageContent<never>({
          children: [
            bubble([
              'Send the report to the team. Ping @shadcn if you need help.',
            ]),
            MessageFooter<never>({
              children: [
                html<never>().div(
                  [],
                  [
                    'Read ',
                    html<never>().span(
                      [html<never>().Class('font-normal')],
                      ['Yesterday'],
                    ),
                  ],
                ),
              ],
            }),
          ],
        }),
      ],
    }),
  ])

export const MessageActionsDemo = (): Html =>
  stack([
    Message<never>({
      children: [
        MessageContent<never>({
          children: [
            bubble(
              ['The install failure is coming from the workspace package.'],
              true,
            ),
            MessageFooter<never>({
              children: [
                iconButton('Copy', copyIcon()),
                iconButton('Like', thumbsUpIcon()),
                iconButton('Dislike', thumbsDownIcon()),
              ],
            }),
          ],
        }),
      ],
    }),
    Message<never>({
      align: 'end',
      role: 'user',
      children: [
        MessageContent<never>({
          children: [
            bubble(['Okay drop me a link. Taking a look...']),
            MessageFooter<never>({
              className: 'gap-2',
              children: [
                html<never>().span(
                  [html<never>().Class('font-normal text-destructive')],
                  ['Failed to send'],
                ),
                iconButton('Retry', refreshIcon(), 'icon-xs'),
              ],
            }),
          ],
        }),
      ],
    }),
  ])

export const MessageAttachmentDemo = (): Html =>
  stack([
    Message<never>({
      align: 'end',
      role: 'user',
      children: [
        MessageContent<never>({
          children: [
            Attachment<never>({
              orientation: 'vertical',
              children: [
                AttachmentMedia<never>({
                  variant: 'image',
                  children: [
                    html<never>().img([
                      html<never>().Src(
                        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80',
                      ),
                      html<never>().Alt('Workspace'),
                    ]),
                  ],
                }),
              ],
            }),
            bubble([
              "Here's the image. Can you add it to the PDF? Use it for the cover page.",
            ]),
          ],
        }),
      ],
    }),
    Message<never>({
      children: [
        MessageContent<never>({
          children: [
            bubble(
              ["Done. Here's the PDF with the image added as the cover page."],
              true,
            ),
            Attachment<never>({
              children: [
                AttachmentMedia<never>({ children: [fileTextIcon()] }),
                AttachmentContent<never>({
                  children: [
                    AttachmentTitle<never>({
                      children: ['sales-dashboard.pdf'],
                    }),
                    AttachmentDescription<never>({
                      children: ['PDF · 2.4 MB'],
                    }),
                  ],
                }),
                AttachmentActions<never>({
                  children: [
                    attachmentActionButton('Download', downloadIcon()),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    Message<never>({
      align: 'end',
      role: 'user',
      children: [
        MessageContent<never>({
          children: [bubble(['Thanks. Looks good.'])],
        }),
      ],
    }),
  ])

export const MessageMarkdownDemo = (): Html => {
  const h = html<never>()

  return stack([
    Message<never>({
      align: 'end',
      role: 'user',
      children: [
        MessageContent<never>({
          children: [bubble(['How do I render markdown in a message?'])],
        }),
      ],
    }),
    Message<never>({
      children: [
        MessageContent<never>({
          children: [
            Bubble<never>({
              variant: 'ghost',
              children: [
                BubbleContent<never>({
                  children: [
                    h.div(
                      [h.Class('space-y-4')],
                      [
                        h.p(
                          [],
                          ["Here's how to render markdown in a message:"],
                        ),
                        h.ol(
                          [h.Class('list-decimal space-y-1 pl-5')],
                          [
                            h.li(
                              [],
                              [
                                'Render assistant text through ',
                                h.strong([], ['Markdown']),
                                '.',
                              ],
                            ),
                            h.li([], ['Keep user messages as plain text.']),
                            h.li(
                              [],
                              [
                                'Use a ',
                                h.code([], ['ghost']),
                                ' bubble so the response is unframed.',
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ])
}
