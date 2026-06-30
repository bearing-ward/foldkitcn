import { Option } from 'effect'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import type {
  ResizableMessage,
  ResizablePanelConfig,
  ResizableState,
} from './index'
import { resizableState, view as Resizable } from './index'

export type ResizableExampleMessageChange = Readonly<{
  groupId: string
  defaultState: ResizableState
  message: ResizableMessage
}>

export type ResizableExampleController<Message> = Readonly<{
  exampleId?: string
  stateFor?: (groupId: string) => Option.Option<ResizableState>
  onResizableMessage?: (change: ResizableExampleMessageChange) => Message
  externalPointerTracking?: boolean
}>

const label = (text: string, className = 'h-full'): Html => {
  const h = html<never>()

  return h.div(
    [h.Class(`flex ${className} items-center justify-center p-6`)],
    [h.span([h.Class('font-semibold')], [text])],
  )
}

const panel = <Message = never>(
  id: string,
  defaultSize: number,
  text: string,
  contentClassName?: string,
): ResizablePanelConfig<Message> => ({
  id,
  defaultSize,
  children: [label(text, contentClassName)],
})

const group = <Message = never>(config: {
  readonly groupId: string
  readonly orientation?: 'horizontal' | 'vertical'
  readonly dir?: 'ltr' | 'rtl'
  readonly className: string
  readonly panels: ReadonlyArray<ResizablePanelConfig<Message>>
  readonly controller?: ResizableExampleController<Message>
  readonly withHandle?: boolean
  readonly groupSizePx?: number
}): Html => {
  const h = html<Message>()
  const defaultState = resizableState({
    orientation: config.orientation,
    dir: config.dir,
    panels: config.panels,
  })
  const onResizableMessage = config.controller?.onResizableMessage
  const liveTrackingAttributes =
    config.controller?.exampleId === undefined
      ? []
      : [
          h.DataAttribute(
            'live-resizable-example-id',
            config.controller.exampleId,
          ),
          h.DataAttribute('live-resizable-group-id', config.groupId),
        ]

  return Resizable<Message>({
    state:
      config.controller?.stateFor === undefined
        ? defaultState
        : Option.getOrElse(
            config.controller.stateFor(config.groupId),
            () => defaultState,
          ),
    panels: config.panels,
    className: config.className,
    ...(config.groupSizePx === undefined
      ? {}
      : { groupSizePx: config.groupSizePx }),
    ...(liveTrackingAttributes.length === 0
      ? {}
      : { attributes: liveTrackingAttributes }),
    ...(onResizableMessage === undefined
      ? {}
      : {
          toMessage: message =>
            onResizableMessage({
              groupId: config.groupId,
              defaultState,
              message,
            }),
        }),
    ...(config.withHandle === undefined
      ? {}
      : { withHandle: config.withHandle }),
    ...(config.controller?.externalPointerTracking === true
      ? { pointerTracking: 'external' }
      : {}),
  })
}

export const ResizableDemo = <Message = never>(
  controller?: ResizableExampleController<Message>,
): Html => {
  const nestedPanels: ReadonlyArray<ResizablePanelConfig<Message>> = [
    panel<Message>('two', 25, 'Two'),
    panel<Message>('three', 75, 'Three'),
  ]

  return group<Message>({
    groupId: 'root',
    className: 'max-w-sm rounded-lg border',
    ...(controller === undefined ? {} : { controller }),
    withHandle: true,
    panels: [
      panel<Message>('one', 50, 'One', 'h-[200px]'),
      {
        id: 'nested',
        defaultSize: 50,
        children: [
          group<Message>({
            groupId: 'nested',
            orientation: 'vertical',
            className: '',
            groupSizePx: 200,
            panels: nestedPanels,
            ...(controller === undefined ? {} : { controller }),
            withHandle: true,
          }),
        ],
      },
    ],
  })
}

export const ResizableHandleDemo = <Message = never>(
  controller?: ResizableExampleController<Message>,
): Html =>
  group<Message>({
    groupId: 'root',
    className: 'min-h-[200px] max-w-sm rounded-lg border',
    ...(controller === undefined ? {} : { controller }),
    withHandle: true,
    panels: [
      panel<Message>('sidebar', 25, 'Sidebar'),
      panel<Message>('content', 75, 'Content'),
    ],
  })

export const ResizableVertical = <Message = never>(
  controller?: ResizableExampleController<Message>,
): Html =>
  group<Message>({
    groupId: 'root',
    orientation: 'vertical',
    className: 'min-h-[200px] max-w-sm rounded-lg border',
    groupSizePx: 200,
    ...(controller === undefined ? {} : { controller }),
    withHandle: true,
    panels: [
      panel<Message>('header', 25, 'Header'),
      panel<Message>('content', 75, 'Content'),
    ],
  })

export const ResizableRtl = <Message = never>(
  controller?: ResizableExampleController<Message>,
): Html => {
  const nestedPanels: ReadonlyArray<ResizablePanelConfig<Message>> = [
    panel<Message>('two', 25, 'اثنان'),
    panel<Message>('three', 75, 'ثلاثة'),
  ]

  return group<Message>({
    groupId: 'root',
    dir: 'rtl',
    className: 'max-w-sm rounded-lg border',
    ...(controller === undefined ? {} : { controller }),
    withHandle: true,
    panels: [
      panel<Message>('one', 50, 'واحد', 'h-[200px]'),
      {
        id: 'nested',
        defaultSize: 50,
        children: [
          group<Message>({
            groupId: 'nested',
            orientation: 'vertical',
            dir: 'rtl',
            className: '',
            groupSizePx: 200,
            panels: nestedPanels,
            ...(controller === undefined ? {} : { controller }),
            withHandle: true,
          }),
        ],
      },
    ],
  })
}
