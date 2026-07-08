import { Schema as S } from 'effect'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'

import type { ToastState } from '../../base-ui/toast'
import { view as Collapsible } from '../collapsible'
import { view as Popover } from '../popover'
import { renderSonnerDemoToaster } from '../sonner/examples'
import { view as Tooltip } from '../tooltip'
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from './index'

export const ClickedBubbleReply = m('ClickedBubbleReply', { reply: S.String })

export const BubbleExampleMessage = S.Union([ClickedBubbleReply])
export type BubbleExampleMessage = typeof BubbleExampleMessage.Type

export type BubbleExampleController<Message> = Readonly<{
  openFor?: (controlId: string, defaultOpen: boolean) => boolean
  onOpenChange?: (
    controlId: string,
    change: Readonly<{ open: boolean }>,
  ) => Message
  toastState?: ToastState
  onBubbleMessage?: (message: BubbleExampleMessage) => Message
}>

const isOpenFor = <Message>(
  controller: BubbleExampleController<Message> | undefined,
  controlId: string,
  defaultOpen: boolean,
): boolean => controller?.openFor?.(controlId, defaultOpen) ?? defaultOpen

const bubbleStackWithClass = (
  className: string,
  children: ReadonlyArray<Html>,
): Html => {
  const h = html<never>()

  return h.div([h.Class(className)], children)
}

const bubbleStack = (children: ReadonlyArray<Html>): Html =>
  bubbleStackWithClass('flex w-full max-w-sm flex-col gap-8 py-12', children)

const roomyBubbleStack = (children: ReadonlyArray<Html>): Html =>
  bubbleStackWithClass('flex w-full max-w-sm flex-col gap-12 py-12', children)

const compactBubbleStack = (children: ReadonlyArray<Html>): Html =>
  bubbleStackWithClass('flex w-full max-w-sm flex-col gap-4 py-12', children)

const reaction = (label: string): Html => {
  const h = html<never>()

  return h.span([], [label])
}

const reactions = (labels: ReadonlyArray<string>): ReadonlyArray<Html> =>
  labels.map(reaction)

const bareReaction = (label: string, ariaLabel: string): Html => {
  const h = html<never>()

  return h.div(
    [
      h.DataAttribute('slot', 'bubble-reactions'),
      h.Role('img'),
      h.AriaLabel(ariaLabel),
    ],
    [reaction(label)],
  )
}

const bareReactions = (children: ReadonlyArray<Html>): Html => {
  const h = html<never>()

  return h.div([h.DataAttribute('slot', 'bubble-reactions')], children)
}

const markdownBlock = (lead: string): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('space-y-4')],
    [
      h.p([], [lead]),
      h.p(
        [],
        [
          'This is perfect for assistant messages that should not have a frame and can take the full width of the container. You can also render ',
          h.code([h.Class('rounded bg-muted px-1 py-0.5 text-xs')], ['code']),
          ' in it.',
        ],
      ),
      h.p(
        [],
        [
          'Ghost bubbles are full width and can take the full width of the container.',
        ],
      ),
    ],
  )
}

const button = (label: string, ariaLabel?: string): Html => {
  const h = html<never>()

  return h.button(
    [
      h.DataAttribute('slot', 'button'),
      h.Tabindex(0),
      h.Type('button'),
      h.Class(
        "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
      ),
      ...(ariaLabel === undefined ? [] : [h.AriaLabel(ariaLabel)]),
    ],
    [label],
  )
}

const bubbleContentButton = <Message>(
  label: string,
  controller?: BubbleExampleController<Message>,
): Html => {
  const h = html<Message>()

  return BubbleContent<Message>({
    toView: attributes =>
      h.button(
        [
          ...attributes.content,
          ...(controller?.onBubbleMessage === undefined
            ? []
            : [
                h.OnClick(
                  controller.onBubbleMessage(
                    ClickedBubbleReply({ reply: label }),
                  ),
                ),
              ]),
        ],
        [label],
      ),
  })
}

export const BubbleDemo = (): Html =>
  bubbleStack([
    Bubble<never>({
      align: 'end',
      children: [BubbleContent<never>({ children: ["Hey there! what's up?"] })],
    }),
    BubbleGroup<never>({
      children: [
        Bubble<never>({
          variant: 'muted',
          children: [
            BubbleContent<never>({
              children: ['Hey! Want to see chat bubbles?'],
            }),
          ],
        }),
        Bubble<never>({
          variant: 'muted',
          children: [
            BubbleContent<never>({
              children: [
                'I can group messages, switch sides, and keep the whole thread easy to scan.',
              ],
            }),
            BubbleReactions<never>({
              attributes: [
                html<never>().Role('img'),
                html<never>().AriaLabel('Reaction: thumbs up'),
              ],
              children: reactions(['👍']),
            }),
          ],
        }),
      ],
    }),
    Bubble<never>({
      align: 'end',
      children: [
        BubbleContent<never>({
          children: ['Sure. Hit me with your best demo.'],
        }),
      ],
    }),
    Bubble<never>({
      variant: 'muted',
      children: [
        BubbleContent<never>({
          children: [
            'Yes. You are reading a demo that is demoing itself. Very meta. Very on-brand.',
          ],
        }),
        BubbleReactions<never>({
          attributes: [
            html<never>().Role('img'),
            html<never>().AriaLabel(
              'Reactions: thumbs up, fire, eyes, and 2 more',
            ),
          ],
          children: reactions(['👍', '🔥', '👀', '+2']),
        }),
      ],
    }),
  ])

export const BubbleGroupDemo = (): Html =>
  bubbleStack([
    Bubble<never>({
      variant: 'muted',
      children: [
        BubbleContent<never>({
          children: ["Can you tell me what's the issue?"],
        }),
      ],
    }),
    BubbleGroup<never>({
      children: [
        Bubble<never>({
          align: 'end',
          children: [BubbleContent<never>({ children: ['You tell me!'] })],
        }),
        Bubble<never>({
          align: 'end',
          children: [
            BubbleContent<never>({
              children: ['It worked yesterday. You broke it!'],
            }),
          ],
        }),
        Bubble<never>({
          align: 'end',
          children: [
            BubbleContent<never>({ children: ['Find the bug and fix it.'] }),
            BubbleReactions<never>({
              align: 'start',
              attributes: [html<never>().AriaLabel('Reactions: eyes')],
              children: reactions(['👀']),
            }),
          ],
        }),
      ],
    }),
    Bubble<never>({
      variant: 'muted',
      children: [
        BubbleContent<never>({
          children: [
            "Want me to diff yesterday's you against today's you? It's a bit embarrassing.",
          ],
        }),
      ],
    }),
  ])

export const BubbleVariantsDemo = (): Html =>
  roomyBubbleStack([
    Bubble<never>({
      children: [
        BubbleContent<never>({
          children: ['This is the default primary bubble.'],
        }),
      ],
    }),
    Bubble<never>({
      variant: 'secondary',
      align: 'end',
      children: [
        BubbleContent<never>({ children: ['This is the secondary variant.'] }),
      ],
    }),
    Bubble<never>({
      variant: 'muted',
      children: [
        BubbleContent<never>({
          children: [
            'This one is muted. It uses a lower emphasis color for the chat bubble.',
          ],
        }),
        bareReaction('👍', 'Reaction: thumbs up'),
      ],
    }),
    Bubble<never>({
      variant: 'tinted',
      align: 'end',
      children: [
        BubbleContent<never>({
          children: [
            'This one is tinted. The tint is a softer color derived from the primary color.',
          ],
        }),
      ],
    }),
    Bubble<never>({
      variant: 'outline',
      children: [
        BubbleContent<never>({
          children: ['We can also use an outlined variant.'],
        }),
      ],
    }),
    Bubble<never>({
      variant: 'destructive',
      align: 'end',
      children: [
        BubbleContent<never>({
          children: ['Or a destructive variant with a reaction.'],
        }),
        bareReaction('🔥', 'Reaction: fire'),
      ],
    }),
    Bubble<never>({
      variant: 'ghost',
      children: [
        BubbleContent<never>({
          children: [
            markdownBlock(
              'Ghost bubbles work for assistant text, markdown, and other content that should not be framed.',
            ),
          ],
        }),
      ],
    }),
  ])

export const BubbleAlignmentDemo = (): Html =>
  bubbleStack([
    Bubble<never>({
      variant: 'muted',
      children: [
        BubbleContent<never>({
          children: [
            'This bubble is aligned to the start. This is the default alignment.',
          ],
        }),
      ],
    }),
    Bubble<never>({
      align: 'end',
      children: [
        BubbleContent<never>({
          children: [
            'This bubble is aligned to the end. Use this for user messages.',
          ],
        }),
      ],
    }),
  ])

export const BubbleLinkButtonDemo = <Message = never>(
  controller?: BubbleExampleController<Message>,
): Html =>
  bubbleStack([
    Bubble<Message>({
      variant: 'muted',
      children: [
        BubbleContent<Message>({ children: ['How can I help you today?'] }),
      ],
    }),
    BubbleGroup<Message>({
      children: [
        Bubble<Message>({
          variant: 'tinted',
          align: 'end',
          children: [bubbleContentButton('I forgot my password', controller)],
        }),
        Bubble<Message>({
          variant: 'tinted',
          align: 'end',
          children: [
            bubbleContentButton('I need help with my subscription', controller),
          ],
        }),
        Bubble<Message>({
          variant: 'tinted',
          align: 'end',
          children: [
            bubbleContentButton('Something else. Talk to a human.', controller),
          ],
        }),
      ],
    }),
    ...(controller === undefined
      ? []
      : [
          renderSonnerDemoToaster<Message>(
            controller.toastState === undefined
              ? {}
              : { state: controller.toastState },
          ),
        ]),
  ])

export const BubbleReactionsDemo = (): Html =>
  roomyBubbleStack([
    Bubble<never>({
      variant: 'muted',
      align: 'end',
      children: [
        BubbleContent<never>({
          children: ["I don't need tests, I know my code works."],
        }),
        BubbleReactions<never>({
          align: 'start',
          attributes: [
            html<never>().Role('img'),
            html<never>().AriaLabel('Reactions: thumbs up, surprised'),
          ],
          children: reactions(['👍', '😮']),
        }),
      ],
    }),
    Bubble<never>({
      variant: 'muted',
      children: [
        BubbleContent<never>({
          children: [
            "Bold. Fine I'll add some tests. I'll let you know when they're done.",
          ],
        }),
        BubbleReactions<never>({
          attributes: [
            html<never>().Role('img'),
            html<never>().AriaLabel('Reactions: eyes, rocket, and 2 more'),
          ],
          children: reactions(['👀', '🚀', '+2']),
        }),
      ],
    }),
    Bubble<never>({
      variant: 'default',
      align: 'end',
      children: [
        BubbleContent<never>({
          children: [
            'Tests passed on the first try. All 142 of them. Looking good!',
          ],
        }),
        BubbleReactions<never>({
          side: 'top',
          align: 'start',
          attributes: [
            html<never>().Role('img'),
            html<never>().AriaLabel('Reactions: party popper, clapping hands'),
          ],
          children: reactions(['🎉', '👏']),
        }),
      ],
    }),
    Bubble<never>({
      variant: 'destructive',
      children: [
        BubbleContent<never>({
          children: ['Are you sure I can run this command?'],
        }),
        BubbleReactions<never>({
          children: [button('Yes, run it')],
        }),
      ],
    }),
  ])

export const BubbleCollapsibleDemo = <Message = never>(
  controller?: BubbleExampleController<Message>,
): Html => {
  const h = html<Message>()
  const controlId = 'bubble-collapsible'
  const onOpenChange = controller?.onOpenChange
  const open = isOpenFor(controller, controlId, false)
  const preview =
    'The accessibility review found two focus states that were visually too subtle in dark mode.\n\nI checked the dialog, menu, and drawer paths because each one renders focusable controls inside a layered surface.\n\nThe dialog and drawer are fine. The menu needs the hover and focus tokens split so keyboard focus stays visible when the pointer is not involved.'
  const summary =
    'The accessibility review found two focus states that were visually too subtle in dark mode.'

  if (controller === undefined) {
    return bubbleStack([
      Bubble<Message>({
        variant: 'muted',
        children: [
          BubbleContent<Message>({ children: ['How can I help you today?'] }),
        ],
      }),
      Bubble<Message>({
        variant: 'muted',
        align: 'end',
        children: [
          BubbleContent<Message>({
            className: 'whitespace-pre-line',
            attributes: [
              h.Id(controlId),
              h.DataAttribute('closed', ''),
              h.DataAttribute('slot', 'collapsible'),
            ],
            children: [
              h.p([], [summary]),
              h.button(
                [
                  h.AriaExpanded(false),
                  h.Type('button'),
                  h.DataAttribute('slot', 'collapsible-trigger'),
                  h.Class(
                    'mt-2 inline-flex items-center gap-1 p-0 text-muted-foreground',
                  ),
                ],
                ['Show more'],
              ),
            ],
          }),
        ],
      }),
    ])
  }

  return bubbleStack([
    Bubble<Message>({
      variant: 'muted',
      children: [
        BubbleContent<Message>({ children: ['How can I help you today?'] }),
      ],
    }),
    Bubble<Message>({
      variant: 'muted',
      align: 'end',
      children: [
        BubbleContent<Message>({
          className: 'whitespace-pre-line',
          toView: attributes =>
            Collapsible<Message>({
              id: controlId,
              open,
              panel: { id: `${controlId}-panel`, label: 'Expanded reply' },
              ...(onOpenChange === undefined
                ? {}
                : {
                    onOpenChange: change => onOpenChange(controlId, change),
                  }),
              toView: collapsible =>
                h.div(
                  [...attributes.content, ...collapsible.root],
                  [
                    h.p([], [summary]),
                    collapsible.panel.isMounted
                      ? h.div(
                          [
                            ...collapsible.panel.root,
                            h.Attribute(
                              'style',
                              '--collapsible-panel-height: auto; --collapsible-panel-width: auto; animation-name: none;',
                            ),
                          ],
                          [h.p([h.Class('mt-3')], [preview])],
                        )
                      : h.empty,
                    h.button(
                      [
                        ...collapsible.trigger,
                        h.Type('button'),
                        h.Class(
                          'mt-2 inline-flex items-center gap-1 p-0 text-muted-foreground',
                        ),
                      ],
                      [open ? 'Show less' : 'Show more'],
                    ),
                  ],
                ),
            }),
        }),
      ],
    }),
  ])
}

export const BubbleTooltipDemo = <Message = never>(
  controller?: BubbleExampleController<Message>,
): Html => {
  const h = html<Message>()
  const controlId = 'bubble-read-status-tooltip'
  const onOpenChange = controller?.onOpenChange

  if (controller === undefined) {
    return compactBubbleStack([
      Bubble<Message>({
        variant: 'secondary',
        children: [
          BubbleContent<Message>({
            children: ['Did you remove the stale route?'],
          }),
        ],
      }),
      Bubble<Message>({
        align: 'end',
        children: [
          BubbleContent<Message>({
            children: ['Yes, removed it from the registry.'],
          }),
          bareReactions([
            h.button(
              [
                h.Type('button'),
                h.AriaLabel('Read on Jan 5, 2026 at 4:32 PM'),
                h.Class(
                  'inline-flex size-7 items-center justify-center rounded-full bg-transparent',
                ),
              ],
              ['✓'],
            ),
          ]),
        ],
      }),
    ])
  }

  return compactBubbleStack([
    Bubble<Message>({
      variant: 'secondary',
      children: [
        BubbleContent<Message>({
          children: ['Did you remove the stale route?'],
        }),
      ],
    }),
    Bubble<Message>({
      align: 'end',
      children: [
        BubbleContent<Message>({
          children: ['Yes, removed it from the registry.'],
        }),
        bareReactions([
          Tooltip<Message>({
            id: controlId,
            open: isOpenFor(controller, controlId, false),
            instant: 'delay',
            side: 'top',
            ...(onOpenChange === undefined
              ? {}
              : { onOpenChange: change => onOpenChange(controlId, change) }),
            toView: attributes =>
              h.div(
                [...attributes.provider],
                [
                  h.div(
                    [...attributes.root],
                    [
                      h.button(
                        [
                          ...attributes.trigger,
                          h.Type('button'),
                          h.AriaLabel('Read on Jan 5, 2026 at 4:32 PM'),
                          h.Class(
                            'inline-flex size-7 items-center justify-center rounded-full bg-transparent',
                          ),
                        ],
                        ['✓'],
                      ),
                      h.div(
                        [...attributes.portal],
                        attributes.popup.isMounted
                          ? [
                              h.div(
                                [...attributes.positioner.root],
                                [
                                  h.div(
                                    [...attributes.popup.root],
                                    [
                                      h.div(
                                        [...attributes.viewport.root],
                                        ['Read on Jan 5, 2026 at 4:32 PM'],
                                      ),
                                      h.div([...attributes.arrow.root], []),
                                    ],
                                  ),
                                ],
                              ),
                            ]
                          : [],
                      ),
                    ],
                  ),
                ],
              ),
          }),
        ]),
      ],
    }),
  ])
}

export const BubblePopoverDemo = <Message = never>(
  controller?: BubbleExampleController<Message>,
): Html => {
  const h = html<Message>()
  const controlId = 'bubble-error-details-popover'
  const onOpenChange = controller?.onOpenChange

  if (controller === undefined) {
    return compactBubbleStack([
      Bubble<Message>({
        align: 'end',
        children: [
          BubbleContent<Message>({ children: ['Run the build script.'] }),
        ],
      }),
      Bubble<Message>({
        variant: 'destructive',
        children: [
          BubbleContent<Message>({ children: ['Failed to run the command.'] }),
          bareReactions([
            h.button(
              [
                h.Type('button'),
                h.AriaLabel('Show error details'),
                h.Class(
                  'inline-flex size-7 items-center justify-center rounded-full bg-transparent text-destructive',
                ),
              ],
              ['i'],
            ),
          ]),
        ],
      }),
    ])
  }

  return compactBubbleStack([
    Bubble<Message>({
      align: 'end',
      children: [
        BubbleContent<Message>({ children: ['Run the build script.'] }),
      ],
    }),
    Bubble<Message>({
      variant: 'destructive',
      children: [
        BubbleContent<Message>({ children: ['Failed to run the command.'] }),
        bareReactions([
          Popover<Message>({
            id: controlId,
            open: isOpenFor(controller, controlId, false),
            side: 'top',
            align: 'end',
            titleId: `${controlId}-title`,
            descriptionId: `${controlId}-description`,
            contentClassName: 'w-72',
            ...(onOpenChange === undefined
              ? {}
              : { onOpenChange: change => onOpenChange(controlId, change) }),
            toView: attributes =>
              h.div(
                [...attributes.root],
                [
                  h.button(
                    [
                      ...attributes.trigger,
                      h.Type('button'),
                      h.AriaLabel('Show error details'),
                      h.Class(
                        'inline-flex size-7 items-center justify-center rounded-full bg-transparent text-destructive',
                      ),
                    ],
                    ['i'],
                  ),
                  h.div(
                    [...attributes.portal],
                    attributes.popup.isMounted
                      ? [
                          h.div([...attributes.backdrop.root], []),
                          h.div(
                            [...attributes.positioner.root],
                            [
                              h.div(
                                [...attributes.popup.root],
                                [
                                  h.div(
                                    [...attributes.header],
                                    [
                                      h.h4(
                                        [...attributes.title],
                                        ['Command failed'],
                                      ),
                                      h.p(
                                        [...attributes.description],
                                        [
                                          'Exit code 1 while running the build script.',
                                        ],
                                      ),
                                    ],
                                  ),
                                  h.pre(
                                    [
                                      h.Class(
                                        'mt-3 overflow-auto rounded-md bg-muted p-2 text-xs text-muted-foreground',
                                      ),
                                    ],
                                    ['bun run build --filter docs'],
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ]
                      : [],
                  ),
                ],
              ),
          }),
        ]),
      ],
    }),
  ])
}

export const BubbleMarkdownDemo = (): Html =>
  bubbleStack([
    Bubble<never>({
      align: 'end',
      variant: 'muted',
      children: [
        BubbleContent<never>({
          children: ['Hello! Are you actually thinking?'],
        }),
      ],
    }),
    Bubble<never>({
      variant: 'ghost',
      children: [
        BubbleContent<never>({
          children: [
            markdownBlock(
              'Ghost bubbles work for assistant text, bold emphasis, and other content that should not be framed.',
            ),
          ],
        }),
      ],
    }),
  ])
