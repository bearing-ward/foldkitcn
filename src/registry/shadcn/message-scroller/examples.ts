import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { Bubble, BubbleContent } from '../bubble'
import { view as Button } from '../button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../empty'
import { InputGroup, InputGroupAddon, InputGroupButton } from '../input-group'
import { Marker, MarkerContent } from '../marker'
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from '../message'
import type { MessageScrollerState } from './index'
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerViewport,
  shouldShowScrollButton,
} from './index'

type Child = Html | string

type TranscriptMessage = Readonly<{
  id: string
  role: 'user' | 'assistant'
  author: string
  body: string
  time: string
  scrollAnchor?: boolean
}>

const messages: ReadonlyArray<TranscriptMessage> = [
  {
    id: 'msg-001',
    role: 'user',
    author: 'You',
    body: 'The chat viewport should stay pinned while the assistant streams.',
    time: '9:41 AM',
    scrollAnchor: true,
  },
  {
    id: 'msg-002',
    role: 'assistant',
    author: 'Foldkit CN',
    body: 'Use a model field for pinned state, append messages through update, and return an explicit scroll command only when the viewport is already pinned.',
    time: '9:41 AM',
  },
  {
    id: 'msg-003',
    role: 'user',
    author: 'You',
    body: 'What happens when the reader scrolls up?',
    time: '9:42 AM',
    scrollAnchor: true,
  },
  {
    id: 'msg-004',
    role: 'assistant',
    author: 'Foldkit CN',
    body: 'New content can land below without moving their place. The scroll button becomes active and clears the unread marker when selected.',
    time: '9:42 AM',
  },
]

const shell = (children: ReadonlyArray<Child>): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('mx-auto flex w-full max-w-sm flex-col gap-4')],
    children,
  )
}

const scrollerCard = (title: string, children: ReadonlyArray<Child>): Html =>
  Card<never>({
    className: 'h-140 gap-0 overflow-hidden',
    children: [
      CardHeader<never>({
        className: 'gap-1 border-b',
        children: [
          CardTitle<never>({ children: [title] }),
          CardDescription<never>({
            children: ['Deterministic Foldkit message-scroller fixture.'],
          }),
        ],
      }),
      CardContent<never>({
        className: 'relative min-h-0 flex-1 overflow-hidden p-0',
        children,
      }),
    ],
  })

const renderMessage = (item: TranscriptMessage): Html =>
  Message<never>({
    align: item.role === 'user' ? 'end' : 'start',
    role: item.role,
    children: [
      MessageContent<never>({
        children: [
          MessageHeader<never>({ children: [item.author] }),
          Bubble<never>({
            align: item.role === 'user' ? 'end' : 'start',
            variant: item.role === 'user' ? 'default' : 'secondary',
            children: [BubbleContent<never>({ children: [item.body] })],
          }),
          MessageFooter<never>({ children: [item.time] }),
        ],
      }),
    ],
  })

const renderTranscript = (
  state: MessageScrollerState,
  items: ReadonlyArray<TranscriptMessage>,
): Html => {
  const h = html<never>()

  return MessageScroller<never>({
    children: [
      MessageScrollerViewport<never>({
        attributes: [h.AriaLabel('Conversation messages')],
        children: [
          MessageScrollerContent<never>({
            className: 'p-(--card-spacing)',
            children: [
              h.div([h.Id(`${state.id}-start-anchor`)], []),
              ...items.map(message =>
                MessageScrollerItem<never>({
                  scrollAnchor: message.scrollAnchor,
                  attributes: [h.Id(message.id)],
                  children: [renderMessage(message)],
                }),
              ),
              h.div([h.Id(`${state.id}-end-anchor`)], []),
            ],
          }),
        ],
      }),
      MessageScrollerButton<never>({
        isActive: shouldShowScrollButton(state),
        ariaLabel:
          state.hasUnreadMessages === true
            ? 'Scroll to new messages'
            : 'Scroll to end',
      }),
    ],
  })
}

const hMessagePreview = (text: string): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('h-14 w-full px-3 py-2.5')],
    [h.span([h.Class('line-clamp-2 text-sm opacity-80')], [text])],
  )
}

const arrowUpIcon = (): Html => {
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
    ],
    [h.path([h.D('M12 19V5')], []), h.path([h.D('m5 12 7-7 7 7')], [])],
  )
}

const messageCircleIcon = (): Html => {
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
    ],
    [
      h.path(
        [h.D('M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z')],
        [],
      ),
    ],
  )
}

export const MessageScrollerDemo = (): Html =>
  shell([
    scrollerCard('New Chat', [
      renderTranscript(
        {
          id: 'message-scroller-demo',
          isPinnedToEnd: true,
          hasUnreadMessages: false,
          messageCount: messages.length,
          lastScrollDirection: 'end',
        },
        messages,
      ),
    ]),
    InputGroup<never>({
      children: [
        hMessagePreview('Ask about scroll anchoring'),
        InputGroupAddon<never>({
          align: 'block-end',
          children: [
            InputGroupButton<never>({
              ariaLabel: 'Send message',
              children: [arrowUpIcon()],
            }),
          ],
        }),
      ],
    }),
  ])

export const MessageScrollerScrollable = (): Html =>
  shell([
    scrollerCard('Scrollable Thread', [
      renderTranscript(
        {
          id: 'message-scroller-scrollable',
          isPinnedToEnd: false,
          hasUnreadMessages: true,
          messageCount: messages.length + 1,
          lastScrollDirection: 'start',
        },
        [
          ...messages,
          {
            id: 'msg-005',
            role: 'assistant',
            author: 'Foldkit CN',
            body: 'One new response is waiting below your current reading position.',
            time: '9:43 AM',
          },
        ],
      ),
      Marker<never>({
        className:
          'absolute bottom-16 left-1/2 w-fit -translate-x-1/2 rounded-full bg-background px-3 py-1 shadow-sm',
        attributes: [html<never>().Role('status')],
        children: [MarkerContent<never>({ children: ['1 new message'] })],
      }),
    ]),
  ])

export const MessageScrollerLoadHistory = (): Html =>
  shell([
    scrollerCard('Previous Context', [
      MessageScroller<never>({
        children: [
          MessageScrollerViewport<never>({
            children: [
              MessageScrollerContent<never>({
                className: 'p-(--card-spacing)',
                children: [
                  MessageScrollerItem<never>({
                    children: [
                      Button<never>({
                        variant: 'outline',
                        size: 'sm',
                        toView: attributes =>
                          html<never>().button(
                            [...attributes.button],
                            ['Load earlier messages'],
                          ),
                      }),
                    ],
                  }),
                  ...messages.slice(1).map(message =>
                    MessageScrollerItem<never>({
                      scrollAnchor: message.scrollAnchor,
                      children: [renderMessage(message)],
                    }),
                  ),
                ],
              }),
            ],
          }),
          MessageScrollerButton<never>({
            direction: 'start',
            isActive: true,
            ariaLabel: 'Scroll to earlier messages',
          }),
        ],
      }),
    ]),
  ])

export const MessageScrollerOpeningPosition = (): Html =>
  shell([
    scrollerCard('Opening Position', [
      renderTranscript(
        {
          id: 'message-scroller-opening',
          isPinnedToEnd: true,
          hasUnreadMessages: false,
          messageCount: 2,
          lastScrollDirection: 'end',
        },
        messages.slice(2),
      ),
    ]),
  ])

export const MessageScrollerEmpty = (): Html =>
  shell([
    scrollerCard('Empty Conversation', [
      Empty<never>({
        className: 'h-full border-0',
        children: [
          EmptyHeader<never>({
            children: [
              EmptyMedia<never>({
                variant: 'icon',
                children: [messageCircleIcon()],
              }),
              EmptyTitle<never>({ children: ['Morning, shadcn!'] }),
              EmptyDescription<never>({
                children: [
                  'What are we working on today? Press send to start a new conversation.',
                ],
              }),
            ],
          }),
        ],
      }),
    ]),
  ])
